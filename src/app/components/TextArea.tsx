import _ from 'lodash'
import React, { useEffect, useRef } from 'react'
import Store from '@/app/Store'

const ONCHANGE_TIMER_DURATION = 100
const SELECTION_TIMER_DURATION = 500

const TextArea: React.FC = () => {
  const {
    inputText,
    inputTextSelectionRange,
    isTextAreaDisabled,
    isEditRealtime,
    isCloseAtEnter,
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
  const isCloseAtEnterRef = useRef(isCloseAtEnter)
  const isTextAreaDisabledRef = useRef(isTextAreaDisabled)

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

  function closePlugin(): void {
    console.log('closePlugin')
    console.log('inputTextRef.current.length', inputTextRef.current.length)

    // プラグインを閉じるとき、文字が空だと次回起動時に入力が反映されなくなってしまう
    // 仕方なく、文字が空の場合は半角スペース1つを入れてプラグインを閉じる
    if (inputTextRef.current.length === 0) {
      setInputText(' ')
      sendTextToFigma(' ')
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

  function onKeyDown(event: KeyboardEvent): void {
    console.log(event)
    // esc
    if (event.keyCode === 27) {
      console.log('press esc key')
      closePlugin()
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

      // isCloseAtEnterがtrueのときだけ閉じる
      if (isCloseAtEnterRef.current) {
        closePlugin()
      }
    }
  }

  function onReturnClick(): void {
    sendTextToFigma(inputText)

    // isCloseAtEnterがtrueのときだけ閉じる
    if (isCloseAtEnterRef.current) {
      closePlugin()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown, { passive: true })
  }, [])

  useEffect(() => {
    inputTextRef.current = inputText
    console.log('inputText update', inputText)
  }, [inputText])

  useEffect(() => {
    console.log('setting update', isEditRealtime, isCloseAtEnter)
    isEditRealtimeRef.current = isEditRealtime
    isCloseAtEnterRef.current = isCloseAtEnter
  }, [isEditRealtime, isCloseAtEnter])

  useEffect(() => {
    isTextAreaDisabledRef.current = isTextAreaDisabled
    if (!isTextAreaDisabled && inputText.length > 0) {
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
          <img src={require('@/app/assets/img/icon_return.svg').default} alt="" />
        </div>
      ) : null}
    </div>
  )
}

export default TextArea
