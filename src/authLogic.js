import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, deleteDoc, addDoc, getDoc, doc, getDocs, collection, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./../firebaseConfig.js"
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, validatePassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const provider = new GoogleAuthProvider();


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

document.getElementById("notRegistered").addEventListener("click", () => {
    document.getElementById("authDivLogin").style.display = "none";
    document.getElementById("authDivRegister").style.display = "flex";
});

document.getElementById("notLogged").addEventListener("click", () => {
    document.getElementById("authDivRegister").style.display = "none";
    document.getElementById("authDivLogin").style.display = "flex";
});


document.getElementById("submitRegister").addEventListener("click", () => register());

document.getElementById("submitLogin").addEventListener("click", () => login());

document.getElementById("signInGoogle").addEventListener("click", () => signInGoogle());
document.getElementById("registerGoogle").addEventListener("click", () => signInGoogle());




function login() {

    //console.log(document.getElementById("username").value);
    console.log(document.getElementById("password"));
    let mail = document.getElementById("username").value;
    let pass = document.getElementById("password").value;


    //signInWithEmailAndPassword(auth, mail, pass);

    signInWithEmailAndPassword(getAuth(), mail, pass)
        .then((userCredential) => {
            const user = userCredential.user;
            document.getElementById("authDivLogin").style.display = "none";
            document.getElementById("pizarra").style.display = "flex";
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error.message);
        });

}


async function register() {



    let mail = document.getElementById("usernameRegister").value;
    let pass = document.getElementById("passwordRegister").value;
    let passR = document.getElementById("passwordRegister2").value;

    console.log(mail)
    console.log(pass)
    console.log(passR)

    if (passR != pass) {

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

        document.getElementById("errorResponse").textContent = needsLowerCase;


    } else {

        createUserWithEmailAndPassword(auth, mail, pass)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                document.getElementById("authDivRegister").style.display = "none";
                document.getElementById("pizarra").style.display = "flex";

                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                document.getElementById("errorResponse").textContent = errorMessage;
            });
    }
}

async function signInGoogle() {


    signInWithPopup(getAuth(), provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...

            document.getElementById("authDivRegister").style.display = "none";
            document.getElementById("authDivLogin").style.display = "none";
            document.getElementById("pizarra").style.display = "flex";

        }).catch((error) => {
            // Handle Errors here.

            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}