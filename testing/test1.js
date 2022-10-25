const KCLI = require('../index.js');
const engine = KCLI.engine();
const scene_manager = KCLI.scene_manager();

// ESCENE 1--------------------------------------------------------------------------------------
const stage_1 = scene_manager.new.stage({ name: `stateg_1`, caption: `Stage 1` });
engine.get_director().add_child(stage_1);

const panel_1 = scene_manager.new.panel({ name: `main-panel`, caption: `Testing panel 1` })
stage_1.add_child(panel_1);

const label_1 = scene_manager.new.item({ name: `Item-1`, caption: `Item 1 test` });
panel_1.add_child(label_1);
// console.log(stage_1);
console.log(panel_1._props);

//----------------------------------------------------------------------------------------------
