plugins = require("ep_carabiner/static/js/plugins");
path = require("path");

dojoConfig = {
  baseUrl: module.paths[3],
  async: 1, // We want to make sure we are using the "modern" loader
  hasCache: {
    "host-node": 1, // Ensure we "force" the loader into Node.js mode
    "dom": 0 // Ensure that none of the code assumes we have a DOM
  },
  packages: [
    {name: "dojo", location: "dojo"},
    {name: "dijit", location: "dijit"}
  ],
  deps: ["node_modules/ep_dojo/node/main.js"]
};

global.nodeRequire = require;
require("ep_dojo/node_modules/dojo/dojo.js");

exports.normalizePath = function(modpath) {
  var first = modpath.substr(0, 1);
  if (first != "." && first != "/") {
    var idx = modpath.indexOf("/");
    var plugin_name = modpath.substring(0, idx);
    modpath = modpath.substring(idx + 1);
    modpath = path.normalize(path.join(plugins.plugins[plugin_name].package.path, modpath));
  }
  if (modpath.substr(-3) != ".js") {
    modpath += ".js";
  }
  return modpath;
}

exports.loadDojoModule = function(hook_name, args, cb) {
  try {
    global.dojoRequire([exports.normalizePath(args.path)], function (mod) {
      cb([mod]);
    }, function (error) {
      args.errors.loadDojoModule = error;
      cb([]);
    });
  } catch (error) {
    args.errors.loadDojoModule = error;
    cb([]);
  }
};

exports.clientScripts = function(hook_name, args) {
  args.content += '' +
    '<script type="text/javascript" src="/static/plugins/ep_dojo/static/js/main.js"></script>' +
    '<script type="text/javascript" src="/static/plugins/ep_express/static/js/jquery.js"></script>' +
    '<script type="text/javascript" src="/static/plugins/ep_dojo/node_modules/dojo/dojo.js"></script>';
};
