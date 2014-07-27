/**
 * Used to specify the number of mana symbol breakdown in a deck.
 */
define([
    'dojo/_base/declare',
    'dojo/dom-construct',
    'dojo/parser',
    'dojo/ready',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/text!./templates/ManaSymbolQuantity.html'
], function (declare, domConstruct, parser, ready, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
		color: ''
	});
});