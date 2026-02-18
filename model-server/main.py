"""FastAPI inference server for PCA + Logistic Regression models."""
import fastapi
from pydantic import BaseModel
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
import pandas as pd
from pathlib import Path

app = fastapi.FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable to store loaded models
MODELS = {}

def load_models():
    """Load all trained models at startup."""
    models_dir = Path("models")
    threat_types = ['cyber', 'missile', 'hybrid', 'air', 'naval']
    
    for threat_name in threat_types:
        for var_name in ['response_success', 'financial_loss', 'neutralization']:
            model_path = models_dir / f"{threat_name}_{var_name}.pkl"
            try:
                with open(model_path, 'rb') as f:
                    MODELS[f"{threat_name}_{var_name}"] = pickle.load(f)
                print(f"Loaded model for {threat_name} {var_name}")
            except FileNotFoundError:
                print(f"Warning: Model file not found for {threat_name}: {model_path}")
    
    if not MODELS:
        print("WARNING: No models loaded! Please run train_models.py first.")
    else:
        print(f"Successfully loaded {len(MODELS)} models")


@app.on_event("startup")
async def startup_event():
    """Load models when the server starts."""
    load_models()


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


class InferenceOutput(BaseModel):
    Financial_Loss_MUSD: float
    actual_days_to_stabilization: float
    response_success: bool
    response_success_confidence: float


def normalize_threat_type(threat_type: str) -> str:
    """Normalize threat type to match training data."""
    threat_type = threat_type.strip().lower()
    if threat_type == "msl":
        return "missile"
    return threat_type

def create_feature_vector(input_dict: dict, feature_names: List[str], median_values: dict) -> np.ndarray:
    """Create feature vector in the correct order, handling missing values."""
    features = []
    for feature_name in feature_names:
        if feature_name in input_dict:
            value = input_dict[feature_name]
            # Handle missing values with median imputation
            if pd.isna(value):
                value = median_values[feature_name]
            features.append(value)
        else:
            # Use median if feature is missing
            features.append(median_values[feature_name])
    return np.array(features).reshape(1, -1)


def predict_response_success(input_dict: dict, threat_type: str) -> tuple:
    """
    Predict response success for a given input.
    
    Args:
        input_dict: Dictionary of feature values
        threat_type: Normalized threat type name
    
    Returns:
        Tuple of (prediction, confidence)
    """
    if f"{threat_type}_response_success" not in MODELS:
        raise ValueError(f"No model named: {threat_type}_response_success")
    
    model_package = MODELS[f"{threat_type}_response_success"]
    scaler = model_package['scaler']
    pca = model_package['pca']
    model = model_package['model']
    feature_names = model_package['feature_names']
    median_values = model_package['median_values']
    
    X = create_feature_vector(input_dict, feature_names, median_values)
    
    # Apply transformations
    X_scaled = scaler.transform(X)
    X_pca = pca.transform(X_scaled)
    
    # Get prediction and probability
    prediction = model.predict(X_pca)[0]
    probability = model.predict_proba(X_pca)[0]
    
    # Confidence is the probability of the predicted class
    confidence = probability[1] if prediction == 1 else probability[0]
    
    return int(prediction), float(confidence)


def predict_financial_loss(input_dict: dict, threat_type: str) -> float:
    """
    Predict financial loss for a given input.
    
    Args:
        input_dict: Dictionary of feature values
        threat_type: Normalized threat type name
    Returns:
        Predicted financial loss in millions USD
    """

    if f"{threat_type}_financial_loss" not in MODELS:
        raise ValueError(f"No model named: {threat_type}_financial_loss")
    
    model_package = MODELS[f"{threat_type}_financial_loss"]     
    scaler = model_package['scaler']
    pca = model_package['pca']
    model = model_package['model']
    feature_names = model_package['feature_names']
    median_values = model_package['median_values']

    X = create_feature_vector(input_dict, feature_names, median_values)

    # Apply transformations
    X_scaled = scaler.transform(X)
    X_pca = pca.transform(X_scaled)

    # Get prediction
    prediction = model.predict(X_pca)[0]

    return float(prediction) 


def predict_days_to_stabilization(input_dict: dict, threat_type: str) -> float:
    """
    Predict days to stabilization for a given input.
    
    Args:
        input_dict: Dictionary of feature values
        threat_type: Normalized threat type name
    Returns:
        Predicted days to stabilization
    """
    if f"{threat_type}_neutralization" not in MODELS:
        raise ValueError(f"No model named: {threat_type}_neutralization")
    
    model_package = MODELS[f"{threat_type}_neutralization"]
    scaler = model_package['scaler']
    pca = model_package['pca']
    model = model_package['model']
    feature_names = model_package['feature_names']
    median_values = model_package['median_values']

    X = create_feature_vector(input_dict, feature_names, median_values)

    # Apply transformations
    X_scaled = scaler.transform(X)
    X_pca = pca.transform(X_scaled)

    # Get prediction
    prediction = model.predict(X_pca)[0]

    return float(prediction) 


@app.post("/inference")
async def inference(input_data: List[InferenceInput]) -> List[InferenceOutput]:
    """
    Model inference endpoint.
    Takes operational threat response data as input and predicts:
    - Financial loss in millions USD (placeholder for now)
    - Days to stabilization (placeholder for now)
    - Response success (1 for success, 0 for failure) with confidence score

    Args:
        input_data (List[InferenceInput]): List of input data for inference.
    Returns:
        List[InferenceOutput]: List of model predictions. The first output corresponds to the first input, and so on.
    """
    results = []
    
    for input_item in input_data:
        # Normalize threat type
        threat_type = normalize_threat_type(input_item.Threat_Type)
        
        # Convert input to dictionary for easier processing
        input_dict = {
            "enemy_unit_count": input_item.enemy_unit_count,
            "Enemy.Capability.Index": input_item.Enemy_Capability_Index,
            "ThreatEscalationHours": input_item.ThreatEscalationHours,
            "friendlyUnitCount": input_item.friendlyUnitCount,
            "LCS_COUNT": input_item.LCS_COUNT,
            "Aircraft Count": input_item.Aircraft_Count,
            "cyber_defense_teams": input_item.cyber_defense_teams,
            "Patriot.Batteries": input_item.Patriot_Batteries,
            "ISR_AssetCount": input_item.ISR_AssetCount,
            "satellite coverage score": input_item.satellite_coverage_score,
            "JointForceIntegration": input_item.JointForceIntegration,
            "EW_Capability": input_item.EW_Capability,
            "Supply Chain Resilience": input_item.Supply_Chain_Resilience,
            "PriorEngagements": input_item.PriorEngagements,
            "force_readiness_score": input_item.force_readiness_score,
            "Intel Confidence": input_item.Intel_Confidence,
            "ResponseTime_hrs": input_item.ResponseTime_hrs,
            "logistics_delay_hours": input_item.logistics_delay_hours,
            "CMD_COORD_SCORE": input_item.CMD_COORD_SCORE,
            "roe_complexity_score": input_item.roe_complexity_score,
            "Operational Budget (MUSD)": input_item.Operational_Budget_MUSD,
            "BudgetUtilization_pct": input_item.BudgetUtilization_pct,
            "Weather_Severity": input_item.Weather_Severity,
            "Theater Distance KM": input_item.Theater_Distance_KM,
        }
        
        # Predict response success, financial loss, and days to stabilization
        prediction, confidence = predict_response_success(input_dict, threat_type)
        financial_loss_prediction = predict_financial_loss(input_dict, threat_type)
        days_to_stabilization_prediction = predict_days_to_stabilization(input_dict, threat_type)
        
        # Create output
        results.append(InferenceOutput(
            Financial_Loss_MUSD=float(financial_loss_prediction),
            actual_days_to_stabilization=float(days_to_stabilization_prediction),
            response_success=bool(prediction),
            response_success_confidence=float(confidence)
        ))
    
    return results


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "online",
        "models_loaded": list(MODELS.keys()),
        "num_models": len(MODELS)
    }


