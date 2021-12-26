module.exports.run = async(message, args, client) => {
  const now = Date.now();
  const msg = await message.channel.send("🏓 **Ping**");
  const last = Date.now();
  msg.edit(`🏓 **Pong ${last - now} ms**`);
}

module.exports.help = {
  name: "ping",
  description: "Display speed of the bot.",
  usage: ['ping']
}