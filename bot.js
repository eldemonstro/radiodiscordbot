const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config');

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (message.author.id == client.user.id) return;

  if (message.content === 'ping') {
    if (process.env.NODE_ENV == 'development') {
      message.reply("I'm in development mode, yay");
    } else {
      message.reply('pong');
    }
  }

  if (!message.content.startsWith(config.prefix)) return;

  let args = message.content.substring(config.prefix.length).match(/\S+/g);
  if (args == null) {
    message.reply('Please send a commmand');
    return;
  }

  if (message.author.id != config.ownerID) {
    message.reply("I'm in development mode right now, sorry :(")
    return;
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

console.log(config);
client.login(config.token); // Replace with your bot token
