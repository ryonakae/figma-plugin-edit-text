import React, { useEffect } from 'react'
import '@/app/assets/css/style.css'
import Store from '@/app/Store'
import TextArea from '@/app/components/TextArea'

const App: React.FC = () => {
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
    document.addEventListener('keydown', onKeyDown)
  }, [])

  return (
    <Store.Provider>
      <div className="app">
        <TextArea />
        <div className="note">
          <div>Select text layer(s) and type in textarea.</div>
          <div>Press Esc or Cmd + Enter to close plugin.</div>
        </div>
      </div>
    </Store.Provider>
  )
}

export default App
