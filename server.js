const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const registeredUsers = [];

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (registeredUsers.some((user) => user.username === username)) {
        res.status(409).send('Username is already taken.');
    } else {
        registeredUsers.push({ username, password });
        res.status(200).send('Registration successful');
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = registeredUsers.find((user) => user.username === username && user.password === password);

    if (user) {
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Login failed. Invalid credentials.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//By Jaswanth Tikkireddy
//jaswanth.t07@gmail.com