/*jshint esversion: 8*/
const Kix = require('./index');
const { CLI_Relast, Comps } = Kix; 
const { Reducer, Relast, Nav_System, Engine, Interact, Viewer, Comp, Log, Controls, Print } = CLI_Relast;

const util = require('util');
const UI = require('./cli_relast/core/ui');
const exec = util.promisify(require('child_process').exec);

//--------------------------------------------------------------------------------------------------- 

Reducer.add(`ui_testing`, `key`, args =>
    {
        // args.state = state's value'
        // args.last_state = previews state's value'
        // args.state_name
        // args.state.self = component state's owner'
    });

class Nav_Controller extends Comp
{
    constructor(props)
    {
        super(props);
    }
    states = () =>
    {
        this.state(`nav_pointer`, 0);
        this.state(`nav_dir`, 0);
    }
    actions = () =>
    {
        this.action(`nav`, (self, args, props) =>
            {
            });
    }
}

class Modal1 extends Comps.Modal
{
    constructor(props)
    {
        super(props);
        this.config_render_area({
            w: 50,
            h: 20,
            border: UI.WINDOW.BORDERS_TYPE.DOUBLE
        }, UI.WINDOW.MODAL);
    }
    actions = () =>
    {
        this.action(`start`, () =>
            {
            });
    }
}

class App extends Comps.Render_Panel
{
    constructor(props)
    {
        super(props);
    }
    components = () =>
    {
        this.add_comp(Nav_Controller, `Navigator`);
        this.add_comp(Modal1, `Modal1`);
    }
    states = () =>
    {
        this.state(`main_pointer`, 0);
        this.state(`key`, '');
        this.state(`tab_focus`, 0);
    }
    actions = () =>
    {
        this.action(`start`, () =>
        {
            this.state(`key`, 123);
        });
        this.action(`key_input`, (key) =>
        {
            /*
            this.state(`key`, key);
            if(key === Interact.DIR.TAB)
            {
                this.state(`tab_focus`, this.state(`tab_focus`) + 1);
                if(this.state(`tab_focus`) >= this._comps_tabs.length)
                    this.state(`tab_focus`, 0);
            }
            let comp = this.get_comp(this._comps_tabs[this.state(`tab_focus`)]);
            if(comp)
                comp.call_action(`key_motion`, key);
            */
        });
        this.action(`change_tab`, v =>
            {
                /*
                for(let c in this._comps_tabs)
                {
                    if(this._comps_tabs[c] === v.trim())
                    {
                        this.state(`tab_focus`, c);
                        return;
                    }
                }
                */
            });
        this.action(`insert_mode`, cback =>
        {
            /*
            let mode_control = this.get_comp(`mode_control`);
            mode_control.call_action(`set_mode`, `insert_mode`);

            Interact.set_state(Interact.STATE.INSERT);
            Interact.on(Interact.DISPATCHERS.INSERT, data =>
                {
                    mode_control.call_action(`set_mode`, '');
                    if(cback) cback( data );
                });
                */
        });
        this.action(`toggle_preview`, v => 
            {
                this.state(`show_preview`, v);
            });
    };
    nav = (data) =>
    {
        //this.comp(`Navigator`).action(`nav`);
        /*
        if(data.input)
        {
            let mode_control = this.get_comp(`mode_control`);
            if(mode_control.state(`mode`) === 'insert_mode')
                mode_control.call_action(`set_mode`, '');
            return;
        }
        this.call_action(`key_input`, data.direction);
        this.state(`main_pointer`, data.pointer);
        */
    };
}

CLI_Relast.run({
    name: 'ui_testing',
    title: 'UI Testing',
    api: {},
    manifest: {},
    debug: true
}, App, (fw, app) =>
{
});
