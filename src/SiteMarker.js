/**
 * Created by christoph on 03/02/17.
 */
import React, {Component} from "react";
import icon from "./img/sitemarker.png";

class SiteMarker extends Component {
	render() {
		return (
			<div style={{
				width: 25,
				height: 25,
				marginLeft: -12.5,
				marginTop: -12.5,
				borderRadius: 12.5,
				background: `url(${icon})`,
				// just to re-center this particular icon
				backgroundSize: "175%",
				backgroundPosition: "49% 33%",
			}} />
		);
	}
}

SiteMarker.propTypes = {};
SiteMarker.defaultProps = {};

export default SiteMarker;

