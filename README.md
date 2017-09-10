## Film Indy 

### Local Dev - Getting Started

1. `npm install`
2. `npm start` -> should open a browser to locahost:3000

### Deploying to Firebase

1. `npm i -g firebase-tools` (Optional if you already have this installed)
3. `firebase login`(shouldn't need to do this if you have done this command recently)
4. `npm run build` -> build production assets in build directory
5. `firebase deploy`-> deploy app to [https://film-indy.firebaseapp.com/](https://film-indy.firebaseapp.com/)

