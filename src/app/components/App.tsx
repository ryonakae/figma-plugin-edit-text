import React, { useEffect } from 'react'
import '@/app/assets/css/style.css'
import Store from '@/app/Store'
import TextArea from '@/app/components/TextArea'

const App: React.FC = () => {
  function onKeyUp(event: KeyboardEvent): void {
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
  }

  useEffect(() => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'getoptions'
        }
      } as Message,
      '*'
    )

    document.addEventListener('keyup', onKeyUp)
  }, [])

  return (
    <Store.Provider>
      <div>
        <TextArea />
      </div>
    </Store.Provider>
  )
}

export default App
