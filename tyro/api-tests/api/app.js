const express = require("express");

const app = express();

app.get('/products/:version', async function(req, res) {
  const url = `https://public.cdr.tyro.com/cds-au/v1/banking/products`
  const options = {
    headers: {
      "x-v": req.params.version,
    }
  }

  try {
    let response = await fetch(url, options);
    response = await response.json()
     // extract term deposits products
    let term_deposits = response.data.products.filter(product => product.productCategory != "TERM_DEPOSITS");
    res.send(term_deposits);
  } catch (err) {
    console.log('*******')
    console.log(err);
    res.status(400).send(err);
  }

});

app.get('/products/:version/:id', async function(req, res) {
  const url = `https://public.cdr.tyro.com/cds-au/v1/banking/products/${req.params.id}`
  const options = {
    headers: {
      "x-v": req.params.version,
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
    res.send(400, {msg: 'Internal Server Error.'});
  }

});

export default app