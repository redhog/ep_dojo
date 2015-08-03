dojoConfig = {
  baseUrl: "/static/plugins/",
  async: 1, // We want to make sure we are using the "modern" loader
  packages: [
    {name: "dojo", location: "/static/plugins/ep_dojo/static/dojo"},
    {name: "dijit", location: "/static/plugins/ep_dojo/static/dijit"}
  ],
  paths: {
    'underscore': "/static/plugins/underscore/static/underscore",
    'async': "/static/plugins/async/static/lib/async",
    'jquery': "/static/plugins/ep_express/static/js/rjquery"
  },
  callback: function () {
    requireDojo = require;
    requireDojo(
      [
        'ep_express/static/js/rjquery',
        'ep_carabiner/static/js/client_plugins',
        'ep_carabiner/static/js/hooks',
        'ep_express/static/js/browser',
        'async'
      ], function ($, plugins, hooks, browser, async) {
        window.$ = $; // Expose jQuery #HACK
        window.jQuery = $;

        window.loadDojoModule = function(hook_name, args, cb) {
          requireDojo([args.path], function (mod) {
            cb([mod]);
          }, function (error) {
            args.errors.loadDojoModule = error;
            cb([]);
          });
        }

        if ((!browser.msie) && (!(browser.mozilla && browser.version.indexOf("1.8.") == 0))) {
          document.domain = document.domain; // for comet
        }

        plugins.ensure(function () {
          hooks.plugins = plugins;

          // Call documentReady hook
          $(function() {
            plugins.callPageLoaded();
          });
        });
      }
    );
  }
};

