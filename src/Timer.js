import React, { useState, useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import Backdrop from "./Backdrop";
import SettingsPopup from "./SettingsPopup";
import TimerContents from "./TimerContents";
import { LoseScreen, WinScreen } from "./EndScreens";
import ReactAudioPlayer from "react-audio-player";

const TIMER_SECS = 99999999; // 59:59 so we never need to show the hours
const FIREBASE_COLLECTION = "timers";
const FIREBASE_DOC = "timer1";

function formatSecs(secs) {
  // format time in MM:SS
  return new Date(secs * 1000).toISOString().substring(14, 19);
}

function Timer({ db }) {
  // ref for audio player to play sound when settings popup opens
  // cannot autoplay due to browser restrictions (must interact first)
  const bgAudioRef = React.useRef();

  // current time in seconds since the epoch
  const [currTime, setCurrTime] = useState(
    Math.floor(new Date().getTime() / 1000)
  );
  // Create List Confirmation
  const [settingsPopup, setSettingsPopup] = useState(false);

  function handleSettingsPopup() {
    // start playing background music
    if (bgAudioRef.current) {
      bgAudioRef.current.audioEl.current.play();
    }
    setSettingsPopup(!settingsPopup);
  }

  const [timer, loading, error] = useDocumentData(
    doc(db, FIREBASE_COLLECTION, FIREBASE_DOC)
  );
  if (error) {
    console.error(error);
  }

  const getVideoStarted = () => {
    if (timer) {
      return timer.startTime;
    }
    return -1;
  };

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

  // timer pauses when startTime is null
  const onPause = () => {
    updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
      secs: getRemainingSecs(),
      startTime: null,
    });
  };

  const onWin = () => {
    // prevent unnecessary win calls
    if (timer?.win) {
      return;
    }

    updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
      secs: getRemainingSecs(),
      startTime: null,
      win: true,
    });
  };

  const onReset = () => {
    updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
      secs: TIMER_SECS,
      startTime: null,
      win: false,
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

  var content = (
    <>
      <ReactAudioPlayer
        src="bg.mp3"
        loop
        ref={(e) => {
          bgAudioRef.current = e;
        }}
      />
      <TimerContents loading={loading} videoStarted={getVideoStarted()} />
    </>
  );

  if (timer?.win) {
    content = (
      <WinScreen finishedIn={formatSecs(TIMER_SECS - getRemainingSecs())} />
    );
  } else if (getRemainingSecs() === 0) {
    content = <LoseScreen />;
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
