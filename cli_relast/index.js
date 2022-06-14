/*jshint esversion:8*/

const { Engine, Nav_System, Viewer } = require('./engine');
const { Print } = require('./core/output');

function Relast()
{
    let app = null;

    let run = (props, App) =>
    {
        Print._debug = props.debug || false;
        this.app = new App(props);
        Engine.init({
            app: this.app,
            sync: props.sync || 100
        });
        Engine.run();
    }

    let _public =
    {
        run: run,
        app: () => { return this.app; }
    }

    return _public;
}

module.exports =
{
    Comp: require('./comp').Comp,
    Controls: require('./controls'),
    Engine: Engine,
    Nav_System: Nav_System,
    Relast: new Relast(),
    Log: Print.log,
    Print: Print,
    Viewer: Viewer 
}

