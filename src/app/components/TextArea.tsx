import _ from 'lodash'
import React, { useEffect, useRef } from 'react'
import Store from '@/app/Store'

const TextArea: React.FC = () => {
  const {
    inputText,
    inputTextSelectionRange,
    isTextAreaDisabled,
    isEditRealtime,
    selections,
    setInputText,
    sendTextToFigma
  } = Store.useContainer()
  const textAreaRef = useRef(null)
  const onChangeTimer = useRef(0)
  const selectionTimer = useRef(0)
  const selectionRangeTimer = useRef(0)
  const inputTextRef = useRef(inputText)
  const isEditRealtimeRef = useRef(isEditRealtime)
  const ONCHANGE_TIMER_DURATION = 100
  const SELECTION_TIMER_DURATION = 500

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    console.log('textarea onChange', 'isEditRealtime:', isEditRealtime)

    event.persist()

    if (isEditRealtime) {
      window.clearInterval(onChangeTimer.current)
      onChangeTimer.current = window.setTimeout(() => {
        sendTextToFigma(event.target.value)
      }, ONCHANGE_TIMER_DURATION)
    }

    setInputText(event.target.value)

    console.log('inputText', inputText)
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

  function onKeyDown(event: KeyboardEvent): void {
    console.log(event)
    // esc
    if (event.keyCode === 27) {
      console.log('press esc key')
      parent.postMessage(
        {
          pluginMessage: {
            type: 'closeplugin'
          }
        } as Message,
        '*'
      )
    }
    // cmd + enter
    else if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
      console.log(
        'press cmd + enter key',
        `inputText(Ref): ${inputTextRef.current}`,
        `isEditRealtime(Ref): ${isEditRealtimeRef.current}`
      )
      if (!isEditRealtimeRef.current) {
        sendTextToFigma(inputTextRef.current)
      }

      parent.postMessage(
        {
          pluginMessage: {
            type: 'closeplugin'
          }
        } as Message,
        '*'
      )
    }
  }

  function onReturnClick(): void {
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

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown, { passive: true })
  }, [])

  useEffect(() => {
    inputTextRef.current = inputText
    console.log('inputText update', inputText)
  }, [inputText])

  useEffect(() => {
    isEditRealtimeRef.current = isEditRealtime
    console.log('isEditRealtime update', isEditRealtime)
  }, [isEditRealtime])

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
    <div className="textarea">
      <textarea
        className="textarea-content"
        disabled={isTextAreaDisabled}
        value={inputText}
        onChange={onChange}
        // onBlur={focusToTextArea}
        placeholder={isTextAreaDisabled ? 'Select text layer(s)' : 'Type text here'}
        ref={textAreaRef}
      />
      {!isEditRealtime && !isTextAreaDisabled ? (
        <div
          onClick={onReturnClick}
          className={`textarea-return ${inputText.length === 0 ? 'is-disabled' : ''}`}
        >
          <span>→</span>
        </div>
      ) : null}
    </div>
  )
}

export default TextArea
