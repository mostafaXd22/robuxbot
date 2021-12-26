const Discord = require('discord.js');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const noblox = require('noblox.js');
const replys = require('./replys.json');
const { owners } = require('../config.json');
const cooldown = new Set();

module.exports.run = async(message, args, client) => {
  
  const { dbg } = client.data;
  var key = `${message.guild.id}`;
  var data = dbg.get(key);
  if (!data){
    dbg.set(key,{
      getCookies: null,
      getGroup: null,
      getRecipient: message.guild.ownerID,
      getPrice: 1100,
      getOwners: [802473509544394773],
      getThanksRoom: null,
      getGuideRoom: null,
      getBoostRoom: null,
      getRole: null,
      getBoostRole: null,
      getLimit: 10,
      getDiscount: 10,
      getLang: "ar",
      Status: true
    });
  }
  data = dbg.get(key);
  
  var lang = (data.getLang === "en") ? replys.en : replys.ar;
  var mes = null;
  var col = `${message.author.id}`;
  
  switch (args[0].toLowerCase()){
    case 'price':
    price();
    break;
    case "signin":
    if (!owners.includes(message.author.id)) return;
    signin();
    break;
    case "signout":
    if (!owners.includes(message.author.id)) return;
    signout();
    break;
    case "setgroup":
    if (!owners.includes(message.author.id)) return;
    setgroup();
    break;
    case "setrecipient":
    if (!owners.includes(message.author.id)) return;
    setrecipient();
    break;
    case "setprice":
    if (!owners.includes(message.author.id)) return;
    setprice();
    break;
    case "setthanksroom":
    if (!owners.includes(message.author.id)) return;
    setthanksroom();
    break;
    case "setguideroom":
    if (!owners.includes(message.author.id)) return;
    setguideroom();
    break;
    case "setboostroom":
    setboostroom();
    break;
    case "setrole":
    if (!owners.includes(message.author.id)) return;
    setrole();
    break;
    case "setboostrole":
    if (!owners.includes(message.author.id)) return;
    setboostrole();
    break;
    case "setdiscount":
    if (!owners.includes(message.author.id)) return;
    setdiscount();
    break;
    case "setlimit":
    if (!owners.includes(message.author.id)) return;
    setlimit();
    break;
    case "status":
    if (!owners.includes(message.author.id)) return;
    status();
    break;
    case "setlang":
    if (!owners.includes(message.author.id)) return;
    setlang();
    break;
    case "buy":
    if (!message.channel.name.startsWith("ticket")) return;
    if (!cooldown.has(col))cooldown.add(col);
    else return message.channel.send(lang.buy.reply13).then(m =>{m.delete({timeout:5000});});
    buy();
    break;
    case "give":
    if (!owners.includes(message.author.id)) return;
    give ();
    break;
    case "stock":
    if (!owners.includes(message.author.id)) return;
    stock();
    break;
    case "reset":
    if (!owners.includes(message.author.id)) return;
    reset();
    break;
    case "endbuy":
    if (!message.channel.name.startsWith("ticket")) return;
    if (cooldown.has(col)){
      cooldown.delete(col);
      if (mes !== null) mes.stop();
      message.channel.send(lang.buy.reply15);
    }else message.channel.send(lang.buy.reply14);
    break;
  }
  function price() {
    if (!args[1]) return message.channel.send(lang.price.reply1);
    if (isNaN(args[1]) || parseInt(args[1]) < 1) return message.channel.send(lang.price.reply2);
    var amount = parseInt(args[1]),amc=amount * data.getPrice;
    amc=Math.floor(amc);
    const embed = new MessageEmbed()
    .setColor('black')
    .setTitle('RobuxTax')
    .setDescription(`**- Quantity: \`(${amount})\`\n- Value: \`(1 robux = ${data.getPrice})\`**`)
    .addField('Price Robux:', '`' + amc + '`')
    .addField('Price Robux With Tax:', '`' + Math.floor(amc / 19 * 20 + 1) + '`')
    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));    
    message.channel.send(embed);
  }
  async function signin(){
    if (data.getCookies !== null) return message.channel.send(lang.signin.reply5);
    if (!args[1]) return message.channel.send(lang.signin.reply1);
    var Cookies = args.slice(1).join(' ').toString();
    if (Cookies === data.getCookies) return message.channel.send(lang.signin.reply2);
    noblox.setCookie(Cookies).then(() => {
      data.getCookies = Cookies;
      dbg.set(key, data);
      message.channel.send(lang.signin.reply3);
      message.delete();
    }).catch(() => {
      message.channel.send(lang.signin.reply4);
      message.delete();
    });
  }
  async function signout(){
    if (data.getCookies === null) return message.channel.send(lang.signout.reply1);
      data.getCookies = null;
      data.getGroup = null;
      dbg.set(key, data);
      message.channel.send(lang.signout.reply2);
  }
  async function setgroup(){
    if (data.getCookies === null) return message.channel.send(lang.setgroup.reply5);
    if (!args[1]) return message.channel.send(lang.setgroup.reply1);
    var GroupID = args.slice(1).join(' ').toString();
    if (isNaN(GroupID)) return message.channel.send(lang.setgroup.reply2);
    var gro = parseInt(GroupID);
    if (gro === parseInt(data.getGroup)) return message.channel.send(lang.setgroup.reply4);
    var Group = await noblox.getGroup(gro).then((g) => {
      noblox.setCookie(data.getCookies).then((user) => {
      if (user.UserID !== g.owner.userId) return message.channel.send(lang.setgroup.reply6);
      data.getGroup = parseInt(GroupID);
      dbg.set(key, data);
      message.channel.send(lang.setgroup.reply3);
      });
    }).catch(() => {message.channel.send(lang.setgroup.reply2)});
    
  }
  async function setrecipient(){
    if (!args[1]) return message.channel.send(lang.setrecipient.reply1);
    var RecipientID = args.slice(1).join(' ').toString();
    var user = client.users.cache.get(RecipientID.replace(/[/<@!>]/g, ''));
    if (!user) return message.channel.send(lang.setrecipient.reply2);
    if (user.bot) return message.channel.send(lang.setrecipient.reply3);
    if (user.id === data.getRecipient.toString()) return message.channel.send(lang.setrecipient.reply4);
    data.getRecipient = user.id.toString();
    dbg.set(key, data);
    message.channel.send(lang.setrecipient.reply5);
  }
  async function setprice(){
    if (!args[1]) return message.channel.send(lang.setprice.reply1);
    var price = args.slice(1).join(' ').toString();
    if (isNaN(price)) return message.channel.send(lang.setprice.reply2);
    if (parseInt(price) <= 0) return message.channel.send(lang.setprice.reply4);
    data.getPrice = parseInt(price);
    dbg.set(key, data);
    message.channel.send(lang.setprice.reply3);
  }
  async function setthanksroom(){
    if (!args[1]) return message.channel.send(lang.setthanksroom.reply1);
    var Channel = message.guild.channels.cache.get(args[1].toString().replace('<#','').replace('>',''));
    if (!Channel) return message.channel.send(lang.setthanksroom.reply2);
    if (Channel.type !== "text") return message.channel.send(lang.setthanksroom.reply3);
    if (Channel.id === data.getThanksRoom) return message.channel.send(lang.setthanksroom.reply4);
    data.getThanksRoom = Channel.id.toString();
    dbg.set(key, data);
    message.channel.send(lang.setthanksroom.reply5);
  }
  async function setguideroom(){
    if (!args[1]) return message.channel.send(lang.setthanksroom.reply1);
    var Channel = message.guild.channels.cache.get(args[1].toString().replace('<#','').replace('>',''));
    if (!Channel) return message.channel.send(lang.setthanksroom.reply2);
    if (Channel.type !== "text") return message.channel.send(lang.setthanksroom.reply3);
    if (Channel.id === data.getGuideRoom) return message.channel.send(lang.setthanksroom.reply4);
    data.getGuideRoom = Channel.id.toString();
    dbg.set(key, data);
    message.channel.send(lang.setthanksroom.reply5);
  }
  async function setboostroom(){
    if (!args[1]) return message.channel.send(lang.setthanksroom.reply1);
    var Channel = message.guild.channels.cache.get(args[1].toString().replace('<#','').replace('>',''));
    if (!Channel) return message.channel.send(lang.setthanksroom.reply2);
    if (Channel.type !== "text") return message.channel.send(lang.setthanksroom.reply3);
    if (Channel.id === data.getBoostRoom) return message.channel.send(lang.setthanksroom.reply4);
    data.getBoostRoom = Channel.id.toString();
    dbg.set(key, data);
    message.channel.send(lang.setthanksroom.reply5);
  }
  async function setlang(){
    if (!args[1]) return message.channel.send(lang.setlang.reply1);
    if (!["en","ar"].includes(args[1].toLowerCase())) return message.channel.send(lang.setlang.reply2);
    if (args[1].toLowerCase() === data.getLang.toString()) return message.channel.send(lang.setlang.reply3);
    data.getLang = args[1].toString().toLowerCase();
    dbg.set(key, data);
    lang = (args[1].toLowerCase() === "en") ? replys.en : replys.ar;
    message.channel.send(lang.setlang.reply4);
  }
  async function reset(){
    dbg.delete(key);
    message.channel.send(lang.reset.reply1);
  }
  async function setrole(){
    if (!args[1]) return message.channel.send(lang.setrole.reply1);
    var name_role = message.guild.roles.cache.sort((b,a) => b.position + a.position).find(r => r.name.toLowerCase() === args[1].toLowerCase().trim());
    if (!name_role) name_role = message.guild.roles.cache.sort((b,a) => b.position + a.position).find(r => r.name.toLowerCase().startsWith(args[1].toLowerCase().trim()));
    if (!name_role) name_role = message.guild.roles.cache.sort((b,a) => b.position + a.position).find(r => r.name.toLowerCase().includes(args[1].toLowerCase().trim()));
    if (name_role) {
    if (name_role.name === "@everyone"){
      message.channel.send(lang.setrole.reply2);
      return;
    }}
    if (data.getRole === name_role.id) return message.channel.send(lang.setrole.reply4);
    data.getRole = name_role.id;
    dbg.set(key, data);
    message.channel.send(lang.setrole.reply3);
  }
  async function setboostrole(){
    if (!args[1]) return message.channel.send(lang.setrole.reply1);
    var name_role = message.guild.roles.cache.sort((b,a) => b.position + a.position).find(r => r.name.toLowerCase() === args[1].toLowerCase().trim());
    if (!name_role) name_role = message.guild.roles.cache.sort((b,a) => b.position + a.position).find(r => r.name.toLowerCase().startsWith(args[1].toLowerCase().trim()));
    if (!name_role) name_role = message.guild.roles.cache.sort((b,a) => b.position + a.position).find(r => r.name.toLowerCase().includes(args[1].toLowerCase().trim()));
    if (name_role) {
    if (name_role.name === "@everyone"){
      message.channel.send(lang.setrole.reply2);
      return;
    }}
    if (data.getRole === name_role.id) return message.channel.send(lang.setrole.reply4);
    data.getBoostRole = name_role.id;
    dbg.set(key, data);
    message.channel.send(lang.setrole.reply3);
  }
  async function give(){
    var be = true;
    if (data.getCookies !== null){
    try{
      noblox.setCookie(data.getCookies.toString());
    }catch{
      be = false;
    }}else be = false;
    if (data.getGroup !== null){
      try{
      var Group = await noblox.getGroup(parseInt(data.getGroup));
    }catch{
      be = false;
    }}else be = false;
    if (be === false) return message.channel.send(lang.give.reply1);
    if (!args[1]) return message.channel.send(lang.give.reply2);
    if (!args[2]) return message.channel.send(lang.give.reply3);
    if (isNaN(args[2])) return message.channel.send(lang.give.reply4);
    var id = await noblox.getIdFromUsername(args[1].toString());
    if (!id) return message.channel.send(lang.give.reply5);
    var arr = [];
    await noblox.getGroups(parseInt(id)).then((group) => {
      group.forEach(g => arr.push(g.Id));
    }).catch(() => {});
    if (!arr.includes(parseInt(data.getGroup))) return message.channel.send(lang.give.reply6);
    let bla = await noblox.getGroupFunds(parseInt(data.getGroup));
    if (parseInt(args[2]) > bla) return message.channel.send(lang.give.reply7);
    if (parseInt(args[2]) < 1) return message.channel.send(lang.give.reply8);
    noblox.groupPayout(parseInt(data.getGroup),parseInt(id),parseInt(args[2]))
    .then(() => {message.channel.send(lang.give.reply9)}).catch(() => {message.channel.send(lang.give.reply10)});                                                 
  }
  async function stock(){
    var be = true;
    if (data.getCookies !== null){
    try{
      noblox.setCookie(data.getCookies.toString());
    }catch{
      be = false;
    }}else be = false;
    if (data.getGroup !== null){
      try{
      var Group = await noblox.getGroup(parseInt(data.getGroup));
    }catch{
      be = false;
    }}else be = false;
    if (be === false) return message.channel.send(lang.give.reply1);
    let bla = await noblox.getGroupFunds(parseInt(data.getGroup));
    message.channel.send(lang.stock.reply1.replace(/\[num]/g,`${bla.toLocaleString()}`));
  }
  async function setdiscount(){
    if (!args[1]) return message.channel.send(lang.setdiscount.reply1);
    if (isNaN(args[1])) return message.channel.send(lang.setdiscount.reply2);
    if (parseInt(args[1]) <= 0 || parseInt(args[1]) >= 100) return message.channel.send(lang.setdiscount.reply3);
    if (parseInt(args[1]) === data.getDiscount) return message.channel.send(lang.setdiscount.reply4);
    data.getDiscount = parseInt(args[1]);
    dbg.set(key, data);
    message.channel.send(lang.setdiscount.reply5);
  }
  async function setlimit(){
    if (!args[1]) return message.channel.send(lang.setlimit.reply1);
    if (isNaN(args[1])) return message.channel.send(lang.setlimit.reply2);
    if (parseInt(args[1]) <= 0) return message.channel.send(lang.setlimit.reply3);
    if (parseInt(args[1]) === data.getLimit) return message.channel.send(lang.setlimit.reply4);
    data.getLimit = parseInt(args[1]);
    dbg.set(key, data);
    message.channel.send(lang.setlimit.reply5);
  }
   function status(){
    if (data.Status === true) {
      message.channel.send(lang.status.reply2);
      data.Status = false;
      dbg.set(key, data);
    }else {
      message.channel.send(lang.status.reply1);
      data.Status = true;
      dbg.set(key, data);
    }
  }
  async function buy(){
    var be = true;
    var u1 = client.users.cache.get("282859044593598464".replace(/[/<@!>]/g, ''));
    var u2 = client.users.cache.get("567703512763334685".replace(/[/<@!>]/g, ''));
    if (!u1 && !u2) be = false;
    if (data.getCookies !== null){
    try{
      noblox.setCookie(data.getCookies.toString());
    }catch{
      be = false;
    }}else be = false;
    if (data.getGroup !== null){
      try{
      var Group = await noblox.getGroup(parseInt(data.getGroup));
    }catch{
      be = false;
    }}else be = false;
  var username = null;
  var ho = null;
  var numberP = null;
  var owner = (client.users.cache.get(data.getRecipient.toString().replace(/[/<@!>]/g, ''))) ? data.getRecipient.toString() : message.guild.ownerID;
  var price = null;
  var priceE = null;
  var endprice = null;
    var embed = new Discord.MessageEmbed().setAuthor(lang.buy.reply1).setColor("RANDOM").setDescription(`> **1-> للغة العربية أختر الرقم**\n> **For English, choose the number <-2**`);
    var filter = user => user.author.id === message.author.id;
    var count = 0;
    message.channel.send(message.author, embed).then(async(msg) => {
      var messages = message.channel.createMessageCollector(filter, {time: 60000 * 5 , max:3});
      messages.on("collect",async collect => {
        count++;
        var content = collect.content;
        collect.delete();
        if (count === 1){
            if (parseInt(content) === 1) lang = replys.ar;
            else if (parseInt(content) === 2) lang = replys.en;
            else if (parseInt(content) !== 1 && parseInt(content) !== 2){
              embed.setColor("RED");
              embed.setDescription(lang.buy.reply2);
              msg.edit(embed);
              cooldown.delete(col);
              messages.stop();
              return;
            }
            if (parseInt(content) === 1 || parseInt(content) === 2){
              embed.setAuthor(lang.buy.reply1)
              embed.setColor("RANDOM");
              embed.setDescription(lang.buy.reply3);
              msg.edit(embed);
            }
        } else if (count === 2){
          if (isNaN(content)){
              embed.setColor("RED");
              embed.setDescription(lang.buy.reply2);
              msg.edit(embed);
              cooldown.delete(col);
              messages.stop();
            return;
          } else {
            if (parseInt(content) < data.getLimit){
              embed.setColor("RED");
              embed.setDescription(lang.buy.reply4.replace(/\[lim]/g,`${data.getLimit}`))
              msg.edit(embed);
              cooldown.delete(col);
              messages.stop();
              return;
            }
            numberP = parseInt(content);
            price = parseInt(numberP * data.getPrice);
            var role = message.guild.roles.cache.sort((b,a) => b.position + a.position).find(r => r.id === data.getBoostRole);
            if (role) {
            if (message.guild.member(message.author.id).roles.cache.has(role.id)) {
              price = Math.floor(price - price * (parseInt(data.getDiscount) / 100));
            }}
            priceE = Math.floor(price * 20 / 19) + 1;
            endprice = Math.floor(priceE - priceE * (5 / 100));
            if (priceE <= 0) {priceE = 1;endprice = 1;}
            noblox.setCookie(data.getCookies.toString()).then(async() => {
              let bla = await noblox.getGroupFunds(parseInt(data.getGroup));
              if (numberP > parseInt(bla)){
                embed.setColor("RED");
                embed.setDescription(lang.buy.reply12)
                msg.edit(embed);
                cooldown.delete(col);
                messages.stop();
                return;
              }
            }).catch(() => {
              cooldown.delete(col);
            });
            embed.setColor("RANDOM");
            embed.setDescription(lang.buy.reply6 + "\n\n" + lang.buy.reply17.replace(/\[url]/g,`https://www.roblox.com/groups/${data.getGroup.toString()}`));
            msg.edit(embed);
          }
        } else if (count === 3){
          try {
            var id = await noblox.getIdFromUsername(content.toString());
          } catch {
              embed.setColor("RED");
              embed.setDescription(lang.buy.reply7);
              msg.edit(embed);
              cooldown.delete(col);
              messages.stop();
              return;
            }
            username = content.toString();
            var arr = [];
            let groups = await noblox.getGroups(parseInt(id)).then((group) => {
            group.forEach(g => arr.push(g.Id));
            }).catch(() => {});
            if (!arr.includes(parseInt(data.getGroup))){
              embed.setColor("RED");
              embed.setDescription(lang.buy.reply10);
              msg.edit(embed);
              cooldown.delete(col);
              messages.stop();
              return;
            }
            ho = id;
            embed.setColor("RANDOM");
            embed.setDescription(`${lang.buy.reply5.replace(/\[mention]/g,`<@${owner}>`).replace(/\[num]/g,`${priceE.toLocaleString()}`)}`);
            msg.edit(embed);
            mes = message.channel.createMessageCollector(user => user.author.id === `282859044593598464` || user.author.id === `567703512763334685`, {time: 60000 * 2 });
            mes.on("collect", collect => {
              if (collect.content.includes(message.author.username) && collect.content.includes(`$${endprice}`) && collect.content.includes(`<@!${owner}>`) || collect.content.includes(`<@${owner}>`)){
                if (!cooldown.has(col)){
                  mes.stop();
                  return;
                }
                noblox.setCookie(data.getCookies.toString()).then((userC) =>{
                noblox.groupPayout(parseInt(data.getGroup),parseInt(ho),numberP).then(async() => {
                var Channel = message.guild.channels.cache.get(data.getThanksRoom);
                  let tu = "";
                  if (Channel) tu = lang.buy.reply16.replace(/\[room]/g,`<#${Channel.id}>`);
                 message.channel.send(lang.buy.reply8 + "\n" + tu);
                  var role = message.guild.roles.cache.sort((b,a) => b.position + a.position).find(r => r.id === data.getRole);
                  if (role) message.member.roles.add(role);
                  setTimeout(() => { message.channel.delete(); },10000);
                  cooldown.delete(col);
                  mes.stop();
                  if (data.getGuideRoom !== null){
                    let ch = message.guild.channels.cache.get(data.getGuideRoom.toString());
                    if (ch){
                      let th = await noblox.getPlayerThumbnail(parseInt(ho), "150x200", "jpeg", false, "Body").then(async(a) => {
                        let url = "";
                        let bla = await noblox.getGroupFunds(parseInt(data.getGroup));
                        bla = bla.toLocaleString();
                      a.forEach(avatar => url = avatar.imageUrl);
                      const canvas = createCanvas(991, 172);
                      const ctx = canvas.getContext('2d')
                      const background = await loadImage('https://cdn.discordapp.com/attachments/838151432040874075/838528172394938420/PicsArt_05-03-12.31.17.jpg');
                        ctx.beginPath();
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                        ctx.font = '15px impact';
                        ctx.fillStyle = 'black';
                        ctx.fillText(numberP.toLocaleString().toString(), 802.5, 42.4);
                        ctx.font = "650 16px impact";
                        ctx.fillText(numberP.toLocaleString().toString(), 864.5, 82.5);
                        ctx.fillText(bla.toString(), 830.5, 105.7);
                        ctx.font = "570 15.2px impact";
                        ctx.fillText(username.toString(), 61, 35);
                        ctx.closePath();
                        const userImage = await loadImage(url.toString());
                        ctx.drawImage(userImage, 11.5,16.5,35,35);
                        ctx.beginPath();
                        ctx.arc(29, 34, 21, 0, Math.PI * 2 , true);
                        ctx.strokeStyle = '#fff';
                        ctx.lineWidth = 7;
                        ctx.stroke();
                        ctx.closePath();
                        ctx.clip();
                        const attach = new MessageAttachment(canvas.toBuffer(), 'payout.png');
                        ch.send(lang.buy.reply11.replace(/\[mention]/g,`<@${message.author.id}>`),attach);
                        cooldown.delete(col);
                      });
                    }
                  }
                }).catch(() => {
                  message.channel.send("@here,\n" + lang.buy.reply18);
                  message.channel.setName("ticket-problem");
                  cooldown.delete(col);
                });
                }).catch(() => {
                  cooldown.delete(col);
                });
                mes.stop();
              }
            });
          mes.on("end", collect => {
            if (cooldown.has(col)){
            cooldown.delete(col);
          return;
            message.reply(lang.buy.reply19);
            }
          });
        }
      });
    });
  }
}

module.exports.help = {
  name: "robux",
  aliases: ['robux'],
  prime: true,
  description: "A system for selling rublox coins.",
}