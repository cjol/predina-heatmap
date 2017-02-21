import React, {Component} from "react";
import moment from "moment";
import "./App.css";
import "antd/dist/antd.css";
import {LocaleProvider} from "antd";
import enGB from "antd/lib/locale-provider/en_US";
import _ from "lodash";
import "moment/locale/en-gb";
import axios from "axios";
import Menu from "./Menu";
import HeatMap from "./HeatMap";

moment.locale( 'en-gb' );

const modeBy = ( collection, iteratee ) =>
	_.chain( collection )
		.countBy( iteratee )
		.toPairs()
		.maxBy( _.last )
		.head()
		// in this implementation string "undefined" is returned if iteratee returning
		// non existing property is given
		.thru( value => value === 'undefined' ? undefined : value )
		.value();

function aggregateChildren( accs ) {
	const accounts   = _.values( accs );
	const latitude   = accounts.reduce( ( acc, { latitude } ) => acc + latitude, 0 ) / accounts.length,
	      longitude  = accounts.reduce( ( acc, { longitude } ) => acc + longitude, 0 ) / accounts.length,
	      risk       = accounts.reduce( ( acc, { risk } ) => acc + risk, 0 ) / accounts.length,
	      conditions = {
		      temperature    : {value: accounts.reduce(
			      ( acc, { conditions } ) => acc + conditions.temperature.value,
			      0
		      ) / accounts.length},
		      windspeed      : {value: accounts.reduce(
			      ( acc, { conditions } ) => acc + conditions.windspeed.value,
			      0
		      ) / accounts.length},
		      visibility     : {value: accounts.reduce(
			      ( acc, { conditions } ) => acc + conditions.visibility.value,
			      0
		      ) / accounts.length},
		      weather_summary: { value: modeBy( accounts, acc => acc.conditions.weather_summary.value ) }
	      };

	return { latitude, longitude, risk, conditions };
}


function upsertAccount( country, account ) {
	const { region: new_region, city: new_city, name: new_account } = account;

	const newCountry = {
		regions: {
			[new_region]: {
				name  : new_region,
				region: new_region,
				type  : "region",
				cities: {
					[new_city]: {
						name    : new_city,
						type    : "city",
						region  : new_region,
						city    : new_city,
						accounts: {
							[new_account]: {
								type      : "account",
								region    : new_region,
								city      : new_city,
								account   : new_account,
								...account,
								conditions: account.conditions ||
								{
									temperature    : { value: 0 },
									visibility     : { value: 0 },
									windspeed      : { value: 0 },
									weather_summary: { value: "Partly Cloudy" }
								}
							}
						}
					}
				}
			}
		}
	};

	return _.merge( country, newCountry );

	// NB this will result in an inconsistent state as averages haven't been updated yet
}

function recalcAggregates( country ) {

	const regions = _.mapValues(
		_.pickBy( country.regions, r => _.keys( r.cities ).length > 0 ),
		region => {
			const cities = _.mapValues(
				_.pickBy( region.cities, c => _.keys( c.accounts ).length > 0 ),
				city => ({
					...city,
					accounts: city.accounts,
					...aggregateChildren( city.accounts )
				})
			);

			return {
				...region,
				cities,
				...aggregateChildren( cities )
			};
		}
	);

	return {
		...country,
		regions,
		...aggregateChildren( regions )
	};
}

const flattenCity    = city => _.values( city.accounts );
const flattenRegion  = region => _.flatMap( _.values( region.cities ), flattenCity );
const flattenCountry = country => _.flatMap( _.values( country.regions ), flattenRegion );
const flattenAll = (thing) => {
	if (thing.account) return [thing];
	if (thing.city) return flattenCity(thing);
	if (thing.region) return flattenRegion(thing);
	if (thing.country) return flattenCountry(thing);
	return [];
}

class App extends Component {

	constructor() {
		super();

		const country = { name: "United Kingdom", type: "country", regions: {} };

		const globalConditions = {
			date : { value: moment() },
			time : { value: moment() },
			night: { value: (new Date()).getHours() > 19 },
		};

		// eslint-disable-next-line
		this.state = {
			country    : country,
			activePoint: country,
			riskPoints : [],
			globalConditions,
		};
	}

	componentDidMount = async() => {

		await this.getFreshAccounts();

		await this.updateAccounts( flattenCountry( this.state.country ) );
	};


	insertAccounts = async( accounts ) => {

		const exactive = this.state.activePoint;

		const country = recalcAggregates(
			accounts.reduce(
				( country, account ) => upsertAccount( country, account ),
				this.state.country
			)
		);

		let activePoint = country;
		if (exactive.region) activePoint = country.regions[ exactive.region ];
		if (exactive.city) activePoint = country.regions[ exactive.region ].cities[ exactive.city ];
		if (exactive.account) activePoint = country.regions[ exactive.region ].cities[ exactive.city ].accounts[ exactive.account ];

		return new Promise(
			resolve => this.setState(
				{
					country,
					activePoint,
					riskPoints: flattenCountry( country )
				}, resolve
			)
		);
	};

	updateAccounts = async( accounts ) => {
		const global_conditions = {
			date : this.state.globalConditions.date.value.format( "YYYYMMDD" ),
			time : this.state.globalConditions.time.value.format( "HHmm00" ),
			night: this.state.globalConditions.night.value
		};

		const result = await axios.post(
			'http://amey.predina.com/api/risk', {
				global_conditions,
				accounts
			}
		);

		if (result.statusText !== "OK") {
			alert( "Could not reach API server" );
			throw new Error( "Could not reach API server;" );
		}

		return this.insertAccounts( result.data );
	};

	getFreshAccounts = async() => {

		// TODO: fill this in from API or something
		const result = await axios.get( 'http://amey.predina.com/api/risk' );
		if (result.statusText !== "OK") {
			alert( "Could not reach API server" );
			throw new Error( "Could not reach API server;" );
		}

		const allAccounts = result.data;

		return this.insertAccounts( allAccounts );
	};

	setActivePoint = ( s ) => {
		this.setState(
			{
				activePoint: s,
			}
		);
	};

	changeGlobalConditions = ( changedFields ) => {

		// choose the first key we find and check if it's clean or not
		const keys = Object.keys( changedFields );

		if (keys.length < 0) return; // no changes
		if (changedFields[ keys[ 0 ] ].dirty) return; // don't bother updating if it's not done

		this.setState(
			state => {
				return {
					...state,
					globalConditions: { ...state.globalConditions, ...changedFields },
				};
			},
			() => this.updateAccounts( flattenCountry( this.state.country ) )
		);

	};

	setLocalConditions = async( site, conditions ) => {

		const accounts = flattenAll(site).map(s => ({
			...s,
			conditions: {
				...s.conditions,
				...conditions
			}
		}));

		return this.updateAccounts( accounts );
	};

	render() {

		let markers = <div />;
		if (this.state.activePoint.account || this.state.activePoint.city) {
			markers = [ this.state.activePoint ];
		} else if (this.state.activePoint.region) {
			markers = this.state.country
				.regions[ this.state.activePoint.region ]
				.cities;
		} else {
			markers = this.state.country
				.regions;
		}

		return (
			<LocaleProvider locale={enGB}>
				<div className="App">
					<HeatMap
						markers={_.values( markers )}
						setActivePoint={this.setActivePoint}
						setLocalConditions={this.setLocalConditions}
						activePoint={this.state.activePoint}
						riskPoints={this.state.riskPoints}
					/>
					<Menu country={this.state.country}
					      {...this.state.globalConditions}
					      changeGlobalConditions={this.changeGlobalConditions}
					      setActivePoint={this.setActivePoint}
					      activePoint={this.state.activePoint}/>
				</div>
			</LocaleProvider>
		);
	}
}

export default App;
