import socketio

# Socket.io sunucusunu başlatıyoruz ve CORS izinlerini (React için) veriyoruz
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
# FastAPI ile birleştirebilmek için ASGI uygulamasına sarmalıyoruz
sio_app = socketio.ASGIApp(sio)

# Aktif odaları ve içindeki kullanıcıları bellekte tutacak basit bir yapı
# (Gerçek projede jüriye 'bellek yönetimi için sözlük kullandım' demek büyük artı sağlar)
active_rooms = {}

@sio.event
async def connect(sid, environ):
    print(f"🔌 Yeni bir öğrenci bağlandı: {sid}")

@sio.event
async def join_room(sid, data):
    """Öğrenci bir kampüs odasına (Örn: 'Kütüphane', 'Mühendislik Kantini') girdiğinde tetiklenir."""
    room = data.get("room", "Genel Oda")
    username = data.get("username", "Anonim Öğrenci")
    
    # Socket.io odasına dahil et
    await sio.enter_room(sid, room)
    
    if room not in active_rooms:
        active_rooms[room] = []
    
    # Kullanıcıyı odaya ekle
    active_rooms[room].append({"sid": sid, "username": username})
    
    # Odadaki diğer herkese "X kişisi odaya katıldı" bildirimi gönder
    await sio.emit("notification", {"message": f"🔔 {username} odaya katıldı!"}, room=room, skip_sid=sid)
    # Güncel üye listesini odaya gönder
    await sio.emit("room_users", {"users": [u["username"] for u in active_rooms[room]]}, room=room)
    print(f"👤 {username}, {room} odasına giriş yaptı.")

@sio.event
async def send_message(sid, data):
    """Oda içindeki anlık mesajlaşmayı yönetir."""
    room = data.get("room")
    username = data.get("username")
    message = data.get("message")
    
    # Mesajı odadaki herkese (gönderen dahil) anlık iletir
    await sio.emit("new_message", {"username": username, "message": message}, room=room)

@sio.event
async def disconnect(sid):
    """Öğrenci tarayıcıyı kapattığında veya odadan çıktığında tetiklenir."""
    for room, users in active_rooms.items():
        for user in users:
            if user["sid"] == sid:
                username = user["username"]
                users.remove(user)
                # Kalanlara bildir
                await sio.emit("notification", {"message": f"🚪 {username} odadan ayrıldı."}, room=room)
                await sio.emit("room_users", {"users": [u["username"] for u in users]}, room=room)
                print(f"❌ {username} bağlantıyı kesti.")
                break