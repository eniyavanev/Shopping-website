import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800  shadow-inner">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Brand Info */}
        <div>
          <h2 className="text-xl font-bold text-blue-700">Eniyavan Cart</h2>
          <p className="text-sm mt-2">
            Your one-stop shop for quality products. We deliver happiness to your door.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-700">Home</Link></li>
            <li><Link to="/products" className="hover:text-blue-700">Products</Link></li>
            <li><Link to="/cart" className="hover:text-blue-700">Cart</Link></li>
            <li><Link to="/login" className="hover:text-blue-700">Login</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-blue-700 hover:text-blue-800">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-blue-700 hover:text-blue-800">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-blue-700 hover:text-blue-800">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white text-center py-4 border-t border-gray-300 text-sm">
        © {new Date().getFullYear()} Eniyavan Cart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
