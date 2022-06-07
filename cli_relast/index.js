/*jshint esversion:8*/

const { Engine } = require('./engine');

function Relast()
{
    let app = null;

    let run = (props, App) =>
    {
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
    Relast: new Relast()
}

