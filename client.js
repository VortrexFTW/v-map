"use strict";

// ===========================================================================

let blipImageFilePaths = [
	"files/images/icons/radar-darts.png", // 0
	"files/images/icons/radar-police-station.png",
	"files/images/icons/radar-hospital.png",
	"files/images/icons/radar-fire-station.png",
	"files/images/icons/radar-gun.png",
	"files/images/icons/radar-bar.png", // 5
	"files/images/icons/radar-club.png",
	"files/images/icons/radar-restaurant.png",
	"files/images/icons/radar-strip-club.png",
	"files/images/icons/radar-darts.png",
	"files/images/icons/radar-house.png", // 10
	"files/images/icons/radar-job.png",
	"files/images/icons/radar-train.png",
	"files/images/icons/radar-boat.png",
	"files/images/icons/radar-darts.png",
	"files/images/icons/radar-pay-n-spray.png", // 15
	"files/images/icons/radar-clothes.png",
	"files/images/icons/radar-car-dealer.png",
	"files/images/icons/radar-money.png",
	"files/images/icons/radar-unknown.png",
	"files/images/icons/radar-church.png", // 20
	"files/images/icons/radar-fuel.png",
	"files/images/icons/radar-car2.png",
	"files/images/icons/radar-taxi.png",
];

/*
[BLIP IMAGES]
	Business: 0,
	Misc: 0,
	PoliceStation: 1,
	Hospital: 2,
	FireStation: 3,
	GunStore: 4,
	Bar: 5,
	Club: 6,
	Restaurant: 7,
	StripClub: 8,
	Church: 9,
	House: 10,
	Job: 11,
	TrainStation: 12,
	Boat: 13,
	Fuel: 14,
	Repair: 15,
	Clothes: 16,
	VehicleDealership: 17,
	Bank: 18,
	QuestionMark: 19,
	Church: 20,
	Fuel: 21
	Car2: 22
	Taxi: 23,
*/

// ===========================================================================

let mapEnabled = false;
let mapBackground = null;
let playerIcon = null;
let mapKeyPress = null;
let mapKey = SDLK_TAB;

let mapOriginalImageSize = new Vec2(1725, 732);
let mapOriginalAspectRatio = mapOriginalImageSize.x / mapOriginalImageSize.y;
let mapRenderWidth = game.width - game.width / 4;
let mapRenderSize = new Vec2(mapRenderWidth, mapRenderWidth / mapOriginalAspectRatio);

let maxWorldPosition = new Vec2(1130.06, 950.47);
let minWorldPosition = new Vec2(-3216.48, -925.39);
let mapWorldSize = new Vec2(Math.abs(minWorldPosition.x) + Math.abs(maxWorldPosition.x), Math.abs(minWorldPosition.y) + Math.abs(maxWorldPosition.y));

let playerIconSize = new Vec2(16, 16);
let iconSize = new Vec2(24, 24);

let dimmedBackgroundColour = toColour(0, 0, 0, 120);
let dimmedForegroundColour = toColour(0, 0, 0, 96);

let blipImages = [];

let blipIconSize = new Vec2(16, 16);

// Unfinished. Will be used to zoom map in and out.
let mapZoom = 1.0;
let mapZoomMax = 3.0;
let mapZoomMin = 1.0;
let mapZoomIncrement = 0.05;

let supportedGames = [
	10 // Mafia 1
];

// ===========================================================================

bindEventHandler("OnResourceReady", thisResource, function (event, resource) {
	mapBackground = loadImage("files/images/mafia1.png");
	if(mapBackground != null) {
		if(typeof mapBackground.size != "undefined") {
			mapOriginalImageSize = mapBackground.size;
		}
	}

	playerIcon = loadImage("files/images/icons/player-blip.png");

	for (let i in blipImageFilePaths) {
		let image = loadImage(blipImageFilePaths[i]);
		blipImages.push(image);
	}
});

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	if (!supportedGames.includes(game.game)) {
		console.warn(`${thisResource.name}] Not supported for this game. Aborting ...`);
		event.preventDefault();
		return false;
	}

	exportFunction("getMapKey", function () {
		return mapKey;
	});

	exportFunction("setMapKey", setMapKey);
});

// ===========================================================================

bindEventHandler("OnResourceStop", thisResource, function (event, resource) {
});

// ===========================================================================

addEventHandler("OnDrawnHUD", function (event) {
	if (mapBackground == null) {
		return false;
	}

	if (!canUseMapInScene()) {
		return false;
	}

	if (isKeyDown(Number(mapKey))) {
		graphics.drawRectangle(null, [0, 0], [game.width, game.height], dimmedBackgroundColour, dimmedBackgroundColour, dimmedBackgroundColour, dimmedBackgroundColour);

		let mapRenderPosition = new Vec2((game.width / 2) - (mapRenderSize.x / 2), (game.height / 2) - (mapRenderSize.y / 2));
		graphics.drawRectangle(mapBackground, mapRenderPosition, mapRenderSize, COLOUR_WHITE, COLOUR_WHITE, COLOUR_WHITE, COLOUR_WHITE, 0.0, [0, 0], [0, 0], [1.0, 1.0], [mapZoom, mapZoom]);

		// Player Icon
		if (playerIcon != null) {
			let playerMapPosition = getPositionOnMap((localPlayer.vehicle != null) ? localPlayer.vehicle.position : localPlayer.position);
			let iconPosition = new Vec2(mapRenderPosition.x + (playerMapPosition.x - (playerIconSize.x / 2)), mapRenderPosition.y + (playerMapPosition.y - (playerIconSize.y / 2)));
			graphics.drawRectangle(playerIcon, iconPosition, playerIconSize, COLOUR_WHITE, COLOUR_WHITE, COLOUR_WHITE, COLOUR_WHITE, (localPlayer.vehicle != null) ? localPlayer.vehicle.rotation.z : localPlayer.heading, [0.5, 0.5]);
		}

		// Map blips
		getElementsByType(ELEMENT_DUMMY).filter(dummyElement => dummyElement.getData("v.blip") != null).forEach(blip => {
			let imageIndex = blip.getData("v.blip");
			if (imageIndex != -1) {
				if (blipImages[imageIndex] != null) {
					let mapPosition = getPositionOnMap(blip.position);
					let sizeMultiplier = (blip.getData("v.size") != null) ? blip.getData("v.size") : 1.0;
					let size = (blip.getData("v.size") != null) ? new Vec2(iconSize.x * sizeMultiplier, iconSize.y * sizeMultiplier) : iconSize;
					let iconPosition = new Vec2(mapRenderPosition.x + (mapPosition.x - (size.x / 2)), mapRenderPosition.y + (mapPosition.y - (size.y / 2)));
					graphics.drawRectangle(blipImages[imageIndex], iconPosition, size, COLOUR_WHITE, COLOUR_WHITE, COLOUR_WHITE, COLOUR_WHITE, 0.0, [0.5, 0.5]);
				}
			}
		});

		// Draw a semi-transparent dimmed rectangle over the map rectangle to darken it a bit.
		graphics.drawRectangle(null, [0, 0], [game.width, game.height], dimmedForegroundColour, dimmedForegroundColour, dimmedForegroundColour, dimmedForegroundColour);
	}
});

// ===========================================================================

function loadImage(filePath) {
	let imageFile = openFile(filePath);

	if(imageFile == null) {
		return null;
	}

	if(filePath.toLowerCase().endsWith(".png")) {
		return graphics.loadPNG(imageFile);
	} else if(filePath.toLowerCase().endsWith(".bmp")) {
		return graphics.loadBMP(imageFile);
	}

	return null;
}

// ===========================================================================

function canUseMapInScene() {
	if (game.game != GAME_MAFIA_ONE) {
		return true;
	}

	if (game.mapName.toLowerCase() == "freeride" || game.mapName.toLowerCase() == "freeridenoc") {
		return true;
	}

	return false;
}

// ===========================================================================

function getPositionOnMap(worldPosition) {
	let blipPositiveRange = new Vec2(worldPosition.x + Math.abs(minWorldPosition.x), worldPosition.z + Math.abs(minWorldPosition.y));
	let blipRatioNormalized = new Vec2(blipPositiveRange.x / mapWorldSize.x, 1.0 - (blipPositiveRange.y / mapWorldSize.y));

	return new Vec2(blipRatioNormalized.x * mapRenderSize.x, blipRatioNormalized.y * mapRenderSize.y);
}

// ===========================================================================

addNetworkHandler("v.mapKey", function (keyId) {
	setMapKey(keyId);
});

// ===========================================================================

function setMapKey(keyId) {
	mapKey = (keyId != -1) ? keyId : SDLK_TAB;
}

// ===========================================================================