import FilenameScanner from 'scanners/filename';
import { FLAGGED_FILE_EXTENSION_REGEX, FLAGGED_FILE_REGEX, HIDDEN_FILE_REGEX }
  from 'const';

describe('FilenameScanner', function() {

  it('should warn when finding a hidden file', () => {
    var filenameScanner = new FilenameScanner('', '__MACOSX/foo.txt');

    return filenameScanner.scan()
      .then((linterMessages) => {
        assert.equal(linterMessages.length, 1);
        assert.equal(linterMessages[0].code, 'HIDDEN_FILE');
        assert.equal(linterMessages[0].file, '__MACOSX/foo.txt');
      });
  });

  it('should warn when finding a flagged file', () => {
    var filenameScanner = new FilenameScanner('', 'Thumbs.db');

    return filenameScanner.scan()
      .then((linterMessages) => {
        assert.equal(linterMessages.length, 1);
        assert.equal(linterMessages[0].code, 'FLAGGED_FILE');
        assert.equal(linterMessages[0].file, 'Thumbs.db');
      });
  });

  it('should warn when finding a flagged file extension', () => {
    var filenameScanner = new FilenameScanner('', 'wat.exe');

    return filenameScanner.scan()
      .then((linterMessages) => {
        assert.equal(linterMessages.length, 1);
        assert.equal(linterMessages[0].code, 'FLAGGED_FILE_EXTENSION');
        assert.equal(linterMessages[0].file, 'wat.exe');
      });
  });

  it('should error out when it fails the regexes', () => {
    var filenameScanner = new FilenameScanner('', 'wat.txt');

    return filenameScanner.scan()
      .catch((err) => {
        assert.instanceOf(err, Error);
        assert.include(err.message, 'wat.txt');
      });
  });

});

describe('Hidden and Flagged File Regexes', function() {

  const matchingHiddenFiles = [
    '__MACOSX/foo.txt',
    '__MACOSX/.DS_Store',
  ];

  for (const filePath of matchingHiddenFiles) {
    it(`should match ${filePath} as a hidden file`, () => {
      assert.isOk(filePath.match(HIDDEN_FILE_REGEX),
        `${filePath} should match hidden file regex`);
    });
  }

  const nonMatchingHiddenFiles = [
    '__MACOSXfoo.txt',
    'foo/__MACOSX',
  ];

  for (const filePath of nonMatchingHiddenFiles) {
    it(`should not match ${filePath} as a hidden file`, () => {
      assert.isNotOk(filePath.match(HIDDEN_FILE_REGEX),
        `${filePath} should not match hidden file regex`);
    });
  }

  const matchingFlaggedFiles = [
    'foo/Thumbs.db',
    'foo/thumbs.db',
    'whatever/something.orig',
    'whatever/OLD.old',
    'whatever/.DS_STORE',
    'whatever/.DS_Store',
    'something~',
  ];

  for (const filePath of matchingFlaggedFiles) {
    it(`should match ${filePath} as a flagged file`, () => {
      assert.isOk(filePath.match(FLAGGED_FILE_REGEX),
        `${filePath} should match flagged file regex`);
    });
  }

  const nonMatchingFlaggedFiles = [
    'something/fooorig',
    'something/old',
    'foo/DS_Store',
    'Thumbs.db/foo',
    'whatever.orig/something',
    'whatever.old/something',
  ];

  for (const filePath of nonMatchingFlaggedFiles) {
    it(`should not match ${filePath} as a flagged file`, () => {
      assert.isNotOk(filePath.match(FLAGGED_FILE_REGEX),
        `${filePath} should not match flagged file regex`);
    });
  }

  const matchingFlaggedFileExtensions = [
    'something.exe',
    'foo/something.else.dll',
    'something.dylib',
    'something.so',
    'something.sh',
    'something.class',
    'something.swf',
  ];

  for (const filePath of matchingFlaggedFileExtensions) {
    it(`should match ${filePath} as a flagged file extensions`, () => {
      assert.isOk(filePath.match(FLAGGED_FILE_EXTENSION_REGEX),
        `${filePath} should not match flagged file extension regex`);
    });
  }

  const nonMatchingFlaggedFileExtensions = [
    'wat.exe/something',
    'wat_exe',
  ];

  for (const filePath of nonMatchingFlaggedFileExtensions) {
    it(`should not match ${filePath} as a flagged file extension`, () => {
      assert.isNotOk(filePath.match(FLAGGED_FILE_EXTENSION_REGEX),
        `${filePath} should not match flagged file extension regex`);
    });
  }
});
