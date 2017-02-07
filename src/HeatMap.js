/**
 * Created by cjol on 03/02/17.
 */
import React from "react";
import GoogleHeatmap from "./GoogleHeatmap";
import SiteMarker from "./SiteMarker";

const siteType = React.PropTypes.shape(
	{
		lat: React.PropTypes.number,
		lng: React.PropTypes.number,
		id: React.PropTypes.string,
		name: React.PropTypes.string,
		risk: React.PropTypes.number
	}
);

class HeatMap extends React.Component {
	static propTypes = {
		sites: React.PropTypes.arrayOf(
			siteType
		),
		activeSite: siteType,
		riskPoints: React.PropTypes.arrayOf(
			React.PropTypes.shape(
				{
					lat: React.PropTypes.number,
					lng: React.PropTypes.number,
					risk: React.PropTypes.number
				}
			)
		),
	};

	// constructor() {
	// 	super();
	// }

	render() {
		if (this.props.sites && this.props.sites.length > 0) {

			return (
				<div style={{
					position: "absolute",
					top: 0,
					left: 300,
					right: 0,
					bottom: 0
				}}>
					<GoogleHeatmap style={{ position: "absolute" }}
					               center={{ lat: this.props.activeSite.lat, lng: this.props.activeSite.lng }}
					               points={this.props.riskPoints.map(
						               ( { lat, lng, risk } ) => ({
							               lat,
							               lng,
							               weight: risk
						               })
					               )}
					               radius={20}
					               zoom={16}
					               googleAPIKey="AIzaSyBrHnamVKGI2E-ZJ33HVtbLcefIaKijwbA">
						{
							this.props.sites.map( s => <SiteMarker key={s.id} {...s} active={s.id===this.props.activeSite.id} /> )
						}
					</GoogleHeatmap>
				</div>);
		} else {
			return <div />;
		}
	}
}

export default HeatMap;

