from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.schemas.ticket import TicketCreate, TicketCreateResponse
from app.services import ticket_service
from app.database.session import get_db

router = APIRouter(
    prefix="/api/tickets",
    tags=["tickets"]
)

@router.post("", response_model=TicketCreateResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket_in: TicketCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new support ticket.
    """
    return ticket_service.create_ticket(db=db, ticket_in=ticket_in)
