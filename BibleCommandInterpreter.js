const bm = require('./BibleMedium');
const constants = require("./BibleConstants");
const versions = require("./BibleVersionEnum");
const bcv_parser = require("bible-passage-reference-parser/js/pt_bcv_parser").bcv_parser;
const bcv = new bcv_parser;
const path = require('path');

const byz = new bm.BibleMedium(dbpath = path.join(__dirname, '.', 'db/byz', 'BYZ2005.bbl.mybible'));
const emtv = new bm.BibleMedium(dbpath = path.join(__dirname, '.', 'db/emtv', 'EMTV.bbl.mybible'));
const wpnt = new bm.BibleMedium(dbpath = path.join(__dirname, '.', 'db/wpnt', 'WPNT.bblx'));
const acf = new bm.BibleMedium(dbpath = path.join(__dirname, '.', 'db/acf', 'ACF2007.bbl.mybible'));
const ita = new bm.BibleMedium(dbpath = path.join(__dirname, '.', 'db/ita', 'ITARIVE.bbl.mybible'));
const fre = new bm.BibleMedium(dbpath = path.join(__dirname, '.', 'db/fre', 'FREMRTN.bbl.mybible'));
const isv = new bm.BibleMedium(dbpath = path.join(__dirname, '.', 'db/isv', 'ISV.bbl.mybible'));

class BibleCommandInterpreter {

    parseRef(args) {
        let verses = null;
        args = args.trim();

        if (RegExp(versions.BibleVersionEnum.WPNT).test(args)) {
            verses = this.getVersesParsed(args, wpnt);
        } else if (RegExp(versions.BibleVersionEnum.ACF).test(args)) {
            verses = this.getVersesParsed(args, acf);
        } else if (RegExp(versions.BibleVersionEnum.EMTV).test(args)) {
            verses = this.getVersesParsed(args, emtv);
        } else if (RegExp(versions.BibleVersionEnum.BYZ).test(args)) {
            verses = this.getVersesParsed(args, byz);
        } else if (RegExp(versions.BibleVersionEnum.ITARIVE).test(args)) {
            verses = this.getVersesParsed(args, ita);
        } else if (RegExp(versions.BibleVersionEnum.FREMRTN).test(args)) {
            verses = this.getVersesParsed(args, fre);
        } else if (RegExp(versions.BibleVersionEnum.ISV).test(args)) {
            verses = this.getVersesParsed(args, isv);
        } else {
            verses = this.getVersesParsed(args, acf);
        }

        return verses;
    }

    parseWords(args) {
        let bible_version = null;
        let bible_book = null;
        args = args.trim();

        if (RegExp(versions.BibleVersionEnum.WPNT).test(args)) {
            bible_version = versions.BibleVersionEnum.WPNT;
            bible_book = wpnt;
        } else if (RegExp(versions.BibleVersionEnum.ACF).test(args)) {
            bible_version = versions.BibleVersionEnum.ACF;
            bible_book = acf;
        } else if (RegExp(versions.BibleVersionEnum.EMTV).test(args)) {
            bible_version = versions.BibleVersionEnum.EMTV;
            bible_book = emtv;
        } else if (RegExp(versions.BibleVersionEnum.BYZ).test(args)) {
            bible_version = versions.BibleVersionEnum.BYZ;
            bible_book = byz;
        } else if (RegExp(versions.BibleVersionEnum.ITARIVE).test(args)) {
            bible_version = versions.BibleVersionEnum.ITARIVE;
            bible_book = ita;
        } else if (RegExp(versions.BibleVersionEnum.FREMRTN).test(args)) {
            bible_version = versions.BibleVersionEnum.FREMRTN;
            bible_book = fre;
        } else if (RegExp(versions.BibleVersionEnum.ISV).test(args)) {
            bible_version = versions.BibleVersionEnum.ISV;
            bible_book = isv;
        }

        let splitArgs = this.splitArguments(args, bible_version);

        if (!splitArgs) return null;

        return { tokens: splitArgs.args, book_number: splitArgs.book_number, bible_book: bible_book };
    }

    getBibleById(bibleId) {
        let bible_version = null;
        let bible_book = null;
        let args = bibleId.trim();

        if (RegExp(versions.BibleVersionEnum.WPNT).test(args)) {
            bible_version = versions.BibleVersionEnum.WPNT;
            bible_book = wpnt;
        } else if (RegExp(versions.BibleVersionEnum.ACF).test(args)) {
            bible_version = versions.BibleVersionEnum.ACF;
            bible_book = acf;
        } else if (RegExp(versions.BibleVersionEnum.EMTV).test(args)) {
            bible_version = versions.BibleVersionEnum.EMTV;
            bible_book = emtv;
        } else if (RegExp(versions.BibleVersionEnum.BYZ).test(args)) {
            bible_version = versions.BibleVersionEnum.BYZ;
            bible_book = byz;
        } else if (RegExp(versions.BibleVersionEnum.ITARIVE).test(args)) {
            bible_version = versions.BibleVersionEnum.ITARIVE;
            bible_book = ita;
        } else if (RegExp(versions.BibleVersionEnum.FREMRTN).test(args)) {
            bible_version = versions.BibleVersionEnum.FREMRTN;
            bible_book = fre;
        } else if (RegExp(versions.BibleVersionEnum.ISV).test(args)) {
            bible_version = versions.BibleVersionEnum.ISV;
            bible_book = isv;
        } else {
            bible_version = versions.BibleVersionEnum.ACF;
            bible_book = acf;
        }

        return bible_book;
    }

    splitArguments(args, edition_version) {
        let regex = `\\b${edition_version}\\s[a-zA-ZêãíóáÊúôéÉâ0-9\s]+\\b`;
        let index = args.search(regex, 'gi');
        let book = args.slice(index, args.length);
        book = book.replace(edition_version, '');
        book = book.trim();
        let book_number = constants.getSearchableBookNameById(book);

        if (book_number) {
            args = args.slice(0, index);
            args = args.trim();
            args = args.split(',');
            return { args: args, book_number: book_number }
        }

        return null;
    }

    searchArgsByBookNumberAndBibleBook(args, book_number, bible) {
        if (!args) return null;

        return this.getVersesFromSearch(args, book_number, bible);
    }

    searchArgsByBibleBook(args, bible) {
        if (!args) return null;

        return this.getVersesWholeBible(args, bible);
    }

    parseDetail(args) {
        let detail = null;
        args = args.trim();

        if (RegExp(versions.BibleVersionEnum.WPNT).test(args)) {
            detail = this.getDetailParsed(wpnt);
        } else if (RegExp(versions.BibleVersionEnum.ACF).test(args)) {
            detail = this.getDetailParsed(acf);
        } else if (RegExp(versions.BibleVersionEnum.EMTV).test(args)) {
            detail = this.getDetailParsed(emtv);
        } else if (RegExp(versions.BibleVersionEnum.BYZ).test(args)) {
            detail = this.getDetailParsed(byz);
        }

        return detail;
    }

    getDetailParsed(bible) {
        return bible.findDetail();
    }

    getOsis(args) {
        return bcv.parse(args).osis();
    }

    getVersesFromSearch(args, book_number, bible) {
        return bible.searchTextBy(args, book_number);
    }

    getVersesWholeBible(args, bible) {
        return bible.searchAnswersWholeBible(args);
    }

    getVersesParsed(args, bible) {
        let refsSeparated = Array();
        let refsOsis = this.getOsis(args);
        let refsParsed = refsOsis.split(/[-,\/ -]/);
        let versesParsed = Array();

        if (refsParsed.length > 1) {
            for (let index = 0; index < refsParsed.length; index++) {
                const element = refsParsed[index];
                refsSeparated.push(element.split('.'));
            }
        } else {
            refsSeparated.push(refsOsis.split('.'));
        }

        for (let index = 0; index < refsSeparated.length; index++) {
            const element = refsSeparated[index];

            let book_number = constants.getBookNameById(element[0]);
            let chapter_number = element[1];
            let verse_number = element[2];

            let verse = bible.findScriptureBy(book_number, chapter_number, verse_number);

            versesParsed.push(verse);
        }

        return versesParsed;
    }
}

module.exports.BibleCommandInterpreter = BibleCommandInterpreter;
