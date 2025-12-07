const socket = io();

// All times given in milliseconds
const ROOM_TIME = 75 * 60 * 1000;  // Time to complete the room
const TICK_PERIOD = 100;  // Time between updates to timer text
const LOSE_TIME = 1 * 1000;
const WIN_TIME = 11 * 1000;

// Specific to FA25 money timer
const STARTING_MONEY = 100000;
const INTERVAL_MIN = 3000;
const INTERVAL_MAX = 10000;
const MONEY_NOISE = 10;

var cur_money = STARTING_MONEY;
var next_money = STARTING_MONEY;
var update_money = 0;

function formatTime(money) {
    const thousands = Math.floor(money / 1000);
    const ones = Math.floor(money) % 1000;
    const cents = Math.floor(100 * money) % 100;
    if (thousands > 0) {
        return `$${thousands},${ones.toString().padStart(3, "0")}.${cents.toString().padStart(2, "0")}`;
    } else if (ones > 0) {
        return `$${ones}.${cents.toString().padStart(2, "0")}`;
    } else {
        return `$0.${cents.toString().padStart(2, "0")}`;
    }
}

const timer_video = "bg_video.mov";
const win_video = "win_video.mp4";
const lose_video = "lose_video.mp4";

const timer_audio = "bg_audio.mp3";
const win_audio = "win_audio.m4a";
const lose_audio = "lose_audio.mp3";
const win_credit_audio = "win.mp3";
const lose_credit_audio = win_credit_audio;

const timer_volume = 0.15;
const win_volume = 0.5;
const lose_volume = 0.5;
const win_credit_volume = 0.1;
const lose_credit_volume = win_credit_volume;

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
    if (elapsed < ROOM_TIME) {  // The timer is still running
        console.log("tick", document.getElementById("video").src, timer_video);
        timerTimeout = setTimeout(timerTick, TICK_PERIOD);
        const remaining = ROOM_TIME - elapsed;
        
        // update money count based on fraction of time left to go
        update_money -= 1;
        if (update_money <= 0) {
            cur_money = next_money;
            update_money = Math.floor((INTERVAL_MIN + Math.random() * (INTERVAL_MAX - INTERVAL_MIN)) / TICK_PERIOD);
            next_money = cur_money - (cur_money * (update_money+1) * TICK_PERIOD / remaining) + (2 * MONEY_NOISE * Math.random() - MONEY_NOISE);
        }

        setDisplay(timer_video, timer_audio, formatTime(cur_money), timer_volume, false, elapsed);
    } else if (elapsed < ROOM_TIME + LOSE_TIME) { // The time is up, but the outro has not finished
        setDisplay(lose_video, lose_audio, "", lose_volume, false, elapsed - ROOM_TIME);
        timerTimeout = setTimeout(() => {
            setDisplay(lose_video, lose_credit_audio, "", lose_volume);
            cur_money = STARTING_MONEY;
            next_money = STARTING_MONEY;   
        }, 2.5 * LOSE_TIME); // Allows lose audio to play twice before going to lose credits audio
    } else {  // The outro has finished
        console.log("lose-credits");
        setDisplay(lose_video, lose_credit_audio, "", lose_volume);
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
    const ms = Math.round(ROOM_TIME - (60 * min + sec) * 1000);
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
    setDisplay(win_video, win_audio, "", win_volume, true);
    timerTimeout = setTimeout(() => {
        setDisplay(win_video, win_credit_audio, "", win_credit_volume);
    }, WIN_TIME);
    cur_money = STARTING_MONEY;
    next_money = STARTING_MONEY;
    document.getElementById("play-pause").innerHTML = "Start";
    document.getElementById("play-pause").onclick = start;
    document.getElementById("start-reset").innerHTML = "Reset";
    document.getElementById("start-reset").onclick = reset;
});
socket.on("paused", time => {
    console.log("paused", time);
    clearTimeout(timerTimeout);
    setDisplay(timer_video, timer_audio, formatTime(cur_money), timer_volume);
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
