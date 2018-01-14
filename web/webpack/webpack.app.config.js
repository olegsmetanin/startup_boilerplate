module.exports = require('./webpack.base.config.js').app({
    vendordll: require('../dist/vendor-dll-manifest.json')
})

