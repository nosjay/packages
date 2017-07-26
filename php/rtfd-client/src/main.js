//
// Rtfd Client
//
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/rtfd.css'
import './assets/hljs.min.css'

import promise from 'es6-promise'
promise.polyfill()
import axios from 'axios'

var marked = require('marked')
import highlightjs from 'highlight.js'

import md5 from 'js-md5'
var jwt = require('jwt-simple')
var jsencrypt = require('jsencrypt')

let publicKey = '-----BEGIN PUBLIC KEY-----\n' +
                'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCvj2ENgnZV0sqsYwTgXrcWAt49\n' +
                'PsEISp9L/jZioZcrHbOWAj3/1wkZJsmKSXbmvzNBMnmKKSLl2yLmG8faYsFVD66u\n' +
                'p0coq82clcP8S2NY7IsH6yawDXPROTeNGz/waXPn0D1iKtzc/HGUDhGWHJWt2dIC\n' +
                '+PwN+xb9wWWUAToCLQIDAQAB\n' +
                '-----END PUBLIC KEY-----'

var encrypt = new jsencrypt.JSEncrypt()
encrypt.setPublicKey(publicKey)

axios.defaults.withCredentials = true
Vue.prototype.$action = function(action, options = {}) {
  return axios({
    // url: 'http://192.168.1.251:10000/service.php',
    url: 'http://192.168.1.125/rtfd_server/service.php',
    method: 'post',
    timeout: 3500,
    data: {
      act: action,
      ts: Math.floor((new Date()).getTime() / 1000),
      // opts: options
      opts: (function(string) {
        if (string.length < 117) {
          return encrypt.encrypt(jwt.encode(options, 'ReadTheFuckDocs'))
        } else {
          let segments = []
          while (string.length > 117) {
            segments.push(string.substr(0, 117))
            string = string.substr(117)
          }
          segments.push(string)

          for (let i = 0; i < segments.length; ++i) {
            segments[i] = encrypt.encrypt(segments[i])
          }

          return segments.join('.')
        }
      })(jwt.encode(options, 'ReadTheFuckDocs'))
    },
    transformRequest: [function (data) {
      let ret = ''
      let values = []
      for (let it in data) {
        if (data[it] instanceof Object) {
          for (let _it in data[it]) {
            values.push(data[it][_it] + '')
          }
          data[it] = JSON.stringify(data[it])
        } else {
          values.push(data[it] + '')
        }
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      // calc signature
      values = values.sort()
      let signature = md5([
        'ReadTheFuckDocs',
        values.join('-'),
        data['ts'] + ''
      ].join('~'))
      // join signature
      ret += 'sig' + '=' + signature
      // return result
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

function htmlEncode(html) {
  let temp = document.createElement('div');
  (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html)
  let output = temp.innerHTML
  temp = null
  return output
}

// Create your custom renderer.
const renderer = new marked.Renderer()
renderer.code = (code, language) => {
  // Check whether the given language is valid for highlight.js.
  const validLang = !!(language && highlightjs.getLanguage(language))
  // Highlight only if the language is valid.
  const highlighted = validLang ? highlightjs.highlight(language, code).value : htmlEncode(code)
  // Render the highlighted code with `hljs` class.
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`
}
renderer.html = (html) => {
  console.log(html)
}

marked.setOptions({
  renderer: renderer,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})
Vue.prototype.$marked = marked

Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
