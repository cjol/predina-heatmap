/**
 * Created by cjol on 03/02/17.
 */
import {TimePicker, Button, Select, DatePicker, Form} from "antd";
import React, {Component} from "react";
import Nameplate from "./Nameplate";
import xolor from "xolor";
const FormItem = Form.Item;

class Menu extends Component {
	static propTypes = {
		sites: React.PropTypes.arrayOf(
			React.PropTypes.shape(
				{
					id: React.PropTypes.string.isRequired,
					name: React.PropTypes.string.isRequired
				}
			)
		).isRequired,
		onChange: React.PropTypes.func.isRequired,
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const gradientColor = xolor( '#00d3a2' );
		const riskColor =
			gradientColor.gradient( '#ef3817', this.props.risk / 10 );
// "linear-gradient(to top, #00d3a2 0%,#53c6db 33%,#ea8825 66%,#ef3817 100%)"
		return (
			<div style={{
				padding: 10,
				width: 300,
				height: "100%",
				backgroundColor: "white",
				position: "absolute",
				textAlign: "left",
				boxShadow: "0 0 10px 3px rgba(0,0,0,0.5)"
			}}>

				<Form
					style={{ position: "relative", height: "100%" }}
				>

					{/* TOP PORTION */}
					<div style={{
						left: 0,
						right: 0,
						top: 0,
						position: "absolute"
					}}>
						<Nameplate />

						<FormItem
							label="Site Name">
							{getFieldDecorator(
								'site', {
									rules: [ { required: false } ],
								}
							)(
								<Select>
									{this.props.sites.map(
										( s, i ) =>
											<Select.Option value={s.id} key={s.id}>{s.name}</Select.Option>
									)}
								</Select>
							)}
						</FormItem>

						<Button size="large" style={{ width: "100%" }} type="primary"
						        onClick={this.props.getLiveConditions}>
							Get Live Conditions
						</Button>

						<div style={{textAlign: "center", fontSize:"150%", marginTop:20, clear:"both", width:"100%"}}>
							Risk Score
						</div>
						<div className="riskNumber">
							<div style={{position:"absolute", fontSize: "100%", top:0, bottom:0, left:0}}>
								<div style={{width:10, position:"absolute", left:0, top:0, bottom:0, background: "linear-gradient(to top, #00d3a2 0%,#53c6db 33%,#ea8825 66%,#ef3817 100%)"}}></div>
								<div style={{position:"absolute", top:0, left:20}}>High (10)</div>
								<div style={{position:"absolute", bottom:0, left:20}}>Low (0)</div>
							</div>
							<div style={{
								width: "100%",
								color: riskColor
							}}>
								{this.props.risk}
							</div>
						</div>
					</div>


					{/* BOTTOM PORTION */}
					<div style={{
						left: 0,
						right: 0,
						bottom: 0,
						position: "absolute"
					}}>

						<FormItem
							label="Date">
							{getFieldDecorator(
								'date', {
									rules: [ { required: true, message: 'Please select a date!' } ],
								}
							)(
								<DatePicker style={{ width: "100%" }}/>
							)}
						</FormItem>

						<FormItem
							label="Time">
							{getFieldDecorator(
								'time', {
									rules: [ { required: true, message: 'Please select a time!' } ],
								}
							)(
								<TimePicker style={{ width: "100%" }}/>
							)}
						</FormItem>

						<FormItem
							label="Traffic Flow">
							{getFieldDecorator(
								'traffic', {
									rules: [ { required: true, message: 'Please select a traffic flow!' } ],
								}
							)(
								<Select>
									<Select.Option value="1">Low</Select.Option>
									<Select.Option value="2">Medium</Select.Option>
									<Select.Option value="3">High</Select.Option>
								</Select>
							)}
						</FormItem>

						<FormItem
							label="Weather">
							{getFieldDecorator(
								'weather', {
									rules: [ { required: true, message: 'Please select weather!' } ],
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
							label="Day/Night">
							{getFieldDecorator(
								'daynight', {
									rules: [ { required: true, message: 'Please select day/night!' } ],
								}
							)(
								<Select>
									<Select.Option value="day">Day</Select.Option>
									<Select.Option value="night">Night</Select.Option>
								</Select>
							)}
						</FormItem>
					</div>

				</Form>
			</div>
		);
	}
}

export default Form.create(
	{

		onFieldsChange: ( props, changedFields ) => {
			if ("site" in changedFields) {
				changedFields.site.value = props.sites.find(
					s => s.id === changedFields.site.value
				);
			}
			props.onChange( changedFields );
		},

		mapPropsToFields: ( props ) => {
			return {
				traffic: {
					...props.traffic,
					value: props.traffic.value
				},
				weather: {
					...props.weather,
					value: props.weather.value
				},
				daynight: {
					...props.daynight,
					value: props.daynight.value
				},
				time: {
					...props.time,
					value: props.time.value
				},
				date: {
					...props.date,
					value: props.date.value
				},
				site: {
					...props.site,
					value: props.site.value.id
				},
			};
		},
	}
)( Menu );
