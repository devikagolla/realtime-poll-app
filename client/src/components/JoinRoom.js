import React, { useState } from "react";
import '../styles/JoinRoom.css';

const socket = new WebSocket("ws://localhost:4000");

function JoinRoom({ onJoin }) {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  function handleCreate() {
    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "room_created") {
        onJoin({ name, roomCode: data.payload.roomCode, socket });
        socket.send(JSON.stringify({ type: "join_room", payload: { name, roomCode: data.payload.roomCode } }));
      }
    };
    socket.send(JSON.stringify({ type: "create_room" }));
  }

  function handleJoin() {
    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "joined") {
        onJoin({ name, roomCode, socket });
      } else if (data.type === "error") {
        alert(data.payload);
      }
    };
    socket.send(JSON.stringify({ type: "join_room", payload: { name, roomCode } }));
  }

  return (
    <div className="join-room">
      <h2 >Join or Create Poll Room</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
      <input value={roomCode} onChange={(e) => setRoomCode(e.target.value)} placeholder="Room Code" />
      <button onClick={handleJoin}>Join Room</button>
      <button onClick={handleCreate}>Create Room</button>
    </div>
  );
}

export default JoinRoom;
