import React, { useState, useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import Backdrop from "./Backdrop";
import SettingsPopup from "./SettingsPopup";
import TimerContents from "./TimerContents";
import { LoseScreen, WinScreen } from "./EndScreens";
import ReactAudioPlayer from "react-audio-player";

const INTRO_DELAY = 29000;
const WIN_DELAY = 18000;
const TIMER_SECS = 2700; // 2700 = 45:00
const FIREBASE_COLLECTION = "timers";
const FIREBASE_DOC = "timer1";
const REFRESH_PERIOD = 100;

var introStarted = false;
var winStarted = false;
var loseStarted = false;

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
  if (currTime % 1000 < 100) {
    console.log("timer", timer);
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
    // Send the start signal to all instances
    updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
      intro: true
    });
    // After the intro speech, set startTime to the then-current time.
    // Setting startTime starts the countdown.
    setTimeout(function() {
      updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
        startTime: currTime + INTRO_DELAY,
        intro: false
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

    updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
        secs: getRemainingMsecs() / 1000,
        startTime: null,  // Stops the countdown
        win: true,  // Trigger win speech on all instances
    });
    // After the win speech, signal all instances to roll the credits
    setTimeout(function() {
      updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
        credits: true
      });
    }, WIN_DELAY);
  };

  const onReset = () => {
    updateDoc(doc(db, FIREBASE_COLLECTION, FIREBASE_DOC), {
      secs: TIMER_SECS,
      startTime: null,
      win: false,
      credits: false,
      intro: false,
    });
  };

  useEffect(() => {
    // shouldn't cause any re-renders if currTime is not changed,
    // so updating every 100ms should be fine
    const interval = setInterval(() => {
      setCurrTime(Math.floor(new Date().getTime()));
    }, REFRESH_PERIOD);
    return () => clearInterval(interval);
  }, []);

  var formattedTime = null;
  if (timer) {
    // timer is counting up
    formattedTime = formatMsecs(getRemainingMsecs());
  }

  // Default contents: timer screen
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

  if (timer?.credits && timer?.win) {  // Credits with win music
    content = (
      <WinScreen finishedIn={formatMsecs(TIMER_SECS * 1000 - getRemainingMsecs())} />
    );
  } else if(timer?.credits && !timer?.win) {  // Credits with lose music
    content = (
      <LoseScreen finishedIn={formatMsecs(TIMER_SECS * 1000 - getRemainingMsecs())} />
    );
  }
  if (timer?.win && !winStarted) {
    winStarted = true;
    new Audio("winaudio.mp3").play();
  } else if (!timer?.win) {
    winStarted = false;
  }
  if (timer?.lose && !loseStarted) {
    loseStarted = true;
    new Audio("loseaudio.mp3").play();
  } else if (!timer?.lose) {
    loseStarted = false;
  }
  if (timer?.intro && !introStarted) {
    introStarted = true;
    new Audio("introtwist.mp3").play();
  } else if (!timer?.intro) {
    introStarted = false;
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
