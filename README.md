# Module: mmm_velib
The `Velib` module is displaying the stations data from JCDeceaux's bike sharing system. 
Depending on the configurated stations, the user can see : 
 - available bikes
 - available slots
 - how long ago was this information updated

It is compatible with the following cities // Il est compatible avec les villes suivantes : 
https://fr.wikipedia.org/wiki/Cyclocity#Services_en_fonction 

It has been tested for // Le module a été testé pour : 

 - Paris, Lyon, Mulhouse, Toulouse. 
 
For others cities, it should work aswell, in case of unexpected issue, ask for my help at the MagicMirror Forum, link below // Pour les autres villes non vérifiées, le fonctionnement devrait être le même, en cas de bug, contacter-moi sur le forum MagicMirror ici : 

https://forum.magicmirror.builders/category/10/troubleshooting 

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'mmm_velib',
		position: 'top_right',	// This can be any of the regions. 
		config: {
			// The config property is NOT optional.
			// Else, if no config is set, 2 stations from the center of Paris will be displayed
			// See 'Configuration options' for more information.

			stations: [{
					nom: "home - rue Obama", // the name of the station is irrelevant for the module which use CylcoCity reference naming. 
					number: "11", // That's the IMPORTANT identifier : you can find the number of your stations on the web and mobile map for each city. 
					contract: "mulhouse" // That's AS IMPORTANT AS the *number* above. Velib' is "paris", VélôToulouse is "toulouse", etc. 
				},{ 
					nom: "Place Bir Hakeim", // All your stations should belong to the same big city contract but technically you can display from other place if you like. I don't see the point though. 
					number: "3039",
					contract: "lyon"
				}]
			
			}
	}
]
````

## Configuration options

The following properties can be configured:


<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>

		<tr>
			<td><code>stations</code></td>
			<td>An array of CycloCity Stations Number and Contract whose status will be displayed.<br>
				More info about this object can be found below.
				<br><b>Default value:</b> <code>[{
			nom: "ILE DE LA CITE PONT NEUF", // The name here is only for the human user. Not use after
			// We use the station name from the operator to avoid any issue (feature?). 
			number: "01001",
			contract: "paris"
		}, {
			nom: "louis lepine",
			number: "4002",
			contract: "paris"
		}]</code>
			</td>
		</tr>

		<tr>
			<td><code>showAvailableBikes</code></td>
			<td>Display the number of available bikes at each station. Set to <code>false</code> to NOT see that information<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>showAvailableSlots</code></td>
			<td>Display the number of free slots to park a bike at each station. Set to <code>false</code> to NOT see that information<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>showLastCheckTime</code></td>
			<td>Display how long ago was the station's data information refreshed. The module pools by default every 5 minutes, but JCDeceaux updates its information whenever and not that frequently. Set to <code>false</code> to NOT see that information<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>

		<tr>
			<td><code>reloadInterval</code></td>
			<td>How often does the station data needs to be fetched? (Milliseconds) Recommand : 5 minutes, no less than one minute (JCDeceaux certifies that period update will never be lower than one minute, experience shows around 5-10 minutes. <br>
				<br><b>Possible values:</b> <code>1000</code> - <code>86400000</code>
				<br><b>Default value:</b> <code>300000</code> (5 minutes)
			</td>
		</tr>
		<tr>
			<td><code>updateInterval</code></td>
			<td>For TESTING & DEVELOPMENT. How often does the display refresh (Milliseconds). It has to refresh at least every minute when <code>showLastCheckTime</code> is set to <code>true</code>. Don't touch that<br>
				<br><b>Possible values:</b><code>1000</code> - <code>60000</code>
				<br><b>Default value:</b> <code>60000</code> (60 seconds)
			</td>
		</tr>
		<tr>
			<td><code>maxStationsDisplayed</code></td>
			<td>Total amount of stations being displayed. 0 for as many as you configured. Stay to 0.<br>
				<br><b>Possible values:</b><code>0</code> - <code>...</code>
				<br><b>Default value:</b> <code>0</code>
			</td>
		</tr>
			removeStartTags: false,
		removeEndTags: false,
		startTags: [],
		endTags: []


		<tr>
			<td><code>removeStartTags</code></td>
			<td>Some newsfeeds feature tags at the <B>beginning</B> of their titles or descriptions, such as <em>[VIDEO]</em>.
			This setting allows for the removal of specified tags from the beginning of an item's description and/or title.<br>
				<br><b>Possible values:</b><code>'title'</code>, <code>'description'</code>, <code>'both'</code>
			</td>
		</tr>
		<tr>
			<td><code>startTags</code></td>
			<td>List the tags you would like to have removed at the beginning of the feed item<br>
				<br><b>Possible values:</b> <code>['TAG']</code> or <code>['TAG1','TAG2',...]</code>
			</td>
		</tr>
		<tr>
			<td><code>removeEndTags</code></td>
			<td>Remove specified tags from the <B>end</B> of an item's description and/or title.<br>
				<br><b>Possible values:</b><code>'title'</code>, <code>'description'</code>, <code>'both'</code>
			</td>
		</tr>
		<tr>
			<td><code>endTags</code></td>
			<td>List the tags you would like to have removed at the end of the feed item<br>
				<br><b>Possible values:</b> <code>['TAG']</code> or <code>['TAG1','TAG2',...]</code>
			</td>
		</tr>
	</tbody>
</table>

The `feeds` property contains an array with multiple objects. These objects have the following properties:

<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>

		<tr>
			<td><code>title</code></td>
			<td>The name of the feed source to be displayed above the news items.<br>
				<br>This property is optional.
			</td>
		</tr>

		<tr>
			<td><code>url</code></td>
			<td>The url of the feed used for the headlines.<br>
				<br><b>Example:</b> <code>'http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml'</code>
			</td>
		</tr>
		<tr>
			<td><code>encoding</code></td>
			<td>The encoding of the news feed.<br>
				<br>This property is optional.
				<br><b>Possible values:</b><code>'UTF-8'</code>, <code>'ISO-8859-1'</code>, etc ...
				<br><b>Default value:</b> <code>'UTF-8'</code>
			</td>
		</tr>

	</tbody>
</table>
