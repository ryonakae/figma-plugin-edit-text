import { useState, useEffect } from 'react'
import { createContainer } from 'unstated-next'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function Store() {
  const [inputText, setInputText] = useState('')
  const [inputTextSelectionRange, setInputTextSelectionRange] = useState({
    start: 0,
    end: 0
  })
  const [isTextAreaDisabled, setIsTextAreaDisabled] = useState<boolean>(true)
  const [isEditRealtime, setIsEditRealtime] = useState<boolean>(true)
  const [isCloseAtEnter, setIsCloseAtEnter] = useState<boolean>(true)
  const [selections, setSelections] = useState<SceneNode[]>([])

  function updateOptions(options: Options): void {
    console.log('updateOptions', options)
    setIsEditRealtime(options.isEditRealtime)
    setIsCloseAtEnter(options.isCloseAtEnter)
  }

  function sendTextToFigma(text: string): void {
    console.log('sendTextToFigma', text)
    // setInputText(text)
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
          updateOptions({
            isEditRealtime: pluginData.isEditRealtime,
            isCloseAtEnter: pluginData.isCloseAtEnter
          })
          break
        case 'selectionchange':
          setSelections(pluginData.selections)
          break
        case 'copytext':
          if (pluginData.isTextAreaDisabled) {
            setIsTextAreaDisabled(true)
          } else {
            setIsTextAreaDisabled(false)
          }

          if (pluginData.text.length === 0) {
            setInputText(pluginData.text)
          } else if (pluginData.selectedTextRange) {
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
    isTextAreaDisabled,
    isEditRealtime,
    isCloseAtEnter,
    selections,
    setInputText,
    setInputTextSelectionRange,
    setIsTextAreaDisabled,
    setIsEditRealtime,
    setIsCloseAtEnter,
    setSelections,
    sendTextToFigma
  }
}

export default createContainer(Store)
