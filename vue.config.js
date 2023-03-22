const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/vapps/appman/website/' : '/',
  transpileDependencies: [
    'vuetify'
  ]
})
