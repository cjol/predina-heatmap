/**
 * Created by cjol on 03/02/17.
 */
import {TimePicker, Select, DatePicker, Form} from "antd";
import React, {Component} from "react";
import Nameplate from "./Nameplate";
import _ from "lodash";
import RiskMeter from "./RiskMeter";
const FormItem = Form.Item;

class Menu extends Component {
	static propTypes = {
		country               : React.PropTypes.object,
		activePoint           : React.PropTypes.object,
		changeGlobalConditions: React.PropTypes.func.isRequired,
	};

	render() {
		const { getFieldDecorator } = this.props.form;

		const placeSelector = <div>

			<h3>Region</h3>
			<Select
				style={{ flex: 1 }}
				allowClear
				onChange={( v ) => v ?
					this.props.setActivePoint( this.props.country.regions[ v ] ) :
					this.props.setActivePoint( this.props.country )}
			>
				{_.sortBy(_.values( this.props.country.regions ), 'name').map(
					r =>
						<Select.Option
							key={r.name}
							value={r.name}
						>{r.name} ({Math.floor(r.risk*10)})</Select.Option>
				)}
			</Select>

			<h3>City</h3>
			{ this.props.activePoint.region ?
				<Select
					onChange={( v ) => v ?
						this.props.setActivePoint( this.props.country.regions[ this.props.activePoint.region ].cities[ v ] ) :
						this.props.setActivePoint( this.props.country.regions[ this.props.activePoint.region ] )}
					allowClear
				>
					{_.sortBy(_.values( this.props.country.regions[ this.props.activePoint.region ].cities ), 'name').map(
						r =>
							<Select.Option
								key={r.name}
								value={r.name}
							>{r.name} ({Math.floor(r.risk*10)})</Select.Option>
					)}
				</Select>
				: <Select disabled/>}

			<h3>Account</h3>
			{ this.props.activePoint.region && this.props.activePoint.city ?
				<Select
					onChange={( v ) => v ?
						this.props.setActivePoint( this.props.country.regions[ this.props.activePoint.region ].cities[ this.props.activePoint.city ].accounts[ v ] ) :
						this.props.setActivePoint( this.props.country.regions[ this.props.activePoint.region ].cities[ this.props.activePoint.city ] )}
					allowClear
				>
					{_.sortBy(_.values( this.props.country.regions[ this.props.activePoint.region ].cities[ this.props.activePoint.city ].accounts, 'name') )
						.map(
							r =>
								<Select.Option
									key={r.name}
									value={r.name}
								>{r.name} ({Math.floor(r.risk * 10)})</Select.Option>
						)}
				</Select>
				: <Select disabled/>}

		</div>;

		const riskMeter = <RiskMeter style={{marginTop:30, marginBottom:30}}
		                             risk={this.props.activePoint.risk}/>;

		const conditions = <div>
			<h3>Date</h3>
			<FormItem
				>
				{getFieldDecorator(
					'date', {
						rules: [ { required: true, message: 'Please select a date!' } ],
					}
				)(
					<DatePicker style={{ width: "100%" }}/>
				)}
			</FormItem>

			<h3>Time</h3>
			<FormItem
				>
				{getFieldDecorator(
					'time', {
						rules   : [ { required: true, message: 'Please select a time!' } ],
						onChange: ( value ) => {
							// eslint-disable-next-line
							// const hours = value._d.getHours();
							// this.props.form.setFieldsValue(
							// {
							// night: hours > 19
							// }
							// );
						}
					}
				)(
					<TimePicker style={{ width: "100%" }} format={'HH:00'}/>
				)}
			</FormItem>

			{/*<FormItem*/}
			{/*label="Day/Night">*/}
			{/*{getFieldDecorator(*/}
			{/*'night', {*/}
			{/*rules: [ { required: true, message: 'Please select day/night!' } ],*/}
			{/*}*/}
			{/*)(*/}
			{/*<Select disabled>*/}
			{/*<Select.Option value="day">Day</Select.Option>*/}
			{/*<Select.Option value="night">Night</Select.Option>*/}
			{/*</Select>*/}
			{/*)}*/}
			{/*</FormItem>*/}
		</div>;

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

						{placeSelector}

						{riskMeter}

						{conditions}

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
				// night: {
				// 	...props.night,
				// 	value: props.night.value
				// },
				time: {
					...props.time,
					value: props.time.value
				},
				date: {
					...props.date,
					value: props.date.value
				},
			};
		},
	}
)( Menu );
