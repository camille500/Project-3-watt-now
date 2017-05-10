local wifimodule = require 'wifimodule'
local config = require 'config'

function init()

  print(wifi.sta.getip())

end

wifimodule.connect(config, init)
