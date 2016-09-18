# Fake-EKM-API
A server which can be used in local development to simulate the EKM API.

## Requirements

- Node.js
- npm (comes with Node.js)
- postgres
- nodemon
- database with ekm_readings
- internet connection (for initial npm install)

## Run Locally

### Setup

1. Clone repo to local machine and `cd Fake-EKM-API`
1. `npm install`
1. Add `config.js` file in root directory with following contents, adding your own database-specific login credentials:

```javascript
module.exports = exports = {
  'username': db user name,
  'password': db password,
  'database': db name,
  'host': '127.0.0.1',
  'dialect': 'postgres',
  'port': 5432,
  'logging': false
};
```
1. Adjust `Plug.js` in `models/` to match your own model, whatever will provide the system's current EKM readings.
1. Instead of your project pointing at `io.ekmpush...`, point it at [localhost:3000/readMeter/v4/key/<key>/count/1/format/json](localhost:3000/readMeter/v4/key/1234/count/1/format/json)

### Run

`npm start`

This command starts the server in development mode and does automatic refreshing on changes using nodemon.