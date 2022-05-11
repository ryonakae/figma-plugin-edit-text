import React, { useEffect, useRef } from 'react'
import Store from '@/app/Store'

const Options: React.FC = () => {
  const {
    isEditRealtime,
    isCloseAtEnter,
    setIsEditRealtime,
    setIsCloseAtEnter
  } = Store.useContainer()
  const isMounted = useRef(false)

  function setCurrentOptions(): void {
    console.log('setCurrentOptions')
    parent.postMessage(
      {
        pluginMessage: {
          type: 'setoptions',
          data: {
            isEditRealtime,
            isCloseAtEnter
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

  function onCloseAtEnterClick(): void {
    console.log('onCloseAtEnterClick')
    setIsCloseAtEnter(!isCloseAtEnter)
  }

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      console.log('optios mounted')
      console.log('getoptions')
      parent.postMessage(
        {
          pluginMessage: {
            type: 'getoptions'
          }
        } as Message,
        '*'
      )
    }
  }, [])

  useEffect(setCurrentOptions, [isEditRealtime, isCloseAtEnter])

  return (
    <div className="options">
      <div className="options-item">
        <div>Edit in Realtime</div>
        <div
          className={`segmentedControl is-${String(isEditRealtime)}`}
          onClick={onEditRealtimeClick}
        >
          <div className="segmentedControl-segment">
            <img src={require('@/app/assets/img/icon_hyphen.svg').default} alt="" />
          </div>
          <div className="segmentedControl-segment">
            <img src={require('@/app/assets/img/icon_check.svg').default} alt="" />
          </div>
        </div>
      </div>
      <div className="options-item">
        <div>Close at Enter</div>
        <div
          className={`segmentedControl is-${String(isCloseAtEnter)}`}
          onClick={onCloseAtEnterClick}
        >
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
