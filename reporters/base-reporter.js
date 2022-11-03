const { extractTags } = require('../utils/extract-test-title.js');

function generateTestRunID() {
  // maybe use uuid or mongodb ObjectId?
  return (
    Math.floor(new Date().getTime() / 1000).toString(16) +
    'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
      Math.floor(Math.random() * 16)
        .toString(16)
        .toLowerCase(),
    )
  );
}

class BaseReporter {
  constructor(options) {
    this.options = options;
    this.results = [];
    this.testRunId = generateTestRunID();
  }

  onBegin(config, suite) {
    this.config = config;
    this.rootSuite = suite;
  }

  async onTestEnd(test, result) {
    const { name, env, tag, url, branch } = extractTags(test.title);
    const { parent, stdout, stderr, title, location, retries } = test;
    const {
      status,
      duration,
      error: {
        message: errorMessage,
        value: errorValue,
        stack: errorStack,
      } = {},
      retry,
    } = result;
    if (retry < retries && status === 'failed') {
      return;
    }
    this.results.push({
      testId: this.testRunId,
      title,
      branch,
      name,
      tag,
      env,
      url,
      browser: test._projectId,
      status,
      errorMessage,
      errorValue,
      errorStack,
      stdout,
      stderr,
      duration,
      retry,
    });
  }

  async onEnd() {
    this.printPersistingOption();
    await this.persistData();
    console.log('Test run is finished');
  }

  // eslint-disable-next-line class-methods-use-this, no-empty-function
  async persistData() {}

  printPersistingOption() {
    if (this.options?.persist) {
      console.log(
        `Persisting results using ${this.options.persist?.type} to ${this.options.persist?.path}`,
      );
    } else {
      console.log('Not persisting data');
    }
  }
}

module.exports = BaseReporter;
