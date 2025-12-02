// All times given in milliseconds
const INTRO_TIME = 29 * 1000;  // Duration of intro speech
const ROOM_TIME = 45 * 60 * 1000;  // Time to complete the room

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

const socket = io();
socket.on("intro", time => {
    console.log("intro", time);
    document.getElementById("play-pause").innerHTML = "&nbsp;";
    document.getElementById("play-pause").onclick = undefined;
    document.getElementById("start-reset").innerHTML = "Reset";
    document.getElementById("start-reset").onclick = reset;
});
socket.on("win", time => {
    console.log("win", time);
    document.getElementById("play-pause").innerHTML = "Start";
    document.getElementById("play-pause").onclick = start;
    document.getElementById("start-reset").innerHTML = "Reset";
    document.getElementById("start-reset").onclick = reset;
});
socket.on("paused", time => {
    console.log("paused", time);
    document.getElementById("play-pause").innerHTML = "Resume";
    document.getElementById("play-pause").onclick = resume;
    if (time == null) {
        console.log("time == null", time == null);
        document.getElementById("start-reset").innerHTML = "Start";
        document.getElementById("start-reset").onclick = start;
    } else {
        console.log("time == null", time == null);
        document.getElementById("start-reset").innerHTML = "Reset";
        document.getElementById("start-reset").onclick = reset;
    }
});
socket.on("running", time => {
    console.log("running", time);
    document.getElementById("play-pause").innerHTML = "Pause";
    document.getElementById("play-pause").onclick = pause;
    document.getElementById("start-reset").innerHTML = "Reset";
    document.getElementById("start-reset").onclick = reset;
});
socket.on("win-credits", () => {
    console.log("win-credits");
    document.getElementById("play-pause").innerHTML = "&nbsp;";
    document.getElementById("play-pause").onclick = undefined;
    document.getElementById("start-reset").innerHTML = "Reset";
    document.getElementById("start-reset").onclick = reset;
});
