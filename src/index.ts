console.log("Funciona Typescript")
import "./utilities/firebase"
import { pedirURL, subirArchivo } from "./utilities/firebase"

class AppContainer extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }

    connectedCallback() {
        this.render()
    }

    render() {
        if (this.shadowRoot) {
            console.log("App Container")
            const inputFile = this.ownerDocument.createElement("input")
            inputFile.setAttribute("type", "file")
            this.shadowRoot.appendChild(inputFile)

            const button = this.ownerDocument.createElement("button")
            button.innerText = "Download Images"
            this.shadowRoot.appendChild(button)
            
            inputFile.addEventListener("change", () => {
                console.log("Archivo")
                const fileList = inputFile.files;
                console.log(fileList)
                subirArchivo(fileList![0])
            }, false)

            button.addEventListener("click", async () => {
                const url = await pedirURL("images")
                const image = this.ownerDocument.createElement("img")
                image.setAttribute("src", url)
                this.shadowRoot?.appendChild(image)
            })
        }

    }
}

customElements.define("app-container", AppContainer)