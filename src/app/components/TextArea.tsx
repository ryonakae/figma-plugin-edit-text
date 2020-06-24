import _ from 'lodash'
import React, { useEffect, useRef } from 'react'
import Store from '@/app/Store'

const TextArea: React.FC = () => {
  const {
    inputText,
    inputTextSelectionRange,
    isTextAreaDisabled,
    selections,
    setInputText,
    sendTextToFigma
  } = Store.useContainer()
  const textAreaRef = useRef(null)
  const onChangeTimer = useRef(0)
  const selectionTimer = useRef(0)
  const selectionRangeTimer = useRef(0)
  const ONCHANGE_TIMER_DURATION = 100
  const SELECTION_TIMER_DURATION = 500

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    console.log('textarea onChange')

    window.clearInterval(onChangeTimer.current)

    event.persist()
    setInputText(event.target.value)

    onChangeTimer.current = window.setTimeout(() => {
      sendTextToFigma(event.target.value)
    }, ONCHANGE_TIMER_DURATION)
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
    }, SELECTION_TIMER_DURATION)
  }

  function onSelectionRangeChange(): void {
    window.clearTimeout(selectionRangeTimer.current)

    const textArea = (textAreaRef.current as unknown) as HTMLTextAreaElement
    textArea.setSelectionRange(inputTextSelectionRange.start, inputTextSelectionRange.end)

    selectionRangeTimer.current = window.setTimeout(focusToTextArea, SELECTION_TIMER_DURATION)
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
