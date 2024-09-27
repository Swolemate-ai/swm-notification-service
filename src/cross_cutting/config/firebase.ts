import * as admin from 'firebase-admin';
import { getEnvironmentVariable } from './environment';
import { getFirestore } from 'firebase-admin/firestore';

export function initializeFirebase(): admin.app.App {
  let app: admin.app.App;

  const databaseURL = getEnvironmentVariable('FIREBASE_DATABASE_URL');
  // const db = getFirestore("swm-notifications");

  // if (process.env.NODE_ENV === 'production') {
  //   // In production (on Google Cloud), use the default credentials
  //   app = admin.initializeApp({
  //     credential: admin.credential.applicationDefault(),
  //     databaseURL: databaseURL
  //   });
  // } else {
  //   // In development or other environments, use a service account key file
  //   const serviceAccount = JSON.parse(getEnvironmentVariable('FIREBASE_SERVICE_ACCOUNT'));
  //   app = admin.initializeApp({
  //     credential: admin.credential.cert(serviceAccount),
  //     databaseURL: databaseURL
  //   });
  // }

    // In production (on Google Cloud), use the default credentials
    app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: databaseURL
    });

  return app;
}


export class FirebaseApp {
  private app: admin.app.App;

  constructor() {
    this.app = initializeFirebase();
  }

  public getApp(): admin.app.App {
    return this.app;
  }

  public getFirestore(): FirebaseFirestore.Firestore {
    return this.app.firestore();
  }
}