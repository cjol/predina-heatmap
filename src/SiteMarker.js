/**
 * Created by christoph on 03/02/17.
 */
import React, {Component} from "react";
import icon from "./img/sitemarker.png";
import {Popover} from "antd";
import SiteConditionsEditor from "./SiteConditionsEditor";
import Site from "./Site";

class SiteMarker extends Component {
	static propTypes = {
		onClick              : React.PropTypes.func,
		site                 : Site.ReactType,
		changeLocalConditions: React.PropTypes.func
	};

	render() {
		const content =
			      <SiteConditionsEditor site={this.props.site}
			                            changeLocalConditions={this.props.changeLocalConditions}/>;
		return (
			<Popover content={content} title={this.props.site.name}>
				<div style={{
					width         : 50,
					height        : 50,
					marginLeft    : -25,
					marginTop     : -25,
					borderRadius  : 25,
					background    : this.props.site.subsites.length>0?`url(${icon})`:'',
					// just to re-center this particular icon
					backgroundSize: "100%",
					cursor        : "pointer",
				}}
				     onClick={this.props.onClick}
				     onMouseEnter={this.props.onMouseEnter}
				     onMouseLeave={this.props.onMouseLeave}
				/>
			</Popover>
		);
	}
}

export default SiteMarker;

