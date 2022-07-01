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
    _childs = [];
    _print_items = [];
    constructor(props)
    {
        super(props);
        this._items = props.items && Array.isArray(props.items) ? props.items : [];
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
            this._childs[parent_name] = new Items({ items: item });
            return;
        }
        if(!this._childs[parent_name])
            this._childs[parent_name] = new Items();
        this._subitems[parent_name].add(item);
    }

    is_selectable = () => { return !this._items[this._index].disabled && !this._items[this._index].caption };
}

class Basic_menu extends Items
{
    _menu_ico = '--->';
    _menu_empty = '    ';
    _menu_group_close = '[+]';
    _menu_group_open = '[-]';
    _menu_group_item = '﬌';
    constructor(props)
    {
        super(props);

        if(props.icos)
        {
            this._menu_ico = props.icos.index || this._menu_ico;
            this._menu_empty = props.icos.space || this._menu_empty;
            if(props.icos.group)
            {
                this._menu_group_open = props.icos.group.open || this._menu_group_open;
                this._menu_group_close = props.icos.group.close || this._menu_group_close;
                this._menu_group_item = props.icos.group.item || this._menu_group_item;
            }
        }
    }
    commit = () =>
    {
        let commit_recursive = ( item ) =>
        {
            if(typeof item.toggle === 'undefined' || !item.toggle) return;
            for(let i of this._childs[item.name]._items)
            {
                i.subitem = true;
                this._print_items.push(i);
                commit_recursive(i);
            }
        }
        this._print_items = [];
        for(let i of this._items)
        {
            this._print_items.push(i);
            commit_recursive(i);
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
                    additions += `${ v.group ? `${ v.toggle ? this._menu_group_open : this._menu_group_close } ` : `- ` }`;
                    group_qty += ` (${ this._childs[v.name] ? this._childs[v.name]._items.length : `void` })`;
                }
                if(v.caption && !v.group)
                    str += `- ${ v.label }:${ Print.end_of_line() }`;
                else {
                    let substr = `${ v.subitem ? `${ this._menu_empty }${ this._menu_empty }${ this._menu_group_item }` : `` } `;
                    let permanent = `${ v.permanent && i === this._print_items.length - 1 ? Print.end_of_line() : `` }`;

                    let print_item = `${ this._index === i ? `${ Style.FgBlue }${ this._menu_ico }${ Style.Reset }` : this._menu_empty } ${ this._index === i ? Style.BgBlue : Style.Reset } ${ additions }${ substr }${ v.label }${ group_qty } ${ Style.Reset }${ Print.end_of_line() }`;
               
                    str += `${ permanent }${ print_item }`;
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
