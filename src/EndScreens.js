import "./EndScreens.css";
import ReactAudioPlayer from "react-audio-player";

function EndScreen({ children }) {
  return <div className="end-screen">{children}</div>;
}

export function WinScreen({ finishedIn }) {
  return (
    <>
      <EndScreen>
        <p>Congratulations!</p>
        <p>You escaped in {finishedIn}</p>
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
