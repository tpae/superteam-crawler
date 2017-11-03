const fakeUa = require('fake-useragent');
const querystring = require('querystring');
const axios = require('axios');
const YP_URL = 'http://pubapi.yp.com/search-api/search/devapi/search';
const YP_API_KEY = 'b5qdfp8hhv';

module.exports = (term, zip, radius, page = 1) => {
  const parameters = {
    searchloc: zip,
    term,
    format: 'json',
    radius,
    listingcount: 10,
    sort: 'name',
    key: YP_API_KEY,
    pagenum: page,
    shorturl: true,
  }
  const headers = {
    'User-Agent': fakeUa()
  };
  return axios.get(`${YP_URL}?${querystring.stringify(parameters)}`, { headers })
}
