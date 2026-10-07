"""
Groq LPU High-Speed Cloud Inference Service for CivicTwin AI.
Provides 24/7 serverless disaster intelligence at ~300 tokens/sec
using Groq's low-latency hardware and sovereign NDMA disaster prompts.
"""

import os
import time
import httpx
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class GroqAIResponse(BaseModel):
    status: str
    model: str
    content: str
    tokens_generated: int
    latency_ms: float
    tactical_recommendations: List[str]
    source: str

class GroqService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY", "")
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.default_model = "qwen/qwen3.8-27b"

    def is_configured(self) -> bool:
        key = os.getenv("GROQ_API_KEY", self.api_key)
        return bool(key and len(key) > 10)

    async def query(
        self,
        prompt: str,
        system_context: Optional[str] = None,
        city_name: str = "Mumbai"
    ) -> Dict[str, Any]:
        res = await self.generate_response(prompt, system_context=system_context, city_name=city_name)
        return {
            "status": "success" if res.status == "SUCCESS" else "fallback",
            "model": res.model,
            "response": res.content,
            "latency_sec": round(res.latency_ms / 1000.0, 2),
            "tokens_generated": res.tokens_generated,
            "tactical_recommendations": res.tactical_recommendations,
            "source": res.source
        }

    async def generate_response(
        self,
        prompt: str,
        system_context: Optional[str] = None,
        city_name: str = "Mumbai",
        current_threat: str = "CRITICAL",
        max_tokens: int = 500
    ) -> GroqAIResponse:
        """
        Executes ultra-low latency inference against Groq LPU API.
        """
        start_time = time.time()
        self.api_key = os.getenv("GROQ_API_KEY", self.api_key)

        if not self.api_key:
            return GroqAIResponse(
                status="FALLBACK",
                model="Rule-Based Tactical Baseline",
                content="[Groq API Key Unset] Immediate Action: Maintain high-ground evacuation, isolate submerged 415V distribution transformers, and deploy shallow-draft inflatable boats along western arterial margin.",
                tokens_generated=32,
                latency_ms=1.5,
                tactical_recommendations=[
                    "Issue Level-3 red siren to low-lying wards",
                    "Dispatch NDRF 108 trauma boats to flooded transit hubs"
                ],
                source="CivicTwin Baseline Rules"
            )

        system_instruction = (
            "You are the CivicTwin AI National Disaster Intelligence Commander and Civil Defense Coordinator for India. "
            f"Active Sector: {city_name}. Current Threat Level: {current_threat}. "
            "You provide direct, operational, military-grade disaster tactical intelligence compliant with the "
            "National Disaster Management Act (DM Act 2005), Chitale Commission guidelines, and CWC standard operating procedures. "
            "Be concise, actionable, and prioritize preserving human life, de-energizing submerged electrical busbars, "
            "and securing critical hospital oxygen/diesel backup reserves."
        )

        if system_context:
            system_instruction += f"\nTelemetry Context: {system_context}"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.default_model,
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.6,
            "max_tokens": max_tokens
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(self.base_url, json=payload, headers=headers)
                elapsed_ms = round((time.time() - start_time) * 1000, 1)

                if resp.status_code == 200:
                    data = resp.json()
                    choice = data["choices"][0]
                    content = choice["message"]["content"]
                    tokens = data.get("usage", {}).get("completion_tokens", len(content.split()))

                    # Extract bullet point recommendations
                    recommendations = []
                    for line in content.splitlines():
                        line_s = line.strip()
                        if line_s.startswith(("-", "*", "1.", "2.", "3.", "•")) and len(line_s) > 10:
                            clean_rec = line_s.lstrip("-*123456789. •").strip()
                            if clean_rec:
                                recommendations.append(clean_rec)

                    return GroqAIResponse(
                        status="SUCCESS",
                        model=data.get("model", self.default_model),
                        content=content,
                        tokens_generated=tokens,
                        latency_ms=elapsed_ms,
                        tactical_recommendations=recommendations[:4],
                        source="Groq LPU Sovereign Cloud"
                    )
                else:
                    print(f"Groq API Error {resp.status_code}: {resp.text}")
        except Exception as e:
            print(f"Groq API Exception: {e}")

        # Fallback if connection times out
        elapsed_ms = round((time.time() - start_time) * 1000, 1)
        return GroqAIResponse(
            status="FALLBACK_LOCAL",
            model="Local Tactical Intelligence",
            content=f"Tactical Advisory for {city_name}: Deploy immediate sandbagging at substation perimeter, scramble NDRF water rescue teams via cleared high-ground corridors, and sound community evacuation siren.",
            tokens_generated=35,
            latency_ms=elapsed_ms,
            tactical_recommendations=[
                "Deploy emergency dewatering pumps to subway trenches",
                "Activate hospital ICU diesel fuel diversion"
            ],
            source="Local Failover Engine"
        )

groq_service = GroqService()
