const Discord = require('discord.js');
const mysqlhandler = require("../../handler/mysql.js");
const { PREFIX, COLORS, VERSION, NOPERMS, IMAGE_INFOEMBED } = require('./../../utils/config.json');
const embedColor = COLORS.default;
const embedError = COLORS.error;

module.exports = {
    name: 'welcomeimage',
    description: 'Set the Welcome Backgroundimage',
    aliases: [],
    usage: '[imageurl] or status',
    guildOnly: true,
    args: false,
    execute: async (message, args, client) => {
        const { commands } = message.client;
        let channelid = message.channel.id;

        // Check Bot is Bind to a Channel
        mysqlhandler.con.query(`SELECT * FROM botsettings WHERE id = '${message.guild.id}'`, (err, rows) => {
            if (err) throw err;

            let sql;

            if (rows.length < 1) {

            } else {
                let value = rows[0].generellbouncechannel;
                if (value === null) {

                } else {
                    channelid = value;
                    if (!message.guild.channels.cache.get(channelid)) {
                        channelid = message.channel.id;
                        const cmdHelpEmbed = new Discord.MessageEmbed()
                            .setAuthor('AI-Chan (' + VERSION + ') - Information', IMAGE_INFOEMBED)
                            .addField('**__NOTE__**', 'The bind channel of the bot was not recognised or deleted. Reconnect it to a channel or reset it.', false)
                            .setColor(embedError);
                        client.channels.cache.get(channelid).send(cmdHelpEmbed);
                        return
                    }
                }
            }
        });

        setTimeout(() => {

            if (!message.member.hasPermission("ADMINISTRATOR")) {
                const cmdHelpEmbed = new Discord.MessageEmbed()
                    .setAuthor('AI-Chan (' + VERSION + ') - Information', IMAGE_INFOEMBED)
                    .setThumbnail('https://media.discordapp.net/attachments/827195116766363651/873550975904919642/anime-no.gif')
                    .addField('Error', NOPERMS, false)
                    .setColor(embedError);
                client.channels.cache.get(channelid).send(cmdHelpEmbed);
                return
            }

            if (!args.length) {
                const cmdHelpEmbed = new Discord.MessageEmbed()
                    .setAuthor('AI-Chan (' + VERSION + ') - Information', IMAGE_INFOEMBED)
                    .addField('Error', 'Use `' + PREFIX + 'welcomeimage' + ' [imageurl]` to set the Welcome Backgroundimage', false)
                    .addField('Optional', 'Use `' + PREFIX + 'welcomeimage' + ' status` to view the current Welcome Backgroundimage', false)
                    .setColor(embedError);
                client.channels.cache.get(channelid).send(cmdHelpEmbed);
                return
            }

            if (args[0] === 'status') {
                mysqlhandler.con.query(`SELECT * FROM botsettings WHERE id = '${message.guild.id}'`, (err, rows) => {
                    if (err) throw err;

                    let sql;

                    if (rows.length < 1) {

                    } else {
                        let value = rows[0].welcomeImage;
                        const cmdHelpEmbed = new Discord.MessageEmbed()
                            .setAuthor('AI-Chan (' + VERSION + ') - Information', IMAGE_INFOEMBED)
                            .addField('Information', 'Current Welcome Backgroundimage', false)
                            .setImage(value)
                            .setColor(embedColor);
                        client.channels.cache.get(channelid).send(cmdHelpEmbed);
                    }
                });
                return
            }

            const name = args[0];

            mysqlhandler.con.query(`SELECT * FROM botsettings WHERE id = '${message.guild.id}'`, (err, rows) => {
                if (err) throw err;

                let sql;

                if (rows.length < 1) {

                } else {

                    let checkString = ['http', 'https'];
                    let foundString = false;
                    for (var i in checkString) {
                        if (message.content.toLowerCase().includes(checkString[i].toLowerCase())) foundString = true;
                    }
                    if (foundString) {

                        const cmdHelpEmbed = new Discord.MessageEmbed()
                            .setAuthor('AI-Chan (' + VERSION + ') - Information', IMAGE_INFOEMBED)
                            .addField('Information', 'A new welcome backgroundimage has been set', false)
                            .addField('**__NOTE__**', 'If the image does not load, you have to change it to .png or .jpg.', false)
                            .setImage(name)
                            .setColor(embedColor);
                        client.channels.cache.get(channelid).send(cmdHelpEmbed);

                        sql = `UPDATE botsettings SET welcomeImage = '` + name + `' WHERE id='${message.guild.id}'`;
                        mysqlhandler.con.query(sql);

                        return
                    }

                    const cmdHelpEmbed = new Discord.MessageEmbed()
                        .setAuthor('AI-Chan (' + VERSION + ') - Information', IMAGE_INFOEMBED)
                        .addField('Information', 'The image was not found or not loaded', false)
                        .setColor(embedError);
                    client.channels.cache.get(channelid).send(cmdHelpEmbed);
                }
            });

        }, 1000);

    },
};