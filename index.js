// env variables
require("dotenv").config();
var Downloader = require("./downloader");
var dl = new Downloader();
var i = 0;
// telegraf load
const Telegraf = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Basics messages
const welcomeMsg = `Bienvenue!
Je suis Midgar Youtube mp3 Downloader`;
const helpMsg = ` Envoie moi le lien  de ta vidéo youtube!!`;

// basic commands
bot.start(ctx => ctx.reply(welcomeMsg));
bot.help(ctx => ctx.reply(helpMsg));

// Listenning
bot.hears(/https\:\/\/youtu\.be/i, ctx => {
  const getVideoId = ctx.message.text.split("/");
  const finalId = getVideoId[3];

  dl.getMP3({ videoId: finalId }, function(err, res) {
    i++;
    if (err) throw err;
    else {
      const trackTitle = res.file.split("/");
      console.log("Le son " + i + " a été DL en tant que: " + trackTitle[2]);
      ctx.replyWithDocument({ source: `./mp3/${trackTitle[2]}` });
    }
  });
});

bot.hears(/https\:\/\/www\.youtube\.com\/watch\?/i, ctx => {
  const getVideoId = ctx.message.text.split("=");

  const finalId = ctx.message.text.includes("?list=")
    ? getVideoId[2]
    : getVideoId[1];

  dl.getMP3({ videoId: finalId }, function(err, res) {
    i++;
    if (err) throw err;
    else {
      const trackTitle = res.file.split("/");
      console.log("Le son " + i + " a été DL en tant que: " + trackTitle[2]);
      ctx.replyWithDocument({ source: `./mp3/${trackTitle[2]}` });
    }
  });
});
bot.launch();
