-- HvA Open-WiFi Setup by Rijk van Zanten <rijkvanzanten@me.com> https://github.com/rijkvanzanten/luaus/blob/master/nodemcu/wifimodule.lua

local wifimodule = {}

-- Connect to Wi-Fi
function wifimodule.connect(network, callback)
  wifi.setmode(wifi.STATION)
  wifi.sta.config(network.ssid, network.password)
  wifi.sta.eventMonReg(wifi.STA_IDLE, function() print('[Wi-Fi] Idle') end)
  wifi.sta.eventMonReg(wifi.STA_CONNECTING, function() print('[Wi-Fi] Connecting...') end)
  wifi.sta.eventMonReg(wifi.STA_WRONGPWD, function() print('[Wi-Fi] Wrong Password') end)
  wifi.sta.eventMonReg(wifi.STA_APNOTFOUND, function() print('[Wi-Fi] No access point found') end)
  wifi.sta.eventMonReg(wifi.STA_FAIL, function() print('[Wi-Fi] Failed to connect') end)
  wifi.sta.eventMonReg(wifi.STA_GOTIP, function()
    print('[Wi-Fi] Received valid IP')
    local conn = net.createConnection(net.TCP, false)
    ip, nm, gateway = wifi.sta.getip()

    local redirHost = gateway .. ':8002'

    -- Auto-accept HvA open wifi thingy
    conn:on('receive', function(sck, c)
      print('[Wi-Fi] Connected to ' .. network.ssid .. '!')
    end)

    if network.ssid == 'HvA Open Wi-Fi' then
      conn:on('connection', function(sck, c)
        sck:send('POST / HTTP/1.1\r\nHost: ' .. redirHost .. '\r\nOrigin: http://' .. redirHost .. '\r\nContent-Type: application/x-www-form-urlencoded\r\nReferer: http://' .. redirHost .. '/index.php\r\nContent-Length: 52\r\n\r\nredirurl=http%3A%2F%2Fwww.hva.nl%2F&accept=Verbinden')
      end)
    end

--    callback()
    dofile('application.lua')

    conn:connect(8002, gateway)
  end)
  wifi.sta.eventMonStart()
  wifi.sta.connect()
end

return wifimodule
