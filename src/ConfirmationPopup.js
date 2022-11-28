import "./ConfirmationPopup.css";
import "./Popup.css";
import { useState } from "react";

function ConfirmationPopup(props) {
  const [text, setText] = useState("");

  function onEnterPassword() {
    if (text === "theboss") {
      props.onCorrectPassword()
    }
    setText("");
    props.onClosePopup();
  }

  return (
    <div
      className="confirmation-popup popup"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          props.onClosePopup();
        }
      }}
    >
      <div className="prompt">Please Enter the Password</div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onEnterPassword();
          } 
        }}
      />
      <div className="cancel-ok">
        <button onClick={props.onClosePopup}>Cancel</button>
        <button
          onClick={onEnterPassword}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default ConfirmationPopup;
