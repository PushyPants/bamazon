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

function printTable() {
    connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw err;
        res.forEach((element, i) => {
            table.push([element.item_id, element.product_name, element.department_name, `$${element.price}`, element.stock_quantity]);
        });
        console.log(table.toString() + '\n\n');
        purchaseItem();
    });
};

function checkStock(item) {
    connection.query('SELECT item FROM products', (err, res) => {
        if (err) throw err;
        console.log(res)
    })
}

function displayLogo() { // grab ascii text from logo.txt file and print it in console
    fs.readFile('logo.txt', 'utf8', function (err, data) {
        console.log(data);
    })
}

var table = new Table({
    head: ['id', 'Name', 'Department', 'Price', 'Stock'],
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

// function purchaseItem() {
//     inquirer.prompt([{
//         type: 'input',
//         name: "product_id",
//         message: 'Please enter the id of the product you wuld like to purchase!',
//         validate: function(value) {
//             if (isNaN(value) === false) {
//               return true;
//             }
//             return false;
//           }
//     }]).then(function(response){
//         connection.query(`
//         SELECT product_name, price, stock_quantity
//         FROM products
//         WHERE ?`,[{item_id: response.product_id}], (err, res) => {
//             if(err) throw err;
//             console.log(res)
//         })
//     });
// }





function navItems() {
    let itemArr = [];

    connection.query(`
    SELECT product_name, price, stock_quantity, item_id
    FROM products`, function (err, res) {
        if (err) throw err;
        res.forEach((value, index) => {
            //console.log(`${value.product_name} - price: $${value.price} (${value.stock_quantity} in stock)`)
            itemArr.push(`${value.item_id}. ${value.product_name} - price: $${value.price} (${value.stock_quantity} in stock)`);
        })

        inquirer.prompt([{
            type: 'list',
            name: 'item_list',
            message: 'Please choose and item',
            choices: itemArr
        }]).then(function (response) {
            updateStock(response.item_list);
        })
    });
}

navItems();

function updateStock(item){
    inquirer.prompt([{
        type: 'input',
        name: 'purchase_quantity',
        message: 'How many would you like to purchase?',
        validate: function(value){
            if (isNaN(value) === false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(result){
        itemId = item.split('.',1).join('');
        //reduce stock by quantity
        connection.query(`
            UPDATE products
        `)
        //multiply total sale price by quantity
    })
}