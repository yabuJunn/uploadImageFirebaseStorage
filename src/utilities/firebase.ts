import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, query, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";
import { crearProductos } from './crearTarjetas';

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

const storage = getStorage();

//Esta es la funcion que me sube el producto, primero sube la imagen del producto para que asi me de la url y luego si sube los datos
export const subirProducto = async (nombre: string, descripcion: string, precio: string, cantidad: string, imagen: File) => {
  console.log(imagen)
  const imageURL: string | void = await subirArchivo(imagen)
  await subirDatos(nombre, descripcion, precio, cantidad, imageURL)
}

export const traerProductos = async () => {
  const q = await query(collection(db, "productos"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q)
  const listaProductos: any[] = []
  querySnapshot.forEach((doc) => {
    listaProductos.push(doc.data())
  });
  return listaProductos
}

export const tiempoRealProductos = async (contenedor: HTMLElement) => {
  const q = await query(collection(db, "productos"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    crearProductos(contenedor)
  });
}

//Sube la imagen, importante ponerle await al uploadBytes ya que si no no me espera que se suba la imagen para hacer la request de la URL
export const subirArchivo = async (file: File) => {
  const storageRef = await ref(storage, `imagesProductos/${file.name}`);
  await uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
  return await pedirURL(`imagesProductos/${file.name}`)
}

//Me trae la URL de la imagen subida segun el nombre que le di, solo funciona si la imagen ya esta subida
export const pedirURL = async (path: string) => {
  const url = await getDownloadURL(ref(storage, `${path}`))
  console.log(url)
  return url
}

//Me sube los datos de cada producto, ya despues de que la imagen se haya subido
const subirDatos = async (nombre: string, descripcion: string, precio: string, cantidad: string, imagen: string | void) => {
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