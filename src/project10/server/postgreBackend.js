// const {request} = require("express");
const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'whatsappClone',
    password: 'bmob1234',
    port: 5432,
});

const getUsers = () => {
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM users ORDER BY userid ASC', (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getMessages = () => {
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM messages ORDER BY msgid ASC', (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}
const createMessage = (body) => {
    return new Promise(function(resolve, reject) {
        const { msgid, senderid, receiverid, msg, senttime } = body
        console.log(`INSERT INTO messages VALUES ('${msgid}', '${senderid}', '${receiverid}', '${msg}', '${senttime}')`)
        pool.query(`INSERT INTO messages VALUES ('${msgid}', '${senderid}', '${receiverid}', '${msg}', '${senttime}')`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(`A new merchant has been added added: ${results.rows[0]}`)
        })
    })
}
// const deleteMerchant = () => {
//     return new Promise(function(resolve, reject) {
//         const id = parseInt(request.params.id)
//         pool.query('DELETE FROM merchants WHERE id = $1', [id], (error, results) => {
//             if (error) {
//                 reject(error)
//             }
//             resolve(`Merchant deleted with ID: ${id}`)
//         })
//     })
// }

module.exports = {
    getUsers,
    getMessages,
    createMessage
    // createMerchant,
    // deleteMerchant,
}