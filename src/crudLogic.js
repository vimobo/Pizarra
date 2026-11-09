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
        <textarea class="titulo" placeholder="Título" readonly>${miDoc.titulo}</textarea>
        <button class="openMenuButton">☰</button>
        <div class="notaMenu" id="notaMenu" style="display: none;"> 
            <div class="notaMenuOption" id='notaMenuBlue'></div>
            <div class="notaMenuOption" id='notaMenuRed'></div>
            <div class="notaMenuOption" id='notaMenuGreen'></div>
            <div class="notaMenuOption" id='notaMenuYellow'></div>
            <div class="notaMenuOption" id='notaMenuBorrar'></div>
        </div>
        <textarea class="contenido" placeholder="..." readonly>${miDoc.contenido}</textarea>
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

const addNotaButton = document.getElementById("addNotaButton");

const infoInicial = document.getElementById("infoInicial");

async function iniciarEventLisners() {

    let shortClick = false;

    addNotaButton.addEventListener("pointerdown", () => {
        shortClick = true;
        setTimeout(() => shortClick = false, 300);
    });

    addNotaButton.addEventListener("pointerup", () => {
        console.log(shortClick)
        console.log()
        if (shortClick)
            addNota();
    });

    //delete
    // DELETE

    let notaSeleccionada = null;

    const confirmDelete = document.getElementById("confirmDelete");

    function abrirConfirmacion(nota) {
        notaSeleccionada = nota;

        confirmDelete.style.display = "flex";

        confirmDelete.addEventListener("pointerdown", handleConfirmDelete);
    }

    function handleConfirmDelete(e) {

        if (e.target.id == "confirmDeleteYes") {

            let nota = notaSeleccionada;

            nota.dataset.eliminada = "true";

            deleteNota(nota.id);

        }
        else if (e.target.id == "confirmDeleteNo") {

            console.log("Eliminación cancelada");

        }

        if (e.target.id == "confirmDeleteYes" || e.target.id == "confirmDeleteNo") {

            confirmDelete.style.display = "none";

            confirmDelete.removeEventListener("pointerdown", handleConfirmDelete);

            notaSeleccionada = null;
        }
    }

    document.getElementById("pizarra").addEventListener("pointerdown", (event) => {

        if (event.target.id == "notaMenuBorrar") {

            event.preventDefault();

            abrirConfirmacion(event.target.closest(".nota"));
        }

    });

    //ajustar altura
    document.addEventListener("input", (event) => {

        if (event.target.matches(".nota textarea")) {
            ajustarAltura(event.target);
        }

    });

    //menu events
    document.getElementById("pizarra").addEventListener("pointerup", (event) => {

        if (!event.target.closest(".nota")) return;

        desplegarMenu(event);
        cambiarColor(event);

    })

    //update notas events
    document.getElementById("pizarra").addEventListener("change", (event) => {
        event.target.removeAttribute("readonly");
        acutalizarTexto(event);
        event.target.addAttribute("readonly");

    })

    //update movil, doble toque

    const pizarra = document.getElementById("pizarra");

    let ultimoToque = null;

    pizarra.addEventListener("pointerup", (event) => {

        const textarea = event.target.closest(".nota textarea");

        if (!textarea || !textarea.readOnly) return;

        if (event.pointerType === "mouse") {
            textarea.readOnly = false;
            textarea.focus();
            return;
        }

        if (event.pointerType === "touch") {

            const ahora = Date.now();

            if (
                ultimoToque &&
                ultimoToque.textarea === textarea &&
                ahora - ultimoToque.tiempo < 350
            ) {
                textarea.readOnly = false;
                textarea.focus();
                ultimoToque = null;

            } else {
                ultimoToque = {
                    textarea: textarea,
                    tiempo: ahora
                };
            }
        }
    });

    // Volver a bloquear al salir
    pizarra.addEventListener("focusout", (event) => {

        if (event.target.matches(".nota textarea")) {
            event.target.readOnly = true;
        }

    });

    //delete 

    //Info inicial
    infoInicial.addEventListener("click", (event) => {
        const target = event.target;
        console.log(target)
        if (target.id == "okButton")
            target.closest("#infoInicial").style = "display: none;";

        else if (target.id == "notShowAgainButton") {

            setCookie("infoInicialCerrado", "true", 720);
            target.closest("#infoInicial").style = "display: none;";
        }

    }, { once: true });

    // swipe delete

    let startX = 0;
    let startY = 0;
    let notaSwipe = null;

    pizarra.addEventListener("pointerdown", (event) => {

        if (event.pointerType !== "touch") return;

        notaSwipe = event.target.closest(".nota");

        if (!notaSwipe) return;

        startX = event.clientX;
        startY = event.clientY;

    });

    pizarra.addEventListener("pointerup", (event) => {

        if (!notaSwipe) return;

        let endX = event.clientX;
        let endY = event.clientY;

        let diferenciaX = endX - startX;
        let diferenciaY = endY - startY;

        if (
            Math.abs(diferenciaX) > 80 &&
            Math.abs(diferenciaX) > Math.abs(diferenciaY)
        ) {
            if (notaSwipe.dataset.eliminada != "true") {
                abrirConfirmacion(notaSwipe);
            }
        }

        notaSwipe = null;

    });

    pizarra.addEventListener("pointercancel", () => {
        notaSwipe = null;
    });

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

    if (target.closest(".nota").dataset.eliminada == "true") return;


    if (target.matches(".nota .notaMenu .notaMenuOption")) {

        let nota = target.closest(".nota");
        let newColor = (target.id).replace("notaMenu", "").toLowerCase();

        if (!colors.includes(newColor)) return;

        if (nota.class != "nota " + newColor) {
            nota.id
            updateColor(nota.id, newColor)
            nota.className = "nota " + newColor;
        }

    }
}

//cambiar texto
async function acutalizarTexto(event) {
    let target = event.target;

    if (target.closest(".nota").dataset.eliminada == "true") return;

    if (target.tagName == "TEXTAREA") {
        if (target.className == "titulo")
            await updateTitulo(target.closest(".nota").id, target.value)
        else if (target.className == "contenido")
            await updateContenido(target.closest(".nota").id, target.value)

    }

}

//crear cookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


async function iniciar() {

    if (document.cookie.includes("infoInicialCerrado=true"))
        document.getElementById("infoInicial").style.display = "none";
    else
        document.getElementById("infoInicial").style.position = "absolute";

    await imprimirNotas();
    await iniciarEventLisners();
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

    await updateDoc(doc(db, "notas", id), {
        titulo: string
    });
}

async function updateContenido(id, string) {

    await updateDoc(doc(db, "notas", id), {
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
    const nota = document.getElementById(id);

    if (!nota) return;

    nota.classList.add("eliminando");

    nota.addEventListener("animationend", async () => {
        await deleteDoc(doc(db, "notas", id));
        nota.remove();
    }, { once: true });
}

//MAIN


await iniciar();

