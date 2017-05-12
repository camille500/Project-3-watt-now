local wifimodule = require 'wifimodule'
local config = require 'config'
local application = require 'application'
local socketmodule = require 'socketmodule'

function init()

  ws2812.init()
 local i, buffer = 0, ws2812.newBuffer(8, 3)
 
 function startStrip(colorArray)
   buffer:fill(colorArray[1], colorArray[2], colorArray[3])
   ws2812.write(buffer)
 end
 
 startStrip({220, 0, 0})

  print('init')
  print(wifi.sta.getip())

  local ws = socketmodule.start()

  ws:on('connection', function(ws)
    print('Websocket has Connected!')
   
  end)

  ws:on('close', function(_, status)
    print('Websocket closed the connection', status)
    ws = nil
  end)

clicks = 0
counter = 0

function onChange()
   clicks = clicks + 1
   startStrip({0, 0, 255})
   if(clicks == 3) then
    clicks = 0
    counter = counter + 10
    ws:send(counter)
    print('Yep')
   end 
end

  gpio.mode(1, gpio.INT, gpio.PULLUP)
  gpio.trig(1, 'both', onChange)
--  
end


wifimodule.connect(config, init)
