/**
 * Created by christoph on 08/02/17.
 */
import React from "react";
import {Button, Form, Select, InputNumber} from "antd";
import Site from "./Site";
import RiskMeter from "./RiskMeter";
import axios from "axios";
const FormItem = Form.Item;

class SiteConditionsEditor extends React.Component {
	static propTypes = {
		form                 : React.PropTypes.object,
		weather              : React.PropTypes.shape( { value: React.PropTypes.string } ),
		changeLocalConditions: React.PropTypes.func,
		site                 : Site.ReactType
	};

	getLiveConditions = async( { latitude, longitude } ) => {
		const values = (await axios.get( `http://amey.predina.com/api/weather?lat=${latitude}&lng=${longitude}` ));
		if (values.status !== 200) return alert( "Could not connect to weather API" );

		this.props.form.setFieldsValue(
			{
				visibility : Math.floor( values.data.visibility ),
				temperature: Math.floor( values.data.temperature ),
				windspeed  : Math.floor( values.data.windSpeed ),
				weather_summary  : values.data.summary,
			}
		);
		this.props.hide();
	};

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<Form style={{ minWidth: 200 }}>
				<h1>{this.props.site.name}</h1>

				<RiskMeter risk={this.props.site.risk}/>

				<div style={{ textAlign: "center" }}>
					<Button onClick={() => this.getLiveConditions( this.props.site )}
					        style={{ marginTop: 10 }}
					        size="large"
					        type="primary">
						Get Live Conditions</Button>
				</div>

				{this.props.site.conditions ?
					<FormItem
						label="Weather">
						{getFieldDecorator(
							'weather_summary', {
								rules: [ { required: true, message: 'Please select the weather at the point!' } ],
							}
						)(
							<Select>
								<Select.Option value="Breezy">Breezy</Select.Option>
								<Select.Option value="Breezy and Mostly Cloudy">Breezy and Mostly Cloudy</Select.Option>
								<Select.Option value="Breezy and Overcast">Breezy and Overcast</Select.Option>
								<Select.Option value="Breezy and Partly Cloudy">Breezy and Partly Cloudy</Select.Option>
								<Select.Option value="Clear">Clear</Select.Option>
								<Select.Option value="Drizzle">Drizzle</Select.Option>
								<Select.Option value="Drizzle and Windy">Drizzle and Windy</Select.Option>
								<Select.Option value="Foggy">Foggy</Select.Option>
								<Select.Option value="Heavy Rain">Heavy Rain</Select.Option>
								<Select.Option value="Heavy Rain and Breezy">Heavy Rain and Breezy</Select.Option>
								<Select.Option value="Light Rain">Light Rain</Select.Option>
								<Select.Option value="Mostly Cloudy">Mostly Cloudy</Select.Option>
								<Select.Option value="Overcast">Overcast</Select.Option>
								<Select.Option value="Partly Cloudy">Partly Cloudy</Select.Option>
								<Select.Option value="Rain">Rain</Select.Option>
								<Select.Option value="Windy">Windy</Select.Option>
								<Select.Option value="Windy and Mostly Cloudy">Windy and Mostly Cloudy</Select.Option>
								<Select.Option value="Windy and Overcast">Windy and Overcast</Select.Option>
								<Select.Option value="Windy and Partly Cloudy">Windy and Partly Cloudy</Select.Option>
							</Select>
						)}
					</FormItem>
					: <div />}

				{this.props.site.conditions ?
					<FormItem
						label="Visibility">
						{getFieldDecorator(
							'visibility', {
								rules: [ { required: true, message: 'Please select the visibility at this city!' } ],
							}
						)(
							<InputNumber style={{width:"100%"}}/>
						)}
					</FormItem>
					: <div />}

				{this.props.site.conditions ?
					<FormItem
						label="Wind Speed">
						{getFieldDecorator(
							'windspeed', {
								rules: [ { required: true, message: 'Please select the windspeed at this city!' } ],
							}
						)(
							<InputNumber style={{width:"100%"}}/>
						)}
					</FormItem>
					: <div />}

				{this.props.site.conditions ?
					<FormItem
						label="Temperature">
						{getFieldDecorator(
							'temperature', {
								rules: [ { required: true, message: 'Please select the temperature at this city!' } ],
							}
						)(
							<InputNumber style={{width:"100%"}}/>
						)}
					</FormItem>
					: <div />}

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
			if (!props.site.conditions) return {
				weather_summary: {},
				temperature    : {},
				visibility     : {},
				windspeed      : {},
			};
			return {
				temperature    : {
					...props.site.conditions.temperature,
					value: props.site.conditions.temperature.value
				},
				windspeed      : {
					...props.site.conditions.windspeed,
					value: props.site.conditions.windspeed.value
				},
				visibility     : {
					...props.site.conditions.visibility,
					value: props.site.conditions.visibility.value
				},
				weather_summary: {
					...props.site.conditions.weather_summary,
					value: props.site.conditions.weather_summary.value
				},
			};
		},
	}
)( SiteConditionsEditor );
