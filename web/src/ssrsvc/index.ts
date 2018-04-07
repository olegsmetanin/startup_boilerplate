import * as http from "http"
import sticky = require('sticky-cluster')
import * as express from 'express'
import {ssr} from './ssr'

sticky(cb => {
  const app = express()

  app.use((req, res, next) => {
    const state = {}
    const html = ssr(state)
    // After successful login, redirect back to the intended page
    res.status(200).send(html);
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



