// server/app.js
import morgan from "morgan";
import express from "express";
import path from "path";
import api from "./api";
import data from "."

const app = express();

// Setup logger
app.use(
	morgan(
		':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
	)
);

// Serve static assets
app.use( express.static( path.resolve( __dirname, '..', 'build' ) ) );

// Serve the API
app.get( '/api/locations', api.locations );
app.get( '/api/cluster', api.cluster );

// Always return the main index.html, so react-router render the route in the client
app.get(
	'*', ( req, res ) => {
		res.sendFile( path.resolve( __dirname, '..', 'build', 'index.html' ) );
	}
);

module.exports = app;
