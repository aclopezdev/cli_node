/*jshint esversion: 8*/
const {Nav_System_Control, Basic_menu} = require('./controls');
const {Comp} = require('./comp');
const {Interact} = require('./core/input');
const {Print} = require('./core/output');
const {Engine} = require('.');
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
        this.render();
        this.start_loop();

        Interact.on(Interact.DISPATCHERS.KILL, () =>{ this.kill(); })
        Interact.on(Interact.DISPATCHERS.NAV, (nav) => 
        {
            if(!this._root) return;
            this._key_dir = nav.dir;
            if(nav.dir !== Interact.DIR.ENTER)
                this._pointer = Math.max(0, this._pointer + nav.dir);
          
            if(this._root.nav)
            {
                this._root.nav( { direction: nav.dir, pointer: this._pointer } );
            }

            this.render();
        });
        Interact.on(Interact.DISPATCHERS.INSERT, ( data ) =>
        {
            if(!this._root) return;
            if(this._root.nav)
                this._root.nav({ input: data.data });
            //this.start_loop();
        }, false);
    },
    render: function()
    {
        Print.clear();
        this._root.page();
        Print.print_logged();
    },
    update: function()
    {
        this.render();
    },
    start_loop: function()
    {
        this._loop = setInterval(() => 
            {
                this.loop();
            }, this._props.sync);
    },
    stop_loop: function()
    {
        clearInterval(this._loop);
        this._loop = null;
    },
    loop: function()
    {
        if(!this._root) return;

        //if(Interact._state === Interact.STATE.INSERT)
        //    this.stop_loop();
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
    _manifest = null;
    _path = [];
    _menu = null;
    constructor(props)
    {
        super(props);
    }
    read_manifest = () =>
    {
        if(this._app_config)
        {
            if(this._app_config._manifest)
            {
                this._manifest = this._app_config._manifest;
                this.start_level_decode();
            }
        }
    }
    start_level_decode = () =>
    {
        if(!this._manifest) return;
        let main = this._manifest.main;
        if(!main) return;
        if(typeof main === 'object')
        {
            this.decode_tree_level(main);
        }
    }
    decode_tree_level = ( parent ) =>
    {
        if(typeof parent === 'undefined') 
        {
            this.start_level_decode();
            return;
        }
        if(typeof parent.tree !== 'undefined')
        {
            let menu_ico = ( ( this._manifest || { config: {} } ).config || { menu_ico: '--->' } ).menu_ico || '--->';
            let menu_empty = ( ( this._manifest || { config: {} } ).config || { menu_empty: '    ' } ).menu_empty || '    ';
            if(Array.isArray(parent.tree))
            {
                this._menu = new Basic_menu({ 
                    data: parent, 
                    onEnter: (args) => { 
                        this.call_action(`onEnter`, args); 
                        if(!args.item) return;
                        if(args.item.onEnter)
                            if(typeof args.item.onEnter === 'function')
                                args.item.onEnter({ item: args.item, app: this._main, engine: engine });
                    }, 
                    onOver: (args) => { 
                        this.call_action(`onOver`, args); 
                        if(!args.item) return;
                        if(args.item.onOver)
                            if(typeof args.item.onOver === 'function')
                                args.item.onOver({ item: args.item, app: this._main, engine: engine });
                    }, 
                    menu_ico: menu_ico, 
                    menu_empty: menu_empty 
                });
                if(this._path.length > 0)
                    this._menu.add({ name: `back`, label: `Back`, action: () => { 
                        let p = this.remove_path();
                        this.decode_tree_level(p);
                    } });

                for(let n of parent.tree)
                {
                    this._menu.add(n);
                    if(n.group)
                    {
                       this._menu.add_subitems(n.tree, n.name); 
                    }
                }
                this._menu.motion(Interact.DIR.NONE);
            }
            this.save_path(parent);
        }
        if(this._manifest)
            if(parent === this._manifest.main)
                this._menu.add({ name: `exit`, label: `Exit app`, action: () => { engine.init_kill() } });
        this._menu.commit();
    }
    save_path = node =>
    {
        this._path.push(node);
    }
    remove_path = () =>
    {
        let node = this._path[this._path.length - 2];
        this._path.pop();
        this._path.pop();
        return node;
    }
    navigate_menu = (motion = 0) =>
    {
        this._menu.motion(motion, (args) => { this.call_action(`motion`, args) });
    }
    draw = () =>
    {
        return `${ this._menu.draw() }`;
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

        this.action(`update`, () => { engine.render() });
    }
    scrolling = (motion = 0) =>
    {
    }
    draw = () =>
    {
        this._print_buffer = `${ Print.print_cols() }`;
        this._print_buffer += `${ this.state(`section`) }${ Print.end_of_line() }${ this.state(`content`) }${ Print.end_of_line() }`;
        this._print_buffer += `${ Print.print_cols() }`;

        return this._print_buffer;
    }
}

module.exports =
{
    Engine: engine,
    Nav_System: Nav_system,
    Viewer: viewer
}

