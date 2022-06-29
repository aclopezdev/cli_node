/*jshint esversion: 8*/
const { CLI_Relast, Comps } = require('./index');
const { Relast, Nav_System, Viewer, Comp, Log, Controls, Print } = CLI_Relast;
const { Nav_Path, Body } = Comps;
const util = require('util');
const {Interact} = require('./cli_relast/core/input');
const {Engine} = require('./cli_relast');
const exec = util.promisify(require('child_process').exec);
//const { exec } = require('child_process');

//--------------------------------------------------------------------------------------------------- 

const Git =
{
    check_local_repo: ( cback ) =>
    {
        let cmd = `[ -d ".git" ] && echo "true"`;
        exec( cmd, ( err, resp ) =>
        {
            let exist = Boolean(resp.replace(/\s/g, ''));
            if(cback)
                cback( { exist: exist, text: exist ? `Local repo exists!!` : `Local repo does not exist.` } );
        });
    },
    init: ( cback ) =>
    {
        let cmd = `git init`;
        exec( cmd, ( err, resp ) =>
        {
            if(cback)
                cback( { text: resp } );
        });
    },
    clone_repo: ( repo, cback ) =>
    {
        let cmd = `git clone ${ repo }`;
        exec( cmd, ( err, resp ) => {
            if(cback)
                cback( { test: resp } );
        });
    },
    branch: ( cback ) =>
    {
        let cmd = `git branch`;
        exec( cmd, ( err, resp ) =>
        {
            let buffer = [];
            if(err) return;
            let split = resp.split(`\n`);
            for(let i of split)
            {
                if(i.trim() === '') continue;
                let branch = i.trim();
                let data = { name: branch, selected: false };
                if(branch.includes(`*`))
                    data = { name: branch.replace(`* `, ''), selected: true };
                buffer.push(data);
            }
            if(cback) cback({ data: buffer, text: resp });
        } );
    },
    status: ( cback ) =>
    {
        let cmd = `git status -s`;
        exec( cmd, ( err, resp ) =>
        {
            let buffer = [];
            buffer.staged = [];
            buffer.untracked = [];
            buffer.unstaged = [];

            let split = resp.split(`\n`);
            for(let i of split)
            {
                if(i.trim() === '') continue;
                let file = i.trim();
                let type_match = file.match(/[M\s|M\s\s|MM\s|\?\?\s|D\s|D\s\s|DD\s]+/gm);
                if(type_match.length <= 0) continue;
                let type = type_match[0];
                file = file.replace(type_match[0], '');
                if(type.toLowerCase() === 'm ' || type.toLowerCase() === 'mm ' || type.toLowerCase() === 'd ' || type.toLowerCase() === 'dd ')
                    buffer.unstaged.push( { name: file, type: type.trim() } );
                else if(type.toLowerCase() === 'm  ' || type.toLowerCase() === 'd  ')
                    buffer.staged.push( { name: file, type: type.trim() } );
                else if(type === '??')
                    buffer.untracked.push( { name: file } );
            }
            if(cback) cback({ data: buffer, text: resp });
        } );
    },
    add_file: ( file, cback ) =>
    {
        let cmd = `git add ${ file }`;
        exec( cmd, ( err, resp ) =>
            {
                if(cback) cback({ text: resp });
            });
    }
};

const Controller =
{
    App: {
        move_pointer: args =>
        {
        },
    },
    Content: {
    },
    Status: {
        get_status: args =>
        {
            Git.status( (items) =>
            {
            } );
        }
    }
};

const View_Config = {
    menu:{
        index: ' ',
        space: '  ',
        group:{
            open: '',
            close: '',
            item: '﬌'
        }
    },
};
const Nav_Manifest = {
    main:{
        tree: [
            {
                name: 'start',
                label: 'Starting Git',
                action: 'enter',
                onOver: 'Api/Global/clear_preview',
                tree: [
                    { 
                        name: 'init', 
                        label: 'Git Init',
                        onOver: `Api/Start/check_local_repo`,
                        onEnter: `Api/Start/init_local_repo`
                    },
                    { 
                        name: 'clone', 
                        label: 'Git Clone',
                        onOver: `Api/Start/clone_remote_repo_preview`,
                        onEnter: `Api/Start/clone_remote_repo`
                    },
                ]
            },
            { 
                name: 'branches', 
                label: 'Git Branches',
                action: 'enter',
                onOver: 'Api/Branches/show_local_list',
                tree: [ 
                    { name: 'local_list', label: 'Local branches', onOver: 'Api/Branches/show_local_list', onEnter: 'Api/Branches/load_local_branches' },
                    { name: 'checkout', label: 'Checkout' },
                    { name: 'create_new_from', label: 'Create new from this branch' },
                    { name: 'delete', label: 'Delete' },
                ]
            },
            {
                name: 'status',
                label: 'Git Status',
                action: 'enter',
                onOver: 'Api/Status/check_status',
                tree: [
                    { name: 'add_file', label: 'Add file', onOver: `Api/Status/check_status`, onEnter: `Api/Status/load_status_files` },
                    { name: 'add all', label: 'Add all' }
                ]
            }
        ]
    }
};

const Git_Api =
{
    Global:
    {
        clear_preview: (args) =>
        {
            if(!args.app) return;
            let preview = args.app.get_comp(`preview`);
            if(!preview) return;
            preview.call_action(`change_content`, { title: args.item.label, content: `` });
        },
    },
    Start:
    {
        check_local_repo: ( args ) =>
        {
            if(!args.app) return;
            let preview = args.app.get_comp(`preview`);
            Git.check_local_repo( res =>
            {
                preview.call_action(`change_content`, { title: args.item.label, content: res.text });
            });
           
        },
        init_local_repo: ( args ) =>
        {
            if(!args.app) return;
            let preview = args.app.get_comp(`preview`);
            Git.check_local_repo( res =>
            {
                if(res.exist)
                {
                    preview.call_action(`change_content`, { title: args.item.label, content: res.text });
                    return;
                }
                Git.init( res2 =>
                {
                    preview.call_action(`change_content`, { title: args.item.label, content: res2.text });
                });

            });
        },
        clone_remote_repo: ( args ) =>
        {
            if(!args.app) return;
            let preview = args.app.get_comp(`preview`);
            args.app.call_action(`insert_mode`, input =>
                {
                    if(!input) return;
                    if(!input.data) return;
                    let remote_repo = input.data;
                    Git.check_local_repo( res => {
                        if(res.exist)
                        {
                            preview.call_action(`change_content`, { title: `Error:`, content: `It is impossible clone repository from existed another one.` })
                            return;
                        }

                        Git.clone_repo( remote_repo, res => {
                            preview.call_action(`change_content`, { title: args.item.label, content: Git_tools.text_format(res.text) });
                        });
                    });
                });
        },
    },
    Branches: {
        show_local_list: ( args ) =>
        {
            if(!args.app) return;
            let preview = args.app.get_comp(`preview`);
            let nav = args.app.get_comp(`navigation`);
            Git.branch(res => {
                preview.call_action(`change_content`, { title: args.item.label, content: Git_tools.text_format(res.text) });
            });
        }
    },
    Status:
    {
        check_status: ( args ) =>
        {
            if(!args.app) return;
            let preview = args.app.get_comp(`preview`);
            let nav = args.app.get_comp(`navigation`);
            Git.status(res => {
                preview.call_action(`change_content`, { title: args.item.label, content: Git_tools.text_format(res.text) });
            });

        },
        load_status_files: ( args ) =>
        {
            if(!args.app) return;
            args.app.call_action(`toggle_preview`, false);
            let control = args.app.get_comp(`mode_control`);
            Git.status(res =>
                {
                    let buffer = [];
                    let stages = [
                        { name: 'untracked', label: 'Untracked files' },
                        { name: 'unstaged', label: 'Unstaged files' },
                        { name: 'staged', label: 'Staged files' }
                    ];
                    
                    for(let s of stages)
                    {
                        if(!res.data[s.name]) continue;
                        let group = { name: s.name, label: s.label, caption: true, group: true, tree: [] };

                        for(let f of res.data[s.name])
                        {
                            group.tree.push({
                                name: `${ f.name }`,
                                label: `${ f.name }`,
                                onEnter: `Api/Status/add_file`
                            });
                        }
                        buffer.push(group);
                    }
                    control.call_action(`set_mode`, `interaction_mode`);
                    control.call_action(`start_interaction`, { title: `Git status - Add files`, menu: buffer });
                });
        },
        add_file: ( args ) =>
        {
            if(!args.app) return;
            Git.add_file(args.item.name, res => 
                {
                    Git_Api.Status.load_status_files( args );
                });
        },
        add_all_files: ( args ) =>
        {
        }
    }
};

const Git_tools =
{
     text_format: (txt) =>
     {
         let new_txt = txt;
         new_txt = new_txt.replace(/\n/g, Print.end_of_line() );
         return new_txt;
     }
}

class Navigation extends Nav_System
{
    constructor(props)
    {
        super(props);
        this.read_manifest();
    }
    actions = () =>
    {
        this.action(`start`, () =>
        {
        });
        this.action(`key_motion`, key =>
            {
                this.navigate_menu(key);
            });
        this.action(`onEnter`, args =>
            {
                if(typeof args.tree !== 'undefined')
                    this.decode_tree_level(args);
            });
        this.action(`onOver`, args =>
            {
            });
    }
}

class Preview extends Viewer
{
    constructor(props)
    {
        super(props);
    }
    states = () =>
    {
        this.state(`content`, ``);
    }
    actions = () =>
    {
        this.action(`start`, () =>
        {
        });
        this.action(`key_motion`, key =>
        {
            this.scrolling(key);
        });
        this.action(`change_content`, data =>
            {
                this.state(`section`, data.title);
                this.state(`content`, data.content);
                this.call_action(`update`);
            });
    }
}

class Insert_mode extends Comp
{
    constructor(props)
    {
        super(props);
    }
}

class Interaction_mode extends Nav_System
{
    constructor(props)
    {
        super(props);
    }
    actions = () =>
    {
        this.action(`create_menu`, buffer =>
            {
                let manifest = { main: { tree: buffer } };
                this._main._props.config.to_api(manifest);
                this.read_manifest(manifest);
            });
        this.action(`navigate`, key =>
            {
                this.navigate_menu(key);
            });
        this.action(`clear_menu`, () =>
            {
                this._path = [];
                this._menu = null;
            });
    }
}

class Mode_control extends Comp
{
    constructor(props)
    {
        super(props);
    }
    components = () =>
    {
        this.create_comp(`insert_mode`, Insert_mode, { title: `Write your value: ` });
        this.create_comp(`interaction_mode`, Interaction_mode, { icos: View_Config});
    }
    states = () =>
    {
        this.state(`mode`, '');
    }
    actions = () =>
    {
        this.action(`start`, () =>
        {
        });
        this.action(`key_motion`, key =>
            {
                if(this.state(`mode`).trim() === 'interaction_mode')
                    this.get_comp(`interaction_mode`).call_action(`navigate`, key);
            });
        this.action(`set_mode`, ( v = '' ) =>
            {
                this.state(`mode`, v);
            });
        this.action(`start_interaction`, data =>
            {
                let interact_mode = this.get_comp(`interaction_mode`);
                interact_mode._props.title = data.title || undefined;
                ( data.menu || [] ).push({
                    name: 'exit_menu',
                    label: 'Exit menu',
                    onEnter: () => {
                        this.call_action(`finish_interaction`);
                    }
                });
                interact_mode.call_action(`create_menu`, data.menu);
                this._main.call_action(`change_tab`, `mode_control`)
                Engine.update(); 
            });
        this.action(`finish_interaction`, () => 
            {
                this.get_comp(`interaction_mode`).call_action(`clear_menu`);
                this._parent.call_action(`toggle_preview`, true);
                this._parent.call_action(`change_tab`, `navigation`);
                this.state(`mode`, '');
                Engine.update();
            });
    }
    draw = () =>
    {
        return this.state(`mode`).trim() !== '' ? `[comp:${ this.state(`mode`) }]` : '';
    }
}


class App extends Comp
{
    _comps_tabs = [`navigation`, `mode_control`];
    constructor(props)
    {
        super(props);
    }
    components = () =>
    {
        this.create_comp(`navigation`, Navigation, { title: `Navigation`, manifest: this._props.manifest, main_nav: true, icos: View_Config, control: { } });
        this.create_comp(`preview`, Preview, { title: `Actions viewer` });
        this.create_comp(`mode_control`, Mode_control);
    }
    states = () =>
    {
        this.state(`main_pointer`, 0, { triggers: [ Controller.App.move_pointer ] });
        this.state(`key`, '');
        this.state(`tab_focus`, 0);
        this.state(`show_preview`, true);
    }
    actions = () =>
    {
        this.action(`start`, () =>
        {
        });
        this.action(`key_input`, (key) =>
        {
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
        });
        this.action(`change_tab`, v =>
            {
                for(let c in this._comps_tabs)
                {
                    if(this._comps_tabs[c] === v.trim())
                    {
                        this.state(`tab_focus`, c);
                        return;
                    }
                }
            });
        this.action(`insert_mode`, cback =>
        {
            let mode_control = this.get_comp(`mode_control`);
            mode_control.call_action(`set_mode`, `insert_mode`);

            Interact.set_state(Interact.STATE.INSERT);
            Interact.on(Interact.DISPATCHERS.INSERT, data =>
                {
                    mode_control.call_action(`set_mode`, '');
                    if(cback) cback( data );
                });
        });
        this.action(`toggle_preview`, v => 
            {
                this.state(`show_preview`, v);
            });
    };
    nav = (data) =>
    {
        if(data.input)
        {
            let mode_control = this.get_comp(`mode_control`);
            if(mode_control.state(`mode`) === 'insert_mode')
                mode_control.call_action(`set_mode`, '');
            return;
        }
        this.call_action(`key_input`, data.direction);
        this.state(`main_pointer`, data.pointer);
    };
    draw = () =>
    {
        return `[comp:navigation]
        ${ this.state(`show_preview`) ? `[comp:preview]` : `` }
        [comp:mode_control]`;
    };
}


CLI_Relast.run({
    name: 'git_manager',
    title: 'Git Manager',
    api: Git_Api,
    manifest: Nav_Manifest,
    debug: true
}, App, (fw, app) =>
{
});
