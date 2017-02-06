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
 * attribute url string - URL calling the API with the station number and the contract name.
 * attribute reloadInterval number - Polling interval in milliseconds.
 */
var Fetcher = function(url, reloadInterval, encoding) {
	// console.log(url);
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

	/* fetchStationData()
	 * Request the last updated data for that station .
	 */

	var fetchStationData = function() {
		clearTimeout(reloadTimer); //why clearing the timeour before starting an internet request ? 
		reloadTimer = null;
		// console.log("*******  fetch Cyclocity data **** "+((new Date).getTime()-startedTime)/1000);
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				// console.log(body) 
				results = JSON.parse(body);
				// manage results
				// console.log("results "+results);
				/*items = Object.keys(jsonResult).map(function(k) {
					return jsonResult[k]
				});*/
				self.broadcastItems();
				scheduleTimer();
			} else {
				// console.log("error : "+response.statusCode);
				fetchFailedCallback(self, error);
				scheduleTimer();
			}
		})

	};

	/* scheduleTimer()
	 * Schedule the timer for the next update.
	 */

	var scheduleTimer = function() {
		//// console.log('Schedule update timer.');
		clearTimeout(reloadTimer);
		reloadTimer = setTimeout(function() {
			fetchStationData();
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
	 * Initiate fetchStationData();
	 */
	this.startFetch = function() {
		fetchStationData();
	};

	/* broadcastItems()
	 * Broadcast the existing items.
	 */
	this.broadcastItems = function() {
		if (results === undefined) {
			// console.log('No items to broadcast yet.');
			return;
		}
		// console.log('Broadcasting ' + results);
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