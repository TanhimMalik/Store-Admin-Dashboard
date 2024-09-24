import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Search, Eye } from "lucide-react";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from "../../firebase/firebaseCrud";
import ClipLoader from "react-spinners/ClipLoader";

// Modal component for Add/Edit
const Modal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      category: "",
      price: "",
      stock: "",
      sales: "",
      imgUrl: "",
    }
  );
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true when submitting
    try {
      const updatedFormData = {
        ...formData,
        price: parseFloat(formData.price), // Convert price to a number
        stock: parseInt(formData.stock, 10), // Convert stock to a number
        sales: parseInt(formData.sales, 10), // Convert sales to a number
      };

      if (
        isNaN(updatedFormData.price) ||
        isNaN(updatedFormData.stock) ||
        isNaN(updatedFormData.sales)
      ) {
        alert("Please enter valid numbers for price, stock, and sales.");
        setLoading(false); // Stop loading if validation fails
        return;
      }

      if (imageFile) {
        // Upload the image to Firebase Storage and get the URL
        const imgUrl = await uploadImage(imageFile);
        updatedFormData.imgUrl = imgUrl;
      }

      await onSave(updatedFormData); // Pass updated data to save
      setLoading(false); // Stop loading after saving
      onClose(); // Close modal
    } catch (error) {
      console.error("Error submitting product:", error);
      setLoading(false); // Stop loading if there is an error
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-index-1">
      <div className="bg-gray-700 p-8 rounded-lg w-full max-w-md h-auto text-white overflow-y-auto">
        <h3 className="text-2xl font-semibold mb-6 text-center">
          {initialData ? "Edit Product" : "Add New Product"}
        </h3>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-500 bg-gray-800 text-white mb-4 p-2 w-full rounded-lg"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="border border-gray-500 bg-gray-800 text-white mb-4 p-2 w-full rounded-lg"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border border-gray-500 bg-gray-800 text-white mb-4 p-2 w-full rounded-lg"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          className="border border-gray-500 bg-gray-800 text-white mb-4 p-2 w-full rounded-lg"
        />
        <input
          type="number"
          name="sales"
          placeholder="Sales"
          value={formData.sales}
          onChange={handleChange}
          className="border border-gray-500 bg-gray-800 text-white mb-4 p-2 w-full rounded-lg"
        />
        <input
          type="file"
          name="img"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-gray-500 bg-gray-800 text-white mb-4 p-2 w-full rounded-lg"
        />

        {/* Display the loader if loading */}
        {loading && (
          <div className="flex justify-center mb-4">
            <ClipLoader color={"#ffffff"} loading={loading} size={35} />
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className={`bg-blue-500 text-white px-6 py-2 rounded-lg mr-4 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading} // Disable button when loading
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg"
            disabled={loading} // Disable cancel button while loading to prevent user actions
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Preview modal component for viewing product details
const PreviewModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div
        className="bg-gray-800 p-10 rounded-lg w-[70vw] h-[70vh] max-w-5xl max-h-4xl text-white overflow-y-auto shadow-2xl relative"
        style={{
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
        }}
      >
        <h3 className="text-3xl font-semibold mb-6 text-center text-indigo-300">
          Product Details
        </h3>
        <div className="flex flex-col items-center">
          {/* Large Image Display */}
          <img
            src={product.imgUrl || "default.jpg"}
            alt="Product img"
            className="w-full max-w-2xl h-auto object-contain mb-6"
          />

          {/* Product Info */}
          <div className="text-lg leading-relaxed w-full max-w-lg">
            <p className="mb-4">
              <strong className="text-indigo-300">Name:</strong>{" "}
              <span className="text-indigo-100">{product.name}</span>
            </p>
            <p className="mb-4">
              <strong className="text-indigo-300">Category:</strong>{" "}
              <span className="text-indigo-100">{product.category}</span>
            </p>
            <p className="mb-4">
              <strong className="text-indigo-300">Price:</strong>{" "}
              <span className="text-indigo-100">
                ${product.price.toFixed(2)}
              </span>
            </p>
            <p className="mb-4">
              <strong className="text-indigo-300">Stock:</strong>{" "}
              <span className="text-indigo-100">{product.stock}</span>
            </p>
            <p className="mb-4">
              <strong className="text-indigo-300">Sales:</strong>{" "}
              <span className="text-indigo-100">{product.sales}</span>
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-500 transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>

      {/* Scrollbar Styling */}
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #2d3748; /* Darker background */
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background-color: #8b5cf6; /* Matches the color scheme */
          border-radius: 10px;
          border: 2px solid #2d3748; /* Border to give the thumb a rounded, smaller look */
        }

        ::-webkit-scrollbar-thumb:hover {
          background-color: #a78bfa; /* Lighter color on hover */
        }
      `}</style>
    </div>
  );
};

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // Preview modal state
  const [editData, setEditData] = useState(null);
  const [previewData, setPreviewData] = useState(null); // Preview data
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for delete

  // Fetch data from Firestore
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts); // Initially set the filtered products as the complete list
      setLoading(false);
    };
    loadProducts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredProducts(
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      )
    );
  };

  const handleSaveProduct = async (newProduct) => {
    try {
      setLoading(true);
      if (editData && editData.id) {
        // Update product if it has an id (edit mode)
        await updateProduct(editData.id, newProduct);
        const updatedProducts = products.map((product) =>
          product.id === editData.id ? { ...editData, ...newProduct } : product
        );
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      } else {
        // Add new product (create mode)
        const docRef = await addProduct(newProduct); // Get reference to the newly added product
        const newProductWithId = { ...newProduct, id: docRef.id }; // Add Firestore-generated ID to the product
        const updatedProducts = [...products, newProductWithId];
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      }
      setEditData(null); // Reset edit data
      setLoading(false);
    } catch (error) {
      console.error("Error saving product:", error);
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditData(product);
    setIsModalOpen(true);
  };

  const handlePreviewProduct = (product) => {
    setPreviewData(product);
    setIsPreviewOpen(true);
  };

  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      if (deleteId) {
        await deleteProduct(deleteId); // Pass ID to deleteProduct
        const updatedProducts = products.filter(
          (product) => product.id !== deleteId
        );
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        setDeleteId(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      setLoading(false);
    }
  };

  return (
    <motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8">
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <h2 className="text-xl font-semibold text-gray-100">Product List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditData(null);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add New Product
        </button>
      </div>

      {/* Show loader during product fetching */}
      {loading && (
        <div className="flex justify-center mb-6">
          <ClipLoader color={"#ffffff"} loading={loading} size={35} />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredProducts.map((product) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                  <img
                    src={product.imgUrl || "default.jpg"}
                    alt="Product img"
                    className="w-10 h-10 rounded-full"
                  />
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  $
                  {typeof product.price === "number"
                    ? product.price.toFixed(2)
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.sales}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    onClick={() => handlePreviewProduct(product)}
                    className="text-green-400 hover:text-green-300 mr-2"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
          initialData={editData}
        />
      )}

      {isPreviewOpen && (
        <PreviewModal
          product={previewData}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-index-1">
          <div className="bg-gray-700 p-8 rounded-lg w-full max-w-md h-auto text-white overflow-y-auto">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center">
              <button
                onClick={handleDeleteProduct}
                className="bg-red-500 text-white px-6 py-2 rounded-lg mr-4"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductsTable;
