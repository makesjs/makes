import {test} from 'zora';
import { default as tmpdir, cleanup } from '../lib/tmp-dir.js';
import mockfs from 'mock-fs';
import os from 'os';
import fs from 'fs';
import path from 'path';

const systemTmpDir = os.tmpdir();

await test('tmpDir creates dir and cleanup', t => {
  mockfs({
    [systemTmpDir]: {}
  });

  const dir = tmpdir();

  t.ok(fs.existsSync(dir));
  const stat = fs.statSync(dir);
  t.ok(stat.isDirectory());

  const fp = path.join(dir, 'foo');
  fs.writeFileSync(fp, 'a');
  t.ok(fs.existsSync(fp));

  cleanup();
  t.notOk(fs.existsSync(dir));
  t.notOk(fs.existsSync(fp));

  mockfs.restore();
});
