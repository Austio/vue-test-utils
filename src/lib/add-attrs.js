import Vue from 'vue'

export default function addAttrs (vm, attrs = {}) {
  const originalVueConfig = Vue.config
  Vue.config.silent = true

  vm.$attrs = attrs;

  // Assign props as attrs that do not match
  const passedKeys = Object.keys(vm.$options.propsData);
  const nonPropAttrs = passedKeys.filter(key => !vm.$options.props[key])

  for (let i = 0; i < nonPropAttrs.length; i++) {
    const attr = nonPropAttrs[i];

    // TODO(austin) should we warn if there is a collision here.
    vm.$attrs[attr] = vm.$options.propsData[attr];
    delete vm.$options.propsData[attr];
  }


  Vue.config.silent = originalVueConfig.silent
}
