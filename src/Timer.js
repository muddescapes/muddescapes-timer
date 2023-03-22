import React, { useState, useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import Backdrop from "./Backdrop";
import SettingsPopup from "./SettingsPopup";
import TimerContents from "./TimerContents";
import { LoseScreen, WinScreen } from "./EndScreens";
import ReactAudioPlayer from "react-audio-player";
import { useCheckboxStates } from "./hooks";

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
  const bgAudioRef = React.useRef();
  const step1AudioRef = React.useRef();
  const step2AudioRef = React.useRef();

  // current time in seconds since the epoch
  const [currTime, setCurrTime] = useState(
    Math.floor(new Date().getTime() / 1000)
  );
  // Create List Confirmation
  const [settingsPopup, setSettingsPopup] = useState(false);

  function handleSettingsPopup() {
    setSettingsPopup(!settingsPopup);
    // start playing background music
    bgAudioRef.current?.audioEl.current.play();
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

  const [checkboxStates, resetCheckboxStates] = useCheckboxStates({
    onWin,
    onTaskComplete: (i) => {
      if (i === 0) {
        step1AudioRef.current?.audioEl.current.play();
      } else if (i === 1) {
        step2AudioRef.current?.audioEl.current.play();
      }
    },
  });

  const onReset = () => {
    resetCheckboxStates();
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
          bgAudioRef.current = e;
        }}
      />
      <ReactAudioPlayer
        src="security_cameras_disabled_sfx.mp3"
        ref={(e) => {
          step1AudioRef.current = e;
        }}
      />
      <ReactAudioPlayer
        src="hammer_stolen_sfx.mp3"
        ref={(e) => {
          step2AudioRef.current = e;
        }}
      />
      <TimerContents
        checkboxStates={checkboxStates}
        formattedTime={loading ? "loading" : formattedTime}
      />
    </>
  );
  if (timer?.win) {
    content = (
      <WinScreen timeRemaining={formatSecs(TIMER_SECS - getRemainingSecs())} />
    );
  } else if (getRemainingSecs() === 0) {
    content = <LoseScreen checkboxStates={checkboxStates} />;
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
