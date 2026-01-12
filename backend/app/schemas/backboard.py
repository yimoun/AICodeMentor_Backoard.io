from uuid import UUID
from typing import Any, Dict, Optional
from pydantic import BaseModel, field_validator


class ToolCallRequest(BaseModel):
    tool: str
    arguments: Dict[str, Any]


class AnswerEvaluationArgs(BaseModel):
    question_id: UUID
    quality: int
    feedback: Optional[str] = None

    @field_validator("quality", mode="before")
    @classmethod
    def cast_quality(cls, v):
        try:
            return int(v)
        except Exception:
            raise ValueError("quality must be an integer")


class ToolCallResponse(BaseModel):
    success: bool
    result: Dict[str, Any]
