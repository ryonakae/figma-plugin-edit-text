import { useState, useEffect } from 'react'
import { createContainer } from 'unstated-next'

function Store() {
  const [isSendTextAtCmdAndEnter, setIsSendTextAtCmdAndEnter] = useState<boolean>(true)
  const [isSetSelectionText, setIsSetSelectionText] = useState<boolean>(true)

  function listenPluginMessage(): void {
    onmessage = (msg): void => {
      const messageType: MessageType = msg.data.pluginMessage.type

      switch (messageType) {
        case 'getoptionssuccess':
          setIsSendTextAtCmdAndEnter(msg.data.pluginMessage.data.isSendTextAtCmdAndEnter)
          setIsSetSelectionText(msg.data.pluginMessage.data.isSetSelectionText)
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
    setIsSendTextAtCmdAndEnter,
    setIsSetSelectionText
  }
}

export default createContainer(Store)
