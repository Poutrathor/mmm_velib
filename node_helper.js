/* Magic Mirror
 * Node Helper: mmm_velib
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * modified for mmm_velib
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var validUrl = require("valid-url");
var Fetcher = require("./fetcher.js");

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		// console.log("Starting module: " + this.name);
		this.fetchers = [];
	},

	// Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "ADD_VELIB_STATUS") {
			this.createFetcher(payload.station, payload.config);
			return;
		}
	},

	/* createFetcher(station, reloadInterval)
	 * Creates a fetcher for a new station if it doesn't exist yet.
	 * Otherwise it reuses the existing one.
	 *
	 * attribute url string - URL from the station's number + contract.
	 * attribute reloadInterval number - Reload interval in milliseconds.
	 */

	createFetcher: function(station, config) {
		var self = this;

		// var url = feed.url || "";

		var url = "https://api.jcdecaux.com/vls/v1/stations/" + station.number
			+ "?contract=" + station.contract + "&apiKey=23cdea4379b6931b2b406ccd9f1c2aa9f9352f0c";

		var encoding = "UTF-8";
		var reloadInterval = config.reloadInterval || 5 * 60 * 1000;

		if (!validUrl.isUri(url)) {
			self.sendSocketNotification("INCORRECT_URL", url);
			return;
		}

		var fetcher;
		if (typeof self.fetchers[url] === "undefined") {
			// console.log("Create new news fetcher for url: " + url + " - Interval: " + reloadInterval);
			fetcher = new Fetcher(url, reloadInterval, encoding);

			fetcher.onReceive(function(fetcher) {
				self.broadcastFeeds();
			});

			fetcher.onError(function(fetcher, error) {
				self.sendSocketNotification("FETCH_ERROR", {
					url: fetcher.url(),
					error: error
				});
			});

			self.fetchers[url] = fetcher;
		} else {
			// console.log("Use existing news fetcher for url: " + url);
			fetcher = self.fetchers[url];
			fetcher.setReloadInterval(reloadInterval);
			fetcher.broadcastItems();
		}

		fetcher.startFetch();
	},

	/* broadcastFeeds()
	 * Creates an object with all feed items of the different registered feeds,
	 * and broadcasts these using sendSocketNotification.
	 */
	broadcastFeeds: function() {
		// console.log("broadcastFeeds");
		var feeds = {};
		for (var f in this.fetchers) {
			feeds[f] = this.fetchers[f].items();
			// console.log("the first station status fetched is "+ JSON.stringify(feeds[f]));
			// console.log("f is = "+f);
		}
		this.sendSocketNotification("VELIB_STATUS", feeds);

	}
});
