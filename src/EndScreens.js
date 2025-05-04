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
          width="68%"
          height="68%"
          src="creditsfa25.mp4"
          autoPlay
          muted
          loop
        ></video>
      </div>
      <ReactAudioPlayer src="win.mp3" autoPlay volume = {0.05} />
    </div>
  );
}

export function LoseScreen() {
  return (
    <div className="end-screen" style={{ pointerEvents: "none"}}>
      <div style={{position: "absolute"}}>
        <video
          width="68%"
          height="68%"
          src="creditsfa25.mp4"
          volume = {0.00001}
          autoPlay
          muted
          loop
        ></video>
      </div>
      <ReactAudioPlayer src="lose.mp3" autoPlay volume = {0.05} />
    </div>
  );
}