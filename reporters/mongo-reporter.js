const mongodb = require('mongodb');

const BaseReporter = require('./base-reporter.js');

const mongoServer =
  'grape-a.corp.adobe.com:27021,grape-b.corp.adobe.com:27021,grape-c.corp.adobe.com:27021';

const database = 'WEBAUTODB';
const RESULTS_COLLECTION = 'nala_results';
const TEST_RUNS_COLLECTION = 'nala_test_runs';

async function writeToDB(data, creds, db, coll) {
  const url = `mongodb://${creds}@${mongoServer}/?authSource=${database}&replicaSet=or_grape_prd_27021&readPreference=primary&ssl=false`;

  const mongoClient = new mongodb.MongoClient(url);

  await mongoClient.connect();

  try {
    const result = await mongoClient
      .db(db)
      .collection(coll)
      .insertMany(Array.isArray(data) ? data : [data]);
    console.log(`written into DB ${result.insertedCount} docs!`);
  } catch (err) {
    console.log('err in inserting DB:');
    console.log(err);
  }

  await mongoClient.close();
}

class MongoReporter extends BaseReporter {
  constructor() {
    super({ persist: { type: 'mongo-reporter', path: `${mongoServer}/` } });
  }

  async persistData() {
    // specify who initiated the test runs / this run is against which repo
    const results = this.results.map(({ ...fields }) => ({
      repo: 'milo',
      ...fields,
    }));
    console.log(this.testRunId);

    await writeToDB(
      { testRunId: this.testRunId, repo: 'milo', branch: 'main' },
      process.env.MONGODBCREDENTIALS,
      database,
      TEST_RUNS_COLLECTION,
    );
    console.log(`done writing into ${TEST_RUNS_COLLECTION}`);
    await writeToDB(
      results,
      process.env.MONGODBCREDENTIALS,
      database,
      RESULTS_COLLECTION,
    );
    console.log(`done writing into ${RESULTS_COLLECTION}`);
  }
}

module.exports = MongoReporter;
