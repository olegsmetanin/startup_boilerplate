import * as http from "http"
import sticky = require('sticky-cluster')
import * as express from 'express'

sticky(cb => {
  const app = express()

  app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    res.status(200).send('OK!!');
  });

  const server = http.createServer(app)

  cb(server)
},
{
  concurrency: 10,
  port: 8080,
  debug: true,
  env: function (index) { return { stickycluster_worker_index: index }; }
}
)



