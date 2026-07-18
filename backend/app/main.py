from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import health, tickets, auth

# Import Base and engine, and all models so they register
from app.database.session import engine, Base, SessionLocal
from app.models import Ticket, Note, User
from app.utils.auth import hash_password

# Create tables
Base.metadata.create_all(bind=engine)

# Seed default support user if not exists
db = SessionLocal()
try:
    default_email = "support@supportflow.com"
    user_exists = db.query(User).filter(User.email == default_email).first()
    if not user_exists:
        default_user = User(
            name="Support Agent",
            email=default_email,
            password_hash=hash_password("support123")
        )
        db.add(default_user)
        db.commit()
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for SupportFlow CRM"
)

print("CORS_ORIGINS =", settings.CORS_ORIGINS)
# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(tickets.router)
app.include_router(auth.router, prefix="/api")
