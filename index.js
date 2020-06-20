//---------------------------------------------------------------------
// Glitch 24/7
// Required to let uptime robot waving our bot.
//---------------------------------------------------------------------

const express = require("express");
const http = require("http");

const app = express();

app.use(express.json());

app.get("/", (_, res) => res.send("hi"));
app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.herokuapp.com/`);
}, 224000);

// End of Glitch 24/7

const mineflayer = require("mineflayer");

const config = { 
  host: "aqirito.aternos.me", //mc.hypixel.net for example
  port: 25565, //server port (leave it as is unless you know what you're doing!)
  username: "My_Bot_01", //username only for cracked/offline mode servers, email for premium
  version: false //version of the server (false = auto detect)
};

const bot = mineflayer.createBot({ //creates a new bot from the config above
  host: config.host, //im ported from config
  port: config.version, //imported from config
  username: config.username, //imported from config
  version: config.version //imported from config
});

console.log("Connecting..."); //logs "Connecting..." into the console

let target = null

bot.on('chat', (username, message) => {
  if (username === bot.username) return
  target = bot.players[username].entity
  let entity
  switch (message) {
    case 'forward':
      bot.setControlState('forward', true)
      break
    case 'back':
      bot.setControlState('back', true)
      break
    case 'left':
      bot.setControlState('left', true)
      break
    case 'right':
      bot.setControlState('right', true)
      break
    case 'sprint':
      bot.setControlState('sprint', true)
      break
    case 'stop':
      bot.clearControlStates()
      break
    case 'jump':
      bot.setControlState('jump', true)
      bot.setControlState('jump', false)
      break
    case 'jump a lot':
      bot.setControlState('jump', true)
      break
    case 'stop jumping':
      bot.setControlState('jump', false)
      break
    case 'attack':
      entity = nearestEntity()
      if (entity) {
        bot.attack(entity, true)
      } else {
        bot.chat('no nearby entities')
      }
      break
    case 'mount':
      entity = nearestEntity('object')
      if (entity) {
        bot.mount(entity)
      } else {
        bot.chat('no nearby objects')
      }
      break
    case 'dismount':
      bot.dismount()
      break
    case 'move vehicle forward':
      bot.moveVehicle(0.0, 1.0)
      break
    case 'move vehicle backward':
      bot.moveVehicle(0.0, -1.0)
      break
    case 'move vehicle left':
      bot.moveVehicle(1.0, 0.0)
      break
    case 'move vehicle right':
      bot.moveVehicle(-1.0, 0.0)
      break
    case 'tp':
      bot.entity.position.y += 10
      break
    case 'pos':
      bot.chat(bot.entity.position.toString())
      break
    case 'yp':
      bot.chat(`Yaw ${bot.entity.yaw}, pitch: ${bot.entity.pitch}`)
      break
    case 'sleep':
      goToSleep()
      break
    case 'wakeup':
      wakeUp()
      break
  }
})

bot.on('mount', () => {
  bot.chat(`mounted ${bot.vehicle.objectType}`)
})

bot.on('dismount', (vehicle) => {
  bot.chat(`dismounted ${vehicle.objectType}`)
})

bot.on('sleep', () => {
  bot.chat('Oyasuminasai!')
})
bot.on('wake', () => {
  bot.chat('Ohayou Gozaimasu')
})

function nearestEntity (type) {
  let id
  let entity
  let dist
  let best = null
  let bestDistance = null
  for (id in bot.entities) {
    entity = bot.entities[id]
    if (type && entity.type !== type) continue
    if (entity === bot.entity) continue
    dist = bot.entity.position.distanceTo(entity.position)
    if (!best || dist < bestDistance) {
      best = entity
      bestDistance = dist
    }
  }
  return best
}

function goToSleep () {
  const bed = bot.findBlock({
    matching: block => bot.isABed(block)
  })
  if (bed) {
    bot.sleep(bed, (err) => {
      if (err) {
        bot.chat(`Nemurenai yo!: ${err.message}`)
      } else {
        bot.chat("Watashi wa nemutte iru")
      }
    })
  } else {
    bot.chat('Chikaku no beddo wa arimasen')
  }
}

function wakeUp () {
  bot.wake((err) => {
    if (err) {
      bot.chat(`Me ga samenai.: ${err.message}`)
    } else {
      bot.chat('Okita')
    }
  })
}


bot.on("error", err => console.log(err)); //triggers when there's an error and logs it into the console

bot.on("login", () => { //triggers when the bot joins the server
console.log(bot.username + " is online"); //logs the username of the bot when the bot is online
});
bot.on("end", () => { //triggers when the bot leaves/gets kicked
console.log("The bot disconnected, reconnecting..."); //says "The bot disconnected, reconnecting... in console
process.exit(0);
});