import os
import bcrypt
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
from contextlib import asynccontextmanager
import asyncpg
from dotenv import load_dotenv


load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.pool = await asyncpg.create_pool(
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        database=os.getenv("DB_NAME")
    )
    yield
    await app.state.pool.close()

app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RegisterInput(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str

class LoginInput(BaseModel):
    email: str
    password: str

class TodoCreate(BaseModel):
    text: str
    category: Optional[str] = None
    priority: Optional[str] = None

class TodoUpdate(BaseModel):
    completed: bool



@app.get("/test")
async def test_route():
    return {"message": "Bağlantı Başarılı!"}




# 1. KAYIT OL 
@app.post("/api/register", status_code=201)
async def register(data: RegisterInput):
    try:
        salt = bcrypt.gensalt(10)
        hashed_password = bcrypt.hashpw(data.password.encode('utf-8'), salt).decode('utf-8')

        async with app.state.pool.acquire() as connection:
            row = await connection.fetchrow(
                """INSERT INTO users (first_name, last_name, email, password_hash) 
                   VALUES($1, $2, $3, $4) RETURNING id, email, first_name""",
                data.firstName, data.lastName, data.email, hashed_password
            )
            return {"message": "Kullanıcı oluşturuldu!", "user": dict(row)}
            
    except Exception as e:
        print("Kayıt Hatası:", str(e))
        raise HTTPException(status_code=500, detail="E-posta zaten kayıtlı veya sunucu hatası.")


# 2. GİRİŞ YAP (Login)
@app.post("/api/login")
async def login(data: LoginInput):
    async with app.state.pool.acquire() as connection:
        row = await connection.fetchrow("SELECT * FROM users WHERE email = $1", data.email)
        
        if not row:
            raise HTTPException(status_code=401, detail="E-posta veya şifre hatalı!")
        
        user = dict(row)
        
        
        is_valid = bcrypt.checkpw(data.password.encode('utf-8'), user['password_hash'].encode('utf-8'))
        if not is_valid:
            raise HTTPException(status_code=401, detail="E-posta veya şifre hatalı!")
        
        return {
            "message": "Giriş başarılı!",
            "user": {
                "id": user['id'],
                "firstName": user['first_name'],
                "email": user['email']
            }
        }




@app.get("/todos")
async def get_todos():
    async with app.state.pool.acquire() as connection:
        rows = await connection.fetch("SELECT * FROM todos ORDER BY id DESC")
        return [dict(row) for row in rows]



@app.post("/todos")
async def create_todo(data: TodoCreate):
    try:
        async with app.state.pool.acquire() as connection:
            row = await connection.fetchrow(
                """INSERT INTO todos (text, category, priority, completed) 
                   VALUES($1, $2, $3, $4) RETURNING *""",
                data.text, data.category, data.priority, False
            )
            return dict(row)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.put("/todos/{todo_id}")
async def update_todo(todo_id: int, data: TodoUpdate):
    async with app.state.pool.acquire() as connection:
        await connection.execute("UPDATE todos SET completed = $1 WHERE id = $2", data.completed, todo_id)
        return "Güncellendi"



@app.delete("/todos/{todo_id}")
async def delete_todo(todo_id: int):
    async with app.state.pool.acquire() as connection:
        await connection.execute("DELETE FROM todos WHERE id = $1", todo_id)
        return "Silindi"