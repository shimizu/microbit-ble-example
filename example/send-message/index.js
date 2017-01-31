var BBCMicrobit = require('bbc-microbit')
var text = (process.argv[2]) ?  process.argv[2] :'Hello there' ;

console.log('chibi:bitを検索しています')
BBCMicrobit.discover(function(microbit) {
    console.log('\tchibi:bitを発見しました: id = %s, address = %s', microbit.id, microbit.address)

    microbit.on('disconnect', function() {
        console.log('\t接続エラー！：chibi:bitに接続できませんでした')
        process.exit(0)
    })

    microbit.connectAndSetUp(function() {
        console.log('\t接続しました')

        microbit.writeLedText(text, function() {
            console.log('テキスト送信： "%s"', text)            
            process.exit(0)
        })
    })
})
