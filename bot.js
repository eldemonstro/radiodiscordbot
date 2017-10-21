const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (message.content === 'ping') {
    if (process.env.NODE_ENV == 'development') {
      message.reply("I'm in development mode, yay");
    } else {
      message.reply('pong');
    }
  }

  if (!message.guild) return;

  if (message.content === '/join') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          message.reply('I have successfully connected to the channel!');
          // Replace with whatever radio link you are trying to play
          const dispatcher = connection.playArbitraryInput('http://lainhouse.com.br:8000/');
          console.log('Trying to play the thing');
          dispatcher.setVolume(0.3);
        })
        .catch(console.log);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }

  if (message.content === '/leave') {
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

client.login(process.env.TOKEN); // Replace with your bot token
