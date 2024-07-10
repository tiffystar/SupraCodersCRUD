const express = require('express');
const cors = require('cors');
const knex = require('knex')(require('./knexfile')['development']);

const app = express();

const PORT = 8080;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000'}));


app.get('/', (req, res) => {
    //will need to check for cookie from previous login
    res.send('Home route');
});


app.post('/Login', async (req, res) => {
   const { username: name, password: pass } = req.body;
    console.log(req.body);
   try {
        const user = await knex('users').select('id', 'username', 'password').where({ username: name, password: pass})
        if(user.length !== 0){
            console.log(user);
            res.send(user);
        }else{
            console.log(user);
            res.status(403).send('Invalid username or password');
        }
   } catch(error){
    console.error(error);
    res.status(500).send('Internal server error');
   }
});

app.route('/Users')
    // show all users in db
    .get((req,res) => {
        knex('users').select('*')
            .then(r => {
                if(r.length !== 0){
                    res.json(r);
                }else{
                    res.status(404).send('No users found');
                }
            })
    })
    // add new user to db
    .post(async (req, res) => {
        const { firstname: fN, lastname: lP, username: u, password: p } = req.body;
        try{
            await knex('users').insert({ firstname: fN, lastname: lP, username: u, password: p || 0 })
             res.status(200).send('User added!');
        }catch(error){
            console.error(error);
            res.status(404).send('Counld not add new user');
        }
        
    });

app.route('/Users/:UserId')
    // show user by userId
    .get((req, res) => {
        const userId = parseInt(req.params.UserId);

        knex('users').select('*').where({ id: userId})
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
    .delete((req, res) => {
        const userId = parseInt(req.params.UserId);
        try{
            knex('users').where({ id: userId}).del()
            .then(r => {
                if(r === 0){
                    res.status(404).send('User not found');
                }else{
                    res.status(204).send('User deleted');
                }
            })
        }catch(error){
            console.error(error);
            res.status(404).send("Could not delete user");
        }
            
    });

// app.route('/Users/:UserId/InvManager')
//     .get((req, res) => {
//         const userId = parseInt(req.params.UserId);
//         knex('items').select('*').where({ users_id: userId })
//             .then(d => {
//                 if(d.length === 0){
//                     res.status(404).json({ message: 'No items in inventory'});
//                 }
//                 else {
//                     res.status(200).json(d);
//                 }
//             });
//     })
//     .post(async (req, res) => {
//         const newItem = parseInt(req.body.newItem);
//         const userId = parseInt(req.body.userId);
//         try{
//             await knex('items').insert({ item_id: newItem, users_id: userId})
//             res.status(200).send('New item added to inventory!');
//         }catch(error){
//             console.error(error);
//             res.status(404).json({ message: 'Could not add item' });
//         }
//     });

// app.route('/Users/:UserId/InvManager/:itemId')
//     .get((req, res) => {
//         const userId = parseInt(req.params.UserId);
//         knex('items').select('item_id').where({ user_id: userId})
//             .then(data => {
//                 if(data.length !== 0){
//                     res.json(data);
//                 }else{
//                     res.status(404).send('User has no items'); //I want all users to see all inventory items
//                 }
//             })
//     })
//     .delete((req, res) => {
//         const userId = parseInt(req.params.UserId);
//         const itemId = parseInt(req.params.itemId)
//         knex('items').where({ user_id: userId, id: itemId }).del()
//         .then(r => {
//             if(r === 0){
//                 res.status(404).send('Item not found');
//             }else{
//                 res.status(204).send();
//             }
//         })
//         .catch((error) => {
//             console.error(error);
//         })
//     })


app.route('/Inventory') //what 'visitors' will have access to - only 'GET' for viewing
    .get((req, res) => {
        knex('items').select('*')
            .then(r => {
                if(r.length !== 0){
                    res.status(200).json(r);
                }else{
                    res.status(404).send('No items found in inventory');
                }
            })
    })


app.route('/Inventory/:itemId')
    .get((req, res) => {
        const itemId = parseInt(req.params.itemId);
        
        knex('items').select('*').where({ id: itemId})
            .then(r => {
                if(r.length !== 0){
                    res.status(200).json(r);
                }else{
                    res.status(404).send('Could not find item in inventory');
                }
            })
    })


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
});