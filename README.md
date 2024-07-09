# Dev-Bookstore

A complete e-commerce app built on the MERN stack that sells developer books.

This project is cloned from an existing project which exists in this repository:
- https://github.com/Anantm007/Dev-Bookstore/tree/master

## New Features
- Users will get recommendations while searching a book.
- Users can open pdf of a book if available.
- Minimal changes to UI to make it presentable.

## Project Setup

```javascript
1. Clone the repo in your desired directory in your system using this command 'git clone https://github.com/saadbutt27/Dev-Bookstore.git'
2. Open the cmd from that directory and write 'cd Dev-Bookstore' 
3. Run 'npm install'
4. make a .env file with the following credentials: DATABASE, JWT_SECRET, BRAINTREE_MERCHANT_ID, BRAINTREE_PUBLIC_KEY, BRAINTREE_PRIVATE_KEY, EMAILID, EMAILPASSWORD, NAME
5. cd client
6. npm install
7. cd ..
8. Open a new terminal and Run 'cd recommendation-service'
9. Run 'pip install -r requirements.txt'
10. Run 'python app.py'
11. Go back to first terminal
12. Run 'npm run dev'
13. The project will automatically open, you can use this url to open the project 127.0.0.1:3010
```

## Existing Features

- User signup/signin with welcome email
- Create Category and Product by Admin
- CRUD operations on products
- Payment gateway (Braintree and Paypal)
- View Product and Add to cart for a user
- Update Profile for user
- Checkout using credit card and paypal (using Braintree as the payment gateway)
- Advanced search filters based on category and price range
- Books also categorized upon arrival date and bestsellers
- Order confirmation through email
- The admin can change the order status

## Technology Stack

##### MERN stack

- MongoDB
- Express.js
- React.js
- Node.js

### Resources:

1. https://www.udemy.com/course/react-node-ecommerce/
2. https://developers.braintreepayments.com/
