import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TextField, IconButton, Paper } from 'material-ui'
import SearchIcon from 'material-ui/svg-icons/action/search'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import { grey500 } from 'material-ui/styles/colors'

const getStyles = (props, state) => {
  const { disabled, iconButtonStyle } = props
  const { value } = state
  const nonEmpty = value.length > 0

  return {
    root: {
      height: 48,
      display: 'flex',
      justifyContent: 'space-between'
    },
    iconButtonClose: {
      style: {
        opacity: !disabled ? 0.54 : 0.38,
        transform: nonEmpty ? 'scale(1, 1)' : 'scale(0, 0)',
        transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        ...iconButtonStyle
      },
      iconStyle: {
        opacity: nonEmpty ? 1 : 0,
        transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)'
      }
    },
    iconButtonSearch: {
      style: {
        opacity: !disabled ? 0.54 : 0.38,
        transform: nonEmpty ? 'scale(0, 0)' : 'scale(1, 1)',
        transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        marginRight: -48,
        ...iconButtonStyle
      },
      iconStyle: {
        opacity: nonEmpty ? 0 : 1,
        transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)'
      }
    },
    input: {
      width: '100%'
    },
    searchContainer: {
      margin: 'auto 16px',
      width: '100%'
    }
  }
}

export default class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focus: false,
      value: this.props.value,
      active: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ ...this.state, value: nextProps.value })
    }
  }

  focus() {
    this.autoComplete.focus()
  }

  blur() {
    this.autoComplete.blur()
  }

  handleFocus() {
    this.setState({ focus: true })
  }

  handleBlur() {
    this.setState({ focus: false })
    if (this.state.value.trim().length === 0) {
      this.setState({ value: '' })
    }
  }

  handleInput(e) {
    this.setState({ value: e })
  }

  handleCancel() {
    this.setState({ active: false, value: '' })
  }

  handleKeyPressed(e) {
    if (e.charCode === 13) {
      this.props.onRequestSearch()
    }
  }

  render() {
    const styles = getStyles(this.props, this.state)
    const {
      closeIcon,
      disabled,
      onRequestSearch,
      searchIcon,
      spellCheck,
      ...inputProps
    } = this.props

    return (
      <Paper
        style={{
          ...styles.root
        }}
      >
        <div style={styles.searchContainer}>
          <TextField
            ref={(ref) => { this.autoComplete = ref }}
            onBlur={() => this.handleBlur()}
            onKeyPress={e => this.handleKeyPressed(e)}
            onFocus={() => this.handleFocus()}
            fullWidth
            style={styles.input}
            underlineShow={false}
            disabled={disabled}
            spellCheck={spellCheck}
            {...inputProps}
          />
        </div>
        <IconButton
          onClick={onRequestSearch}
          iconStyle={styles.iconButtonSearch.iconStyle}
          style={styles.iconButtonSearch.style}
          disabled={disabled}
        >
          {searchIcon}
        </IconButton>
        <IconButton
          onClick={onRequestSearch}
          iconStyle={styles.iconButtonClose.iconStyle}
          style={styles.iconButtonClose.style}
          disabled={disabled}
        >
          {searchIcon}
        </IconButton>
      </Paper>
    )
  }
}

SearchBar.defaultProps = {
  closeIcon: <CloseIcon color={grey500} />,
  disabled: false,
  hintText: 'Search',
  searchIcon: <SearchIcon color={grey500} />,
  spellCheck: false,
  value: ''
}

SearchBar.propTypes = {
  closeIcon: PropTypes.node,
  disabled: PropTypes.bool,
  hintText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onRequestSearch: PropTypes.func.isRequired,
  searchIcon: PropTypes.node,
  spellCheck: PropTypes.bool,
  value: PropTypes.string
}
