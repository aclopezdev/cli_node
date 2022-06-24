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
    constructor(props)
    {
        super(props);
    }

    add = (item) =>
    {
        if(!item) return;
        this._items.push(item);
    }
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
    motion = (motion, cback) =>
    {
        if(motion === Interact.DIR.UP)
            this.up(cback);
        else if(motion === Interact.DIR.DOWN)
            this.down(cback);
        else if(motion === Interact.DIR.ENTER)
            this.enter(cback);
    }
    up = (cback) =>
    {
        this._index = Math.max( 0, this._index - 1 );
        this.eval_over(cback);
    }
    down = (cback) =>
    {
        this._index = Math.min( this._index + 1, this._items.length - 1 );
        this.eval_over(cback);
    }
    enter = (cback) =>
    {
        let item = this._items[this._index];
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
            if(cback)
                cback({ item: item, event: item.onEnter });
        }
    }
    eval_over = (cback) =>
    {
        let over = this._items[this._index].onOver;
        if(!over) return;
        if(cback){
            cback({ item: this._items[this._index], event: over });
        }
    }
    draw = () =>
    {
        let str = ``;
        this._items.forEach( ( v, i ) =>
            {
                str += `${ this._index === i ? `${ Style.FgBlue }${ this._menu_ico }${ Style.Reset }` : this._menu_empty } ${ this._index === i ? Style.BgBlue : Style.Reset } ${ v.label } ${ Style.Reset }${ Print.end_of_line() }`;
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
