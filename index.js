//'use strict';
exports.main_handler = async (event, context, callback) => {
  try {
    const { TENCENTSCF_SOURCE_TYPE, TENCENTSCF_SOURCE_URL } = process.env
    //濡傛灉鎯冲湪涓�涓畾鏃惰Е鍙戝櫒閲岄潰鎵ц澶氫釜js鏂囦欢闇�瑕佸湪瀹氭椂瑙﹀彂鍣ㄧ殑銆愰檮鍔犱俊鎭�戦噷闈㈠～鍐欏搴旂殑鍚嶇О锛岀敤 & 閾炬帴
    //渚嬪鎴戞兂涓�涓畾鏃惰Е鍙戝櫒閲屾墽琛宩d_speed.js鍜宩d_bean_change.js锛屽湪瀹氭椂瑙﹀彂鍣ㄧ殑銆愰檮鍔犱俊鎭�戦噷闈㈠氨濉啓 jd_speed&jd_bean_change
    for (const v of event["Message"].split("&")) {
      console.log(v);
      var request = require('request');
      switch (TENCENTSCF_SOURCE_TYPE) {
        case 'local':
          //1.鎵ц鑷繁涓婁紶鐨刯s鏂囦欢
          delete require.cache[require.resolve('./'+v+'.js')];
          require('./'+v+'.js')
          break;
        case 'git':
          //2.鎵цgithub杩滅鐨刯s鏂囦欢(鍥爂ithub鐨剅aw绫诲瀷鐨勬枃浠惰澧�,姝ゆ柟娉曚簯鍑芥暟涓嶆帹鑽�)
          request(`https://raw.githubusercontent.com/LXK9301/jd_scripts/master/${v}.js`, function (error, response, body) {
            eval(response.body)
          })
          break;
        case 'custom':
          //3.鎵ц鑷畾涔夎繙绔痡s鏂囦欢缃戝潃
          if (!TENCENTSCF_SOURCE_URL) return console.log('鑷畾涔夋ā寮忛渶瑕佽缃甌ENCENTSCF_SOURCE_URL鍙橀噺')
          request(`${TENCENTSCF_SOURCE_URL}${v}.js`, function (error, response, body) {
            eval(response.body)
          })
          break;
        default:
          //4.鎵ц鍥藉唴gitee杩滅鐨刯s鏂囦欢(濡傛灉閮ㄧ讲鍦ㄥ浗鍐呰妭鐐癸紝閫夋嫨1鎴�3銆傞粯璁や娇鐢╣itee鐨勬柟寮�)
          request(`https://gitee.com/lxk0301/jd_scripts/raw/master/${v}.js`, function (error, response, body) {
            eval(response.body)
          })
          break;
      }
    }
  } catch (e) {
    console.error(e)
  }
}
