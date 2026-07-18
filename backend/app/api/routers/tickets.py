from fastapi import APIRouter, Depends, status, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.ticket import TicketCreate, TicketCreateResponse, TicketListResponse, TicketDetailResponse, TicketUpdate, TicketUpdateResponse
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

@router.get("", response_model=List[TicketListResponse])
def get_tickets(
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search by customer name or subject"),
    db: Session = Depends(get_db)
):
    """
    Retrieve all tickets with optional filtering.
    """
    return ticket_service.get_all_tickets(db=db, status=status, search=search)

@router.get("/{ticket_id}", response_model=TicketDetailResponse)
def get_ticket(
    ticket_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve details for a specific ticket by its ID.
    """
    ticket = ticket_service.get_ticket_by_id(db=db, ticket_id=ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.put("/{ticket_id}", response_model=TicketUpdateResponse)
def update_ticket(
    ticket_id: str,
    ticket_in: TicketUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a ticket's status and optionally add a note.
    """
    ticket = ticket_service.update_ticket(db=db, ticket_id=ticket_id, ticket_in=ticket_in)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return {
        "success": True,
        "updated_at": ticket.updated_at
    }
