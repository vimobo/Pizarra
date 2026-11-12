import { iniciar } from "./crudLogic.js";
import { setUserId } from "./crudLogic.js";
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


const auth = getAuth(app);


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

    signInWithEmailAndPassword(auth, mail, pass)
        .then((userCredential) => {
            const user = userCredential.user;
            document.getElementById("authDivLogin").style.display = "none";
            setUserId(user.uid);
            mostrarPizarra(user);
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            document.getElementById("loginErrors").textContent = errorMessage;
        });

}


async function register() {



    let mail = document.getElementById("usernameRegister").value;
    let pass = document.getElementById("passwordRegister").value;
    let passR = document.getElementById("passwordRegister2").value;


    const status = await validatePassword(getAuth(), pass);
    if (!status.isValid) {
        // Password could not be validated. Use the status to show what
        // requirements are met and which are missing.

        // If a criterion is undefined, it is not required by policy. If the
        // criterion is defined but false, it is required but not fulfilled by
        // the given password. For example:
        const needsLowerCase = status.containsLowercaseLetter !== true;

        document.getElementById("registerErrors").textContent = needsLowerCase;


    } else {

        createUserWithEmailAndPassword(auth, mail, pass)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                document.getElementById("authDivRegister").style.display = "none";
                setUserId(user.uid);
                mostrarPizarra(user);

                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(document.getElementById("registerErrors"));
                document.getElementById("registerErrors").textContent = errorMessage;
            });

    }
}

async function signInGoogle() {


    signInWithPopup(auth, provider)
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
            
            setUserId(user.uid);
            mostrarPizarra(user);

        }).catch((error) => {
            // Handle Errors here.

            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}

function mostrarPizarra(user) {
    document.getElementById("helloWorld").textContent = "Hola " + (user.displayName == null ? user.email : user.displayName);
    document.getElementById("helloWorld").classList.add("apear");

    const img = document.createElement("img");

    console.log(user.photoURL);
    img.src = user.photoURL != null ?
        user.photoURL :
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

    img.alt = "Foto de perfil";
    img.draggable = false;

    document.getElementById("profilePicMenu").appendChild(img);

    document.getElementById("pizarra").style.display = "flex";
    document.getElementById("addNotaButton").style.display = "flex";
    document.getElementById("profilePicMenu").style.display = "flex";

    if (document.cookie.includes("infoInicialCerrado=true"))
        document.getElementById("infoInicial").style.display = "none";
    else
        document.getElementById("infoInicial").style.display = "flex";


    iniciar();

}