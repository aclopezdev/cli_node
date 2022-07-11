/*jshint esversion:8*/

const {Gossipy} = require('./core/gossipy');
const {Print} = require('./core/output');
const Reducer = require('./core/reducer');
const controls = require('./controls');

class Comp 
{
    _props = null;
    _name = '';
    _main = null;
    _parent = null;
    _bbox = null;
    _app_config = null;
    _comps = {};
    _actions = {};
    _states = [];
    _prev_states = [];
    _cmds = [];
    _controls = [];
    _screen = ``;
    _reducers = [];
    constructor(props)
    {
        this._name = props.name;
        this._props = props || {};
        this._parent = this._props.parent || this;
        this._main = this._props.main || this;
        this._app_config = this._props.config || {};

        this._bbox = this._props.bbox || this._name;
    }

    init = () =>
    {
        if(this.states)
            this.states(this._props);
        if(this.components)
            this.components(this._props);
        if(this.controls)
            this.controls(this._props);
        if(this.actions)
            this.actions(this._props);
        if(this.app_logic)
            this.app_logic(this._props);
        if(typeof this._props.helpers && Array.isArray(this._props.helpers))
        {
            for(let h of this._props.helpers)
            {
                if(typeof h === 'function')
                    h({ self: this, props: this._props });
            }
        }
        this.action(`start`);
    }

    comp = (name) =>
    {
        if(!name) return null;
        if(typeof name !== 'string') return null;
        return this._comps[name];
    }

    add_comp = (Class, name, props = {}) =>
    {
        if(typeof Class !== 'undefined' || typeof name !== 'string') return;

        props.name = name;
        props.bbox = data.bbox || this;
        props.class = Class;
        props.parent = this;
        props.main = this._main || this;
        props.config = this._app_config;

        this._comps[name] = new Class(props);
        this._comps[name].init();
    }

    add_comps = (comps=[]) =>
    {
        for(let c of comps)
        {
            if(typeof c !== 'object') continue;
            if(!c.name || typeof c.name !== 'string') continue;
            this.add_comp(c.class, c.name, c.props);
        }
    };

    str_2_api_events = ( str_event ) =>
    {
        if(!this._props) return;
        if(!this._props.config) return;
        if(typeof str_event !== 'string') return str_event;
        return this._props.config.str_2_event(str_event);
    };

    state = (k, v = undefined) =>
    {
        if(v !== undefined && v !== null)
        {
            let keeper = this._states[k] || null;
            this._states[k] = v;
            Gossipy.add_gossip(Gossipy.GOSSIP.STATE_CHANGE);
            if(keeper !== undefined && keeper !== null)
            {
                this._prev_states[k] = keeper;
            }
            Reducer.call(this._name, k, { self: this, state_name: k, last_state: this._prev_states[k], state: this._states[k] });
        }else{
            return this._states[k];
        }
    };

    get_control = (k) =>
    {
        if(!k) return null;
        return this._controls[k];
    }

    add_control = (k, _control, props = {}) =>
    {
        if(!k || !_control) return null;
        if(typeof k !== 'string' || typeof _control !== 'function') return null;
        this._controls[k] = new _control(props);
        return this._controls[k];
    }

    print_comps = (body) =>
    {
        let buffer = body.match(/\[comp\:[a-z|A-Z|0-9|\_]+\]/g);
        if(buffer)
        {
            for(let c of buffer)
            {
                let tag = c.replace('[comp:', '').replace(']', '');
                let comp_name = tag.trim();
                let comp = this._comps[comp_name];
                if(!comp) continue;
                let comp_body = `${comp._props.title ? Print.subtitle(comp._props.title, false) : ``}${comp.draw ? comp.draw() : ``}`;
                comp_body = `${ comp.print_comps(comp_body) }`;
                comp_body = comp.print_controls(comp_body);
                body = body.replace(c, comp_body);
            }
        }
        return body;
    };

    print_controls = (body) =>
    {
        let buffer = body.match(/\[control\:[a-z|A-Z|0-9|\_]+\]/g);
        if(!buffer) return body;
        for(let c of buffer)
        {
            let name = c.replace(`[control:`, ``).replace(`]`, ``).trim();
            let control = this._controls[name];
            if(!control) continue;
            let control_body = ``;
            if(control.draw)
                control_body = control.draw();
            body = body.replace(c, control_body);
        }
        return body;
    }

    action = (k, action = {}) =>
    {
        if(typeof k !== 'string') return;
        if(typeof action === 'function')
            return this._actions[k] = action;
        if(typeof this._actions[k] === 'function')
            return this._actions[k]( this, action, this._props );
        return;
    }

    page = () =>
    {
        let body = this.draw ? this.draw() : ``;
        body = this.print_comps(body);
        body = this.print_controls(body);
        body = body.replace(/[\r|\n]*/g, '');
        body = body.replace(/\%EOL\%/g, '\n');
        if(this._props.title)
            Print.title(this._props.title);
        Print.label(body);
    };

    
}

exports.Comp = Comp;


