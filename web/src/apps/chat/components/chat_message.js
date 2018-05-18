
import {h} from 'preact'

module.exports = function(Component) {

  return class ChatMessage extends Component {

    constructor(props) {
      super(props)

      this.state = {}
    }


	  render() {
      const cssClass = c => this.props.type ? `${c} ${c}--${this.props.type}` : c

      return <div class={cssClass('chat-app__message')}>
        <span>{this.props.txt}</span>
      </div>

	  }
  }
}
