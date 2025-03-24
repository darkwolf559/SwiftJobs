
import admin from "firebase-admin";
import serviceAccount from "../config/firebaseServiceKey.json";


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export default admin;