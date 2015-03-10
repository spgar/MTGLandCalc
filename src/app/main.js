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

    // Returns a struct with the raw quantity values for each color.
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

    // Based on the total mana symbols provided and the total lands, return a struct with the quantity of each
    // land that we want to display to the user.
	function manaSymbolsToLandQuantities(mana, totalSymbols, totalLands) {
		// Basic initial calculation.
		var initialPlains = (mana.w / totalSymbols) * totalLands;
		var initialIslands = (mana.u / totalSymbols) * totalLands;
		var initialSwamps = (mana.b / totalSymbols) * totalLands;
		var initialMountains = (mana.r / totalSymbols) * totalLands;
		var initialForests = (mana.g / totalSymbols) * totalLands;

		// At this point we need to deal with fractions. We will floor out the fractions and then bump them up based on
        // the largest remaining fraction until we are at the total number of lands required.
		var plains = Math.floor(initialPlains);
		var islands = Math.floor(initialIslands);
		var swamps = Math.floor(initialSwamps);
		var mountains = Math.floor(initialMountains);
		var forests = Math.floor(initialForests);

		while (plains + islands + swamps + mountains + forests < totalLands) {
            var fractionArray = [initialPlains - plains, initialIslands - islands, initialSwamps - swamps, initialMountains - mountains, initialForests - forests];
            var indexToBump = fractionArray.indexOf(Math.max.apply(Math, fractionArray));
            
			if (indexToBump == 0) {
				++plains;
			} else if (indexToBump == 1) {
				++islands;
			} else if (indexToBump == 2) {
				++swamps;
			} else if (indexToBump == 3) {
				++mountains;
			} else if (indexToBump == 4) {
				++forests;
			}
		}

		return {
			numPlains: plains,
			numIslands: islands,
			numSwamps: swamps,
			numMountains: mountains,
			numForests: forests
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

			// Hook the submit button up to do the work.
			dojo.connect(dom.byId("submitButton"), "onclick", function(evt) {
				// Grab the mana symbol quantities from the widgets.
				var mana = getManaSymbolQuantities();

				var totalSymbols = mana.w + mana.u + mana.b + mana.r + mana.g;
				if (totalSymbols === 0) {
					var noSymbolDialog = new Dialog({
						title: "Invalid Input",
						content: "You need to add at least one mana symbol."
					});
					noSymbolDialog.show();
					return;
				}

                showLandsDialog.show();
                
				// Figure out the land quantities based on the mana symbol quantities
				var lands = manaSymbolsToLandQuantities(mana, totalSymbols, dom.byId("totalLands").value);

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