const {
	Engine,
	Scene_manager
} = require('./src/index.js');

const KCLI =
{
	init: () => {
		Engine.init();
	},
	engine: () => { return Engine; },
	scene_manager: () => { return Scene_manager; }
};

KCLI.init();

module.exports = KCLI;
