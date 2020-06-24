import React, { useEffect, useRef } from 'react'
import '@/app/assets/css/style.css'
import Store from '@/app/Store'
import Main from '@/app/components/Main'

const App: React.FC = () => {
  return (
    <Store.Provider>
      <div className="app">
        <Main />
      </div>
    </Store.Provider>
  )
}

export default App
