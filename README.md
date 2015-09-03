This is entirely based on the work of https://github.com/potch
------------------------------------------------------------------------
Install:

	npm install flightinfo

------------------------------------------------------------------------
Usage example:

	var flight = require('./index.js');
	var async = require('async');
	
	flight.flightinfo('ARG1303',response)
	
	function response(result){
	    console.log('Status ' + result.status);
		  console.log('Departed ' + result.origin + ' at ' + result.departure);
		  console.log('Arrival ' + result.arrival + ' at ' + result.destination);     
		  console.log(result.progress);
	}
