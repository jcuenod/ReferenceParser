import ReferenceParser from "../src"
const rp = new ReferenceParser()

export interface referenceObject {
    book:string,
    chapter:number|null,
    verse:number|null
}
export interface expectedBook {
    url:string
    matchingBook:string
}
export interface expectedReference {
    url:string
    refObj:referenceObject
}
export interface testCase {
    case: string,
    solution: referenceObject
}

const caseTexts = [
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

const rangeTexts = [
    { "case": "-7", "solution": {verse: 7} },
    { "case": " - 7", "solution": {verse: 7} },
    { "case": "–13", "solution": {verse: 13} },
    { "case": " – 13", "solution": {verse: 13} },
    { "case": "—20", "solution": {verse: 20} },
    { "case": " — 20", "solution": {verse: 20} },
]

describe("Range Tests", () => {
    it("should have a test", () => {
        return
    })
})

// describe('Range Tests', () => {
//     it("should parse verse ranges separated by -,–,—, and spaces", () => {
//         caseTexts.forEach(caseText => {
//             rangeTexts.forEach(rangeText => {
//                 const actualProblem = caseText.case + rangeText.case
//                 const actualSolution = Object.assign({}, caseText.solution, rangeText.solution)
//                 console.log(actualProblem)
//                 console.log(actualSolution)
//                 const parsedSolution = rp.parse(caseText.case + rangeText.case)
//                 if (!parsedSolution ||
//                    (parsedSolution.book !== actualSolution.book ||
//                     parsedSolution.chapter !== actualSolution.chapter ||
//                     parsedSolution.verse !== actualSolution.verse)) {
//                         throw `Could not parse: ${actualProblem} as ${JSON.stringify(actualSolution)}: ${JSON.stringify(parsedSolution)}`
//                 }
//             })
//         })
//     })
// })
