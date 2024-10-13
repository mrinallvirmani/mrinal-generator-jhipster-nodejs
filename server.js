const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sequelize = new Sequelize('social_media_metrics', 'postgres', 'B4b#h67$', {
    host: 'localhost',
    dialect: 'postgres',
});

const SocialMediaAccount = sequelize.define('SocialMediaAccount', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    platform: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

sequelize.sync()
    .then(() => console.log('SocialMediaAccount table created successfully!'))
    .catch((error) => console.error('Error creating table:', error));

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

app.get('/social-media', async (req, res) => {
    try {
        const accounts = await SocialMediaAccount.findAll();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve accounts.' });
    }
});

app.get('/social-media/:id', async (req, res) => {
    try {
        const account = await SocialMediaAccount.findByPk(req.params.id);
        if (account) {
            res.json(account);
        } else {
            res.status(404).json({ error: 'Account not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve account.' });
    }
});

app.put('/social-media/:id', async (req, res) => {
    try {
        const account = await SocialMediaAccount.findByPk(req.params.id);
        if (account) {
            account.username = req.body.username;
            account.platform = req.body.platform;
            await account.save();
            res.json(account);
        } else {
            res.status(404).json({ error: 'Account not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update account.' });
    }
});

app.delete('/social-media/:id', async (req, res) => {
    try {
        const result = await SocialMediaAccount.destroy({ where: { id: req.params.id } });
        if (result) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Account not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete account.' });
    }
});

app.post('/social-media', async (req, res) => {
    try {
        const { username, platform } = req.body;
        const newAccount = await SocialMediaAccount.create({ username, platform });
        res.status(201).json(newAccount);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create account.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
