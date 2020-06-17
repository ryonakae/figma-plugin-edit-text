import React, { useEffect, useRef } from 'react'
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
  const selectionTimer = useRef(0)
  const selectionRangeTimer = useRef(0)
  const TIMER_LENGTH = 500

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    console.log('textarea onChange')
    sendTextToFigma(event.target.value)
  }

  function focusToTextArea(): void {
    console.log('focusToTextArea')
    const textArea = (textAreaRef.current as unknown) as HTMLTextAreaElement
    textArea.focus()
  }

  function onSelectionChange(): void {
    window.clearTimeout(selectionTimer.current)
    selectionTimer.current = window.setTimeout(() => {
      if (selections.length > 0) {
        focusToTextArea()
      }
    }, TIMER_LENGTH)
  }

  function onSelectionRangeChange(): void {
    window.clearTimeout(selectionRangeTimer.current)

    const textArea = (textAreaRef.current as unknown) as HTMLTextAreaElement
    textArea.setSelectionRange(inputTextSelectionRange.start, inputTextSelectionRange.end)

    selectionRangeTimer.current = window.setTimeout(focusToTextArea, TIMER_LENGTH)
  }

  useEffect(() => {
    if (!isTextAreaDisabled) {
      focusToTextArea()
    }
  }, [isTextAreaDisabled])

  useEffect(() => {
    onSelectionChange()
  }, [selections])

  useEffect(() => {
    console.log('inputTextSelectionRange changed', inputTextSelectionRange)
    onSelectionRangeChange()
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
