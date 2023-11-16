import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, onSnapshot, orderBy } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyAF7bl-bhualC-oJKaZSn_onN7cd19QTrU",
  authDomain: "prueba-primer-firebase.firebaseapp.com",
  projectId: "prueba-primer-firebase",
  storageBucket: "gs://prueba-primer-firebase.appspot.com",
  messagingSenderId: "591718005257",
  appId: "1:591718005257:web:547501b6b6fcace38d56d8"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const subirProducto = async (nombre: string, descripcion: string, precio: string, cantidad: string, imagen: string) => {
  await setDoc(doc(db, "productos", nombre), {
    name: nombre,
    descripcion: descripcion,
    precio: precio,
    cantidad: cantidad,
    imagen: imagen,
    date: new Date()
  });
  console.log("Se subio el producto")
}

export const traerProductos = async () => {
  const q = query(collection(db, "productos"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q)
  const listaProductos: any[] = []
  querySnapshot.forEach((doc) => {
    console.log(doc.data())
    listaProductos.push(doc.data())
  });
  return listaProductos
}

const crearProductos = async (contenedorProductos: HTMLElement) => {
  const listaProductos = await traerProductos()
  contenedorProductos.innerHTML = ""
  listaProductos.forEach((producto) => {
    const contenedorProductoSolo = document.createElement("div")
    contenedorProductoSolo.classList.add("contenedorProductoSolo")
    contenedorProductos.appendChild(contenedorProductoSolo)

    const imagenProducto = document.createElement("img")
    imagenProducto.src = producto.imagen
    contenedorProductoSolo.appendChild(imagenProducto)

    const tituloProducto = document.createElement("h1")
    tituloProducto.innerText = producto.name
    contenedorProductoSolo.appendChild(tituloProducto)

    const precioProducto = document.createElement("h2")
    precioProducto.innerText = producto.precio
    contenedorProductoSolo.appendChild(precioProducto)

    const cantidadProducto = document.createElement("h3")
    cantidadProducto.innerText = producto.cantidad
    contenedorProductoSolo.appendChild(cantidadProducto)

    const descripcionProducto = document.createElement("p")
    descripcionProducto.innerText = producto.descripcion
    contenedorProductoSolo.appendChild(descripcionProducto)
  })
}

export const tiempoRealProductos = async (contenedor: HTMLElement) => {
  const q = await query(collection(db, "productos"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    crearProductos(contenedor)
  });
}