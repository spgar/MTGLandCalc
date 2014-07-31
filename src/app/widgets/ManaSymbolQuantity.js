/**
 * Used to specify the number of mana symbol breakdown in a deck.
 */
define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/text!./templates/ManaSymbolQuantity.html',
	'dijit/form/NumberSpinner'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: template,
		color: '',

		getSingleSymbolQuantity: function() {
			return this.singleSymbolQuantity.get("value");
		},

		getDoubleSymbolQuantity: function() {
			return this.doubleSymbolQuantity.get("value");
		}

	});
});