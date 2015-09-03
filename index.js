var origin;
var destination;
var times;
var departure;
var arrival;
var status;
var progress;
var progress2;
//
var request = require('request');
var cheerio = require('cheerio');
var opts = require("nomnom").parse();
var chalk = require('chalk');

var flightinfo = function(flight,callback)
{
	var result = {
	'origin': origin,
	'destination': destination,
	'status' : status,
	'arrival':arrival,
	'departure':departure,
	'progress': progress,
	};
	
	var alias = {
	  'UA': 'UAL',
	  'United': 'UAL',
	  'UAL': 'UAL',
	  'Delta': 'DAL'
	};

	var airline = flight;
	var number = '';
	if (!number) {
	  matches = airline.match(/([a-zA-Z]+)(\d+)/);
	  if (matches) {
	    airline = matches[1];
	    number = matches[2];
	  }
	}
	if (airline in alias) {
	  airline = alias[airline];
	}

	function print(s) {
	  s = s || '';
	  process.stdout.write(s);
	}

	function println(s) {
	  s = s || '';
	  print(s + '\n');
	}

	//var code = airline + number;
	var code = flight;

	request('http://flightaware.com/live/flight/' + code, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    $ = cheerio.load(body);

	    var data = {};

	    var table = $('.track-panel-data');
	    var trs = table.find('tr');
	    trs.each(function (i) {
	      var header = trs.eq(i).find('th').text().trim().toLowerCase();
	      var val = trs.eq(i).find('td').contents().first().text().trim();
	      data[header] = val;
	    });

	    origin = $('.track-panel-departure .hint').attr('title');
	    destination = $('.track-panel-arrival .hint').attr('title');
	    times = $('.track-panel-actualtime');
	    departure = times.eq(0);
	    if (departure.children().first().hasClass('flightStatusGood')) {
	      departure = chalk.green(departure.text().trim());
	    } else {
	      departure = chalk.red(departure.text().trim());
	    }
	    arrival = times.eq(1);
	    if (arrival.children().first().hasClass('flightStatusGood')) {
	      arrival = chalk.green(arrival.text().trim());
	    } else {
	      arrival = chalk.red(arrival.text().trim());
	    }

	    data.status = data.status.replace(/\([^\)]*$/, '');


	    var progress = $('.track-panel-progress');
	    if (progress.length) {
	      var elapsed = $('.track-panel-progress-fill').text().trim() || $('.track-panel-progress-label').text().trim();
	      var remaining = $('.track-panel-progress-empty').text().trim() || $('.track-panel-progress-label').text().trim();
	      var pct = $('.track-panel-progress-fill').css('width');
	      pct = parseInt(pct, 10) | 0;
	      var cols = process.stdout.columns - 5;
	      var wid = (pct / 100) * cols | 0;
	      var rem = cols - wid;
	      progress2 = ' [';
	      progress2 = progress2 + Array(wid+1).join('-');
	      progress2 = progress2 + '>';
	      progress2 = progress2 + Array(rem+1).join(' ');
	      progress2 = progress2 + ']';
	      var time = elapsed + ' elapsed, ' + remaining + ' left';
	      var ctr = (process.stdout.columns - time.length) / 2 | 0;
	      progress2 = progress2 + Array(ctr).join(' ');
	      progress = progress2 + " " + time;
	    }
	    
	    result.status = data.status;
	    result.departure = departure;
	    result.origin = origin;
	    result.arrival = arrival;
	    result.destination = destination;
	    result.progress = progress;
	    result.progress2 = progress2;
	    callback(result);
	  } 
	  else 
	  {
	    return response.statusCode;
	  }
	});
}

var arriv = function(){
    console.log( "Origin " + origin);
    console.log("Desintation " + destination);
}

module.exports.flightinfo = flightinfo;
