const socket = io();

// All times given in milliseconds
const INTRO_TIME = 29 * 1000;  // Duration of intro speech
const ROOM_TIME = 45 * 60 * 1000;  // Time to complete the room
const LOSE_TIME = 17 * 1000;  // Lose speech duration
const WIN_TIME = 18 * 1000;  // Win speech duration
const TICK_PERIOD = 100;  // Time between updates to timer text

function formatTime(ms) {
    const secs = Math.floor(ms / 1000);
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
}

const timer_video = "bg_video.mp4";
const intro_video = timer_video;
const win_video = timer_video;
const lose_video = timer_video;
const win_credit_video = "creditsfa25.mp4";
const lose_credit_video = win_credit_video;

const intro_audio = "introtwist.mp3";
const timer_audio = "bg.mp3";
const win_audio = "winaudio.mp3";
const lose_audio = "loseaudio.mp3";
const win_credit_audio = "win.mp3";
const lose_credit_audio = "lose.mp3";

const intro_volume = 1;
const timer_volume = 0.15;
const win_volume = 0.5;
const lose_volume = 0.5;
const win_credit_volume = 0.1;
const lose_credit_volume = 0.2;

/** The time the current run started, or null if there is no current run. */
var started = null;
/** The timeout reference for the callback to timerTick. */
var timerTimeout = null;

function resolveURL(url) {
    return new URL(url, document.URL).toString();
}
/**
 * Render the display.
 * 
 * Unmodified aspects of the display are not updated in the DOM,
 * except for the timer text, unless `force` is set to true.
 * 
 * @param video The uri for the background video
 * @param audio The uri for the audio file
 * @param text The text to display
 * @param volume The audio volume, from 0 (silent) to 1 (maximum, default).
 * @param force Whether to force the DOM to update. Defaults to false.
 * @param timestamp The timestamp to jump to in the audio file, in milliseconds.
 *  Note that the audio will not be updated to match this time if the audio file
 *  has not changed unless `force` is set to true.
 */
function setDisplay(video, audio, text, volume=1, force=false, timestamp=0) {
    if (force || document.getElementById("video").src != resolveURL(video)){
        console.log("changed video", document.getElementById("video").src, video);
        document.getElementById("video").src = video;
    }
    if (force || document.getElementById("audio").src.split("#")[0] != resolveURL(audio)) {
        document.getElementById("audio").src = `${audio}#t=${Math.round(timestamp / 100) / 10}`;
    }
    if (force || document.getElementById("audio").volume != volume) {
        document.getElementById("audio").volume = volume;
    }
    document.getElementById("timer-text").innerHTML = text;
}
function timerTick() {
    const elapsed = Date.now() - started;
    if (elapsed < 0) {  // The intro has not started yet
        console.log("pre-start");
        timerTimeout = setTimeout(timerTick, -elapsed);
        setDisplay(timer_video, timer_audio, "", timer_volume, false);
    } else if (elapsed < INTRO_TIME) {  // The intro has not finished yet
        console.log("intro");
        timerTimeout = setTimeout(timerTick, INTRO_TIME - elapsed);
        setDisplay(intro_video, intro_audio, formatTime(ROOM_TIME), intro_volume, true, elapsed);
    } else if (elapsed < INTRO_TIME + ROOM_TIME) {  // The timer is still running
        console.log("tick", document.getElementById("video").src, timer_video);
        timerTimeout = setTimeout(timerTick, TICK_PERIOD);
        const remaining = INTRO_TIME + ROOM_TIME - elapsed;
        setDisplay(timer_video, timer_audio, formatTime(remaining), timer_volume, false, elapsed - INTRO_TIME);
    } else if (elapsed < INTRO_TIME + ROOM_TIME + LOSE_TIME) {  // The time is up, but the outro has not finished
        console.log("lost");
        setDisplay(lose_video, lose_audio, formatTime(0), lose_volume, false, elapsed - INTRO_TIME - ROOM_TIME);
        timerTimeout = setTimeout(timerTick, INTRO_TIME + ROOM_TIME + LOSE_TIME - elapsed);
    } else {  // The outro has finished
        console.log("lose-credits");
        setDisplay(lose_credit_video, lose_credit_audio, "", lose_credit_volume);
    }
}

async function reset() {
    await fetch("/reset", {method: "POST"});
    document.getElementById("play-pause").value = "Start";
    document.getElementById("play-pause").onclick = start;
}
async function start() {
    await fetch("/start", {method: "POST"});
}
async function win() {
    await fetch("/win", {method: "POST"});
}
async function pause() {
    await fetch("/pause", {method: "POST"});
}
async function resume() {
    await fetch("/resume", {method: "POST"});
}
async function setTime() {
    const sec = parseInt(document.getElementById("sec").value);
    const min = parseInt(document.getElementById("min").value);
    const ms = Math.round(INTRO_TIME + ROOM_TIME - (60 * min + sec) * 1000);
    await fetch(`/pause/${ms}`, {method: "POST"});
}

socket.on("running", time => {
    console.log("running", time);
    started = time;
    clearTimeout(timerTimeout);
    timerTick();
    document.getElementById("play-pause").innerHTML = "Pause";
    document.getElementById("play-pause").onclick = pause;
    document.getElementById("start-reset").innerHTML = "Reset";
    document.getElementById("start-reset").onclick = reset;
});
socket.on("win", time => {
    console.log("win", time);
    clearTimeout(timerTimeout);
    setDisplay(win_video, win_audio, formatTime(ROOM_TIME - time), win_volume, true);
    timerTimeout = setTimeout(() => {
        setDisplay(win_credit_video, win_credit_audio, "", win_credit_volume);
    }, WIN_TIME);
    document.getElementById("play-pause").innerHTML = "Start";
    document.getElementById("play-pause").onclick = start;
    document.getElementById("start-reset").innerHTML = "Reset";
    document.getElementById("start-reset").onclick = reset;
});
socket.on("paused", time => {
    console.log("paused", time);
    clearTimeout(timerTimeout);
    setDisplay(timer_video, timer_audio, formatTime(Math.min(INTRO_TIME + ROOM_TIME - time, ROOM_TIME)), timer_volume);
    document.getElementById("play-pause").innerHTML = "Resume";
    document.getElementById("play-pause").onclick = resume;
    if (!time) {
        document.getElementById("start-reset").innerHTML = "Start";
        document.getElementById("start-reset").onclick = start;
    } else {
        document.getElementById("start-reset").innerHTML = "Reset";
        document.getElementById("start-reset").onclick = reset;
    }
});
socket.on("refresh", () => window.location.reload(true));

document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded");
    document.getElementById("contents").addEventListener("click", () => {
        document.getElementById("overlay").style.display = "block";
    });
    document.getElementById("overlay").addEventListener("click", () => {
        document.getElementById("overlay").style.display = "none";
    });
    document.getElementById("menu-wrapper").addEventListener("click", e => {
        e.stopPropagation();
    });
    document.addEventListener("keydown", e => {
        if (e.key == "Escape") {
            document.getElementById("overlay").style.display = "none";
        }
    });
    document.body.addEventListener("click", () => {
        document.getElementById("audio").volume = document.getElementById("audio").volume;
    });
});
