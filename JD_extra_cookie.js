/*
鎰熻阿github@dompling鐨凱R

Author: 2Ya

Github: https://github.com/dompling

===================
鐗瑰埆璇存槑锛�
1.鑾峰彇澶氫釜浜笢cookie鐨勮剼鏈紝涓嶅拰NobyDa鐨勪含涓渃ookie鍐茬獊銆傛敞锛氬涓嶯obyDa鐨勪含涓渃ookie閲嶅锛屽缓璁湪姝ゅ鍒犻櫎閲嶅鐨刢ookie
===================
===================
浣跨敤鏂瑰紡锛氬湪浠ｇ悊杞欢閰嶇疆濂戒笅鏂归厤缃悗锛屽鍒� https://home.m.jd.com/myJd/newhome.action 鍒版祻瑙堝櫒鎵撳紑 锛屽湪涓汉涓績鑷姩鑾峰彇 cookie锛�
鑻ュ脊鍑烘垚鍔熷垯姝ｅ父浣跨敤銆傚惁鍒欑户缁啀姝ら〉闈㈢户缁埛鏂颁竴涓嬭瘯璇�
===================
new Env('鑾峰彇澶氳处鍙蜂含涓淐ookie');//姝ゅ蹇界暐鍗冲彲锛屼负鑷姩鐢熸垚iOS绔蒋浠堕厤缃枃浠舵墍闇�
===================
[MITM]
hostname = me-api.jd.com

===================Quantumult X=====================
[rewrite_local]
# 鑾峰彇澶氳处鍙蜂含涓淐ookie
https:\/\/me-api\.jd\.com\/user_new\/info\/GetJDUserInfoUnion url script-request-header https://gitee.com/lxk0301/jd_scripts/raw/master/JD_extra_cookie.js

===================Loon===================
[Script]
http-request https:\/\/me-api\.jd\.com\/user_new\/info\/GetJDUserInfoUnion script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/JD_extra_cookie.js, tag=鑾峰彇澶氳处鍙蜂含涓淐ookie

===================Surge===================
[Script]
鑾峰彇澶氳处鍙蜂含涓淐ookie = type=http-request,pattern=^https:\/\/me-api\.jd\.com\/user_new\/info\/GetJDUserInfoUnion,requires-body=1,max-size=0,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/JD_extra_cookie.js,script-update-interval=0
 */

const APIKey = "CookiesJD";
$ = new API(APIKey, true);
const CacheKey = `#${APIKey}`;
if ($request) GetCookie();

function getCache() {
  var cache = $.read(CacheKey) || "[]";
  $.log(cache);
  return JSON.parse(cache);
}

function GetCookie() {
  try {
    if ($request.headers && $request.url.indexOf("GetJDUserInfoUnion") > -1) {
      var CV = $request.headers["Cookie"] || $request.headers["cookie"];
      if (CV.match(/(pt_key=.+?pt_pin=|pt_pin=.+?pt_key=)/)) {
        var CookieValue = CV.match(/pt_key=.+?;/) + CV.match(/pt_pin=.+?;/);
        var UserName = CookieValue.match(/pt_pin=(.+?);/)[1];
        var DecodeName = decodeURIComponent(UserName);
        var CookiesData = getCache();
        var updateCookiesData = [...CookiesData];
        var updateIndex;
        var CookieName = "銆愯处鍙枫��";
        var updateCodkie = CookiesData.find((item, index) => {
          var ck = item.cookie;
          var Account = ck
            ? ck.match(/pt_pin=.+?;/)
              ? ck.match(/pt_pin=(.+?);/)[1]
              : null
            : null;
          const verify = UserName === Account;
          if (verify) {
            updateIndex = index;
          }
          return verify;
        });
        var tipPrefix = "";
        if (updateCodkie) {
          updateCookiesData[updateIndex].cookie = CookieValue;
          CookieName = `銆愯处鍙�${updateIndex + 1}銆慲;
          tipPrefix = "鏇存柊浜笢";
        } else {
          updateCookiesData.push({
            userName: DecodeName,
            cookie: CookieValue,
          });
          CookieName = "銆愯处鍙�" + updateCookiesData.length + "銆�";
          tipPrefix = "棣栨鍐欏叆浜笢";
        }
        const cacheValue = JSON.stringify(updateCookiesData, null, "\t");
        $.write(cacheValue, CacheKey);
        $.notify(
          "鐢ㄦ埛鍚�: " + DecodeName,
          "",
          tipPrefix + CookieName + "Cookie鎴愬姛 馃帀"
        );
      } else {
        $.notify("鍐欏叆浜笢Cookie澶辫触", "", "璇锋煡鐪嬭剼鏈唴璇存槑, 鐧诲綍缃戦〉鑾峰彇 鈥硷笍");
      }
      $.done();
      return;
    } else {
      $.notify("鍐欏叆浜笢Cookie澶辫触", "", "璇锋鏌ュ尮閰峌RL鎴栭厤缃唴鑴氭湰绫诲瀷 鈥硷笍");
    }
  } catch (eor) {
    $.write("", CacheKey);
    $.notify("鍐欏叆浜笢Cookie澶辫触", "", "宸插皾璇曟竻绌哄巻鍙睠ookie, 璇烽噸璇� 鈿狅笍");
    console.log(
      `\n鍐欏叆浜笢Cookie鍑虹幇閿欒 鈥硷笍\n${JSON.stringify(
        eor
      )}\n\n${eor}\n\n${JSON.stringify($request.headers)}\n`
    );
  }
  $.done();
}

// prettier-ignore
function ENV(){const isQX=typeof $task!=="undefined";const isLoon=typeof $loon!=="undefined";const isSurge=typeof $httpClient!=="undefined"&&!isLoon;const isJSBox=typeof require=="function"&&typeof $jsbox!="undefined";const isNode=typeof require=="function"&&!isJSBox;const isRequest=typeof $request!=="undefined";const isScriptable=typeof importModule!=="undefined";return{isQX,isLoon,isSurge,isNode,isJSBox,isRequest,isScriptable}}
// prettier-ignore
function HTTP(baseURL,defaultOptions={}){const{isQX,isLoon,isSurge,isScriptable,isNode}=ENV();const methods=["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"];function send(method,options){options=typeof options==="string"?{url:options}:options;options.url=baseURL?baseURL+options.url:options.url;options={...defaultOptions,...options};const timeout=options.timeout;const events={...{onRequest:()=>{},onResponse:(resp)=>resp,onTimeout:()=>{},},...options.events,};events.onRequest(method,options);let worker;if(isQX){worker=$task.fetch({method,...options})}else if(isLoon||isSurge||isNode){worker=new Promise((resolve,reject)=>{const request=isNode?require("request"):$httpClient;request[method.toLowerCase()](options,(err,response,body)=>{if(err)reject(err);else resolve({statusCode:response.status||response.statusCode,headers:response.headers,body,})})})}else if(isScriptable){const request=new Request(options.url);request.method=method;request.headers=options.headers;request.body=options.body;worker=new Promise((resolve,reject)=>{request.loadString().then((body)=>{resolve({statusCode:request.response.statusCode,headers:request.response.headers,body,})}).catch((err)=>reject(err))})}let timeoutid;const timer=timeout?new Promise((_,reject)=>{timeoutid=setTimeout(()=>{events.onTimeout();return reject(`${method}URL:${options.url}exceeds the timeout ${timeout}ms`)},timeout)}):null;return(timer?Promise.race([timer,worker]).then((res)=>{clearTimeout(timeoutid);return res}):worker).then((resp)=>events.onResponse(resp))}const http={};methods.forEach((method)=>(http[method.toLowerCase()]=(options)=>send(method,options)));return http}
// prettier-ignore
function API(name="untitled",debug=false){const{isQX,isLoon,isSurge,isNode,isJSBox,isScriptable}=ENV();return new(class{constructor(name,debug){this.name=name;this.debug=debug;this.http=HTTP();this.env=ENV();this.node=(()=>{if(isNode){const fs=require("fs");return{fs}}else{return null}})();this.initCache();const delay=(t,v)=>new Promise(function(resolve){setTimeout(resolve.bind(null,v),t)});Promise.prototype.delay=function(t){return this.then(function(v){return delay(t,v)})}}initCache(){if(isQX)this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}");if(isLoon||isSurge)this.cache=JSON.parse($persistentStore.read(this.name)||"{}");if(isNode){let fpath="root.json";if(!this.node.fs.existsSync(fpath)){this.node.fs.writeFileSync(fpath,JSON.stringify({}),{flag:"wx"},(err)=>console.log(err))}this.root={};fpath=`${this.name}.json`;if(!this.node.fs.existsSync(fpath)){this.node.fs.writeFileSync(fpath,JSON.stringify({}),{flag:"wx"},(err)=>console.log(err));this.cache={}}else{this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`))}}}persistCache(){const data=JSON.stringify(this.cache);if(isQX)$prefs.setValueForKey(data,this.name);if(isLoon||isSurge)$persistentStore.write(data,this.name);if(isNode){this.node.fs.writeFileSync(`${this.name}.json`,data,{flag:"w"},(err)=>console.log(err));this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},(err)=>console.log(err))}}write(data,key){this.log(`SET ${key}`);if(key.indexOf("#")!==-1){key=key.substr(1);if(isSurge||isLoon){return $persistentStore.write(data,key)}if(isQX){return $prefs.setValueForKey(data,key)}if(isNode){this.root[key]=data}}else{this.cache[key]=data}this.persistCache()}read(key){this.log(`READ ${key}`);if(key.indexOf("#")!==-1){key=key.substr(1);if(isSurge||isLoon){return $persistentStore.read(key)}if(isQX){return $prefs.valueForKey(key)}if(isNode){return this.root[key]}}else{return this.cache[key]}}delete(key){this.log(`DELETE ${key}`);if(key.indexOf("#")!==-1){key=key.substr(1);if(isSurge||isLoon){$persistentStore.write(null,key)}if(isQX){$prefs.removeValueForKey(key)}if(isNode){delete this.root[key]}}else{delete this.cache[key]}this.persistCache()}notify(title,subtitle="",content="",options={}){const openURL=options["open-url"];const mediaURL=options["media-url"];if(isQX)$notify(title,subtitle,content,options);if(isSurge){$notification.post(title,subtitle,content+`${mediaURL?"\n澶氬獟浣�:"+mediaURL:""}`,{url:openURL})}if(isLoon){let opts={};if(openURL)opts["openUrl"]=openURL;if(mediaURL)opts["mediaUrl"]=mediaURL;if(JSON.stringify(opts)=="{}"){$notification.post(title,subtitle,content)}else{$notification.post(title,subtitle,content,opts)}}if(isNode||isScriptable){const content_=content+(openURL?`\n鐐瑰嚮璺宠浆:${openURL}`:"")+(mediaURL?`\n澶氬獟浣�:${mediaURL}`:"");if(isJSBox){const push=require("push");push.schedule({title:title,body:(subtitle?subtitle+"\n":"")+content_,})}else{console.log(`${title}\n${subtitle}\n${content_}\n\n`)}}}log(msg){if(this.debug)console.log(msg)}info(msg){console.log(msg)}error(msg){console.log("ERROR: "+msg)}wait(millisec){return new Promise((resolve)=>setTimeout(resolve,millisec))}done(value={}){if(isQX||isLoon||isSurge){$done(value)}else if(isNode&&!isJSBox){if(typeof $context!=="undefined"){$context.headers=value.headers;$context.statusCode=value.statusCode;$context.body=value.body}}}})(name,debug)}
