# Module: mmm_velib
The `Velib` module is displaying the stations last updated data from JCDecaux's bike sharing system, CycloCity. That system is marketed under several names across France, Belgium, Spain and other countries. 

Le module 'Velib' affiche les informations à jour des stations de vélos du système de JCDecaux, CycloCity. Celui-ci est déployé dans de nombreuses villes sous des noms commerciaux comme Vélib ou Vélo'v et plusieurs pays.   

The module is compatible with the following cities // Il est compatible avec les villes suivantes : 
https://fr.wikipedia.org/wiki/Cyclocity#Services_en_fonction 

You have to fill in the stations you want to follow, e.g. the stations close to your home, your workplace or your gym. The module will displayed the following data about these stations : 

 - available bikes
 - available slots
 - how long ago was this information updated

Vous devez configurer les stations dont vous souhaitez voir les informations en live, par exemple les stations proches de chez vous, de votre lieu de travail ou de votre salle de gym. Le module affichera alors les informations suivantes pour chaque stations : 

 - vélos disponibles
 - bornes disponibles
 - temps écoulé depuis la dernière mise à jour des informations. 

It has been tested for // Le module a été testé pour : 

 - Paris, Lyon, Mulhouse, Toulouse, Sevilla (Spain). 
 
For not tested cities, it should work aswell, in case of unexpected issue, ask for my help at the MagicMirror Forum, link below // Pour les autres villes non vérifiées, le fonctionnement devrait être le même, en cas de bug, contacter-moi sur le forum MagicMirror ici : 

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
					nom: "home - rue Obama",
					number: "11",  
					contract: "mulhouse"  
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
			nom: "ILE DE LA CITE PONT NEUF",  
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
			<td>Display how long ago was the station's data information refreshed. The module pools by default every 5 minutes, but JCDecaux updates its information whenever and not that frequently. Set to <code>false</code> to NOT see that information<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>

		<tr>
			<td><code>reloadInterval</code></td>
			<td>How often does the station data needs to be fetched? (Milliseconds) Recommand : 5 minutes, no less than one minute (JCDecaux certifies that period update will never be lower than one minute, experience shows around 5-10 minutes. <br>
				<br><b>Possible values:</b> <code>1000</code> - <code>86400000</code>
				<br><b>Default value:</b> <code>300000</code> (5 minutes)
			</td>
		</tr>
		<tr>
			<td><code>nervouslyUpdateIntervale</code></td>
			<td><b>IN PROGRESS: </b>That parameter would eventually push the module to poll one station more frequently than the usual <code>reloadInterval</code> when the number of free bikes or free slots would fall below a determined threshold.
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>not used</code>
			</td>
		</tr>
		<tr>
			<td><code>maxStationsDisplayed</code></td>
			<td>Total amount of stations being displayed. 0 for as many as you configured. Stay to 0.<br>
				<br><b>Possible values:</b><code>0</code> - <code>...</code>
				<br><b>Default value:</b> <code>0</code>
			</td>
		</tr>
		<tr>
			<td><code>updateInterval</code></td>
			<td>For TESTING & DEVELOPMENT. How often does the display refresh (Milliseconds). It has to refresh at least every minute when <code>showLastCheckTime</code> is set to <code>true</code>. Don't touch that<br>
				<br><b>Possible values:</b><code>1000</code> - <code>60000</code>
				<br><b>Default value:</b> <code>60000</code> (60 seconds)
			</td>
		</tr>
	</tbody>
</table>

The `stations` property contains an array with 3 objects. These objects have the following properties:

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
			<td><code>name</code></td>
			<td>The <b>user</b> name of the station.<br>
				<br>This property is optional. The name that will be displayed at the left of the bikes/slot/time data is for now the JCDecaux referencing name as provided by the API. It is only here for easier setting up of the stations configuration.
			</td>
		</tr>

		<tr>
			<td><code>number</code></td>
			<td>That's the first <b>key identifier</b> : inside one city, it is <b>unique</b>. You can find the number of the station you want to follow on the web or mobile for each city. It generally prefixs the name<br>
				<br><b>Example:</b> <code>01001</code> for the station <i>01001 - ILE DE LA CITE PONT NEUF
41 QUAI DE L'HORLOGE - 75001 PARIS</i>
				<br><b>Example:</b> <code>75</code> for the station <i>Estación nº 75 PLAZA SAN FRANCISCO - Aprox C/ Hernando Colón</i>
			</td>
		</tr>
		<tr>
			<td><code>contract</code></td>
			<td>That's the second <b>key identifier</b> with <code>number</code> above. It is the name of the city which bought the bike sharing scheme from JCDecaux.<br>
				<br><b>Possible values:</b><code>paris</code> for Vélib', <code>lyon</code> for Vélo'v, <code>seville</code> for Sevici in Sevilla. 
				<br>When a bike sharing scheme overlaps over suburbs cities, the contract name stays the same, generally the big city name. For Paris suburbs, contracts same is still <code>paris</code>. 
				<br>Notice how Sevilla took the French spelling <code>seville</code> since JCDecaux is a French company. For not French cities, you might have to test a few spellings to get the right one.  
			</td>
		</tr>

	</tbody>
</table>
