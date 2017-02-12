import React, {Component} from "react";
import HeatMap from "./HeatMap";
import Menu from "./Menu";
import moment from "moment";
import "./App.css";
import "antd/dist/antd.css";
import {LocaleProvider} from "antd";
import enGB from "antd/lib/locale-provider/en_US";
import "moment/locale/en-gb";
import Site from "./Site";

moment.locale( 'en-gb' );

class App extends Component {

	constructor() {
		super();

		// level 0 - country
		const baseSite = new Site( { lat: 51.4834622, lng: -0.0586256 } );
		baseSite.name  = "United Kingdom";

		// level 1 - region
		baseSite.subsites = getSites( 5, baseSite );
		baseSite.subsites
			.forEach(
				s => {
					s.name = "Region " + s.id;

					// level 2 - city
					s.subsites = getSites( 1, s );
					s.subsites.forEach(
						ss => {
							ss.name = "City " + ss.id;

							// level 3 - site
							ss.subsites = getSites( 0.1, ss );
							ss.subsites.forEach(
								sss => {
									sss.name = "Site " + sss.id;

									// TODO: get risk from API
									sss.baseRisk = Math.random() * 10;
								}
							);
						}
					);
				}
			);
		this.baseSite = baseSite;

		const riskPoints       = baseSite.flatChildren();
		const sites            = baseSite.subsites;
		const globalConditions = {
			date    : { value: moment() },
			time    : { value: moment() },
			daynight: { value: (new Date()).getHours() < 19 ? "day" : "night" },
		};

		// eslint-disable-next-line
		this.state = {
			sites     : sites,
			activeSite: baseSite,
			viewLevel : 0,
			riskPoints,
			globalConditions,
		};
	}

	goUpLevel = () => {
		const parent = this.state.activeSite.parent;
		if (parent !== null) {
			this.setState(
				{
					activeSite: parent,
					viewLevel : this.state.viewLevel - 1,
				},
				// intensities stack in a funny way if you don't do this. Not sure why
				() => this.forceUpdate()
			);
		}
	};

	setActiveSite = ( s ) => {
		if (s.subsites.length > 0) {
			this.setState(
				{
					activeSite: s,
					viewLevel : this.state.viewLevel + 1,
				}
			);
		}
	};

	changeGlobalConditions = ( changedFields ) => {

		this.setState(
			state =>
				({
					...state,
					globalConditions: { ...state.globalConditions, ...changedFields },
				}),
			// TODO: remove this
			// trick the base sites into re-generating risks
			() => this.baseSite.updateLocalConditions( {} )
		);

	};

	render() {
		return (
			<LocaleProvider locale={enGB}>
				<div className="App">
					<HeatMap
						setActiveSite={this.setActiveSite}
						viewLevel={ this.state.viewLevel }
						activeSite={this.state.activeSite}/>
					<Menu sites={this.state.sites}
					      goUpLevel={this.goUpLevel}
					      {...this.state.globalConditions}
					      changeGlobalConditions={this.changeGlobalConditions}
					      activeSite={this.state.activeSite}/>
				</div>
			</LocaleProvider>
		);
	}
}

export default App;

function getSites( scale = 0.01, parent = null ) {
	const n = 10;
	return new Array( n ).fill().map(
		() => new Site( parent, scale )
	);
}

//
// function localRisk( { lat:plat, lng:plng }, points ) {
// 	const closestPoint = points.reduce(
// 		( acc, curr ) => {
//
// 			const { lat, lng } = curr,
// 			      { dist2 }    = acc,
// 			      newDist2     = Math.pow( lat - plat, 2 ) + Math.pow( lng - plng, 2 );
// 			if (newDist2 < dist2) {
// 				return { dist2: newDist2, point: curr };
// 			} else {
// 				return acc;
// 			}
// 		}, { dist2: Infinity, point: { risk: 0 } }
// 	);
// 	console.log( closestPoint.point.risk );
// 	return closestPoint.point.risk;
// }
//
// function getPoints( sites, globalConditions ) {
// 	const n      = 1;
// 	// TODO: connect to API
// 	const nested = sites.map(
// 		s =>
// 			Array( n ).fill().map(
// 				() => ({
// 					// lat : s.lat + Math.random() * 0.001 - 0.0005,
// 					// lng : s.lng + Math.random() * 0.001 - 0.0005,
// 					lat     : s.lat,
// 					lng     : s.lng,
// 					risk    : Math.random() * 10,
// 				})
// 			)
// 	);
// 	return [].concat.apply( [], nested );
// }


