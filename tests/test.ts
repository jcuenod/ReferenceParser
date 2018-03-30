import ReferenceParser from "../src"
const rp = new ReferenceParser()

const bookTests:{ [s:string]:string } = {
    "Gen":"Genesis",
    "Genesis":"Genesis",
    "2 Chronicles":"2 Chronicles",
    "1-Kgs":"1 Kings",
    "1-Kings":"1 Kings",
    "Reges II":"2 Kings",
    "Reges_II":"2 Kings",
    "Songs Of Solomon":"Song of Songs",
    "Song Of Songs": "Song of Songs"
}

const parsingTest = (parseStr:string, matchStr:string) => {
    const parsed = rp.parse(parseStr)
    if (!parsed || parsed.book !== matchStr)
    {
        console.log(parseStr, " => ", parsed, "not equal", matchStr)
        return true
    }
    return false
}

describe('ReferenceParser', () => {
    describe('parse', () => {
        it("should return the correct book", () => {
            Object.keys(bookTests).filter(b => {
                parsingTest(b, bookTests[b])
            })
        })
        it("should return the correct book with lower case", () => {
            Object.keys(bookTests).filter(b => {
                parsingTest(b.toLowerCase(), bookTests[b])
            })
        })
        it("should return the correct book without spaces, dashes and underscores", () => {
            Object.keys(bookTests).filter(b => {
                parsingTest(b.replace(/[-_\ ]/g, ""), bookTests[b])
            })
        })
    })
})