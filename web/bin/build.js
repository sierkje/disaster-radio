#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var colors = require('colors');
var browserify = require('browserify');
var watchify = require('watchify');
var hmr = require('browserify-hmr');
var minimist = require('minimist');

function getTime() {
  var d = new Date;
  var t = [d.getHours(), d.getMinutes(), d.getSeconds()];
  t = t.map(function(i) {
    return (i < 9) ? '0'+i : i;
  })
  return t[0] + ':' + t[1] + '.' + t[2];
}

function build(opts) {
  opts = opts || {};

  var output = path.join(__dirname, '..', 'static', 'assets', 'disaster.radio.js');

  function onBuildEnd(msg) {
    console.log("Completed".green + ((msg) ? (': ' + msg) : ''));
  }

  function onBuildStart() {

    process.stdout.write("Build started at " + getTime() + "... ");

    var outStream = fs.createWriteStream(output);

    if(!opts.dev) {
      outStream.on('close', onBuildEnd);
    }

    b.bundle()

      .on('error', function(err) {
        if(err instanceof SyntaxError && err.message.match(/while parsing file/)) {
          // Format syntax error messages nicely
          var re = new RegExp(err.filename+'\:? ?');
          var msg = err.message.replace(re, '');
          msg = msg.replace(/ while parsing file\:.*/, '');
          console.error();
          console.error("\nError: ".red + msg.underline);
          console.error();
          console.error("Filename:", err.filename);
          console.error();
          console.error(err.loc);
          console.error();
          console.error(err.codeFrame);
          console.error();
        } else {
          console.error(err);
        }

      })

      .pipe(outStream);
  }

  var b = browserify({
    entries: [path.join(__dirname, '..', 'src', 'core', 'index.js')],
    cache: {},
    packageCache: {}
  })

  if(opts.dev) {
    console.log("Watching for changes...".yellow);
    b.plugin(watchify);
  }

  if(opts.hot) {
    console.log("Hot module reloading enabled".yellow);
    b.plugin(hmr);
  }

  b.on('update', function(time) {
    onBuildStart();
  });

  if(opts.dev) {
    b.on('log', onBuildEnd);
  }

  b.transform('babelify', {
    presets: [
      'es2015'
    ],
    plugins: [
      ['transform-react-jsx', {pragma: 'h'}]
    ]
  })

  onBuildStart();
}

const findApps = () => {
  const tmpFolderPath = path.join(__dirname, '..', '.tmp');
  const tmpFilePath = path.join(tmpFolderPath, 'disaster.app_info.js');
  const appsFolderPath = path.join(__dirname, '..', 'src', 'apps');
  const appInfoFileName = 'disaster.app.js';
  if (!fs.existsSync(tmpFolderPath)) {
    fs.mkdir(tmpFolderPath);
    console.log('The .tmp folder was deleted, so it was created.');
  }
  const toCamelCase = str => str.replace(/-_\w/g, x => x[1].toUpperCase)
  fs.writeFileSync(tmpFilePath, (() => {
    let content = [];
    const apps = fs.readdirSync(appsFolderPath)
      .map(x => ({
        name: x.replace(/-_\w/g, str => str[1].toUpperCase),
        folder: path.join(appsFolderPath, x),
        file: path.join(appsFolderPath, x, appInfoFileName),
      }))
      // Only folders can contain apps:
      .filter(x => fs.lstatSync(x.folder).isDirectory())
      // Apps must provide a disaster.radio.js file:
      .filter(x => fs.existsSync(x.file));
    for (app of apps) {
      content.push('import { default as ' + app.name + ' } from "' + app.file + '";\n\n');
    }
    content.push('const appInfo = [\n');
    for (app of apps) {
      content.push('  (deps) => ' + app.name + '(deps),\n');
    }
    content.push('];\n\n');
    content.push('export default appInfo;\n');
    return content.join('');
  })(), 'utf8');
};

if (require.main === module) {

  var argv = minimist(process.argv.slice(2), {
    alias: {
      d: 'dev'
    },
    boolean: [
      'dev',
      'hot'
    ],
    default: {}
  });

  findApps();
  build(argv);

} else {

  module.exports = {
    build: build,

    watch: function(opts) {
      opts = opts || opts;
      opts.dev = true;
      return build(opts);
    },

    hot: function(opts) {
      opts = opts || opts;
      opts.dev = true;
      opts.hot = true;
      return build(opts);
    },

    findApps,
  }

}
