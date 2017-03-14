var BBCMicrobit = require('bbc-microbit')
var BUTTON_VALUE_MAPPER = ['Not Pressed', 'Pressed', 'Long Press'];


var temp = 0
var period = 1000; // ms

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
            
            microbit.writeTemperaturePeriod(period, function() {
                console.log('\ttemperature period set');
            
                microbit.subscribeTemperature(function() {
                    console.log('\tsubscribed to temperature');
                });
            });            
            
        })
    })    
}

var onClickButtons = function(microbit){
    return new Promise(function(resolve, reject){
        microbit.on('temperatureChange', function(temperature) {
            console.log("a", temperature)
            temp = temperature
            
        })
                
        
        microbit.on('buttonAChange', function(value) {
            console.log('\ton -> button A change: ', BUTTON_VALUE_MAPPER[value]);
            microbit.writeLedText("Code for TOKYO", function() {
                console.log('テキスト送信： "%s"', "Code for TOKYO")            
            })
        })
        
        microbit.on('buttonBChange', function(value) {
            console.log('\ton -> button B change: ', BUTTON_VALUE_MAPPER[value]);
            microbit.writeLedText(" "+temp, function() {
                console.log('テキスト送信： "%s"', temp)            
            })
        })    
    })    
}

discoverMcrobit.then(subscribeButtons).then(onClickButtons)

