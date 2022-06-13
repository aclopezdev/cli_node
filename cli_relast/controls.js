/*jshint esversion:8*/

const {Print} = require('./core/output');
const {Event, EVENT, Events} = require('./core/events');
const {Interact} = require('./core/input');

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
    constructor(props)
    {
        super(props);
    }
    motion = (motion) =>
    {
        if(motion === Interact.DIR.UP)
            this.up();
        else if(motion === Interact.DIR.DOWN)
            this.down();
        else if(motion === Interact.DIR.ENTER)
            this.enter();
    }
    up = () =>
    {
        this._index = Math.max( 0, this._index - 1 );
    }
    down = () =>
    {
        this._index = Math.min( this._index + 1, this._items.length - 1 );
    }
    enter = () =>
    {
        let item = this._items[this._index];
        if(!item) return;
        if(!item.action) return;
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
    draw = () =>
    {
        let str = ``;
        this._items.forEach( ( v, i ) =>
            {
                str += `[${ this._index === i ? `--->` : `    ` }] ${ v.label }${ Print.end_of_line() }`;
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
    motion = (motion) =>
    {
        this._menu[this._head].motion(motion);
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
