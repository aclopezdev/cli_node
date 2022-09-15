const PROPS = require('./core/props.js');
const Scene_Manager = require('./stage/scene_manager.js');

const Engine =
{
	_mode: PROPS.mode.normal,
	_root: null,
	_main: null,
	init: function() {
		this._root = Scene_Manager.new.node({ name: `root` });
	},
	change_mode: function(mode) {
		this._mode = mode || PROPS.mode.normal;
	},
	root: function() { return this._root; },
	main_stage: function() { return this._main; },
	set_main_stage: function(stage) {
		this._main = stage;
		if (typeof this._root === 'undefined') return;
		this._root.add_child(this._main);
		this._main.set_parent(this._root);
	}
};

module.exports = Engine;
