var BBCMicrobit = require('bbc-microbit')
var exec = require('child_process').exec
var http = require('http')
var finalhandler = require('finalhandler')
var serveStatic = require('serve-static')
var BUTTON_VALUE_MAPPER = ['Not Pressed', 'Pressed', 'Long Press'];

var period = 160; // ms


console.log('chibi:bitを検索しています')
var discoverMcrobit = new Promise(function(resolve, reject){
    BBCMicrobit.discover(function(microbit) {
        console.log('\tchibi:bitを発見しました: id = %s, address = %s', microbit.id, microbit.address)
        microbit.on('disconnect', function() {
          console.log('\t接続エラー！：chibi:bitに接続できませんでした')
          process.exit(0);
        })
        
        resolve(microbit)
    })    
})

var subscribeTemperature = function(collection){
    return new Promise(function(resolve, reject){
        collection.microbit.on('temperatureChange', function(temperature) {
            console.log('\ton -> temperature change: temperature = %d °C', temperature);
            collection.socket.emit('greeting', {message: temperature})	
        })
        
        
        collection.microbit.connectAndSetUp(function() {
            console.log('\t接続しました')
        
            collection.microbit.writeTemperaturePeriod(period, function() {
                console.log('\ttemperature period set');
            
                console.log('subscribing to temperature');
                collection.microbit.subscribeTemperature(function() {
                    console.log('\tsubscribed to temperature');
                });
            });
       })
    })    
}


function runWebscoketServer(microbit) {
    return new Promise(function(resolve, reject){
		
		var io = require('socket.io').listen(8124);
		exec("open http://localhost:8000")
        
        
		io.sockets.on('connection', function(socket) {
			resolve({microbit:microbit, socket:socket})
		})  		
    })    	
}


//webserver 起動
var serve = serveStatic(__dirname, {'index': ['index.html', 'index.htm']})
var server = http.createServer(function onRequest (req, res) {
	serve(req, res, finalhandler(req, res))
})
server.listen(8000)


discoverMcrobit.then(runWebscoketServer).then(subscribeTemperature)
