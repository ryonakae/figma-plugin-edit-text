import * as React from 'react'
import '@/app/assets/css/style.css'
import Store from '@/app/Store'

const Content: React.FC = () => {
  const { isSendTextAtCmdAndEnter, setIsSendTextAtCmdAndEnter } = Store.useContainer()

  return (
    <>
      <div>Edit Text</div>
      <div>isSendTextAtCmdAndEnter {`${isSendTextAtCmdAndEnter}`}</div>
    </>
  )
}

const App: React.FC = () => {
  return (
    <Store.Provider>
      <Content />
    </Store.Provider>
  )
}

export default App
