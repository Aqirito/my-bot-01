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
  host: config.host, //imported from config
  port: config.version, //imported from config
  username: config.username, //imported from config
  version: config.version //imported from config
});

console.log("Connecting..."); //logs "Connecting..." into the console

bot.on('chat', (username, message) => {
  if (username === bot.username) return;
  switch (message) {
    case 'sleep':
      goToSleep();
      break;
    case 'wakeup':
      wakeUp();
      break;
  }
});

bot.on('sleep', () => {
  bot.chat('Oyasuminasai!');
});
bot.on('wake', () => {
  bot.chat('Ohayou Gozaimasu');
});

function goToSleep () {
  const bed = bot.findBlock({
    matching: block => bot.isABed(block)
  });
  if (bed) {
    bot.sleep(bed, (err) => {
      if (err) {
        bot.chat(`Nemurenai yo!: ${err.message}`);
      } else {
        bot.chat("Watashi wa nemutte iru");
      }
    });
  } else {
    bot.chat('Chikaku no beddo wa arimasen');
  }
}

function wakeUp () {
  bot.wake((err) => {
    if (err) {
      bot.chat(`Me ga samenai.: ${err.message}`);
    } else {
      bot.chat('Okita');
    }
  });
}

bot.on("error", err => console.log(err)); //triggers when there's an error and logs it into the console

bot.on("login", () => { //triggers when the bot joins the server
console.log(bot.username + " is online"); //logs the username of the bot when the bot is online
});
bot.on("end", () => { //triggers when the bot leaves/gets kicked
console.log("The bot disconnected, reconnecting..."); //says "The bot disconnected, reconnecting... in console
process.exit(0);
});