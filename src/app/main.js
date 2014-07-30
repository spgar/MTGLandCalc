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
define([ 'dojo/has', 'require' ], function (has, require) {
	var app = {};

	function getConstant() {
		return 1;
	}

	/* This only runs in the browser. */
	if (has('host-browser')) {
		require(['dojo/dom', './widgets/ManaSymbolQuantity', 'dijit/Dialog', 'dijit/form/NumberSpinner', 'dojo/domReady!'], function(dom, ManaSymbolQuantity, Dialog)
		{
			/* Initialize the 5 mana symbol quantity widgets */
			app.msWhite = new ManaSymbolQuantity({color: 'W'}).placeAt(document.body);
			app.msBlue = new ManaSymbolQuantity({ color: 'U' }).placeAt(document.body);
			app.msBlack = new ManaSymbolQuantity({ color: 'B' }).placeAt(document.body);
			app.msRed = new ManaSymbolQuantity({ color: 'R' }).placeAt(document.body);
			app.msGreen = new ManaSymbolQuantity({ color: 'G' }).placeAt(document.body);

			app.msWhite.startup();
			app.msBlue.startup();
			app.msBlack.startup();
			app.msRed.startup();
			app.msGreen.startup();

			var submitButton = dom.byId("submitButton");
			dojo.connect(submitButton, "onclick", function(evt) {
				/* Figure out all of the mana symbol quantities that we're dealing with. */
				var w = app.msWhite.getSingleSymbolQuantity();
				var ww = app.msWhite.getDoubleSymbolQuantity();
				var u = app.msBlue.getSingleSymbolQuantity();
				var uu = app.msBlue.getDoubleSymbolQuantity();
				var b = app.msBlack.getSingleSymbolQuantity();
				var bb = app.msBlack.getDoubleSymbolQuantity();
				var r = app.msRed.getSingleSymbolQuantity();
				var rr = app.msRed.getDoubleSymbolQuantity();
				var g = app.msGreen.getSingleSymbolQuantity();
				var gg = app.msGreen.getDoubleSymbolQuantity();

				var totalSymbols = w + ww + u + uu + b + bb + r + rr + g + gg;
				if (totalSymbols === 0) {
					var noSymbolDialog = new Dialog({
						title: "Invalid Input",
						content: "Add at least one symbol."
					});
					noSymbolDialog.show();
					return;
				}

				var totalW = w + (ww * 1.5);
				var totalU = u + (uu * 1.5);
				var totalB = b + (bb * 1.5);
				var totalR = r + (rr * 1.5);
				var totalG = g + (gg * 1.5);
				var total = totalW + totalU + totalB + totalR + totalG;

				var plains = (totalW / total) * dom.byId("totalLands").value;
				var island = (totalU / total) * dom.byId("totalLands").value;
				var swamp = (totalB / total) * dom.byId("totalLands").value;
				var mountain = (totalR / total) * dom.byId("totalLands").value;
				var forest = (totalG  / total) * dom.byId("totalLands").value;

				dom.byId("numPlains").innerHTML = "Plains: " + plains;
				dom.byId("numIslands").innerHTML = "Islands: " + island;
				dom.byId("numSwamps").innerHTML = "Swamps: " + swamp;
				dom.byId("numMountains").innerHTML = "Mountains: " + mountain;
				dom.byId("numForests").innerHTML = "Forests: " + forest;
			});
		});
	}
	else {
		console.error('It doesn\'t make sense to run this outside of a browser.');
	}
});