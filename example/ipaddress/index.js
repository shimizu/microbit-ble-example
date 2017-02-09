var os = require('os')
var BBCMicrobit = require('bbc-microbit')
var BUTTON_VALUE_MAPPER = ['Not Pressed', 'Pressed', 'Long Press']


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
                console.log('\tボタン入力を受付中')
                resolve(microbit)
            })
        })
    })    
}

var onClickButtons = function(microbit){
    return new Promise(function(resolve, reject){
        microbit.on('buttonAChange', function(value) {
            console.log('\ton -> button A change: ', BUTTON_VALUE_MAPPER[value])
            if (BUTTON_VALUE_MAPPER[value] === "Pressed")
                microbit.writeLedText(getLocalAddress().ipv4[0].address, function() {
                    console.log('テキスト送信： "%s"', getLocalAddress().ipv4[0].address)            
                })                        
        })
        
        microbit.on('buttonBChange', function(value) {
            console.log('\ton -> button B change: ', BUTTON_VALUE_MAPPER[value])
            if (BUTTON_VALUE_MAPPER[value] === "Pressed")
                microbit.writeLedText(getLocalAddress().ipv6[0].address, function() {
                    console.log('テキスト送信： "%s"', getLocalAddress().ipv6[0].address)            
                })                        
        })
		
		resolve(microbit)
    })    
}

function getLocalAddress() {
    var ifacesObj = {}
    ifacesObj.ipv4 = []
    ifacesObj.ipv6 = []
    var interfaces = os.networkInterfaces()

    for (var dev in interfaces) {
        interfaces[dev].forEach(function(details){
            if (!details.internal){
                switch(details.family){
                    case "IPv4":
                        ifacesObj.ipv4.push({name:dev, address:details.address})
                    break;
                    case "IPv6":
                        ifacesObj.ipv6.push({name:dev, address:details.address})
                    break;
                }
            }
        })
    }
    return ifacesObj
}



discoverMcrobit.then(subscribeButtons).then(onClickButtons)

