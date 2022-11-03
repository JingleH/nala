const axios = require('axios');
const BaseReporter = require('./base-reporter.js');

const SHAREPOINT_PATH = 'https://main--milo--adobecom.hlx.page/';

class JSONReporter extends BaseReporter {
  constructor() {
    super({ persist: { type: 'sharepoint-reporter', path: SHAREPOINT_PATH } });
    this.axios = axios.create({
      baseURL: SHAREPOINT_PATH,
      timeout: 5000,
    });
  }

  async persistData() {
    // escape for excel
    const outputs = this.results.map((result) =>
      Object.keys(result).reduce((acc, key) => {
        if (result[key] === undefined) {
          return acc;
        }
        return { ...acc, [key]: `'${result[key]}` };
      }, {}),
    );

    // post a big json?
    const postReqs = outputs
    // FIXME: temporarily only reporting the first few to not stress the service
      // .slice(0, 4)
      .map((o) => this.axios.post('/test/nala-results', { data: o }));
    const res = await Promise.allSettled(postReqs);
    let failedCnt = 0;
    res.forEach((r, index) => {
      if (r.status !== 'fulfilled') {
        console.error(
          `Failed to post (${r.reason}) for ${JSON.stringify(outputs[index])}.`,
        );
        failedCnt += 1;
      }
    });
    if (failedCnt === 0) {
      console.log(`All ${res.length} successfully posted`);
    } else {
      console.log(
        `${res.length - failedCnt} successfully posted, ${failedCnt} failed`,
      );
    }
  }
}

module.exports = JSONReporter;
