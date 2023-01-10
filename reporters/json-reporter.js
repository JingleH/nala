const fs = require('fs/promises');
const BaseReporter = require('./base-reporter.js');

const JSON_PATH = './persisted-results.json';

class JSONReporter extends BaseReporter {
  constructor() {
    super({ persist: { type: 'json-reporter', path: JSON_PATH } });
  }

  async persistData() {
    const branch = process.env.GITHUB_REF_NAME ?? 'local-branch';
    const repo = process.env.GITHUB_REPOSITORY ?? `local-${process.env.npm_package_name || 'machine'}`;
    const currTime = new Date();
    await fs.writeFile(
      JSON_PATH,
      JSON.stringify({
        branch,
        repo,
        results: this.results,
        timestamp: currTime,
      }),
    );
  }
}

module.exports = JSONReporter;
