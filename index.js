const PouchDB = require('pouchdb');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')), require('express-pouchdb')(PouchDB))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
