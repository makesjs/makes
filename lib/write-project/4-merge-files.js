const {Transform} = require('stream');

module.exports = function() {
  const groups = {};
  return new Transform({
    objectMode: true,
    transform: (file, env, cb) => {
      if (file.isBuffer()) {
        if (groups[file.relative]) {
          groups[file.relative].push(file);
        } else {
          groups[file.relative] = [file];
        }
        cb();
      } else {
        cb(null, file);
      }
    },
    flush: function(cb) {
      Object.keys(groups).forEach(relative => {
        const files = groups[relative];

        let file;
        if (files.length > 1) {
          file = files.reduce(merge);
        } else {
          file = files[0];
          if (file.extname === '.json') {
            // clean up json file
            const json = fromJson(file.contents.toString('utf8'));
            file.contents = Buffer.from(JSON.stringify(json, null, 2));
          }
        }
        this.push(file);
      });
      cb();
    }
  });
};

function merge(file, nextFile) {
  let merged;
  // merge json files.
  if (file.extname === '.json') {
    const json = fromJson(file.contents.toString('utf8'));
    const json2 = fromJson(nextFile.contents.toString('utf8'));
    const result = mergeJsObj(json, json2);
    file.contents = Buffer.from(JSON.stringify(result, null, 2));
    merged =  file;
  // append readme files
  } else if (isReadmeFile(file)) {
    file.contents = Buffer.concat([file.contents, Buffer.from('\n'), nextFile.contents]);
    merged =  file;
  } else {
    // for everything else, just use nextFile to overwrite previous file
    merged = nextFile;
  }

  // allow overwrite writePolicy
  merged.writePolicy = nextFile.writePolicy || file.writePolicy;
  return merged;
}

function fromJson(str) {
  // Use eval instead of JSON.parse, in order to tolerant malformed json.
  // For example, an extra ',' comma due to our preprocess.
  // eslint-disable-next-line no-new-func
  return (new Function(`const json = ${str.trim()}; return json;`))();
}

function mergeJsObj(obj, src) {
  const result = mergeArray(obj, src);
  if (result !== undefined) return result;

  if (obj === undefined) return src;
  if (src === undefined) return obj;

  if (typeof obj === 'object' && typeof src === 'object' &&
      !Array.isArray(obj) && !Array.isArray(src)) {
    const keys = new Set(Object.keys(obj));
    Object.keys(src).forEach(k => keys.add(k));
    const result = {};
    keys.forEach(k => {
      result[k] = mergeJsObj(obj[k], src[k]);
    });
    return result;
  } else {
    return src;
  }
}

function mergeArray(objValue, srcValue) {
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    const result = [...objValue];
    srcValue.forEach(v => {
      if (result.indexOf(v) === -1) {
        result.push(v);
      }
    });
    return result;
  }
}

function isReadmeFile(file) {
  return file.basename.match(/readme(\.(md|txt|markdown))?$/i);
}
