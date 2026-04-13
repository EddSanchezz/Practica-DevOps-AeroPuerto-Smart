from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class FlightBase(BaseModel):
    flight_number: str
    origin: str
    destination: str
    departure_time: datetime
    arrival_time: datetime
    gate: Optional[str] = None
    status: str = "scheduled"


class FlightCreate(FlightBase):
    pass


class FlightResponse(FlightBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True


class LuggageReportBase(BaseModel):
    description: str
    passenger_name: str
    passenger_document: str


class LuggageReportCreate(LuggageReportBase):
    pass


class LuggageReportResponse(LuggageReportBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
