import React from 'react'
import { get } from 'lodash'

const ForgotPasswordPage = (props) => {
  const vendorId = get(props, 'match.params.vendorId', '')
  const vendorProfile = get(props, `data.vendorProfiles.${vendorId}`)
  return (
    <div>
      <h3>{get(vendorProfile, 'name', '')} </h3>
    </div>
  )
}

ForgotPasswordPage.propTypes = {
}

ForgotPasswordPage.defaultProps = {
}

export default ForgotPasswordPage
