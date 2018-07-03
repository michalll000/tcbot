// [SYSTEM] Znaczniki główne
const botconfig = require("./botconfig.json");
const tokenfile = require("./token.json");
const Discord = require("discord.js");
const fs = require("fs");


const bot = new Discord.Client({disableEveryone: true});


// [SYSTEM/C] Status BOTa
bot.on("ready", async() => {
  console.log(`${bot.user.username} startuje z ${bot.users.size} graczami, w ${bot.channels.size} kanałach w ${bot.guilds.size} serwerach`);


    // -Ogląda
  //bot.user.setGame("tc!cmds", 'https://www.twitch.tv/');
  bot.user.setActivity(`tc!cmds | Na ${bot.guilds.size} serwerach!`, {type: "WATCHING"});
    // -W grze
        //bot.user.setGame("tc!help");

});

// Statystyki
bot.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`Dołączono do serwera ${guild.name} (ID: ${guild.id}). Ten serwer posiada ${guild.memberCount} członków i ${guild.channels.size} kanałów! To już ${bot.guilds.size} serwer!`);
  bot.user.setActivity(`tc!cmds | Na ${bot.guilds.size} serwerach!`, {type: "WATCHING"});
});

bot.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`Usunięto z serwera ${guild.name} (ID: ${guild.id}). Ten serwer posiada ${guild.memberCount} członków i ${guild.channels.size} kanałów! To był ${bot.guilds.size} serwer!`);
  bot.user.setActivity(`tc!cmds | Na ${bot.guilds.size} serwerach!`, {type: "WATCHING"});
});




// [SYSTEM] Blokowanie używania na priv i przez BOTy
bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;



// [SYSTEM] Wysyłanie wiadomości
  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);




// >>> KOMENDY <<<
  // PING
  if(cmd === `${prefix}ping`) {
     // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
     // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
     const m = await message.channel.send("Ping?");
     m.edit(`Pong! Czas od komendy do odpowiedzi: ${m.createdTimestamp - message.createdTimestamp}ms. Pomiar TC BOT to ${Math.round(bot.ping)}ms`);
   }

   // Powiedz (usuwa i pisze bot)
  if(cmd === `${prefix}powiedz`) {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{});
    // And we get the bot to say the thing:
    message.channel.send(sayMessage);

   }
// Centrum pomocy



// Pomoc
  if(cmd === `${prefix}adminpomoc`){
    let cmda = new Discord.RichEmbed()
    .setDescription("TC BOT")
    .setColor("#ff0000")
    .addField("Zarządzanie serwerem z TC BOT", "Aby móc zarządzać komendami administratora stwórz rolę 'TC BOT ADMIN' i przydziel ją sobie i administracji serwera. Aby poznać komendy dla administratorów wpisz tc!admincmds");

    return message.channel.send(cmda)
  }



// Kick
  if(cmd === `${prefix}wyrzuć`) {
    if(!message.member.roles.some(r=>["TC BOT ADMIN"].includes(r.name)) )
      return message.reply("Przepraszam! Nie masz uprawnień do używania tej komendy! Wpisz tc!adminhelp");
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Proszę wskazać prawidłową osobę na tym serwerze!");
    if(!member.kickable)
      return message.reply("Nie mogę wyrzucić tej osoby! Czyżby ona miała wyższą rolę odemnie? Posiadam uprawnienia administratora?");
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "[nie podano]";
    await member.kick(reason)
      .catch(error => message.reply(`Niestety, ${message.author}! Nie mogę wyrzucić tego członka! Błąd : ${error}`));
    message.reply(`${member.user.tag} został wyrzucony przez ${message.author.tag} z powodu: ${reason}`);
  }

// Ban



// Lista komend
  if(cmd === `${prefix}cmds`){
    let cmds = bot.user.displayAvatarURL;
    let cmdz = new Discord.RichEmbed()
    .setDescription("Komendy do TC BOT")
    .setColor("#8700ff")
    .setThumbnail(cmds)
    .addField(">>> Informacje <<<", "Co jakiś czas będą wychodzić nowe komendy!")
    .addField("tc!", "Prefix dla TC BOT")
    .addField("tc!ping", "Mierzy szybkość TC BOT")
    .addField("tc!powiedz", "Np. 'tc!powiedz coś'. TC BOT usuwa tą wiadomość z komendą i pisze własną z daną treścią")
    .addField("tc!pomoc admin", "Otwiera Centrum Pomocy wraz z komendami dla administratorów")
    .addField("tc!elo", "BOT przywita się z tobą elo (tak na testy czy działa lol)")
    .addField("tc!info", "Informacje na temat TC BOT")
    .addField("tc!serwer", "Informacje o serwerze jak i o tobie")
    .addField("tc!profil", "Twój profil TC BOT z informacjami o tobie")
    .addField("tc!despacito", "oofcito")
    .addField("tc!think", "3D EPIK GIF wat u think?")

    return message.channel.send(cmdz)
  }

// tc!
  if(cmd === `${prefix}`){
    let cmdz = new Discord.RichEmbed()
    .setDescription("TC BOT")
    .setColor("#ff0000")
    .addField("Szukasz komend do TC BOT?", "Wpisz tc!cmds")

    return message.channel.send(cmdz)
  }

// tc!help to zuee
  if(cmd === `${prefix}help`){
    let cmdz = new Discord.RichEmbed()
    .setDescription("TC BOT")
    .setColor("#ff0000")
    .addField("Komenda została przeniesiona!", "Wpisz tc!cmds")

    return message.channel.send(cmdz)
  }


// Meme - Despacito
  if(cmd === `${prefix}despacito`){
    return message.channel.send("https://a.wattpad.com/cover/147447551-352-k546492.jpg");
  }

// Rozmowa - elo
  if(cmd === `${prefix}elo`){
    return message.channel.send("elo");
  }

// GIF - think
  if(cmd === `${prefix}think`){
    return message.channel.send("https://media1.tenor.com/images/819e1a596896a3607b0f49b575b491cc/tenor.gif?itemid=8490815");
  }

// Informacje o BOT
  if(cmd === `${prefix}info`){
    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setDescription("Informacje o TC BOT")
    .setColor("#15f153")
    .setThumbnail(bicon)
    .addField("Autor", "Custom#9156")
    .addField("Działa od", bot.user.createdAt)
    .addField("Użytkownicy", bot.users.size)
    .addField("Kanały", bot.channels.size)
    .addField("Serwery", bot.guilds.size)
    .addField("Obecnie na serwerze", message.guild.name)

    return message.channel.send(botembed)
  }

//


// Informacje o serwerze
  if(cmd === `${prefix}serwer`){
    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setDescription("Informacje na temat serwera")
    .setColor("#4286f4")
    .setThumbnail(sicon)
    .addField("Nazwa serwera", message.guild.name)
    .addField("Stworzony", message.guild.createdAt)
    .addField("Dołączyłeś", message.member.joinedAt)
    .addField("Liczba członków", message.guild.memberCount);

    return message.channel.send(serverembed);
  }

// Profil użytkownika
  if(cmd === `${prefix}profil`){
    let picon = message.author.displayAvatarURL;
    let profilembed = new Discord.RichEmbed()
    .setDescription("TC BOT")
    .setColor("#00ff2a")
    .setThumbnail(picon)
    .addField("Profil użytkownika", message.author.username)
    .addField("Na tym koncie od", message.author.createdAt)
    .addField("Na serwerze od", message.member.joinedAt)
    .addField("ID:", message.author.id);

    return message.channel.send(profilembed);
  }
});




// [SYSTEM] Logowanie BOTa
bot.login(botconfig.token);
