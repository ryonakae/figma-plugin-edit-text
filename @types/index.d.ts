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

type PluginMessage = {
  type: MessageType
  data?: any
}

type Message = {
  pluginMessage: PluginMessage
}
