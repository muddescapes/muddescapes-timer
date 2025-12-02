import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const {updateState, getState, getTime} = (() => {
    let state = "paused";
    let time = 0;
    return {
        updateState: (newState, newTime) => {
            state = newState;
            time = newTime;
            io.emit(state, time);
        },
        getState: () => state,
        getTime: () => time
    };
})();

app.post("/reset", async (req, res) => {
    updateState("paused", 0);
    res.sendStatus(200);
});
app.post("/start", async (req, res) => {
    updateState("running", Date.now());
    res.sendStatus(200);
});
app.post("/win", async (req, res) => {
    updateState("win", getState() == "running" ? Date.now() - getTime() : getTime());
    res.sendStatus(200);
});
app.post("/pause", async (req, res) => {
    updateState("paused", getState() == "running" ? Date.now() - getTime() : getTime());
    res.sendStatus(200);
});
app.post("/resume", async (req, res) => {
    updateState("running", getState == "running" ? getTime() : Date.now() - getTime());
    res.sendStatus(200);
});
app.get("/refresh", async (req, res) => {
    io.emit("refresh");
    res.sendStatus(200);
});
app.post("/pause/:time", async (req, res) => {
    updateState("paused", parseInt(req.params.time));
    res.sendStatus(200);
});

app.get("/test", async (req, res) => {
    res.sendStatus(200);
});

io.on("connection", socket => {
    socket.emit(getState(), getTime());
});

app.get("/", async (req, res) => {
    res.sendFile("display.html", {root: path.join(__dirname, "public")});
});
app.get("/controller", async (req, res) => {
    res.sendFile("io-controller.html", {root: path.join(__dirname, "public")});
});

app.get("/bg.mp3", async (req, res) => {
    res.redirect(302, "https://cdn.glitch.me/37d517f7-6eaf-4d8b-a2db-77e9c3c2a8a8/bg.mp3?v=1746491674788")
});
app.get("/bg_video.mp4", async (req, res) => {
    res.redirect(302, "https://cdn.glitch.me/37d517f7-6eaf-4d8b-a2db-77e9c3c2a8a8/bg_video.mp4?v=1746491670685")
});
app.get("/creditsfa25.mp4", async (req, res) => {
    res.redirect(302, "https://cdn.glitch.me/37d517f7-6eaf-4d8b-a2db-77e9c3c2a8a8/creditsfa25.mp4?v=1746491659816")
});
app.get("/introtwist.mp3", async (req, res) => {
    res.redirect(302, "https://cdn.glitch.global/37d517f7-6eaf-4d8b-a2db-77e9c3c2a8a8/introtwist.mp3?v=1746491653731")
});
app.get("/lose.mp3", async (req, res) => {
    res.redirect(302, "https://cdn.glitch.global/37d517f7-6eaf-4d8b-a2db-77e9c3c2a8a8/lose.mp3?v=1746491648940")
});
app.get("/loseaudio.mp3", async (req, res) => {
    res.redirect(302, "https://cdn.glitch.global/37d517f7-6eaf-4d8b-a2db-77e9c3c2a8a8/loseaudio.mp3?v=1746491645021")
});
app.get("/win.mp3", async (req, res) => {
    res.redirect(302, "https://cdn.glitch.global/37d517f7-6eaf-4d8b-a2db-77e9c3c2a8a8/win.mp3?v=1746491640718")
});
app.get("/winaudio.mp3", async (req, res) => {
    res.redirect(302, "https://cdn.glitch.global/37d517f7-6eaf-4d8b-a2db-77e9c3c2a8a8/winaudio.mp3?v=1746491628997")
});

const port = process.env.PORT || 8142;
server.listen(port, () => console.log(`App listening on port ${port}!`));
