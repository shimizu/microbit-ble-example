var BBCMicrobit = require('bbc-microbit')
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

var onClickButtons = function(microbit){
    return new Promise(function(resolve, reject){
        microbit.on('buttonAChange', function(value) {
            console.log('\ton -> button A change: ', BUTTON_VALUE_MAPPER[value]);
        })
        
        microbit.on('buttonBChange', function(value) {
            console.log('\ton -> button B change: ', BUTTON_VALUE_MAPPER[value]);
        })    
    })    
}

discoverMcrobit.then(subscribeButtons).then(onClickButtons)

