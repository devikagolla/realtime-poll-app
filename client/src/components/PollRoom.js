import React, { useEffect, useState } from "react";
import '../styles/PollRoom.css';

function PollRoom({ user }) {
  const [votes, setVotes] = useState({ A: 0, B: 0 });
  const [hasVoted, setHasVoted] = useState(
    localStorage.getItem(`voted-${user.roomCode}-${user.name}`) === "true"
  );
  const [timer, setTimer] = useState(60);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    user.socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "vote_update") setVotes(data.payload);
      if (data.type === "voting_ended") setEnded(true);
      if (data.type === "timer_update") setTimer(data.payload);
    };
  }, [user.socket]);

  const vote = (option) => {
    if (hasVoted || ended) return;
    user.socket.send(JSON.stringify({ type: "vote", payload: { roomCode: user.roomCode, option, name: user.name } }));
    setHasVoted(true);
    localStorage.setItem(`voted-${user.roomCode}-${user.name}`, "true");
  };

  return (
    <div className="poll-room">
      <h2>Room: {user.roomCode}</h2>
      <h3>Poll: Cats vs Dogs</h3>
      <p>Time left: {timer}s</p>
      <button disabled={hasVoted || ended} onClick={() => vote("A")}>Cats</button>
      <button disabled={hasVoted || ended} onClick={() => vote("B")}>Dogs</button>
      <p>{hasVoted ? "You have voted!" : "You haven't voted yet."}</p>
      <h4>Live Votes:</h4>
      <p>Cats: {votes.A}</p>
      <p>Dogs: {votes.B}</p>
    </div>
  );
}

export default PollRoom;
