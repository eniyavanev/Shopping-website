import EmptyProfile from  "../../assets/Images/EmptyProfile.jpg"

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

 const statusColors = {
   Delivered: "bg-green-100 text-green-800",
   Processing: "bg-yellow-100 text-yellow-800",
   Cancelled: "bg-red-100 text-red-800",
 };

export {EmptyProfile, categories, InputField, statusColors};