import { useState, useEffect, useRef } from "react";
import mqtt from "mqtt";

export const CHECKBOXES = [
  {
    topic: "muddescapes/data/Laser Casting/Current state of Laser Casting",
    name: "Win Condition",
  },
];

function inIframe() {
  let ans = true;
  try {
    ans = window.self !== window.top;
  } catch (e) {}
  return ans;
}

export function useCheckboxStates({ onWin }) {
  let [checkboxStates, setCheckboxStates] = useState(
    CHECKBOXES.map(() => false)
  );

  // call callbacks in a separate useEffect to avoid MQTT reconnects
  // every time the arguments are updated
  useEffect(() => {
    // TODO: Hacky solution alert!
    // only set win when outside of iframe to get around some clients mistakenly
    // setting win every second
    // since multiple windows may be open in an iframe due to the control center,
    // but only one window is open outside of the iframe (in the room), this
    // should make only one window set win

    if (!inIframe() && checkboxStates.every((c) => c)) {
      onWin();
    }
  }, [checkboxStates, onWin]);

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

  return [
    checkboxStates,
    () => {
      setCheckboxStates(CHECKBOXES.map(() => false));
    },
  ];
}
