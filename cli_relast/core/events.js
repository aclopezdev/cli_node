/*jshint esversion:8*/

class event
{
    _type = ``;
    _event = null;
    _value = undefined;
    _control = null;
    constructor(type, control, event)
    {
        this._type = type;
        this._event = event;
    }
    fire = () =>
    {
        if(this._event)
            this._event(this._value);
    }
}

const EVENT =
{
    KEYUP: `onkeyup`,
    CHANGE: `onchange`
}

const buffer = 
{
    _buffer: [],
    add: function(event, control)
    {
        let id = `event_${control.getId()}`;
        if(!this._buffer[id])
        {
            this._buffer[id] = [];
        }
        this._buffer[id].push(event);
    },
    fire: function(control_id, event_type)
    {
        let id = `event_${control_id}`;
        for(let e of this._buffer[id])
        {
            if(e.get_type() === event_type)
                e.fire()
        }
    }
};

module.exports = 
{
    Event: event,
    Events: buffer,
    EVENT: EVENT
}
