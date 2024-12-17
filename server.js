const WebSocket = require("ws");
const http = require("http");

// Create an HTTP server
const server = http.createServer();

// Create a WebSocket server by passing the HTTP server
const wss = new WebSocket.Server({ server });

// Function to generate a random response
function generateResponse(message) {
  const responses = [
    `You said: ${message}`,
    `I received: ${message}`,
    `Echo: ${message}`,
    `Message processed: ${message}`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// Connection handler
wss.on("connection", (ws) => {
  console.log("New client connected");

  // Message handler
  ws.on("message", (message) => {
    const receivedMessage = message.toString();
    console.log("Received:", receivedMessage);

    // Generate and send a response
    const response = generateResponse(receivedMessage);
    ws.send(response);
  });

  // Close handler
  ws.on("close", () => {
    console.log("Client disconnected");
  });

  // Send a welcome message
  ws.send("Welcome to the WebSocket server!");
});

// Error handler for the WebSocket server
wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down the server");
  wss.close(() => {
    console.log("WebSocket server closed");
    process.exit(0);
  });
});
