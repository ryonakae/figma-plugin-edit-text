import { useState, useEffect } from 'react'
import { createContainer } from 'unstated-next'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function Store() {
  const [inputText, setInputText] = useState('')
  const [inputTextSelectionRange, setInputTextSelectionRange] = useState({
    start: 0,
    end: 0
  })

  function sendTextToFigma(text: string): void {
    setInputText(text)
    parent.postMessage(
      {
        pluginMessage: {
          type: 'settext',
          data: {
            text: text
          }
        }
      } as Message,
      '*'
    )
  }

  function listenPluginMessage(): void {
    onmessage = (msg): void => {
      const messageType: MessageType = msg.data.pluginMessage.type
      const pluginData: PluginMessage['data'] = msg.data.pluginMessage.data

      switch (messageType) {
        case 'copytext':
          if (pluginData.selectedTextRange) {
            setInputText(pluginData.text)
            setInputTextSelectionRange({
              start: pluginData.selectedTextRange.start,
              end: pluginData.selectedTextRange.end
            })
          } else {
            setInputText(pluginData.text)
          }
          break
        default:
          break
      }
    }
  }

  useEffect(() => {
    listenPluginMessage()
  }, [])

  return {
    inputText,
    inputTextSelectionRange,
    setInputText,
    setInputTextSelectionRange,
    sendTextToFigma
  }
}

export default createContainer(Store)
