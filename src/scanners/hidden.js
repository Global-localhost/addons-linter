import BaseScanner from 'scanners/base';
import * as messages from 'messages';
import * as constants from 'const';


export default class HiddenScanner extends BaseScanner {
  scan() {
    return new Promise((resolve) => {
      // Add a warning if it matches a hidden file.
      if (this.filename.match(constants.HIDDEN_FILE_REGEX)) {
        this.linterMessages.push(
          Object.assign({}, messages.HIDDEN_FILE, {
            type: constants.VALIDATION_WARNING,
            file: this.filename,
          })
        );
      // Not hidden files are flagged slightly differently.
      } else if (this.filename.match(constants.FLAGGED_FILE_REGEX)) {
        this.linterMessages.push(
          Object.assign({}, messages.FLAGGED_FILE, {
            type: constants.VALIDATION_WARNING,
            file: this.filename,
          })
        );
      } else {
        throw new Error(`Filename didn't match a regex: ${this.filename}.`);
      }
      return resolve(this.linterMessages);
    });
  }
}
