import "./TimerContents.css";
import React from "react";

export default function TimerContents({ loading, videoStarted }) {
  if (loading) {
    return <div className="timer-contents">loading</div>;
  }

  if (videoStarted) {
    return (
      <div className="timer-contents" style={{pointerEvents: "none"}}>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube-nocookie.com/embed/CQ2z5sRHxSM?si=5Q7ePK2x1Dr4Ux6i&amp;autoplay=1&amp;playsinline=1&amp;controls=0"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    );
  }

  return (
    <div className="timer-contents">
      <img src="fields.png" alt="start" />
    </div>
  );
}
