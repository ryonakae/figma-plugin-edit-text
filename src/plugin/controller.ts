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

  setText(text: string): void {
    console.log('setText', text)

    const selections = figma.currentPage.selection
    console.log('selections', selections)

    if (selections.length === 0) {
      console.log('nothing selection')
    } else {
      selections.map(async selection => {
        console.log(selection, selection.type)
        if (selection.type === 'TEXT') {
          const selectionRange = selection.characters.length
          for (let i = 0; i < selectionRange; i++) {
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

    const _selections: string[] = []
    if (selections.length > 0) {
      selections.map(selection => {
        _selections.push(selection.id)
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
          console.log('select only one text node', textNode)

          const selectedTextRange = figma.currentPage.selectedTextRange
          if (
            selectedTextRange &&
            (selectedTextRange.start !== selectedTextRange.end ||
              textNode.characters.length !== selectedTextRange.end)
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
                text: textNode.characters
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
