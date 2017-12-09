import React from 'react'
import { connect } from 'react-redux'
import SearchIcon from 'material-ui/svg-icons/action/search'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { get, chunk } from 'lodash'
import { Grid, Row, Col } from 'react-flexbox-grid'
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
    const { roleSearchResults, searchForRoles } = this.props
    const roles = roleSearchResults.sort((a, b) => a.roleName.localeCompare(b.roleName))
    const chunkedRoles = chunk(roles, 2)
    const { selectedItems } = this.state
    return (
      <div style={{ width: 700, height: 300 }}>
        <div>
          <SearchIcon />
          <TextField onChange={(ev, query) => searchForRoles(query)}id="searchRolesFilter" style={{ width: 650 }} />
        </div>
        <div>
          <Grid fluid>
            {chunkedRoles.map((chunked, i) => {
              const role1 = chunked[0]
              const role2 = chunked[1]
              const role1Selected = role1 ? selectedItems.find(item => role1.roleName === item.roleName) : false
              const role2Selected = role2 ? selectedItems.find(item => role2.roleName === item.roleName) : false
              return (
                <Row key={i}>
                  {role1 ?
                    <Col xs={6}>
                      <RaisedButton
                        onClick={() => this.onItemClick(role1, item => item.roleName === role1.roleName)}
                        style={{ width: 325, marginTop: 10 }}
                        primary={!!role1Selected}
                        label={role1.roleName}
                      />
                    </Col>
                    : null
                  }
                  {role2 ?
                    <Col xs={6}>
                      <RaisedButton
                        onClick={() => this.onItemClick(role2, item => item.roleName === role2.roleName)}
                        style={{ width: 325, marginTop: 10 }}
                        primary={!!role2Selected}
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

export default connect(
  state => ({ roleSearchResults: state.algolia.roleSearchResults }),
  { ...algoliaActions }
)(SearchAndSelectRoles)
