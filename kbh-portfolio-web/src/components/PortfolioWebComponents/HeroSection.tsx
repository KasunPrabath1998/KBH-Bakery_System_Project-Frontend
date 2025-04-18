import heroImage from "../../assets/HeroImages/heroimage6.png";

export const HeroSection = () => {
  return (
    <section
  id="home"
  className="relative w-full h-screen flex items-center pt-32 sm:pt-36 md:pt-40"
  style={{
    backgroundImage: `url(${heroImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="container mx-auto px-4 sm:px-6 md:px-8">
    <div className="w-full md:w-2/3 lg:w-1/2 text-white">
      <h1 className="font-sirin text-4xl sm:text-5xl md:text-6xl lg:text-6xl uppercase mb-4 leading-tight">
        BAKING FRESHNESS,<br /> LEADING TASTE
      </h1>

      <button
        onClick={() => window.location.href = "#product"}
        className="mt-4 bg-orange-500 hover:bg-orange-700 text-white px-5 sm:px-6 py-2 sm:py-3 text-base sm:text-lg rounded-md transition-all duration-300"
      >
        Shop Now
      </button>
    </div>
  </div>
</section>

  );
};














// export const HeroSection = () => {
//     return (
//       <section className="relative bg-cover bg-center h-screen flex items-center text-white" style={{ backgroundImage: "url('/path-to-hero-image.jpg')" }}>
//         <div className="container mx-auto text-center">
//           <h2 className="text-4xl font-bold">BAKING FRESHNESS, LEADING TASTE</h2>
//           <button className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded">Shop Now</button>
//         </div>
//       </section>
//     );
//   };