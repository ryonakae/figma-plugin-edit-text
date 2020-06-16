import React, { useEffect } from 'react'
import '@/app/assets/css/style.css'
import Store from '@/app/Store'
import TextArea from '@/app/components/TextArea'
import Options from '@/app/components/Options'

const App: React.FC = () => {
  useEffect(() => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'getoptions'
        }
      } as Message,
      '*'
    )
  }, [])

  return (
    <Store.Provider>
      <TextArea />
      {/* <Options /> */}
    </Store.Provider>
  )
}

export default App
