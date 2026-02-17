export const runInference = async (formData) => {
    const payload = [
        {
            Threat_Type: formData.Threat_Type?.toLowerCase(),
            enemy_unit_count: formData.enemy_unit_count,
            Enemy_Capability_Index: formData.Enemy_Capability_Index,
            ThreatEscalationHours: formData.ThreatEscalationHours,
            friendlyUnitCount: formData.friendlyUnitCount,
            LCS_COUNT: formData.LCS_COUNT,
            Aircraft_Count: formData.Aircraft_Count,
            cyber_defense_teams: formData.cyber_defense_teams,
            Patriot_Batteries: formData.Patriot_Batteries,
            ISR_AssetCount: formData.ISR_AssetCount,
            satellite_coverage_score: formData.satellite_coverage,
            JointForceIntegration: formData.JointForceIntegration,
            EW_Capability: formData.EW_Capabilities,
            Supply_Chain_Resilience: formData.supply_chain_resilience,
            PriorEngagements: formData.prior_engagements,
            force_readiness_score: formData.force_readiness_score,
            Intel_Confidence: formData.intel_confidence,
            ResponseTime_hrs: 5,
            logistics_delay_hours: 2,
            CMD_COORD_SCORE: 5,
            roe_complexity_score: formData.roe_complexity,
            Operational_Budget_MUSD: formData.operations_budget,
            BudgetUtilization_pct: formData.budget_utilization_pct,
            Weather_Severity: formData.Weather_Severity,
            Theater_Distance_KM: formData.Threat_Distance_KM,
            Season: formData.Season,
        }];

    const response = await fetch("http://localhost:8000/inference", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Inference request failed");
    }

    return response.json();
};
