import * as admin from 'firebase-admin';
import { getEnvironmentVariable } from './environment';
import { getFirestore } from 'firebase-admin/firestore';

export function initializeFirebase(): admin.app.App {
  let app: admin.app.App;
    // In production (on Google Cloud), use the default credentials
    app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
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