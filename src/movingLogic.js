import { updateXY } from "./crudLogic.js";

export function addDragEventListener(elemento) {

    if (!elemento) return;

    elemento.addEventListener("pointerdown", (event) => {

        if (event.target.closest(".contenido, button, .notaMenu")) return;

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

            document.removeEventListener("pointermove", mover);
            document.removeEventListener("pointerup", soltar);

            // Guardar solamente al terminar de arrastrar
            await updateXY(elemento.id, xActual, yActual);
        }

        document.addEventListener("pointermove", mover);
        document.addEventListener("pointerup", soltar);

    });
}