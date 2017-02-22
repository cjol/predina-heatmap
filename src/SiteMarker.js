/**
 * Created by christoph on 03/02/17.
 */
import React, {Component} from "react";
import {Popover} from "antd";
import SiteConditionsEditor from "./SiteConditionsEditor";
import Site from "./Site";
import xolor from "xolor";

class SiteMarker extends Component {
	static propTypes = {
		onClick              : React.PropTypes.func,
		site                 : Site.ReactType,
		changeLocalConditions: React.PropTypes.func
	};

	constructor() {
		super();
		this.state = {
			visible: false
		};
	}

	hide = () => {
		this.setState(
			{
				visible: false,
			}
		);
	};

	handleVisibleChange = ( visible ) => {
		this.setState( { visible } );
	};

	render() {
		const gradientColor = xolor( 'rgba(48,255,2,0)' );
		const riskColor     = gradientColor.gradient('rgba(255,50,50,1)' , this.props.site.risk );

		const content =
			      <SiteConditionsEditor site={this.props.site}
			                            hide={this.hide}
			                            changeLocalConditions={this.props.changeLocalConditions}/>;
		return (
			<Popover content={content} trigger="click" visible={this.state.visible}

			         onVisibleChange={this.handleVisibleChange}>
				<div style={{
					width       : 45,
					height      : 45,
					marginLeft  : -22.5,
					marginTop   : -22.5,
					borderRadius: 22.5,
					// background    : `url(${icon})`,
					// backgroundSize: "100%",
					cursor      : "pointer",
					color       : riskColor,
					fontWeight  : "bold",
					fontSize    : "35px",
					textAlign   : "center",
					lineHeight  : "37px",
					border      : "5px solid " + riskColor,
					background  : "rgba(255,255,255,0.5)"

				}}
				     onClick={this.props.onClick}
				     onMouseEnter={this.props.onMouseEnter}
				     onMouseLeave={this.props.onMouseLeave}
				>
					{Math.floor( this.props.site.risk * 10 )}
				</div>
			</Popover>
		);
	}
}

export default SiteMarker;

