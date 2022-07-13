const { Comp } = require('../cli_relast/comp.js');
const Rendering = require('../cli_relast/core/rendering.js');
const UI = require('../cli_relast/core/ui.js');

///////////////////////////////////////////////////////////////////

class Base extends Comp
{
    _child_indexer = [];
    _childs = [];
    constructor(props)
    {
        super(props);
    }

    add_childs = (k, child) =>
    {
        if(typeof k !== 'string' || typeof child === 'undefined') return;
        this._childs.push(child);
    }
}

class Render_Panel extends Base
{
    _window = null;
    constructor(props)
    {
        super(props);
    }
    get_window = () => { return this._window; }
    config_render_area = (props, type = 0) =>
    {
        if(type === UI.WINDOW.PANEL){
            Rendering.add_panel(this);
            this._window = new UI.Window(props);
        }else if(type === UI.WINDOW.MODAL){
            Rendering.add_modal(this);
            this._window = new UI.Modal(props);
        }
    }
}

class Modal extends Render_Panel
{
    constructor(props)
    {
        super(props);
    }
}

module.exports =
{
    Base: Base,
    Render_Panel: Render_Panel,
    Modal: Modal
};
