// Telegram bot
const botgram = require("botgram");

const bot = botgram(process.env.TOKEN);

const viterp = require("./BibleCommandInterpreter");
const citerp = require("./CommentaryCommandInterpreter");
const sinter = require("./BibleVerseSentiment")

const bci = new viterp.BibleCommandInterpreter();
const cci = new citerp.CommentaryCommandInterpreter();
const bvs = new sinter.BibleVerseSentiment();

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

  Object.keys(constants.refs.ptbr).forEach((key) => {
    aux += `${String(key)} `;
  });

  return buildTelegramRichEmbed(aux);
}

function getAllVersionsAndCmt() {
  let aux = "Versões Bíblicas\n\n";

  Object.keys(versions.BibleVersionEnum).forEach((key) => {
    aux += `${String(key)}\n`;
  });

  aux += "\n\nComentários Bíblicos\n\n";

  Object.keys(cmtversions.CommentaryVersionEnum).forEach((key) => {
    aux += `${String(key)}\n`;
  });

  return buildTelegramRichEmbed(aux);
}

function buildSearchRichEmbed(versesParsed) {
  let aux = "";
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
  let aux = "";
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
  let aux = "";
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

function removeFirstTreeCharacters(msg) {
  // For example: remove /bs (size 3)
  return msg.args.raw.split(" ").slice(0, 3).join(" ");
}

bot.command("bv", (msg, reply, next) => {
  if (!msg.args.raw) {
    reply.text("Não providenciou Capítulo e Verso");
    return next();
  }

  var args = removeFirstTreeCharacters(msg);
  let versesParsed = bci.parseRef(args);
  // let osis = bci.getOsis(args);
  let embed = buildVerseRichEmbed(versesParsed);
  reply.text(embed);
});

bot.command("bc", (msg, reply, next) => {
  if (!msg.args.raw) {
    reply.text("Não providenciou Capítulo e Verso");
    return next();
  }

  var args = removeFirstTreeCharacters(msg);
  let versesParsed = cci.parseRef(args);
  // let osis = cci.getOsis(args);
  let embed = buildCommentaryRichEmbed(versesParsed);
  reply.text(embed, "Markdown");
});

bot.command("bd", (msg, reply, next) => {
  if (!msg.args.raw) {
    reply.text("Não providenciou versão");
    return next();
  }

  var args = removeFirstTreeCharacters(msg);
  let detail = bci.parseDetail(args).getEditionDescrition();
  let embed = buildTelegramRichEmbed(detail);
  reply.text(embed, "Markdown");
});

bot.command("cd", (msg, reply, next) => {
  if (!msg.args.raw) {
    reply.text("Não providenciou nome");
    return next();
  }

  var args = removeFirstTreeCharacters(msg);
  let detail = cci.parseDetail(args).getEditionDescrition();
  let embed = buildTelegramRichEmbed(detail);
  reply.text(embed, "Markdown");
});

bot.command("bs", (msg, reply, next) => {
  if (!msg.args.raw) {
    reply.text("Não providenciou nada para procurar");
    return next();
  }

  var args = removeFirstTreeCharacters(msg);
  let parsedArgs = bci.parseWords(args);

  if (!parsedArgs) {
    reply.text("Não providenciou nada para procurar");
    return next();
  }

  let parsedVerses = bci.searchArgsByBookNumberAndBibleBook(parsedArgs.tokens, parsedArgs.book_number, parsedArgs.bible_book);

  let embed = buildSearchRichEmbed(parsedVerses);
  reply.text(embed);
});

bot.command("hen", (msg, reply) => {
  reply.text(bch.config.HELP.en);
});

bot.command("hpt", (msg, reply) => {
  reply.text(bch.config.HELP.pt);
});

bot.command("iv", (msg, reply) => {
  reply.text(bch.config.INVITE);
});

bot.command("c", (msg, reply) => {
  reply.text(bch.config.COMMANDS);
});

bot.command("a", (msg, reply) => {
  reply.text(getAllVersionsAndCmt());
});

bot.command("refs", (msg, reply) => {
  reply.text(getAllRefPtBrFormat());
});

bot.command("va", (msg, reply, next) => {
  if (!msg.args.raw) {
    reply.text(
      "Precisa escrever a versão (i.e. acf, wpnt, fre, ita). Exemplo /va acf."
    );
    return next();
  }

  var d = new Date();
  var secondsPastHour = d.getMinutes() * 60 + d.getSeconds();

  reply.text(
    "Postarei um novo verso bíblico, periodicamente, a cada hora. Bençãos, de Cristo, e fique em paz."
  );

  verseTick = setInterval(() => {
    verse = getRandomScripture(msg.args.raw);
    reply.text(verse);
  }, 60 * 60 * 1000 - secondsPastHour * 1000);
});

bot.command("sva", (msg, reply, next) => {
  reply.text("Serviço de versos periódicos parou.");
  clearInterval(verseTick);
  return next();
});

bot.command("q", (msg, reply, next) => {
  if (!msg.args.raw) {
    reply.text("Não providenciou nada para procurar");
    return next();
  }

  console.log(msg.args.raw);
  let results = bvs.perform(msg.args.raw);
  console.log(results);
  let bible_book = bci.getBibleById("acf");
  let parsedVerses = bci.searchArgsByBibleBook(results.tokens, bible_book);

  let embed = buildSearchRichEmbed(parsedVerses);
  reply.text(embed);
});
