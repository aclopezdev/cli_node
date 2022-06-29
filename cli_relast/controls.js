/*jshint esversion:8*/

const {Print} = require('./core/output');
const {Event, EVENT, Events} = require('./core/events');
const {Interact} = require('./core/input');
const {Style} = require('./core/color');

class Control
{
    _props = {};
    _id = ``;
    constructor(props)
    {
        this._id = props.id || Math.ceil(Math.random() * Date.now());
        this._props = props;
    }

    getId = () => { return this._id; }

    set_event = (event_type, callback = undefined) =>
    {
        let event = new Event(event_type, this, callback);
        Events.add( event, this );
    }
}

class Input_text extends Control
{
    _value = ``;
    constructor(props)
    {
        super(props);
    }

    get_value = () => { return this._value; }
    set_value = (txt) => { this._value = txt; }

    on = (event, callback = undefined) =>
    {
        this.set_event(event, callback);
    }

    draw = () =>
    {
        return ` [input text] `;
    }
}

class Items extends Control
{
    _items = [];
    _index = 0;
    _subitems = [];
    _print_items = [];
    constructor(props)
    {
        super(props);
    }

    add = (item) =>
    {
        if(!item) return;
        if(item.group)
        {
            item.toggle = false;
        }
        this._items.push(item);
    }

    add_subitems = (item, parent_name) =>
    {
        if(!item) return;
        if(Array.isArray(item))
        {
            this._subitems[parent_name] = item;
            return;
        }
        if(!this._subitems[parent_name])
            this._subitems[parent_name] = [];
        this._subitems[parent_name].push(item);
    }

    is_selectable = () => { return !this._items[this._index].disabled && !this._items[this._index].caption };
}

class Basic_menu extends Items
{
    _menu_ico = '--->';
    _menu_empty = '    ';
    constructor(props)
    {
        super(props);
        this._menu_ico = props.menu_ico || this._menu_ico;
        this._menu_empty = props.menu_empty || this._menu_empty;
    }
    commit = () =>
    {
        this._print_items = [];
        for(let i of this._items)
        {
            this._print_items.push(i);
            if(typeof i.toggle !== 'undefined' && i.toggle === true)
            {
                for(let si of this._subitems[i.name])
                {
                    si.subitem = true;
                    this._print_items.push(si);
                }
            }
        }
    }
    motion = (motion, cback) =>
    {
        if(motion === Interact.DIR.UP)
            this.up(cback);
        else if(motion === Interact.DIR.DOWN)
            this.down(cback);
        else if(motion === Interact.DIR.ENTER)
            this.enter(cback);
        else
            this.eval_over(cback);
    }
    up = (cback) =>
    {
        let offset = 1;
        this._index = Math.max( 0, this._index - offset );
        this.eval_over(cback);
    }
    down = (cback) =>
    {
        let offset = 1;
        this._index = Math.min( this._index + offset, this._print_items.length - 1 );
        this.eval_over(cback);
    }
    enter = (cback) =>
    {
        let item = this._print_items[this._index];
        if(!item) return;
        if(item.action)
        {
            if(typeof item.action === 'function')
                item.action(item);
            else if(typeof item.action === 'string')
            {
                if(item.action.toLowerCase().trim() === 'enter')
                {
                    if(this._props.onEnter)
                        this._props.onEnter(item);
                }
            }
        }
        if(item.onEnter)
        {
            if(cback && !item.group)
                cback({ item: item, event: item.onEnter });
        }
        if(this._props.onEnter && !item.group)
            this._props.onEnter({item: item})
        else if(item.group)
        {
            item.toggle = !item.toggle;
            this.commit();
        }
    }
    eval_over = (cback) =>
    {
        let item = this._print_items[this._index];
        if(!item) return;

        let onOver = (this._props || {}).onOver;
        if(onOver)
            onOver({ item: item });
        let over = item.onOver;
        if(!over) return;
        if(cback){
            cback({ item: item, event: over });
        }
    }
    draw = () =>
    {
        let str = ``;
        this._print_items.forEach( ( v, i ) =>
            {
                let additions = ``;
                let group_qty = ``;
                if(v.group)
                {
                    additions += `${ v.group ? `[${ v.toggle ? `-` : '+' }] ` : `- ` }`;
                    group_qty += ` (${ this._subitems[v.name].length })`;
                }
                if(v.caption && !v.group)
                    str += `- ${ v.label }:${ Print.end_of_line() }`;
                else {
                    let substr = `${ v.subitem ? ` ﬌ ` : `` }`;
                    let print_item = `${ substr }${ this._index === i ? `${ Style.FgBlue }${ this._menu_ico }${ Style.Reset }` : this._menu_empty } ${ this._index === i ? Style.BgBlue : Style.Reset } ${ additions }${ v.label }${ group_qty } ${ Style.Reset }${ Print.end_of_line() }`;
               
                    str += `${ print_item }`;
                }
            });
        return str;
    }
}

class Nav_system extends Control
{
    _head = -1;
    _menu = [];
    constructor(props)
    {
        super(props);
    }
    add = (k, menu) =>
    {
        this._menu[ k ] = menu;
    };
    select = (k) =>
    {
        this._head = k;
    }
    motion = (motion, cback) =>
    {
        this._menu[this._head].motion(motion, cback);
    }
    draw = () =>
    {
        let menu = this._menu[this._head];
        return menu ? menu.draw() : ``;
    }
}

module.exports =
{
    Control: Control,
    Basic_menu: Basic_menu,
    Input_text: Input_text,
    Nav_System_Control: Nav_system
}
