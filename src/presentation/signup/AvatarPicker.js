import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './AvatarPicker.css'


class AvatarPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value // initialize state from value prop given by redux-form
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value }) // update state when props change
  }

  updateValue(value) {
    this.setState({ value }) // change local state
    this.props.onChange(value) // notify redux-form
  }

  render() {
    const { images } = this.props
    return (
      <div>
        <ul className="avatar-container">
          {images.map(avatarOption => (
            <li
              onClick={() => {
                this.updateValue(avatarOption)
              }}
              key={avatarOption}
              className={`element ${this.state.value === avatarOption ? 'selected' : 'unselected'}`}
            >
              <img src={avatarOption} style={{ height: 80, width: 80 }} alt="avatar" />
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

AvatarPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired
}
export default AvatarPicker
