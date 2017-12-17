// @flow
import config from '../config'
import pickBy from 'lodash/pickBy'

function getStubs (optionStubs) {
  if (optionStubs || Object.keys(config.stubs).length > 0) {
    if (Array.isArray(optionStubs)) {
      return [...optionStubs, ...Object.keys(config.stubs)]
    } else {
      return {
        ...config.stubs,
        ...optionStubs
      }
    }
  }
}

function getPropsNotOnComponent(componentProps = [], propsData = {}) {
  return pickBy(propsData, (_value, key) => componentProps.indexOf(key) === -1)
}

function getAttrs ({ props: componentProps }, { propsData, attrs }) {
  const nonPropAttrs = getPropsNotOnComponent(componentProps, propsData);

  return Object.assign(attrs, nonPropAttrs)
}

export default function extractOptions (
  component: Component,
  options: Options
): Options {
  return {
    mocks: options.mocks,
    context: options.context,
    provide: options.provide,
    stubs: getStubs(options.stubs),
    attrs: getAttrs(component, options),
    listeners: options.listeners,
    slots: options.slots,
    localVue: options.localVue
  }
}
