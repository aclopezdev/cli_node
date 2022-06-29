/*jshint esversion:8*/

const {Gossipy} = require('./core/gossipy');
const {Print} = require('./core/output');
const controls = require('./controls');

class Comp 
{
    _props = null;
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
        this._props = props || {};
        this._parent = this._props.parent || this;
        this._main = this._props.main || this;
        this._app_config = this._props.config || {};

        if(!this._props._bbox) return;
        this._bbox = this._props.bbox;
    }

    init = () =>
    {
        if(this.states)
            this.states();
        if(this.components)
            this.components();
        if(this.controls)
            this.controls();
        if(this.actions)
            this.actions();
        this.call_action(`start`);
    }

    create_comp = (k, _class, props = {}) =>
    {
        if(!_class) return null;
        props.parent = this;
        props.main = this._main || this;
        props.config = this._app_config;
        this.add_comp(k, {class: _class, props: props});
        return this._comps[k];
    }

    get_comp = (name) =>
    {
        if(!name) return null;
        if(typeof name !== 'string') return null;
        return this._comps[name];
    }

    add_comp = (name, data) =>
    {
        if(!data || !name) return;
        if(typeof name !== 'string' || typeof data !== 'object') return;
        if(!data.class) return;
        if(typeof data.class !== 'function') return;
        data.name = name;
        data.bbox = data.bbox || this;
        this._comps[name] = new data.class(data.props);
        this._comps[name].init();
    }

    add_comps = (comps=[]) =>
    {
        for(let c of comps)
        {
            if(typeof c !== 'object') continue;
            if(!c.name || typeof c.name !== 'string') continue;
            this.add_comp(c.name, c.data);
        }
    };

    str_2_api_events = ( str_event ) =>
    {
        if(!this._props) return;
        if(!this._props.config) return;
        if(typeof str_event !== 'string') return str_event;
        return this._props.config.str_2_event(str_event);
    };

    state = (k, v = undefined, reducer) =>
    {
        if(v !== undefined && v !== null)
        {
            let keeper = this._states[k] || null;
            this._states[k] = v;
            Gossipy.add_gossip(Gossipy.GOSSIP.STATE_CHANGE);
            if(keeper !== undefined && keeper !== null)
            {
                this._prev_states[k] = keeper;
            }else{
                if(reducer)
                    this.reduce(k, reducer.triggers || []);
            }

            this.fire_reduce(k, (reducer || {}).args || {});
        }else{
            return this._states[k];
        }
    };

    reduce = (state, triggers) =>
    {
        if(!state || !triggers) return;
        this._reducers[state] = triggers;
    };

    fire_reduce = (state, args = {}) =>
    {
        if(!state) return;
        if(!this._reducers[state]) return;
        let buffer = this._reducers[state];
        if(!buffer) return;
        args.value = this._states[state];
        args.prev_value = this._prev_states[state];
        args.me = this;
        args.parent = this._parent;
        args.main = this._main;
        for(let trigger of buffer)
            if(typeof trigger === 'function') 
                trigger(args);
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

    action = (k, action) =>
    {
        this._actions[k] = action;
    }

    call_action = (k, args = {}) =>
    {
        if(this._actions)
        {
            if(this._actions[k])
            {
                this._actions[k](args);
            }
        }
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


