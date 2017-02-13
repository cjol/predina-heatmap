/**
 * Created by christoph on 13/02/17.
 */
import locations from "../data/incidents.json";
import _ from "lodash";

const locations_clustered = _(locations)
	.groupBy('region')
	.mapValues(i => {
		"use strict";
		return _.toArray(_.groupBy(locations, 'city'));
	})
	.toArray()
	.value();


const api = {
	locations() {
		"use strict";
		return locations_clustered[0][0][0];
	}
};


const middlewares = {};
for (let a of Object.keys(api)) {
	middlewares[a] = (req, res) => {
		"use strict";
		try {
			const result = api[a]();
			res.status(200).json(result);
		} catch(e) {
			res.status(500).send(e);
		}
	};
}

export default middlewares;
