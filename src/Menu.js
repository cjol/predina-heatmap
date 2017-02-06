/**
 * Created by cjol on 03/02/17.
 */
import {TimePicker, Select, Button, DatePicker, Form} from "antd";
import React, {Component} from "react";
import moment from "moment";
import Nameplate from "./Nameplate";
const FormItem = Form.Item;

const siteType = React.PropTypes.shape(
	{
		lat: React.PropTypes.number,
		lng: React.PropTypes.number,
		id: React.PropTypes.string,
		name: React.PropTypes.string,
		risk: React.PropTypes.number
	}
);
class Menu extends Component {
	static propTypes = {
		sites: React.PropTypes.arrayOf(
			siteType
		),
		activeSite: siteType,
		setSite: React.PropTypes.func
	};

	static defaultProps = {};

	getLiveConditions = () => {
		console.log( "TBC" );
	};

	handleSubmit( e ) {
		e.preventDefault();
		this.props.form.validateFields(
			( err, values ) => {
				if (!err) {
					console.log( 'Received values of form: ', values );
				}
			}
		);
	}

	render() {
		const { getFieldDecorator } = this.props.form;
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

				<Form onSubmit={this.handleSubmit}
				      horizontal={true}
				      vertical={false}
				      style={{ position: "relative", height: "100%" }}
				>

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
								<Select onChange={(e) => console.log(arguments) || this.props.setSite(this.props.sites.filter(s => s.id===e)[0])} >
									{this.props.sites.map(
										(s,i) =>
											<Select.Option value={s.id} key={i} >{s.name}</Select.Option>
									)}
								</Select>
							)}
						</FormItem>

						<Button size="large" style={{ width: "100%" }} type="primary" onClick={this.getLiveConditions}>
							Get Live Conditions
						</Button>
					</div>

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
									initialValue: moment()
								}
							)(
								<DatePicker style={{
									width: "100%"
								}}
								/>
							)}
						</FormItem>

						<FormItem
							label="Time">
							{getFieldDecorator(
								'time', {
									rules: [ { required: true, message: 'Please select a date!' } ],
									initialValue: moment()
								}
							)(
								<TimePicker style={{
									width: "100%"
								}}/>
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
									<Select.Option value="snowy">Snowy</Select.Option>
								</Select>
							)}
						</FormItem>

						<FormItem
							label="Day/Night">
							{getFieldDecorator(
								'day', {
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

export default Form.create()( Menu );
