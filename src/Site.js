/**
 * Created by christoph on 12/02/17.
 */
import React from "react";

let siteId = 0;

const ReactType = React.PropTypes.shape(
	{
		id                   : React.PropTypes.string,
		name                 : React.PropTypes.string,
		lat                  : React.PropTypes.number,
		lng                  : React.PropTypes.number,
		baseRisk             : React.PropTypes.number,
		subsites             : React.PropTypes.array,
		parent               : React.PropTypes.object,
		localConditions      : React.PropTypes.objectOf( React.PropTypes.shape( { value: React.PropTypes.string } ) ),
		updateLocalConditions: React.PropTypes.func,
		getRisk              : React.PropTypes.func,
		flatChildren         : React.PropTypes.func,
	}
);

export default class Site {

	static ReactType = ReactType;

	constructor( parent = null, scale = 0 ) {
		const { lat, lng } = parent;

		this.id       = "" + siteId++;
		this.name     = "Un-named Site";
		this.lat      = lat + Math.random() * scale - scale / 2;
		this.lng      = lng + Math.random() * scale - scale / 2;
		this.subsites = [];
		this.baseRisk = 0;
		this.parent   = parent.id?parent:null;

		// local conditions
		this.localConditions = {
			weather: { value: "sunny" },
			traffic: { value: "1" },
		};
	}

	updateLocalConditions = ( conditions ) => {
		for (let k of Object.keys( conditions )) {
			this.localConditions[ k ] = conditions[ k ];
		}

		if (this.subsites.length > 0) {
			this.subsites.forEach( s => s.updateLocalConditions( conditions ) );
		} else {
			// TODO: connect this to the API!
			this.baseRisk = Math.random() * 10;
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
	}

	subRisk = () => {
		if (this.subsites.length < 1) return [this];
		if (this.subsites[0].subsites.length < 1) return this.subsites;

		const nested = this.subsites.map( s => s.subsites );
		console.log(nested);
		return [].concat.apply( [], nested );
	}

}
