import _ from 'lodash'
import Util from '@/app/Util'

const CLIENT_STORAGE_KEY_NAME = 'edit-text'
const UI_WIDTH = 250
const UI_MIN_HEIGHT = 200
const UI_MAX_HEIGHT = 450

class Controller {
  getOptions(): void {
    const isSendTextAtCmdAndEnter = Util.toBoolean(
      figma.root.getPluginData('isSendTextAtCmdAndEnter')
    )
    const isSetSelectionText = Util.toBoolean(figma.root.getPluginData('isSetSelectionText'))

    figma.ui.postMessage({
      type: 'getoptionssuccess',
      data: {
        isSendTextAtCmdAndEnter,
        isSetSelectionText
      }
    } as PluginMessage)

    console.log('getOptions success', isSendTextAtCmdAndEnter, isSetSelectionText)
  }

  setOptions(options: { isSendTextAtCmdAndEnter: boolean; isSetSelectionText: boolean }): void {
    figma.root.setPluginData('isSendTextAtCmdAndEnter', String(options.isSendTextAtCmdAndEnter))
    figma.root.setPluginData('isSetSelectionText', String(options.isSetSelectionText))

    figma.ui.postMessage({
      type: 'setoptionssuccess'
    } as PluginMessage)

    console.log(
      'setOptions success',
      figma.root.getPluginData('isSendTextAtCmdAndEnter'),
      figma.root.getPluginData('isSetSelectionText')
    )
  }

  resizeUI(height: number): void {
    let _height = height
    if (height < UI_MIN_HEIGHT) {
      _height = UI_MIN_HEIGHT
    }
    if (height > UI_MAX_HEIGHT) {
      _height = UI_MAX_HEIGHT
    }

    figma.ui.resize(UI_WIDTH, _height)
  }

  setText(text: string): void {
    console.log('setText', text)

    const selections = figma.currentPage.selection
    console.log('selections', selections)

    if (selections.length === 0) {
      console.log('nothing selection')
    } else {
      _.map(selections, async selection => {
        console.log(selection, selection.type)
        if (selection.type === 'TEXT') {
          const characterLength = selection.characters.length
          for (let i = 0; i < characterLength; i++) {
            await figma.loadFontAsync(selection.getRangeFontName(i, i + 1) as FontName)
          }
          selection.characters = text
        }
      })

      console.log('setText success')
      figma.ui.postMessage({
        type: 'settextsuccess'
      } as PluginMessage)
    }
  }

  onSelectionChange(): void {
    const selections = figma.currentPage.selection
    console.log('onSelectionChange', selections)

    if (selections && selections.length === 1 && selections[0].type === 'TEXT') {
      const textNode = selections[0]
      console.log('select only one text node', textNode)
    }
  }
}

const contoller = new Controller()

figma.showUI(__html__, { width: UI_WIDTH, height: UI_MIN_HEIGHT })

figma.ui.onmessage = async (msg: PluginMessage): Promise<void> => {
  console.log(msg)

  switch (msg.type) {
    case 'resize':
      contoller.resizeUI(msg.data.height)
      break
    case 'getoptions':
      contoller.getOptions()
      break
    case 'setoptions':
      contoller.setOptions({
        isSendTextAtCmdAndEnter: msg.data.isSendTextAtCmdAndEnter,
        isSetSelectionText: msg.data.isSetSelectionText
      })
      break
    case 'settext':
      contoller.setText(msg.data.text)
      break
    default:
      break
  }
}

figma.on('selectionchange', contoller.onSelectionChange)
