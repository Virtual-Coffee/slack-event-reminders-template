// this file does absolutely nothing except return a 200 response to any request. Required for Slack Link buttons to work.

const handler = async function (event, context) {
  return {
    statusCode: 200,
    body: '',
  };
};

module.exports = { handler };
