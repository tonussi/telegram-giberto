const config = {
  PREFIX: "/",
  INVITE: "Grupo De Estudos Bíblicos no Telegram https://t.me/joinchat/La_uwxUxu-_2PPd_pTmUMw (João 16.33)",
  HELP: {
    en: "This bot shows bible verses from Wpnt. Wpnt is a translation of the new testament text based on \
the manuscripts of the family 35. This bot also shows verses from acf (Almeida corrigida e fiel 2007), \
a portuguese version of the bible based on masoretic texts and textus receptus. \
This bot was destined to portuguese people, so the references will mostly be in portuguese. \
Type /c and press enter to show a list of commands and descriptions.",
    pt: "O principal objetivo deste bot é ensinar sobre manuscritos do texto do novo testamento. \
Este bot mostra versos bíblicos da Wpnt. Wpnt é uma tradução baseada nos manuscritos da família 35. \
Este bost também repassa versos da Acf (Almeida corrigida e fiel 2007), \
uma versão em língua brasileira da Bíblia. Acf é baseada no Texto masorético e Textus receptus. \
O bot foi feito para usuários da língua brasileira. \
por isto as referências estão em brasileiro i.e. joão, marcos, gênesis, etc. \
Utilize /c para ver comandos e descrições."
  },
  ACTIVITY: "PRUNCH",
  COMMANDS: "Comandos do bot // Bot commands =>\n\n\
/hen for a description of the bot\n\
/hpt para uma descrição do bot\n\n\
Bible Description // Descrição da Edição Bíblica\n\n\
/bd acf para detalhes da ACF sendo usada\n\
/bd wpnt for details of this version being used\n\n\
Commentary Description // Descrição do Comentário\n\n\
/cd rwp para detalhes do comentário sendo usado\n\
/cd poole for details of this commentary being used\n\n\
Bible Verse // Verso Bíblico\n\n\
/bv João 1:1 acf\n\
/bv Gênesis 1:1 acf\n\
/bv João 13:16 wpnt\n\n\
Bible Commentary // Comentário Bíblico\n\n\
/bc João 1:1 rwp\n\
/bc Gênesis 1:1 poole\n\n\
Bible Words Search // Busca Palavras na Bíblia\n\n\
/bs amor,irmão,salvar,ovelha,... acf João\n\
/bs amor,irmão,salvar,ovelha,... acf Marcos\n\
/bs amor,irmão,salvar,ovelha,... acf Gênesis\n\
/bs amor,irmão,salvar,ovelha,... acf Apocalipse\n\
/bs love,Jesus,brothers wpnt Mateus\n\n\
Extra Commands // Outros Comandos\n\n\
/c Para ver os todos comandos disponíveis\n\
/a Mostra todas as Bíblias disponíveis e Comentários Bíblicos\n\
/refs Mostra as possibilidades de formatação das referências bíblicas\n\
/iv Para pegar um link permanente do chat"
}

module.exports.config = config;
