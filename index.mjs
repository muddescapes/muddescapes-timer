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

const port = process.env.PORT || 8142;
server.listen(port, () => console.log(`App listening on port ${port}!`));
