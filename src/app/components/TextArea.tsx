import React, { useEffect, useState, useRef } from 'react'
import Store from '@/app/Store'

const TextArea: React.FC = () => {
  const { inputText, sendTextToFigma } = Store.useContainer()
  const textAreaRef = useRef(null)

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    console.log('textarea onChange')
    sendTextToFigma(event.target.value)
  }

  function onSendClick(): void {
    console.log('textarea onSendClick', inputText)
    sendTextToFigma(inputText)
    parent.postMessage(
      {
        pluginMessage: {
          type: 'closeplugin'
        }
      } as Message,
      '*'
    )
  }

  function focusToTextArea(): void {
    const textArea = (textAreaRef.current as unknown) as HTMLTextAreaElement
    textArea.focus()
  }

  useEffect(() => {
    focusToTextArea()
  }, [])

  return (
    <div>
      <textarea
        name=""
        id=""
        cols={30}
        rows={10}
        value={inputText}
        onChange={onChange}
        onBlur={focusToTextArea}
        placeholder="Enter Text Here..."
        ref={textAreaRef}
      />
      <div className="button" onClick={onSendClick}>
        send
      </div>
    </div>
  )
}

export default TextArea
