import React, { useEffect, useRef } from 'react'
import Store from '@/app/Store'
import TextArea from '@/app/components/TextArea'

const Main: React.FC = () => {
  const { isTextAreaDisabled, selections } = Store.useContainer()

  function onKeyDown(event: KeyboardEvent): void {
    console.log(event)
    // esc
    if (event.keyCode === 27) {
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

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown, { passive: true })
  }, [])

  return (
    <>
      <TextArea />
      <div className="note">
        <div>Select text layer(s) and type in textarea.</div>
        <div>Press Esc or Cmd + Enter to close plugin.</div>
      </div>
    </>
  )
}

export default Main
