plugins = require("ep_carabiner/static/js/plugins");
path = require("path");
vm = require('vm');
fs = require('fs');

dojoConfig = {
  baseUrl: module.paths[3], // Yes, dojo requires this to be one level too many down, but module.paths[x] has an extra node_modules too
  async: 1, // We want to make sure we are using the "modern" loader
  has: {
    "host-node": 1, // Ensure we "force" the loader into Node.js mode
    "dom": 0, // Ensure that none of the code assumes we have a DOM
    "config-dojo-loader-catches": 1
  },
  packages: [
    {name: "dojo", location: "dojo"},
    {name: "dijit", location: "dijit"}
  ],
  deps: ["node_modules/ep_dojo/node/main.js"]
};

global.nodeRequire = require;
require("ep_dojo/node_modules/dojo/dojo.js");


mix = function(dest, src){
        for(var p in src){
                dest[p] = src[p];
        }
        return dest;
};

makeError = function(error, info){
        return mix(new Error(error), {src:"dojoLoader", info:info});
};

global.dojoRequire.injectUrl = function(url, callback) {
  try {
    vm.runInThisContext(fs.readFileSync(url, "utf8"), url);
    callback();
  } catch(e) {
    global.dojoRequire.signal('error', makeError("injectUrl", [e]));
  }
};

exports.errorStack = [];
exports.handleError = function(error) {
  if (exports.errorStack.length > 0) {
    exports.errorStack.pop()(error);
  }
}
global.dojoRequire.on("error", exports.handleError);

exports.loadDojoModule = function(hook_name, args, cb) {
  exports.errorStack.push(function (error) {
    args.errors.loadDojoModule = error;
    setTimeout(function () { cb([]); }, 0);
  });
  global.dojoRequire([args.path], function (mod) {
    exports.errorStack.pop();
    setTimeout(function () { cb([mod]); }, 0);
  });
};

exports.clientScripts = function(hook_name, args) {
  args.content += '' +
    '<script type="text/javascript" src="/static/plugins/ep_dojo/static/js/main.js"></script>' +
    '<script type="text/javascript" src="/static/plugins/ep_dojo/static/dojo/dojo.js"></script>';
};
