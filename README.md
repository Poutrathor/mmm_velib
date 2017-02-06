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
			// If no config is set, 2 stations from the center of Paris will be displayed
			// See 'Configuration options' for more information.

			stations: [{
					nom: "home - rue Obama", // the name of the station is irrelevant for the module which use CylcoCity reference naming. 
					number: "11", // That's the IMPORTANT identifier : you can find the number of your stations on the web and mobile map for each city. 
					contract: "mulhouse" // That's AS IMPORTANT AS the *number* above. Velib' is "paris", VélôToulouse is "toulouse", etc. 
				},{ 
					nom: "Place Bir Hakeim", // All your stations should belong to the same big city contract but technically you can display from other place if you like. I don't see the point though. 
					number: "3039",
					contract: "lyon"
				}],
			showAvailableBikes: true, // If you want the module to NOT display available bikes, set it to false, else, don't touch it :) 
			showAvailableSlots: true, // If you want the module to NOT display available slots, set it to false, else, don't touch it :) 
			showLastCheckTime: true, // If you want the module to NOT display the last update time, set it to false, else, don't touch it :)
			reloadInterval: 5 * 60 * 1000, // Every 5 mins. The polling speed to the JCDeceaux API. The stations data seem to be updated at a somewhat low rate, every 5 to 10 minutes. So there should be no real need to pool faster than 5 minutes. 
			
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
			<td><code>feeds</code></td>
			<td>An array of feed urls that will be used as source.<br>
				More info about this object can be found below.
				<br><b>Default value:</b> <code>[
					{
						title: "New York Times",
						url: "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml",
						encoding: "UTF-8"
					}
				]</code>
			</td>
		</tr>

		<tr>
			<td><code>showSourceTitle</code></td>
			<td>Display the title of the source.<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>showPublishDate</code></td>
			<td>Display the publish date of an headline.<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>showDescription</code></td>
			<td>Display the description of an item.<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>

		<tr>
			<td><code>reloadInterval</code></td>
			<td>How often does the content needs to be fetched? (Milliseconds)<br>
				<br><b>Possible values:</b> <code>1000</code> - <code>86400000</code>
				<br><b>Default value:</b> <code>300000</code> (5 minutes)
			</td>
		</tr>
		<tr>
			<td><code>updateInterval</code></td>
			<td>How often do you want to display a new headline? (Milliseconds)<br>
				<br><b>Possible values:</b><code>1000</code> - <code>60000</code>
				<br><b>Default value:</b> <code>10000</code> (10 seconds)
			</td>
		</tr>
		<tr>
			<td><code>animationSpeed</code></td>
			<td>Speed of the update animation. (Milliseconds)<br>
				<br><b>Possible values:</b><code>0</code> - <code>5000</code>
				<br><b>Default value:</b> <code>2500</code> (2.5 seconds)
			</td>
		</tr>
		<tr>
			<td><code>maxNewsItems</code></td>
			<td>Total amount of news items to cycle through. (0 for unlimited)<br>
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
