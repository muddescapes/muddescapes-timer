import "./TimerContents.css";
import React from "react";

export default function TimerContents({ formattedTime }) {
  return <div className="timer-contents">{formattedTime}</div>;
}
