import {test} from 'zora';
import {execSync} from 'child_process';
import getAgent from '../lib/get-https-proxy-agent.js';

function getAgentWith(mock) {
  for (let key in mock.npmrc) {
    execSync(`npm set ${key} ${mock.npmrc[key]}`);
  }
  for (let key in mock.env) {
    process.env[key] = mock.env[key];
  }
  try {
    return getAgent();
  } finally {
    for (let key in mock.npmrc) {
      execSync(`npm config delete ${key}`);
    }
    for (let key in mock.env) {
      delete process.env[key];
    }
  }
}

await test('getHttpsProxyAgent gets https-proxy from npmrc', async t => {
  const agent = getAgentWith({
    npmrc: { 'https-proxy' : 'https://domain1.com'},
    env: {}
  });
  t.is(agent.proxy.href, 'https://domain1.com/');
});

await test('getHttpsProxyAgent gets proxy from npmrc', async t => {
  const agent = getAgentWith({
    npmrc: { 'proxy' : 'https://domain2.com:80443'},
    env: {}
  });
  t.is(agent.proxy.href, 'https://domain2.com:80443/');
});

await test('getHttpsProxyAgent gets proxy from npmrc, but reject non-http proxy', async t => {
  const agent = getAgentWith({
    npmrc: { 'proxy' : 'what.ever.proxy'},
    env: {}
  });
  t.is(agent, undefined);
});

await test('getHttpsProxyAgent gets HTTPS_PROXY from env', async t => {
  const agent = getAgentWith({
    npmrc: {},
    env: {HTTPS_PROXY: 'https://domain3.com'}
  });
  t.is(agent.proxy.href, 'https://domain3.com/');
});

await test('getHttpsProxyAgent gets https_proxy from env', async t => {
  const agent = getAgentWith({
    npmrc: {},
    env: {https_proxy: 'https://domain4.com'}
  });
  t.is(agent.proxy.href, 'https://domain4.com/');
});

await test('getHttpsProxyAgent gets HTTP_PROXY from env', async t => {
  const agent = getAgentWith({
    npmrc: {},
    env: {HTTP_PROXY: 'http://domain5.com'}
  });
  t.is(agent.proxy.href, 'http://domain5.com/');
});

await test('getHttpsProxyAgent gets http_proxy from env', async t => {
  const agent = getAgentWith({
    npmrc: {},
    env: {http_proxy: 'http://domain6.com'}
  });
  t.is(agent.proxy.href, 'http://domain6.com/');
});

await test('getHttpsProxyAgent returns nothing if no proxy set', async t => {
  const agent = getAgentWith({
    npmrc: {},
    env: {}
  });
  t.is(agent, undefined);
});
