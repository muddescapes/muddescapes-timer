import "./EndScreens.css";
import ReactAudioPlayer from "react-audio-player";

// function EndScreen({ children }) {
//   return <div className="end-screen">{children}</div>;
// }

export function WinScreen({ finishedIn }) {
  return (
    <div className="end-screen" style={{ pointerEvents: "none"}}>
      <div style={{position: "absolute"}}>
        <video
          width="120%"
          height="120%"
          src="win_video.mp4"
          autoPlay
          muted
          loop
        ></video>
      </div>
      <ReactAudioPlayer src="win.mp3" autoPlay />
    </div>
  );
}

export function LoseScreen() {
  return (
    <div className="end-screen" style={{ pointerEvents: "none"}}>
      <div style={{position: "absolute"}}>
        <video
          width="120%"
          height="120%"
          src="lose_video.mp4"
          autoPlay
          muted
          loop
        ></video>
      </div>
      <ReactAudioPlayer src="lose.mp3" autoPlay />
    </div>
  );
}
