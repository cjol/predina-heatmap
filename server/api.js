/**
 * Created by christoph on 13/02/17.
 */
import locations from "../data/incidents.json";
import locations_clustered from "../data/incidents_clustered_with_latlng.json";
import locations_cache from "../data/locations_cache";
import {RateLimiter} from "limiter";
import _ from "lodash";
import request from "request-promise";
import fs from "fs";

const limiter = new RateLimiter( 100, 'second' );
// const locations_cache = _.flatMap(
// 	locations_clustered,
// 	region => {
//
// 		console.log(region);
// 		const cities = _.flatMap(region.cities, city => {
//
// 			const sites = _.map(city.site, site => {
//
// 				return {name: `${site.name}, ${city.name}, United Kingdom`, lat: site.lat, lng:site.lng}
// 			});
//
// 			sites.push({name: `${city.name}, United Kingdom`, lat: city.lat, lng: city.lng})
// 			return sites;
// 		});
//
// 		cities.push({name: `${region.name}, United Kingdom`, lat: region.lat, lng: region.lng})
// 		return cities;
// 	}
// );

const getLatLng = async( location ) => {
	"use strict";

	const hit = locations_cache.find( ( { name, latLng } ) => name === location && latLng );
	if (hit) {
		return new Promise( resolve => resolve( hit.latLng ) );
	}

	return new Promise( resolve => limiter.removeTokens( 1, resolve ) )
		.then(
			() => {
				console.log( "Requesting " + location )
				const options = {
					uri : 'http://www.mapquestapi.com/geocoding/v1/address',
					qs  : {
						key       : 'Jemi4ed94cbbnSA4iAKmjBTPoabEc33O',
						maxResults: 1,
						location
					},
					json: true // Automatically parses the JSON string in the response
				};
				return request( options )
					.then(
						( { results } ) => {
							console.log( "Got result for " + location );
							if (results.length < 1) throw Error( "No results found for " + location );
							if (results[ 0 ].locations.length < 1) throw Error( "No results found for " + location );
							const latLng = results[ 0 ].locations[ 0 ].latLng
							locations_cache.push( { name: location, latLng } );
							return latLng;
						}
					);
			}
		)
		.catch( e => console.error( e ) );
};

setInterval(
	() => {
		fs.writeFile(
			'data/locations_cache.json',
			JSON.stringify( locations_cache ),
			function ( err ) {
				if (err) {
					console.error( err );
					return false;
				}
				return true;
			}
		);
	}, 10000
);

async function clusterData( locations ) {

	// extract regions
	const regions = _( locations )
		.take( 1000 )
		.groupBy( 'region' )
		.toArray()
		.map(
			async r => {

				// extract cities
				const cities = Promise.all(
					_( r )
						.groupBy( 'city' )
						.toArray()
						.map(
							async c => {

								// extract sites
								const sites = Promise.all(
									_( c )
										.groupBy( 'site' )
										.toArray()
										.map(
											async s => {

												// clean up incidents
												const incidents = _( s )
													.map(
														i => ({
															type         : i.type,
															subtype      : i.subtype,
															date         : i.date,
															location     : i.location,
															accident_type: i.accident_type
														})
													);

												return {
													name: s[ 0 ].site,
													...(await getLatLng( `${s[ 0 ].site}, ${s[ 0 ].city}, United Kingdom` )),
													incidents,
												};
											}
										)
										.value()
								);

								return {
									name : c[ 0 ].city,
									...(await getLatLng( `${c[ 0 ].city}, United Kingdom` )),
									sites: await sites
								};
							}
						)
						.value()
				);

				return {
					name  : r[ 0 ].region,
					...(await getLatLng( `${r[ 0 ].region}, United Kingdom` )),
					cities: await cities
				};
			}
		)
		.value();

	return Promise.all( regions );
}

const api = {
	async cluster() {
		"use strict";
		const cluster = (await clusterData( locations ));
		fs.writeFile(
			'data/incidents_clustered_with_latlng.json',
			JSON.stringify( cluster, null, '\t' ),
			( err ) => console.error( err )
		);
		return cluster;
	},
	locations() {
		"use strict";
		return { regions: locations_clustered };
	}
};


const middlewares = {};
for (let a of Object.keys( api )) {
	middlewares[ a ] = ( req, res ) => {
		"use strict";
		try {
			api[ a ]().then(
				result =>
					res.status( 200 ).json( result )
			);
		} catch (e) {
			res.status( 500 ).send( e );
		}
	};
}

export default middlewares;
