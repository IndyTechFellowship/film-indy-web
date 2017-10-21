const XLSX = require('xlsx')
const Parsimmon = require('parsimmon')
const firebase = require('firebase')
const _ = require('lodash')

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
}

firebase.initializeApp(firebaseConfig)

const database = firebase.database()
const rolesRef = firebase.database().ref('/roles')
const userMigrationRef = firebase.database().ref('/userMigration')
const userAccountRef = firebase.database().ref('/userAccount')
const userProfileRef = firebase.database().ref('/userProfiles')

const encodeAsFirebaseKey = string => string.replace(/\%/g, '%25')
  .replace(/\./g, '%2E')
  .replace(/\#/g, '%23')
  .replace(/\$/g, '%24')
  .replace(/\//g, '%2F')
  .replace(/\[/g, '%5B')
  .replace(/\]/g, '%5D')


const cleanUpRoleParse = parsedRoles => parsedRoles.map((role) => {
  const roleName = role[1].replace(':', '')
  const roleValue = role[2].replace(/'/g, '')
  return [roleName, roleValue]
})

const parseFile = (filename) => {
  const RoleParser = Parsimmon.createLanguage({
    Role: r => Parsimmon.seq(
      r.DashAndNewLine,
      r.Key,
      r.KeyValue
    ).many().map(cleanUpRoleParse),
    DashAndNewLine: () => Parsimmon.regexp(/(-{3}\n)?/),
    Key: () => Parsimmon.regexp(/^[^:]+:\s?/),
    KeyValue: () => Parsimmon.regexp(/.*\s*/)
  })

  const workbook = XLSX.readFile(filename)
  const formSubmissions = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1)
  return formSubmissions.map((submission) => {
    const email = submission.Email
    const [firstName, lastName] = submission['Last Name'].split(' ')
    const phone = submission.Phone
    const roles = RoleParser.Role.tryParse(submission['Named Content'])
    const rolesWithoutUnderscore = roles.map((roleWithAnswer) => {
      const role = roleWithAnswer[0].replace(/ /g, '')
      const answer = roleWithAnswer[1]
      const roleWithoutUnderscore = role.split('_').reduce((acc, string) => {
        if (acc === '') {
          return `${string.charAt(0).toUpperCase()}${string.slice(1)}`
        }
        return `${acc} ${string.charAt(0).toUpperCase()}${string.slice(1)}`
      }, '')
      return [roleWithoutUnderscore, answer]
    })
    return {
      email,
      firstName,
      lastName,
      roles: rolesWithoutUnderscore,
      phone
    }
  })
}

const getUniqueRoles = usersToImport => usersToImport.reduce((acc, userToImport) => {
  const roles = userToImport.roles.map(role => role[0])
  const newRoles = roles.reduce((roleAcc, role) => {
    if (acc.includes(role)) {
      return roleAcc
    }
    return [...roleAcc, role]
  }, [])
  return [...acc, ...newRoles]
}, []).filter(role => role !== 'link')

const addRolesToFirebase = uniqueRoles => uniqueRoles.map(uniqueRole => rolesRef.orderByChild('roleName').equalTo(uniqueRole).once('value', (snapshot) => {
  const val = snapshot.val()
  if (val === null) {
    const key = rolesRef.push().key
    return rolesRef.child(key).update({
      roleName: uniqueRole
    })
  }
  return Promise.resolve()
}))

const convertRoleNameToRoleId = users => users.map((userToImport) => {
  const replacedRolesPromises = userToImport.roles.filter(role => role[0] !== 'Link').map((role) => {
    const r = role[0]
    return rolesRef.orderByChild('roleName').equalTo(r).once('value').then((snapshot) => {
      const key = Object.keys(snapshot.val())[0]
      return key
    })
  })
  return Promise.all(replacedRolesPromises).then(roleIds => ({
    ...userToImport,
    roles: roleIds
  }))
})

const addUserMigrationToFirebase = (addRolesPromises, usersToImport) => {
  Promise.all(convertRoleNameToRoleId(usersToImport)).then((users) => {
    const userMigrationPromises = users.map((user) => {
      if (user.email) {
        const emailKey = encodeAsFirebaseKey(user.email)
        const cleanUser = _.omitBy(user, _.isNil)
        const { email, roles, phone } = cleanUser
        const firstName = _.get(cleanUser, 'firstName', '')
        const lastName = _.get(cleanUser, 'lastName', '')
        return userAccountRef.child(emailKey).set({
          firstName,
          lastName,
          phone,
          email,
          public: true
        }).then(() => userProfileRef.child(emailKey).set({
          roles
        }))
      }
      return Promise.resolve()
    })
    Promise.all(userMigrationPromises).then(() => database.goOffline())
  })
}

const startImport = () => {
  const usersToImport = parseFile('import.xls')
  const uniqueRoles = getUniqueRoles(usersToImport)
  const addRolesPromises = Promise.all(addRolesToFirebase(uniqueRoles)).then(() => {
    addUserMigrationToFirebase(addRolesPromises, usersToImport)
  })
}

startImport()

