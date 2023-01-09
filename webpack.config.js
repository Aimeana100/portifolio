const path = require('path')

module.exports = {
    mode : "development",
    entry:{ front: "./src/index.js"},
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
}, 
watch : true

}