"""tool_called added

Revision ID: 9bde58afc863
Revises: 18e9ab0d2d1b
Create Date: 2026-01-12 19:17:04.940434

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9bde58afc863'
down_revision: Union[str, Sequence[str], None] = '18e9ab0d2d1b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "session_messages",
        sa.Column("tool_called", sa.String(), nullable=True)
    )


def downgrade() -> None:
    op.drop_column("session_messages", "tool_called")
