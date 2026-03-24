import { useState } from "react";

import { runInference } from "../services/api";
import { threatFields, forceFields, capabilityFields } from "../data/fields";

import { useTheme } from "styled-components";
import styled from "styled-components";
import { TextInput, Select, Button } from "@trussworks/react-uswds";
import { InfoTooltip } from "../components/InfoTooltip";

const Panel = styled.div`
  background: ${(props) => props.$surface};
  color: ${(props) => props.$text};
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
    color: ${(props) => props.$muted};
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

    // Generate random but valid values for each field based on metadata
    // Returns the generated object so callers can use it immediately (avoids waiting for setState)
    const randomizeForm = () => {
        const allFields = [...threatFields, ...forceFields, ...capabilityFields];
        const next = {};

        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        allFields.forEach((f) => {
            // selects
            if (f.type === "select") {
                next[f.name] = pick(f.options);
                return;
            }

            // numbers (default behavior)
            const min = typeof f.min === "number" ? f.min : 0;
            const max = typeof f.max === "number" ? f.max : Math.max(min + 10, 100);
            const step = typeof f.step === "number" ? f.step : 1;

            let val = Math.random() * (max - min) + min;
            if (step >= 1) {
                val = Math.round(val);
            } else {
                // round to nearest step
                val = Math.round(val / step) * step;
            }

            next[f.name] = val;
        });

        // Ensure keys that the backend expects but may have different names are set
        // (mapping used by runInference)
        // e.g., `operations_budget` -> `Operational_Budget_MUSD` is mapped inside runInference,
        // so we populate `operations_budget` here because that's the form field name.

        setFormData((prev) => ({ ...prev, ...next }));
        setSubmitted(false);
        return next;
    };

    const randomizeAndRun = async () => {
        const next = randomizeForm();

        try {
            const result = await runInference(next);
            const inference = result[0];

            setFormData((prev) => ({
                ...prev,
                ...next,
                Financial_Loss_MUSD: inference.Financial_Loss_MUSD,
                days_to_stabilization: inference.actual_days_to_stabilization,
                response_success: inference.response_success ? "SUCCESS" : "FAILURE",
                response_success_confidence: inference.response_success_confidence,
            }));

            setSubmitted(true);
        } catch (err) {
            console.error("Randomize+Run failed:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(false);

        try {
            const result = await runInference(formData);

            const inference = result[0];

            setFormData((prev) => ({
                ...prev,
                Financial_Loss_MUSD: inference.Financial_Loss_MUSD,
                days_to_stabilization: inference.actual_days_to_stabilization,
                response_success: inference.response_success ? "SUCCESS" : "FAILURE",
                response_success_confidence: inference.response_success_confidence,
            }));

            setSubmitted(true);
        } catch (error) {
            console.error(error);
        }
    };

    const formatDays = (days) => {
        if (days === null || days === undefined || days === "") return "—";
        const value = Number(days);
        if (Number.isNaN(value)) return "—";
        return Math.round(value);
    };

    const formatLoss = (loss) => {
        if (loss === null || loss === undefined || loss === "") return "—";
        const value = Number(loss);
        if (Number.isNaN(value)) return "—";
        return value.toFixed(1);
    };

    const getSuccessColor = (confidence) => {
        if (confidence === null || confidence === undefined || Number.isNaN(Number(confidence))) {
            return textPrimary;
        }
        const v = Math.max(0, Math.min(1, Number(confidence)));
        // Red at 0, green at 1, smooth spectrum
        const hue = Math.round(0 + v * 120);
        return `hsl(${hue}, 85%, 42%)`;
    };

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
            value: formData[field.name] ?? "",
        };

        return (
            <div key={field.name} className="margin-bottom-2">
                <label
                    className="usa-label margin-top-0"
                    htmlFor={field.name}
                    style={{ color: textPrimary, display: "flex", alignItems: "center" }}
                >
                    {field.label}
                    <InfoTooltip
                        description={field.description}
                        surfaceAlt={surfaceAlt}
                        text={textPrimary}
                        primary={primary}
                    />
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

    return (
        <div
            className="grid-container padding-y-5 dashboard-root"
            style={{ background: "transparent", minHeight: "100vh" }}
        >
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
                        <div style={{ marginTop: "0.5rem" }}>
                            <Button type="button" onClick={randomizeAndRun} style={{ marginRight: "0.5rem" }}>
                                Randomize Inputs
                            </Button>
                        </div>
                    </div>

                    <div className="grid-col-12 tablet:grid-col-4">
                        <Panel $surface={surface} $text={textPrimary}>
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
                <div
                    className="margin-bottom-4 padding-2"
                    style={{
                        background: surfaceAlt,
                        color: textPrimary,
                        border: `1px solid ${border}`,
                        borderRadius: "8px",
                    }}
                >
                    <strong>Plan Submitted:</strong> Operational response configuration recorded successfully.
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid-row grid-gap">
                    <div className="grid-col-12 tablet:grid-col-8">
                        <Panel className="margin-bottom-3" $surface={surface} $text={textPrimary}>
                            <PanelHeader $muted={textMuted}>
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
                        <Panel className="margin-bottom-3" $surface={surface} $text={textPrimary}>
                            <PanelHeader $muted={textMuted}>
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
                        <Panel className="margin-bottom-3" $surface={surface} $text={textPrimary}>
                            <PanelHeader $muted={textMuted}>
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
                            <Panel className="margin-bottom-3" $surface={surface} $text={textPrimary}>
                                <PanelHeader $muted={textMuted}>
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
                                        <div
                                            className="font-sans-2xl text-bold kpiValue"
                                            style={{ color: getSuccessColor(formData.response_success_confidence) }}
                                        >
                                            {formData.response_success || "—"}
                                        </div>
                                        <div className="text-base" style={{ color: textPrimary }}>
                                            {formData.response_success_confidence !== undefined && formData.response_success_confidence !== null
                                                ? `${(Number(formData.response_success_confidence) * 100).toFixed(1)}% confidence`
                                                : "—"}
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
                                            {formatLoss(formData.Financial_Loss_MUSD)}
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
                                            {formatDays(formData.days_to_stabilization)}
                                        </div>
                                        <div className="text-base subtle" style={{ color: textMuted }}>
                                            Time to stable operating conditions.
                                        </div>
                                    </div>
                                </PanelBody>
                            </Panel>

                            <Panel $surface={surface} $text={textPrimary}>
                                <PanelHeader $muted={textMuted}>
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
