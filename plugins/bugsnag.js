

import Vue from 'vue'
import bugsnag from '@bugsnag/js'
import BugsnagVue from '@bugsnag/plugin-vue'

const bugsnagClient = bugsnag.start({
  apiKey: process.env.bugsnagKey,
  plugins: [new BugsnagVue()], // this is important
})

Vue.use(bugsnagClient) // // this is also important

export default (ctx, inject) => {
  inject('bugsnag', bugsnagClient)
}