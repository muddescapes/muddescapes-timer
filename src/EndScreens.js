import "./EndScreens.css";
import ReactAudioPlayer from "react-audio-player";

function EndScreen({ children, lose }) {
  return (
    <div className="end-screen" style={{backgroundColor: lose ? "#970303" : "#26790a"}}>
      <div className="end-screen__credits">
        <p className="end-screen__title">President</p>
        <p>Ashley Cheung</p>
        <p className="end-screen__title">Vice President</p>
        <p>Katheryn Wang</p>
        <p className="end-screen__title">Aesthetics</p>
        <p>Isabelle Ancajas</p>
        <p>Naomi Horiguchi</p>
        <p>Tatiana Cardoso</p>
        <p>Taylor Levinson</p>
      </div>
      <div>
        {children}
        <p>Want to help next semester? Scan the QR code!</p>
        <img
          src="https://i.imgur.com/dkGtSlc.png"
          alt="Interest form QR code"
          className="end-screen__qr"
        />
      </div>
      <div className="end-screen__credits">
        <p className="end-screen__title">Puzzle Designers</p>
        <p>Aanya Pratapneni</p>
        <p>Adam Tang</p>
        <p>Bryn Schoen</p>
        <p>Cedar Turek</p>
        <p>Cristian Gonzalez</p>
        <p>Ethan Lotan</p>
        <p>Ethan Vazquez</p>
        <p>Evan Bourke</p>
        <p>Jasper Cox</p>
        <p>Joshua Zhong</p>
        <p>Kishore Rajesh</p>
        <p>Naomi Horiguchi</p>
        <p>Nathan Roche</p>
        <p>Nina Jobanputra</p>
      </div>
    </div>
  );
}

export function WinScreen({ timeRemaining }) {
  return (
    <EndScreen>
      <h1 className="end-screen__thanks">Thank you!</h1>
      <h1>CONGRATULATIONS!</h1>
      <p>You escaped the library in {timeRemaining}!</p>
      <ReactAudioPlayer src="win.mp3" autoPlay />
    </EndScreen>
  );
}

export function LoseScreen() {
  return (
    <EndScreen lose>
      <h1>YOU DIED</h1>
      <h2>Better luck next time!</h2>
      <ReactAudioPlayer src="lose.mp3" autoPlay />
    </EndScreen>
  );
}
