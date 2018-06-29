import ReferenceParser from "../src"
const rp = new ReferenceParser()

const basicTestCases:{ "url":string, "matchingBook":string }[] = [
    {"url": "Gen", "matchingBook":"Genesis"},
    {"url": "Genesis", "matchingBook":"Genesis"},
    {"url": "2 Chronicles", "matchingBook":"2 Chronicles"},
    {"url": "1-Kgs", "matchingBook":"1 Kings"},
    {"url": "1-Kings", "matchingBook":"1 Kings"},
    {"url": "Reges II", "matchingBook":"2 Kings"},
    {"url": "Reges_II", "matchingBook":"2 Kings"},
    {"url": "Song Of Sol", "matchingBook":"Song of Songs"},
    {"url": "Songs Of Solomon", "matchingBook":"Song of Songs"},
    {"url": "Song Of Songs", "matchingBook":"Song of Songs"},
]

const parsingTest = (parseStr:string, matchReference:{book:string, chapter:number, verse:number}) => {
    const parsed = rp.parse(parseStr)
    if (!parsed ||
        parsed.book !== matchReference.book ||
        parsed.chapter !== matchReference.chapter ||
        parsed.verse !== matchReference.verse)
    {
        throw `${parseStr} => ${JSON.stringify(parsed)} not equal ${JSON.stringify(matchReference)}`
    }
    return false
}

const wellFormattedUrlWithChapter = ({url, matchingBook}) => ({
    url: `${url}/12`,
    refObj: {
        book: matchingBook,
        chapter: 12,
        verse: null
    }
})
const wellFormattedUrlWithChapterAndVerse = ({url, matchingBook}) => ({
    url: `${url}/12#23`,
    refObj: {
        book: matchingBook,
        chapter: 12,
        verse: 23
    }
})
const badlyFormattedUrlWithChapter = ({url, matchingBook}) => {
    const chapterBreaks = ["_", "-", " "]
    return chapterBreaks.map(c => ({
        url: `${url}${c}12`,
        refObj: {
            book: matchingBook,
            chapter: 12,
            verse: null
        }
    }))   
}
const badlyFormattedUrlWithChapterAndVerse = ({url, matchingBook}) => {
    const verseBreaks = [":", "v", ".", " "]
    return [].concat(...verseBreaks.map(v => 
        badlyFormattedUrlWithChapter({url, matchingBook}).map(v2 => {
            v2.url += v + 42
            v2.refObj.verse = 42
            return v2
        })
    ))
}

const bookStringTests = [
    {
        "description": "should handle basic test cases",
        "bookStringDistortion": (bookString) => bookString
    },
    {
        "description": "should handle lower case test cases",
        "bookStringDistortion": (bookString) => bookString.toLowerCase()
    },
    {
        "description": "should handle upper case test cases",
        "bookStringDistortion": (bookString) => bookString.toUpperCase()
    },
    {
        "description": "should handle test cases without spaces, dashes and underscores",
        "bookStringDistortion": (bookString) => bookString.replace(/[-_\ ]/g, "")
    },
]

const chapterVerseTests = [
    {
        "itDescription": "should handle reference without chapter or verse",
        "urlDistortions": ({url, matchingBook}) => 
            [{
                url,
                refObj: {
                    book: matchingBook,
                    chapter: null,
                    verse: null
                }
            }]
    },
    {
        "itDescription": "should handle well formatted reference without verse",
        "urlDistortions": ({url, matchingBook}) => 
            [wellFormattedUrlWithChapter({url, matchingBook})]
    },
    {
        "itDescription": "should handle reference missing verse",
        "urlDistortions": ({url, matchingBook}) => 
            badlyFormattedUrlWithChapter({url, matchingBook})
    },
    {
        "itDescription": "should handle well formatted reference with verse",
        "urlDistortions": ({url, matchingBook}) => 
            [wellFormattedUrlWithChapterAndVerse({url, matchingBook})]
    },
    {
        "itDescription": "should handle badly formatted reference with verse",
        "urlDistortions": ({url, matchingBook}) => 
            badlyFormattedUrlWithChapterAndVerse({url, matchingBook})
    }
]


describe('ReferenceParser', () => {
    describe('parse reference urls', () => {
        bookStringTests.forEach(t => {
            describe(t.description, () => {
                chapterVerseTests.forEach(c => {
                    it(c.itDescription, () => {
                        basicTestCases.forEach(({url, matchingBook}) => {
                            const urlArray = c.urlDistortions({
                                url: t.bookStringDistortion(url),
                                matchingBook
                            })
                            urlArray.forEach(({ url, refObj }) => {
                                parsingTest(url, refObj)
                            })
                        })
                    })
                })
            })
        })
    })
    it("should parse specific test cases", () => {
        const cases = [
            { "case": "2 Kings 5:3", "solution": {book: "2 Kings", chapter: 5, verse: 3} },
            { "case": "pss4.2", "solution": {book: "Psalms", chapter: 4, verse: 2} },
            { "case": "song of sol 10", "solution": {book: "Song of Songs", chapter: 10, verse: null} },
            { "case": "ex", "solution": {book: "Exodus", chapter: null, verse: null} },
            { "case": "mt", "solution": {book: "Matthew", chapter: null, verse: null} },
            { "case": "jn8", "solution": {book: "John", chapter: 8, verse: null} },
            { "case": "1jn5#9", "solution": {book: "1 John", chapter: 5, verse: 9} },
            { "case": "1 Corinthians 13", "solution": {book: "1 Corinthians", chapter: 13, verse: null} },
            { "case": "qoh", "solution": {book: "Ecclesiastes", chapter: null, verse: null} },
            { "case": "garbage", "solution": {book: null, chapter: null, verse: null} }
        ]
        cases.forEach(c => {
            const s = rp.parse(c.case)
            if (!s ||
               (s.book !== c.solution.book ||
                s.chapter !== c.solution.chapter ||
                s.verse !== c.solution.verse)) {
                    throw `Could not parse: ${c.case} as ${JSON.stringify(c.solution)}: ${JSON.stringify(s)}`
            }
        })
    })
})
