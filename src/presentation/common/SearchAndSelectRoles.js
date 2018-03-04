import React from 'react'
import { connect } from 'react-redux'
import SearchIcon from 'material-ui/svg-icons/action/search'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton'
import ClearIcon from 'material-ui/svg-icons/content/clear'
import { chunk } from 'lodash'
import { Grid, Row, Col } from 'react-flexbox-grid'
import PropTypes from 'prop-types'
import * as algoliaActions from '../../redux/actions/creators/algoliaActions'


class SearchAndSelectRoles extends React.Component {
  constructor(props) {
    super(props)
    this.onItemClick = this.onItemClick.bind(this)
    this.state = { selectedItems: [] }
  }
  componentDidMount() {
    const { searchForRoles } = this.props
    searchForRoles('')
  }
  onItemClick(item, findFn) {
    const { selectedItems } = this.state
    const itemAlreadyExists = selectedItems.find(findFn)
    if (itemAlreadyExists) {
      const withoutItem = selectedItems.filter(selected => !findFn(selected))
      this.setState({ selectedItems: withoutItem })
    } else {
      this.setState({ selectedItems: [...selectedItems, item] })
    }
  }
  render() {
    const { roleSearchResults, searchForRoles, onItemSelected, roleFilters, page } = this.props
    const roles = roleSearchResults.sort((a, b) => a.roleName.localeCompare(b.roleName))
    const chunkedRoles = chunk(roles, 2)
    return (
      <div style={{ width: 700, height: 300 }}>
        <div style={{ display: 'flex' }}>
          <SearchIcon style={{ marginTop: 10 }} />
          <TextField hintText="Search Roles" onChange={(ev, query) => searchForRoles(query)}id="searchRolesFilter" style={{ width: 650 }} />
          {
            page === 'search' ? (
              <IconButton onClick={() => {
                roles.forEach((role) => {
                  this.onItemClick(role, item => item.roleName === role.roleName)
                  onItemSelected(this.state.selectedItems, role, 'remove')
                })
              }}
              >
                <ClearIcon />
              </IconButton>
            ) : null
          }

        </div>
        <div>
          <Grid fluid>
            {chunkedRoles.map((chunked, i) => {
              const role1 = chunked[0]
              const role2 = chunked[1]
              const role1Selected = !!(role1 && roleFilters.find(item => role1.roleName === item))
              const role2Selected = !!(role2 && roleFilters.find(item => role2.roleName === item))
              return (
                <Row key={i}>
                  {role1 ?
                    <Col xs={6}>
                      <RaisedButton
                        onClick={() => {
                          this.onItemClick(role1, item => item.roleName === role1.roleName)
                          onItemSelected(this.state.selectedItems, role1, role1Selected ? 'remove' : 'add')
                        }}
                        style={{ width: 325, marginTop: 10 }}
                        primary={role1Selected}
                        label={role1.roleName}
                      />
                    </Col>
                    : null
                  }
                  {role2 ?
                    <Col xs={6}>
                      <RaisedButton
                        onClick={() => {
                          this.onItemClick(role2, item => item.roleName === role2.roleName)
                          onItemSelected(this.state.selectedItems, role2, role2Selected ? 'remove' : 'add')
                        }}
                        style={{ width: 325, marginTop: 10 }}
                        primary={role2Selected}
                        label={role2.roleName}
                      />
                    </Col>
                    : null
                  }
                </Row>
              )
            })}
          </Grid>
        </div>
      </div>
    )
  }
}

SearchAndSelectRoles.propTypes = {
  page: PropTypes.string.isRequired,
  searchForRoles: PropTypes.func.isRequired,
  onItemSelected: PropTypes.func.isRequired,
  roleSearchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  roleFilters: PropTypes.arrayOf(PropTypes.string).isRequired

}

export default connect(
  state => ({ roleSearchResults: state.algolia.roleSearchResults }),
  { ...algoliaActions }
)(SearchAndSelectRoles)
