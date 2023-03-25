const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/vapps/appman/website/' : '/',
  productionSourceMap: process.env.NODE_ENV != 'production',
  transpileDependencies: [
    'vuetify'
  ]
})
