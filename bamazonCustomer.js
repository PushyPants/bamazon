let mysql = require('mysql');
let inquirer = require('inquirer');
let Table = require('cli-table');
let fs = require('fs');



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

function displayLogo() { // grab ascii text from logo.txt file and print it in console
    fs.readFile('logo.txt', 'utf8', function (err, data) {
        console.log(data);
    })
}

function navItems() {
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
                let itemPrice = res[itemId - 1].price;
                let currentStock = res[itemId - 1].stock_quantity
                console.log(`Current Stock: ${currentStock}`)

                inquirer.prompt([{
                    type: 'input',
                    name: 'purchase_quantity',
                    message: 'How many would you like to purchase?',
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }]).then(function (result) {
                    updateStock(itemId, currentStock, itemPrice, result.purchase_quantity)
                })
            })
        });
}

navItems();

function updateStock(itemId, stock, price, quantity) {
    console.log(`Item Id: ${itemId} current stock: ${stock} price: $${price}`)
    let newStock = stock - quantity;
    console.log(newStock)
    connection.query(`
    UPDATE products
    SET stock_quantity = ${newStock}
    WHERE item_id = ${itemId}
    `);

    connection.query(`SELECT * FROM products WHERE item_id = ${itemId}`, function (err, res) {
        console.log('new stock amt:', res[0].stock_quantity)

    })
}