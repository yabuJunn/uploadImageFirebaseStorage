import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAF7bl-bhualC-oJKaZSn_onN7cd19QTrU",
  authDomain: "prueba-primer-firebase.firebaseapp.com",
  projectId: "prueba-primer-firebase",
  storageBucket: "gs://prueba-primer-firebase.appspot.com",
  messagingSenderId: "591718005257",
  appId: "1:591718005257:web:547501b6b6fcace38d56d8"
};

const app = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

// Create a storage reference from our storage service
const storageRef = ref(storage, 'images/prueba.jpg');

// Create a reference to 'mountains.jpg'
const pruebaRef = ref(storage, 'prueba.jpg');

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// // Data URL string
// const message4 = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
// uploadString(storageRef, message4, 'data_url').then((snapshot) => {
//   console.log('Uploaded a data_url string!');
// });

// // 'file' comes from the Blob or File API
// uploadBytes(storageRef, file).then((snapshot) => {
//     console.log('Uploaded a blob or file!');
//   });

export const subirArchivo = (file: File) => {
  //   if (file.type === "mp4") {
  //     const storageRef = ref(storage, `mp4/${file.name}`);
  //     uploadBytes(storageRef, file).then((snapshot) => {
  //       console.log('Uploaded a blob or file!');
  //     });
  //   }
  const storageRef = ref(storage, `images/${file.name}`);
  uploadBytes(storageRef, file).then((snapshot) => {
    console.log(snapshot)
    storageURLtoFirebase(snapshot.metadata.name, snapshot.metadata.fullPath)
    console.log('Uploaded a blob or file!');
  });
}

export const pedirURL = async (path: string) => {
  return await getDownloadURL(ref(storage, `${path}`))
}

const storageURLtoFirebase = async (name: string, path: string) => {
  await setDoc(doc(db, "images", name), {
    name: name,
    fullPath: path
  });
  console.log("Se subio")
}

export const subirProducto = async (nombre: string, descripcion: string, precio: string, cantidad: string, imagen: string) => {
  await setDoc(doc(db, "productos", nombre), {
    name: nombre,
    descripcion: descripcion,
    precio: precio,
    cantidad: cantidad,
    imagen: imagen
  });
  console.log("Se subio el producto")
}

export const traerProductos = async () => {
  const querySnapshot = await getDocs(collection(db, "productos"));
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