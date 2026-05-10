from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.flight import LuggageReportCreate, LuggageReportResponse
from app.models.models import LuggageReport
from app.auth.security import get_current_user

router = APIRouter(prefix="/luggage", tags=["Luggage"])


@router.get("/", response_model=List[LuggageReportResponse])
def get_luggage_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    reports = db.query(LuggageReport).offset(skip).limit(limit).all()
    return reports


@router.get("/{report_id}", response_model=LuggageReportResponse)
def get_luggage_report(report_id: int, db: Session = Depends(get_db)):
    db_report = db.query(LuggageReport).filter(LuggageReport.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")
    return db_report


@router.post(
    "/", response_model=LuggageReportResponse, status_code=status.HTTP_201_CREATED
)
def create_luggage_report(report: LuggageReportCreate, db: Session = Depends(get_db)):
    db_report = LuggageReport(**report.dict())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


@router.put("/{report_id}", response_model=LuggageReportResponse)
def update_luggage_report(
    report_id: int,
    status: Optional[str] = None,
    description: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_report = db.query(LuggageReport).filter(LuggageReport.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")
    if status is not None:
        db_report.status = status
    if description is not None:
        db_report.description = description
    db.commit()
    db.refresh(db_report)
    return db_report


@router.delete("/{report_id}")
def delete_luggage_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_report = db.query(LuggageReport).filter(LuggageReport.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(db_report)
    db.commit()
    return {"message": "Report deleted successfully"}


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
