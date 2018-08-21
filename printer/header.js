import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import printerStore from './store'
import _ from 'lodash'
import { getHeight } from './util'

@observer
class Header extends React.Component {
  componentDidMount () {
    const $dom = ReactDOM.findDOMNode(this)

    printerStore.setHeight({
      header: getHeight($dom)
    })
  }

  render () {
    const {blocks, style, pageIndex, data} = this.props

    return (
      <div className='gm-printer-header'>
        <div style={style}>
          {_.map(blocks, (cell, i) => (
            <div key={i} style={cell.style}>{printerStore.template(cell.text, pageIndex, data)}</div>
          ))}
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  blocks: PropTypes.array.isRequired,
  style: PropTypes.object,
  pageIndex: PropTypes.number,
  data: PropTypes.object.isRequired
}

export default Header
