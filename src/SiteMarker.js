/**
 * Created by christoph on 03/02/17.
 */
import React, {Component} from "react";

class SiteMarker extends Component {
	render() {
		return (
			<div style={{
				width: 25,
				height: 25,
				borderRadius: 12.5,
				border: "2px solid black",
				backgroundColor: "rgba(0, 0, 0, 0.2)",
			}} />
		);
	}
}

SiteMarker.propTypes = {};
SiteMarker.defaultProps = {};

export default SiteMarker;

