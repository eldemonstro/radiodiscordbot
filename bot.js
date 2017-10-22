const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config');

client.on('ready', () => {
  console.log('I am ready!');
  client.user.setPresence({
    game: {
      name: "_db help"
    }
  });
});

client.on('message', message => {
  if (message.author.id == client.user.id) return;
  if (message.author.bot == true) return;

  if (message.content.toLowerCase() == 'ping') {
    if (process.env.NODE_ENV == 'development') {
      message.reply(`I'm in development mode, yay (also the time is ${client.ping}ms)`);
    } else {
      message.reply(`pong (also the time is ${client.ping}ms)`);
    }
  }

  if (message.content.toLowerCase() == 'pong') {
    message.channel.send(`How do you want me to ping if you alread pong? But your time is ${client.ping}ms anyway ¯\\_(ツ)_/¯`);
  }

  if (!message.content.startsWith(config.prefix)) return;

  let args = message.content.substring(config.prefix.length).match(/\S+/g);
  if (args == null) {
    message.reply('Please send a commmand');
    return;
  }

  if (message.author.id != config.ownerID && process.env.NODE_ENV == 'development') {
    message.reply("I'm in development mode right now, sorry :(")
    return;
  }

  if (args[0] === 'help') {
    message.channel.send({
      embed: {
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        timestamp: new Date(),
        color: 3447003,
        description: 'Use the bot however you want',
        title: 'Here is your help:',
        fields: [{
            name: 'Require _db prefix',
            value: helpMessagePrefix
          },
          {
            name: 'Do not require _db prefix',
            value: helpMessageNoPrefix
          }
        ],
        footer: {
          text: 'Good luck and get\'em boys'
        }
      }
    });
  }

  if (!message.guild) return;

  if (args[0] === 'join') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          message.reply('I have successfully connected to the channel!');
          // Replace with whatever radio link you are trying to play
          const dispatcher = connection.playArbitraryInput(config.defaultRadio);
          dispatcher.setVolume(0.3);
        })
        .catch(console.log);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }

  if (args[0] === 'leave') {
    // Only try to leave the sender's voice channel if they are in one themselves
    if (message.member.voiceChannel) {
      message.member.voiceChannel.leave();
    }
  }
});

process.on('SIGINT', () => {
  client.destroy()
    .then(() => {
      console.log('KTHXBYE')
      process.exit(0);
    });
});
process.on('SIGTERM', () => {
  client.destroy()
    .then(() => {
      console.log('KTHXBYE')
      process.exit(0);
    });
});

let helpMessageNoPrefix =
  `**ping** will pong you
**pong** will pong you too, pong pong is fun`

let helpMessagePrefix = `**join** will join your voice channel and will play ${config.defaultRadioName}
**leave** will leave the voice channel
**help** will help you`

client.login(config.token); // Replace with your bot token
