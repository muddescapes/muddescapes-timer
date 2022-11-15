import { useState, useEffect, useRef } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";

function Timer({ db }) {
  // We need ref in this, because we are dealing
  // with JS setInterval to keep track of it and
  // stop it when needed
  const Ref = useRef(null);
  const [counter, loading, error] = useDocumentData(
    doc(db, "counter-collection", "counter"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  // The state for our timer
  const [timer, setTimer] = useState("60:00");

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    // const ms = Math.floor(total % 1000);
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
      setTimer(
        (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
        // + ':' + (ms > 99 ? ms : ms > 9 ? '0' + ms : '00' + ms)
      );
    }
  };

  const clearTimer = (e) => {
    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTimer("60:00");

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();

    // This is where you need to adjust if
    // you entend to add more time
    deadline.setHours(deadline.getHours() + 1);
    return deadline;
  };

  // We can use useEffect so that when the component
  // mounts the timer will start as soon as possible

  // We put empty array to act as componentDid
  // mount only
  useEffect(() => {
    clearTimer(getDeadTime());
  }, [counter]);

  // Another way to call the clearTimer() to start
  // the countdown is via action event from the
  // button first we create function to be called
  // by the button
  const onReset = () => {
    updateDoc(doc(db, 'counter-collection', 'counter'), { value: counter.value + 1 });
  };

  return (
    <div className="App">
      <h2 onClick={onReset}>{loading ? 'loading' : timer}</h2>
    </div>
  );
}

export default Timer;