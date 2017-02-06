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

	render() {
		return (
			<GoogleMap
				bootstrapURLKeys={{
					key: this.props.googleAPIKey,
					libraries: 'visualization',
				}}
				defaultCenter={this.props.center}
				defaultZoom={this.props.zoom}
				yesIWantToUseGoogleMapApiInternals
				onGoogleApiLoaded={( { map, maps } ) => {

					this.heatmap = new maps.visualization.HeatmapLayer(
						{
							data: this.props.points.map(
								p => ({ location: new maps.LatLng( p.lat, p.lng ), weight: p.weight })
							),
							map: map,
							dissipating: this.props.dissipating,
							gradient: this.props.gradient,
							radius: this.props.radius,
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

