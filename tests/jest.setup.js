const util = require('util');
const childProcess = require('child_process');

const { nanoid } = require('nanoid');

const exec = util.promisify(childProcess.exec);

module.exports = async () => {
  // console.log(`\n[jest] waiting for server's health check...`);
  // let isUp = false;
  // while (isUp === false) {
  //   await new Promise((r) => setTimeout(r, 250));
  //   isUp = await statusCheck();
  // }
  // console.log(`[jest] server is up...`);
  const testDatabaseName = 'GitTest_test';
  const testSchema = `test_${nanoid().toLowerCase()}`;
  const testDatabaseUrl = new URL(process.env.DATABASE_URL);
  testDatabaseUrl.pathname = `/${testDatabaseName}`;
  testDatabaseUrl.searchParams.set('schema', testSchema);

  global.schema = testSchema;
  global.databaseUrl = testDatabaseUrl;

  process.env.DATABASE_URL = global.databaseUrl;
  global.process.env.DATABASE_URL = global.databaseUrl;

  // Run the migrations to ensure our schema has the required structure
  await exec(`yarn prisma migrate deploy`);
};
