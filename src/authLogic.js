import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, deleteDoc, addDoc, getDoc, doc, getDocs, collection, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./../firebaseConfig.js"
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, validatePassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//cargamos la db de firestorm
const db = getFirestore(app);


const auth = getAuth();











signOut(auth).then(() => {
    // Sign-out successful.
}).catch((error) => {
    // An error happened.
});


function login() {

    //console.log(document.getElementById("username").value);
    console.log(document.getElementById("password"));
    let mail = document.getElementById("username").value;
    let pass = document.getElementById("password").value;


    //signInWithEmailAndPassword(auth, mail, pass);

    signInWithEmailAndPassword(auth, mail, pass)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });

    


    }

    document.getElementById("submitLogin").addEventListener("click", () => register());


    async function register() {



        let mail = document.getElementById("username").value;
        let pass = document.getElementById("password").value;
        let passR = document.getElementById("password1").value;

        console.log(mail)
        console.log(pass)
        console.log(passR)

        if(passR != pass){

            return
        }

        const status = await validatePassword(getAuth(), pass);
        if (!status.isValid) {
            // Password could not be validated. Use the status to show what
            // requirements are met and which are missing.

            // If a criterion is undefined, it is not required by policy. If the
            // criterion is defined but false, it is required but not fulfilled by
            // the given password. For example:
            const needsLowerCase = status.containsLowercaseLetter !== true;

        } else {

            createUserWithEmailAndPassword(auth, mail, pass)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // ..
                });
        }
    }
