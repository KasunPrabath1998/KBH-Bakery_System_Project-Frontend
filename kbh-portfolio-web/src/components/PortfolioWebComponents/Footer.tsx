import { Link } from "react-scroll";
import facebookIcon from "../../assets/FooterImages/facebook.png";
import whatsappIcon from "../../assets/FooterImages/whatsapp.png";
import instagramIcon from "../../assets/FooterImages/instagram.png";
import logo from "../../assets/FooterImages/logo.png";
import { useNavigate } from "react-router-dom";


export const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer id="contact" className="bg-black text-white py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-6 space-y-8 md:space-y-0">
        {/* Logo & Social Media */}
        <div className="flex flex-col items-start">
          <Link to="home" smooth duration={500} className="cursor-pointer">
            <img src={logo} alt="KBH Logo" className="w-24 mb-4" />
          </Link>
          <p className="text-orange-500 text-lg font-semibold">Follow us</p>
          <div className="flex space-x-4 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={facebookIcon} alt="Facebook" className="w-8 h-8" />
            </a>
            <a href="https://wa.me/+94769779610" target="_blank" rel="noopener noreferrer">
              <img src={whatsappIcon} alt="WhatsApp" className="w-8 h-8" />
            </a>
            {/* <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon} alt="Instagram" className="w-8 h-8" />
            </a> */}
          </div>
        </div>

        {/* About Us */}
        <div>
          <h3 className="text-orange-500 text-xl font-semibold space-y-4">Contact Us</h3>
          <p className="text-sm">(+94) 7697-79610</p>
          <p className="text-sm">(+94) 7050-71971</p>
          <p className="text-sm">newkanduratabakehouse@gmail.com</p>
          <p className="text-sm">Miriswatta Junction, Horana Road, piliyandala</p>
        </div>

        {/* Explore & Visit Us */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-orange-500 text-xl font-semibold">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="home" smooth duration={500} className="cursor-pointer hover:text-orange-400">Home</Link>
              </li>
              <li>
                <Link to="delights" smooth duration={500} className="cursor-pointer hover:text-orange-400">Featuring Categories</Link>
              </li>
              <li>
                <Link to="aboutus" smooth duration={500} className="cursor-pointer hover:text-orange-400">About Us</Link>
              </li>
              <li>
                <Link to="featuredtreats" smooth duration={500} className="cursor-pointer hover:text-orange-400">Featured Treats</Link>
              </li>
              
            </ul>
          </div>
          <div>
            <h3 className="text-orange-500 text-lg font-semibold">Visit Us</h3>
            <iframe
              title="KBH Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4661.046156456598!2d79.97816475382356!3d6.784194124919762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae24f52751a6dc3%3A0x9065b90d850c5dd7!2sK.B.H%20Bake%20House!5e0!3m2!1sen!2slk!4v1744037967293!5m2!1sen!2slk"
              width="100%"
              height="150"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Copyright */}
      {/* <div className="text-center text-gray-400 text-sm mt-6">
        <p>&copy; 2025 KBH. All rights reserved</p>
        <p className="text-xs text-gray-500">Developed by i211 Solutions (PVT) LTD</p>
      </div> */}

      <div
        className="text-center text-gray-400 text-sm mt-6 cursor-pointer"
        onClick={() => navigate("/login")}
      >
        <p>&copy; 2025 KBH. All rights reserved</p>
        <p className="text-xs text-gray-500">Developed by i211 Solutions (PVT) LTD</p>
      </div>
    </footer>
  );
};

