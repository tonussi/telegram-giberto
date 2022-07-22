// Discord.js bot
const botgram = require("botgram")

// process.env.TOKEN
const bot = botgram(process.env.TOKEN)

const viterp = require("./BibleCommandInterpreter");
const citerp = require("./CommentaryCommandInterpreter");

const bci = new viterp.BibleCommandInterpreter();
const cci = new citerp.CommentaryCommandInterpreter();

const bch = require("./BotCommandsHelper");

const versions = require("./BibleVersionEnum");
const cmtversions = require("./CommentaryVersionEnum");

const constants = require("./BibleConstants");

var verseTick;

function getRandomScripture(version) {
    v = constants.getRandomVerse();
    let versesParsed = bci.parseRef(`${v.bt} ${v.cn}.${v.vn} ${version}`);
    // let osis = bci.getOsis(args);
    let embed = buildVerseRichEmbed(versesParsed);
    return embed;
}

function getAllRefPtBrFormat() {
    let aux = "Refs Bíblicas\n\n";

    Object.keys(constants.refs.ptbr).forEach(key => {
        aux += `${String(key)} `;
    });

    return buildTelegramRichEmbed(aux);
}

function getAllVersionsAndCmt() {
    let aux = "Versões Bíblicas\n\n";

    Object.keys(versions.BibleVersionEnum).forEach(key => {
        aux += `${String(key)}\n`;
    });

    aux += "\n\nComentários Bíblicos\n\n";

    Object.keys(cmtversions.CommentaryVersionEnum).forEach(key => {
        aux += `${String(key)}\n`;
    });

    return buildTelegramRichEmbed(aux);
}

function buildSearchRichEmbed(versesParsed) {
    let aux = '';
    if (versesParsed) {
        for (let index = 0; index < versesParsed.length; index++) {
            const element = versesParsed[index];
            aux += `${element.getVerseRef()} ${element.getScripture()}\n`;
            if (index === 7) {
                break;
            }
        }
        return buildTelegramRichEmbed(aux);
    } else {
        return buildTelegramRichEmbed(
            "Algo de errado ocorreu,\ntalvez tente\nmelhorar os argumentos.\n"
        );
    }
}

function buildCommentaryRichEmbed(commentariesParsed) {
    let aux = '';
    if (commentariesParsed) {
        for (let index = 0; index < commentariesParsed.length; index++) {
            const element = commentariesParsed[index];
            aux += `${element.getVerseRef()} ${element.getData()}`;
            if (index === 7) {
                break;
            }
        }
        return buildTelegramRichEmbed(aux);
    } else {
        return buildTelegramRichEmbed(
            "Algo de errado ocorreu,\ntalvez tente\nmelhorar os argumentos.\n"
        );
    }
}

function buildVerseRichEmbed(versesParsed) {
    let aux = '';
    if (versesParsed) {
        for (let index = 0; index < versesParsed.length; index++) {
            const element = versesParsed[index];
            aux += `${element.getVerseRef()} ${element.getScripture()}`;
            if (index === 7) {
                break;
            }
        }
        return buildTelegramRichEmbed(aux);
    } else {
        return buildTelegramRichEmbed(
            "Algo de errado ocorreu,\ntalvez tente\nmelhorar os argumentos.\n"
        );
    }
}

function buildTelegramRichEmbed(text) {
    if (text.length > 2048) {
        text = "Try simplifying the request, because you exceed the length limit.";
    }
    return text;
}

function prepareInput(msg) {
    return msg.args.raw.split(' ').slice(0, 3).join(' ');
}

bot.command("bv", (msg, reply) => {
    var args = prepareInput(msg);
    let versesParsed = bci.parseRef(args);
    // let osis = bci.getOsis(args);
    let embed = buildVerseRichEmbed(versesParsed);
    reply.text(embed);
});

bot.command("bc", (msg, reply) => {
    var args = prepareInput(msg);
    let versesParsed = cci.parseRef(args);
    // let osis = cci.getOsis(args);
    let embed = buildCommentaryRichEmbed(versesParsed);
    reply.text(embed, "Markdown");
});

bot.command("bd", (msg, reply) => {
    var args = prepareInput(msg);
    let detail = bci.parseDetail(args).getEditionDescrition();
    let embed = buildTelegramRichEmbed(detail);
    reply.text(embed, "Markdown")
});

bot.command("bv", (msg, reply) => {
    var args = prepareInput(msg);
    let versesParsed = cci.parseRef(args);
    let embed = buildCommentaryRichEmbed(versesParsed);
    reply.text(embed)
});

bot.command("cd", (msg, reply) => {
    var args = prepareInput(msg);
    let detail = cci.parseDetail(args).getEditionDescrition();
    let embed = buildTelegramRichEmbed(detail);
    reply.text(embed, "Markdown")
});

bot.command("bs", (msg, reply) => {
    var args = prepareInput(msg);
    let versesParses = bci.parseWords(args);
    let embed = buildSearchRichEmbed(versesParses);
    reply.text(embed)
});

bot.command('hen', (msg, reply) => {
    reply.text(bch.config.HELP.en)
});

bot.command('hpt', (msg, reply) => {
    reply.text(bch.config.HELP.pt)
});

bot.command('iv', (msg, reply) => {
    reply.text(bch.config.INVITE)
});

bot.command('c', (msg, reply) => {
    reply.text(bch.config.COMMANDS)
});

bot.command('a', (msg, reply) => {
    reply.text(getAllVersionsAndCmt())
});

bot.command('refs', (msg, reply) => {
    reply.text(getAllRefPtBrFormat())
});

bot.command("va", (msg, reply, next) => {
    if (!msg.args.raw) {
        reply.text("Precisa escrever a versão (i.e. acf, wpnt, fre, ita). Exemplo /va acf.");
        return next();
    }

    var d = new Date();
    var secondsPastHour = d.getMinutes() * 60 + d.getSeconds();

    reply.text("Postarei um novo verso bíblico, periodicamente, a cada hora. Bençãos, de Cristo, e fique em paz.");

    verseTick = setInterval(
        () => {
            verse = getRandomScripture(msg.args.raw);
            reply.text(verse);
        },
        (60 * 60 * 1000) - (secondsPastHour * 1000)
    );
});

bot.command('sva', (msg, reply, next) => {
    reply.text("Serviço de versos periódicos parou.");
    clearInterval(verseTick);
    return next();
});
