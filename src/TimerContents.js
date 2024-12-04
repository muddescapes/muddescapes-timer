import "./TimerContents.css";
import React from "react";

export default function TimerContents({ loading, formattedTime }) {
  if (loading) {
    return <div className="timer-contents">loading</div>;
  }

  return (
    <div className="timer-contents" style={{ pointerEvents: "none"}}>
      <div style={{position: "absolute"}}>
        <video
          width="180%"
          height="180%"
          src="bg_video.mp4"
          autoPlay
          muted
          loop
        ></video>
        <span id="timer-time">{formattedTime}</span>
      </div>
    </div>
  );
}
