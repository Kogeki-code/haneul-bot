const Discord = require('discord.js');
const discanvas = require('discanvas');
const mysqlhandler = require("../handler/mysql.js");
const { PREFIX, COLORS, VERSION, NOPERMS, CONSOLEPREFIX } = require('../utils/config.json');
const embedColor = COLORS.default;
const embedError = COLORS.error;

module.exports = {
    event: 'guildMemberAdd',
    run: async (member, client) => {
        console.log('works');
        mysqlhandler.con.query(`SELECT * FROM haneul_welcome WHERE id = '${member.guild.id}'`, (err, rows) => {
            if (err) throw err;

            let sql;

            if (rows.length < 1) {

            } else {

                let welcometoggle = rows[0].welcome_toggle;
                let welcomeChannel = rows[0].welcome_channel;
                let welcomeMessage = rows[0].welcome_message;
                let welcomeImage = rows[0].welcome_image;

                if (welcometoggle === '0') {

                } else {

                    sendWelcome(member, client, welcometoggle, welcomeChannel, welcomeMessage, welcomeImage)
                }
                if (rows[0].join_Role) {

                    const Role = member.guild.roles.cache.find(r => r.id === rows[0].join_Role);
                    if (Role) {
                        if (!member.manageable || !Role.editable) return console.log('Couldnt add role');
                        if (member.manageable && Role.editable) {
                            try {
                                member.roles.add(Role);
                            } catch {
                                console.log('Couldnt add a Role\'');
                            }
                        }

                    }
                }
            }
        });
    },
};

async function sendWelcome(member, client, welcometoggle, welcomeChannel, welcomeMessage, welcomeImage) {
    if (welcometoggle === '1') {
        const welcome = await new discanvas.Welcome()
            .setAvatar(member.user.displayAvatarURL({ format: 'png' }))
            .setUsername(member.user.tag)
            .setBackground("BACKGROUND", welcomeImage)
            .setMainText("Welcome")
            .setSecondText(welcomeMessage)
            .toWelcome()

        const attachment = new Discord.MessageAttachment(welcome.toBuffer(), "welcome.jpg");
        const setchannel = client.channels.cache.get(welcomeChannel);

        if (!setchannel) {
            return
        }

        setchannel.send(``, attachment);
    }
}
