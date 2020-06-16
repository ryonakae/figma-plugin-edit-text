import _ from 'lodash'

const CLIENT_STORAGE_KEY_NAME = 'edit-text'
const UI_WIDTH = 250
const UI_MIN_HEIGHT = 200
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
}

const contoller = new Controller()

figma.showUI(__html__, { width: UI_WIDTH, height: UI_MIN_HEIGHT })

figma.ui.onmessage = async (msg: PluginMessage): Promise<void> => {
  console.log(msg)
}

figma.on('selectionchange', () => {
  console.log('selection changed', figma.currentPage.selection)
})
