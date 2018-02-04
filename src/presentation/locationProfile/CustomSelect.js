
import { Component, createElement } from 'react'
import SelectField from 'material-ui-next/Select'

const mapError = (
  {
    meta: { touched, error, warning } = {},
    input,
    ...props
  },
  errorProp = 'errorText'
) =>
  (touched && (error || warning)
    ? {
      ...props,
      ...input,
      [errorProp]: error || warning
    }
    : { ...input, ...props })


function createComponent(MaterialUIComponent, mapProps) {
  class InputComponent extends Component {
    getRenderedComponent() {
      return this.refs.component
    }

    render() {
      return createElement(MaterialUIComponent, {
        ...mapProps(this.props),
        ref: 'component'
      })
    }
  }
  InputComponent.displayName = `ReduxFormMaterialUI${MaterialUIComponent.name}`
  return InputComponent
}

export default createComponent(SelectField, ({
  input: { onChange, value, onBlur, ...inputProps },
  onChange: onChangeFromField,
  ...props
}) => ({
  ...mapError(props),
  ...inputProps,
  value,
  onChange: (event) => {
    onChange(event.target.value)
    if (onChangeFromField) {
      onChangeFromField(event.target.value)
    }
  },
  onBlur: () => onBlur(value)
}))
