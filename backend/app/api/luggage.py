from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.flight import LuggageReportCreate, LuggageReportResponse
from app.models.models import LuggageReport
from app.auth.security import get_current_user

router = APIRouter(prefix="/luggage", tags=["Luggage"])


@router.get("/", response_model=List[LuggageReportResponse])
def get_luggage_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    reports = db.query(LuggageReport).offset(skip).limit(limit).all()
    return reports


@router.post(
    "/", response_model=LuggageReportResponse, status_code=status.HTTP_201_CREATED
)
def create_luggage_report(report: LuggageReportCreate, db: Session = Depends(get_db)):
    db_report = LuggageReport(**report.dict())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


@router.put("/{report_id}/status")
def update_luggage_status(
    report_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_report = db.query(LuggageReport).filter(LuggageReport.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")
    db_report.status = status
    db.commit()
    return {"message": "Status updated", "status": status}
