import Redis from "ioredis";
import { WebSocketServer } from "ws";

const subscriber = new Redis();

const wss = new WebSocketServer({port: 8080})

async function main() {

    wss.on('connection', () =>{ 
        
    })
   await subscriber.subscribe("bidsAsks");

   subscriber.on("message", (channel, message) => {
    const parsedata = JSON.parse(message)
    console.log(parsedata)        

   })

}
main()