import React from 'react'
import { connect } from 'react-redux'
import SearchIcon from 'material-ui/svg-icons/action/search'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { chunk, groupBy } from 'lodash'
import { Grid, Row, Col } from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ClearIcon from 'material-ui/svg-icons/content/clear'
import SubmitIcon from 'material-ui/svg-icons/action/input'
import PropTypes from 'prop-types'
import * as algoliaActions from '../../redux/actions/creators/algoliaActions'

class SearchAndSelectRoles extends React.Component {
  constructor(props) {
    super(props)
    const { locationTypeFilters } = props
    this.onItemClick = this.onItemClick.bind(this)
    this.state = { selectedItems: locationTypeFilters }
  }
  componentDidMount() {
    const { searchForLocationTypes } = this.props
    searchForLocationTypes('')
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
    const { locationTypeSearchResults, searchForLocationTypes, onItemsSelected, onItemSelected, page } = this.props
    const grouped = groupBy(locationTypeSearchResults, result => result.category)
    const groupedResults = Object.keys(grouped)
      .sort()
      .reduce((acc, key) => ({ ...acc, [key]: grouped[key] }), {})
    return (
      <div style={{ width: 700, height: 300 }}>
        <div style={{ display: 'flex' }}>
          <SearchIcon style={{ marginTop: 10 }} />
          <TextField hintText="Search Location Types" onChange={(ev, query) => searchForLocationTypes(query)}id="searchRolesFilter" style={{ width: 650 }} />
          {
            page === 'search' ? (
              <IconButton onClick={() => {
                this.setState({ selectedItems: [] })
                onItemsSelected([])
              }}
              >
                <ClearIcon />
              </IconButton>
            ) : null
          }
          {
            page === 'search' ? (
              <IconButton onClick={() => {
                onItemsSelected(this.state.selectedItems)
              }}
              >
                <SubmitIcon />
              </IconButton>
            ) : null
          }
        </div>
        <div>
          {
            Object.keys(groupedResults).map((category) => {
              const results = groupedResults[category]
              const sortedResults = results.sort((a, b) => a.type.localeCompare(b.type))
              const chunkedLocs = chunk(sortedResults, 2)
              const { selectedItems } = this.state
              return (
                <Grid key={category} fluid>
                  <h4> {category} </h4>
                  {chunkedLocs.map((chunked, i) => {
                    const loc1 = chunked[0]
                    const loc2 = chunked[1]
                    const role1Selected = !!(loc1 && selectedItems.find(item => loc1.type === item))
                    const role2Selected = !!(loc2 && selectedItems.find(item => loc2.type === item))
                    return (
                      <Row key={i}>
                        {loc1 ?
                          <Col xs={6}>
                            <RaisedButton
                              onClick={() => {
                                this.onItemClick(loc1.type, item => item === loc1.type)
                                onItemSelected(this.state.selectedItems, loc1, role1Selected ? 'remove' : 'add')
                              }}
                              style={{ width: 325, marginTop: 10 }}
                              primary={role1Selected}
                              label={loc1.type}
                            />
                          </Col>
                          : null
                        }
                        {loc2 ?
                          <Col xs={6}>
                            <RaisedButton
                              onClick={() => {
                                this.onItemClick(loc2.type, item => item === loc2.type)
                                onItemSelected(this.state.selectedItems, loc2, role2Selected ? 'remove' : 'add')
                              }}
                              style={{ width: 325, marginTop: 10 }}
                              primary={role2Selected}
                              label={loc2.type}
                            />
                          </Col>
                          : null
                        }
                      </Row>
                    )
                  })}
                </Grid>
              )
            })
          }
        </div>
      </div>
    )
  }
}

SearchAndSelectRoles.propTypes = {
  page: PropTypes.string.isRequired,
  searchForLocationTypes: PropTypes.func.isRequired,
  onItemsSelected: PropTypes.func.isRequired,
  onItemSelected: PropTypes.func.isRequired,
  locationTypeSearchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  locationTypeFilters: PropTypes.arrayOf(PropTypes.string).isRequired

}

export default connect(
  state => ({ locationTypeSearchResults: state.algolia.locationTypeSearchResults }),
  { ...algoliaActions }
)(SearchAndSelectRoles)
