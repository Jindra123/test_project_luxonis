const express = require('express')
const pool = require('./db')

const port = 3001

const app = express()
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
    const { heading, image } = req.body
    try {
        await pool.query('INSERT INTO flats (heading, image) VALUES ($1, $2)', [heading, image])
        res.status(200).send({message: 'Flat added'})
    } catch (err) {
        console.error(err.message)
        res.sendStatus(500)
    }
})

app.get('/setup', async (req, res) => {
    try {
        await pool.query('CREATE TABLE IF NOT EXISTS flats (id SERIAL PRIMARY KEY, heading VARCHAR(100) NOT NULL, image VARCHAR(500) NOT NULL)')
        res.status(200).send({message: 'Table created'})
    } catch (err) {
        console.error(err.message)
        res.sendStatus(500)
    }
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})