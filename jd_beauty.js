/*
缇庝附鐮旂┒闄�
娲诲姩鍏ュ彛锛氫含涓渁pp棣栭〉-缇庡棣�-搴曢儴涓棿鎸夐挳
鍙敮鎸丯ode.js鏀寔N涓含涓滆处鍙�
鑴氭湰鍏煎: Node.js
cron 1 7,12,19 * * * jd_beauty.js
 */
const $ = new Env('缇庝附鐮旂┒闄�');

const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js鐢ㄦ埛璇峰湪jdCookie.js澶勫～鍐欎含涓渃k;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//const WebSocket = $.isNode() ? require('websocket').w3cwebsocket: SockJS;
let jdNotify = true;//鏄惁鍏抽棴閫氱煡锛宖alse鎵撳紑閫氱煡鎺ㄩ�侊紝true鍏抽棴閫氱煡鎺ㄩ��
const randomCount = $.isNode() ? 20 : 5;
const bean = 500
//IOS绛夌敤鎴风洿鎺ョ敤NobyDa鐨刯d cookie
let cookiesArr = [], cookie = '', message, helpInfo, ADD_CART = false;

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '銆愭彁绀恒�戣鍏堣幏鍙栦含涓滆处鍙蜂竴cookie\n鐩存帴浣跨敤NobyDa鐨勪含涓滅鍒拌幏鍙�', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  if (!$.isNode()) {
    $.msg($.name, 'iOS绔笉鏀寔websocket锛屾殏涓嶈兘浣跨敤姝よ剼鏈�', '');
    return
  }
  helpInfo = []
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n******寮�濮嬨�愪含涓滆处鍙�${$.index}銆�${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `銆愭彁绀恒�慶ookie宸插け鏁坄, `浜笢璐﹀彿${$.index} ${$.nickName || $.UserName}\n璇烽噸鏂扮櫥褰曡幏鍙朶nhttps://bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie宸插け鏁� - ${$.UserName}`, `浜笢璐﹀彿${$.index} ${$.UserName}\n璇烽噸鏂扮櫥褰曡幏鍙朿ookie`);
        }
        continue
      }
      await jdBeauty()
      helpInfo = $.helpInfo
    }
  }
})()
  .catch((e) => {
    $.log('', `鉂� ${$.name}, 澶辫触! 鍘熷洜: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdBeauty() {
  $.hasDone = false
  await getIsvToken()
  await getIsvToken2()
  await getToken()
  await mr()
  while (!$.hasDone) {
    await $.wait(1000)
  }
  await showMsg();
}

async function mr() {
  $.coins = 0
  $.init = false
  let positionList = ['b1', 'h1', 's1', 'b2', 'h2', 's2']
  $.tokens = []
  $.pos = []
  $.helpInfo = []
  $.needs = []
  const WebSocket = require('ws')
  let client = new WebSocket(`wss://xinruimz-isv.isvjcloud.com/wss/?token=${$.token}`)
  client.onopen = async () => {
    console.log(`缇庡鐮旂┒闄㈡湇鍔″櫒杩炴帴鎴愬姛`);
    client.send('{"msg":{"type":"action","args":{"source":1},"action":"_init_"}}');
    client.send(`{"msg":{"type":"action","args":{"source":"meizhuangguandibudaohang"},"action":"stats"}}`)
    while (!$.init) {
      client.send(`ping`)
      await $.wait(1000)
    }
    for (let help of helpInfo) {
      client.send(help)
    }
    await $.wait(1000)
    client.send(`{"msg":{"type":"action","args":{},"action":"shop_products"}}`)
    // 鑾峰緱鍙敓浜х殑鍘熸枡鍒楄〃
    client.send(`{"msg":{"type":"action","args":{},"action":"get_produce_material"}}`)
    await $.wait(1000)
    // 鑾峰緱姝ｅ湪鐢熶骇鐨勫晢鍝佷俊鎭�
    client.send('{"msg":{"type":"action","args":{},"action":"product_producing"}}')
    await $.wait(1000)
    // 鑾峰緱搴撳瓨
    client.send(`{"msg":{"type":"action","args":{},"action":"get_package"}}`)
    // 鑾峰緱鍙敓鎴愮殑鍟嗗搧鍒楄〃
    client.send(`{"msg":{"type":"action","args":{"page":1,"num":10},"action":"product_lists"}}`)
    await $.wait(1000)

    // 鑾峰緱鍘熸枡鐢熶骇鍒楄〃
    console.log(`========鍘熸枡鐢熶骇淇℃伅========`)
    for (let pos of positionList) {
      client.send(`{"msg":{"type":"action","args":{"position":"${pos}"},"action":"produce_position_info"}}`)
      // await $.wait(500)
    }

    // 鑾峰緱浠诲姟
    client.send(`{"msg":{"type":"action","args":{},"action":"get_task"}}`)
    // 鑾峰彇涓汉淇℃伅
    client.send(`{"msg":{"type":"action","args":{"source":1},"action":"get_user"}}`)
    await $.wait(1000)
    // 鑾峰緱绂忓埄涓績
    client.send(`{"msg":{"type":"action","args":{},"action":"get_benefit"}}`)
  };

  client.onclose = () => {
    console.log(`鏈杩愯鑾峰緱缇庡甯�${$.coins}`)
    // console.log('鏈嶅姟鍣ㄨ繛鎺ュ叧闂�');
    $.hasDone = true
    for (let i = 0; i < $.pos.length && i < $.tokens.length; ++i) {
      $.helpInfo.push(`{"msg":{"type":"action","args":{"inviter_id":"${$.userInfo.id}","position":"${$.pos[i]}","token":"${$.tokens[i]}"},"action":"employee"}}`)
    }
  };
  client.onmessage = async function (e) {
    if (e.data !== 'pong' && e.data && safeGet(e.data)) {
      let vo = JSON.parse(e.data);
      switch (vo.action) {
        case "get_ad":
          console.log(`褰撴湡娲诲姩锛�${vo.data.screen.name}`)
          if (vo.data.check_sign_in === 1) {
            // 鍘荤鍒�
            console.log(`鍘诲仛绛惧埌浠诲姟`)
            client.send(`{"msg":{"type":"action","args":{},"action":"sign_in"}}`)
            client.send(`{"msg":{"action":"write","type":"action","args":{"action_type":1,"channel":2,"source_app":2}}}`)
          }
          break
        case "get_user":
          $.userInfo = vo.data
          $.total = vo.data.coins
          if ($.userInfo.newcomer === 0) {
            console.log(`鍘诲仛鏂版墜浠诲姟`)
            for (let i = $.userInfo.step; i < 15; ++i) {
              client.send(`{"msg":{"type":"action","args":{},"action":"newcomer_update"}}`)
              await $.wait(500)
            }
          } else
            $.init = true
          $.level = $.userInfo.level
          console.log(`褰撳墠缇庡甯�${$.total}锛岀敤鎴风瓑绾�${$.level}`)
          break
        case "shop_products":
          let count = $.taskState.shop_view.length
          if (count < 5) console.log(`鍘诲仛鍏虫敞搴楅摵浠诲姟`)
          for (let i = 0; i < vo.data.shops.length && count < 5; ++i) {
            const shop = vo.data.shops[i]
            if (!$.taskState.shop_view.includes(shop.id)) {
              count++
              console.log(`鍘诲仛鍏虫敞搴楅摵銆�${shop.name}銆慲)
              client.send(`{"msg":{"type":"action","args":{"shop_id":${shop.id}},"action":"shop_view"}}`)
              client.send(`{"msg":{"action":"write","type":"action","args":{"action_type":6,"channel":2,"source_app":2,"vender":"${shop.vender_id}"}}}`)
            }
            await $.wait(1000)
          }
          count = $.taskState.product_adds.length
          if (count < 5 && ADD_CART) console.log(`鍘诲仛娴忚骞跺姞璐换鍔)
          for (let i = 0; i < vo.data.products.length && count < 5 && ADD_CART; ++i) {
            const product = vo.data.products[i]
            if (!$.taskState.product_adds.includes(product.id)) {
              count++
              console.log(`鍘诲姞璐晢鍝併��${product.name}銆慲)
              client.send(`{"msg":{"type":"action","args":{"add_product_id":${product.id}},"action":"add_product_view"}}`)
              client.send(`{"msg":{"action":"write","type":"action","args":{"action_type":9,"channel":2,"source_app":2,"vender":"${product.id}"}}}`)
              client.send(`{"msg":{"action":"write","type":"action","args":{"action_type":5,"channel":2,"source_app":2,"vender":"${product.id}"}}}`)
            }
            await $.wait(1000)
          }
          for (let i = $.taskState.meetingplace_view; i < $.taskState.mettingplace_count; ++i) {
            console.log(`鍘诲仛绗�${i + 1}娆℃祻瑙堜細鍦轰换鍔)
            client.send(`{"msg":{"type":"action","args":{"source":1},"action":"meetingplace_view"}}`)
            await $.wait(2000)
          }
          if ($.taskState.today_answered === 0) {
            console.log(`鍘诲仛姣忔棩闂瓟浠诲姟`)
            client.send(`{"msg":{"type":"action","args":{"source":1},"action":"get_question"}}`)
          }
          break
        case "check_up":
          $.taskState = vo.data
          // 6-9鐐圭鍒�
          for (let check_up of vo.data.check_up) {
            if (check_up['receive_status'] !== 1) {
              console.log(`鍘婚鍙栫${check_up.times}娆＄鍒板鍔盽)
              client.send(`{"msg":{"type":"action","args":{"check_up_id":${check_up.id}},"action":"check_up_receive"}}`)
            } else {
              console.log(`绗�${check_up.times}娆＄鍒板鍔卞凡棰嗗彇`)
            }
          }
          break
        case 'newcomer_update':
          if (vo.code === '200' || vo.code === 200) {
            console.log(`绗�${vo.data.step}姝ユ柊鎵嬩换鍔″畬鎴愭垚鍔燂紝鑾峰緱${vo.data.coins}缇庡甯乣)
            if (vo.data.step === 15) $.init = true
            if (vo.data.coins) $.coins += vo.data.coins
          } else {
            console.log(`鏂版墜浠诲姟瀹屾垚澶辫触锛岄敊璇俊鎭細${JSON.stringify(vo)}`)
          }
          break
        case 'get_question':
          const questions = vo.data
          let commit = {}
          for (let i = 0; i < questions.length; ++i) {
            const ques = questions[i]
            commit[`${ques.id}`] = parseInt(ques.answers)
          }
          await $.wait(5000)
          client.send(`{"msg":{"type":"action","args":{"commit":${JSON.stringify(commit)},"correct":${questions.length}},"action":"submit_answer"}}`)
          break
        case 'complete_task':
        case 'action':
        case 'submit_answer':
        case "check_up_receive":
        case "shop_view":
        case "add_product_view":
        case "meetingplace_view":
          if (vo.code === '200' || vo.code === 200) {
            console.log(`浠诲姟瀹屾垚鎴愬姛锛岃幏寰�${vo.data.coins}缇庡甯乣)
            if (vo.data.coins) $.coins += vo.data.coins
            $.total = vo.data.user_coins
          } else {
            console.log(`浠诲姟瀹屾垚澶辫触锛岄敊璇俊鎭�${vo.msg}`)
          }
          break
        case "produce_position_info":
          if (vo.data.material_name !== '') {
            console.log(`銆�${vo.data.position}銆戜笂姝ｅ湪鐢熶骇銆�${vo.data.material_name}銆戯紝鍙敹鍙� ${vo.data.produce_num} 浠絗)
            if (vo.data.produce_num > 0) {
              console.log(`鍓╀綑浠芥暟澶т簬0浠斤紝鍘绘敹鍙朻)
              client.send(`{"msg":{"type":"action","args":{"position":"${vo.data.position}","replace_material":false},"action":"material_fetch"}}`)
              client.send(`{"msg":{"type":"action","args":{},"action":"to_employee"}}`)
              $.pos.push(vo.data.position)
            }
          } else {
            if (vo.data.valid_electric > 0) {
              console.log(`銆�${vo.data.position}銆戜笂灏氭湭寮�濮嬬敓浜)
              let ma
              if($.needs.length){
                ma = $.needs.pop()
              }
              else ma = $.material.base[0]['items'][positionList.indexOf(vo.data.position)]
              console.log()
              if (ma) {
                console.log(`鍘荤敓浜�${ma.name}`)
                client.send(`{"msg":{"type":"action","args":{"position":"${vo.data.position}","material_id":${ma.id}},"action":"material_produce"}}`)
              } else {
                ma = $.material.base[1]['items'][positionList.indexOf(vo.data.position)]
                if (ma) {
                  console.log(`鍘荤敓浜�${ma.name}`)
                  client.send(`{"msg":{"type":"action","args":{"position":"${vo.data.position}","material_id":${ma.id}},"action":"material_produce"}}`)
                }
              }
            }
            else{
              console.log(`銆�${vo.data.position}銆戠數鍔涗笉瓒砢)
            }
          }
          break
        case "material_produce":
          console.log(`銆�${vo.data.position}銆戜笂寮�濮嬬敓浜�${vo.data.material_name}`)
          client.send(`{"msg":{"type":"action","args":{},"action":"to_employee"}}`)
          $.pos.push(vo.data.position)
          break
        case "material_fetch":
          if (vo.code === '200' || vo.code === 200) {
            console.log(vo)
            console.log(`銆�${vo.data.position}銆戞敹鍙栨垚鍔燂紝鑾峰緱${vo.data.procedure.produce_num}浠�${vo.data.material_name}`)
          } else {
            console.log(`浠诲姟瀹屾垚澶辫触锛岄敊璇俊鎭�${vo.msg}`)
          }
          break
        case "get_package":
          if (vo.code === '200' || vo.code === 200) {
            // $.products = vo.data.product
            $.materials = vo.data.material
            let msg = `浠撳簱淇℃伅:`
            for (let material of $.materials) {
              msg += `銆�${material.material.name}銆�${material.num}浠� `
            }
            console.log(msg)
          } else {
            console.log(`浠撳簱淇℃伅鑾峰彇澶辫触锛岄敊璇俊鎭�${vo.msg}`)
          }
          break
        case "product_lists":
          let need_material = []
          if (vo.code === '200' || vo.code === 200) {
            $.products = vo.data.filter(vo=>vo.level===$.level)
            console.log(`========鍙敓浜у晢鍝佷俊鎭�========`)
            for (let product of $.products) {
              let num = Infinity
              let msg = ''
              msg += `鐢熶骇銆�${product.name}銆戦渶瑕佸師鏂檂
              for (let material of product.product_materials) {
                msg += `銆�${material.material.name}銆�${material.num} 浠� `
                const ma = $.materials.filter(vo => vo.item_id === material.material_id)[0]
                if (ma) {
                  msg += `锛堝簱瀛� ${ma.num} 浠斤級`
                  num = Math.min(num, Math.trunc(ma.num / material.num))
                } else {
                  if(need_material.findIndex(vo=>vo.id===material.material.id)===-1)
                    need_material.push(material.material)
                  msg += `(娌℃湁搴撳瓨)`
                  num = -1000
                }
              }
              if (num !== Infinity && num > 0) {
                msg += `锛屽彲鐢熶骇 ${num}浠絗
                console.log(msg)
                console.log(`銆�${product.name}銆戝彲鐢熶骇浠芥暟澶т簬0锛屽幓鐢熶骇`)
                client.send(`{"msg":{"type":"action","args":{"product_id":${product.id},"amount":${num}},"action":"product_produce"}}`)
                await $.wait(500)
              } else {
                console.log(msg)
                console.log(`銆�${product.name}銆戝師鏂欎笉瓒筹紝鏃犳硶鐢熶骇`)
              }
            }
            $.needs = need_material
            console.log(`=======================`)
          } else {
            console.log(`鐢熶骇淇℃伅鑾峰彇澶辫触锛岄敊璇俊鎭細${vo.msg}`)
          }
          break
        case "product_produce":
          if (vo.code === '200' || vo.code === 200) {
            console.log(`鐢熶骇鎴愬姛`)
          } else {
            console.log(`鐢熶骇淇℃伅鑾峰彇澶辫触锛岄敊璇俊鎭�${vo.msg}`)
          }
          break
        case "product_producing":
          if (vo.code === '200' || vo.code === 200) {
            for (let product of vo.data) {
              if (product.num === product.produce_num) {
                client.send(`{"msg":{"type":"action","args":{"log_id":${product.id}},"action":"product_fetch"}}`)
              } else {
                console.log(`浜у搧銆�${product.product.id}銆戞湭鐢熶骇瀹屾垚锛屾棤娉曟敹鍙朻)
              }
            }
          } else {
            console.log(`鐢熶骇鍟嗗搧淇℃伅鑾峰彇澶辫触锛岄敊璇俊鎭�${vo.msg}`)
          }
          break
        case "product_fetch":
          if (vo.code === '200' || vo.code === 200) {
            console.log(`鏀跺彇浜у搧銆�${vo.data.product.name}銆�${vo.data.num}浠絗)
          } else {
            console.log(`鏀跺彇浜у搧澶辫触锛岄敊璇俊鎭�${vo.msg}`)
          }
          break
        case "get_task":
          console.log(`褰撳墠浠诲姟銆�${vo.data.describe}銆戯紝闇�瑕併��${vo.data.product.name}銆�${vo.data.package_stock}/${vo.data.num}浠絗)
          if (vo.data.package_stock >= vo.data.num) {
            console.log(`婊¤冻浠诲姟瑕佹眰锛屽幓瀹屾垚浠诲姟`)
            client.send(`{"msg":{"type":"action","args":{"task_id":${vo.data.id}},"action":"complete_task"}}`)
          }
          break
        case 'get_benefit':
          for (let benefit of vo.data) {
            if (benefit.type === 1) {
              console.log(`鐗╁搧銆�${benefit.description}銆戦渶瑕�${benefit.coins}缇庡甯侊紝搴撳瓨${benefit.stock}浠絗)
              if (parseInt(benefit.setting.beans_count) === bean &&
                $.total > benefit.coins &&
                parseInt(benefit.day_exchange_count) < benefit.day_limit) {
                console.log(`婊¤冻鏉′欢锛屽幓鍏戞崲`)
                client.send(`{"msg":{"type":"action","args":{"benefit_id":${benefit.id}},"action":"to_exchange"}}`)
                await $.wait(1000)
              }
            }
          }
          break
        case "to_exchange":
          console.log(`鍏戞崲鎴愬姛`)
          break
        case "get_produce_material":
          $.material = vo.data
          break
        case "to_employee":
          console.log(`闆囦剑鍔╁姏鐮併��${vo.data.token}銆慲)
          $.tokens.push(vo.data.token)
          break
        case "employee":
          console.log(`${vo.msg}`)
          break
      }
    }
  };
}

function getIsvToken() {
  let config = {
    url: 'https://api.m.jd.com/client.action?functionId=genToken',
    body: 'body=%7B%22to%22%3A%22https%3A%5C/%5C/xinruimz-isv.isvjcloud.com%5C/?channel%3Dmeizhuangguandibudaohang%26collectionId%3D96%26tttparams%3DYEyYQjMIeyJnTG5nIjoiMTE4Ljc2MjQyMSIsImdMYXQiOiIzMi4yNDE4ODIifQ8%253D%253D%26un_area%3D12_904_908_57903%26lng%3D118.7159742308471%26lat%3D32.2010317443041%22%2C%22action%22%3A%22to%22%7D&build=167490&client=apple&clientVersion=9.3.2&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&osVersion=14.2&partner=apple&rfs=0000&scope=01&sign=b0aac3dd04b1c6d68cee3d425e27f480&st=1610161913667&sv=111',
    headers: {
      'Host': 'api.m.jd.com',
      'accept': '*/*',
      'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
      'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  }
  return new Promise(resolve => {
    $.post(config, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.name} API璇锋眰澶辫触锛岃妫�鏌ョ綉璺噸璇昤);
          console.log(`${JSON.stringify(err)}`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.isvToken = data['tokenKey']
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function getIsvToken2() {
  let config = {
    url: 'https://api.m.jd.com/client.action?functionId=isvObfuscator',
    body: 'body=%7B%22url%22%3A%22https%3A%5C/%5C/xinruimz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167490&client=apple&clientVersion=9.3.2&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&osVersion=14.2&partner=apple&rfs=0000&scope=01&sign=6eb3237cff376c07a11c1e185761d073&st=1610161927336&sv=102&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D',
    headers: {
      'Host': 'api.m.jd.com',
      'accept': '*/*',
      'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
      'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  }
  return new Promise(resolve => {
    $.post(config, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API璇锋眰澶辫触锛岃妫�鏌ョ綉璺噸璇昤)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.token2 = data['token']
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function getToken() {
  let config = {
    url: 'https://xinruimz-isv.isvjcloud.com/api/auth',
    body: `{"token":"${$.token2}","source":"01"}`,
    headers: {
      'Host': 'xinruimz-isv.isvjcloud.com',
      'Accept': 'application/x.jd-school-island.v1+json',
      'Source': '02',
      'Accept-Language': 'zh-cn',
      'Content-Type': 'application/json;charset=utf-8',
      'Origin': 'https://xinruimz-isv.isvjcloud.com',
      'User-Agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
      'Referer': 'https://xinruimz-isv.isvjcloud.com/logined_jd/',
      'Cookie': `${cookie} isvToken=${$.isvToken};`
    }
  }
  return new Promise(resolve => {
    $.post(config, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${err},${jsonParse(resp.body)['message']}`)
          console.log(`${$.name} API璇锋眰澶辫触锛岃妫�鏌ョ綉璺噸璇昤)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.token = data.access_token
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function showMsg() {
  return new Promise(resolve => {
    message += `鏈杩愯鑾峰緱缇庡甯�${$.coins}鏋歕n褰撳墠缇庡甯�${$.total}`;
    $.msg($.name, '', `浜笢璐﹀彿${$.index}${$.nickName}\n${message}`);
    resolve()
  })
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API璇锋眰澶辫触锛岃妫�鏌ョ綉璺噸璇昤)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie杩囨湡
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = data['base'].nickname;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`浜笢鏈嶅姟鍣ㄨ繑鍥炵┖鏁版嵁`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`浜笢鏈嶅姟鍣ㄨ闂暟鎹负绌猴紝璇锋鏌ヨ嚜韬澶囩綉缁滄儏鍐礰);
    return false;
  }
}

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '涓嶈鍦˙oxJS鎵嬪姩澶嶅埗绮樿创淇敼cookie')
      return [];
    }
  }
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GIT_HUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`馃敂${this.name}, 寮�濮�!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============馃摚绯荤粺閫氱煡馃摚=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`鉂楋笍${this.name}, 閿欒!`,t.stack):this.log("",`鉂楋笍${this.name}, 閿欒!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`馃敂${this.name}, 缁撴潫! 馃暃 ${s} 绉抈),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
