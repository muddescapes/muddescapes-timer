import "./EndScreens.css";
import ReactAudioPlayer from "react-audio-player";

function EndScreen({ children }) {
  return <div className="end-screen">{children}</div>;
}

export function WinScreen({ finishedIn }) {
  return (
    <>
      <EndScreen>
        <video height="100%" autoPlay loop>
          <source src="credits.mp4" type="video/mp4"></source>
        </video>
      </EndScreen>
      <ReactAudioPlayer src="win.mp3" autoPlay loop />
    </>
  );
}

export function LoseScreen() {
  return (
    <>
      <EndScreen>
        <p>You Lose!</p>
      </EndScreen>
      <ReactAudioPlayer src="lose.mp3" autoPlay loop />
    </>
  );
}
