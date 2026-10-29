import { updateXY } from "./crudLogic.js";

export function addDragEventListener(elemento, guardarPosicion) {
    if (!elemento) return;

    elemento.addEventListener("mousedown", (event) => {
        // No arrastrar al editar texto o pulsar el botón
        //if (event.target.matches("textarea, input, button")) return;

        const inicioX = event.clientX;
        const inicioY = event.clientY;

        const elementoX = parseFloat(elemento.style.left) || 0;
        const elementoY = parseFloat(elemento.style.top) || 0;

        let xActual = elementoX;
        let yActual = elementoY;

        function mover(event) {
            xActual = elementoX +
                ((event.clientX - inicioX) / window.innerWidth) * 100;

            yActual = elementoY +
                ((event.clientY - inicioY) / window.innerHeight) * 100;

            elemento.style.left = xActual + "vw";
            elemento.style.top = yActual + "vh";
        }

        async function soltar() {
            document.removeEventListener("mousemove", mover);
            document.removeEventListener("mouseup", soltar);

            await updateXY(elemento.id, xActual, yActual);
        }

        document.addEventListener("mousemove", mover);
        document.addEventListener("mouseup", soltar);
    });

    elemento.addEventListener("", (event) => {
        // No arrastrar al editar texto o pulsar el botón
        //if (event.target.matches("textarea, input, button")) return;

        const inicioX = event.clientX;
        const inicioY = event.clientY;

        const elementoX = parseFloat(elemento.style.left) || 0;
        const elementoY = parseFloat(elemento.style.top) || 0;

        let xActual = elementoX;
        let yActual = elementoY;

        function mover(event) {
            xActual = elementoX +
                ((event.clientX - inicioX) / window.innerWidth) * 100;

            yActual = elementoY +
                ((event.clientY - inicioY) / window.innerHeight) * 100;

            elemento.style.left = xActual + "vw";
            elemento.style.top = yActual + "vh";
        }

        async function soltar() {
            document.removeEventListener("mousemove", mover);
            document.removeEventListener("mouseup", soltar);

            await updateXY(elemento.id, xActual, yActual);
        }

        document.addEventListener("mousemove", mover);
        document.addEventListener("mouseup", soltar);
    });
}