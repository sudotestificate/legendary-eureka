const PouchDB = require('pouchdb');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const cors = require('cors')

let database = PouchDB.defaults({
  prefix: './database/pouchdb/dbs/',
})

express()
  .use(
    express.static(path.join(__dirname, 'public')), 
    require('express-pouchdb')(database, {
      logPath: './database/pouchdb/logs/log.txt',
      configPath: './database/pouchdb/config.json',
    })
  )
  .use(cors())
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
