
import {h} from 'preact'

module.exports = function(Component) {

  return class Message extends Component {

    constructor(props) {
      super(props)

      this.state = {}
    }


	  render() {
      const cssClass = c => this.props.type ? `${c} ${c}--${this.props.type}` : c

      return <div class={cssClass('alpha-app__message')}>
        <span>{this.props.txt}</span>
      </div>

	  }
  }
}
