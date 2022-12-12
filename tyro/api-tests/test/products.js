import supertest from 'supertest';
const async = require("async");

import { assert, expect } from 'chai';

const request = supertest('https://public.cdr.tyro.com/cds-au/v1/banking/');

const extractedTermDeposit = [
  "BUSINESS_LOANS",
  "CRED_AND_CHRG_CARDS",
  "LEASES",
  "MARGIN_LOANS",
  "OVERDRAFTS",
  "PERS_LOANS",
  "REGULATED_TRUST_ACCOUNTS",
  "RESIDENTIAL_MORTGAGES",
  "TRADE_FINANCE",
  "TRANS_AND_SAVINGS_ACCOUNTS",
  "TRAVEL_CARDS"
]


describe ('Products', () => {
  it('GET valid /products /product/businessloan assert data', (done) => {
    request
      .get('products')
      .query({
        "product-category": extractedTermDeposit,
      })
      .set('x-v', 3)
      .end((err, res) => {
        expect(res.status).to.eq(200); // check correct status
        let data = res.body.data
        expect(data).to.not.be.empty; // check that data is not empty
        
        // check that term deposit products have been extracted
        const numTermDeposits = data.products.filter(item => item.productCategory == "TERM_DEPOSITS").length
        assert(numTermDeposits == 0, "Term deposit products were not extracted");

        // check that business loan products are in the data
        const businessLoanProducts = data.products.filter(item => item.productCategory == "BUSINESS_LOANS")
        assert(businessLoanProducts.length != 0, "Business loan products should be visible/available");

        // get business product details
        request
          .get(`products/${businessLoanProducts[0].productId}/`)
          .set('x-v', 3)
          .end((err, res) => {
            let productInfo = res.body.data
            expect(productInfo).to.not.be.empty; // check that data is not empty
            delete productInfo.eligibility
            assert(productInfo.hasOwnProperty("eligibility") === false, "Eligibility criteria should be extracted");
            done();
          })
      })
  })
  it('Testing invalid API Requests', function(done) {
    async.series([
      function (cb) { request.get('products/').set('x-v', null).expect(400, cb) },
      function (cb) { request.get('products/').set('x-v', 1).set('x-min-v', null).expect(400, cb) },
      function (cb) { request.get('products/').set('x-v', 1).set('x-min-v', null).query({ "product-category": "TERM_DEPOSIT" }).expect(400, cb) },
      function (cb) { request.get('products/').set('x-v', 1).query({ "product-category": "!TERM_DEPOSIT" }).expect(400, cb) },
      function (cb) { request.get('products/').set('x-v', 1).query({ "product-category": "INCORRECT" }).expect(400, cb) },
      function (cb) { 
        request
          .get('products')
          .query({ "product-category": extractedTermDeposit })
          .set('x-v', 3)
          .end((err, res) => {
            expect(res.status).to.eq(200); // check correct status
            let data = res.body.data
            expect(data).to.not.be.empty; // check that data is not empty

            // check that business loan products are in the data
            const businessLoanProducts = data.products.filter(item => item.productCategory == "BUSINESS_LOANS")
            assert(businessLoanProducts.length != 0, "Business loan products should be visible/available");

            request
              .get(`products/${businessLoanProducts[0].productId}/`)
              .set('x-v', 2)
              .set('x-min-v', null)
              .expect(400, cb)
          })
      },
      function (cb) { 
        request
          .get('products')
          .query({ "product-category": extractedTermDeposit })
          .set('x-v', 3)
          .end((err, res) => {
            expect(res.status).to.eq(200); // check correct status
            let data = res.body.data
            expect(data).to.not.be.empty; // check that data is not empty

            // check that business loan products are in the data
            const businessLoanProducts = data.products.filter(item => item.productCategory == "BUSINESS_LOANS")
            assert(businessLoanProducts.length != 0, "Business loan products should be visible/available");

            request
              .get(`products/${businessLoanProducts[0].productId}/`)
              .set('x-v', null)
              .expect(400, cb)
          })
      },
    ], done);
  });
});