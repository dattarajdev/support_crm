from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class TicketStatus(str, Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    CLOSED = "Closed"

class TicketCreate(BaseModel):
    customer_name: str = Field(..., min_length=1)
    customer_email: EmailStr
    subject: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)

class TicketCreateResponse(BaseModel):
    ticket_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class TicketListResponse(BaseModel):
    ticket_id: str
    customer_name: str
    subject: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class NoteResponse(BaseModel):
    note_text: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class TicketDetailResponse(BaseModel):
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: str
    notes: List[NoteResponse] = Field(default_factory=list)
    
    class Config:
        from_attributes = True

class TicketUpdate(BaseModel):
    status: TicketStatus
    notes: Optional[str] = None

class TicketUpdateResponse(BaseModel):
    success: bool
    updated_at: datetime
