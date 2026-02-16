# Threat Response Prediction Model Server

This directory contains a FastAPI-based inference server that deploys PCA + Logistic Regression models for predicting military threat response success.

## Overview

The system trains separate models for each threat type (Cyber, Missile, Hybrid, Air, Naval) and provides an inference API that:
- Accepts operational threat response data
- Returns predictions with confidence scores for response success
- Uses PCA dimensionality reduction combined with Logistic Regression

## Model Details

### Architecture
- **Preprocessing**: StandardScaler for feature normalization
- **Dimensionality Reduction**: PCA with optimized number of components per threat type
- **Classification**: Logistic Regression with L2 regularization

### Performance (Validation Accuracy)
| Threat Type | Components | Accuracy | Variance Explained |
|-------------|------------|----------|-------------------|
| Cyber       | 17         | 90.67%   | 87.05%            |
| Missile     | 20         | 87.14%   | 97.21%            |
| Hybrid      | 19         | 90.11%   | 96.90%            |
| Air         | 19         | 97.41%   | 93.06%            |
| Naval       | 21         | 92.06%   | 100.00%           |

### Evaluation Results (Train/Test Performance)

**Overall Performance:**
- **Train Set:** 93.25% accuracy, 94.39% precision, 97.71% recall
- **Test Set:** 93.00% accuracy, 95.07% precision, 96.89% recall
- **Generalization Gap:** Only 0.25% accuracy drop (excellent generalization!)

**Per-Threat-Type Test Accuracy:**
| Threat Type | Test Accuracy | Test Precision | Test Recall |
|-------------|--------------|----------------|-------------|
| Air         | **95.65%**   | 96.13%        | 99.33%      |
| Naval       | 93.66%       | 95.24%        | 97.56%      |
| Hybrid      | 92.11%       | 93.75%        | 96.77%      |
| Cyber       | 91.49%       | 96.34%        | 94.05%      |
| Missile     | 89.89%       | 93.24%        | 94.52%      |

**Key Findings:**
- All models exceed 89% test accuracy with minimal overfitting
- High recall (96.89%) indicates models rarely miss successful responses
- High precision (95.07%) means predicted successes are highly reliable
- Air threat model performs best (95.65% test accuracy)
- See [EVALUATION_REPORT.md](EVALUATION_REPORT.md) for detailed analysis

## Setup and Installation

### 1. Install Dependencies

```bash
cd model-server
pip install -r requirements.txt
```

Required packages:
- fastapi[standard]~=0.128
- scikit-learn~=1.3.0
- numpy~=1.24.0
- pandas~=2.0.0
- uvicorn (for running the server)
- requests (for testing)

### 2. Train Models

Before running the inference server, you need to train the models:

```bash
python train_models.py
```

This will:
- Load data from `../Data/unh_hackathon_prompt_2_data.json`
- Train separate models for each threat type
- Save trained models to `models/` directory
- Display training summary with validation accuracies

### 3. Start the Server

```bash
uvicorn main:app --reload --port 8000
```

Or using FastAPI CLI:

```bash
fastapi dev main.py --port 8000
```

The server will start on `http://localhost:8000`

## API Endpoints

### Health Check: `GET /`

Returns server status and loaded models.

**Example Response:**
```json
{
  "status": "online",
  "models_loaded": ["cyber", "missile", "hybrid", "air", "naval"],
  "num_models": 5
}
```

### Inference: `POST /inference`

Performs threat response prediction.

**Request Body:** List of `InferenceInput` objects

**Fields:**
- `Threat_Type` (str): Type of threat (Cyber, Missile, Hybrid, Air, Naval)
- `enemy_unit_count` (int): Number of enemy units
- `Enemy_Capability_Index` (float): Enemy capability score
- `ThreatEscalationHours` (float): Hours until threat escalation
- `friendlyUnitCount` (int): Number of friendly units
- `LCS_COUNT` (int): Littoral Combat Ship count
- `Aircraft_Count` (int): Number of aircraft
- `cyber_defense_teams` (int): Number of cyber defense teams
- `Patriot_Batteries` (int): Number of Patriot missile batteries
- `ISR_AssetCount` (int): Intelligence, Surveillance, Reconnaissance asset count
- `satellite_coverage_score` (float): Satellite coverage quality score
- `JointForceIntegration` (float): Joint force integration score
- `EW_Capability` (float): Electronic warfare capability score
- `Supply_Chain_Resilience` (float): Supply chain resilience score
- `PriorEngagements` (int): Number of prior engagements
- `force_readiness_score` (float): Force readiness score
- `Intel_Confidence` (float): Intelligence confidence level
- `ResponseTime_hrs` (float): Response time in hours
- `logistics_delay_hours` (float): Logistics delay in hours
- `CMD_COORD_SCORE` (float): Command coordination score
- `roe_complexity_score` (float): Rules of engagement complexity score
- `Operational_Budget_MUSD` (float): Operational budget in millions USD
- `BudgetUtilization_pct` (float): Budget utilization percentage
- `Weather_Severity` (float): Weather severity score
- `Theater_Distance_KM` (float): Theater distance in kilometers
- `Season` (str): Season (Winter, Spring, Summer, Fall)

**Response:** List of `InferenceOutput` objects

**Response Fields:**
- `Financial_Loss_MUSD` (float): Predicted financial loss (placeholder: 0.0)
- `actual_days_to_stabilization` (float): Predicted days to stabilize (placeholder: 0.0)
- `response_success` (str): Prediction - "1" for success, "0" for failure
- `response_success_confidence` (float): Confidence score (0.0 to 1.0)

**Example Request:**
```json
[
  {
    "Threat_Type": "Cyber",
    "enemy_unit_count": 50,
    "Enemy_Capability_Index": 8.5,
    "ThreatEscalationHours": 12.5,
    "friendlyUnitCount": 80,
    "LCS_COUNT": 3,
    "Aircraft_Count": 10,
    "cyber_defense_teams": 15,
    "Patriot_Batteries": 5,
    "ISR_AssetCount": 20,
    "satellite_coverage_score": 7.8,
    "JointForceIntegration": 8.2,
    "EW_Capability": 7.5,
    "Supply_Chain_Resilience": 8.0,
    "PriorEngagements": 5,
    "force_readiness_score": 8.5,
    "Intel_Confidence": 7.8,
    "ResponseTime_hrs": 4.5,
    "logistics_delay_hours": 2.0,
    "CMD_COORD_SCORE": 8.5,
    "roe_complexity_score": 6.0,
    "Operational_Budget_MUSD": 500.0,
    "BudgetUtilization_pct": 75.5,
    "Weather_Severity": 3.5,
    "Theater_Distance_KM": 1500.0,
    "Season": "Summer"
  }
]
```

**Example Response:**
```json
[
  {
    "Financial_Loss_MUSD": 0.0,
    "actual_days_to_stabilization": 0.0,
    "response_success": "1",
    "response_success_confidence": 0.9523
  }
]
```

## Testing

Run the test script to verify the server is working:

```bash
python test_inference.py
```

This will:
1. Check the health endpoint
2. Send test requests for different threat types
3. Display predictions with confidence scores

## Model Architecture Details

### Feature Processing

1. **Feature Selection**: Excludes non-numeric and target columns (Threat Type, Season, response_success, actual_days_to_stabilization, Financial_Loss_MUSD)

2. **Missing Value Imputation**: Uses median values computed from training data

3. **Standardization**: StandardScaler normalizes features to zero mean and unit variance

4. **PCA Transformation**: Reduces dimensionality while preserving 87-100% of variance

5. **Classification**: Logistic Regression with probability outputs for confidence scores

### Threat-Specific Models

Each threat type has its own model with optimized hyperparameters:
- **Number of PCA components**: Automatically selected (17-21 components)
- **Regularization**: L2 regularization (default)
- **Solver**: lbfgs (default)
- **Max iterations**: 10,000

### Confidence Scores

The `response_success_confidence` field represents the model's probability estimate for the predicted class:
- For prediction "1" (success): confidence = P(success)
- For prediction "0" (failure): confidence = P(failure)

Values closer to 1.0 indicate higher model certainty.

## Files

- `main.py` - FastAPI inference server
- `train_models.py` - Model training script
- `evaluate_models.py` - Comprehensive model evaluation on train/test sets
- `visualize_results.py` - Generate performance visualization charts
- `test_inference.py` - Test script for validating the API
- `requirements.txt` - Python dependencies
- `README.md` - This documentation file
- `EVALUATION_REPORT.md` - Detailed evaluation report with analysis
- `models/` - Directory containing trained model files (created by train_models.py)
  - `cyber_model.pkl`
  - `missile_model.pkl`
  - `hybrid_model.pkl`
  - `air_model.pkl`
  - `naval_model.pkl`
  - `model_summary.pkl`
  - `evaluation_results.csv` - Raw evaluation metrics
  - `evaluation_visualizations.png` - Performance charts

### Running Evaluation

To evaluate the trained models on train and test datasets:

```bash
# Run comprehensive evaluation
python evaluate_models.py

# Generate visualizations
python visualize_results.py
```

This will:
- Test all models on both training and test sets
- Calculate accuracy, precision, and recall for each threat type
- Generate confusion matrices
- Save results to `models/evaluation_results.csv`
- Create visualization charts in `models/evaluation_visualizations.png`

## Notes

- The current implementation only predicts `response_success` with confidence scores
- `Financial_Loss_MUSD` and `actual_days_to_stabilization` are placeholder values (0.0)
- To predict these additional targets, separate regression models would need to be trained
- The system automatically normalizes threat types (e.g., "Msl" → "missile", case-insensitive)
- Missing features in inference requests are imputed using median values from training data

## Future Enhancements

Potential improvements:
1. Add regression models for Financial_Loss_MUSD and actual_days_to_stabilization
2. Implement model versioning and A/B testing
3. Add monitoring and logging for production deployment
4. Create batch prediction endpoint for large-scale inference
5. Add model explainability features (SHAP values, feature importance)
