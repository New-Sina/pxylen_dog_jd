/*
涓滀笢鍐滃満浜掑姪鐮�
姝ゆ枃浠朵负Node.js涓撶敤銆傚叾浠栫敤鎴疯蹇界暐
鏀寔浜笢N涓处鍙�
 */
//浜戞湇鍔″櫒鑵捐浜戝嚱鏁扮瓑NOde.js鐢ㄦ埛鍦ㄦ澶勫～鍐欎含涓滀笢鍐滃満鐨勫ソ鍙嬬爜銆�
// 鍚屼竴涓含涓滆处鍙风殑濂藉弸浜掑姪鐮佺敤@绗﹀彿闅斿紑,涓嶅悓浜笢璐﹀彿涔嬮棿鐢�&绗﹀彿鎴栬�呮崲琛岄殧寮�,涓嬮潰缁欎竴涓ず渚�
// 濡�: 浜笢璐﹀彿1鐨剆hareCode1@浜笢璐﹀彿1鐨剆hareCode2&浜笢璐﹀彿2鐨剆hareCode1@浜笢璐﹀彿2鐨剆hareCode2
let FruitShareCodes = [
  '0a74407df5df4fa99672a037eec61f7e@dbb21614667246fabcfd9685b6f448f3@6fbd26cc27ac44d6a7fed34092453f77@61ff5c624949454aa88561f2cd721bf6@56db8e7bc5874668ba7d5195230d067a',//璐﹀彿涓�鐨勫ソ鍙媠hareCode,涓嶅悓濂藉弸涓棿鐢ˊ绗﹀彿闅斿紑
  '6fbd26cc27ac44d6a7fed34092453f77@61ff5c624949454aa88561f2cd721bf6@9c52670d52ad4e1a812f894563c746ea@8175509d82504e96828afc8b1bbb9cb3',//璐﹀彿浜岀殑濂藉弸shareCode锛屼笉鍚屽ソ鍙嬩腑闂寸敤@绗﹀彿闅斿紑
]

// 浠庢棩蹇楄幏鍙栦簰鍔╃爜
const logShareCodes = require('./utils/jdShareCodes');
if (logShareCodes.FRUITSHARECODES.length > 0 && !process.env.FRUITSHARECODES) {
  process.env.FRUITSHARECODES = logShareCodes.FRUITSHARECODES.join('&');
}

// 鍒ゆ柇github action閲岄潰鏄惁鏈変笢涓滃啘鍦轰簰鍔╃爜
if (process.env.FRUITSHARECODES) {
  if (process.env.FRUITSHARECODES.indexOf('&') > -1) {
    console.log(`鎮ㄧ殑涓滀笢鍐滃満浜掑姪鐮侀�夋嫨鐨勬槸鐢�&闅斿紑\n`)
    FruitShareCodes = process.env.FRUITSHARECODES.split('&');
  } else if (process.env.FRUITSHARECODES.indexOf('\n') > -1) {
    console.log(`鎮ㄧ殑涓滀笢鍐滃満浜掑姪鐮侀�夋嫨鐨勬槸鐢ㄦ崲琛岄殧寮�\n`)
    FruitShareCodes = process.env.FRUITSHARECODES.split('\n');
  } else {
    FruitShareCodes = process.env.FRUITSHARECODES.split();
  }
} else if (process.env.JD_COOKIE) {
  console.log(`鐢变簬鎮ㄧ幆澧冨彉閲�(FRUITSHARECODES)閲岄潰鏈彁渚涘姪鍔涚爜锛屾晠姝ゅ杩愯灏嗕細缁欒剼鏈唴缃殑鐮佽繘琛屽姪鍔涳紝璇风煡鏅擄紒`)
}
for (let i = 0; i < FruitShareCodes.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['FruitShareCode' + index] = FruitShareCodes[i];
}
