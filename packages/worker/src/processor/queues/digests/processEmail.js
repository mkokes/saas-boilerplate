const processJob = async job => {
  console.log('job processed!');
};

const init = async job => {
  try {
    await processJob(job);
  } catch (err) {
    console.log('❌ Error in job:\n');
    console.error(err);
    // Raven.captureException(err);
  }
};

module.exports = init;
