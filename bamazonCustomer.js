let mysql = require('mysql');
let inquirer = require('inquirer');
let Table = require('cli-table');
let clear = require('clear');
let fs = require('fs');
//let tableChars = require('./table.js')

let cart = [];


let connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon',
});

connection.connect(function (err) {
    if (err) throw err;
});

displayLogo();

function displayLogo() { // grab ascii text from logo.txt file and print it in console
    fs.readFile('logo.txt', 'utf8', function (err, data) {
        console.log(data);
    })
}

function navItems() {
    clear();
    let itemArr = [];

    connection.query(`
    SELECT product_name, price, stock_quantity, item_id
    FROM products`, function (err, res) {
        if (err) throw err;
        res.forEach((value, index) => {
            itemArr.push(`${value.item_id}. ${value.product_name} - price: $${value.price} (${value.stock_quantity} in stock)`);
        })

        inquirer.prompt([{
            type: 'list',
            name: 'item_list',
            message: 'Please choose and item',
            choices: itemArr
        }]).then(function (response) {
            let itemId = response.item_list.split('.', 1).join('');
            let itemName = res[itemId - 1].product_name;
            let itemPrice = res[itemId - 1].price;
            let currentStock = res[itemId - 1].stock_quantity;

            if (currentStock <= 0) {
                console.log(`\n*************************************************************`)
                console.log(`** Currently out of stock. Please select a different item. **`)
                console.log(`*************************************************************\n`)
                setTimeout(() => {
                    navItems()
                }, 1000);

            } else {
                quantityPrompt(itemId, itemName, currentStock, itemPrice);
            }
        })
    });
}

navItems();

function quantityPrompt(itemId, itemName, currentStock, itemPrice) {
    inquirer.prompt([{
        type: 'input',
        name: 'purchase_quantity',
        message: 'How many would you like to purchase?',
        validate: function (value) {
            if (isNaN(value) === false && value > 0) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function (result) {
        if (result.purchase_quantity > currentStock) {

            console.log(`\n*********************************************************`)
            console.log(`** There is not enough in stock to fulfill your order. **`)
            console.log(`**          Please choose a different amount           **`)
            console.log(`*********************************************************\n`)
            setTimeout(() => {
                quantityPrompt(itemId, itemName, currentStock, itemPrice);
            }, 1000);

        } else {
            updateStock(itemId, itemName, currentStock, itemPrice, result.purchase_quantity)
        };
    })
}

function updateStock(itemId, itemName, stock, price, quantity) {
    let newStock = stock - quantity;
    let itemCost = price;
    console.log('\n\nTotal cost is: $', itemCost * quantity)

    inquirer.prompt([{
        type: 'confirm',
        name: 'add_cart',
        message: 'Would you like to add this to your cart?'
    }]).then(function (result) {
        if (result.add_cart) {
            connection.query(`
            UPDATE products
            SET stock_quantity = ${newStock}
            WHERE item_id = ${itemId}
            `);

            addToCart(itemId, itemName, quantity, itemCost);

            inquirer.prompt([{
                type: 'confirm',
                name: 'view_cart',
                message: 'would you like to view your cart?'
            }]).then(function (result) {
                if (result.view_cart) {
                    viewCart();
                } else {
                    navItems();
                }
            })
        } else {
            navItems();
        }
    })
}

function addToCart(itemId, itemName, quantity, totalPrice) {


    let itemIndex = cart.findIndex(function (element) {
        return element.name === itemName;
    });

    if (itemIndex === -1) {
        cart.push({
            id: itemId,
            name: itemName,
            quantity: quantity,
            totalPrice: totalPrice
        })
    } else {
        cartQuant = parseInt(cart[itemIndex].quantity) + parseInt(quantity);
        cart[itemIndex].quantity = cartQuant;
    }
}

function viewCart() {
    clear();
    let cartTotal = 0;
    let combinedPrice;

    let cartTable = new Table({
        head: ['SHOPPING CART'],
        head: ['Item', 'Quantity in Cart', 'Total Price'],
        chars: {
            'top': '═',
            'top-mid': '╤',
            'top-left': '╔',
            'top-right': '╗',
            'bottom': '═',
            'bottom-mid': '╧',
            'bottom-left': '╚',
            'bottom-right': '╝',
            'left': '║',
            'left-mid': '╟',
            'mid': '─',
            'mid-mid': '┼',
            'right': '║',
            'right-mid': '╢',
            'middle': '│'
        }
    });

    cart.forEach(function (element, index) {
        if (element.quantity === 0) {
            cart.splice(index, 1)
        };
    });
    //I had these in the same forEach but it might have been moving too fast because the table would show up empty. I moved it out into multiple statements to fix it.
    cart.forEach(function (element, index) {
            cartTotal += element.totalPrice * element.quantity;
            cartTable.push([element.name, 'in cart: ' + element.quantity, 'total price: $' + (element.totalPrice * element.quantity)])
    })

    cartTable.push(['', 'CART TOTAL:', '$' + cartTotal])
    // console.log(`\n   ===================================================`)
    // console.log(`   ================   SHOPPING CART   ================`)
    console.log(`\n\nSHOPPING CART`)
    console.log(cartTable.toString() + '\n')

    inquirer.prompt([{
        type: 'list',
        name: 'continue',
        message: 'Would you like to continue checkout or continue shopping?',
        choices: ['Checkout', 'Continue shopping', 'Update Cart']
    }]).then(function (response) {

        switch (response.continue) {
            case 'Checkout':
                console.log(`\n**********************************************************************************************`)
                console.log(`** Thanks for shopping with Bamazon! Your fake purchase will be fake delivered to you soon! **`)
                console.log(`**********************************************************************************************\n`)

                connection.end();
                break;
            case 'Continue shopping':
                navItems();
                break;
            case 'Update Cart':
                updateCart();
                break;
        }
    })
}

function updateCart() {
    let currentStock;
    let editItem;
    inquirer.prompt([{
        type: 'list',
        name: 'cart_list',
        message: 'Please choose and item you would like to edit.',
        choices: cart
    }]).then(function (response) {
        editItem = response.cart_list;
        connection.query(`SELECT * FROM products WHERE product_name = '${editItem}'`, function (err, res) {
            if (err) throw err;
            currentStock = res[0].stock_quantity;
        })
        inquirer.prompt([{
            type: 'list',
            name: 'add_delete',
            message: 'Would you like to add or remove quantity of this item?',
            choices: ['add', 'remove']
        }]).then(function (result) {
            result.add_delete === 'add' ? alterQuantity('add', currentStock, editItem) : alterQuantity('subtract', currentStock, editItem);
        })
    });
}

function alterQuantity(operation, currentStock, item) {
    let newStock;
    let itemIndex;
    let cartQuant;
    inquirer.prompt([{
        type: 'input',
        name: 'alter_quant',
        message: () => {
            if (operation === 'add') {
                return 'How many would you like to add to your cart?'
            } else {
                return 'How many would you like to remove from your cart?'
            }
        }
    }]).then(function (result) {
        if (operation === 'add') {
            newStock = parseInt(currentStock) - parseInt(result.alter_quant);
            connection.query(`
            UPDATE products
            SET stock_quantity = ${newStock}
            WHERE product_name = '${item}'
            `);

            //modify cart array
            itemIndex = cart.findIndex(function (element) {
                return element.name === item
            });
            cartQuant = parseInt(cart[itemIndex].quantity) + parseInt(result.alter_quant);
            cart[itemIndex].quantity = cartQuant;

            setTimeout(() => {
                viewCart()
            }, 1000);

        } else {
            itemIndex = cart.findIndex(function (element) {
                return element.name === item
            });
            if (cart[itemIndex].quantity < result.alter_quant) {

                console.log(`\n*************************************************`)
                console.log(`** Can't remove more than you have! Try again! **`)
                console.log(`*************************************************\n`)
                setTimeout(() => {
                    viewCart()
                }, 1000);

            } else {

                newStock = parseInt(currentStock) + parseInt(result.alter_quant);
                connection.query(`
                UPDATE products
                SET stock_quantity = ${newStock}
                WHERE product_name = '${item}'
                `);

                //modify cart array
                cartQuant = parseInt(cart[itemIndex].quantity) - parseInt(result.alter_quant);
                cart[itemIndex].quantity = cartQuant;

                setTimeout(() => {
                    viewCart()
                }, 1000);
            }
        }
    })
}