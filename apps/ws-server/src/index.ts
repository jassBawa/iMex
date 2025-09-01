import Redis from "ioredis";
import { WebSocketServer, WebSocket } from "ws";

const subscriber = new Redis();

const wss = new WebSocketServer({port: 8080})

async function main() {

    wss.on('connection', (ws) =>{ 
        ws.send(JSON.stringify({ type: "info", message: "Connected to server" }));
    })
    await subscriber.subscribe("bidsAsks");

   subscriber.on("message", (channel, message) => {
    const parsedData = JSON.parse(message)
    wss.clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify(parsedData));
        }
    }) 

   })

}
main()