/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { decode as base64_decode } from 'base-64';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebase_decode = JSON.parse(base64_decode(import.meta.env.VITE_FIREBASE_CONFIG));

// Initialize Firebase
let app;
if (!firebase.apps.length) {
	app = firebase.initializeApp(firebase_decode);
} else {
	app = firebase.app();
}

const firebaseApp = app;

export default firebaseApp;
