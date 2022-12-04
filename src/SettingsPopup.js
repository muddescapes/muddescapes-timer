import "./Popup.css";

function SettingsPopup(props) {
  function callThenClose(fn) {
    return () => {
      fn();
      props.onClosePopup();
    };
  }

  return (
    <div
      className="popup"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          props.onClosePopup();
        }
      }}
    >
      <div className="prompt">Settings</div>
      <div className="cancel-ok">
        <button onClick={callThenClose(props.onResetTimer)}>Reset timer</button>
        <button onClick={callThenClose(props.onStartTimer)}>Start timer</button>
        <button onClick={callThenClose(props.onPauseTimer)}>Pause timer</button>
      </div>
      <div className="cancel-ok">
        <button onClick={props.onClosePopup}>Close</button>
      </div>
    </div>
  );
}

export default SettingsPopup;
