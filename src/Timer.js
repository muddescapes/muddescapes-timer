import { useState, useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import Backdrop from "./Backdrop";
import ConfirmationPopup from "./ConfirmationPopup";
import SettingsPopup from "./SettingsPopup";
import { LoseScreen, WinScreen } from "./EndScreens";

const TIMER_SECS = 3600;
const FIREBASE_COLLECTION = "timers";
const FIREBASE_DOC = "timer1";

function formatSecs(secs) {
  // format time in HH:MM:SS
  return new Date(secs * 1000).toISOString().substring(11, 19);
}

function Timer({ db }) {
  // current time in seconds since the epoch
  const [currTime, setCurrTime] = useState(
    Math.floor(new Date().getTime() / 1000)
  );
  // Create List Confirmation
  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const [settingsPopup, setSettingsPopup] = useState(false);

  function handleConfirmationPopup() {
    setConfirmationPopup(!confirmationPopup);
  }

  function handleSettingsPopup() {
    setConfirmationPopup(false);
    setSettingsPopup(!settingsPopup);
  }

  const [timer, loading, error] = useDocumentData(
    doc(db, FIREBASE_COLLECTION, FIREBASE_DOC)
  );
  if (error) {
    console.error(error);
  }

  const getRemainingSecs = () => {
    if (timer) {
      return timer.startTime
        ? Math.max(timer.secs - (currTime - timer.startTime), 0)
        : timer.secs;
    }
    return -1;
  };

  const onStart = () => {
    updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
      startTime: currTime,
    });
  };

  const onReset = () => {
    updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
      secs: TIMER_SECS,
      startTime: null,
      win: false
    });
  };

  // timer pauses when startTime is null
  const onPause = () => {
    updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
      secs: getRemainingSecs(),
      startTime: null,
    });
  };

  const onWin = () => {
    updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
      secs: getRemainingSecs(),
      startTime: null,
      win: true,
    });
  };

  useEffect(() => {
    // shouldn't cause any re-renders if currTime is not changed,
    // so updating every 100ms should be fine
    const interval = setInterval(() => {
      setCurrTime(Math.floor(new Date().getTime() / 1000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  var formattedTime = null;
  if (timer) {
    formattedTime = formatSecs(getRemainingSecs());
  }

  var content = <h2>{loading ? "loading" : formattedTime}</h2>;
  if (timer?.win) {
    content = (
      <WinScreen timeRemaining={formatSecs(TIMER_SECS - getRemainingSecs())} />
    );
  } else if (getRemainingSecs() === 0) {
    content = <LoseScreen />;
  }

  return (
    <div className="App">
      <div onClick={handleConfirmationPopup}>{content}</div>
      {confirmationPopup && (
        <>
          <Backdrop onClickBackdrop={handleConfirmationPopup} />
          <ConfirmationPopup
            onCorrectPassword={handleSettingsPopup}
            onClosePopup={handleConfirmationPopup}
          />
        </>
      )}
      {settingsPopup && (
        <>
          <Backdrop onClickBackdrop={handleSettingsPopup} />
          <SettingsPopup
            onClosePopup={handleSettingsPopup}
            onResetTimer={onReset}
            onStartTimer={onStart}
            onPauseTimer={onPause}
            onWin={onWin}
          />
        </>
      )}
    </div>
  );
}

export default Timer;
