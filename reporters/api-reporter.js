const axios = require('axios');
const BaseReporter = require('./base-reporter.js');

const baseUrl = 'https://webplatform.stage.corp.adobe.com/api/nala-results';

// FIXME: use GitHub Actions Environment variables
const repo = 'milo';
const branch = 'main';

async function postToAPI(data) {
  return axios.post(`${baseUrl}/${repo}/${branch}`, data);
}

class APIReporter extends BaseReporter {
  constructor() {
    super({ persist: { type: 'api-reporter', path: baseUrl } });
  }

  async persistData() {
    // specify who initiated the test runs / this run is against which repo
    const results = this.results.map(({ ...fields }) => ({
      repo: 'milo',
      ...fields,
    }));
    try {
      const { status, data } = await postToAPI(results);
      if (status !== 201) {
        throw new Error('Status not 201!');
      }
      console.log(`${data.insertedCount} were successfully persisted!`);
    } catch (err) {
      console.error('failed to post!');
      console.error(err);
    }
  }
}

module.exports = APIReporter;
