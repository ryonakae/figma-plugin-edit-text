type MessageType =
  | 'resize'
  | 'getoptions'
  | 'getoptionssuccess'
  | 'setoptions'
  | 'setoptionssuccess'
  | 'settext'
  | 'settextsuccess'
  | 'copytext'
  | 'copytextsuccess'
  | 'closeplugin'
  | 'setselectionrange'
  | 'selectionchange'

type PluginMessage = {
  type: MessageType
  data?: any
}

type Message = {
  pluginMessage: PluginMessage
}

type Options = {
  isEditRealtime: boolean
}
