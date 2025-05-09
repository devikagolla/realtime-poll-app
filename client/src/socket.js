// client/src/socket.js

let socket = null;

export function getSocket() {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket("ws://localhost:4000");

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket disconnected");
    };
  }

  return socket;
}

export function waitForSocketConnection(callback) {
  const socket = getSocket();
  const interval = setInterval(() => {
    if (socket.readyState === 1) {
      clearInterval(interval);
      callback();
    }
  }, 100); // checks every 100ms
}