
import {h} from 'preact'

module.exports = function(Component) {

  var Message = require('./components/message')(Component)

  return class Alpha extends Component {

    constructor(props) {
      super(props)

      this.setState({
        messages: []
      });
      app.socket.addListener('@', this.receive)
    }

    scrollBottom() {
      var alpha = document.getElementById('alpha');
      alpha.scrollTop = alpha.scrollHeight;
    }

    receive(namespace, data) {
      app.actions.alpha.showMessage(data.toString('utf8'));
    }

    send(e) {
      e.preventDefault()
      var inp = document.getElementById('alphaInput')

      app.actions.alpha.sendMessage(inp.value, function(err) {
        if(err) return;

        inp.value = '';
        inp.placeholder = '';
      });
    }

    componentDidUpdate() {
      this.scrollBottom()
    }

	  render() {

      var messages = this.state.messages.map(function(o) {
        // TODO is there a simpler way of passing a bunch of properties?
        return <Message txt={o.txt} type={o.type} />
      }, this)

		  return <div>
        <form id="alphaForm" class="alpha-app" action="/alpha" method="POST" onsubmit={this.send}>
          <div id="alpha" class="alpha-app__messages">
            {messages}
          </div>
          <input id="alphaInput" class="alpha-app__input" type="text" name="msg" placeholder="Enter you name or alias" autofocus />
        </form>
      </div>
	  }
  }
}
