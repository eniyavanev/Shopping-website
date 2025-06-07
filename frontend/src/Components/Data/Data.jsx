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
   Shipped: "bg-blue-100 text-blue-800",
   Pending: "bg-gray-100 text-gray-800",
   
   
 };
 const paymentStatusColors = {
  succeeded: "bg-green-200 text-green-800",
  pending: "bg-yellow-200 text-yellow-800",
  failed: "bg-red-200 text-red-800",
  cancelled: "bg-gray-200 text-gray-800",
};


export {EmptyProfile, categories, InputField, statusColors,paymentStatusColors};