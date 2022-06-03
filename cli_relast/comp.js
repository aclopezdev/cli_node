/*jshint esversion:8*/

const {Gossipy} = require('./core/gossipy');
const {Print} = require('./core/output');
const controls = require('./controls');

class Comp 
{
    _props = null;
    _bbox = null;
    _comps = {};
    _actions = {};
    _states = [];
    _prev_states = [];
    _cmds = [];
    _controls = [];
    _screen = ``;
    constructor(props)
    {
        this._props = props || {};
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
    }

    create_comp = (k, _class, props = {}) =>
    {
        if(!_class) return null;
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
    }
    state = (k, v = undefined) =>
    {
        if(v !== undefined && v !== null)
        {
            let keeper = this._states[k] || null;
            this._states[k] = v;
            Gossipy.add_gossip(Gossipy.GOSSIP.STATE_CHANGE);
            if(this._states[k] !== undefined && this._states[k] !== null)
            {
                this._prev_states[k] = keeper;
            }
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
                comp_body = `\n${ comp.print_comps(comp_body) }`;
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
        if(this._props.title)
            Print.title(this._props.title);
        Print.label(body);
    };

    
}

exports.Comp = Comp;


