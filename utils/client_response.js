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

statusCodes = {
  '200': 'Success',
  '201': 'Created',
  '204': 'No Content',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '403': 'Forbidden',
  '404': 'Not Found',
  '500': 'Internal Server Error'
};

statusMessages = {
  '200': 'Request succeeded.',
  '201': 'Resource successfully created.',
  '204': 'There is nothing to return.',
  '400': 'Request failed, please try again.',
  '401': 'Please check credentials and try again.',
  '403': 'Cannot access resource.',
  '404': 'Nothing to see here ¯\_(ツ)_/¯.',
  '500': 'Something has gone wrong. Please try again.'
};

module.exports = {clientResponse};