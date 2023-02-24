import "./TimerContents.css";
import React, { useState, useEffect } from "react";
import mqtt from "mqtt";
import checkmark from "./images/checkmark.svg";

const CHECKBOXES = [
  {
    topic: "muddescapes/data/Security Cameras/disabled",
    name: "Disable the security cameras",
  },
  {
    topic: "muddescapes/data/Puzzle 2/Variable 2",
    name: "Steal the most precious artifact",
  },
  {
    topic: "muddescapes/data/Puzzle 3/Variable 3",
    name: "Disarm the alarm",
  },
];

export default function TimerContents(props) {
  const { formattedTime } = props;
  let [checkboxStates, setCheckboxStates] = useState(
    CHECKBOXES.map(() => false)
  );

  useEffect(() => {
    const client = mqtt.connect("wss://broker.hivemq.com:8884", {
      path: "/mqtt",
    });

    client.on("connect", () => {
      console.debug("connected");

      CHECKBOXES.forEach(({ topic }) => {
        client.subscribe(topic, { qos: 2 });
      });

      // request variable updates from puzzles
      client.publish("muddescapes", "", { qos: 1 });
    });

    client.on("message", (topic, message) => {
      const idx = CHECKBOXES.findIndex(({ topic: t }) => t === topic);
      if (idx >= 0) {
        setCheckboxStates((curr) => {
          const newStates = [...curr];
          newStates[idx] = message.toString() === "1";
          return newStates;
        });
      }
    });

    return () => {
      client.end();
    };
  }, []);

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
          {formattedTime}
        </div>
        <div
          className="mondrian-grid__white"
          style={{ gridArea: "6 / 2 / 7 / 3" }}
        >
          {/* step 1 checkbox */}
          {checkboxStates[0] ? <img src={checkmark} alt="Checkmark" /> : null}
        </div>
        <div
          className="mondrian-grid__white step-title"
          data-completed={checkboxStates[0]}
          style={{ gridArea: "6 / 3 / 8 / 11" }}
        >
          {/* step 1 text */}
          {CHECKBOXES[0].name}
        </div>
        <div
          className="mondrian-grid__white"
          style={{ gridArea: "9 / 2 / 10 / 3" }}
        >
          {/* step 2 checkbox */}
          {checkboxStates[1] ? <img src={checkmark} alt="Checkmark" /> : null}
        </div>
        <div
          className="mondrian-grid__white step-title"
          data-completed={checkboxStates[1]}
          style={{ gridArea: "9 / 3 / 11 / 11" }}
        >
          {/* step 2 text */}
          {CHECKBOXES[1].name}
        </div>
        <div
          className="mondrian-grid__white"
          style={{ gridArea: "12 / 2 / 13 / 3" }}
        >
          {/* step 3 checkbox */}
          {checkboxStates[2] ? <img src={checkmark} alt="Checkmark" /> : null}
        </div>
        <div
          className="mondrian-grid__white step-title"
          data-completed={checkboxStates[2]}
          style={{ gridArea: "12 / 3 / 13 / 11" }}
        >
          {/* step 3 text */}
          {!checkboxStates[1] ? "???" : CHECKBOXES[2].name}
        </div>
      </div>
    </div>
  );
}
