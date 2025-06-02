import React, { useState, useEffect } from "react";
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "../Redux/Slices/apiProductSlice";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { categories, InputField } from "../../Components/Data/Data";
import { TrashIcon, XCircleIcon } from "lucide-react";

const UpdateProduct = () => {
  const { id: productId } = useParams();

  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const { data } = useGetSingleProductQuery(productId);
  const product = data?.product;

  // Form fields (except images)
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    seller: "",
  });

  // old images: array of { url or id, some unique identifier }
  const [oldImages, setOldImages] = useState([]);

  // new uploaded images: File objects
  const [newImages, setNewImages] = useState([]);

  // For previews of new images
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // When oldImages or newImages changes, generate previews for old and new separately
  // oldImages previews come from their URLs (strings)
  // newImagePreviews come from File objects with URL.createObjectURL

  useEffect(() => {
    if (product) {
      setForm({
        name: product?.name || "",
        price: product?.price || "",
        description: product?.description || "",
        category: product?.category || "",
        stock: product?.stock === 0 ? 0 : product?.stock || "",
        seller: product?.seller || "",
      });

      // Initialize oldImages with unique id + URL
      // Assuming product.images is array of objects with .image (url) and maybe ._id or something unique
      const oldImgs =
        product.images?.map((img, index) => ({
          id: img._id || index, // Use backend id or fallback index
          url: img.image,
        })) || [];
      setOldImages(oldImgs);

      setNewImages([]);
      setNewImagePreviews([]);
    }
  }, [product]);

  // Handle input changes for normal inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // When user selects new images to upload
  const handleNewImagesChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    if (files.length === 0) return;

    // Append new files to existing newImages
    setNewImages((prev) => [...prev, ...files]);

    // Create previews for new files
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Delete an old image by id
  const handleDeleteOldImage = (id) => {
    setOldImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Delete a new image by index
  const handleDeleteNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form handler
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Append text fields
      for (const key in form) {
        formData.append(key, form[key]);
      }

      // Append oldImages as JSON stringified array of their IDs or URLs
      // Let's send array of old image IDs if available, else URLs
      // Your backend needs to know which old images to keep
      const oldImageIds = oldImages.map((img) => img.id);
      formData.append("oldImages", JSON.stringify(oldImageIds));

      // Append new images (files)
      newImages.forEach((file) => formData.append("images", file));

      const result = await updateProduct({ productId, formData }).unwrap();

      if (result) {
        toast.success(result?.message || "Product updated successfully!");
      }

      // Reset form and images
      setForm({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        seller: "",
      });
      setOldImages([]);
      setNewImages([]);
      setNewImagePreviews([]);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-4xl font-bold text-center text-indigo-600 mb-8">
        Update Product
      </h2>

      <form onSubmit={handleUpdateProduct} className="space-y-6">
        <InputField
          label="Product Name"
          name="name"
          type="text"
          value={form.name}
          handleChange={handleChange}
          placeholder="Enter product name"
        />

        <InputField
          label="Price (₹)"
          name="price"
          type="number"
          value={form.price}
          handleChange={handleChange}
          placeholder="Enter product price"
        />

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter product description"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          >
            <option value="" disabled>
              -- Select Category --
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <InputField
          label="Stock"
          name="stock"
          type="number"
          value={form.stock}
          handleChange={handleChange}
          placeholder="Enter stock count"
        />

        <InputField
          label="Seller"
          name="seller"
          type="text"
          value={form.seller}
          handleChange={handleChange}
          placeholder="Enter seller name"
        />

        {/* Upload new images */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Upload New Product Images
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleNewImagesChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:rounded-md file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
          />
        </div>

        {/* Show previews of OLD images */}
        {oldImages.length > 0 && (
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Existing Images
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {oldImages.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt="old preview"
                    className="w-full h-32 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteOldImage(img.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    title="Delete this image"
                  >
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show previews of NEW images */}
        {newImagePreviews.length > 0 && (
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              New Images to be added
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {newImagePreviews.map((src, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={src}
                    alt="new preview"
                    className="w-full h-32 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteNewImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    title="Delete this new image"
                  >
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
