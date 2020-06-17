import { useState, useEffect } from 'react'
import { createContainer } from 'unstated-next'

function Store() {
  const [isSendTextAtCmdAndEnter, setIsSendTextAtCmdAndEnter] = useState<boolean>(true)
  const [isSetSelectionText, setIsSetSelectionText] = useState<boolean>(true)
  const [inputText, setInputText] = useState<string>('')

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
          setInputText(pluginData.text)
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
    setIsSendTextAtCmdAndEnter,
    setIsSetSelectionText,
    setInputText,
    sendTextToFigma
  }
}

export default createContainer(Store)
