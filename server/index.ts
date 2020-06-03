import * as WebSocket from "ws";
import * as Discord from "discord.js";
const client = new Discord.Client();

client.once("ready", () => {
  console.log("Ready!");
});

client.login(process.env.APIKEY);

const messagesHistory: {
  [channel: string]: [
    { author: string; message: string; timestamp: number | string }?
  ];
} = {};

client.on("message", (message) => {
  const msg = {
    author: message.author.tag,
    channel: message.channel.id,
    message: message.content,
    timestamp: message.createdTimestamp,
  };
  if (!messagesHistory[message.channel.id])
    messagesHistory[message.channel.id] = [];

  messagesHistory[message.channel.id].push(msg);

  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg));
    }
  });
});

const wss = new WebSocket.Server({ port: 3000 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    try {
      const msg = JSON.parse(message.toString());
      if (msg.command == "getHistory")
        ws.send(JSON.stringify(messagesHistory[msg.channel].slice(-10)));
    } catch (error) {}
  });
});
