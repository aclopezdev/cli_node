const PROPS = require('./core/props.js');
const Scene_Manager = require('./stage/scene_manager.js');

const Engine =
{
	_mode: PROPS.mode.normal,
	_main: null,
	init: function() {
		this._main = Scene_Manager.new.stage({ name: `root` });
	},
	change_mode: function(mode) {
		this._mode = mode || PROPS.mode.normal;
	},
	main: function() { return this._main; }
};

module.exports = Engine;
