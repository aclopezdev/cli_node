const Node = require('../core/node.js');
const Panel = require('./panel.js');

class Stage extends Node {
	constructor(props) {
		super(props);

		const main_panel = new Panel({ name: `main-panel` });
		this.add_child(main_panel);
		main_panel.set_parent(this);
	}
}

module.exports = Stage;
