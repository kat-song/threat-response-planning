"""Test the inference endpoint with sample data."""
import requests
import json
import pandas as pd


def test_inference_endpoint():
    """Test the /inference endpoint with sample data."""
    # Sample test data for different threat types
    test_inputs = [
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
        },
        {
            "Threat_Type": "Air",
            "enemy_unit_count": 30,
            "Enemy_Capability_Index": 7.0,
            "ThreatEscalationHours": 8.0,
            "friendlyUnitCount": 100,
            "LCS_COUNT": 2,
            "Aircraft_Count": 25,
            "cyber_defense_teams": 8,
            "Patriot_Batteries": 8,
            "ISR_AssetCount": 15,
            "satellite_coverage_score": 8.5,
            "JointForceIntegration": 9.0,
            "EW_Capability": 7.0,
            "Supply_Chain_Resilience": 8.5,
            "PriorEngagements": 3,
            "force_readiness_score": 9.0,
            "Intel_Confidence": 8.5,
            "ResponseTime_hrs": 3.0,
            "logistics_delay_hours": 1.5,
            "CMD_COORD_SCORE": 9.0,
            "roe_complexity_score": 4.0,
            "Operational_Budget_MUSD": 750.0,
            "BudgetUtilization_pct": 80.0,
            "Weather_Severity": 2.0,
            "Theater_Distance_KM": 1000.0,
            "Season": "Spring"
        },
        {
            "Threat_Type": "Missile",
            "enemy_unit_count": 20,
            "Enemy_Capability_Index": 9.0,
            "ThreatEscalationHours": 6.0,
            "friendlyUnitCount": 90,
            "LCS_COUNT": 4,
            "Aircraft_Count": 15,
            "cyber_defense_teams": 10,
            "Patriot_Batteries": 10,
            "ISR_AssetCount": 25,
            "satellite_coverage_score": 9.0,
            "JointForceIntegration": 8.5,
            "EW_Capability": 8.0,
            "Supply_Chain_Resilience": 7.5,
            "PriorEngagements": 7,
            "force_readiness_score": 8.8,
            "Intel_Confidence": 8.0,
            "ResponseTime_hrs": 2.5,
            "logistics_delay_hours": 1.0,
            "CMD_COORD_SCORE": 8.8,
            "roe_complexity_score": 5.5,
            "Operational_Budget_MUSD": 600.0,
            "BudgetUtilization_pct": 85.0,
            "Weather_Severity": 3.0,
            "Theater_Distance_KM": 1200.0,
            "Season": "Winter"
        }
    ]
    
    url = "http://localhost:8000/inference"
    
    try:
        response = requests.post(url, json=test_inputs)
        response.raise_for_status()
        
        results = response.json()
        
        print("Inference Results:")
        print("=" * 80)
        
        for i, (input_data, output_data) in enumerate(zip(test_inputs, results)):
            print(f"\nTest Case {i+1}:")
            print(f"  Threat Type: {input_data['Threat_Type']}")
            print(f"  Response Success: {output_data['response_success']}")
            print(f"  Confidence: {output_data['response_success_confidence']:.4f} ({output_data['response_success_confidence']*100:.2f}%)")
            print(f"  Financial Loss (placeholder): ${output_data['Financial_Loss_MUSD']:.2f}M")
            print(f"  Days to Stabilization (placeholder): {output_data['actual_days_to_stabilization']:.2f}")
        
        print("\n" + "=" * 80)
        print("All tests passed successfully!")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the inference server.")
        print("Please make sure the server is running with: fastapi dev main.py")
        return False
    except Exception as e:
        print(f"Error during testing: {e}")
        return False


def test_health_check():
    """Test the health check endpoint."""
    url = "http://localhost:8000/"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        result = response.json()
        
        print("Health Check Results:")
        print("=" * 80)
        print(f"  Status: {result['status']}")
        print(f"  Models Loaded: {result['models_loaded']}")
        print(f"  Number of Models: {result['num_models']}")
        print("=" * 80)
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the inference server.")
        print("Please make sure the server is running with: fastapi dev main.py")
        return False
    except Exception as e:
        print(f"Error during health check: {e}")
        return False


if __name__ == "__main__":
    print("\n" + "=" * 80)
    print("Testing Inference Server")
    print("=" * 80)
    
    print("\n1. Testing health check endpoint...")
    health_ok = test_health_check()
    
    if health_ok:
        print("\n2. Testing inference endpoint...")
        inference_ok = test_inference_endpoint()
        
        if inference_ok:
            print("\n✅ All tests passed!")
        else:
            print("\n❌ Inference tests failed")
    else:
        print("\n❌ Health check failed - skipping inference tests")
