import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
  } from "firebase/firestore";
  import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
  } from "firebase/storage";
  import { db, storage } from "./firebaseConfig";
  
  // Fetch all products
  export const fetchProducts = async () => {
    const productsCol = collection(db, "products");
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return productList;
  };
  
  // Add a new product
  export const addProduct = async (product) => {
    const docRef = await addDoc(collection(db, "products"), product);
    return docRef; // Return the reference so you can get the generated ID
  };
  
  // Update an existing product
  export const updateProduct = async (id, product) => {
    if (!id) throw new Error("Product ID is required for update");
    const productDoc = doc(db, "products", id);
    await updateDoc(productDoc, product);
  };
  
  // Delete the associated image from Firebase Storage
  const deleteImageFromStorage = async (imageUrl) => {
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      try {
        await deleteObject(imageRef);
        console.log("Image deleted successfully from storage");
      } catch (error) {
        console.error("Error deleting image from storage:", error);
      }
    }
  };
  
  // Delete a product and its image
  export const deleteProduct = async (id) => {
    if (!id) throw new Error("Product ID is required for delete");
  
    // Fetch the product to get its imgUrl
    const productDoc = doc(db, "products", id);
    const productSnapshot = await getDoc(productDoc);
  
    if (!productSnapshot.exists()) {
      throw new Error("Product does not exist");
    }
  
    const productData = productSnapshot.data();
    const imageUrl = productData.imgUrl;
  
    // Delete the image from Firebase Storage if it exists
    await deleteImageFromStorage(imageUrl);
  
    // Delete the product document from Firestore
    await deleteDoc(productDoc);
  };
  
  // Upload product image to Firebase Storage
  export const uploadImage = async (file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress monitoring (optional)
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };
  