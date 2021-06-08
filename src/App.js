import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import signinwithgoogle from './signinwithgoogle.png';
import mainlogo from './mainlogo.png';
import signoutlogo from './singoutlogo.png';



import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';



firebase.initializeApp({

  // this is FIREBASE configuretion
  apiKey: "AIzaSyBGetL0Aq1r8Bg8ZA8v3ee7jtzQQMwmxpY",
  authDomain: "chat-app-ritik.firebaseapp.com",
  projectId: "chat-app-ritik",
  storageBucket: "chat-app-ritik.appspot.com",
  messagingSenderId: "68872178338",
  appId: "1:68872178338:web:7615ccdc051640f88a25fb",
  measurementId: "G-LV553VBNVX"
})




const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
      <img className="mainlogo" src={mainlogo} />
        <h1 className="Apptitle" >Chattt  Appp</h1>
       

        <SignOut />
      </header>

      <section>
        {/* BASE CONDITION */}
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      {/* <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button> */}
      <img className="Signinclass"  onClick={signInWithGoogle}  src={signinwithgoogle} />
      {/* <p className= "m"></p> */}
    </>
  )

}


function SignOut() {
  return auth.currentUser && (
    <img className="signoutlogo" onClick={() => auth.signOut()} src={signoutlogo} />

    // <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Say Something..." />

      <button type="submit" disabled={!formValue}> Send </button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;