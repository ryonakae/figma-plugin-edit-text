import React, { useEffect, useState, useRef } from 'react'
import Store from '@/app/Store'

const TextArea: React.FC = () => {
  const {
    inputText,
    inputTextSelectionRange,
    isTextAreaDisabled,
    selections,
    sendTextToFigma
  } = Store.useContainer()
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
    const range = inputTextSelectionRange.end - inputTextSelectionRange.start
    // if (range)
    textArea.setSelectionRange(inputTextSelectionRange.start, inputTextSelectionRange.end)
    // textArea.blur()
  }

  useEffect(() => {
    if (!isTextAreaDisabled) {
      focusToTextArea()
    }
  }, [isTextAreaDisabled])

  // useEffect(() => {
  //   if (selections.length > 0) {
  //     focusToTextArea()
  //   }
  // }, [selections])

  useEffect(() => {
    console.log('inputTextSelectionRange changed', inputTextSelectionRange)
    setSelectionRange()
  }, [inputTextSelectionRange])

  return (
    <textarea
      className="textarea"
      disabled={isTextAreaDisabled}
      value={inputText}
      onChange={onChange}
      // onBlur={focusToTextArea}
      placeholder={isTextAreaDisabled ? 'Select text layer(s)' : 'Type text here'}
      ref={textAreaRef}
    />
  )
}

export default TextArea
