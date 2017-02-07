/**
 * Created by christoph on 06/02/17.
 */
import GoogleMap from "google-map-react";
import React from "react";


class GoogleHeatmap extends React.Component {

	static propTypes = {
		center: React.PropTypes.shape(
			{
				lat: React.PropTypes.number.isRequired,
				lng: React.PropTypes.number.isRequired,
			}
		).isRequired,
		zoom: React.PropTypes.number,
		points: React.PropTypes.arrayOf(
			React.PropTypes.shape(
				{
					lat: React.PropTypes.number.isRequired,
					lng: React.PropTypes.number.isRequired,
					weight: React.PropTypes.number.isRequired
				}
			)
		).isRequired,
		gradient: React.PropTypes.arrayOf( React.PropTypes.string ),
		radius: React.PropTypes.number,
		googleAPIKey: React.PropTypes.string.isRequired,
		dissipating: React.PropTypes.bool,
		children: React.PropTypes.arrayOf(React.PropTypes.element)
	};

	static defaultProps = {
		zoom: 13,
		radius: 20,
		dissipating: true
	};

	componentWillReceiveProps(nextProps) {
		this.updateMap(nextProps.points);
	}

	updateMap(points) {

		// if we're updating, we should remove the old one
		if (this.heatmap) {
			this.heatmap.setMap(null);
		}

		// now create a new one (the old one should have no dangling references left so should be GC'd)
		this.heatmap = new this.maps.visualization.HeatmapLayer(
			{
				data: this.props.points.map(
					p => ({ location: new this.maps.LatLng( p.lat, p.lng ), weight: p.weight })
				),
				dissipating: this.props.dissipating,
				gradient: this.props.gradient,
				radius: this.props.radius,
			}
		);

		// finally attach the new one
		this.heatmap.setMap(this.map);

	}

	render() {
		return (
			<GoogleMap
				bootstrapURLKeys={{
					key: this.props.googleAPIKey,
					libraries: 'visualization',
				}}
				center={this.props.center}
				zoom={this.props.zoom}
				yesIWantToUseGoogleMapApiInternals
				onGoogleApiLoaded={( { map, maps } ) => {
					this.maps = maps;
					this.map = map;
					this.updateMap(this.props.points);
				}}
			>
				{this.props.children}
			</GoogleMap>
		);
	}
}

export default GoogleHeatmap;

