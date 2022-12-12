## Homework Review

### Task 1

#### Assumptions
- User can have more than one existing loan.

- Only logged in / authenticated users can make custom repayments

- User is shown a list of all existing loans and has the option to select

- Custom payments requests are sent when the user presses a “Pay” button 

- User can input a custom integer amount to pay towards the loan.

- There is a minimum amount that the user must contribute (e.g $10 minimum / custom repayment).

- The user cannot contribute more than the total amount owed.


### Task 2

#### Prerequisites / Libraries used
- supertest
- chai
- express (experimental)

#### Issues
- Couldn't find a proper way to extract the eligibility criteria through the API call itself,
manually extracted in the javascript code.
- Some minor syntax and import errors when integrating libraries such as supertest and chai