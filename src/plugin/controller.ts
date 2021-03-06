import _ from 'lodash'
import Util from '@/app/Util'

const CLIENT_STORAGE_KEY_NAME = 'edit-text'
const UI_WIDTH = 300
const UI_MIN_HEIGHT = 300
const UI_MAX_HEIGHT = 450

class Controller {
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

  getOptions(): void {
    const isEditRealtime = Util.toBoolean(figma.root.getPluginData('isEditRealtime'))

    figma.ui.postMessage({
      type: 'getoptionssuccess',
      data: {
        isEditRealtime
      }
    } as PluginMessage)

    console.log('getOptions success', isEditRealtime)
  }

  setOptions(options: Options): void {
    figma.root.setPluginData('isEditRealtime', String(options.isEditRealtime))

    figma.ui.postMessage({
      type: 'setoptionssuccess'
    } as PluginMessage)

    console.log('setOptions success', figma.root.getPluginData('isEditRealtime'))
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
          console.log('selection.characters', selection.characters, 'text', text)
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

    const _selections: string[] = []
    if (selections.length > 0) {
      _.map(selections, async selection => {
        _selections.push(selection.id)

        // テキストの場合、フォントをロードする
        if (selection.type === 'TEXT') {
          const selectionRange = selection.characters.length
          for (let i = 0; i < selectionRange; i++) {
            await figma.loadFontAsync(selection.getRangeFontName(i, i + 1) as FontName)
          }
          console.log(`${selection.id} font loaded`)
        }
      })
    }
    figma.ui.postMessage({
      type: 'selectionchange',
      data: {
        selections: _selections
      }
    } as PluginMessage)

    // 一つ以上選択しているとき
    if (selections.length > 0) {
      // 一つだけ選択しているとき
      if (selections.length === 1) {
        // それがテキストのとき
        if (selections[0].type === 'TEXT') {
          const textNode = selections[0]
          const selectedTextRange = figma.currentPage.selectedTextRange
          console.log('select only one text node', textNode)

          if (
            selectedTextRange &&
            (selectedTextRange.start !== selectedTextRange.end ||
              textNode.characters.length !== selectedTextRange.end ||
              (selectedTextRange.start === textNode.characters.length &&
                selectedTextRange.end === textNode.characters.length))
          ) {
            console.log('part of text are selected', selectedTextRange)
            figma.ui.postMessage({
              type: 'copytext',
              data: {
                text: textNode.characters,
                selectedTextRange: {
                  start: selectedTextRange.start,
                  end: selectedTextRange.end
                }
              }
            } as PluginMessage)
          } else {
            figma.ui.postMessage({
              type: 'copytext',
              data: {
                text: textNode.characters,
                selectedTextRange: {
                  start: 0,
                  end: textNode.characters.length
                }
              }
            } as PluginMessage)
          }
        }
        // テキスト以外の場合のとき
        else {
          figma.ui.postMessage({
            type: 'copytext',
            data: {
              text: '',
              isTextAreaDisabled: true
            }
          } as PluginMessage)
        }
      }
      // 一つ以上選択しているとき
      else {
        figma.ui.postMessage({
          type: 'copytext',
          data: {
            text: ''
          }
        } as PluginMessage)
      }
    }
    // なにも選択していないとき
    else {
      console.log('no selection')
      figma.ui.postMessage({
        type: 'copytext',
        data: {
          text: '',
          isTextAreaDisabled: true
        }
      } as PluginMessage)
    }
  }
}

function bootstrap(): void {
  const contoller = new Controller()

  figma.showUI(__html__, { width: UI_WIDTH, height: UI_MIN_HEIGHT })

  figma.ui.onmessage = (msg: PluginMessage): void => {
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
          isEditRealtime: msg.data.isEditRealtime
        })
        break
      case 'settext':
        contoller.setText(msg.data.text)
        break
      case 'closeplugin':
        figma.closePlugin()
        break
      default:
        break
    }
  }

  figma.on('selectionchange', contoller.onSelectionChange)

  contoller.onSelectionChange()
}

bootstrap()
