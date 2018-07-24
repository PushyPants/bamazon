# Bamazon.js
 ## General
 Bamazon is a CLI based node app that communicates with and updates MySQL db tables. The user will pick items from a menu, add them to their cart and either continue shopping, modify their cart or checkout. 

## Demo

 [Drive link to demo video](https://drive.google.com/file/d/1hjvdQvihZsyrmAGu8N_ZAffdfY5BUXz6/view)

 ![Demo Gif](./images/demo.gif)

## Notable Elements

 - **Error handling**
	 - If items are out of stock the user will be notified and returned to the main menu.
	 - If the user tries to purchase more than the quantity in stock they will be notified and promped to enter a new quantity.
	 - If the user tries to remove more than the quantity in the cart, they will be notified and prompted to enter a new quantity.
	 - general validation for empty or non number input in the Inquirer prompt.
 - **Database communication & updating**
	 - The products table is modified upon placing an item in the cart and when it is removed from the cart. 
		 - This is done so that in a multiple user environment, the quantity of products in the cart are guaranteed for that user and are not available for other users to purchase while the current user is making their decisions. 
 - **GUI Table & Cart**
	 - All calculations are done on the fly based on the shopping cart item array in order to keep a running tally without querying the db.
	 - Modifications to the cart change the item object in the cart array. 
		 - As items are updated (added or removed) by the customer the stock is modified in the db & the cart array is modified to reflect the new values. 