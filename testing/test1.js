const KCLI = require('../index.js');

const main_stage = KCLI.engine().main();
const stage_1 = KCLI.scene_manager().new.stage({ name: `Stage 1` }, main_stage);
