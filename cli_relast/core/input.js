/*jshint esversion:8*/
const {Gossipy, GOSSIP} = require('./gossipy');
const readline = require('readline');
const {Print} = require('./output');
const input = readline.createInterface({ input: process.stdin, output: process.stdout });
const rl = readline.createInterface(process.stdin);
const stdin = process.stdin;
const stdout = process.stdout;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

const interact = 
{
    _state: 0,
    _dispatchers: { insert: [], nav: [], kill: [], insert_main: [] },
    _exit_key: '\u0003',
    _esc_key: '\u001B',
    _buffer_text: '',
    _inserting: 0,
    _keypress: null,
    _cmd: null,
    set_state: function( state )
    {
        this._state = state || interact.STATE.NAV;
        if(state === interact.STATE.INSERT)
            this._inserting = 1;
    },
    on: function(type, cback, nullable=true)
    {
        if(type === interact.DISPATCHERS.NAV)
            this._dispatchers.nav.push(cback);
        else if(type === interact.DISPATCHERS.INSERT)
        {
            if(nullable)
                this._dispatchers.insert.push(cback);
            else
                this._dispatchers.insert_main.push(cback);
        }else if(type === interact.DISPATCHERS.KILL)
            this._dispatchers.kill.push(cback);
    },
    write_line: function(key, key_data)
    {
        if(key_data.name === 'backspace')
        {
            this._buffer_text = this._buffer_text.length > 0 ? this._buffer_text.substring(0, this._buffer_text.length - 1) : ``;
        }else{
            this._buffer_text += key;
        }
    },
    end_write_line: function( cback )
    {
        this._inserting = 0;
        this._state = interact.STATE.NAV;

        let data = this._buffer_text;
        this._buffer_text = '';
        for(let d of this._dispatchers.insert)
            if(d) d({ state: interact.STATE.INSERT, data: data });

        for(let d of this._dispatchers.insert_main)
            if(d) d({ state: interact.STATE.INSERT, data: data });

        if(cback)
            cback({ state: interact.STATE.INSERT, data: data });
        this._dispatchers.insert = [];
    },
    run: function(cback)
    {
        this._keypress =  (key, key_data) =>
        {
            if(this._state === interact.STATE.NAV)
            {
                let dir = interact.DIR.NONE;
                if (key_data.name === 'up')
                {
                    dir = interact.DIR.UP;
                }else if (key_data.name === 'down')
                {
                    dir = interact.DIR.DOWN;
                }else if(key_data.name === 'return')
                {
                    dir = interact.DIR.ENTER;
                }else if(key_data.name === 'tab')
                {
                    dir = interact.DIR.TAB;
                }

                for(let d of this._dispatchers.nav)
                {
                    if(d) d({ state: interact.STATE.NAV, dir: dir, key: key_data });
                }

                if(cback)
                    cback({ state: NAV, data: dir, key: key_data });
            }else if(this._state === interact.STATE.INSERT && this._inserting === 1)
            {
                if(key_data.name === 'return')
                {
                    this.end_write_line(cback);
                }else{
                    this.write_line(key, key_data);
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
        }
        stdin.on('keypress', this._keypress);
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

