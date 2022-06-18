const FILE_WITH_WRITE_POLICY = /__(skip|append|ask)-if-exists/;

export default function(file) {
  const match = file.basename.match(FILE_WITH_WRITE_POLICY);
  if (match) {
    const policyStr = match[0];
    const policy = match[1];
    // Only remove the policy token __skip-if-exists
    const cleanBasename = file.basename.slice(0, match.index) +
      file.basename.slice(match.index + policyStr.length);
    // some-file.ext__skip-if-exists             => some-file.ext
    // some-file.ext__if_feature__skip-if-exists => some-file.ext__if_feature
    // some-file.ext__skip-if-exists__if_feature => some-file.ext__if_feature
    file.basename = cleanBasename;
    file.writePolicy = policy; // skip, append, or ask
    // If there is no writePolicy on the vinyl file, default behaviour is
    // to overwrite existing file.
  }

  return file;
}
