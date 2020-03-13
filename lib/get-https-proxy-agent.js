// Only support https proxy right now
const config = require('libnpmconfig');
const HttpsProxyAgent = require('https-proxy-agent');
const {info, warn} = require('./log');

module.exports = function ({
  _npmrc,
  _env = process.env
} = {}) {
  if (!_npmrc) _npmrc = config.read().toJSON();
  const rcHttpsProxy = _npmrc['https-proxy'];
  const rcProxy = _npmrc['proxy'];
  const envHttpsProxy = _env.HTTPS_PROXY;
  const envHttpsProxyL = _env.https_proxy;
  const envHttpProxy = _env.HTTP_PROXY;
  const envHttpProxyL = _env.http_proxy;

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

  warn('Unsupported (not a http(s) proxy), you may experience failure.');
};
