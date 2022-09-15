const Node = require('../core/node.js');
const Stage = require('./stage.js');

const Scene_Manager =
{
	new: {
		node: (props, parent) => {
			const node = new Node(props);
			if (typeof parent !== 'undefined') {
				parent.add_child(node);
				node.set_parent(parent);
			}
			return node;
		},
		stage: (props, parent) => {
			const stage = new Stage(props);
			if (typeof parent !== 'undefined') {
				parent.add_child(stage);
				stage.set_parent(parent);

			}
			return stage;
		}
	}
};

module.exports = Scene_Manager;
