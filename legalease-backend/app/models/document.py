from pydantic import BaseModel
from typing import List, Optional


class RiskClause(BaseModel):
    clause: str
    explanation: str
    severity: str  # "high" | "medium" | "low"


class KeyTerm(BaseModel):
    term: str
    value: str


class DocumentResponse(BaseModel):
    id: str
    fileName: str
    fileUrl: str
    documentType: str
    summary: str
    riskClauses: List[RiskClause]
    keyTerms: List[KeyTerm]
    createdAt: str


class DocumentListItem(BaseModel):
    id: str
    fileName: str
    documentType: str
    summary: str
    createdAt: str
