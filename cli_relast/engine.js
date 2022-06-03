/*jshint esversion: 8*/
const {Comp} = require('./comp');
const {Interact} = require('./core/input');
const {Print} = require('./core/output');
//const {Gossipy} = require('./core/gossipy');

const engine =
{
    _root: null,
    _loop: null,
    _pointer: 0, // pointer is the indicator of selectable content
    init: function(props)
    {
        this._root = props.app;
        if(this._root.init)
            this._root.init();
    },
    run: function()
    {
        if(!this._root) return;
        Interact.run();
        this._loop = setInterval(() => 
            {
                this.loop();
            }, 100);

        Interact.on(Interact.DISPATCHERS.NAV, (nav) => 
        {
           this._pointer = Math.max(0, this._pointer + nav.dir);
          
            if(this._root.nav)
                this._root.nav( { direction: nav.dir, pointer: this._pointer } );
        });
    },
    loop: function()
    {
        Interact.on(Interact.DISPATCHERS.KILL, () =>{ this.kill(); });
        if(!this._root) return;
        
        //RENDERING
        Print.clear();
        this._root.page(); 
    },
    kill: function()
    {
        clearInterval(this._loop);
        this._loop = null;
        this._root = null;
        Print.clear();
    }
};

module.exports =
{
    Engine: engine
}

/*
function engine(config={})
{
    let _app = null;
    let _loop = null;

    let init = () =>
    {
        _app = config.app;
        if(!_app) return;
        _app.init();
    };

    let run = () =>
    {
        if(!_app) return;
        this._loop = setInterval(loop, config.tick_ms || 100);
    };

    let loop = () =>
    {
        if(!_app) return;
        let gossips = Gossipy.get_gossips();
        for(let g of gossips)
        {
            if(g.type === Gossipy.GOSSIP.STATE_CHANGE)
            {
                renderer();
                Gossipy.liberate_gossips(g.type);
            }
        }
    }

    let renderer = () =>
    {
        console.clear();
        if(_app.draw)
        {
            let cli = {
                title: _app._props.title || `App Title`,
                body: {
                    content: _app.draw()
                }
            };
            _app.page(cli);
        }
    }

    let key_inputs = (key) =>
    {
        if(_app)
            _app.call_action(`key_input`, key);
    }

    let insert_mode = txt =>
    {
        if(_app)
            _app.call_action(`insert_mode`, txt);
        Gossipy.liberate_gossips(GOSSIP.INSERT_TXT);
    }

    let _public =
    {
        Init: init,
        Render: run,
        Key_input: key_inputs,
        Insert_mode: insert_mode
    }

    return _public;
}

engine.create_app = (_class, props = {}) =>
{
    if(!_class) return null;
    let app = new _class(props);
    return app;
}

module.exports = 
{
    Engine: engine
};
*/
