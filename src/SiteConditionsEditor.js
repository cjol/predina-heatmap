/**
 * Created by christoph on 08/02/17.
 */
import React from "react";
import {Form, Select} from "antd";
const FormItem = Form.Item;
import xolor from "xolor";
import Site from "./Site";

class SiteConditionsEditor extends React.Component {
	static propTypes = {
		form: React.PropTypes.object,
		weather:React.PropTypes.shape({ value: React.PropTypes.string}),
		traffic:React.PropTypes.shape({ value: React.PropTypes.string}),
		changeLocalConditions: React.PropTypes.func,
		site: Site.ReactType
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const gradientColor         = xolor( '#00d3a2' );
		const risk = this.props.site.getRisk();
		const riskColor             = gradientColor.gradient( '#ef3817', risk / 10 );

		return (
			<Form>

				<FormItem
					label="Weather">
					{getFieldDecorator(
						'weather', {
							rules: [ { required: true, message: 'Please select the weather at the point!' } ],
						}
					)(
						<Select>
							<Select.Option value="sunny">Sunny</Select.Option>
							<Select.Option value="rainy">Rainy</Select.Option>
							<Select.Option value="cloudy">Cloudy</Select.Option>
						</Select>
					)}
				</FormItem>
				<FormItem
					label="Traffic">
					{getFieldDecorator(
						'traffic', {
							rules: [ { required: true, message: 'Please select the traffic at the point!' } ],
						}
					)(
						<Select>
							<Select.Option value="1">Low</Select.Option>
							<Select.Option value="2">Medium</Select.Option>
							<Select.Option value="3">High</Select.Option>
						</Select>
					)}
				</FormItem>


				<div className="riskNumber">
					<div style={{ position: "absolute", fontSize: "100%", top: 0, bottom: 0, left: 0 }}>
						<div style={{
							width     : 10,
							position  : "absolute",
							left      : 0,
							top       : 0,
							bottom    : 0,
							background: "linear-gradient(to top, #00d3a2 0%,#53c6db 33%,#ea8825 66%,#ef3817 100%)"
						}}></div>
						<div style={{ position: "absolute", top: 0, left: 20 }}>High&nbsp;(10)</div>
						<div style={{ position: "absolute", bottom: 0, left: 20 }}>Low&nbsp;(0)</div>
					</div>
					<div style={{
						width: "100%",
						color: riskColor
					}}>
						{Math.floor( risk )}
					</div>
				</div>


			</Form>
		);
	}
}


export default Form.create(
	{

		onFieldsChange: ( props, changedFields ) => {
			props.changeLocalConditions( changedFields );
		},

		mapPropsToFields: ( props ) => {
			return {
				traffic: {
					...props.site.localConditions.traffic,
					value: props.site.localConditions.traffic.value
				},
				weather: {
					...props.site.localConditions.weather,
					value: props.site.localConditions.weather.value
				},
			};
		},
	}
)( SiteConditionsEditor );
