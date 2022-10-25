const PROPS = require('./core/props.js');
const Scene_Manager = require('./stage/scene_manager.js');

const Engine =
{
	_mode: PROPS.mode.normal,
	_director: null,
	_main: null,
	init: function() {
		this._director = Scene_Manager.new.node({ name: `director` });
	},
	change_mode: function(mode) {
		this._mode = mode || PROPS.mode.normal;
	},
	get_director: function() { return this._director; },
	main_stage: function() { return this._main; },
	set_main_stage: function(stage) {
		this._main = stage;
		if (typeof this._director === 'undefined') return;
		this._director.add_child(this._main);
		this._main.set_parent(this._director);
	}
};

module.exports = Engine;
