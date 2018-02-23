function clientResponse(res, code, messages) {
  return res.status(code).json({
    status: statusCodes[String(code)],
    messages: messages || [statusMessages[String(code)]]
  });
}

statusCodes = {
  '200': 'Success',
  '201': 'Created',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '403': 'Forbidden',
  '500': 'Internal Server Error'
};

statusMessages = {
  '200': 'Request succeeded.',
  '201': 'Resource successfully created.',
  '400': 'Request failed, please try again.',
  '401': 'Please check credentials and try again.',
  '403': 'Cannot access resource.',
  '500': 'Something has gone wrong. Please try again.'
};

module.exports = {
  clientResponse: clientResponse
};