// Only support https proxy right now
const {execSync} = require('child_process');
const HttpsProxyAgent = require('https-proxy-agent');
const {info, warn} = require('./log');

function getNpmrcKey(key) {
  const value = execSync(`npm config get ${key}`).toString().trim();
  if (value === 'undefined' || value === 'null') return;
  return value;
}

module.exports = function () {
  const rcHttpsProxy = getNpmrcKey('https-proxy');
  const rcProxy = getNpmrcKey('proxy');
  const envHttpsProxy = process.env.HTTPS_PROXY;
  const envHttpsProxyL = process.env.https_proxy;
  const envHttpProxy = process.env.HTTP_PROXY;
  const envHttpProxyL = process.env.http_proxy;

  let proxy;
  if (rcHttpsProxy) {
    info(`Got npmrc https-proxy: ${rcHttpsProxy}`);
    proxy = rcHttpsProxy;
  } else if (rcProxy) {
    info(`Got npmrc proxy:  ${rcProxy}`);
    proxy = rcProxy;
  } else if (envHttpsProxy) {
    info(`Got env HTTPS_PROXY: ${envHttpsProxy}`);
    proxy = envHttpsProxy;
  } else if (envHttpsProxyL) {
    info(`Got env https_proxy: ${envHttpsProxyL}`);
    proxy = envHttpsProxyL;
  } else if (envHttpProxy) {
    info(`Got env HTTP_PROXY: ${envHttpProxy}`);
    proxy = envHttpProxy;
  } else if (envHttpProxyL) {
    info(`Got env http_proxy: ${envHttpProxyL}`);
    proxy = envHttpProxyL;
  }

  if (!proxy) return;

  // Start with http or https
  if (proxy.startsWith('http')) {
    return new HttpsProxyAgent(proxy);
  }

  warn(`Unsupported proxy ${proxy}, you may experience failure.`);
};
