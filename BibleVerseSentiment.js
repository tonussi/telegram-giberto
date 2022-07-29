var natural = require('natural');

class BibleVerseSentiment {
    perform(phrase, language="Portuguese", stemmLanguage="Pt") {
        let stemmer = undefined;

        let Analyzer = natural.SentimentAnalyzer;

        if (stemmLanguage === "En") {
            stemmer = natural.PorterStemmer;
        } else if (stemmLanguage === "Pt") {
            stemmer = natural.PorterStemmerPt;
        } else {
            stemmer = natural.PorterStemmerPt;
        }

        let tokenizer = new natural.WordTokenizer();

        let analyzer = new Analyzer(language, stemmer, "afinn");

        let tokens = tokenizer.tokenize(phrase)

        return { tokens: tokens, sentiment: analyzer.getSentiment(tokens) }
    }
}

module.exports.BibleVerseSentiment = BibleVerseSentiment;
