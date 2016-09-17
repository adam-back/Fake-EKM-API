/*
  We need a way to simulate medium- to long-term charge events and broken
  periods. As requests come in, the API key will act as a the key for this
  cache.
*/

module.exports = exports = {
  /*
    apiKey: {
      '123': {
        status: 'charging',
        error: null,
        until: moment object,
        kwh: 12
      },
      '456': {
        status: 'error',
        error: 'Old Read',
        until: moment object,
        kwh: 15
      },
      '789': {
        status: 'idle',
        error: null,
        until: null,
        kwh: 50
      }
    }
  */
};