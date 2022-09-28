const oldTestament = require("./oldTestament.json")
const newTestament = require("./newTestament.json")
const deuterocanonical = require("./deuterocanonical.json")
const apostolicFathers = require("./apostolicFathers.json")

type bookWithNameForms = {
	name: string
	forms: string[]
}

const generousBookNames: bookWithNameForms[] = [
	...newTestament,
	...oldTestament,
	...deuterocanonical,
	...apostolicFathers
]
export default generousBookNames
