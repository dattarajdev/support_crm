from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models.ticket import Ticket
from app.schemas.ticket import TicketCreate
from fastapi import HTTPException
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
