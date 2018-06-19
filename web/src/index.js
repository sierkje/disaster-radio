
import {h, render, Component as PreactComponent} from 'preact'
import Socket from './core/lib/js/socket'
import ashnazg from 'ashnazg'
import cipher from './core/lib/js/cipher'

const Component = ashnazg(PreactComponent)
var Chat = require('./apps/chat')(Component)

function renderAll() {
  var container = document.getElementById('container');
  var replace;

  if(container.children.length) {
    replace = container.children[0];
  }

  render(<Chat state />, container, replace);
}




function init() {
  app.socket = new Socket('/ws', {debug: true});

  app.socket.connect(function(err, isConnected) {

    console.log("connected:", isConnected);
    if(err) console.error(err);

  });

  app.actions = require('./apps/chat/actions');

  renderAll();
  try {
    cipher.init();
  } catch(e) {
    console.error(e);
    alert("Fatal error:", e);
  }
}



// hot module reloading
if(module.hot) {
  module.hot.accept();
}

init();



