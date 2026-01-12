from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID

from app.schemas.backboard import (
    ToolCallRequest,
    ToolCallResponse,
    AnswerEvaluationArgs
)
from app.services.backboard_tools import handle_tool_call
from app.utils.dependencies import (
    DBSession,
    CurrentUser,
    RateLimiter,
    ClientInfo,
    get_current_user_optional,
)


router = APIRouter(
    prefix="/backboard",
    tags=["Backboard"]
)


@router.post(
    "/tool-call",
    response_model=ToolCallResponse,
    status_code=status.HTTP_200_OK
)
async def backboard_tool_call(
    payload: ToolCallRequest,
    current_user: CurrentUser,
        db: DBSession,
):
    """
    Endpoint unique appelé par le LLM (tool calling)
    """

    if not payload.tool:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    try:
        result = await handle_tool_call(
            tool_name=payload.tool,
            tool_args=payload.arguments,
            user_id=current_user.id,
            db=db
        )
    except KeyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Missing argument: {e}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

    return ToolCallResponse(
        success=True,
        result=result
    )