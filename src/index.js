import React, { Component } from 'react'
import { render } from 'react-dom'
import loadable from '@loadable/component'

const Hello = loadable(() => import('./Hello'))
const Dynamic = loadable(p => import(`./${p.name}`), {
  cacheKey: p => p.name,
})
const Moment = loadable.lib(() => import('moment'))

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: null
    }
  }

  render() {
    const { name } = this.state;
    return (
      <div>
        <button type="button" onClick={() => {
          this.setState({
            name: 'A'
          })
        }}>
          Go to A
        </button>
        <button type="button" onClick={() => {
            this.setState({
              name: 'B'
            })
        }}>
          Go to B
        </button>
        {name && <Dynamic name={name} />}
        <Hello />
        <Moment>{({ default: moment }) => moment().format('HH:mm')}</Moment>
      </div>
    )
  }
}

const root = document.createElement('div')
document.body.append(root)

render(<App />, root)
