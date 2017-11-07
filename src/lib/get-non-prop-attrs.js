import omit from 'lodash/omit'

export default function getNonPropAttrs(componentDefinedProps = {}, passedProps = {}) {
  return omit(passedProps, Object.keys(componentDefinedProps))
}
