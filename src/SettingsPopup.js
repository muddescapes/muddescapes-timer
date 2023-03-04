import "./Popup.css";
import { useEffect } from "react";

function SettingsPopup(props) {
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        props.onClosePopup();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [props]);

  function callThenClose(fn) {
    return () => {
      fn();
      props.onClosePopup();
    };
  }

  return (
    <div className="popup">
      <div className="prompt">Settings</div>
      <div className="cancel-ok">
        <button onClick={callThenClose(props.onResetTimer)}>Reset</button>
        <button onClick={callThenClose(props.onStartTimer)}>Start</button>
        <button onClick={callThenClose(props.onPauseTimer)}>Pause</button>
      </div>
      <div className="cancel-ok">
        <button onClick={callThenClose(props.onWin)}>Win game</button>
      </div>

      <div className="cancel-ok">
        <button onClick={props.onClosePopup}>Close</button>
      </div>
    </div>
  );
}

export default SettingsPopup;
