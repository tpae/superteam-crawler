const express = require('express');
const crawler = require('crawler');
const ypClient = require('../ypClient');
const c = new crawler({
  maxConnections : 1,
  rateLimit: 2000,
});

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const ypResponse = await ypClient(req.query.search, req.query.zip, req.query.radius, req.query.page);
    const ypData = ypResponse.data;
    const output = ypData.searchResult.searchListings.searchListing;
    const listings = [];
    const urls = output.map(listing => ({
      uri: listing.businessNameURL,
      callback: function (error, res, done) {
        if (error) {
          console.log(error);
        } else {
          const email = res.$('.email-business').attr('href')
            ? res.$('.email-business').attr('href').replace('mailto:', '')
            : null;
          listings.push({
            businessName: listing.businessName,
            category: listing.primaryCategory,
            phone: listing.phone,
            email,
            zip: listing.zip,
            info: listing.businessNameURL,
          });
        }
        done();
      }
    }));
    c.on('drain', function() {
      res.render('index', { listings });
    });
    c.queue(urls);
  } catch (e) {
    console.log(e);
    res.json({ error: 'Wait a while and try again.' });
  }
});

module.exports = router;
