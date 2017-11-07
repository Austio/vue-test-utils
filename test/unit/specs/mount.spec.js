import Vue from 'vue'
import { compileToFunctions } from 'vue-template-compiler'
import mount from '~src/mount'
import ComponentWithProps from '~resources/components/component-with-props.vue'
import ComponentWithMixin from '~resources/components/component-with-mixin.vue'

describe('mount', () => {
  it('returns new VueWrapper with mounted Vue instance if no options are passed', () => {
    const compiled = compileToFunctions('<div><input /></div>')
    const wrapper = mount(compiled)
    expect(wrapper.vm).to.be.an('object')
  })

  it('returns new VueWrapper with mounted Vue instance when root is functional component', () => {
    const FunctionalComponent = {
      functional: true,
      render (h) {
        return h('div', {}, [
          h('p', {
            'class': {
              foo: true
            }
          }),
          h('p')
        ])
      },
      name: 'common'
    }

    const wrapper = mount(FunctionalComponent)
    expect(wrapper.findAll('p').length).to.equal(2)
  })

  it('returns new VueWrapper with mounted Vue instance with props, if passed as propsData', () => {
    const prop1 = { test: 'TEST' }
    const wrapper = mount(ComponentWithProps, { propsData: { prop1 }})
    expect(wrapper.vm).to.be.an('object')
    if (wrapper.vm.$props) {
      expect(wrapper.vm.$props.prop1).to.equal(prop1)
    } else {
      expect(wrapper.vm.$options.propsData.prop1).to.equal(prop1)
    }
  })

  it('returns new VueWrapper with mounted Vue instance initialized with Vue.extend with props, if passed as propsData', () => {
    const prop1 = { test: 'TEST' }
    const wrapper = mount(Vue.extend(ComponentWithProps), { propsData: { prop1 }})
    expect(wrapper.vm).to.be.an('object')
    if (wrapper.vm.$props) {
      expect(wrapper.vm.$props.prop1).to.equal(prop1)
    } else {
      expect(wrapper.vm.$options.propsData.prop1).to.equal(prop1)
    }
  })

  it('does not use cached component', () => {
    ComponentWithMixin.methods.someMethod = sinon.stub()
    mount(ComponentWithMixin)
    expect(ComponentWithMixin.methods.someMethod.callCount).to.equal(1)
    ComponentWithMixin.methods.someMethod = sinon.stub()
    mount(ComponentWithMixin)
    expect(ComponentWithMixin.methods.someMethod.callCount).to.equal(1)
  })

  it('throws an error if window is undefined', () => {
    if (!(navigator.userAgent.includes && navigator.userAgent.includes('node.js'))) {
      console.log('window read only. skipping test ...')
      return
    }
    const windowSave = global.window

    after(() => {
      global.window = windowSave
    })
    const message = '[vue-test-utils]: window is undefined, vue-test-utils needs to be run in a browser environment.\n You can run the tests in node using JSDOM'
    global.window = undefined

    expect(() => mount(compileToFunctions('<div />'))).to.throw().with.property('message', message)
  })

  it('compiles inline templates', () => {
    const wrapper = mount({
      template: `<div>foo</div>`
    })
    expect(wrapper.vm).to.be.an('object')
    expect(wrapper.html()).to.equal(`<div>foo</div>`)
  })

  it.only('non prop attrs', () => {
    const wrapper = mount(ComponentWithProps, {
      propsData: {
        prop1: '1',
        prop2: '2',
        title: '3'
      }
    })

    expect(wrapper.html()).to.equal(`<div title="3"><p class="prop-1">1</p> <p class="prop-2">2</p></div>`)
  })

  xit('non prop attributes', () => {
    const wrapper = mount({
      template: `<div><div>foo</div></div>`,
      inheritAttrs: false
    }, {
      propsData: {
        attr1: '1'
      }
    });

    expect(wrapper.html()).to.equal(`<div attr1="1"><div>foo</div></div>`)
  })

  xit('inheirtAttrs', () => {
    const wrapper = mount({
      template: `<div><div v-bind="$attrs">foo</div></div>`,
      inheritAttrs: false,
    }, {
      propsData: {
        attr1: '1',
        attr2: '2'
      }
    });

    expect(wrapper.html()).to.equal(`<div><div attr1="1" attr2="2">foo</div></div>`)
  })
})
