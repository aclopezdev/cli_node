const KCLI = require('../index.js');
const engine = KCLI.engine();
const scene_manager = KCLI.scene_manager();

const main_stage = engine.main_stage();
const stage_1 = scene_manager.new.stage({ name: `Stage 1` }, main_stage);
const panel_1 = stage_1.child_by_name(`main-panel`);
const label_1 = scene_manager.new.item({ name: `Item-1`, caption: `Item 1 test` }, panel_1);

console.log(stage_1);
