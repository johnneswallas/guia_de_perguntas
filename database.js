const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas','root','johnwallas16',{
    host:'localhost',
    dialect: 'mysql',
    logging:false
})

module.exports = connection;
