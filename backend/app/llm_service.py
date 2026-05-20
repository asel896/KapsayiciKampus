import os
import base64
from fastapi import HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from google import genai
from google.genai import types


class ChatRequest(BaseModel):
    user_message: str
    friend_name: str
    friend_status: str
    friend_subject: str
    chat_history: List[Dict]
    image_base64: Optional[str] = None  

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
                "4. Cevabın çok kısa veya tek kelimelik olmasın. En az 1-2 tam cümleden oluşan doğal bir WhatsApp mesajı yaz.\n"
                "5. EĞER SANA BİR FOTOĞRAF/SORU GÖNDERİLİRSE: Gerçek bir arkadaş gibi resmi incele, soruyu çözüyorsa çözümde yardım et veya fotoğrafla ilgili samimi, zekice bir yorum yap."
            )

            
            contents_payload = []
            
            
            if data.chat_history:
                for msg in data.chat_history[-5:]:
                    role = "user" if msg.get("from") == "me" else "model"
                    contents_payload.append(
                        types.Content(
                            role=role,
                            parts=[types.Part.from_text(text=msg.get('text', ''))]
                        )
                    )
            
            current_user_parts = []

           
            if data.image_base64:
                if "," in data.image_base64:
                    header, base64_data = data.image_base64.split(",", 1)
                   
                    mime_type = header.split(";")[0].split(":")[1]
                else:
                    base64_data = data.image_base64
                    mime_type = "image/jpeg"

                
                image_bytes = base64.b64decode(base64_data)
                
                
                current_user_parts.append(
                    types.Part.from_bytes(
                        data=image_bytes,
                        mime_type=mime_type
                    )
                )

            current_user_parts.append(types.Part.from_text(text=data.user_message))

            contents_payload.append(
                types.Content(
                    role="user",
                    parts=current_user_parts
                )
            )

            
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=contents_payload,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.7,
                    max_output_tokens=1024
                )
            )
            
            return response.text.strip()
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Gemini API Hatası: {str(e)}")