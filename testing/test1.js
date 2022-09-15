const KCLI = require('../index.js');
const engine = KCLI.engine();
const scene_manager = KCLI.scene_manager();

const main_stage = engine.main_stage();
const stage_1 = scene_manager.new.stage({ name: `Stage 1` }, main_stage);

console.log(stage_1);
