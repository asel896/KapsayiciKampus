import json
from google import genai
from google.genai import types
from app.core.config import settings

class AIService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None

    async def generate_study_plan(self, goal: str) -> dict:
        if not self.client:
            return {
                "estimated_pomodoros": 4,
                "tasks": [
                    {"text": f"{goal} - Konu Tekrarı", "category": "study", "priority": "high"},
                    {"text": f"{goal} - Soru Çözümü", "category": "practice", "priority": "medium"},
                    {"text": f"{goal} - Yanlış Kontrolü", "category": "review", "priority": "low"}
                ]
            }

        prompt = f"""
        Sen 'Kapsayıcı Kampüs' uygulamasının akademik yapay zeka asistanısın. 
        Kullanıcının hedefi şu: '{goal}'
        
        Bu hedefi gerçekleştirebilmesi için profesyonel bir çalışma planı hazırla.
        Toplamda kaç Pomodoro (25'er dakikalık seans) süreceğini tahmin et ve bunu alt görevlere (en fazla 4 görev) böl.
        
        Yanıtı KESİNLİKLE sadece aşağıdaki JSON formatında ver, başka hiçbir açıklama metni ekleme:
        {{
            "estimated_pomodoros": toplam_tahmini_sayi_integer,
            "tasks": [
                {{
                    "text": "görev başlığı kısa", 
                    "category": "study veya practice veya review", 
                    "priority": "high veya medium veya low"
                }},
                ...
            ]
        }}
        """

        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Gemini API Hatası: {e}")
            return {
                "estimated_pomodoros": 3,
                "tasks": [{"text": f"Planla: {goal}", "category": "study", "priority": "high"}]
            }

ai_service = AIService()