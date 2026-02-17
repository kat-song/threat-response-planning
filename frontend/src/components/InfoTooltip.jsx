import { useState } from "react";
import styled from "styled-components";

const TooltipWrapper = styled.span`
  position: relative;
  display: inline-block;
  margin-left: 0.25rem;
`;

// Prevent 'visible' from being passed to the DOM
const TooltipText = styled.span.withConfig({
    shouldForwardProp: (prop) => prop !== "visible",
})`
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
  width: max-content;
  max-width: 220px;
  background-color: #ebeeff;
  color: #000;
  text-align: left;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  position: absolute;
  z-index: 10;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #ebeeff transparent transparent transparent;
  }
`;

const InfoIcon = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #0071bc;
  color: white;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
`;

export const InfoTooltip = ({ description }) => {
    const [visible, setVisible] = useState(false);

    return (
        <TooltipWrapper
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            <InfoIcon>i</InfoIcon>
            <TooltipText visible={visible}>{description}</TooltipText>
        </TooltipWrapper>
    );
};
