const test = require('ava');
const getAgent = require('../lib/get-https-proxy-agent');

test.serial('getHttpsProxyAgent gets https-proxy from npmrc', async t => {

  const agent = getAgent({
    _npmrc: { 'https-proxy' : 'https://domain1.com'},
    _env: {}
  });
  t.is(agent.proxy.href, 'https://domain1.com/');
});

test.serial('getHttpsProxyAgent gets proxy from npmrc', async t => {
  const agent = getAgent({
    _npmrc: { 'proxy' : 'https://domain2.com:80443'},
    _env: {}
  });
  t.is(agent.proxy.href, 'https://domain2.com:80443/');
});

test.serial('getHttpsProxyAgent gets HTTPS_PROXY from env', async t => {
  const agent = getAgent({
    _npmrc: {},
    _env: {HTTPS_PROXY: 'https://domain3.com'}
  });
  t.is(agent.proxy.href, 'https://domain3.com/');
});

test.serial('getHttpsProxyAgent gets https_proxy from env', async t => {
  const agent = getAgent({
    _npmrc: {},
    _env: {https_proxy: 'https://domain4.com'}
  });
  t.is(agent.proxy.href, 'https://domain4.com/');
});

test.serial('getHttpsProxyAgent gets HTTP_PROXY from env', async t => {
  const agent = getAgent({
    _npmrc: {},
    _env: {HTTP_PROXY: 'http://domain5.com'}
  });
  t.is(agent.proxy.href, 'http://domain5.com/');
});

test.serial('getHttpsProxyAgent gets http_proxy from env', async t => {
  const agent = getAgent({
    _npmrc: {},
    _env: {HTTP_PROXY: 'http://domain6.com'}
  });
  t.is(agent.proxy.href, 'http://domain6.com/');
});

test.serial('getHttpsProxyAgent returns nothing if no proxy set', async t => {
  const agent = getAgent({
    _npmrc: {},
    _env: {}
  });
  t.is(agent, undefined);
});