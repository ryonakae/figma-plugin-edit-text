import React, { useEffect, useState } from 'react'
import Store from '@/app/Store'

const TextArea: React.FC = () => {
  const [text, setText] = useState<string>('')
  const [isInitialEdit, setIsInitialEdit] = useState<boolean>(true)

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    console.log('textarea onChange')
    setText(event.target.value)
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

  function onSendClick(): void {
    console.log('textarea onSendClick', text)
    setText('')
  }

  useEffect(() => {
    console.log('useEffect', text)
    if (!isInitialEdit) {
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

    if (isInitialEdit) {
      setIsInitialEdit(false)
    }
  }, [text])

  return (
    <div>
      <textarea name="" id="" cols={30} rows={10} value={text} onChange={onChange} />
      <div className="button" onClick={onSendClick}>
        send
      </div>
    </div>
  )
}

export default TextArea
