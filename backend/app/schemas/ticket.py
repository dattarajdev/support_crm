from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

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
