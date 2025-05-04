import React, { useState, useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import Backdrop from "./Backdrop";
import SettingsPopup from "./SettingsPopup";
import TimerContents from "./TimerContents";
import { LoseScreen, WinScreen } from "./EndScreens";
import ReactAudioPlayer from "react-audio-player";
import {useCheckboxStates} from "./hooks";

const INTRO_DELAY = 29000;
const WIN_DELAY = 18000;
const LOSE_DELAY = 17000;
const TIMER_SECS = 3; // 2700 = 45:00
const FIREBASE_COLLECTION = "timers";
const FIREBASE_DOC = "timer1";
var has_lost = false;

function formatMsecs(msecs) {
  // format time in MM:SS
  const secs = Math.floor(msecs / 1000);
  const mins = Math.floor(secs / 60);
  const remainingSecs = secs % 60;
  return `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
}

function Timer({ db }) {
  // ref for audio player to play sound when settings popup opens
  // cannot autoplay due to browser restrictions (must interact first)
  var bgAudioRef = React.useRef();

  // current time in milliseconds since the epoch
  const [currTime, setCurrTime] = useState(
    Math.floor(new Date().getTime())
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

  const getRemainingMsecs = () => {
    if (timer) {
      return timer.startTime
        ? Math.max((timer.secs * 1000) - (currTime - timer.startTime), 0)
        : timer.secs * 1000;
    }
    return 1;
  };

  const onStart = () => {
    new Audio("introtwist.mp3").play();

    content = (
      <TimerContents loading={loading} formattedTime={formattedTime} />
    );

    setTimeout(function() {
      updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
        startTime: currTime + INTRO_DELAY,
      });
    }, INTRO_DELAY);
  };

  // timer pauses when startTime is null
  const onPause = () => {
    updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
      secs: getRemainingMsecs() / 1000,
      startTime: null,
    });
  };

  const onWin = () => {
    // prevent unnecessary win calls
    if (timer?.win) {
      return;
    }

    // updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
    //   secs: getRemainingMsecs() / 1000,
    //   startTime: null,
    // });

    setTimeout(function() {
      updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
        credits: true
      });
    }, WIN_DELAY);

    new Audio("winaudio.mp3").play();

    updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
        secs: getRemainingMsecs() / 1000,
        startTime: null,
        win: true,
    });
  };

  const [checkboxStates, resetCheckboxStates] = useCheckboxStates({onWin});

  const onReset = () => {
    has_lost = false;

    updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
      secs: TIMER_SECS,
      startTime: null,
      win: false,
      credits: false,
      losecredits: false,
    });
  };

  useEffect(() => {
    // shouldn't cause any re-renders if currTime is not changed,
    // so updating every 100ms should be fine
    const interval = setInterval(() => {
      setCurrTime(Math.floor(new Date().getTime()));
    }, 37);
    return () => clearInterval(interval);
  }, []);

  var formattedTime = null;
  if (timer) {
    // timer is counting up
    formattedTime = formatMsecs(getRemainingMsecs());
  }

  console.log("timer screen");

  var content = (
    <>
      <ReactAudioPlayer
        src="bg.mp3"
        volume = {0.1}
        loop
        ref={(e) => {
          bgAudioRef.current = e;
        }}
      />
      <TimerContents loading={loading} formattedTime={formattedTime} />
    </>
  );

  if (timer?.credits) {
    console.log("win");
    content = (
      <WinScreen finishedIn={formatMsecs(TIMER_SECS * 1000 - getRemainingMsecs())} />
    );
  } else if (getRemainingMsecs() <= 0 && !has_lost) {
    has_lost = true;
    new Audio("loseaudio.mp3").play();

    setTimeout(function() {
      updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
        losecredits: true
      });
    }, LOSE_DELAY);
  }

  if (timer?.losecredits) {
    content = (
      <LoseScreen finishedIn={formatMsecs(TIMER_SECS * 1000 - getRemainingMsecs())} />
    );
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
