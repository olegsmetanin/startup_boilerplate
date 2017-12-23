module.exports = require('./webpack.base.config.js').sitessr({
    vendormeta: require('./dist/vendormeta.json'),
    sitemeta: require('./dist/sitemeta.json')
})

