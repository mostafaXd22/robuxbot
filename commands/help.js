const { MessageEmbed } = require('discord.js');
const { owners } = require('../config.json');
module.exports.run = async(message, args, client) => {
  if (!owners.includes(message.author.id)) return;
  var prefix = client.prefix;var cmd = "robux";
  var embed = new MessageEmbed().setAuthor(`قائـمة الـمساعـدة`).setColor("RANDOM").setDescription(`${prefix}${cmd} signin\nللتسجيل بواسطة الكوكيز\n${prefix}${cmd} signout\nلتسجيل الخروج من الكوكيز\n${prefix}${cmd} setgroup\nلتحديد المجموعة\n${prefix}${cmd} setrecipient\nلتحديد مستلم الأرباح\n${prefix}${cmd} setprice\nلتحديد السعر\n${prefix}${cmd} setdiscount\nلتحديد قيمة الخصم\n${prefix}${cmd} setguideroom\nلتحديد روم الادلة\n${prefix}${cmd} setthanksroom\nلتحديد روم الشكر\n${prefix}${cmd} setboostroom\nلتحديد روم البوستات\n${prefix}${cmd} setrole\nلتحديد الرتبة التي تعطئ بعد الشراء\n${prefix}${cmd} setboostrole\nلتحديد رتبة البوستات للحصول على الخصم\n${prefix}${cmd} setlimit\nلتحديد حد أدنئ لشراء الروبكس\n${prefix}${cmd} setlang\nلتغيير اللغة\n${prefix}${cmd} price\nلحساب الضريبة\n${prefix}${cmd} status\nلتفعيل وتعطيل الشراء\n${prefix}${cmd} stock\nلعرض مخزون الروبكس الذي في المجموعة\n${prefix}${cmd} give\nلإعطاء الروبكس\n${prefix}${cmd} buy\nلشراء الروبكس\n${prefix}${cmd} endbuy\nلإلغاء عملية الشراء\n${prefix}${cmd} reset\nلإعادة ضبط النظام\n`.replace(/Des/g,`ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ`));
  message.channel.send(embed);
}

module.exports.help = {
  name: 'help'
}