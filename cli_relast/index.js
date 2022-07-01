/*jshint esversion:8*/

const { Engine, Nav_System, Viewer } = require('./engine');
const { Print } = require('./core/output');

function Relast()
{
    let app = null;
    let _manifest = null;

    let run = (props, App) =>
    {
        Print._debug = props.debug || false;
        this._manifest = props.manifest;
        App_conf.setup(props.api || {});
        App_conf.api_in_manifest(this._manifest || {});
        let app_props = props;
        app_props.config = App_conf;
        app_props.manifest = this._manifest;
        this.app = new App(props);
        Engine.init({
            app: this.app,
            sync: props.sync || 100,
            config: App_conf,
            manifest: this._manifest
        });
        Engine.run();
    }

    let _public =
    {
        run: run,
        app: () => { return this.app; },
        config: App_conf
    }

    return _public;
}

const App_conf =
{
    _api_data: null,
    setup: function(api, manifest)
    {
        if(!api) return;
        this._api_data = api;
    },
    api_in_manifest: function(manifest)
    {
        let new_manifest = { main: null };
        if(!manifest.main) return;
        new_manifest.main = this.to_api(manifest.main);
        return new_manifest;
    },
    to_api: function( node )
    {
        if(!node) return;
        
        if(typeof node.onOver === `string`)
        {
           node.onOver = this.str_2_event(node.onOver); 
        }
        if(typeof node.onEnter === 'string')
        {
           node.onEnter = this.str_2_event(node.onEnter);
        }
        if(!node.tree) return node;
        for(let c in node.tree)
        {
            node.tree[c] = this.to_api(node.tree[c]);
        }
        return node;
    },
    api_in_manifest_test: function(manifest)
    {
        let new_manifest = { main: null };
        if(!manifest.main) return;
        new_manifest.main = this.to_api_testing(manifest.main);
        return new_manifest;
    },
    to_api_testing: function( node )
    {
        if(!node) return;
        let new_node = {};
        for(let p in node)
        {
            if(p.trim() === 'tree') continue;
            new_node[p] = node[p];
        }
        Print.log([node.name, new_node.name]);
        if(typeof node.onOver === `string`)
        {
           new_node.onOver = this.str_2_event(node.onOver); 
        }
        if(typeof node.onEnter === 'string')
        {
            new_node.onEnter = this.str_2_event(node.onEnter);
        }
        if(!node.tree) return new_node;
        new_node.tree = [];
        for(let c of node.tree)
        {
            if(typeof c === 'undefined') continue;
            let newc = this.to_api_testing(c);
            new_node.tree.push(newc);
        }
        return new_node;
    },

    str_2_event: function(str)
    {
        let api_str = str;
        let api_path = api_str.split('/');
        let aux = this._api_data;
        for(let p of api_path)
        {
            if(p === 'Api') continue;
            if(aux[p])
                aux = aux[p];
        }
        return aux;
    }
};

module.exports =
{
    Comp: require('./comp').Comp,
    Controls: require('./controls'),
    Engine: Engine,
    Nav_System: Nav_System,
    Relast: new Relast(),
    Log: Print.log,
    Print: Print,
    Viewer: Viewer 
}

