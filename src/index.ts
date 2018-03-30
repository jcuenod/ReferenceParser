import bookDetails from './data/bookDetails'
import generousBookNames from './data/generousBookNames'

interface IReferenceObject {
    book:string;
    chapter:number;
    verse:number;
}

class ReferenceParser {
    private defaults:IReferenceObject

    constructor({defaults = { book: "Genesis", chapter: 1, verse: 1 }}:{defaults?: IReferenceObject}={}) {
        let { book, chapter, verse } = defaults
        this.defaults = { book, chapter, verse }
    }

    public parse(referenceString:string):IReferenceObject|false {
        const matches = referenceString.match(/((?:(?:\d)[^a-zA-Z\d\s:]*)?[a-zA-Z-_\s]+)([^a-zA-Z\d:]*(\d+)(\D*(\d+))?)?/)

        return matches ? {
            book: this._matchBook(matches[1]) || this.defaults.book,
            chapter: matches.length > 1 ? +matches[2] : this.defaults.chapter,
            verse: matches.length > 2 ? +matches[4] : this.defaults.verse
        } : false
    }

    private _matchBook = (urlBook:string):string|false => {
        // first see if we can map directly
        const possibleKey = urlBook.replace(/[-_\ ]/g,"").toLowerCase()
        const generousNameList = Object.keys(generousBookNames)
        if (generousNameList.indexOf(possibleKey) > -1) {
            return generousBookNames[possibleKey]
        }

        // now try use regex to guess (return on first match)
        const bookNames = bookDetails.map(b => b.name)
        // let's try a regex on the starting characters of book names
        const r1 = new RegExp(`^${urlBook}.*`, "i")
        const possibleMatch = bookNames.reduce((a:string|false, v:string) => {
            if (a) return a
            return r1.test(v) ? v : a
        }, false)
        if (possibleMatch) return possibleMatch

        // this is a pretty promiscuous guess but it works on stuff like "1kgs"
        const urlArray = urlBook.split("")
        const r2 = new RegExp("^" + urlArray.join(".*"), "i")
        return bookNames.reduce((a:string|false, v:string) => {
            if (a) return a
            return r2.test(v) ? v : a
        }, false)
    }
}

export default ReferenceParser