/*jshint esversion: 8*/
const { CLI_Relast, Comps } = require('./index');
const { Relast, Comp, Log } = CLI_Relast;
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
    console.log(items);
} );
Git.status( (items) =>
{
    console.log(items);
} );






const Controller =
{
    App: {
        move_pointer: args =>
        {
            Log(98997);
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
                console.log(items);
            } );
        });
    }
    draw = () =>
    {
        return `${ this.state(`resp`) }`;
    }
}







class Content extends Body
{
    constructor(props)
    {
        super(props);
    }
    components = () =>
    {
        this.create_comp(`Git_branches`, Branches, { title: `Branches manager` });
        this.create_comp(`Git_status`, Status, { title: `Git Status` });
    }
    states = () =>
    {
        this.state(`branch`, ``);
        this.state(`content`, `Git_branches`);
    }
    actions = () =>
    {
        this.action(`change_content`, value =>
            {
                if(typeof value !== 'string') return;
                this.state(`content`, value);
            });
    }
    draw = () =>
    {
        return `[comp:${ this.state(`content`) }]`;
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
        this.create_comp(`Navigation`, Nav_Path);
        this.create_comp(`Body`, Content, { title: `Main Content` });
    }
    states = () =>
    {
        this.state(`main_pointer`, 0, { triggers: [ Controller.App.move_pointer ] });
        this.state(`key`, '');
    }
    actions = () =>
    {
        this.action(`key_input`, (key) =>
        {
            this.state(`key`, key);
        });
    };
    nav = (data) =>
    {
        this.call_action(`key_input`, data.direction);
        Log(12212);
        this.state(`main_pointer`, data.pointer);
    };
    draw = () =>
    {
        return `Hello Key: ${ this.state(`key`) } - Pointer: ${ this.state(`main_pointer`) }
        [comp:Navigation]
        [comp:Body]`;
    };
}


CLI_Relast.run({
    name: 'git_manager',
    title: 'Git Manager',
    debug: true
}, App, (fw, app) =>
{
});
