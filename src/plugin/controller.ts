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
    const isCloseAtEnter = Util.toBoolean(figma.root.getPluginData('isCloseAtEnter'))

    figma.ui.postMessage({
      type: 'getoptionssuccess',
      data: {
        isEditRealtime,
        isCloseAtEnter
      } as Options
    } as PluginMessage)

    console.log('getOptions success', isEditRealtime, isCloseAtEnter)
  }

  setOptions(options: Options): void {
    figma.root.setPluginData('isEditRealtime', String(options.isEditRealtime))
    figma.root.setPluginData('isCloseAtEnter', String(options.isCloseAtEnter))

    figma.ui.postMessage({
      type: 'setoptionssuccess'
    } as PluginMessage)

    console.log(
      'setOptions success',
      figma.root.getPluginData('isEditRealtime'),
      figma.root.getPluginData('isCloseAtEnter')
    )
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

    // 1つ以上選択しているとき
    if (selections.length > 0) {
      // 選択した各要素のidを_selectionsに格納
      // ついでにテキストの場合、フォントをロードする（テキストの変更に必要）
      _.map(selections, async selection => {
        _selections.push(selection.id)

        if (selection.type === 'TEXT') {
          const selectionRange = selection.characters.length
          for (let i = 0; i < selectionRange; i++) {
            await figma.loadFontAsync(selection.getRangeFontName(i, i + 1) as FontName)
          }
          console.log(`${selection.id} font loaded`)
        }
      })

      // 1つだけ選択しているとき
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
      // 2つ以上選択しているとき
      else {
        // フラグを準備
        let isAllTextType = true // 選択しているすべての要素がテキストか
        let isAllSameCharacters = true // すべてのテキストが同じ文字か
        let textNodeCount = 0 // テキストノードの数

        // 各選択要素ごとに検証してフラグを更新
        _.map(selections, async selection => {
          if (selection.type === 'TEXT') {
            textNodeCount++

            if (
              selections[0].type === 'TEXT' &&
              selection.characters !== selections[0].characters
            ) {
              isAllSameCharacters = false
            }
          } else {
            isAllTextType = false
          }
        })

        // フラグに応じてUIに送るテキストを変える
        // すべてテキストかつ同じ文字だったら、1つ目の要素の文字をそのまま送る（選択範囲込みで）
        // 違ったら、空テキストを送る（UIはプレースホルダになる）
        // textNodeCountが0（選択した要素のうちひとつもテキストがない）のときは
        // isTextAreaDisabledオプションをtrueでUIに送る
        let text = ''
        let selectedTextRange: { start: number; end: number } | undefined = undefined
        if (selections[0].type === 'TEXT' && isAllTextType && isAllSameCharacters) {
          text = selections[0].characters
          selectedTextRange = {
            start: 0,
            end: selections[0].characters.length
          }
        }
        figma.ui.postMessage({
          type: 'copytext',
          data: {
            text,
            isTextAreaDisabled: textNodeCount === 0,
            selectedTextRange
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

    // _selectionsをUIに送る
    figma.ui.postMessage({
      type: 'selectionchange',
      data: {
        selections: _selections
      }
    } as PluginMessage)
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
          isEditRealtime: msg.data.isEditRealtime,
          isCloseAtEnter: msg.data.isCloseAtEnter
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
