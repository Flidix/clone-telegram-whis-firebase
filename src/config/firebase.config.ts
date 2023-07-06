import * as dotenv from 'dotenv';
dotenv.config();

export const FirebaseConfig = {
	apiKey: process.env.API_KEY,
	authDomain: process.env.AUTH_DOMAIN,
	databaseURL: process.env.DATABASE_URL,
	projectId: process.env.PROJECT_ID,
	storageBucket: process.env.STORAGE_BUCKET,
	messagingSenderId: process.env.MESSAGING_SENDER_ID,
	appId: process.env.APP_ID,
	measurementId: process.env.MEASUREMENT_ID,
};




// export const FarebaseConfig = {
// 	apiKey: process.env.FIREBASE_API_KEY,
// 	authDomain: "telegram-3a780.firebaseapp.com",
// 	projectId: "telegram-3a780",
// 	storageBucket: "telegram-3a780.appspot.com",
// 	messagingSenderId: "419917998872",
// 	appId: "1:419917998872:web:651398e4de736a99148c6d",
// 	measurementId: "G-0P641J4SKY",
// 	databaseURL: "https://telegram-3a780-default-rtdb.europe-west1.firebasedatabase.app"
// }