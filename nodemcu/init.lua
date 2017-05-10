local wifimodule = require 'wifimodule'
local config = require 'config'

function init()

  -- dofile('application.lua')
 if file.open('init.lua') == nil then
        print('init.lua deleted or renamed')
    else
        file.close('init.lua')
        -- the actual application is stored in 'application.lua'
       
        -- Als dit de application.lua moet starten doet ie het niet
    end

  print(wifi.sta.getip())

 end



wifimodule.connect(config, init)
