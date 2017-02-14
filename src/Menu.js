/**
 * Created by cjol on 03/02/17.
 */
import {TimePicker, Select, DatePicker, Button, Form} from "antd";
import React, {Component} from "react";
import Nameplate from "./Nameplate";
const FormItem = Form.Item;

class Menu extends Component {
	static propTypes = {
		sites                 : React.PropTypes.arrayOf(
			React.PropTypes.shape(
				{
					id  : React.PropTypes.string.isRequired,
					name: React.PropTypes.string.isRequired
				}
			)
		).isRequired,
		changeGlobalConditions: React.PropTypes.func.isRequired,
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div style={{
				padding        : 10,
				width          : 300,
				height         : "100%",
				backgroundColor: "white",
				position       : "absolute",
				textAlign      : "left",
				boxShadow      : "0 0 10px 3px rgba(0,0,0,0.5)"
			}}>
				<Form
					style={{ position: "relative", height: "100%" }}
				>

					{/* TOP PORTION */}
					<div style={{
						left    : 0,
						right   : 0,
						top     : 0,
						position: "absolute"
					}}>
						<Nameplate />

						<h2
						style={{
							paddingTop:10
						}}>
							{this.props.activeSite.name}
						</h2>
						{this.props.activeSite.parent ?
							<Button onClick={this.props.goUpLevel}>Go Back</Button>
							:
							<div/>}

						<FormItem
							style={{
								paddingTop:10
							}}
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
									rules   : [ { required: true, message: 'Please select a time!' } ],
									onChange: ( value ) => {
										// eslint-disable-next-line
										const hours = value._d.getHours();
										this.props.form.setFieldsValue(
											{
												daynight: hours > 19 ? "night" : "day"
											}
										);
									}
								}
							)(
								<TimePicker style={{ width: "100%" }}/>
							)}
						</FormItem>

						<FormItem
							label="Day/Night">
							{getFieldDecorator(
								'daynight', {
									rules: [ { required: true, message: 'Please select day/night!' } ],
								}
							)(
								<Select disabled>
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
			props.changeGlobalConditions( changedFields );
		},

		mapPropsToFields: ( props ) => {
			return {
				daynight: {
					...props.daynight,
					value: props.daynight.value
				},
				time    : {
					...props.time,
					value: props.time.value
				},
				date    : {
					...props.date,
					value: props.date.value
				},
			};
		},
	}
)( Menu );
