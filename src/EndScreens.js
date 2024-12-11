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
          src="https://muddescapes.kev3u.com/win_video.mp4"
          autoPlay
          muted
          loop
        ></video>
      </div>
      <ReactAudioPlayer src="https://muddescapes.kev3u.com/win.mp3" autoPlay />
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
          src="https://muddescapes.kev3u.com/lose_video.mp4"
          autoPlay
          muted
          loop
        ></video>
      </div>
      <ReactAudioPlayer src="https://muddescapes.kev3u.com/lose.mp3" autoPlay />
    </div>
  );
}
