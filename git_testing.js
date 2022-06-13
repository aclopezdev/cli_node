/*jshint esversion: 8*/
const { CLI_Relast, Comps } = require('./index');
const { Relast, Nav_System, Comp, Log, Controls, Print } = CLI_Relast;
const { Nav_Path, Body } = Comps;
const util = require('util');
const exec = util.promisify(require('child_process').exec);

//--------------------------------------------------------------------------------------------------- 

const Git =
{
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
            if(cback) cback(buffer);
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
            if(cback) cback(buffer);
        } );
    }
};

Git.branch( (items) =>
{
} );
Git.status( (items) =>
{
} );






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







class Status extends Comp
{
    constructor(props)
    {
        super(props);
    }
    states = () =>
    {
        this.state(`resp`, ``);
    }
    actions = () =>
    {
        this.action(`status`, () =>
            {
                Git.status( items =>
                    {
                    });
            });
    }
    draw = () =>
    {
        Git.status( () => {

        } );
        return `${ this.state(`resp`) }`;
    }
}


class Branches extends Comp
{
    constructor(props)
    {
        super(props);
    }
    states = () =>
    {
        this.state(`resp`, ``);
    }
    actions = () =>
    {
        this.action(`load_branches`, () => 
        {
            Git.branch( (items) =>
            {
            } );
        });
    }
    draw = () =>
    {
        return `${ this.state(`resp`) }`;
    }
}



class Step1 extends Controls.Basic_menu
{
    constructor(props)
    {
        super(props);
        this.add({ name: `git_branches`, label: `Check local branches` });
        this.add({ name: `git_status`, label: `Check current status` });
        this.add({ name: `git_add`, label: `Add files to stage` });
        this.add({ name: `git_commit`, label: `Commit changes` });
        this.add({ name: `git_push`, label: `Push to origin` });
        this.add({ name: `git_fetch`, label: `Fetch from origin` });
        this.add({ name: `git_pull`, label: `Pull from origin` });
    }
    up = () =>
    {
        this._index = Math.max(0, this._index - 1);
    }
    down = () =>
    {
        this._index = Math.min(this._items.length - 1, this._index + 1);
    }
    draw = () =>
    {
        return `${ this._items.map( (v, i) =>
            {
                return `${ this._index === i ? `[-->]` : `[   ]` } ${ v.label }`;
            }).toString().replace(/\,\s?/g, Print.end_of_line() ) }`;
    }
}


class Content extends Body
{
    _content = [
        { type: `control`, name: `Main_menu`, _class: Step1, nav: true },
        { type: `comp`, name: `Git_branches`, _class: Branches, props: { title: `Branches manager` } },
        { type: `comp`, name: `Git_status`, _class: Status, props: { title: `Git Status` } }
    ];
    _trackers = [];
    constructor(props)
    {
        super(props);
    }
    components = () =>
    {
        for(let c of this._content)
        {
            let func = `${ c.type === 'control' ? `add` : `create` }_${ c.type }`;
            let act = this[func];
            act(`${ c.name }`, c._class, c.props || {});
            if(c.nav)
                this._trackers[c.name] = 0;
        }
    }
    states = () =>
    {
        this.state(`trigger`, false);
        this.state(`step`, 0);
        this.state(`branch`, ``);
        this.state(`content`, `Main_menu`);
    }
    actions = () =>
    {
        this.action(`start`, () =>
        {
        });
        this.action(`navigate`, key =>
        {
            if(typeof this._trackers[ this.state(`content`) ] !== 'undefined')
            {
                this._trackers[ this.state(`content`) ] += key;
                let main_menu = this.get_control(`Main_menu`);
                if(key < 0) main_menu.up();
                else if(key > 0) main_menu.down();
            }
            this.state(`trigger`, !this.state(`trigger`));
        });
        this.action(`change_content`, value =>
        {
            if(typeof value !== 'string') return;
            this.state(`content`, value);
        });
    }
    draw = () =>
    {
        return `${ this.state(`step`) === 0 ?
            `[control:Main_menu]`
        :
            `[comp:${ this.state(`content`) }]` 
        }`;
    }
}














const Nav_Manifest = {
    'main':{
        'tree': [
            { 
                name: 'init', 
                label: 'Git Init',
                api: [ { name: 'Git_init', args: { type: 'input_text' } } ]
            },
            { 
                name: 'branches', 
                label: 'Git Branches',
                action: 'enter',
                tree: [ 
                    { name: 'checkout', label: 'Checkout', api: [ { name: 'Git_checkout_branch' } ] },
                    { name: 'create_new_from', label: 'Create new from this branch', api: [ { name: 'Git_new_from_branch' } ] },
                    { name: 'delete', label: 'Delete', api: [ { name: 'Git_delete_branch' } ] },
                ]
            },
            {
                name: 'status',
                label: 'Git Status',
                action: 'enter',
                tree: [
                    { name: 'add_file', label: 'Add file', api: [ { name: 'Git_add_file', args: { type: 'input_text' } } ] },
                    { name: 'add all', label: 'Add all', api: [ { name: 'Git_add_all' } ]}
                ]
            }
        ]
    }
};


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


class App extends Comp
{
    constructor(props)
    {
        super(props);
    }
    components = () =>
    {
        this.create_comp(`navigation`, Navigation, { title: `Navigation`, nav_manifest: Nav_Manifest, control: { } });
        //this.create_comp(`Body`, Content, { title: `Main Content` });
    }
    states = () =>
    {
        this.state(`main_pointer`, 0, { triggers: [ Controller.App.move_pointer ] });
        this.state(`key`, '');
    }
    actions = () =>
    {
        this.action(`start`, () =>
        {
        });
        this.action(`key_input`, (key) =>
        {
            this.state(`key`, key);
            this.get_comp(`navigation`).call_action(`key_motion`, key);
            //this.get_comp(`Body`).call_action(`navigate`, key);
        });
        
    };
    nav = (data) =>
    {
        this.call_action(`key_input`, data.direction);
        this.state(`main_pointer`, data.pointer);
    };
    draw = () =>
    {
        //return `Hello Key: ${ this.state(`key`) } - Pointer: ${ this.state(`main_pointer`) }
        //[comp:Navigation]
        //[comp:Body]`;
        //return `[comp:Body]`;
        return `[comp:navigation]`;
    };
}


CLI_Relast.run({
    name: 'git_manager',
    title: 'Git Manager',
    debug: true
}, App, (fw, app) =>
{
});
