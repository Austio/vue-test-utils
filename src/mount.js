// @flow

import './lib/warn-if-no-window'
import Vue from 'vue'
import VueWrapper from './wrappers/vue-wrapper'
import createInstance from './lib/create-instance'
import cloneDeep from 'lodash/cloneDeep'
import createElement from './lib/create-element'
import './lib/matches-polyfill'
import { setVueErrorHandler } from './lib/error-handler'

Vue.config.productionTip = false
setVueErrorHandler(Vue)

export default function mount (component: Component, options: Options = {}): VueWrapper {
  const componentToMount = options.clone === false ? component : cloneDeep(component.extend ? component.options : component)
  // Remove cached constructor
  delete componentToMount._Ctor

  const vm = createInstance(componentToMount, options)

  if (options.attachToDocument) {
    vm.$mount(createElement())
  } else {
    vm.$mount()
  }

  return new VueWrapper(vm, { attachedToDocument: !!options.attachToDocument })
}
