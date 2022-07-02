/*jshint esversion:8*/

const Relast = require('./cli_relast/index');


Relast.run = (props, main_app, cback) =>
{
    if(!props) return;
    Relast.Relast.run(props, main_app);
    if(cback) cback( Relast, Relast.Relast.app() );
};

const Kix = {
        ARGS: process.argv.slice(2),
        DIR: process.cwd(),
        CLI_Relast: Relast,
        Comps: require('./comps/index'),
    };

module.exports = Kix;
