function clientResponse(res, code, messages, data) {
  let payload = {
    status: statusCodes[String(code)],
    messages: messages || [statusMessages[String(code)]]
  };

  if (data) {
    payload.data = data;
  }

  return res.status(code).json(payload);
}

let statusCodes = {
  '200': 'Success',
  '201': 'Created',
  '202': 'Accepted',
  '204': 'No Content',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '403': 'Forbidden',
  '404': 'Not Found',
  '500': 'Internal Server Error'
};

let statusMessages = {
  '200': 'Request succeeded.',
  '201': 'Resource successfully created.',
  '202': 'The request is being processed and may take some time.',
  '204': 'There is nothing to return.',
  '400': 'Request failed, please try again.',
  '401': 'Please check credentials and try again.',
  '403': 'Cannot access resource.',
  '404': 'Nothing to see here ¯\_(ツ)_/¯.', // eslint-disable-line no-useless-escape
  '500': 'Something has gone wrong. Please try again.'
};

module.exports = {clientResponse};