const fs = require('fs/promises');
const BaseReporter = require('./base-reporter.js');

const JSON_PATH = './persisted-results.json';

class JSONReporter extends BaseReporter {
  constructor() {
    super({ persist: { type: 'json-reporter', path: JSON_PATH } });
  }

  async persistData() {
    await fs.writeFile(JSON_PATH, JSON.stringify(this.results));
  }
}

module.exports = JSONReporter;
