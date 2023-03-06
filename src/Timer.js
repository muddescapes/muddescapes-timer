import React, { useState, useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import Backdrop from "./Backdrop";
import SettingsPopup from "./SettingsPopup";
import TimerContents from "./TimerContents";
import { LoseScreen, WinScreen } from "./EndScreens";
import ReactAudioPlayer from "react-audio-player";

const TIMER_SECS = 3599; // 59:59 so we never need to show the hours
const FIREBASE_COLLECTION = "timers";
const FIREBASE_DOC = "timer1";

function formatSecs(secs) {
  // format time in MM:SS
  return new Date(secs * 1000).toISOString().substring(14, 19);
}

function Timer({ db }) {
  // ref for audio player to play sound when settings popup opens
  // cannot autoplay due to browser restrictions (must interact first)
  const audioRef = React.useRef();

  // current time in seconds since the epoch
  const [currTime, setCurrTime] = useState(
    Math.floor(new Date().getTime() / 1000)
  );
  // Create List Confirmation
  const [settingsPopup, setSettingsPopup] = useState(false);

  function handleSettingsPopup() {
    setSettingsPopup(!settingsPopup);
    // start playing background music
    audioRef.current?.audioEl.current.play();
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
      win: false,
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

  var content = (
    <>
      <ReactAudioPlayer
        src="bg.mp3"
        loop
        ref={(e) => {
          audioRef.current = e;
        }}
      />
      <TimerContents
        onWin={onWin}
        formattedTime={loading ? "loading" : formattedTime}
      />
    </>
  );
  if (!timer?.win) {
    content = (
      <WinScreen timeRemaining={formatSecs(TIMER_SECS - getRemainingSecs())} />
    );
  } else if (getRemainingSecs() === 0) {
    content = <LoseScreen checkboxStates={[false, false, false]} />;
  }

  return (
    <div className="App">
      <div onClick={handleSettingsPopup}>{content}</div>
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
