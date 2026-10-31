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

//colores disponibles
const colors = ["blue", "red", "green", "yellow"];

//IMPRIMIR ELEMENTOS

async function imprimirNotaPorId(id) {
    let miDoc = await getDoc(doc(db, "notas", id));
    miDoc = miDoc.data();

    const pizarra = document.getElementById("pizarra");
    pizarra.insertAdjacentHTML(
        "beforeend",
        `<div class="nota ${miDoc.color}" id="${id}"
          style="left: ${miDoc.x}vw; top: ${miDoc.y}vh;">
        <textarea class="titulo" placeholder="Título">${miDoc.titulo}</textarea>
        <button class="openMenuButton">></button>
        <div class="notaMenu" id="notaMenu" style="display: none;"> 
            <div class="notaMenuOption" id='notaMenuBlue'></div>
            <div class="notaMenuOption" id='notaMenuRed'></div>
            <div class="notaMenuOption" id='notaMenuGreen'></div>
            <div class="notaMenuOption" id='notaMenuYellow'></div>
            <div class="notaMenuOption" id='notaMenuBorrar'></div>
        </div>
        <textarea class="contenido" placeholder="...">${miDoc.contenido}</textarea>
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

// *
//Eventos para add , delete y abrir menu
// *

async function iniciarEventLisners() {
    document.getElementById("addNotaButton").addEventListener("click", () => {
        addNota();
    });

    //delete
    document.getElementById("pizarra").addEventListener("click", (event) => {
        const target = event.target;
        if (target.id == "notaMenuBorrar") {
            deleteNota(target.closest(".nota").id)
        }
    })

    //ajustar altura
    document.addEventListener("input", (event) => {

        if (event.target.matches(".nota textarea")) {
            ajustarAltura(event.target);
        }

    });

    //menu events
    document.getElementById("pizarra").addEventListener("click", (event) => {
        desplegarMenu(event);
        cambiarColor(event);
    })
    
    //update notas events
    document.getElementById("pizarra").addEventListener("change", (event) => {
        acutalizarTexto(event);
        
    })

}


//ajustar altura del text area

function ajustarAltura(textarea) {

    textarea.style.height = "auto";

    textarea.style.height = textarea.scrollHeight + "px";

}


//despliegue del menu
function desplegarMenu(event) {
    let target = event.target;

    if (target.matches(".nota .openMenuButton")) {
        let nota = target.closest(".nota");
        let menu = nota.querySelector(".notaMenu");

        if (menu.style.display == "none")
            menu.style.display = "flex";
        else
            menu.style.display = "none";
    }
}


//color  de la nota
function cambiarColor(event) {

    let target = event.target;

    if (target.matches(".nota .notaMenu .notaMenuOption")) {

        let nota = target.closest(".nota");
        let newColor = (target.id).replace("notaMenu", "").toLowerCase();

        if(nota.class != "nota " + newColor){
            nota.id
            updateColor(nota.id, newColor)
            nota.className = "nota " + newColor;
        }

    }
}

//cambiar texto
function acutalizarTexto(event) {
    let target = event.target;
    if(target.tagName == "TEXTAREA") {
        if(target.className == "titulo")
            updateTitulo(target.closest(".nota").id, target.value)
        else if(target.className == "contenido")
            updateContenido(target.closest(".nota").id, target.value)

    }

}


async function iniciar() {
    await imprimirNotas();
    iniciarEventLisners();
    await addDragEventListener(document.getElementById("addNotaButton"))
}

//CRUD

async function addNota() {
    const nota = {
        titulo: "Título",
        contenido: "...",
        x: 42.5,
        y: 42.5,
        color: colors[Math.floor(Math.random() * colors.length)]
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

async function updateColor(id, color) {

    updateDoc(doc(db, "notas", id), {
        color: color
    });
}

export async function updateXY(id, x, y) {

    updateDoc(doc(db, "notas", id), {
        x: x,
        y: y
    });
}


async function deleteNota(id) {
    await deleteDoc(doc(db, "notas", id));
    deleteImprimirNota(id);
}

function deleteImprimirNota(id) {
    document.getElementById(id).remove();
}

//MAIN


await iniciar();

