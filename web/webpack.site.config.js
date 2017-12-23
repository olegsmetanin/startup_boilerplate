module.exports = require('./webpack.base.config.js').site({
    vendordll: require('./dist/vendor-dll-manifest.json')
})

