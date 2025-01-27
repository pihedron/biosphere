import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, type UserInfo } from 'firebase/auth'
import { collection, doc, getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { writable } from 'svelte/store'

const firebaseConfig = {
  apiKey: "AIzaSyBf2-fLBrlGLsAsIDLaQC_RU8Khbyxdj0o",
  authDomain: "biosphere-4ac71.firebaseapp.com",
  projectId: "biosphere-4ac71",
  storageBucket: "biosphere-4ac71.firebasestorage.app",
  messagingSenderId: "563193112447",
  appId: "1:563193112447:web:74286fad4de2614dc79c4a",
  measurementId: "G-619XTPF52H"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

const store = writable<{
  verified: boolean
  user?: UserInfo
}>({
  verified: false
})

auth.onAuthStateChanged(user => {
  if (user === null) {
    console.log(`Logged out`)
    store.set({
      verified: false,
    })
  } else {
    console.log(`Logged in as ${user.displayName}`)
    store.set({
      verified: true,
      user
    })
  }
})

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  db,
  store,
  storage,
}