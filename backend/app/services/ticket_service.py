from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from sqlalchemy import or_
from app.models import Ticket, Note
from app.schemas.ticket import TicketCreate, TicketUpdate
from fastapi import HTTPException
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

def create_ticket(db: Session, ticket_in: TicketCreate) -> Ticket:
    try:
        # Get the highest current internal ID
        max_id = db.query(func.max(Ticket.id)).scalar()
        
        if max_id is None:
            max_id = 0
            
        next_id = max_id + 1
        generated_ticket_id = f"TKT-{next_id:03d}"
        
        # Create Ticket model instance
        db_ticket = Ticket(
            ticket_id=generated_ticket_id,
            customer_name=ticket_in.customer_name,
            customer_email=ticket_in.customer_email,
            subject=ticket_in.subject,
            description=ticket_in.description
        )
        
        # Save to database
        db.add(db_ticket)
        db.commit()
        db.refresh(db_ticket)
        
        return db_ticket
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating ticket: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

def get_all_tickets(db: Session, status: Optional[str] = None, search: Optional[str] = None) -> List[Ticket]:
    try:
        query = db.query(Ticket)
        
        if status:
            query = query.filter(Ticket.status == status)
            
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Ticket.customer_name.ilike(search_term),
                    Ticket.subject.ilike(search_term)
                )
            )
            
        return query.order_by(Ticket.created_at.desc()).all()
        
    except Exception as e:
        logger.error(f"Error fetching tickets: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

def get_ticket_by_id(db: Session, ticket_id: str) -> Optional[Ticket]:
    try:
        return db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    except Exception as e:
        logger.error(f"Error fetching ticket {ticket_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

def update_ticket(db: Session, ticket_id: str, ticket_in: TicketUpdate) -> Optional[Ticket]:
    try:
        ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
        if not ticket:
            return None
            
        ticket.status = ticket_in.status.value
        
        if ticket_in.notes:
            new_note = Note(
                ticket_id=ticket.id,
                note_text=ticket_in.notes
            )
            db.add(new_note)
            
        db.commit()
        db.refresh(ticket)
        return ticket
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating ticket {ticket_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
