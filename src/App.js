import React, {Component} from "react";
import HeatMap from "./HeatMap";
import Menu from "./Menu";
import "./App.css";
import "antd/dist/antd.css";
import {LocaleProvider} from "antd";
import enGB from "antd/lib/locale-provider/en_US";
import moment from "moment";
import "moment/locale/en-gb";

moment.locale( 'en-gb' );

class App extends Component {

	constructor() {
		super();

		// eslint-disable-next-line
		this.state = {
			riskPoints: getPoints(300).map(
				( { lat, lng }, i ) =>
					({
						id: "" + i,
						lat,
						lng,
						risk: Math.random()
					})
			)
		};

		// eslint-disable-next-line
		this.state.sites = this.state.riskPoints.slice(0,10);
		// eslint-disable-next-line
		this.state.activeSite = this.state.sites[ 0 ];
	}

	render() {
		return (
			<LocaleProvider locale={enGB}>
				<div className="App">
					<HeatMap riskPoints={this.state.riskPoints} sites={this.state.sites} activeSite={this.state.activeSite}/>
					<Menu />
				</div>
			</LocaleProvider>
		);
	}
}

export default App;

function getPoints(n) {
	const {lat, lng} = { lat : 51.4834622, lng:-0.0586256}
	return Array(n).fill().map( () => ({
		lat: lat + Math.random()*0.01 - 0.005,
		lng: lng + Math.random()*0.01 - 0.005
	}));
}
