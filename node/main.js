/* This is kind of a hack... It seems dojo only re-defines require
 * inside dojo-loaded modules wen run non-interactively, so we have to
 * have this module to get to it.
 */
global.dojoRequire = require;
