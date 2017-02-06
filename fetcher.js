/* Magic Mirror
 * Fetcher
 *
 * From Michael Teeuw http://michaelteeuw.nl
 * modified for mmm_velib
 * MIT Licensed.
 */

var request = require("request");
var iconv = require("iconv-lite");

/* Fetcher
 * Responsible for requesting an update on the set interval and broadcasting the data.
 *
 * attribute url string - URL of the news feed.
 * attribute reloadInterval number - Reload interval in milliseconds.
 */

var Fetcher = function(url, reloadInterval, encoding) {
	console.log(url);
	var startedTime = (new Date).getTime();
	var self = this;
	if (reloadInterval < 60000) { 
		// Since Velib updates its system every minute, 
		//no need to pool faster than that
		// We do NOT advice to pool that fast. 
		reloadInterval = 60000;
	}

	var reloadTimer = null;
	var results;

	var fetchFailedCallback = function() {};
	var itemsReceivedCallback = function() {};

	/* private methods */

	/* fetchNews()
	 * Request the new items.
	 */

	var fetchNews = function() {
		clearTimeout(reloadTimer); //why clearing the timeour before starting an internet request ? 
		reloadTimer = null;
		console.log("*******  fetch Cyclocity data **** "+((new Date).getTime()-startedTime)/1000);
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body) 
				results = JSON.parse(body);
				// manage results
				console.log("results "+results);
				/*items = Object.keys(jsonResult).map(function(k) {
					return jsonResult[k]
				});*/
				self.broadcastItems();
				scheduleTimer();
			} else {
				console.log("error : "+response.statusCode);
				fetchFailedCallback(self, error);
				scheduleTimer();
			}
		})
/*
		var xmlHttp = new XMLHttpRequest();
		var responseText;
		xmlHttp.onreadystatechange = function() {
			console.log("getNewStatus onreadystatuschange : " + xmlHttp.status);
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				responseText = xmlHttp.responseText;
				console.log("responseText = " + responseText);
				if (responseText == null || responseText === undefined) {} else {
					jsonResult = JSON.parse(responseText);
					// manage results
					items = Object.keys(jsonResult).map(function(k) { return jsonResult[k] });
					self.broadcastItems();
					scheduleTimer();
				}
			} else if (xmlHttp.readyState == 4 && xmlHttp.status == 403) {
				// API key issue most probably 
				console.log("getNewStatus xmlHttp.status : " + xmlHttp.status);
				fetchFailedCallback(self, error);
				scheduleTimer();
			}
		}
		xmlHttp.open("GET", called_url, true);
		xmlHttp.send(null);*/


	};

	/* scheduleTimer()
	 * Schedule the timer for the next update.
	 */

	var scheduleTimer = function() {
		//console.log('Schedule update timer.');
		clearTimeout(reloadTimer);
		reloadTimer = setTimeout(function() {
			fetchNews();
		}, reloadInterval);
	};

	/* public methods */

	/* setReloadInterval()
	 * Update the reload interval, but only if we need to increase the speed.
	 *
	 * attribute interval number - Interval for the update in milliseconds.
	 */
	this.setReloadInterval = function(interval) {
		if (interval > 60000 && interval < reloadInterval) {
			reloadInterval = interval;
		}
	};

	/* startFetch()
	 * Initiate fetchNews();
	 */
	this.startFetch = function() {
		fetchNews();
	};

	/* broadcastItems()
	 * Broadcast the existing items.
	 */
	this.broadcastItems = function() {
		if (results === undefined) {
			console.log('No items to broadcast yet.');
			return;
		}
		console.log('Broadcasting ' + results);
		itemsReceivedCallback(self);
	};

	this.onReceive = function(callback) {
		itemsReceivedCallback = callback;
	};

	this.onError = function(callback) {
		fetchFailedCallback = callback;
	};

	this.url = function() {
		return url;
	};

	this.items = function() {
		return results;
	};
};

module.exports = Fetcher;