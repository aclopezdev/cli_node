const Node = require('../core/node.js');
const List = require('../core/list.js');
const Table = require('../core/table.js');

class Item extends Node {
	_caption = ``;
	constructor(props) {
		super(props);
		this._caption = props.caption || `new-items`;
	}
	caption = (v) => {
		if (typeof v === 'undefined') return this._caption;
		this._caption = v;
	}
}

class Items extends List {
	constructor(props) { super(props); }
}

class TItems extends Table {
	constructor(props) { super(props); }
}

module.exports =
{
	Item: Item,
	Items: Items,
	TItems: TItems
};
