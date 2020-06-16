import { useState } from 'react'
import { createContainer } from 'unstated-next'

function Store() {
  const [isSendTextAtCmdAndEnter, setIsSendTextAtCmdAndEnter] = useState<boolean>(true)

  return {
    isSendTextAtCmdAndEnter,
    setIsSendTextAtCmdAndEnter
  }
}

export default createContainer(Store)
