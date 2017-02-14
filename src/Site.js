/**
 * Created by christoph on 12/02/17.
 */
import React from "react";

let siteId = 0;

const ReactType = React.PropTypes.shape(
	{
		id              : React.PropTypes.string,
		name            : React.PropTypes.string,
		lat             : React.PropTypes.number,
		lng             : React.PropTypes.number,
		baseRisk        : React.PropTypes.number,
		subsites        : React.PropTypes.array,
		parent          : React.PropTypes.object,
		localConditions : React.PropTypes.objectOf( React.PropTypes.shape( { value: React.PropTypes.string } ) ),
		updateConditions: React.PropTypes.func,
		getRisk         : React.PropTypes.func,
		flatChildren    : React.PropTypes.func,
	}
);

export default class Site {

	static ReactType = ReactType;

	static makeRandom( parent = null, scale = 0 ) {
		const s = new Site( parent );

		const { lat, lng } = parent;
		s.lat              = lat + Math.random() * scale - scale / 2;
		s.lng              = lng + Math.random() * scale - scale / 2;
		return s;
	}

	constructor( parent = null ) {

		this.id       = "" + siteId++;
		this.name     = "Un-named Site";
		this.subsites = [];
		this.baseRisk = 0;
		this.parent   = parent.id ? parent : null;
		this.lat      = parent.lat;
		this.lng      = parent.lng;

		// local conditions
		this.localConditions = {
			weather: { value: ["sunny", "rainy", "cloudy"][Math.floor(Math.random()*3)] },
			traffic: { value: ["1", "2", "3"][Math.floor(Math.random()*3)] },
		};
	}

	updateConditions = ( localConditions, globalConditions ) => {
		console.log("Calculating risk with ", localConditions, globalConditions);
		for (const k of Object.keys( localConditions )) {
			this.localConditions[ k ] = localConditions[ k ];
		}

		if (this.subsites.length > 0) {
			this.subsites.forEach( s => s.updateConditions( localConditions, globalConditions ) );
		} else {
			// TODO: connect this to the API!
			let score = 0;

			switch (this.localConditions.weather.value)  {
				case "sunny":
					score += 0;
					break;
				case "cloudy":
					score += 1;
					break;
				case "rainy":
					score += 3;
					break;
				default:
					score += 1;
					break;
			}

			switch (this.localConditions.traffic.value)  {
				case "1":
					score += 0;
					break;
				case "2":
					score += 1;
					break;
				case "3":
					score += 3;
					break;
				default:
					score += 1;
					break;
			}

			switch (globalConditions.daynight.value)  {
				case "day":
					score += 0;
					break;
				case "night":
					score += 2;
					break;
				default:
					score += 1;
					break;
			}

			score += Math.random() * 3; //  fudge factor

			this.baseRisk = score * 10 / 11;
		}
	};

	getRisk = () => {

		// TODO: could update parents on changes to baseRisk instead of on-demand if this is slow
		if (this.subsites.length < 1) return this.baseRisk;

		// calculate the average risk
		const sum = this.subsites.reduce( ( a, s ) => s.getRisk() + a, 0 );
		return sum / this.subsites.length;
	};

	flatChildren = () => {
		if (this.subsites.length > 0) {
			const nested = this.subsites.map( s => s.flatChildren() );
			return [].concat.apply( [], nested );
		}

		return [ this ];
	};

	subRisk = () => {
		if (this.subsites.length < 1) return [ this ];
		if (this.subsites[ 0 ].subsites.length < 1) return this.subsites;

		const nested = this.subsites.map( s => s.subsites );
		return [].concat.apply( [], nested );
	}

}
