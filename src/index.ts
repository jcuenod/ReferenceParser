import bookDetails from './data/bookDetails'
import generousBookNames from './data/generousBookNames'

interface IReferenceObject {
    book:string|null;
    chapter:number|null;
    verse:number|null;
}

class ReferenceParser {
    private defaults:IReferenceObject

    constructor({defaults = { book: null, chapter: null, verse: null }}:{defaults?: IReferenceObject}={}) {
        let { book, chapter, verse } = defaults
        this.defaults = { book, chapter, verse }
    }

    public parse(referenceString:string):IReferenceObject|false {
        const matches = referenceString.match(/((?:(?:\d)[^a-zA-Z\d\s:]*)?[a-zA-Z-_\s]+)([^a-zA-Z\d:]*(\d+)(\D*(\d+))?)?/)
        return matches ? {
            book: this._matchBook(matches[1]) || this.defaults.book,
            chapter: matches[3] ? +matches[3] : this.defaults.chapter,
            verse: matches[5] ? +matches[5] : this.defaults.verse
        } : false
    }

	private _matchBook = (urlBook:string):string|false => {
		// if there is an initial i/ii with a space, it's a number...
		const numberified = urlBook
				.replace(/^iii\b/i, "3")
				.replace(/^ii\b/i, "2")
				.replace(/^i\b/i, "1")
        // first see if we can map directly
        const possibleKey = numberified.replace(/[-_\ ]/g,"").toLowerCase()
        const generousNameList = Object.keys(generousBookNames)
        if (generousNameList.indexOf(possibleKey) > -1) {
            return generousBookNames[possibleKey]
        }

        // now try use regex to guess (return on first match)
        const bookNames = bookDetails.map(b => b.name)
        // let's try a regex on the starting characters of book names
        const r1 = new RegExp(`^${possibleKey}.*`, "i")
        const possibleMatch = bookNames.reduce((a:string|false, v:string) => {
            if (a) return a
            return r1.test(v) ? v : a
        }, false)
        if (possibleMatch) return possibleMatch
        // and if that didn't work, let's try on the generous booknames...
        const possibleMatch2 = Object.keys(generousBookNames).reduce((a:string|false, v:string) => {
            if (a) return a
            return r1.test(v) ? generousBookNames[v] : a
        }, false)
        if (possibleMatch2) return possibleMatch2

        // this is a pretty promiscuous guess but it works on stuff like "1kgs"
        const urlArray = possibleKey.split("")
        const r2 = new RegExp("^" + urlArray.join(".*"), "i")
        const possibleMatch3 = bookNames.reduce((a:string|false, v:string) => {
            if (a) return a
            return r2.test(v) ? v : a
        }, false)
        if (possibleMatch3) return possibleMatch3
        // Okay, we're really having a hard time with this one,
        // we'll have a last ditch try with generous book names
        return Object.keys(generousBookNames).reduce((a:string|false, v:string) => {
            if (a) return a
            return r2.test(v) ? generousBookNames[v] : a
        }, false)
    }
}

export default ReferenceParser
