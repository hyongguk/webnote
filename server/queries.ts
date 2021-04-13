require('dotenv').config()
import { Request,Response } from "express";
import  User from '../models/interfaces/user.interface'

const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'note_app'

})

const getUsers: Function = (req:Request, res:Response) => {
    pool.query('select * from users', (error: Error, results:any) =>{
        if(error) {
            console.log(error)
            throw error
        }
        const users: User[] = results.rows;

        res.status(200).json(users)
    } )


}
module.exports = getUsers