// backend/hash_password.js

const bcrypt = require('bcryptjs');

const plainPassword = 'testpassword'; // The password we will use for the test user
const saltRounds = 10;

console.log('--- Generating Hashed Password for "testpassword" ---');

bcrypt.hash(plainPassword, saltRounds)
    .then(hash => {
        console.log('✅ Hashed Password (COPY THIS STRING):');
        console.log(hash);
    })
    .catch(err => console.error('Bcrypt Error:', err));