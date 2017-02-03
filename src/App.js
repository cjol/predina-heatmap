import React, {Component} from "react";
import HeatMap from './HeatMap';
import Menu from './Menu';
import "./App.css";
import 'antd/dist/antd.css';
import { LocaleProvider } from 'antd';
import enGB from 'antd/lib/locale-provider/en_US';
import moment from 'moment';
import 'moment/locale/en-gb';

moment.locale('en-gb');

class App extends Component {
	render() {
		return (
			<LocaleProvider locale={enGB}>
				<div className="App">
					<HeatMap />
					<Menu />
				</div>
			</LocaleProvider>
		);
	}
}

export default App;
