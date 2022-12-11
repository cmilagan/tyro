const request = require("supertest");
const express = require("express");

import { assert, expect } from 'chai';


const app = express();

app.get('/products', async function(req, res) {
  const url = `https://public.cdr.tyro.com/cds-au/v1/banking/products`
  const options = {
    headers: {
      "x-v": 3,
    }
  }

  try {
    let response = await fetch(url, options);
    response = await response.json()
     // extract term deposits products
    let term_deposits = response.data.products.filter(product => product.productCategory != "TERM_DEPOSITS");
    res.send(term_deposits);
  } catch (err) {
    console.log(err);
    res.send({msg: 'Internal Server Error.'});
  }

});

app.get('/products/:id', async function(req, res) {
  const url = `https://public.cdr.tyro.com/cds-au/v1/banking/products/${req.params.id}`
  const options = {
    headers: {
      "x-v": 3,
    }
  }

  try {
    let response = await fetch(url, options);
    response = await response.json()
    // extract eligibility criteria
    delete response.data.eligibility;
    res.send(response.data);
  } catch (err) {
    console.log(err);
    res.send({msg: 'Internal Server Error.'});
  }

});


app.listen(5000, () => {console.log("Server started on port localhost:5000")});
// https://public.cdr.tyro.com/cds-au/v1/banking/

describe ('Products', () => {
  it('GET /products', (done) => {
    request(app)
      .get('/products')
      .end((err, res) => {
        let data = res.body
        expect(data).to.not.be.empty; // check that data is not empty
        
        // check that term deposit products have been extracted
        const numTermDeposits = data.filter(item => item.productCategory == "TERM_DEPOSITS").length
        assert(numTermDeposits == 0, "Term deposit products were not extracted");

        // check that business loan products are in the data
        const businessLoanProducts = data.filter(item => item.productCategory == "BUSINESS_LOANS")
        assert(businessLoanProducts.length != 0, "Business loan products should be visible/available");

        // get business product details
        request(app)
          .get(`/products/${businessLoanProducts[0].productId}`)
          .end((err, res) => {
            let productInfo = res.body
            assert(productInfo.hasOwnProperty("eligibility") == false, "Eligibility criteria should be extracted");
          })
        done();
      })
  })
})