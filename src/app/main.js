/**
 * This file is the application's main JavaScript file. It is listed as a dependency in run.js and will automatically
 * load when run.js loads.
 *
 * Because this file has the special filename `main.js`, and because we've registered the `app` package in run.js,
 * whatever object this module returns can be loaded by other files simply by requiring `app` (instead of `app/main`).
 *
 * Our first dependency is to the `dojo/has` module, which allows us to conditionally execute code based on
 * configuration settings or environmental information. Unlike a normal conditional, these branches can be compiled
 * away by the build system; see `staticHasFeatures` in app.profile.js for more information.
 *
 * Our second dependency is to the special module `require`; this allows us to make additional require calls using
 * module IDs relative to this module within the body of the define callback.
 *
 * In all cases, whatever function is passed to define() is only invoked once, and the returned value is cached.
 *
 * More information about everything described about the loader throughout this file can be found at
 * <http://dojotoolkit.org/reference-guide/loader/amd.html>.
 */
define(['dojo/has', 'require'], function(has, require) {
	var app = {};

	function getManaSymbolQuantities() {
		var doubleSymbolMultiplier = 1.5;
		return {
			w: app.msWhite.getSingleSymbolQuantity() + (doubleSymbolMultiplier * app.msWhite.getDoubleSymbolQuantity()),
			u: app.msBlue.getSingleSymbolQuantity() + (doubleSymbolMultiplier * app.msBlue.getDoubleSymbolQuantity()),
			b: app.msBlack.getSingleSymbolQuantity() + (doubleSymbolMultiplier * app.msBlack.getDoubleSymbolQuantity()),
			r: app.msRed.getSingleSymbolQuantity() + (doubleSymbolMultiplier * app.msRed.getDoubleSymbolQuantity()),
			g: app.msGreen.getSingleSymbolQuantity() + (doubleSymbolMultiplier * app.msGreen.getDoubleSymbolQuantity())
		};
	}

	function getIndexOfMaxValue(arr) {
		var currentMax = arr[0];
		var currentIndex = 0;

		for (var i = 1; i < arr.length; ++i) {
			if (arr[i] > currentMax) {
				currentIndex = i;
				currentMax = arr[i];
			}
		}
		return currentIndex;
	}

	function manaSymbolsToLandQuantities(mana, totalSymbols, totalLands) {
		// Basic initial calculation.
		var plains = (mana.w / totalSymbols) * totalLands;
		var islands = (mana.u / totalSymbols) * totalLands;
		var swamps = (mana.b / totalSymbols) * totalLands;
		var mountains = (mana.r / totalSymbols) * totalLands;
		var forests = (mana.g / totalSymbols) * totalLands;

		// At this point we need to deal with fractions.
		var floorPlains = Math.floor(plains);
		var floorIslands = Math.floor(islands);
		var floorSwamps = Math.floor(swamps);
		var floorMountains = Math.floor(mountains);
		var floorForests = Math.floor(forests);

		while (floorPlains + floorIslands + floorSwamps + floorMountains + floorForests < totalLands) {
			var indexToBump = getIndexOfMaxValue([plains - floorPlains, islands - floorIslands, swamps - floorSwamps, mountains - floorMountains, forests - floorForests]);
			if (indexToBump == 0) {
				++floorPlains;
			} else if (indexToBump == 1) {
				++floorIslands;
			} else if (indexToBump == 2) {
				++floorSwamps;
			} else if (indexToBump == 3) {
				++floorMountains;
			} else if (indexToBump == 4) {
				++floorForests;
			}
		}

		return {
			numPlains: floorPlains,
			numIslands: floorIslands,
			numSwamps: floorSwamps,
			numMountains: floorMountains,
			numForests: floorForests
		};
	}

	// This only runs in the browser.
	if (has('host-browser')) {
		require(['dojo/dom',
                 'dojo/parser',
                 './widgets/ManaSymbolQuantity', 
                 'dijit/Dialog',
                 'dijit/form/NumberSpinner',
                 'dijit/form/Button',
                 'dijit/layout/BorderContainer',
                 'dijit/layout/ContentPane',
                 'dojo/domReady!'
                 ], 
        function(dom, parser, ManaSymbolQuantity, Dialog)
		{
			// Parse the XML
			parser.parse();

			// Initialize the 5 mana symbol quantity widgets
			var manaWidgetContainer = dom.byId("manaWidgetContainer");
			app.msWhite = new ManaSymbolQuantity({color: 'w'}).placeAt(manaWidgetContainer);
			app.msBlue = new ManaSymbolQuantity({ color: 'u' }).placeAt(manaWidgetContainer);
			app.msBlack = new ManaSymbolQuantity({ color: 'b' }).placeAt(manaWidgetContainer);
			app.msRed = new ManaSymbolQuantity({ color: 'r' }).placeAt(manaWidgetContainer);
			app.msGreen = new ManaSymbolQuantity({ color: 'g' }).placeAt(manaWidgetContainer);
			app.msWhite.startup();
			app.msBlue.startup();
			app.msBlack.startup();
			app.msRed.startup();
			app.msGreen.startup();

			// Hook the submit button up to do work.
			dojo.connect(dom.byId("submitButton"), "onclick", function(evt) {
				// Grab the mana symbol quantities from the widgets.
				var mana = getManaSymbolQuantities();

				var totalSymbols = mana.w + mana.u + mana.b + mana.r + mana.g;
				if (totalSymbols === 0) {
					var noSymbolDialog = new Dialog({
						title: "Invalid Input",
						content: "Add at least one symbol."
					});
					noSymbolDialog.show();
					return;
				}

				// Figure out the land quantities based on the mana symbol quantities
				lands = manaSymbolsToLandQuantities(mana, totalSymbols, dom.byId("totalLands").value);

				dom.byId('numPlains').innerHTML = lands.numPlains;
				dom.byId('numIslands').innerHTML = lands.numIslands;
				dom.byId('numSwamps').innerHTML = lands.numSwamps;
				dom.byId('numMountains').innerHTML = lands.numMountains;
				dom.byId('numForests').innerHTML = lands.numForests;
			});
		});
	}
	else {
		console.error('It doesn\'t make sense to run this outside of a browser.');
	}
});