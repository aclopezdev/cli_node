/*jshint esversion:8*/

const {Event, EVENT, Events} = require('./core/events');

class Control
{
    _props = {};
    _id = ``;
    constructor(props)
    {
        this._id = Math.ceil(Math.random() * Date.now());
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
}

module.exports =
{
    Control: Control,
    Basic_menu: Basic_menu,
    Input_text: Input_text
}
