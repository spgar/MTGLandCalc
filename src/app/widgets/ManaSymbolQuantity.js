/**
 * Used to specify the number of mana symbol breakdown in a deck.
 */
define([
	'dojo/_base/declare',
    'dojo/dom-construct',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/text!./templates/ManaSymbolQuantity.html',
	'dijit/form/NumberSpinner'
], function (declare, domConstruct, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: template,
		color: '',

        getManaSymbolURL: function() {
            return 'http://mtgimage.com/symbol/mana/' + this.color + '/24.png';
        },
        
        postCreate: function() {
            domConstruct.create('img', { src: this.getManaSymbolURL() }, this.singleSymbolImage);
            domConstruct.create('img', { src: this.getManaSymbolURL() }, this.doubleSymbolImage);
            domConstruct.create('img', { src: this.getManaSymbolURL() }, this.doubleSymbolImage);
        },
        
		getSingleSymbolQuantity: function() {
			return this.singleSymbolQuantity.get("value");
		},

		getDoubleSymbolQuantity: function() {
			return this.doubleSymbolQuantity.get("value");
		}

	});
});