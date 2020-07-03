import React, { useEffect, useRef } from 'react'
import Store from '@/app/Store'

const Options: React.FC = () => {
  const { isEditRealtime, setIsEditRealtime } = Store.useContainer()
  const isMounted = useRef(false)

  function setCurrentOptions(): void {
    console.log('setCurrentOptions')
    parent.postMessage(
      {
        pluginMessage: {
          type: 'setoptions',
          data: {
            isEditRealtime
          }
        }
      } as Message,
      '*'
    )
  }

  function onEditRealtimeClick(): void {
    console.log('onEditRealtimeClick')
    setIsEditRealtime(!isEditRealtime)
  }

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      console.log('optios mounted')
      parent.postMessage(
        {
          pluginMessage: {
            type: 'getoptions'
          }
        } as Message,
        '*'
      )
      console.log('getoptions', 'isEditRealtime', isEditRealtime)
    }
  }, [])

  useEffect(setCurrentOptions, [isEditRealtime])

  return (
    <div className="options">
      <div className="options-item" onClick={onEditRealtimeClick}>
        <div>Edit in Realtime</div>
        <div className={`segmentedControl is-${String(isEditRealtime)}`}>
          <div className="segmentedControl-segment">
            <img src={require('@/app/assets/img/icon_hyphen.svg').default} alt="" />
          </div>
          <div className="segmentedControl-segment">
            <img src={require('@/app/assets/img/icon_check.svg').default} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Options
