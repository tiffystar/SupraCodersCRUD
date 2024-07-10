const express = require('express');
const cors = require('cors');
const knex = require('knex')(require('./knexfile')['development']);

const app = express();

const PORT = 8080;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// const authenticate = (req, res, next) => {
//     const { UserId } = req.params;
//     if (UserId) {
//         next();
//     } else {
//         res.status(401).json({ message: 'Unauthorized' });
//     }
// };

app.get('/', (req, res) => {
    //will need to check for cookie from previous login
    res.send('Home route');
});


app.post('/Login', async (req, res) => {
    const { username: name, password: pass } = req.body;
    console.log(req.body);
    try {
        const user = await knex('users').select('id', 'username', 'password').where({ username: name, password: pass })
        if (user.length !== 0) {
            console.log(user);
            res.send(user);
        } else {
            console.log(user);
            res.status(403).send('Invalid username or password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.route('/Users')
    // show all users in db
    .get((req, res) => {
        knex('users').select('*')
            .then(r => {
                if (r.length !== 0) {
                    res.json(r);
                } else {
                    res.status(404).send('No users found');
                }
            })
    })
    // add new user to db
    //verified in POSTMAN
    .post(async (req, res) => {
        const { firstname: fN, lastname: lP, username: u, password: p } = req.body;
        try {
            await knex('users').insert({ firstname: fN, lastname: lP, username: u, password: p || 0 })
            res.status(200).send('User added!');
        } catch (error) {
            console.error(error);
            res.status(404).send('Counld not add new user');
        }

    });

app.route('/Users/:UserId')
    // show user by userId
    // POSTMAN
    .get((req, res) => {
        const userId = parseInt(req.params.UserId);

        knex('users').select('*').where({ id: userId })
            .then(u => {
                if (u.length === 0) {
                    res.status(404).json({ message: 'User not found' });
                }
                else {
                    res.status(200).json(u);
                }
            })
            .catch(error => {
                console.error('Error executing query: ', error);
                res.status(500).json({ message: 'Server error' });
            });
    })

    // delete user by userId
    //POSTMAN
    .delete((req, res) => {
        const userId = parseInt(req.params.UserId);
        try {
            knex('users').where({ id: userId }).del()
                .then(r => {
                    if (r === 0) {
                        res.status(404).send('User not found');
                    } else {
                        res.status(204).send('User deleted');
                    }
                })
        } catch (error) {
            console.error(error);
            res.status(404).send("Could not delete user");
        }
    });
//Once logged in, InvManager will be able to view all items in inventory
app.route('/Users/:UserId/InvManager')
    //verified in POSTMAN
    .get((req, res) => {
        const userId = parseInt(req.params.UserId);
        console.log(`UserId: ${userId}`);

        knex('items').select('*')
            .then(d => {
                if (d.length === 0) {
                    res.status(404).json({ message: 'No items in inventory' });
                } else {
                    res.status(200).json(d);
                }
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            });
    })
    //allows InvManager to add a new item to inventory
    //verified in POSTMAN
    
    .post((req, res) => {
        const { item_name, description, quantity } = req.body;
        const users_id = parseInt(req.params.UserId); //this should automatically provide the ':UserId' (had to use 'parseInt')
        console.log(`UserId: ${users_id}`);

        knex('items').insert({ item_name, description, quantity, users_id })
            .then(() => {
                res.status(201).json({ message: 'New item added to inventory!' });
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ message: 'Could not add item' });
            });
    });

//select a specifie item by :itemId
app.route('/Users/:UserId/InvManager/:itemId')
//verified in POSTMAN
    .get((req, res) => {
        const itemId = parseInt(req.params.itemId);
        knex('items').select('*').where({ id: itemId })
            .then(data => {
                if (data.length !== 0) {
                    res.json(data);
                } else {
                    res.status(404).send('Could not find that item in inventory');
                }
            });
    })

    //allows InvManager to edit item with :itemId
    .patch((req, res) => {
        const itemId = parseInt(req.params.itemId);
        const { item_name, description, quantity, users_id } = req.body;
        const users_id = parseInt(req.params.UserId); //this should automatically provide the ':UserId' (had to use 'parseInt')
        knex('items').where({ id: itemId}).update({ item_name, description, quantity, users_id })
        .then(result => {
            if (result === 0) {
                res.status(404).json({ message: 'Item not found' });
            } else {
                res.status(200).json({ message: 'Item updated successfully' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Could not update item' });
        });
})

    //delete specified item
    //POSTMAN
    .delete((req, res) => {
        // const userId = parseInt(req.params.UserId);
        const itemId = parseInt(req.params.itemId)
        knex('items').where({ id: itemId }).del()
            .then(r => {
                if (r === 0) {
                    res.status(404).send('Item not found');
                } else {
                    res.status(204).send('Item successfully deleted');//message isn't displaying in Postman
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ message: 'Could not delete item' });
            });
    });


app.route('/Inventory') //what 'visitors' will have access to - only 'GET' for viewing -- POSTMAN
    .get((req, res) => {
        knex('items').select('*')
            .then(r => {
                if (r.length !== 0) {
                    res.status(200).json(r);
                } else {
                    res.status(404).send('No items found in inventory');
                }
            })
    })

//POSTMAN
app.route('/Inventory/:itemId')
    .get((req, res) => {
        const itemId = parseInt(req.params.itemId);

        knex('items').select('*').where({ id: itemId })
            .then(r => {
                if (r.length !== 0) {
                    res.status(200).json(r);
                } else {
                    res.status(404).send('Could not find item in inventory');
                }
            })
    })


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
});