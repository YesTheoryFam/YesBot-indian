const Chance = require('chance');
const chanceObj = new Chance();

const states = require('../collections/Roles/stateTags.json');
const serverRoles = require('../collections/Roles/Roles.json');

const active = 'active';
const inactive = 'inactive';

const memberSchema = require('../database/Schemas/memberSchema');
const serverSchema = require('../database/Schemas/serverSchema')


module.exports = bot => {

    bot.on('guildMemberAdd', async (member) => {

        const welcomeChat = member.guild.channels.cache.get('721050178794291292');

        const findMember = await memberSchema.find({
            _id: member.id
        });

        if (findMember.length > 0) {
            const [{ userRoles, timeout }] = findMember;

            if (userRoles || userRoles.length > 0) {

                userRoles.forEach((previousRoles) => {

                    if (previousRoles === member.guild.id ||
                        previousRoles === serverRoles.timeOut ||
                        previousRoles === serverRoles.unasigned ||
                        previousRoles === serverRoles.birthday) return;;

                    const theRole = member.guild.roles.cache.get(previousRoles);

                    if (theRole) {
                        member.roles.add(previousRoles)
                    }

                })

            }
            if (timeout) {
                if (timeout === active) {
                    return member.roles.add(serverRoles.timeOut);
                } else if (timeout === inactive) {
                    welcomeChat.send(`Welcome back, ${member}.`);
                    return;
                }
            } else {
                welcomeChat.send(`Welcome back, ${member}.`);
                return;
            }

        } else {
            await memberSchema.findOneAndUpdate({
                _id: member.id
            }, {
                currentUsername: member.user.username,
                $addToSet: {
                    usernameHistory: member.user.username
                },
                name: member.displayName,
                timeout: inactive
            }, {
                upsert: true
            }).then(() => member.roles.add(serverRoles.unasigned));

        }
    });

};