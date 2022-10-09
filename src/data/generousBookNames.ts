import oldTestament from "./oldTestament.json"
import newTestament from "./newTestament.json"
import deuterocanonical from "./deuterocanonical.json"
import apostolicFathers from "./apostolicFathers.json"

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
