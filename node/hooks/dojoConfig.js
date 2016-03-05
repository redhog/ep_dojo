plugins = require("ep_carabiner/static/js/plugins");
hooks = require("ep_carabiner/static/js/hooks");

exports.dojoConfig = function(hook_name, args) {
  args.packages = hooks.callAll("packages");
  hooks.callAll("paths", args.paths);
};

exports.packages = function(hook_name, args) {
  return [
    {name: "dojo", location: "dojo"},
    {name: "dijit", location: "dijit"}
  ];
};

exports.paths = function(hook_name, args) {
};

exports.clientDojoConfig = function(hook_name, args) {
  args.packages = hooks.callAll("clientPackages");
  hooks.callAll("clientPaths", args.paths);
};

exports.clientPackages = function(hook_name, args) {
  return [
    {name: "dojo", location: "/static/plugins/ep_dojo/static/dojo"},
    {name: "dijit", location: "/static/plugins/ep_dojo/static/dijit"}
  ];
};

exports.clientPaths = function(hook_name, args) {
  args.underscore = "/static/plugins/underscore/static/underscore";
  args.async = "/static/plugins/async/static/lib/async";
  args.jquery = "/static/plugins/ep_express/static/js/rjquery";
};
