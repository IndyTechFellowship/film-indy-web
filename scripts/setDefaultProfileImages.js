const admin = require('firebase-admin')

// Download this from firebase
const serviceAccount = ('/home/kyle/Downloads/creds.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
})

const bucket = admin.storage().bucket()
const database = admin.database()
const update = bucket.getFiles({ prefix: 'images/defaults/profile_images/' }).then((results) => {
  const files = results[0]
  const fileUrlsPromise = Promise.all(files.map(file => file.getSignedUrl({ action: 'read', expires: '03-17-2999' }).then(url => url[0])))
  return fileUrlsPromise.then((fileUrls) => {
    fileUrls.shift()
    const userAccountRef = database.ref('userAccount')
    return userAccountRef.once('value').then((snapshot) => {
      const accounts = snapshot.val()
      const updatePromise = Promise.all(Object.keys(accounts).map((id) => {
        const account = accounts[id]
        if (!account.photoURL) {
          const randomPhoto = fileUrls[Math.floor(Math.random() * fileUrls.length)]
          return userAccountRef.child(id).update({
            photoURL: randomPhoto
          })
        }
        return Promise.resolve()
      }))
      return updatePromise
    })
  })
})
