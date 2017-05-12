-- WebSocket module
local config = require 'config'
local socketmodule = {}

function socketmodule.start()

  print('socket')

  local ws = websocket.createClient()

  print('Websocket is connecting at ws://' .. config.server .. ':' .. config.port)
  ws:connect('ws://' .. config.server )

  print(ws)

  return ws

end

return socketmodule
