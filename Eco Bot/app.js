const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const moment = require('moment');

bot.on("message", message => {

// JSON file retrieval
let userData = JSON.parse(fs.readFileSync('Storage/userData.json' , 'utf8'));
let storeData = JSON.parse(fs.readFileSync('Storage/storeData.json' , 'utf8'));

//Variable List
const sender = message.author;
const msg = message.content.toUpperCase();
const prefix = "!"
const time = moment().format('dddd');
let statChange = message.content.split(" ");
let statChange2 = statChange[1]
let messagesplit = statChange[0]
const modRole = "Banker";
let cont = message.content.slice(prefix.length).split(" ");
let args = cont.slice(1);
let defineduser = "";


//Makes sure the Bot doesn't read it's own message
if  (bot.user.id === message.author.id) { return }

//Basic userData Objects
if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {}
if (!userData[sender.id + message.guild.id].money) userData[sender.id + message.guild.id].money = 10000000;
if (!userData[sender.id + message.guild.id].daily) userData[sender.id + message.guild.id].daily = time
if (!userData[sender.id+message.guild.id].stats) userData[sender.id + message.guild.id].stats = "00000000000000";
if (!userData[sender.id+message.guild.id].name) userData[sender.id + message.guild.id].name = message.author.username.toUpperCase()
if (!userData[sender.id+message.guild.id].units) userData[sender.id+message.guild.id].units = 0
if (!userData[sender.id+message.guild.id].men) userData[sender.id+message.guild.id].men = 0

// Statistic Variables
var genStat = userData[sender.id+message.guild.id].stats
var pop = genStat.substr(0,2)
var industry = genStat.substr(2,2)
var tech = genStat.substr(4,2)
var arcana = genStat.substr(6,2)
var social = genStat.substr(8,2)
var expansion = genStat.substr(10,2)
var military = genStat.substr(12,2)
let army = military*100;

//Help command
 if (msg == "!HELP") {
   message.author.send("Commands: !Transfer <amount> <mention user> (YOU MUST MENTION A USER, FAILURE TO MENTION A USER WILL KILL THE BOT!!!) , !Money or !balance , !stats , !Daily (now depricated, but you can use it if ya want) , !Buy <amount> <unit> (If you do not get a confirmation message, the command did not work!) , !Army , !CTT (Tells you how many Transport Ships you need for your entire army, if you want something more specific, count it yourself.), !Units gives you a list of all the unit names and costs (handy if the unit your trying to buy doesnt work, your probably spelling it wrong. Also be prepared for ALOT of DMs)")
}

//List Unit Name Command
if (msg === "!UNITS"){
  for (var i in storeData){
    message.author.send(storeData[i].name + " - $" + storeData[i].cost )
  }
}


//Admin Add Money Command
if (msg.startsWith('!FUNDING')) {
//User Error Messages
  if (!message.member.roles.find("name", modRole)) {
    message.channel.send("You need the role " + modRole + " to use this command...");
    return;
  }
  if(!args[0]) {
    message.channel.send("You need to define an amount. Usage !FUNDING <amount> <user>");
  return;
  }
if (isNaN(args[0])) {
message.channel.send("You need to use a number. Usage !FUNDING <amount> <user>");
  return;
}

  if (!args[1]) {
     defineduser = message.author.id;
   } else if (message.isMemberMentioned) {
   let firstMentioned = message.mentions.users.first();
   if(!firstMentioned){
       return message.reply("Please mention a valid member of this server")
     }else{
           defineduser = firstMentioned.id;
     }
  }else{
   message.channel.send("You must mention a user, not just type their name!")
  }
  for (var i in userData) {
    if(i.includes(defineduser)) {
      console.log(userData[i].money)
     userData[i].money += parseInt(args[0])
                  } else {
                    console.log ("Failure Funding")
                  }}
  message.channel.send("User had " + args[0] + " added/subtracted from their account")
}


//Allowing User to transfer money to another User
if(msg.startsWith("!TRANSFER")) {
//User Error Messages
  if(!args[0]) {
    message.channel.send("You need to define an amount. Usage !Transfer <amount> <user>");
  return;
  }

  if (isNaN(args[0])) {
  message.channel.send("You need to define the amount with a number. Usage !Transfer <amount> <user>");
  return;
  }

  if (args[0].includes("-")) {
    message.channel.send("Thought you could outsmart the machine eh? I KNOW ALL, I SEE ALL, DO NOT TEST ME MEATBAG")
    return;
  }

  if (!args[1]) {
    defineduser = message.author.id;
  } else if (message.isMemberMentioned) {
  let firstMentioned = message.mentions.users.first();
  if(!firstMentioned){
      return message.reply("Please mention a valid member of this server")
    }else{
          defineduser = firstMentioned.id;
    }
  }else{
   message.channel.send("You must mention a user, not just type their name!")
  }
//Adds money to mentioned user's .money property and subtracts money from the other user's .money property
let numberA =  parseInt(args[0]);

for (var i in userData) {
  if(i.includes(defineduser)) {
   userData[i].money = userData[i].money + numberA
   userData[sender.id + message.guild.id].money = userData[sender.id + message.guild.id].money - numberA
                }}
message.channel.send(" User had " + args[0] + " added to their account")
}

//User's Skills Displayed Command
if (msg === prefix + "STATS") {
  message.channel.send(message.author.username + "'s Skills: " + "Population- " + pop + " " + "Industrial Output- " + industry + " " + "Technological Advancement- " + tech + " " + "Arcanic Enlightenment- " + arcana + " " + "Social Stability- " + social + " " + "Expansionism- " + expansion + " " + "Military Strength- " + military)
}

//User Check Money Command
if (msg === prefix + 'MONEY' || msg === prefix + 'BALANCE' ) {
  message.channel.send({"embed":{
     title:"Bank",
     color: 0xF1C40F,
     fields:[{
       name: "Account Holder",
       value:message.author.username,
       inline:true
     },
     {
       name:"Account Balance",
       value:userData[sender.id + message.guild.id].money,
       inline:true
     }]
  }})
}

//Admin Edit Skills Command
if (msg .includes("!E")) {
  if (!message.member.roles.find("name", modRole)) {
    message.channel.send("You need the role " + modRole + " to use this command...");
    return;
  }
 if (!args[1]) {
   defineduser = message.author.id;
 } else if (message.isMemberMentioned) {
 let firstMentioned = message.mentions.users.first();
 if(!firstMentioned){
     return message.reply("Please mention a valid member of this server")
   }else{
         defineduser = firstMentioned.id;
   }
 }else{
  message.channel.send("Gotta mention a user my dude")
 }
 for (var i in userData) {
   if(i.includes(defineduser)) {
    userData[i].stats = (args[0])
                 }}}

//Daily Command Checks
if (msg === prefix + 'DAILY') {
  if (userData[sender.id + message.guild.id].daily == time){
  message.channel.send({embed:{
    title:"Daily Income",
    description: "Your Daily Income has already been added! You can collect your income again " + moment().endOf('day').fromNow() + '.'
  }})}}
if (msg === prefix + 'DAILY') {
      if (userData[sender.id + message.guild.id].daily != time){
      userData[sender.id + message.guild.id].daily = time
      userData[sender.id + message.guild.id].money += industry*100000;
      message.channel.send({embed:{
        title:"Daily Income",
        description: "Your Daily Income has been added!"
      }})}}


//Buy Units Command
if(msg.startsWith("!BUY")) {
        if (userData[sender.id + message.guild.id].units > army ) {
          message.channel.send("Your Army is too large! Cannot add more units.")
          return;
        }

        if(!args[1]) {
          message.channel.send("Unit not Found. Please make sure the unit name is case sensitive and without spaces!");
        return;
        }
        if (!isNaN(args[1])) {
        message.channel.send("Dude, thats not even a word.");
        return;
        }

      if(!args[0]) {
        message.channel.send("You must state how many of the Unit you wish to purchase!");
      return;
      }
      if(isNaN(args[0])) {
        message.channel.send("You must quantify units with a NUMBER, amazing right? That you have to use an ACTUAL NUMBER to tell me how many units you want?");
      return;
      }
      let unitNumber = parseInt(args[0]);
      let unitNumber2 = unitNumber/3;
        for (var i in storeData) {
          let finale = Object.getOwnPropertyDescriptor(storeData[i], 'name');
          let gunter = finale.value.toString();
          if(i == (args[1])) {
            if(userData[sender.id + message.guild.id].money < storeData[i].cost) {
              message.channel.send("Not enough money, go rob a bank or something!")
              return;
            }

           if (userData[sender.id + message.guild.id].hasOwnProperty(storeData[i].name)){
             userData[sender.id + message.guild.id][storeData[i].name] = userData[sender.id + message.guild.id][storeData[i].name] + unitNumber
             message.channel.send("Added " + args[1] + " to your army!")
             userData[sender.id + message.guild.id].units = userData[sender.id + message.guild.id].units + unitNumber
             userData[sender.id + message.guild.id].money = userData[sender.id + message.guild.id].money - storeData[i].cost*unitNumber
             userData[sender.id + message.guild.id].men = userData[sender.id + message.guild.id].men + storeData[i].men*unitNumber
             break;
   } else {
     Object.defineProperty(userData[sender.id + message.guild.id], gunter, {
value: 0,
writable: true,
enumerable: true
})
userData[sender.id + message.guild.id][storeData[i].name] = userData[sender.id + message.guild.id][storeData[i].name] + unitNumber
message.channel.send("Added " + args[1] + " to your army!")
userData[sender.id + message.guild.id].units = userData[sender.id + message.guild.id].units + unitNumber
userData[sender.id + message.guild.id].money = userData[sender.id + message.guild.id].money - storeData[i].cost*unitNumber
userData[sender.id + message.guild.id].men = userData[sender.id + message.guild.id].men + storeData[i].men*unitNumber
break;
}}
if (storeData[i].name == "NaN") {
  message.channel.send("That is not a Unit!")
}}}


// Army List Command
 if (msg === ("!ARMY")) {
    for (var i in storeData) {
        if (userData[sender.id + message.guild.id].hasOwnProperty(storeData[i].name)) {
          if (!userData[sender.id + message.guild.id][storeData[i].name] == 0) {
            message.author.send(storeData[i].name + " : " + userData[sender.id + message.guild.id][storeData[i].name])
        }
      }
    }
  }

//Calculate Troop Transports Needed Command
if (msg == "!CTT"){
message.author.send("You require " + Math.ceil(userData[sender.id + message.guild.id].men/10000) + " Troop Transports to carry your army")
}


//For Testing Purposes Only


//Checks if Daily Income should be added
for (var i in userData){
if (userData[i].daily != time){
userData[i].daily = time
userData[i].money += industry*100000;}}

//JSON File writing
fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
 if (err) console.error(err);
 })
})

//Bot Ready Message and login
bot.on('ready', () => {
 console.log('All Systems active...')
})


bot.login('NDcwOTUyOTA4NTUzMTkxNDI0.DkFKDQ.ieRm7oc57d7Qe1mbKBV6GXSwxiI')
