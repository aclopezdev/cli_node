/*jshint esversion: 8*/
const {Nav_System_Control, Basic_menu} = require('./controls');
const {Comp} = require('./comp');
const {Interact} = require('./core/input');
const {Print} = require('./core/output');
//const {Gossipy} = require('./core/gossipy');

const engine =
{
    _props: null,
    _root: null,
    _loop: null,
    _pointer: 0, // pointer is the indicator of selectable content
    _key_dir: 0,
    init: function(props)
    {
        this._props = props;
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
            }, this._props.sync);

        Interact.on(Interact.DISPATCHERS.NAV, (nav) => 
        {
            if(!this._root) return;
            this._key_dir = nav.dir;
            if(nav.dir !== Interact.DIR.ENTER)
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
        Print.print_logged();
    },
    init_kill: function()
    {
        this.kill();
    },
    kill: function()
    {
        clearInterval(this._loop);
        this._loop = null;
        this._root = null;
        Print.clear();
        process.exit();
    }
};


class Nav_system extends Comp
{
    _nav = null;
    _config = null;
    _manifest = null;
    constructor(props)
    {
        super(props);
        this._nav = new Nav_System_Control(props.control || {});
        if(props.config)
        {
            this._config = props.config;
            if(this._config.manifest)
            {
                this._manifest = this._config.manifest;
                this.manifest_decode();
            }
        }
       
    }
    manifest_decode = () =>
    {
        if(!this._manifest) return;
        let main = this._manifest.main;
        if(!main) return;
        if(typeof main === 'object')
        {
            this.decode_tree_node(main);
        }
        this._nav._head = main.id;
        this._nav._menu[main.id].add({ name: `exit`, label: `Exit app`, action: () => { engine.init_kill() } });
    }
    decode_tree_node = ( node, parent = {} ) =>
    {
        let id = Math.floor( Math.random() * Date.now() );
        node.id = id;
        node.parent = parent.id || -1;
        let menu = new Basic_menu( { id: id, data: node, onEnter: (item) => { this._nav.select(item.id); } } );
        if(node.tree)
        {
            if(node.parent !== -1)
                menu.add({ name: `back`, label: `Back`, action: () => { this._nav.select(node.parent);} });
            for(let sm of node.tree)
            {
                menu.add(sm);
                this.decode_tree_node(sm, node);
            }
        }
        this._nav.add( id, menu );
    }
    navigate_menu = (motion = 0) =>
    {
        this._nav.motion(motion);
    }
    draw = () =>
    {
        return `${ this._nav.draw() }`;
    }
}


class viewer extends Comp
{
    _init_line = 0;
    _end_line = 0;
    _index = 0;
    _print_buffer = ``;
    constructor(props)
    {
        super(props);
    }
    scrolling = (motion = 0) =>
    {
    }
    draw = () =>
    {
        this._print_buffer = `${Print.print_cols()}`;
        this._print_buffer += `wrehgpierwhgierwgoiwerb${ Print.end_of_line() }`;
        this._print_buffer += `${Print.print_cols()}`;

        return this._print_buffer;
    }
}

module.exports =
{
    Engine: engine,
    Nav_System: Nav_system,
    Viewer: viewer
}

