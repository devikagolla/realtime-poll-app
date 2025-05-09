const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = {}; // { roomCode: { users: {}, votes: {optionA: 0, optionB: 0}, hasEnded: false, timer: 60 } }

function broadcastToRoom(roomCode, data) {
  const room = rooms[roomCode];
  if (!room) return;

  Object.values(room.users).forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  });
}

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const msg = JSON.parse(message);
    const { type, payload } = msg;

    if (type === "create_room") {
      const roomCode = uuidv4().slice(0, 6);
      rooms[roomCode] = {
        users: {},
        votes: { A: 0, B: 0 },
        hasEnded: false,
        timer: 60,
      };
      ws.send(JSON.stringify({ type: "room_created", payload: { roomCode } }));
    }

    if (type === "join_room") {
      const { name, roomCode } = payload;
      const room = rooms[roomCode];
      if (!room || room.users[name]) {
        ws.send(JSON.stringify({ type: "error", payload: "Room not found or name taken" }));
        return;
      }

      room.users[name] = ws;
      ws.roomCode = roomCode;
      ws.userName = name;

      ws.send(JSON.stringify({ type: "joined", payload: { roomCode, votes: room.votes, hasEnded: room.hasEnded } }));

      if (Object.keys(room.users).length === 1) {
        let interval = setInterval(() => {
          if (room.timer <= 0) {
            room.hasEnded = true;
            clearInterval(interval);
            broadcastToRoom(roomCode, { type: "voting_ended" });
          } else {
            room.timer--;
            broadcastToRoom(roomCode, { type: "timer_update", payload: room.timer });
          }
        }, 1000);
      }
    }

    if (type === "vote") {
      const { roomCode, option, name } = payload;
      const room = rooms[roomCode];
      if (!room || room.hasEnded || !room.users[name]) return;

      if (!room.users[name].hasVoted) {
        room.votes[option]++;
        room.users[name].hasVoted = true;
        broadcastToRoom(roomCode, { type: "vote_update", payload: room.votes });
      }
    }
  });

  ws.on("close", () => {
    const { roomCode, userName } = ws;
    if (roomCode && userName && rooms[roomCode]) {
      delete rooms[roomCode].users[userName];
    }
  });
});

server.listen(4000, () => {
  console.log("Server started on http://localhost:4000");
});
