# v-map
Ingame map for GTAC/MafiaC

## Download
https://github.com/VortrexFTW/v-map

## Usage
* (For Mafia 1 only) Disable the default map by adding/editing a [cvar](https://wiki.gtaconnected.com/CVars) named "bigmap" in your [server.xml](https://wiki.gtaconnected.com/ServerConfiguration), with a value of "0". Example: `<cvar name="bigmap" value="0">`
* Add v-map to your server resources folder and a line to the **resources section** of server.xml. Example: `<resource src="v-map" />`
* Attach data to any element (including [player peds](https://wiki.gtaconnected.com/client.player) in your own resource to apply a blip. See the "Data" section below for details. For "invisible" generic elements (to place a blip anywhere), use [dummy elements](https://wiki.gtaconnected.com/game.createDummyElement)
* Holding the TAB key will show the map 

# Data
* `v.blip` - **(Required)** *Blip image ID. See the list in v-map client.js for the IDs.*
* `v.size` - **(Optional)** *Multiplier for the blip size. The default size is 24x24px. This is a multiplier, so 0.5 is half the size, 2.0 double, 2.5 is 250% bigger, etc*

# Notes
* Use GTAC/MafiaC's element functions to fine-tune when and where the blips stream in for players, including [dimension](https://wiki.gtaconnected.com/element.dimension), [distance](https://wiki.gtaconnected.com/element.streamInDistance), [NetFlags](https://wiki.gtaconnected.com/NetFlags), etc
* This will be updated soon to support images served by any `v-extracontent` resource
* A MafiaC update is in the works that includes `image.size` property so it doesn't have to be hard coded in scripts when you add your own images
* Support for GTA games will be added soon
* You can set the map key from your own resource using "v.mapKey" [network event](https://wiki.gtaconnected.com/triggerNetworkEvent) server-side, or "setMapKey" [resource export](https://wiki.gtaconnected.com/resource.exports) client-side.