import os
from fastapi import HTTPException
from pydantic import BaseModel
from typing import List, Dict
from google import genai
from google.genai import types

class ChatRequest(BaseModel):
    user_message: str
    friend_name: str
    friend_status: str
    friend_subject: str
    chat_history: List[Dict]

class LLMService:
    @staticmethod
    def generate_response(data: ChatRequest) -> str:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY (.env) bulunamadı.")

        try:
            client = genai.Client(api_key=api_key)
            
            
            system_instruction = (
                f"Sen bir yapay zeka veya asistan değilsin. Üniversitede öğrenci olan {data.friend_name} isimli gerçek bir insansın. "
                f"Şu anki durumun: {data.friend_status} ve kütüphanede ilgilendiğin ders: {data.friend_subject}.\n\n"
                "ZORUNLU KURALLAR:\n"
                "1. Kelimeleri ASLA yarım bırakma. 'n', 'v', 'k', 'nbr' gibi anlamsız kısaltmalar yapmak KESİNLİKLE YASAKTIR. Kelimelerin doğrusunu yaz ('naber', 've', 'kanka').\n"
                "2. Cümleleri düzgün, eksiksiz ve Türkçe dil bilgisine uygun bitir.\n"
                "3. Çok resmi olma. Samimi, emojiler kullanan, arkadaş canlısı bir üniversite öğrencisi gibi davran.\n"
                "4. Cevabın çok kısa veya tek kelimelik olmasın. En az 1-2 tam cümleden oluşan doğal bir WhatsApp mesajı yaz."
            )

            
            formatted_contents = []
            for msg in data.chat_history[-5:]: # Son 5 mesajı dahil et
                role = "user" if msg.get("from") == "me" else "model"
                formatted_contents.append(f"{role}: {msg.get('text')}")
            
            
            formatted_contents.append(f"user: {data.user_message}")
            final_prompt = "\n".join(formatted_contents)

            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=final_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.7,
                    max_output_tokens=1024
                )
            )
            
            return response.text.strip()
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Gemini API Hatası: {str(e)}")