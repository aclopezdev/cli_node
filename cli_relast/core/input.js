/*jshint esversion:8*/
const {Gossipy, GOSSIP} = require('./gossipy');
const readline = require('readline');
const {Print} = require('./output');
const input = readline.createInterface({ input: process.stdin, output: process.stdout });
const stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

const interact = 
{
    _state: 0,
    _dispatchers: { insert: [], nav: [], kill: [] },
    _exit_key: '\u0003',
    _esc_key: '\u001B',
    _buffer_text: '',
    set_state: function( state )
    {
        this._state = state || interact.STATE.NAV;
    },
    on: function(type, cback)
    {
        if(type === interact.DISPATCHERS.NAV)
            this._dispatchers.nav.push(cback);
        else if(type === interact.DISPATCHERS.INSERT)
            this._dispatchers.insert.push(cback);
        else if(type === interact.DISPATCHERS.KILL)
            this._dispatchers.kill.push(cback);
    },
    run: function(cback=undefined)
    {
        stdin.on('data', (key) =>
        {
            if(this._state === interact.STATE.NAV)
            {
                let dir = interact.DIR.NONE;
                if (key === '\u001B\u005B\u0041')
                {
                    dir = interact.DIR.UP;
                }else if (key === '\u001B\u005B\u0042')
                {
                    dir = interact.DIR.DOWN;
                }else if(key === '\r')
                {
                    dir = interact.DIR.ENTER;
                }else if(key === '\t')
                {
                    dir = interact.DIR.TAB;
                }

                for(let d of this._dispatchers.nav)
                {
                    if(d) d({ state: interact.STATE.NAV, dir: dir, key: key });
                }

                if(cback)
                    cback({ state: NAV, data: dir, key: key });
            }else if(this._state === interact.STATE.INSERT)
            {
                if(key === '\r')
                {
                    for(let d of this._dispatchers.insert)
                    {
                        if(d) d({ state: interact.STATE.INSERT, data: this._buffer_text });
                    }
                    if(cback)
                        cback({ state: interact.STATE.INSERT, data: this._buffer_text });
                    this._state = interact.STATE.NAV;
                    this._buffer_text = ``;
                }else{
                    this._buffer_text += `${key}`;
                }
            }

            if(key === this._esc_key)
            {
                this._state = interact.STATE.NAV;
            }else
            if(key === this._exit_key)
            {
                for(let d of this._dispatchers.kill)
                {
                    if(d) d({ state: interact.STATE.KILL });
                }
                if(cback)
                    cback({ state: interact.STATE.KILL });
            }
        });
    },
};

interact.STATE =
{
    NAV: 0,
    INSERT: 1,
    KILL: -1
};

interact.DIR =
{
    NONE: 0,
    UP: -1,
    DOWN: 1,
    TAB: 99,
    ENTER: 1000
};

interact.DISPATCHERS =
{
    NAV: 0,
    INSERT: 1,
    KILL: -1
};

module.exports =
{
    Interact: interact
};

