var BBCMicrobit = require('bbc-microbit')
var exec = require('child_process').exec
var http = require('http')
var finalhandler = require('finalhandler')
var serveStatic = require('serve-static')
var BUTTON_VALUE_MAPPER = ['Not Pressed', 'Pressed', 'Long Press'];


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

var subscribeButtons = function(microbit){
    return new Promise(function(resolve, reject){
        microbit.connectAndSetUp(function() {
          console.log('\t接続しました')
        
            microbit.subscribeButtons(function() {
                console.log('\tボタン入力を受付中');
                resolve(microbit)
            })
        })
    })    
}

var onClickButtons = function(collection){
	var microbit = collection.microbit
	var socket = collection.socket
	
	
    return new Promise(function(resolve, reject){
        microbit.on('buttonAChange', function(value) {
            console.log('\ton -> button A change: ', BUTTON_VALUE_MAPPER[value]);
			if (BUTTON_VALUE_MAPPER[value] == "Pressed")
				socket.emit('greeting', {message: 'A button'})	
        })
        
        microbit.on('buttonBChange', function(value) {
            console.log('\ton -> button B change: ', BUTTON_VALUE_MAPPER[value]);
			if (BUTTON_VALUE_MAPPER[value] == "Pressed")
				socket.emit('greeting', {message: 'B button'})
        })
		
		resolve(microbit)
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


discoverMcrobit.then(subscribeButtons).then(runWebscoketServer).then(onClickButtons)

