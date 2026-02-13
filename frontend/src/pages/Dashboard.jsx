import { useState } from "react";
import { useTheme } from "styled-components";
import styled from "styled-components";
import { TextInput, Select, Button, Alert } from "@trussworks/react-uswds";

const Panel = styled.div`
  background: ${(props) => props.surface};
  color: ${(props) => props.text};
  border: none;
  border-radius: 8px;
  box-shadow: none;
  padding: 1.5rem;
`;

const PanelHeader = styled.div`
  margin-bottom: 0.75rem;
  h2 {
    margin: 0;
    color: inherit;
  }
  p {
    margin: 0.35rem 0 0;
    color: ${(props) => props.muted};
  }
`;

const PanelBody = styled.div``;

const Dashboard = () => {
  const theme = useTheme();
  const surface = theme.colors.bg.baseLight;
  const surfaceAlt = theme.colors.bg.baseLighter;
  const textPrimary = theme.colors.text.baseDarkest;
  const textMuted = theme.colors.text.baseAccent;
  const border = theme.colors.bg.baseDark;
  const primary = theme.colors.primary;

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

  // Compact field renderer (label above input; better for dense dashboards)
  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      onChange: handleChange,
      className: "usa-input",
      style: {
        background: surfaceAlt,
        color: textPrimary,
        borderColor: border,
        boxShadow: "none",
        outline: "none",
      },
    };

    return (
      <div key={field.name} className="margin-bottom-2">
        <label
          className="usa-label margin-top-0"
          htmlFor={field.name}
          style={{ color: textPrimary }}
        >
          {field.label}
        </label>

        {field.type === "select" ? (
          <Select {...commonProps}>
            <option value="">- Select -</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        ) : (
          <TextInput
            {...commonProps}
            type={field.type || "number"}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        )}
      </div>
    );
  };

  const threatFields = [
    { label: "Threat Type", name: "Threat_Type", type: "select", options: ["Air", "Naval", "Cyber", "Missile", "Hybrid"] },
    { label: "Enemy Unit Count", name: "enemy_unit_count", type: "number", min: 0 },
    { label: "Threat Escalation (Hours)", name: "ThreatEscalationHours", type: "number", min: 0 },
    { label: "Threat Distance (KM)", name: "Threat_Distance_KM", type: "number", min: 0, step: 0.1 },
    { label: "Season", name: "Season", type: "select", options: ["Spring", "Summer", "Fall", "Winter"] },
    { label: "Weather Severity", name: "Weather_Severity", type: "number", min: 0, step: 0.1 },
  ];

  const forceFields = [
    "friendlyUnitCount",
    "Aircraft_Count",
    "satellite_coverage",
    "LCS_COUNT",
    "EW_Capabilities",
    "Patriot_Batteries",
    "ISR_AssetCount",
    "cyber_defense_teams",
    "operations_budget",
    "budget_utilization_pct",
  ].map((name) => ({
    label: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    name,
    type: "number",
    min: 0,
    ...(name === "budget_utilization_pct" ? { max: 100, step: 0.1 } : {}),
  }));

  const capabilityFields = [
    { label: "Enemy Capability", name: "Enemy_Capability_Index", type: "number", min: 0, max: 10, step: 0.1 },
    { label: "Joint Force Integration", name: "JointForceIntegration", type: "number", min: 0, max: 10, step: 0.1 },
    { label: "Force Readiness", name: "force_readiness_score", type: "number", min: 0, max: 100, step: 0.1 },
    { label: "Supply Chain Resilience", name: "supply_chain_resilience", type: "number", min: 0, max: 100, step: 0.1 },
    { label: "Prior Engagements", name: "prior_engagements", type: "number", min: 0, max: 100, step: 1 },
    { label: "Intel Confidence", name: "intel_confidence", type: "number", min: 0, max: 100, step: 0.1 },
    { label: "ROE Complexity", name: "roe_complexity", type: "number", min: 0, max: 100, step: 0.1 },
  ];

  return (
    <div
      className="grid-container padding-y-5 dashboard-root"
      style={{ background: "transparent", minHeight: "100vh" }}
    >
      {/* Bullet/marker kill + small polish */}
      <style>{`
        .dashboard-root li::marker { content: "" !important; }
        .dashboard-root li { list-style: none !important; }
        .dashboard-root ul, .dashboard-root ol { padding-left: 0; margin-left: 0; }

        .dashboard-root .subtle { color: ${textMuted}; }
        .dashboard-root .sticky { position: sticky; top: 1rem; }
        .dashboard-root .kpi { border-left: 0.25rem solid ${primary}; padding-left: 1rem; }
        .dashboard-root .kpiValue { line-height: 1.1; }

        /* Normalize form chrome to prevent hue flicker */
        .dashboard-root .usa-input,
        .dashboard-root .usa-select {
          background: ${surfaceAlt} !important;
          color: ${textPrimary} !important;
          border: 1px solid ${border} !important;
          box-shadow: none !important;
          outline: none !important;
          transition: none !important;
          -webkit-appearance: none;
          appearance: none;
          caret-color: ${textPrimary};
        }
        .dashboard-root .usa-input:hover,
        .dashboard-root .usa-select:hover,
        .dashboard-root .usa-input:active,
        .dashboard-root .usa-select:active,
        .dashboard-root .usa-input:focus,
        .dashboard-root .usa-select:focus,
        .dashboard-root .usa-input:focus-visible,
        .dashboard-root .usa-select:focus-visible,
        .dashboard-root .usa-input:focus-within,
        .dashboard-root .usa-select:focus-within,
        .dashboard-root .usa-input:invalid,
        .dashboard-root .usa-select:invalid {
          background: ${surfaceAlt} !important;
          color: ${textPrimary} !important;
          border-color: ${primary} !important;
          box-shadow: 0 0 0 2px ${theme.colors.primaryLightest} !important;
          outline: none !important;
        }
        .dashboard-root input:-webkit-autofill,
        .dashboard-root input:-webkit-autofill:hover,
        .dashboard-root input:-webkit-autofill:focus,
        .dashboard-root select:-webkit-autofill,
        .dashboard-root select:-webkit-autofill:hover,
        .dashboard-root select:-webkit-autofill:focus {
          -webkit-text-fill-color: ${textPrimary} !important;
          box-shadow: 0 0 0px 1000px ${surfaceAlt} inset !important;
          transition: background-color 0s ease-in-out 0s !important;
          border: 1px solid ${primary} !important;
        }

        /* Kill USWDS card chrome (inner outline) */
        .dashboard-root .usa-card,
        .dashboard-root .usa-card__container {
          box-shadow: none !important;
          border: none !important;
          border-radius: 8px !important;
          outline: none !important;
          background-clip: padding-box !important;
        }
        .dashboard-root .usa-card::before,
        .dashboard-root .usa-card::after,
        .dashboard-root .usa-card__container::before,
        .dashboard-root .usa-card__container::after {
          content: none !important;
          display: none !important;
        }
        .dashboard-root .usa-card__header,
        .dashboard-root .usa-card__body {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          background-clip: padding-box !important;
        }
      `}</style>

      {/* HEADER */}
      <header className="margin-bottom-4">
        <div className="grid-row grid-gap">
          <div className="grid-col-12 tablet:grid-col-8">
            <h1 className="font-heading-xl margin-0" style={{ color: textPrimary }}>
              Operational Response Command Dashboard
            </h1>
            <p
              className="text-base subtle margin-top-1 margin-bottom-0"
              style={{ color: textMuted }}
            >
              Configure threat assessment and force posture for response planning.
            </p>
          </div>

          <div className="grid-col-12 tablet:grid-col-4">
            <Panel surface={surface} text={textPrimary}>
              <PanelBody>
                <div className="text-base text-bold" style={{ color: textPrimary }}>
                  System Status
                </div>
                <div className="font-sans-lg text-bold" style={{ color: textPrimary }}>
                  READY
                </div>
                <div className="text-base subtle" style={{ color: textMuted }}>
                  Awaiting submission
                </div>
              </PanelBody>
            </Panel>
          </div>
        </div>
      </header>

      {submitted && (
        <Alert
          type="success"
          heading="Plan Submitted"
          className="margin-bottom-4"
          style={{ background: surfaceAlt, color: textPrimary, borderColor: border }}
        >
          Operational response configuration recorded successfully.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid-row grid-gap">
          {/* LEFT MAIN */}
          <div className="grid-col-12 tablet:grid-col-8">
            {/* Threat & Environment */}
            <Panel className="margin-bottom-3" surface={surface} text={textPrimary}>
              <PanelHeader muted={textMuted}>
                <h2>Threat &amp; Environment</h2>
                <p className="text-base subtle margin-top-1 margin-bottom-0">
                  Primary threat drivers and environmental conditions.
                </p>
              </PanelHeader>
              <PanelBody>
                <div className="grid-row grid-gap">
                  {threatFields.map((f) => (
                    <div key={f.name} className="grid-col-12 tablet:grid-col-6">
                      {renderField(f)}
                    </div>
                  ))}
                </div>
              </PanelBody>
            </Panel>

            {/* Force Allocation */}
            <Panel className="margin-bottom-3" surface={surface} text={textPrimary}>
              <PanelHeader muted={textMuted}>
                <h2>Force Allocation</h2>
                <p className="text-base subtle margin-top-1 margin-bottom-0">
                  Available assets and budget posture.
                </p>
              </PanelHeader>
              <PanelBody>
                <div className="grid-row grid-gap">
                  {forceFields.map((f) => (
                    <div key={f.name} className="grid-col-12 tablet:grid-col-6">
                      {renderField(f)}
                    </div>
                  ))}
                </div>
              </PanelBody>
            </Panel>

            {/* Operational Capability Scores */}
            <Panel className="margin-bottom-3" surface={surface} text={textPrimary}>
              <PanelHeader muted={textMuted}>
                <h2>Operational Capability Scores</h2>
                <p className="text-base subtle margin-top-1 margin-bottom-0">
                  Readiness, resilience, and confidence indicators.
                </p>
              </PanelHeader>
              <PanelBody>
                <div className="grid-row grid-gap">
                  {capabilityFields.map((f) => (
                    <div key={f.name} className="grid-col-12 tablet:grid-col-6">
                      {renderField(f)}
                    </div>
                  ))}
                </div>
              </PanelBody>
            </Panel>

            {/* Submit */}
            <div className="display-flex flex-justify-end">
              <Button
                type="submit"
                className="margin-top-1 margin-bottom-5"
                style={{ background: primary, borderColor: border }}
              >
                Finalize Operational Plan
              </Button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="grid-col-12 tablet:grid-col-4">
            <div className="sticky">
              <Panel className="margin-bottom-3" surface={surface} text={textPrimary}>
                <PanelHeader muted={textMuted}>
                  <h2>Live Summary</h2>
                  <p className="text-base subtle margin-top-1 margin-bottom-0">
                    Displays computed outputs (populated when your model updates them).
                  </p>
                </PanelHeader>
                <PanelBody>
                  <div className="kpi margin-bottom-2">
                    <div className="text-base text-bold" style={{ color: textPrimary }}>
                      Response Success
                    </div>
                    <div className="font-sans-2xl text-bold kpiValue" style={{ color: textPrimary }}>
                      {formData.response_success || "—"}
                    </div>
                    <div className="text-base subtle" style={{ color: textMuted }}>
                      Projected mission outcome probability.
                    </div>
                  </div>

                  <div className="kpi margin-bottom-2">
                    <div className="text-base text-bold" style={{ color: textPrimary }}>
                      Financial Loss (MUSD)
                    </div>
                    <div className="font-sans-2xl text-bold kpiValue" style={{ color: textPrimary }}>
                      {formData.Financial_Loss_MUSD || "—"}
                    </div>
                    <div className="text-base subtle" style={{ color: textMuted }}>
                      Estimated loss given current posture.
                    </div>
                  </div>

                  <div className="kpi">
                    <div className="text-base text-bold" style={{ color: textPrimary }}>
                      Days to Stabilization
                    </div>
                    <div className="font-sans-2xl text-bold kpiValue" style={{ color: textPrimary }}>
                      {formData.days_to_stabilization || "—"}
                    </div>
                    <div className="text-base subtle" style={{ color: textMuted }}>
                      Time to stable operating conditions.
                    </div>
                  </div>
                </PanelBody>
              </Panel>

              <Panel surface={surface} text={textPrimary}>
                <PanelHeader muted={textMuted}>
                  <h2>Assumptions</h2>
                </PanelHeader>
                <PanelBody>
                  <ul className="usa-list" style={{ color: textPrimary }}>
                    <li>Inputs represent baseline theater availability and readiness.</li>
                    <li>Weather + season influence tempo and stabilization timeline.</li>
                    <li>Distance impacts response time and expected risk exposure.</li>
                  </ul>
                </PanelBody>
              </Panel>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;
