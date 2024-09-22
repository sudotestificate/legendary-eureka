const PouchDB = require('pouchdb')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const database = PouchDB.defaults({
  prefix: './.data/database/pouchdb/dbs/',
})

const expressPouchDB = require('express-pouchdb')(database, {
  logPath: './.data/database/pouchdb/logs/log.txt'
})

expressPouchDB.couchConfig.set('admins', process.env.POUCHDB_USERNAME, process.env.POUCHDB_PASSWORD, err => console.log(err))

express()
  .use(function(req, res, next) {
    
    // Allow every domain
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
  
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }

    next();
  })
  .use(express.static(path.join(__dirname, 'public')), expressPouchDB)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
