import React, { useEffect, useState } from 'react'
import Store from '@/app/Store'

const TextArea: React.FC = () => {
  const { inputText, sendTextToFigma } = Store.useContainer()
  const [isInitialEdit, setIsInitialEdit] = useState<boolean>(true)

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    console.log('textarea onChange')
    sendTextToFigma(event.target.value)
  }

  function onSendClick(): void {
    console.log('textarea onSendClick', inputText)
    sendTextToFigma(inputText)
  }

  return (
    <div>
      <textarea
        name=""
        id=""
        cols={30}
        rows={10}
        value={inputText}
        onChange={onChange}
        placeholder="Enter Text Here..."
      />
      <div className="button" onClick={onSendClick}>
        send
      </div>
    </div>
  )
}

export default TextArea
