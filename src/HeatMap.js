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
		// riskPoints   : React.PropTypes.arrayOf(
		// 	React.PropTypes.shape(
		// 		{
		// 			lat : React.PropTypes.number,
		// 			lng : React.PropTypes.number,
		// 			risk: React.PropTypes.number
		// 		}
		// 	)
		// ),
		// updateSite: React.PropTypes.func,
		activeSite   : Site.ReactType.isRequired,
		setActiveSite: React.PropTypes.func.isRequired,
		viewLevel    : React.PropTypes.number.isRequired
	};

	// constructor() {
	// 	super();
	// }

	render() {
		if (this.props.activeSite) {

			const leaves = this.props.activeSite.flatChildren();
			// const leaves = this.props.activeSite.subRisk();
			// console.log(this.props.activeSite.subsites);
			// console.log([].concat.apply( [], this.props.activeSite.subsites));
			// console.log(leaves);
			const riskPoints = leaves.map(
				s => ({
					lat   : s.lat,
					lng   : s.lng,
					weight: s.getRisk()
				})
			);

			const markers =
				      this.props.activeSite.subsites.map(
					      s =>
						      <SiteMarker key={s.id} site={s}
						                  lat={s.lat}
						                  lng={s.lng}
						                  onClick={() => this.props.setActiveSite( s )}
						                  changeLocalConditions={( e ) => {
							                  // choose the first key we find and check if it's clean or not
							                  const keys = Object.keys(e);

							                  if (keys.length < 0) return; // no changes
							                  if (e[keys[0]].dirty) return; // don't bother updating if it's not done

							                  s.updateConditions( e, this.props.globalConditions );
							                  // TODO: this is a little hacky and not the react way
							                  this.forceUpdate();
						                  }}
						      />
				      );
			return (
				<div style={{
					position: "absolute",
					top     : 0,
					left    : 300,
					right   : 0,
					bottom  : 0
				}}>
					<GoogleHeatmap style={{ position: "absolute" }}
					               center={{ lat: this.props.activeSite.lat, lng: this.props.activeSite.lng }}
					               points={riskPoints}
					               radius={radiusLevels[ this.props.viewLevel ]}
					               gradient={[ "rgba(0,211,162,0)", "rgba(0,211,162,0.6)", "rgba(234,136,67,0.9)", "#ef3817" ]}
					               zoom={zoomLevels[ this.props.viewLevel ]}
					               maxIntensity={intensityLevels[ this.props.viewLevel ]}
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

