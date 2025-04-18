import logo from "../../assets/HeaderImages/logo.png";
import { Link } from 'react-scroll';


export const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full bg-black bg-opacity-0 text-white py-4 z-10 ">
      <div className="container mx-auto flex items-center px-6 relative ml-4 ">

        <img src={logo} alt="KBH Logo" className="h-48 pr-12 " />


        <nav className="flex items-center space-x-4 mt-[60px] self-start">
          <ul className="hidden md:flex space-x-8 text-lg">
            <li className="transition-transform transform duration-300 hover:scale-110">
              <Link to="home" smooth={true} duration={500} className="cursor-pointer hover:text-orange-400">Home</Link>
            </li>
            <li className="transition-transform transform duration-300 hover:scale-110">
              <Link to="delights" smooth={true} duration={500} className="cursor-pointer hover:text-orange-400">Featuring Categories</Link>
            </li>
            <li className="transition-transform transform duration-300 hover:scale-110">
              <Link to="aboutus" smooth={true} duration={500} className="cursor-pointer hover:text-orange-400">About Us</Link>
            </li>
            <li className="transition-transform transform duration-300 hover:scale-110">
              <Link to="featuredtreats" smooth={true} duration={500} className="cursor-pointer hover:text-orange-400">Featured Treats</Link>
            </li>
            <li className="transition-transform transform duration-300 hover:scale-110">
              <Link to="contact" smooth={true} duration={500} className="cursor-pointer hover:text-orange-400">Contact Us</Link>
            </li>
          </ul>

          {/* Mobile Navbar */}
          <ul className="md:hidden flex flex-col items-center space-y-4 text-lg">
            <li className="transition-transform transform duration-300 hover:scale-110">
              <Link to="home" smooth={true} duration={500} className="cursor-pointer hover:text-orange-400">Home</Link>
            </li>
            <li className="transition-transform transform duration-300 hover:scale-110">
              <Link to="delights" smooth={true} duration={500} className="cursor-pointer hover:text-orange-400">Featuring Categories</Link>
            </li>
            <li className="transition-transform transform duration-300 hover:scale-110">
              <Link to="aboutus" smooth={true} duration={500} className="cursor-pointer hover:text-orange-400">About Us</Link>
            </li>
            <li className="transition-transform transform duration-300 hover:scale-110">
              <Link to="featuredtreats" smooth={true} duration={500} className="cursor-pointer hover:text-orange-400">Featured Treats</Link>
            </li>
            <li className="transition-transform transform duration-300 hover:scale-110">
              <Link to="contact" smooth={true} duration={500} className="cursor-pointer hover:text-orange-400">Contact Us</Link>
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
};













// export const Header = () => {
//     return (
//       <header className="bg-black text-white p-4 flex justify-between items-center">
//         <h1 className="text-xl font-bold">KBH</h1>
//         <nav>
//           <ul className="flex gap-4">
//             <li><a href="#" className="hover:text-yellow-400">Home</a></li>
//             <li><a href="#" className="hover:text-yellow-400">Our Delights</a></li>
//             <li><a href="#" className="hover:text-yellow-400">Contact Us</a></li>
//           </ul>
//         </nav>
//       </header>
//     );
//   };