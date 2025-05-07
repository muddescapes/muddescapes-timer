import "./EndScreens.css";
import ReactAudioPlayer from "react-audio-player";

// function EndScreen({ children }) {
//   return <div className="end-screen">{children}</div>;
// }

export function WinScreen() {
  return (
    <div className="end-screen" style={{ pointerEvents: "none"}}>
      <div style={{position: "absolute"}}>
        <video
          width="102%"
          height="102%"
          src="https://muddescapes.kev3u.com/creditsfa25.mp4"
          autoPlay
          muted
          loop
        ></video>
      </div>
      <ReactAudioPlayer src="https://muddescapes.kev3u.com/win.mp3" autoPlay volume = {0.05} />
    </div>
  );
}

export function LoseScreen() {
  return (
    <div className="end-screen" style={{ pointerEvents: "none"}}>
      <div style={{position: "absolute"}}>
        <video
          width="102%"
          height="102%"
          src="https://muddescapes.kev3u.com/creditsfa25.mp4"
          volume = {0.00001}
          autoPlay
          muted
          loop
        ></video>
      </div>
      <ReactAudioPlayer src="https://muddescapes.kev3u.com/lose.mp3" autoPlay volume = {0.05} />
    </div>
  );
}