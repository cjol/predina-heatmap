import React, {Component} from "react";
import HeatMap from "./HeatMap";
import Menu from "./Menu";
import moment from "moment";
import "./App.css";
import "antd/dist/antd.css";
import {LocaleProvider} from "antd";
import enGB from "antd/lib/locale-provider/en_US";
import "moment/locale/en-gb";

moment.locale( 'en-gb' );

class App extends Component {

	constructor() {
		super();

		// eslint-disable-next-line
		this.state = {
			sites: getSites( 10 ).map(
				( { lat, lng }, i ) =>
					({
						id: "" + i,
						name: "Site " + (i + 1),
						lat,
						lng,
					})
			),
			risk: Math.floor(Math.random()*10)
		};

		// eslint-disable-next-line
		this.state.riskPoints = getPoints( this.state.sites, 1 );
		// eslint-disable-next-line
		this.state.conditions = {
			date: { value: moment() },
			time: { value: moment() },
			traffic: { value: "1" },
			weather: { value: "rainy" },
			daynight: { value: "day" },
			site: { value: this.state.sites[ 0 ] },
		};
	}

	handleFormChange = ( changedFields ) => {
		this.setState( {
			risk: Math.floor(Math.random()*10),
		  	conditions: { ...this.state.conditions, ...changedFields }
		} );

		if (
			"date" in changedFields ||
			"time" in changedFields ||
			"traffic" in changedFields ||
			"weather" in changedFields ||
			"daynight" in changedFields
		) {
			// TODO: There might be a bug whereby the first change doesn't update
			//      it might be something else like update N displaying at N+1
			const newPoints = getPoints( this.state.sites, 10 );
			this.setState(
				{
					riskPoints: newPoints,
				}
			);
		}
	};

	getLiveConditions = async () => {
		this.setState(
			{
				risk: Math.floor(Math.random()*10),
				conditions: {
					date: { value: moment() },
					time: { value: moment() },
					daynight: { value: (new Date()).getHours()<19 ? "day" : "night" },
					site: { value: this.state.sites[ 0 ] },
					// could pull this from a live API if you want to
					traffic: { value: ["1", "2", "3"][(new Date()).getMinutes()%3] },
					weather: { value: ["rainy", "sunny", "cloudy"][(new Date()).getHours()%3] },
				}
			}
		);
	};

	render() {
		return (
			<LocaleProvider locale={enGB}>
				<div className="App">
					<HeatMap
						riskPoints={[]}
						sites={this.state.sites}
						activeSite={this.state.conditions.site.value}/>
					<Menu sites={this.state.sites}
					      risk={this.state.risk}
					      getLiveConditions={this.getLiveConditions}
					      {...this.state.conditions}
					      onChange={this.handleFormChange}
					/>
				</div>
			</LocaleProvider>
		);
	}
}

export default App;

function getSites( n ) {
	const { lat, lng } = { lat: 51.4834622, lng: -0.0586256 };
	return Array( n ).fill().map(
		() => ({
			lat: lat + Math.random() * 0.01 - 0.005,
			lng: lng + Math.random() * 0.01 - 0.005
		})
	);
}

function getPoints( sites, n ) {
	const nested = sites.map(
		s =>
			Array( n ).fill().map(
				() => ({
					lat: s.lat + Math.random() * 0.001 - 0.0005,
					lng: s.lng + Math.random() * 0.001 - 0.0005,
					risk: Math.random() * 10
				})
			)
	);
	return [].concat.apply( [], nested );
}


