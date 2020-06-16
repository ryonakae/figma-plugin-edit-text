import React, { useEffect } from 'react'
import Store from '@/app/Store'

const Options: React.FC = () => {
  const {
    isSendTextAtCmdAndEnter,
    isSetSelectionText,
    setIsSendTextAtCmdAndEnter,
    setIsSetSelectionText
  } = Store.useContainer()

  function onIsSendTextAtCmdAndEnterClick(): void {
    setIsSendTextAtCmdAndEnter(!isSendTextAtCmdAndEnter)
  }

  function onIsSetSelectionTextClick(): void {
    setIsSetSelectionText(!isSetSelectionText)
  }

  function setCurrentOptions(): void {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'setoptions',
          data: {
            isSendTextAtCmdAndEnter: isSendTextAtCmdAndEnter,
            isSetSelectionText: isSetSelectionText
          }
        }
      } as Message,
      '*'
    )
  }

  useEffect(() => {
    setCurrentOptions()
  }, [isSendTextAtCmdAndEnter, isSetSelectionText])

  return (
    <div className="options">
      <div className="options-item" onClick={onIsSendTextAtCmdAndEnterClick}>
        <div>Cmd + Enter to Send Text</div>
        <div>{`${isSendTextAtCmdAndEnter}`}</div>
      </div>
      <div className="options-item" onClick={onIsSetSelectionTextClick}>
        <div>Set Selection Text</div>
        <div>{`${isSetSelectionText}`}</div>
      </div>
    </div>
  )
}

export default Options
