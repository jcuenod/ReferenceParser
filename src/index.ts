import generousBookNames from './data/generousBookNames'

interface IReferenceObject {
    book: string | null
    chapter: number | null
    verse: number | null
}

class ReferenceParser {
    private defaults: IReferenceObject

    constructor({ defaults = { book: null, chapter: null, verse: null } }: { defaults?: IReferenceObject } = {}) {
        let { book, chapter, verse } = defaults
        this.defaults = { book, chapter, verse }
    }

    public parse(referenceString: string): IReferenceObject | false {
        const matches = referenceString.match(/((?:(?:\d)[^a-zA-Z\d\s:]*)?[a-zA-Z-_\s\.]+)([^a-zA-Z\d:]*(\d+)(\D*(\d+))?)?/)
        return matches ? {
            book: this._matchBook(matches[1]) || this.defaults.book,
            chapter: matches[3] ? +matches[3] : this.defaults.chapter,
            verse: matches[5] ? +matches[5] : this.defaults.verse
        } : false
    }

    private _matchBook = (urlBook: string): string | false => {
        const normedWordBreaks = urlBook.replace(/[_-]/g, " ")
        // This allows strings like IIKings => 2Kings (based on capital K, requires uppercase i)
        const capitalsToDetermineInitialIAsNumber = /^[IV]{1,3}[A-HJ-Z][a-z]+/.test(urlBook)
            ? normedWordBreaks
                .replace(/^VI/, "6")
                .replace(/^V/, "5")
                .replace(/^IV/, "4")
                .replace(/^IIII/, "4") // In case someone doesn't understand roman numerals
                .replace(/^III/, "3")
                .replace(/^II/, "2")
                .replace(/^I/, "1")
            : normedWordBreaks
        // if there is an initial i/ii with a space, it's a number...
        const numberified = capitalsToDetermineInitialIAsNumber
            .replace(/^vi\b/i, "6")
            .replace(/^v\b/i, "5")
            .replace(/^iv\b/i, "4")
            .replace(/^iii\b/i, "3")
            .replace(/^ii\b/i, "2")
            .replace(/^i\b/i, "1")
        // first see if we can map directly

        const possibleKey = numberified.replace(/[-_\ ]/g, "").toLowerCase()

        const possibleMatches1 = generousBookNames.filter(b =>
            b.forms.indexOf(possibleKey) > -1
        )
        if (possibleMatches1.length > 0) {
            // It's possible that there is more than one match here,
            // If that happens, we just return the first one.
            // Do a better job of not having conflicting forms...
            return possibleMatches1[0].name
        }

        const possibleMatches2 = generousBookNames.filter(b =>
            b.forms.filter(f => f.startsWith(possibleKey)).length > 0
        )
        if (possibleMatches2.length > 0) {
            // It's possible that there is more than one match here,
            // If that happens, we just return the first one.
            // Do a better job of not having conflicting forms...
            return possibleMatches2[0].name
        }

        // we're going to insert one wildcard and move it backward through and then add another...
        // const possibleMatches3 = generousBookNames
        //     .filter(b =>
        //         b.forms.filter(f => f.startsWith(possibleKey)).length > 0
        //     )
        // if (possibleMatches3.length > 0) {
        //     // It's possible that there is more than one match here,
        //     // If that happens, we just return the first one.
        //     // Do a better job of not having conflicting forms...
        //     return possibleMatches3[0].name
        // }

        const urlArray = possibleKey.split("")
        const regex = new RegExp("^" + urlArray.join(".*"), "i")
        const possibleMatches4 = generousBookNames.filter(b =>
            b.forms.filter(f => regex.test(f)).length > 0
        )
        if (possibleMatches4.length > 0) {
            // It's possible that there is more than one match here,
            // If that happens, we just return the first one.
            // Do a better job of not having conflicting forms...
            return possibleMatches4[0].name
        }

        return false
    }
}

export default ReferenceParser
