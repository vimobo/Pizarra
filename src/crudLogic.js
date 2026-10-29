// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, deleteDoc, addDoc, getDoc, doc, getDocs, collection, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./../firebaseConfig.js"
import { addDragEventListener } from "./movingLogic.js"
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

    const pizarra = document.getElementById("pizarra");
   pizarra.insertAdjacentHTML(
    "beforeend",
    `<div class="nota" id="${id}"
          style="left: ${miDoc.x}vw; top: ${miDoc.y}vh;">
        <textarea class="titulo" placeholder="Título">${miDoc.titulo}</textarea>
        <button class="deleteButton">🗑</button>
        <textarea class="contenido" placeholder="Contenido">${miDoc.contenido}</textarea>
    </div>`
);

    await addDragEventListener(document.getElementById(id));
}

async function imprimirNotas() {
    const misDatos = await getDocs(collection(db, "notas"));
    const listaDatos = misDatos.docs;

    document.getElementById("pizarra").innerHTML = "";

    for (let doc of listaDatos) {
        await imprimirNotaPorId(doc.id);
    }
}
/*
async function imprimirAddButton() {
    console.log(document.getElementById("pizarra"));
    document.getElementById("pizarra").innerHTML += "<div id='addNotaButton'><p></p></div>";
}
*/


async function iniciarEventLisners() {
    document.getElementById("addNotaButton").addEventListener("click", () => {
        addNota();
        console.log("hola")
    });

    //delete
    document.getElementById("pizarra").addEventListener("click", (event) => {
        const target = event.target;
        if (target.tagName == "BUTTON") {
            deleteNota(target.closest(".nota").id)
        }
    })
}



async function iniciar() {
    await imprimirNotas();
    iniciarEventLisners();
}

//CRUD

async function addNota() {
    const nota = {
        titulo: "Título",
        contenido: "...",
        x: 42.5,
        y: 42.5
    };

    const docRef = await addDoc(collection(db, "notas"), nota);

    await imprimirNotaPorId(docRef.id);

    return docRef.id;
}

async function updateTitulo(id, string) {

    updateDoc(doc(db, "notas", id), {
        titulo: string
    });
}

async function updateContenido(id, string) {

    updateDoc(doc(db, "notas", id), {
        contenido: string
    });
}

export async function updateXY(id, x, y) {

    updateDoc(doc(db, "notas", id), {
        x: x,
        y: y
    });
}


async function deleteNota(id) {
    console.log("hola")
    await deleteDoc(doc(db, "notas", id));
    deleteImprimirNota(id);
}

function deleteImprimirNota(id) {
    document.getElementById(id).remove();
}

//MAIN
/*

*/
await iniciar();

/*
window.addNota()  {
    return;
}
    */