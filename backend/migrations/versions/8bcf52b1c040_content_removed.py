"""content removed

Revision ID: 8bcf52b1c040
Revises: 9bde58afc863
Create Date: 2026-01-12 19:29:45.246955

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8bcf52b1c040'
down_revision: Union[str, Sequence[str], None] = '9bde58afc863'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_column("session_messages", "content")


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column(
        "session_messages",
        sa.Column("content", sa.String(), nullable=True)
    )
