import React from 'react';
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold">Travel Links</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="hover:underline">Home</a></li>
                <li><a href="#" className="hover:underline">Events</a></li>
                <li><a href="#" className="hover:underline">Packagse</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="hover:underline">FAQ</a></li>
                <li><a href="#" className="hover:underline">Help Center</a></li>
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold">Contact Us</h3>
              <p className="mt-4">123 Polonnaruwa road , Habarana</p>
              <p className="mt-2">Email: info@travellanka.com</p>
              <p className="mt-2">Phone: +9411 525 0302</p>
            </div>
          </div>
        </div>
      </footer>
  );
}

export default Footer;
