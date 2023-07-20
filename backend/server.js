const express = require('express')
const cors = require('cors');
const pool = require('./db')

const port = 3001

const app = express()

app.use(cors())
app.use(express.json())

//routes
app.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM flats')
        res.status(200).send(data.rows)
    } catch (err) {
        console.error(err.message)
        res.sendStatus(500)
    }
})

app.post('/', async (req, res) => {
    try {
        await pool.query('INSERT INTO flats (data) VALUES ($1)', [JSON.stringify(req.body)])
        res.status(200).send({message: 'Flats added'})
    } catch (err) {
        console.error(err.message)
        res.sendStatus(500)
    }
})

app.get('/setup', async (req, res) => {
    try {
        await pool.query('CREATE TABLE IF NOT EXISTS flats (id serial PRIMARY KEY, data JSON)')
        res.status(200).send({message: 'Table created'})
    } catch (err) {
        console.error(err.message)
        res.sendStatus(500)
    }
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is up on port ${port}`)
})