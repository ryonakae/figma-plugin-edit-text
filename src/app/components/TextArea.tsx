import React, { useEffect, useState, useRef } from 'react'
import Store from '@/app/Store'

const TextArea: React.FC = () => {
  const { inputText, inputTextSelectionRange, sendTextToFigma } = Store.useContainer()
  const textAreaRef = useRef(null)

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    console.log('textarea onChange')
    sendTextToFigma(event.target.value)
  }

  function focusToTextArea(): void {
    const textArea = (textAreaRef.current as unknown) as HTMLTextAreaElement
    textArea.focus()
  }

  function setSelectionRange(): void {
    const textArea = (textAreaRef.current as unknown) as HTMLTextAreaElement
    textArea.setSelectionRange(inputTextSelectionRange.start, inputTextSelectionRange.end)
  }

  useEffect(() => {
    focusToTextArea()
  }, [])

  useEffect(() => {
    console.log('inputTextSelectionRange changed', inputTextSelectionRange)
    setSelectionRange()
  }, [inputTextSelectionRange])

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
    </div>
  )
}

export default TextArea
