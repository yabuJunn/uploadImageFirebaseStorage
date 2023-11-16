import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";




// TODO: Replace the following with your app's Firebase project configuration
export const firebaseConfig = {
  
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


