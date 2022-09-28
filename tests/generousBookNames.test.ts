import generousBookNames from '../src/data/generousBookNames'

const knownAbbreviations: {[s:string]: string} = {}
describe('Book name forms', () => {
    it("should not have form collisions", () => {
        for (let i = 0; i < generousBookNames.length; i++) {
            const b = generousBookNames[i]
            b.forms.forEach(nameForm => {
                if (nameForm in knownAbbreviations) {
                    throw (`${nameForm} duplicated: ${knownAbbreviations[nameForm]} ... ${b.name}`)
                }
                knownAbbreviations[nameForm] = b.name
            })
        }
    })
})