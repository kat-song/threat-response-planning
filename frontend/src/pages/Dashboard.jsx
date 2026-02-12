import React, { useState } from "react";
import {
  TextInput,
  Select,
  Button,
  Card,
  CardHeader,
  CardBody,
  Alert
} from "@trussworks/react-uswds";
import "@trussworks/react-uswds/lib/uswds.css";

const Dashboard = () => {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("Operational Plan:", formData);
  };

  // Horizontal input renderer
  const renderHorizontalInput = (field) => (
    <div className="grid-row grid-gap-2 margin-bottom-2" key={field.name}>
      <div className="grid-col-5 tablet:grid-col-4 text-right">
        <label className="usa-label" htmlFor={field.name}>
          {field.label}
        </label>
      </div>
      <div className="grid-col-7 tablet:grid-col-8">
        <TextInput
          id={field.name}
          name={field.name}
          type={field.type || "number"}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={handleChange}
          className="usa-input--medium"
        />
      </div>
    </div>
  );

  const renderHorizontalSelect = (field) => (
    <div className="grid-row grid-gap-2 margin-bottom-2" key={field.name}>
      <div className="grid-col-5 tablet:grid-col-4 text-right">
        <label className="usa-label" htmlFor={field.name}>
          {field.label}
        </label>
      </div>
      <div className="grid-col-7 tablet:grid-col-8">
        <Select
          id={field.name}
          name={field.name}
          onChange={handleChange}
          className="usa-input--medium"
        >
          <option value="">- Select -</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );

  return (
    <div className="grid-container padding-y-5">

      {/* HEADER */}
      <header className="margin-bottom-5">
        <h1 className="font-heading-xl margin-0">
          Operational Response Command Dashboard
        </h1>
        <p className="text-base text-gray-60 margin-top-1">
          Configure threat assessment and force posture for response planning.
        </p>
      </header>

      {submitted && (
        <Alert type="success" heading="Plan Submitted" className="margin-bottom-4">
          Operational response configuration recorded successfully.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>

        {/* THREAT & LIVE SUMMARY */}
        <div className="grid-row grid-gap margin-bottom-5">

          {/* Threat & Environment */}
          <div className="tablet:grid-col-8">
            <Card>
              <CardHeader>
                <h2 className="usa-card__heading">Threat & Environment</h2>
              </CardHeader>
              <CardBody>
                {[
                  { label: "Threat Type", name: "Threat_Type", type: "select", options: ["Air","Naval","Cyber","Missile","Hybrid"] },
                  { label: "Enemy Unit Count", name: "enemy_unit_count" },
                  { label: "Threat Escalation (Hours)", name: "ThreatEscalationHours" },
                  { label: "Threat Distance (KM)", name: "Threat_Distance_KM", step: 0.1 },
                  { label: "Season", name: "Season", type: "select", options: ["Spring","Summer","Fall","Winter"] },
                  { label: "Weather Severity", name: "Weather_Severity", step: 0.1 }
                ].map(field => field.type === "select" ? renderHorizontalSelect(field) : renderHorizontalInput(field))}
              </CardBody>
            </Card>
          </div>

          {/* Live Summary */}
          <div className="tablet:grid-col-4">
            <Card>
              <CardHeader>
                <h2 className="usa-card__heading">Live Summary</h2>
              </CardHeader>
              <CardBody>
                {[
                  { label: "Response Success", name: "response_success" },
                  { label: "Financial Loss (MUSD)", name: "Financial_Loss_MUSD" },
                  { label: "Days to Stabilization", name: "days_to_stabilization" }
                ].map(item => (
                  <p key={item.name}><strong>{item.label}:</strong> {formData[item.name] || "-"}</p>
                ))}
              </CardBody>
            </Card>
          </div>
        </div>

        {/* FORCE ALLOCATION */}
        <Card className="margin-bottom-5">
          <CardHeader>
            <h2 className="usa-card__heading">Force Allocation</h2>
          </CardHeader>
          <CardBody>
            {[
              "friendlyUnitCount",
              "Aircraft_Count",
              "satellite_coverage",
              "LCS_COUNT",
              "EW_Capabilities",
              "Patriot_Batteries",
              "ISR_AssetCount",
              "cyber_defense_teams",
              "operations_budget",
              "budget_utilization_pct"
            ].map(name =>
              renderHorizontalInput({
                label: name.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase()),
                name
              })
            )}
          </CardBody>
        </Card>

        {/* OPERATIONAL CAPABILITY SCORES */}
        <Card className="margin-bottom-5">
          <CardHeader>
            <h2 className="usa-card__heading">Operational Capability Scores</h2>
          </CardHeader>
          <CardBody>
            {[
              { label: "Enemy Capability", name: "Enemy_Capability_Index", min:0,max:10 },
              { label: "Joint Force Integration", name: "JointForceIntegration", min:0,max:10 },
              { label: "Force Readiness", name: "force_readiness_score", min:0,max:100 },
              { label: "Supply Chain Resilience", name: "supply_chain_resilience", min:0,max:100 },
              { label: "Prior Engagements", name: "prior_engagements", min:0,max:100 },
              { label: "Intel Confidence", name: "intel_confidence", min:0,max:100 },
              { label: "ROE Complexity", name: "roe_complexity", min:0,max:100 }
            ].map(renderHorizontalInput)}
          </CardBody>
        </Card>

        {/* SUBMIT */}
        <div className="text-right">
          <Button type="submit" className="margin-bottom-5">
            Finalize Operational Plan
          </Button>
        </div>

      </form>
    </div>
  );
};

export default Dashboard;
