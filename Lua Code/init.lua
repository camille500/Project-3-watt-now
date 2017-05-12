local wifimodule = require 'wifimodule'
local config = require 'config'
local application = require 'application'
local socketmodule = require 'socketmodule'

function init()

  buffercount = 0
  time = 0
  firstOn = false
  color = 0
  condition = false


  conditiontimer = tmr.create()
  conditiontimer:register(10000, tmr.ALARM_AUTO, function()
    print(condition)
    if(condition == true) then
     condition = false
    else
     buffercount = 0
     firstOn = false
     blinktimer:stop()
     mytimer:stop()
     startStrip({0, 0, 0})
    end
  end)
  conditiontimer:interval(5000)

  conditiontimer:start()

  mytimer = tmr.create()
  mytimer:register(10000, tmr.ALARM_AUTO, function()
    buffercount = buffercount + 1
    if(buffercount < 9) then
      buffer:set(buffercount, string.char(255, 0, 0))
      ws2812.write(buffer)
    else
      startStrip({0, 0, 0})
      buffercount = 0
    end
    time = 0
    print(time)
  end)
  mytimer:interval(10000) -- actually, 3 seconds is better!

  blinktimer = tmr.create()
  blinktimer:register(10000, tmr.ALARM_AUTO, function()
    print(color)
    if(color == 255) then
      color = 0
    else
      color = 255
    end
    local blinkbuffer = buffercount + 1
    if(blinkbuffer < 9) then
      buffer:set(blinkbuffer, string.char(0, 0, color))
      ws2812.write(buffer)
    end
  end)
  blinktimer:interval(1000)
  b = 255
  r = 0

  ws2812.init()
  i, buffer = 0, ws2812.newBuffer(8, 3)
  print(buffer)

  function startStrip(colorArray)
    buffer:fill(colorArray[1], colorArray[2], colorArray[3])
    ws2812.write(buffer)
  end


  startStrip({0, 0, 0})

  local ws = socketmodule.start()

  ws:on('connection', function(ws)
    print('Websocket has Connected!')
  end)

  ws:on('receive', function(_, message)
    condition = true
    print(firstOn)
    print(buffercount)
    if(firstOn == false) then
      firstOn = true
      blinktimer:start()
    end
    if(time == 0) then
      mytimer:start()
      time = 1
    end
    print('recieved')
  end)

end


wifimodule.connect(config, init)
