const Stage = require('./stage.js');

const Scene_Manager =
{
	new: {
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
