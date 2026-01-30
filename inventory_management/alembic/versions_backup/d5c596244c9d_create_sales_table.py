"""create sales table

Revision ID: d5c596244c9d
Revises: 3e8b7176b919
Create Date: 2026-01-07 18:59:21.593138

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd5c596244c9d'
down_revision: Union[str, Sequence[str], None] = '3e8b7176b919'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
