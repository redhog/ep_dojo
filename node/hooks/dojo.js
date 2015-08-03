plugins = require("ep_carabiner/static/js/plugins");
path = require("path");

dojoConfig = {
  baseUrl: module.paths[3], // Yes, dojo requires this to be one level too many down
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

exports.loadDojoModule = function(hook_name, args, cb) {
  try {
    global.dojoRequire([args.path], function (mod) {
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
    '<script type="text/javascript" src="/static/plugins/ep_dojo/static/dojo/dojo.js"></script>';
};
