from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.flight import (
    FlightCreate,
    FlightResponse,
    LuggageReportCreate,
    LuggageReportResponse,
)
from app.models.models import Flight, LuggageReport
from app.auth.security import get_current_user

router = APIRouter(prefix="/flights", tags=["Flights"])


@router.get("/", response_model=List[FlightResponse])
def get_flights(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    flights = db.query(Flight).offset(skip).limit(limit).all()
    return flights


@router.get("/{flight_id}", response_model=FlightResponse)
def get_flight(flight_id: int, db: Session = Depends(get_db)):
    flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    return flight


@router.post("/", response_model=FlightResponse, status_code=status.HTTP_201_CREATED)
def create_flight(
    flight: FlightCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_flight = Flight(**flight.dict())
    db.add(db_flight)
    db.commit()
    db.refresh(db_flight)
    return db_flight


@router.put("/{flight_id}", response_model=FlightResponse)
def update_flight(
    flight_id: int,
    flight: FlightCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not db_flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    for key, value in flight.dict().items():
        setattr(db_flight, key, value)
    db.commit()
    db.refresh(db_flight)
    return db_flight
