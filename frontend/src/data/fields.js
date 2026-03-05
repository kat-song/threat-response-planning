export const threatFields = [
    { label: "Threat Type", name: "Threat_Type", type: "select", options: ["Air", "Naval", "Cyber", "Missile", "Hybrid"], description: "Primary type of threat anticipated." },
    { label: "Enemy Unit Count", name: "enemy_unit_count", type: "number", min: 0, description: "Number of enemy units detected in theater. min: 0" },
    { label: "Threat Escalation (Hours)", name: "ThreatEscalationHours", type: "number", min: 0, description: "Expected time in hours for threat escalation." },
    { label: "Threat Distance (KM)", name: "Threat_Distance_KM", type: "number", min: 0, step: 0.1, description: "Distance of threat from friendly forces in kilometers." },
    { label: "Season", name: "Season", type: "select", options: ["Spring", "Summer", "Fall", "Winter"], description: "Current season affecting operational tempo." },
    { label: "Weather Severity", name: "Weather_Severity", type: "number", min: 0, max: 10, step: 0.1, description: "Numeric index of weather severity in the area. min: 0, max: 10" },
    { label: "Response Time (Hours)", name: "ResponseTime_hrs", type: "number", min: 0, step: 0.1, description: "Time (in hours) elapsed between threat detection and the initiation of the response." },
    { label: "Logistics Delay (Hours)", name: "logistics_delay_hours", type: "number", min: 0, step: 0.1, description: "Estimated delay introduced by logistical constraints." },
];

export const forceFields = [
    { label: "Friendly Unit Count", name: "friendlyUnitCount", type: "number", min: 0, description: "Number of friendly units currently available in theater." },
    { label: "Aircraft Count", name: "Aircraft_Count", type: "number", min: 0, description: "Total aircraft assets available for operations." },
    { label: "Satellite Coverage", name: "satellite_coverage", type: "number", min: 0, max: 1, step: 0.1, description: "Number of satellites providing coverage. min: 0, max: 1" },
    { label: "LCS Count", name: "LCS_COUNT", type: "number", min: 0, description: "Number of Littoral Combat Ships deployed." },
    { label: "EW Capability", name: "EW_Capability", type: "number", min: 0, max: 10, description: "Electronic warfare capability index of friendly forces. min: 0, max: 10" },
    { label: "Patriot Batteries", name: "Patriot_Batteries", type: "number", min: 0, description: "Number of Patriot missile batteries available." },
    { label: "ISR Asset Count", name: "ISR_AssetCount", type: "number", min: 0, description: "Number of Intelligence, Surveillance, and Reconnaissance assets." },
    { label: "Cyber Defense Teams", name: "cyber_defense_teams", type: "number", min: 0, description: "Number of cyber defense teams deployed." },
    { label: "Operations Budget", name: "operations_budget", type: "number", min: 0, description: "Current operations budget in MUSD." },
    { label: "Budget Utilization (%)", name: "budget_utilization_pct", type: "number", min: 0, max: 100, step: 0.1, description: "Percentage of operations budget currently utilized. min: 0, max: 100" }
];

export const capabilityFields = [
    { label: "Enemy Capability", name: "Enemy_Capability_Index", type: "number", min: 0, max: 10,step: 0.1, description: "Estimated overall combat capability of the enemy. min: 0, max: 10" },
    { label: "Joint Force Integration", name: "JointForceIntegration", type: "number", min: 0, max: 10, step: 0.1, description: "Level of coordination between joint forces. min: 0, max: 10" },
    { label: "Force Readiness", name: "force_readiness_score", type: "number", min: 0, max: 100, step: 0.1, description: "Percentage readiness of the force for operations. min: 0, max: 100" },
    { label: "Supply Chain Resilience", name: "supply_chain_resilience", type: "number", min: 0, max: 1.0, step: 0.1, description: "Robustness of supply chain and logistics. min: 0, max: 1.0" },
    { label: "Prior Engagements", name: "prior_engagements", type: "number", min: 0, step: 1, description: "Number of prior combat engagements in theater." },
    { label: "Intel Confidence", name: "intel_confidence", type: "number", min: 0, max: 1.0,step: 0.1, description: "Confidence level in current intelligence. min: 0, max: 1.0" },
    { label: "ROE Complexity", name: "roe_complexity", type: "number", min: 0, max: 5, step: 0.1, description: "Complexity of Rules of Engagement affecting operations. min: 0, max: 5" },
    { label: "CMD_COORD_SCORE", name: "CMD_COORD_SCORE", type: "number", min: 0, max: 10, step: 0.1, description: "Command and control coordination score. min: 0, max: 10" }
];
