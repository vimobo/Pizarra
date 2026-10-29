// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, addDoc, getDoc, doc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./../firebaseConfig.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//cargamos la db de firestorm
const db = getFirestore(app);

//IMPRIMIR ELEMENTOS

async function imprimirNotaPorId(id) {
    let miDoc = await getDoc(doc(db, "notas", id));
    miDoc = miDoc.data();
    console.log
    document.getElementById("pizarra").innerHTML +=
        "<div class='nota' style='left:" + miDoc.x  + "px;top:"+ miDoc.y +"px;'><div class=title>" + miDoc.titulo + "</div>" +
        "<div class='notaContent'>" + miDoc.content + "</div></div>";
}

async function imprimirNotas() {
    const misDatos = await getDocs(collection(db, "notas"));
    const listaDatos = misDatos.docs;

    document.getElementById("pizarra").innerHTML = "";

    for (let doc of listaDatos) {
        imprimirNotaPorId(doc.id);
    }
}

async function imprimirAddButton() {
    console.log(document.getElementById("pizarra"));
    document.getElementById("pizarra").innerHTML += "<div id='addNotaButton'><p>+</p></div>";
}

async function iniciar() {
    await imprimirNotas();
    imprimirAddButton();
}

//CRUD

async function addNota(){
    const nota = {
        titulo: "",
        contenido: "",
        x: 500,
        y: 500,
    };

    await addDoc(collection(db, "notas", nota));
}


//MAIN

document.getElementById("addNotaButton").addEventListener("click", () => {
    addNota();
    console.log("hola")
});

iniciar();

/*
window.addNota()  {
    return;
}
    */