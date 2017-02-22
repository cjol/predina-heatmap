/**
 * Created by cjol on 03/02/17.
 */
import React from "react";
import GoogleHeatmap from "./GoogleHeatmap";
import SiteMarker from "./SiteMarker";
import Site from "./Site";


const zoomLevels = [
	7, //country
	9, //region
	12, // city
];

const intensityLevels = [
	100, //country
	30, // region
	10, // city
];

const radiusLevels = [
	20000, //country
	5000, // region
	2000, // city
];

class HeatMap extends React.Component {
	static propTypes = {
		// sites        : React.PropTypes.arrayOf(
		// 	siteType
		// ),
		riskPoints   : React.PropTypes.arrayOf(
			React.PropTypes.shape(
				{
					lat : React.PropTypes.number,
					lng : React.PropTypes.number,
					risk: React.PropTypes.number
				}
			)
		),
		markers: React.PropTypes.arrayOf(React.PropTypes.object),
		setLocalConditions: React.PropTypes.func,
		// updateSite: React.PropTypes.func,
		activePoint   : Site.ReactType.isRequired,
		setActivePoint: React.PropTypes.func.isRequired,
		// viewLevel     : React.PropTypes.number.isRequired
	};

	// constructor() {
	// 	super();
	// }

	render() {
		if (this.props.activePoint && this.props.activePoint.risk) {

			// const leaves = this.props.activeSite.flatChildren();
			// const leaves = this.props.activeSite.subRisk();
			// console.log(this.props.activeSite.subsites);
			// console.log([].concat.apply( [], this.props.activeSite.subsites));
			// console.log(leaves);
			// const riskPoints = leaves.map(
			// 	s => ({
			// 		lat   : s.lat,
			// 		lng   : s.lng,
			// 		weight: s.getRisk()
			// 	})
			// );


			const markers =
				      this.props.markers.map(
					      s =>
						      <SiteMarker key={s.name}
						                  site={s}
						                  lat={s.latitude}
						                  lng={s.longitude}
						                  changeLocalConditions={( e ) => {
							                  // choose the first key we find and check if it's clean or not
							                  const keys = Object.keys(e);

							                  if (keys.length < 0) return; // no changes
							                  if (e[keys[0]].dirty) return; // don't bother updating if it's not done

							                  this.props.setLocalConditions( s, e );
						                  }}
						      />
				      );
			const points = this.props.riskPoints.map(p => ({lat:p.latitude, lng:p.longitude, weight: p.risk}))
			// const gradient=[ "rgba(0,211,162,0)", "rgba(0,211,162,0.6)", "rgba(234,136,67,0.9)", "#ef3817" ]
			// const gradient=[ "rgba(234,136,67,0.0)","rgba(234,136,67,0.3)", "rgba(234,136,67,0.9)", "#ef3817" ]
			//  0%,rgba(255,158,48,1) 32%,rgba(255,194,40,1) 56%,rgba(231,252,136,1) 84%,rgba(198,252,67,1) 92%,rgba(194,252,58,0.88) 93%,rgba(194,252,58,0) 100%);

			//
			const gradient = [
				'rgba(100, 255, 2, 0)',
				'rgba(100, 255, 2, 0.8)',
				'rgba(54, 255, 3, 1)',
				'rgba(154, 255, 22, 1)',
				'rgba(255, 194, 40, 1)',
				'rgba(255, 158, 48, 1)',
				'rgba(255,50,50,1)'
			];
			return (
				<div style={{
					position: "absolute",
					top     : 0,
					left    : 300,
					right   : 0,
					bottom  : 0
				}}>
					<GoogleHeatmap style={{ position: "absolute" }}
					               center={{ lat: this.props.activePoint.latitude, lng: this.props.activePoint.longitude }}
					               points={points}
					               zoom={8/*this.props.activePoint.account || this.props.activePoint.city ? 16
					                    : this.props.activePoint.region ? 13
					               : this.props.activePoint.country ? 10 : 8*/}
					               radius={20000}
					               maxIntensity={10}
					               gradient={gradient}
					               googleAPIKey="AIzaSyBrHnamVKGI2E-ZJ33HVtbLcefIaKijwbA">
						{markers}
					</GoogleHeatmap>
				</div>);
		} else {
			return <div />;
		}
	}
}

export default HeatMap;

