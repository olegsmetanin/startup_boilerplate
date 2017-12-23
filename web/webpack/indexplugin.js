
class IndexPlugin {

    constructor(options) {
    }

    apply(compiler) {
        this.compiler = compiler;
        this.compiler.plugin("after-emit", (compilation, callback) => {
            //console.log(compilation.getStats() )

            var stats = compilation.getStats().toJson({
                hash: true,
                publicPath: true,
                assets: true,
                chunks: false,
                modules: false,
                source: false,
                errorDetails: false,
                timings: false
            })



            callback();
        });
    }
}

module.exports = IndexPlugin
