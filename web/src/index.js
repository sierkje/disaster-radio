
import { h, render, Component as PreactComponent } from 'preact'
import ashnazg from 'ashnazg'
import Socket from './core/lib/js/socket'
import cipher from './core/lib/js/cipher'
import makeAlphaApp from './apps/alpha'
import alphaAppActions from './apps/alpha/actions'

const Component = ashnazg(PreactComponent)
const AlphaApp = makeAlphaApp(Component)
const container = document.getElementById('container')

function init() {
  /* eslint-disable-next-line global-require */
  app.actions = alphaAppActions
  app.socket = new Socket('/ws', { debug: true })
  app.socket.connect((err, isConnected) => {
    /* eslint-disable-next-line no-console */
    console.log('connected:', isConnected)
    /* eslint-disable-next-line no-console */
    if (err) console.error(err)
  })

  render(<AlphaApp state />, container, (container.children.length)
    ? container.children[0]
    : undefined)

  try {
    cipher.init()
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.error(e)
    /* eslint-disable-next-line no-alert */
    alert('Fatal error:', e)
  }
}

// hot module reloading
if (module.hot) module.hot.accept()

init()
