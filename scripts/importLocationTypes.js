const locationTypes = require('./locationTypes')
const _ = require('lodash')
const firebase = require('firebase')
const algoliasearch = require('algoliasearch')

const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID
const ALGOLIA_ADMIN_KEY = process.env.REACT_APP_ALGOLIA_ADMIN_KEY
const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
}

firebase.initializeApp(firebaseConfig)
const locationRef = firebase.database().ref('/locationTypes')

const locationTypesIndex = algoliaClient.initIndex('locationTypes')

const categories = ['Residential', 'Commercial', 'Studio', 'Transportation', 'Styles', 'Indianapolis for']
const categoryIndexes = categories.reduce((acc, category) => {
  const index = _.findIndex(locationTypes, locationType => locationType.FIELD1 === category)
  return [...acc, index]
}, [])

const locationTypesBetween = categoryIndexes.map((categoryIndex, i) => {
  if (i === categoryIndexes.length - 1) {
    return [categoryIndex + 1, locationTypes.length - 1]
  }
  return [categoryIndex + 1, categoryIndexes[i + 1]]
})


const locationsWithCategories = locationTypesBetween.reduce((acc, indexes, i) => {
  const category = categories[i]
  const locations = locationTypes.slice(indexes[0], indexes[1])
  const locationsWithCategory = locations.map(location => ({ category, type: location.FIELD1 }))
  return ([...acc, ...locationsWithCategory])
}, [])

console.log(locationsWithCategories)

const addLocations = locations => locations.map(location => locationRef.orderByChild('type').equalTo(location.type).once('value', (snapshot) => {
  const val = snapshot.val()
  if (val === null) {
    const key = locationRef.push().key
    return locationRef.child(key).update({
      category: location.category,
      type: location.type
    }).then(() => {
      locationTypesIndex.addObject({
        objectID: key,
        category: location.category,
        type: location.type
      })
    })
  }
  return Promise.resolve()
}))


Promise.all(addLocations(locationsWithCategories)).then(() => {
})

