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

