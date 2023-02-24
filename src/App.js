import Timer from "./Timer";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaREdqvXD6j9CWZVv4-25t6im_8z-1SV8",
  authDomain: "muddescapes-timer.firebaseapp.com",
  projectId: "muddescapes-timer",
  storageBucket: "muddescapes-timer.appspot.com",
  messagingSenderId: "6923917482",
  appId: "1:6923917482:web:8a9c364e7f20feb8a858d3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  return <Timer db={db} />;
}

export default App;
