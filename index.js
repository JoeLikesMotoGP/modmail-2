// Thank you for using ModMail! Copyright (c) 2020 Johnodon.com. All Rights Reserved. Licensed under the MIT license located in the LICENSE file.

const Discord = require('discord.js');
const client = new Discord.Client();
const { token, server_id, channel_prefix, modmail_viewing_role_id, status, modmail_category_name, display_mod_name} = require('./config.json')

client.once('ready',async () => {
    await client.user.setActivity(status, { type: 'PLAYING' })
})

client.on('message', async message => {
const server = await client.guilds.cache.get(server_id);
    if(message.author.bot) return;
    if(message.channel.type == "dm") {
        if(!server.member(message.author.id)) return message.channel.send(`You must be in ${server.name} to use ModMail!`);
        const channel_name = `${channel_prefix}_${message.author.username.toLowerCase()}_${message.author.id}`
        let category = await server.channels.cache.find(c => c.name == modmail_category_name && c.type == 'category')
        if(!category) { category = await server.channels.create(modmail_category_name, {
            type: 'category',
            permissionOverwrites: [
               {
                    id: modmail_viewing_role_id,
                    allow: ['VIEW_CHANNEL'],
                    allow: ['SEND_MESSAGES'],
              },
              {
                    id: server.id,
                    deny: ['VIEW_CHANNEL'],
              },
              {
                    id: client.user.id,
                    allow: ['VIEW_CHANNEL'],
                    allow: ['SEND_MESSAGES'],
              },
            ],
          }) 
        }
        let channel = await server.channels.cache.find(c => c.name == channel_name && c.type == 'text')
        if(!channel) { channel = await server.channels.create(channel_name, {
            type: 'text',
            permissionOverwrites: [
               {
                    id: modmail_viewing_role_id,
                    allow: ['VIEW_CHANNEL'],
              },
              {
                    id: server.id,
                    deny: ['VIEW_CHANNEL'],
              },
              {
                    id: client.user.id,
                    allow: ['VIEW_CHANNEL'],
              },
            ],
          }) 
        const embed = new Discord.MessageEmbed()
        .setTitle('New Ticket')
        .setColor('RANDOM')
        .setDescription('Type a message in this channel to reply. Message starting with `=` are ignored and can be used for staff discussion. Type `=close` to close and delete this channel.')
        await channel.send(embed);
        const embed2 = new Discord.MessageEmbed()
        .setTitle('New Ticket Opened')
        .setColor('RANDOM')
        .setDescription('You opened a ticket!')
        await message.channel.send(embed2);
        }
        if(channel && category) channel.setParent(category.id)
        const embed1 = new Discord.MessageEmbed()
        .setTitle('Message Received')
        .setColor('RANDOM')
        .setDescription(message.content)
        channel.send(embed1);
        const embed3 = new Discord.MessageEmbed()
        .setTitle('Message sent.')
        .setColor('RANDOM')
        .setDescription('Sent a message to the moderators: ' + message.content)
        await message.channel.send(embed3);
        return;
    } else {
        if(message.channel.name.startsWith(`${channel_prefix}_`)) {
            const channel_args = message.channel.name.split('_');
            const user_id = channel_args[2];
            if(message.content == `=close`) {
                await message.channel.delete()
                const closeuserembed = new Discord.MessageEmbed()
                .setTitle('Ticket closed.')
                .setColor('RANDOM')
                .setDescription(`To open another ticket, send me a message!`)
                await client.users.cache.get(user_id).send(closeuserembed);
                return;
            } else if(message.content.startsWith('=')) return;
            
            
            let mod = "";
            if(display_mod_name) mod = message.author.tag;
            else mod = 'Anonymous#0000';
            const embed2 = new Discord.MessageEmbed()
            .setTitle('Message Received')
            .setColor('RANDOM')
            .setDescription(`**From ${mod}**\n${message.content}`)
            client.users.cache.get(user_id).send(embed2);
            const embed3 = new Discord.MessageEmbed()
            .setTitle('Message sent.')
            .setColor('RANDOM')
            .setDescription('Sent a message to ' + client.users.cache.get(user_id).username + ': ' + message.content)
            await message.channel.send(embed3);
            return;
        }
    }
})

client.login(token);
