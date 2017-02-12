/**
 * Created by christoph on 06/02/17.
 */
import GoogleMap from "google-map-react";
import React from "react";

const TILE_SIZE = 256;

//Mercator --BEGIN--
function bound( value, opt_min, opt_max ) {
	if (opt_min !== null) value = Math.max( value, opt_min );
	if (opt_max !== null) value = Math.min( value, opt_max );
	return value;
}

function degreesToRadians( deg ) {
	return deg * (Math.PI / 180);
}

class MercatorProjection {
	constructor( maps ) {
		this.maps               = maps;
		this.pixelOrigin        = new maps.Point(
			TILE_SIZE / 2,
			TILE_SIZE / 2
		);
		this.pixelsPerLonDegree = TILE_SIZE / 360;
		this.pixelsPerLonRadian = TILE_SIZE / (2 * Math.PI);
	}

	fromLatLngToPoint = ( latLng, opt_point ) => {
		const point  = opt_point || new this.maps.Point( 0, 0 );
		const origin = this.pixelOrigin;

		point.x = origin.x + latLng.lng() * this.pixelsPerLonDegree;

		// NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
		// 89.189.  This is about a third of a tile past the edge of the world
		// tile.
		const siny = bound(
			Math.sin( degreesToRadians( latLng.lat() ) ), -0.9999,
			0.9999
		);
		point.y    = origin.y + 0.5 * Math.log( (1 + siny) / (1 - siny) ) * -this.pixelsPerLonRadian;
		return point;
	};
}

class GoogleHeatmap extends React.Component {

	static propTypes = {
		center      : React.PropTypes.shape(
			{
				lat: React.PropTypes.number.isRequired,
				lng: React.PropTypes.number.isRequired,
			}
		).isRequired,
		zoom        : React.PropTypes.number,
		points      : React.PropTypes.arrayOf(
			React.PropTypes.shape(
				{
					lat   : React.PropTypes.number.isRequired,
					lng   : React.PropTypes.number.isRequired,
					weight: React.PropTypes.number.isRequired
				}
			)
		).isRequired,
		gradient    : React.PropTypes.arrayOf( React.PropTypes.string ),
		radius      : React.PropTypes.number,
		maxIntensity: React.PropTypes.number,
		googleAPIKey: React.PropTypes.string.isRequired,
		dissipating : React.PropTypes.bool,
	};

	static defaultProps = {
		zoom       : 1000,
		radius     : 20,
		dissipating: true
	};

	getNewRadius() {
		const numTiles = 1 << this.map.getZoom();
		const center   = this.map.getCenter();
		const moved    = this.maps.geometry.spherical.computeOffset( center, 10000, 90 );
		/*1000 meters to the right*/
		const projection     = new MercatorProjection( this.maps );
		const initCoord      = projection.fromLatLngToPoint( center );
		const endCoord       = projection.fromLatLngToPoint( moved );
		const initPoint      = new this.maps.Point(
			initCoord.x * numTiles,
			initCoord.y * numTiles
		);
		const endPoint       = new this.maps.Point(
			endCoord.x * numTiles,
			endCoord.y * numTiles
		);
		const pixelsPerMeter = (Math.abs( initPoint.x - endPoint.x )) / 10000.0;
		return Math.floor( this.props.radius * pixelsPerMeter );
	}

	componentWillReceiveProps( nextProps ) {
		this.updateMap( nextProps );
	}

	updateMap( props ) {

		console.log( "Updating ", props.radius, props.maxIntensity, props.zoom );
		// if we're updating, we should remove the old one
		if (this.heatmap) {
			this.heatmap.setMap( null );
		}

		// now create a new one (the old one should have no dangling references left so should be GC'd)
		this.heatmap = new this.maps.visualization.HeatmapLayer(
			{
				data        : props.points.map(
					p => ({ location: new this.maps.LatLng( p.lat, p.lng ), weight: p.weight })
				),
				dissipating : props.dissipating,
				gradient    : props.gradient,
				radius      : this.getNewRadius(),
				maxIntensity: props.maxIntensity,
				opacity     : 1
			}
		);

		// finally attach the new one
		this.heatmap.setMap( this.map );

	}

	render() {
		const styles = [
			{
				"featureType": "landscape",
				"stylers"    : [ { "hue": "#FFBB00" }, { "saturation": 43.400000000000006 }, { "lightness": 37.599999999999994 }, { "gamma": 1 } ]
			}, {
				"featureType": "road.highway",
				"stylers"    : [ { "hue": "#FFC200" }, { "saturation": -61.8 }, { "lightness": 45.599999999999994 }, { "gamma": 1 } ]
			}, {
				"featureType": "road.arterial",
				"stylers"    : [ { "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 51.19999999999999 }, { "gamma": 1 } ]
			}, {
				"featureType": "road.local",
				"stylers"    : [ { "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 52 }, { "gamma": 1 } ]
			}, {
				"featureType": "water",
				"stylers"    : [ { "hue": "#0078FF" }, { "saturation": -13.200000000000003 }, { "lightness": 2.4000000000000057 }, { "gamma": 1 } ]
			}, {
				"featureType": "poi",
				"stylers"    : [ { "hue": "#00FF6A" }, { "saturation": -1.0989010989011234 }, { "lightness": 11.200000000000017 }, { "gamma": 1 } ]
			} ];
		return (
			<GoogleMap
				bootstrapURLKeys={{
					key      : this.props.googleAPIKey,
					libraries: 'visualization,geometry',
				}}
				center={this.props.center}
				zoom={this.props.zoom}
				yesIWantToUseGoogleMapApiInternals
				options={maps => ({
					disableDefaultUI: false,
					scrollwheel     : false,
					draggable       : false,
					styles
				})
				}
				onGoogleApiLoaded={( { map, maps } ) => {
					this.maps = maps;
					this.map  = map;
					this.updateMap( this.props );

					maps.event.addListener(
						map, 'zoom_changed', () => {
							this.heatmap.setOptions( { radius: this.getNewRadius() } );
						}
					);
				}}
			>
				{this.props.children}
			</GoogleMap>
		);
	}
}

export default GoogleHeatmap;

