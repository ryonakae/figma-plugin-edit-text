import { useState, useEffect } from 'react'
import { createContainer } from 'unstated-next'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function Store() {
  const [isSendTextAtCmdAndEnter, setIsSendTextAtCmdAndEnter] = useState(true)
  const [isSetSelectionText, setIsSetSelectionText] = useState(true)
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
        case 'getoptionssuccess':
          setIsSendTextAtCmdAndEnter(pluginData.isSendTextAtCmdAndEnter)
          setIsSetSelectionText(pluginData.isSetSelectionText)
          break
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
    isSendTextAtCmdAndEnter,
    isSetSelectionText,
    inputText,
    inputTextSelectionRange,
    setIsSendTextAtCmdAndEnter,
    setIsSetSelectionText,
    setInputText,
    setInputTextSelectionRange,
    sendTextToFigma
  }
}

export default createContainer(Store)
