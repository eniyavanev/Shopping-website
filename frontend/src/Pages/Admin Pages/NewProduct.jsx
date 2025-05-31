import React, { useState } from "react";
import usePageTitle from "../../Components/customHooks/PageTitle";
import { useCreateProductMutation } from "../Redux/Slices/apiProductSlice";
import Loader from "../../Components/Loader/Loader";
import toast, { Toaster } from "react-hot-toast";

const categories = [
  "Electronics",
  "MobilePhones",
  "Cameras",
  "Laptops",
  "Accessories",
  "Headphones",
  "Food",
  "Books",
  "Clothes/Shoes",
  "Beauty/Health",
  "Sports",
  "Outdoor",
  "HomeAppliances",
];

const NewProduct = () => {
  usePageTitle("Add New Product");
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    seller: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      const imageFiles = files ? Array.from(files) : [];

      if (imageFiles.length === 0) {
        toast.error("No images selected.");
        return;
      }

      setForm((prevForm) => ({
        ...prevForm,
        images: imageFiles,
      }));

      // Clear old preview URLs
      setImagePreviews([]);

      // Generate new previews
      const previewUrls = imageFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previewUrls);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // FormData to send image files
      const formData = new FormData();
      for (let key in form) {
        if (key === "images") {
          form.images.forEach((image) => formData.append("images", image));
        } else {
          formData.append(key, form[key]);
        }
      }

      await createProduct(formData).unwrap();
      toast.success("🎉 Product created successfully!");
      setForm({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        seller: "",
        images: [],
      });
      setImagePreviews([]);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create product.");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
        🆕 Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <InputField
          label="Product Name"
          name="name"
          type="text"
          value={form.name}
          handleChange={handleChange}
          placeholder="Enter product name"
        />

        {/* Price */}
        <InputField
          label="Price (₹)"
          name="price"
          type="number"
          value={form.price}
          handleChange={handleChange}
          placeholder="Enter price"
        />

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter product description"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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

        {/* Stock */}
        <InputField
          label="Stock"
          name="stock"
          type="number"
          value={form.stock}
          handleChange={handleChange}
          placeholder="Enter available stock"
        />

        {/* Seller */}
        <InputField
          label="Seller"
          name="seller"
          type="text"
          value={form.seller}
          handleChange={handleChange}
          placeholder="Enter seller name"
        />

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Upload Product Images
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="w-full file:mr-4 file:py-2 file:px-4 file:border file:rounded file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {imagePreviews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`preview-${index}`}
                className="w-full h-32 object-cover rounded border"
              />
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-300"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({
  label,
  name,
  type,
  value,
  handleChange,
  placeholder,
}) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder={placeholder}
      required
    />
  </div>
);

export default NewProduct;
