type MessageType =
  | 'resize'
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
