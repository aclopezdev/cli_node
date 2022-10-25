const Node = require('../core/node.js');
const Stage = require('./stage.js');
const { Item, Items, TItems } = require('./items.js');

const Scene_Manager =
{
	set_parent: (node, parent) => {
		if (typeof parent !== 'undefined') {
			parent.add_child(node);
			node.set_parent(parent);
		}
	},
	new: {
		node: (props) => {
			const node = new Node(props);
			return node;
		},
		stage: (props) => {
			const stage = new Stage(props);
			return stage;
		},
		item: (props) => {
			const item = new Item(props);
			return item;
		},
		items_list: (props) => {
			const list = new Items(props);
			return list;
		},
		items_table: (props) => {
			const table = new TItems(props);
			return table;
		}
	}
};

module.exports = Scene_Manager;
