const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const bcrypt = require('bcrypt');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
});
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Hash password before creating a new user
User.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
});

async function syncDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connected to the database');
        await User.sync({ force: true });
        console.log('User model synchronized with the database');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
}

async function createUser() {
    try {
        await User.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASS
        });
        console.log(`User created successfully!`);
    } catch (err) {
        console.error('Error creating user:', err);
    } finally {
        await sequelize.close();
    }
}
syncDatabase().then(() => {
    createUser();
});