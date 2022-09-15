const {
	Engine,
	Scene_manager
} = require('./src/index.js');

const KCLI =
{
	init: () => {
		Engine.init();
		const main_stage = Scene_manager.new.stage({ name: `main-stage` });
		Engine.set_main_stage(main_stage);
	},
	engine: () => { return Engine; },
	scene_manager: () => { return Scene_manager; }
};

KCLI.init();

module.exports = KCLI;
