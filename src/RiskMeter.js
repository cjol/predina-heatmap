/**
 * Created by christoph on 19/02/17.
 */
import xolor from "xolor";
import React, {Component} from "react";

class RiskMeter extends Component {
	static propTypes = {
		risk: React.PropTypes.number,
		style: React.PropTypes.object
	};

	render() {
		const gradientColor = xolor( 'rgba(255,50,50,1)' );
		const riskColor     = gradientColor.gradient( 'rgba(48,255,2,0)', this.props.risk );
		return <div style={this.props.style} className="riskNumber">
			<div style={{ position: "absolute", fontSize: "100%", top: 0, bottom: 0, left: 0 }}>
				<div style={{
					width     : 10,
					position  : "absolute",
					left      : 0,
					top       : 0,
					bottom    : 0,
					background: "linear-gradient(to bottom, rgba(255,50,50,1) 0%, rgba(255,158,48,1) 30%, rgba(255,194,40,1) 50%, rgba(154,255,22,1) 75%, rgba(54,255,3,1) 92%, rgba(48,255,2,0.88) 93%, rgba(48,255,2,0)"
				}}></div>
				<div style={{ position: "absolute", top: 0, left: 20 }}>High&nbsp;Risk&nbsp;(10)</div>
				<div style={{ position: "absolute", bottom: 0, left: 20 }}>Low&nbsp;Risk&nbsp;(0)</div>
			</div>
			<div style={{
				width: "100%",
				color: riskColor
			}}>
				{Math.floor( this.props.risk * 10 )}
			</div>
		</div>;
	}
}

export default RiskMeter;
