"""FastAPI inference server for PCA + Logistic Regression models."""
import fastapi
from pydantic import BaseModel
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware

app = fastapi.FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:*",
        "http://127.0.0.1:*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InferenceInput(BaseModel):
    Threat_Type: str
    enemy_unit_count: int
    Enemy_Capability_Index: float
    ThreatEscalationHours: float
    friendlyUnitCount: int
    LCS_COUNT: int
    Aircraft_Count: int
    cyber_defense_teams: int
    Patriot_Batteries: int
    ISR_AssetCount: int
    satellite_coverage_score: float
    JointForceIntegration: float
    EW_Capability: float
    Supply_Chain_Resilience: float
    PriorEngagements: int
    force_readiness_score: float
    Intel_Confidence: float
    ResponseTime_hrs: float
    logistics_delay_hours: float
    CMD_COORD_SCORE: float
    roe_complexity_score: float
    Operational_Budget_MUSD: float
    BudgetUtilization_pct: float
    Weather_Severity: float
    Theater_Distance_KM: float
    Season: str

    class Config:
        # Allow field names with spaces to be mapped
        fields = {
            'Threat_Type': 'Threat Type',
            'Enemy_Capability_Index': 'Enemy.Capability.Index',
            'Aircraft_Count': 'Aircraft Count',
            'Patriot_Batteries': 'Patriot.Batteries',
            'satellite_coverage_score': 'satellite coverage score',
            'Supply_Chain_Resilience': 'Supply Chain Resilience',
            'Operational_Budget_MUSD': 'Operational Budget (MUSD)',
            'Theater_Distance_KM': 'Theater Distance KM'
        }


class InferenceOutput(BaseModel):
    Financial_Loss_MUSD: float
    actual_days_to_stabilization: float
    response_success: str


@app.post("/inference")
async def inference(input_data: List[InferenceInput]) -> List[InferenceOutput]:
    """
    Model inference endpoint.
    Takes operational threat response data as input and predicts:
    - Financial loss in millions USD
    - Days to stabilization
    - Response success (1 for success, 0 for failure)

    Args:
        input_data (List[InferenceInput]): List of input data for inference.
    Returns:
        List[InferenceOutput]: List of model predictions. The first output corresponds to the first input, and so on.
    """
    # TODO: Replace this placeholder with actual model inference
    # For now, return dummy predictions
    return [InferenceOutput(
        Financial_Loss_MUSD=100.0,
        actual_days_to_stabilization=5.0,
        response_success="1"
    )]


