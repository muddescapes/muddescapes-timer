import "./TimerContents.css";
import React from "react";
import checkmark from "./images/checkmark.svg";
import { CHECKBOXES } from "./hooks";

export default function TimerContents(props) {
  const { formattedTime, checkboxStates } = props;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="mondrian-grid">
        <div
          className="mondrian-grid__blue"
          style={{ gridArea: "1 / 1 / 5 / 1" }}
        ></div>
        <div
          className="mondrian-grid__yellow"
          style={{ gridArea: "5 / 9 / 6 / 12" }}
        ></div>
        <div
          className="mondrian-grid__white"
          style={{ gridArea: "6 / 1 / 7 / 2" }}
        ></div>
        <div
          className="mondrian-grid__blue"
          style={{ gridArea: "6 / 11 / 8 / 12" }}
        ></div>
        <div
          className="mondrian-grid__yellow"
          style={{ gridArea: "7 / 1 / 10 / 2" }}
        ></div>
        <div
          className="mondrian-grid__white"
          style={{ gridArea: "7 / 2 / 9 / 3" }}
        ></div>
        <div
          className="mondrian-grid__red"
          style={{ gridArea: "8 / 3 / 9 / 11" }}
        ></div>
        <div
          className="mondrian-grid__white"
          style={{ gridArea: "8 / 11 / 9 / 12" }}
        ></div>
        <div
          className="mondrian-grid__white"
          style={{ gridArea: "9 / 11 / 12 / 12" }}
        ></div>
        <div
          className="mondrian-grid__red"
          style={{ gridArea: "10 / 1 / 12 / 3" }}
        ></div>
        <div
          className="mondrian-grid__white"
          style={{ gridArea: "11 / 3 / 12 / 11" }}
        ></div>
        <div
          className="mondrian-grid__white"
          style={{ gridArea: "12 / 1 / 13 / 2" }}
        ></div>
        <div
          className="mondrian-grid__yellow"
          style={{ gridArea: "12 / 11 / 15 / 12" }}
        ></div>
        <div
          className="mondrian-grid__white"
          style={{ gridArea: "13 / 3 / 14 / 5" }}
        ></div>
        <div
          className="mondrian-grid__blue"
          style={{ gridArea: "14 / 3 / 15 / 5" }}
        ></div>
        <div
          className="mondrian-grid__red"
          style={{ gridArea: "13 / 5 / 15 / 11" }}
        ></div>
        <div
          className="mondrian-grid__white timer"
          style={{ gridArea: "1 / 2 / 5 / 12" }}
        >
          {/* timer text */}
          <p>{formattedTime}</p>
        </div>
        <div
          className="mondrian-grid__white"
          style={{ gridArea: "6 / 2 / 7 / 3" }}
        >
          {/* step 1 checkbox */}
          {checkboxStates[0] ? (
            <img className="grid-checkmark" src={checkmark} alt="Checkmark" />
          ) : null}
        </div>
        <div
          className="mondrian-grid__white step-title"
          data-completed={checkboxStates[0]}
          style={{ gridArea: "6 / 3 / 8 / 11" }}
        >
          {/* step 1 text */}
          <span>{CHECKBOXES[0].name}</span>
        </div>
        <div
          className="mondrian-grid__white"
          style={{ gridArea: "9 / 2 / 10 / 3" }}
        >
          {/* step 2 checkbox */}
          {checkboxStates[1] ? (
            <img className="grid-checkmark" src={checkmark} alt="Checkmark" />
          ) : null}
        </div>
        <div
          className="mondrian-grid__white step-title"
          data-completed={checkboxStates[1]}
          style={{ gridArea: "9 / 3 / 11 / 11" }}
        >
          {/* step 2 text */}
          <span>{CHECKBOXES[1].name}</span>
        </div>
        <div
          className="mondrian-grid__white"
          style={{ gridArea: "12 / 2 / 13 / 3" }}
        >
          {/* step 3 checkbox */}
          {checkboxStates[2] ? (
            <img className="grid-checkmark" src={checkmark} alt="Checkmark" />
          ) : null}
        </div>
        <div
          className="mondrian-grid__white step-title"
          data-completed={checkboxStates[2]}
          style={{ gridArea: "12 / 3 / 13 / 11" }}
        >
          {/* step 3 text */}
          <span>{!checkboxStates[1] ? "???" : CHECKBOXES[2].name}</span>
        </div>
      </div>
    </div>
  );
}
