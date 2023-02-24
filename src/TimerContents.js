import "./TimerContents.css";
import React, { useState, useEffect } from "react";
import mqtt from "mqtt";

const CHECKBOXES = [
  {
    topic: "muddescapes/data/Security Cameras/disabled",
    name: "Disable security cameras",
  },
  {
    topic: "muddescapes/data/Puzzle 2/Variable 2",
    name: "Steal the most precious artifact",
  },
  {
    topic: "muddescapes/data/Puzzle 3/Variable 3",
    name: "Disable lockdown procedures",
  },
];

function TimerChild() {
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
    <div className="timer-text">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {CHECKBOXES.map(({ name }, idx) => {
          // special case for checkbox 3: only show text if checkbox 2 is checked
          if (idx === 2 && !checkboxStates[1]) {
            name = "???";
          }

          return (
            <div key={name} className="checkbox">
              <input
                type="checkbox"
                id={name}
                checked={checkboxStates[idx]}
                readOnly
              />
              <label htmlFor={name}>{name}</label>
            </div>
          );
        })}
      </form>
    </div>
  );
}

export default function TimerContents(props) {
  const { formattedTime } = props;
  return (
    <>
      <p className="timer">{formattedTime}</p>
      <TimerChild />
    </>
  );
}
