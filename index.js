const { Client, Collection, MessageEmbed } = require('discord.js');

const client = new Client();

const config = require('./config');

const { readdirSync } = require('fs');

client.commands = new Collection();

const cooldowns = new Collection();
const http = require('http');

const express = require('express');

const app = express();

app.get("/", (request, response) => {

  response.sendStatus(200);

});

app.listen(process.env.PORT);

setInterval(() => {

  http.get(`https://hissing-flossy-sandalwood.glitch.me`);

}, 280000);

 
client.queue = new Map();

for (var file of readdirSync('commands').filter(f => f.endsWith('.js'))) {

  let cmd = require('./commands/' + file);

  cmd.help[file] = true;

  client.commands.set(cmd.help.name, cmd);

}

client.prefix = config.prefix;

var bot = client;

bot.on("ready", async () => {

  console.log(`Logged in as '${bot.user.tag}'`);

  bot.user.setActivity("-help | Robux Shop");

});

var prefix = client.prefix;

client.data = {

  dbg: new (require('enmap'))({ name: 'DataBase' })

}

bot.on('message', message => {

  if (message.author.bot) return;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(client.prefix.length).trim().replace(/١/g, "1").replace(/٢/g, "2").replace(/٣/g, "3").replace(/٤/g, "4").replace(/٥/g, "5").replace(/٦/g, "6").replace(/٧/g, "7").replace(/٨/g, "8").replace(/٩/g, "9").replace(/٠/g, "0").split(/ +/);

  const commandName = args.shift();

  const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.help.aliases && cmd.help.aliases.includes(commandName));

  if (!command) return;

  var cmd = command.help;

  if (cmd.owner && !config.owners.includes(message.author.id)) return;

  if (cmd.admin && !message.member.hasPermission([cmd.permissions])) return;

  if (cmd.admin && !message.guild.me.hasPermission([cmd.permissions_bot])) return message.channel.send("> **" + `${config.emojis.err}` + " - I don't have permission [" + `${cmd.permissions_bot.join(", ")}` + "]**");

  if (cmd.args && !args.length) return message.channel.send(client.help(cmd.name, prefix));

  if (!cooldowns.has(cmd.name)) {

    cooldowns.set(cmd.name, new Collection());

  }

  const now = Date.now();

  const timestamps = cooldowns.get(cmd.name);

  const cooldownAmount = (cmd.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {

    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {

      const timeLeft = (expirationTime - now) / 1000;

      return message.channel.send(`> **${config.emojis.error} - please wait ${timeLeft.toFixed(1)} second(s)**`).then(msg => {

        msg.delete({ timeout: 2500 });

      });

    }

  }

  timestamps.set(message.author.id, now);

  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  command.run(message, args, client);

});

client.on('nitroBoost', (booster) => {

  const { dbg } = client.data;

  var data = dbg.get(booster.guild.id);

  var embed = new MessageEmbed().setTitle(`مـشكور عـلى البـوست <a:Boost:839609600798097408>`).setColor("BLACK").setDescription(`خـصائـص الرتبه كـالـتالـي:\nـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ\nخصـم لـ روبوكس\n**1 Robux = ${Math.floor(parseInt(data.getPrice) - parseInt(data.getPrice) * (parseInt(data.getDiscount) / 100))}**\nالـقنوات الـخاصـه\nـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ\nأسـتمـتع بـخصائـصك`);

   var ro = booster.guild.roles.cache.sort((b,a) => b.position + a.position).find(r => r.id === data.getBoostRole);

   if (ro) booster.roles.add(booster.guild.roles.cache.find(a => a.id === ''))

    booster.guild.channels.cache.get(data.getBoostRoom).send(embed);
  
  const fetch = require('node-fetch')

setInterval(async () => {
  await fetch('https://hissing-flossy-sandalwood.glitch.me').then(console.log('Pinged!'))
}, 240000)

});

client.login(config.token);