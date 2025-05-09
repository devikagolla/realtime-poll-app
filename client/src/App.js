import React, { useState } from "react";
import JoinRoom from "./components/JoinRoom";
import PollRoom from "./components/PollRoom";
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? <JoinRoom onJoin={setUser} /> : <PollRoom user={user} />}
    </div>
  );
}

export default App;
