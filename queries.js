require('dotenv').config()


const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'note_app'

})

const getUsers = (req, res) => {
    pool.query('select * from users', (error, results) =>{
        if(error) {
            throw error
        }

        res.status(200).json(results)
    } )


}

module.exports = {
    getUsers
}