/*jshint esversion: 8*/
const { CLI_Relast, Comps } = require('./index');
const { Relast, Nav_System, Viewer, Comp, Log, Controls, Print } = CLI_Relast;
const { Nav_Path, Body } = Comps;
const util = require('util');
const {Interact} = require('./cli_relast/core/input');
const exec = util.promisify(require('child_process').exec);

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
                    { name: 'add_file', label: 'Add file', onOver: `Api/Status/check_status` },
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
            args.app.call_action(`insert_mode`, input =>
                {
                    if(!input) return;
                    if(!input.data) return;
                    let remote_repo = input.data;
                    Log(remote_repo);
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


class App extends Comp
{
    _comps_tabs = [`navigation`, `preview`];
    constructor(props)
    {
        super(props);
    }
    components = () =>
    {
        this.create_comp(`navigation`, Navigation, { title: `Navigation`, control: { } });
        this.create_comp(`preview`, Preview, { title: `Actions viewer` });
        this.create_comp(`insert`, Insert_mode, { title: `Write your value:` });

    }
    states = () =>
    {
        this.state(`main_pointer`, 0, { triggers: [ Controller.App.move_pointer ] });
        this.state(`key`, '');
        this.state(`tab_focus`, 0);
        this.state(`insert_mode`, false);
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
        this.action(`insert_mode`, cback =>
        {
            this.state(`insert_mode`, true);
            Interact.set_state(Interact.STATE.INSERT);
            Interact.on(Interact.DISPATCHERS.INSERT, data =>
                {
                    this.state(`insert_mode`, false);
                    if(cback) cback( data );
                });
        });
    };
    nav = (data) =>
    {
        if(data.input)
        {
            if(this.state(`insert_mode`))
                this.state(`insert_mode`, false);
            return;
        }
        this.call_action(`key_input`, data.direction);
        this.state(`main_pointer`, data.pointer);
    };
    draw = () =>
    {
        return `[comp:navigation]
        [comp:preview]
        ${ this.state(`insert_mode`) ? `[comp:insert]` : `` }`;
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
