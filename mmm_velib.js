/* global Module */

/* Magic Mirror
 * Module: Velib
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("mmm_velib", {

	// Default module config.
	defaults: {

		stations: [{
					nom: "mulhouse",
					number: "11",
					contract: "mulhouse"
				},{ 
					nom: "Place Bir Hakeim", 
					number: "3039",
					contract: "lyon"
				}

		],
		showAvailableBikes: true,
		showAvailableSlots: true,
		showLastCheckTime: true,
		reloadInterval: 5 * 60 * 1000, // Every 5 mins.
		nervouslyUpdateIntervale: true, // if less than 5 bikes available, check every minute // TODO eventually
		/*animationSpeed: 2.5 * 1000,*/
		maxStationsDisplayed: 0, // 0 for unlimited
		updateInterval: 60 * 1000 // Screen refreshing for past time indication

	},

	// Define required scripts.
	getStyles: function() {
		return ["mmm_velib.css", "font-awesome.css"];
	},

	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define required translations.
	getTranslations: function() {
		// The translations for the defaut modules are defined in the core translation files.
		// Therefor we can just return false. Otherwise we should have returned a dictionairy.
		// If you're trying to build yiur own module including translations, check out the documentation.
		return false;
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		// Set locale.
		moment.locale(config.language);

		this.stationsData = [];
		this.loaded = false;

		this.registerStations();

	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		Log.info("notification received " + notification);
		if (notification === "VELIB_STATUS") {
			this.generateStationDataFeed(payload);
			

		} else if (notification === "FETCH_ERROR") {
			Log.error("mmm_velib Error. Could not fetch JCDeceaux API results: " + payload.url);
		} else if (notification === "INCORRECT_URL") {
			Log.error("mmm_velib Error. Incorrect url : " + payload.url + "  -- Are the stations data properly configurated ?");
		} else {
			Log.log("mmm_velib received an unknown socket notification: " + notification);
		}
		if (!this.loaded) {
			this.scheduleUpdateInterval();
		}
		this.updateDom(); // update right when we got updated data but does not start again the interval updating

		this.loaded = true;

	},

	// Override dom generator.
	getDom: function() {

		Log.info("getDom");

		var wrapper = document.createElement("table");
		wrapper.className = "small";
		// Module Main City : 
		if (this.stationsData.length > 0) {
			Log.log("getDom - displaying a caption for contract : " + this.stationsData[0].contract_name);
			// Hypothesis : users will track bikes in only one city, no more. 
			// Thus, first station contract name is good enough :
			var marque = "";
			switch (this.stationsData[0].contract_name.toUpperCase()) { 
				// http://stackoverflow.com/questions/2140627/javascript-case-insensitive-string-comparison 
				// WARNING : can have issue if internalisation (one day) matters. 
				case "PARIS":
					marque = "Velib'";
					break;
				case "LYON":
					marque = "Vélo'v";
					break;
				case "MULHOUSE":
					marque = "VéloCité";
					break;
				case "BESANCON":
					marque = "VéloCité";
					break;
				case "MARSEILLE":
					marque = "Le vélo";
					break;
				case "TOULOUSE":
					marque = "VélôToulouse";
					break;
				case "ROUEN":
					marque = "Cy'clic";
					break;
				case "AMIENS":
					marque = "Velib";
					break;
				case "NANTES":
					marque = "Bicloo";
					break;
				case "NANCY":
					marque = "vélOstan'lib";
					break;
				case "CERGY-PONTOISE":
					marque = "VélO2";
					break;
				case "PLAINE-COMMUNE":
					marque = "Velcom";
					break;
				case "CRETEIL":
					marque = "Cristolib";
					break;
				default:
					marque = "Cyclocity";
					break;
			}
			var caption = document.createElement("caption");
			caption.innerHTML = marque;
			wrapper.appendChild(caption);


		}

		// Module Title : "Velib : velo + slots" : 
		var titleWrapper = document.createElement("tr");
		var stationCode = document.createElement("th");
		stationCode.className = "station_name";
		stationCode.innerHTML = "Station";
		titleWrapper.appendChild(stationCode);

		if (this.config.showAvailableBikes) {

			var freeBikes = document.createElement("th");
			freeBikes.className = "title";
			freeBikes.innerHTML = "Vélos";
			titleWrapper.appendChild(freeBikes);

		}

		if (this.config.showAvailableSlots) {
			var freeSlots = document.createElement("th");
			freeSlots.className = "title";
			freeSlots.innerHTML = "Places";
			titleWrapper.appendChild(freeSlots);
		}

		if (this.config.showLastCheckTime) {
			var lastUpdate = document.createElement("th");
			lastUpdate.className = "time";
			lastUpdate.innerHTML = "il y a";
			titleWrapper.appendChild(lastUpdate);
		}

		titleWrapper.className = "normal";
		wrapper.appendChild(titleWrapper);
		/*
		var velibTitle = document.createElement("div");
		velibTitle.className = "bright medium light";
		velibTitle.innerHTML = "Velib : ";
		wrapper.appendChild(velibTitle);*/

		if (this.stationsData.length > 0) {

			Log.info("this.stationsData.length > 0");

			//for (n = 0; n < this.stationsData.length; n++) {
			for (var n in this.stationsData) {

				var stationState = document.createElement("tr");
				stationState.className = "normal";

				var name = document.createElement("td");
				name.className = "station_name bright";
				name.innerHTML = this.stationsData[n].name;
				stationState.appendChild(name);

				if (this.config.showAvailableBikes) {
					var bikesCount = document.createElement("td");
					bikesCount.className = "chiffre bright";
					bikesCount.innerHTML = this.stationsData[n].available_bikes;
					stationState.appendChild(bikesCount);
				}
				if (this.config.showAvailableSlots) {
					var slotCount = document.createElement("td");
					slotCount.className = "chiffre bright";
					slotCount.innerHTML = this.stationsData[n].available_bike_stands;
					stationState.appendChild(slotCount);
				}
				if (this.config.showLastCheckTime) {
					var updtTime = document.createElement("td");
					updtTime.className = "time";
					updtTime.innerHTML = this.getTimeSinceLastUpdate(this.stationsData[n].last_update);
					stationState.appendChild(updtTime);
				}

				Log.info("updated");

				wrapper.appendChild(stationState);
			}

		} else {

			Log.info("LOADING");
			wrapper.innerHTML = this.translate("LOADING");
			// wrapper.className = "small dimmed";
		}

		return wrapper;
	},
	/* registerStations()
	 * registers the stations to be polled by the backend.
	 */
	registerStations: function() {
		for (var f in this.config.stations) {
			var station = this.config.stations[f];
			this.sendSocketNotification("ADD_VELIB_STATUS", {
				station: station,
				config: this.config
			});
		}
	},

	/* generateStationDataFeed()
	 * Generate an ordered list of stations' data for this configured module.
	 *
	 * attribute stations object - An object with feeds returned by the nod helper.
	 */
	generateStationDataFeed: function(array_json_status) {
		var stationsData = [];
		for (var n in array_json_status) {
			Log.info("var n in array_json_status : n = " + n);
			stationsData.push(array_json_status[n]);
		}
		Log.info("generateStationDataFeed - stations : " + JSON.stringify(stationsData[0]));
		Log.info("stationsData[0] - name : " + stationsData[0].name);

		stationsData.sort(function(a, b) {

			return a.number - b.number;
		});
		if (this.config.maxStationsDisplayed > 0) {
			stationsData = stationsData.slice(0, this.config.maxStationsDisplayed);
		}
		this.stationsData = stationsData;
		Log.info("this.stationsData[0] - name : " + this.stationsData[0].available_bikes);
		Log.info("there are " + this.stationsData.length + " stations");
	},

	/* followThatStation(feedUrl)
	 * Check if this module is configured to show this feed.
	 *
	 * attribute feedUrl string - Url of the feed to check.
	 *
	 * returns bool
	 */
	followThatStation: function(stationNumber, stationContract) {
		for (var f in this.config.stations) {
			var station = this.config.stations[f];
			if (station.number === stationNumber && station.contract === stationContract) {
				return true;
			}
		}
		return false;
	},

	/* titleForFeed(feedUrl)
	 * Returns title for a specific feed Url.
	 *
	 * attribute feedUrl string - Url of the feed to check.
	 *
	 * returns string
	 */
	titleForFeed: function(stationName) {
		for (var f in this.config.stations) {
			var station = this.config.stations[f];
			if (station.name === stationName) {
				return station.name || "";
			}
		}
		return "";
	},

	/* scheduleUpdateInterval()
	 * Schedule visual update.
	 */
	scheduleUpdateInterval: function() {
		var self = this;

		// self.updateDom(self.config.animationSpeed);
		self.updateDom(0);

		setInterval(function() {
			// self.updateDom(self.config.animationSpeed);
			self.updateDom();
		}, this.config.updateInterval);
	},

	/* capitalizeFirstLetter(string)
	 * Capitalizes the first character of a string.
	 *
	 * argument string string - Input string.
	 *
	 * return string - Capitalized output string.
	 */
	capitalizeFirstLetter: function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	/*
		Get Time since last update timestamp : 
	*/
	getTimeSinceLastUpdate: function(t) {
		var milliseconds = (new Date).getTime();
		var min = (milliseconds - t) / 1000 / 60;
		if (min < 1) return "now";
		else return Math.floor(min).toString() + " min";
	},

	/* 
		Get time since last updates with seconds. for testing only :
		it allows us to check easily that refreshing the displayed data is  occuring as expected. 
		*/
	getTimeSinceLastUpdateSeconds: function(t) {
		var milliseconds = (new Date).getTime();
		var min = (milliseconds - t) / 1000 / 60;
		var secs = (milliseconds - t)/ 1000;
		return Math.floor(min).toString() + " min " + Math.floor(secs).toString()%60 + "s";
		
	}

});