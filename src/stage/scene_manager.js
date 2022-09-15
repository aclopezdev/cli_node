const Node = require('../core/node.js');
const Stage = require('./stage.js');
const { Item, Items, TItems } = require('./items.js');

const Scene_Manager =
{
	parent_relation: (node, parent) => {
		if (typeof parent !== 'undefined') {
			parent.add_child(node);
			node.set_parent(parent);
		}
	},
	new: {
		node: (props, parent) => {
			const node = new Node(props);
			Scene_Manager.parent_relation(node, parent);
			return node;
		},
		stage: (props, parent) => {
			const stage = new Stage(props);
			Scene_Manager.parent_relation(stage, parent);
			return stage;
		},
		item: (props, parent) => {
			const item = new Item(props);
			Scene_Manager.parent_relation(item, parent);
			return item;
		},
		items_list: (props, parent) => {
			const list = new Items(props);
			Scene_Manager.parent_relation(list, parent);
			return list;
		},
		items_table: (props, parent) => {
			const table = new TItems(props);
			Scene_Manager.parent_relation(table, parent);
			return table;
		}
	}
};

module.exports = Scene_Manager;
