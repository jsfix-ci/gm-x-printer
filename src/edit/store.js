import { observable, action, computed, configure } from 'mobx'
import { panelList } from '../config'
import _ from 'lodash'
import { exchange } from '../util'

configure({enforceActions: true})

class EditStore {
  @observable
  config = null

  // panel.header
  // panel.header.block.1
  // table.column.1
  @observable
  selected = null

  @observable
  insertPanel = panelList[0].value

  @computed
  get computedPrinterKey () {
    return _.map(this.config, (v, k) => {
      if (k === 'table') {
        return v.columns.length
      } else {
        return v.style ? v.style.height : ''
      }
    }).join('_')
  }

  @action
  setInsertPanel (panel) {
    this.insertPanel = panel
  }

  @computed
  get computedPanelHeight () {
    return this.config[this.insertPanel].style.height
  }

  @action
  setPanelHeight (height) {
    this.config[this.insertPanel].style.height = height
  }

  @action
  init () {
    this.config = null
    this.selected = null
    this.insertPanel = panelList[0].value
  }

  @action
  setConfig (config) {
    this.config = config
  }

  @action
  setSelected (selected = null) {
    this.selected = selected
  }

  @computed
  get computedIsSelectPanel () {
    return this.selected && this.selected.split('.').length === 2
  }

  @computed
  get computedIsSelectBlock () {
    return this.selected && this.selected.split('.').length === 4
  }

  @computed
  get computedIsSelectTable () {
    return this.selected && this.selected.split('.').length === 3
  }

  @computed
  get computedSelectedInfo () {
    if (!this.selected) {
      return null
    }

    const arr = this.selected.split('.')
    if (arr.length === 2) {
      return this.config[arr[1]]
    } else if (arr.length === 4) {
      return this.config[arr[1]].blocks[arr[3]]
    } else if (arr.length === 3) {
      return this.config.table.columns[arr[2]]
    }
  }

  @action
  setConfigBlock (who, value) {
    if (!this.computedIsSelectBlock) {
      return
    }

    const block = this.computedSelectedInfo
    block[who] = value
  }

  @action
  addConfigBlock (panel, type) {
    if (!type || type === 'text') {
      this.config[panel].blocks.push({
        text: '请编辑',
        style: {
          position: 'absolute',
          left: '0px',
          top: '0px'
        }
      })
    } else if (type === 'line') {
      this.config[panel].blocks.push({
        type: 'line',
        style: {
          position: 'absolute',
          left: '0px',
          top: '0px',
          borderTopColor: 'black',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          width: '100%'
        }
      })
    } else if (type === 'image') {
      this.config[panel].blocks.push({
        type: 'image',
        link: '',
        style: {
          position: 'absolute',
          left: '0px',
          top: '0px',
          width: '100px',
          height: '100px'
        }
      })
    } else {
      window.alert('出错啦，未识别类型，此信息不应该出现')
    }
  }

  @action
  setConfigTable (who, value) {
    if (!this.computedIsSelectTable) {
      return
    }

    const column = this.computedSelectedInfo
    column[who] = value
  }

  @action
  exchangeTableColumn (target, source) {
    if (this.computedIsSelectTable) {
      exchange(this.config.table.columns, target, source)
    }
  }

  @action
  addTableColumn () {
    this.config.table.columns.push({
      head: '表头',
      headStyle: {
        textAlign: 'center'
      },
      text: '内容',
      style: {
        textAlign: 'center'
      }
    })
  }

  @action
  removeConfig () {
    if (this.computedIsSelectBlock) {
      const arr = this.selected.split('.')
      this.selected = null
      this.config[arr[1]].blocks.splice(arr[3], 1)
    } else if (this.computedIsSelectTable) {
      const arr = this.selected.split('.')
      this.selected = null
      this.config.table.columns.splice(arr[2], 1)
    }
  }
}

const editStore = new EditStore()

export default editStore
