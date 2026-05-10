from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models.models import Flight, LuggageReport

router = APIRouter(prefix="/seed", tags=["Seed"])


@router.post("/")
def seed_data(db: Session = Depends(get_db)):
    existing_flights = db.query(Flight).count()
    if existing_flights > 0:
        return {"message": f"Database already has {existing_flights} flights. Use DELETE to reset."}

    flights_data = [
        {
            "flight_number": "AV001",
            "origin": "BOG",
            "destination": "MDE",
            "departure_time": datetime.now() + timedelta(hours=2),
            "arrival_time": datetime.now() + timedelta(hours=3),
            "gate": "A1",
            "status": "on_time"
        },
        {
            "flight_number": "AV002",
            "origin": "BOG",
            "destination": "CLO",
            "departure_time": datetime.now() + timedelta(hours=4),
            "arrival_time": datetime.now() + timedelta(hours=5),
            "gate": "B2",
            "status": "on_time"
        },
        {
            "flight_number": "LA303",
            "origin": "MDE",
            "destination": "BOG",
            "departure_time": datetime.now() + timedelta(hours=1),
            "arrival_time": datetime.now() + timedelta(hours=2),
            "gate": "C3",
            "status": "boarding"
        },
        {
            "flight_number": "5T100",
            "origin": "BOG",
            "destination": "CTG",
            "departure_time": datetime.now() + timedelta(hours=6),
            "arrival_time": datetime.now() + timedelta(hours=7),
            "gate": "D1",
            "status": "scheduled"
        },
        {
            "flight_number": "AV450",
            "origin": "BOG",
            "destination": "SMR",
            "departure_time": datetime.now() + timedelta(hours=8),
            "arrival_time": datetime.now() + timedelta(hours=9),
            "gate": "E2",
            "status": "scheduled"
        },
        {
            "flight_number": "LA999",
            "origin": "CLO",
            "destination": "MDE",
            "departure_time": datetime.now() + timedelta(hours=3),
            "arrival_time": datetime.now() + timedelta(hours=4),
            "gate": "F1",
            "status": "delayed"
        },
        {
            "flight_number": "AV555",
            "origin": "BOG",
            "destination": "AXM",
            "departure_time": datetime.now() + timedelta(hours=10),
            "arrival_time": datetime.now() + timedelta(hours=11),
            "gate": "G3",
            "status": "scheduled"
        },
        {
            "flight_number": "5T777",
            "origin": "CTG",
            "destination": "BOG",
            "departure_time": datetime.now() + timedelta(hours=5),
            "arrival_time": datetime.now() + timedelta(hours=6),
            "gate": "H2",
            "status": "on_time"
        }
    ]

    for flight_data in flights_data:
        db_flight = Flight(**flight_data)
        db.add(db_flight)

    luggage_data = [
        {
            "description": "Maleta perdida en área de reclamo",
            "passenger_name": "Juan Pérez",
            "passenger_document": "12345678",
            "status": "pending"
        },
        {
            "description": "Equipaje dañado durante el manipuleo",
            "passenger_name": "María Gómez",
            "passenger_document": "87654321",
            "status": "in_progress"
        },
        {
            "description": "Etiqueta de maleta illegible",
            "passenger_name": "Carlos Rodríguez",
            "passenger_document": "11223344",
            "status": "resolved"
        }
    ]

    for luggage_info in luggage_data:
        db_luggage = LuggageReport(**luggage_info)
        db.add(db_luggage)

    db.commit()

    return {
        "message": "Seed data created successfully",
        "flights_created": len(flights_data),
        "luggage_reports_created": len(luggage_data)
    }


@router.delete("/reset")
def reset_data(db: Session = Depends(get_db)):
    db.query(LuggageReport).delete()
    db.query(Flight).delete()
    db.commit()
    return {"message": "All data deleted successfully"}


@router.get("/status")
def seed_status(db: Session = Depends(get_db)):
    flights_count = db.query(Flight).count()
    luggage_count = db.query(LuggageReport).count()
    return {
        "flights": flights_count,
        "luggage_reports": luggage_count,
        "has_data": flights_count > 0
    }