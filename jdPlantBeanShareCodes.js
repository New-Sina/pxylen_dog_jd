/*
浜笢绉嶈眴寰楄眴浜掑姪鐮�
姝ゆ枃浠朵负Node.js涓撶敤銆傚叾浠栫敤鎴疯蹇界暐
鏀寔浜笢N涓处鍙�
 */
//浜戞湇鍔″櫒鑵捐浜戝嚱鏁扮瓑NOde.js鐢ㄦ埛鍦ㄦ澶勫～鍐欎笢涓滆悓瀹犵殑濂藉弸鐮併��
// 鍚屼竴涓含涓滆处鍙风殑濂藉弸浜掑姪鐮佺敤@绗﹀彿闅斿紑,涓嶅悓浜笢璐﹀彿涔嬮棿鐢�&绗﹀彿鎴栬�呮崲琛岄殧寮�,涓嬮潰缁欎竴涓ず渚�
// 濡�: 浜笢璐﹀彿1鐨剆hareCode1@浜笢璐﹀彿1鐨剆hareCode2&浜笢璐﹀彿2鐨剆hareCode1@浜笢璐﹀彿2鐨剆hareCode2
let PlantBeanShareCodes = [
  '66j4yt3ebl5ierjljoszp7e4izzbzaqhi5k2unz2afwlyqsgnasq@olmijoxgmjutyrsovl2xalt2tbtfmg6sqldcb3q@e7lhibzb3zek27amgsvywffxx7hxgtzstrk2lba@olmijoxgmjutyx55upqaqxrblt7f3h26dgj2riy',//璐﹀彿涓�鐨勫ソ鍙媠hareCode,涓嶅悓濂藉弸涓棿鐢ˊ绗﹀彿闅斿紑
  'mlrdw3aw26j3wgzjipsxgonaoyr2evrdsifsziy@mlrdw3aw26j3wgzjipsxgonaoyr2evrdsifsziy',//璐﹀彿浜岀殑濂藉弸shareCode锛屼笉鍚屽ソ鍙嬩腑闂寸敤@绗﹀彿闅斿紑
]

// 浠庢棩蹇楄幏鍙栦簰鍔╃爜
const logShareCodes = require('./utils/jdShareCodes');
if (logShareCodes.PLANT_BEAN_SHARECODES.length > 0 && !process.env.PLANT_BEAN_SHARECODES) {
  process.env.PLANT_BEAN_SHARECODES = logShareCodes.PLANT_BEAN_SHARECODES.join('&');
}

// 鍒ゆ柇github action閲岄潰鏄惁鏈夌璞嗗緱璞嗕簰鍔╃爜
if (process.env.PLANT_BEAN_SHARECODES) {
  if (process.env.PLANT_BEAN_SHARECODES.indexOf('&') > -1) {
    console.log(`鎮ㄧ殑绉嶈眴浜掑姪鐮侀�夋嫨鐨勬槸鐢�&闅斿紑\n`)
    PlantBeanShareCodes = process.env.PLANT_BEAN_SHARECODES.split('&');
  } else if (process.env.PLANT_BEAN_SHARECODES.indexOf('\n') > -1) {
    console.log(`鎮ㄧ殑绉嶈眴浜掑姪鐮侀�夋嫨鐨勬槸鐢ㄦ崲琛岄殧寮�\n`)
    PlantBeanShareCodes = process.env.PLANT_BEAN_SHARECODES.split('\n');
  } else {
    PlantBeanShareCodes = process.env.PLANT_BEAN_SHARECODES.split();
  }
} else if (process.env.JD_COOKIE) {
  console.log(`鐢变簬鎮ㄧ幆澧冨彉閲�(PLANT_BEAN_SHARECODES)閲岄潰鏈彁渚涘姪鍔涚爜锛屾晠姝ゅ杩愯灏嗕細缁欒剼鏈唴缃殑鐮佽繘琛屽姪鍔涳紝璇风煡鏅擄紒`)
}
for (let i = 0; i < PlantBeanShareCodes.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['PlantBeanShareCodes' + index] = PlantBeanShareCodes[i];
}
