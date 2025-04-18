import offerBannerImage from '../../assets/OfferBannerImages/offerbanner.jpg';

// OfferBanner Component
export const OfferBanner = () => {
  return (
    <section 
    className="text-center py-16 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${offerBannerImage})` }}  
    >
      <div className="py-8 px-6 max-w-lg mx-auto rounded-lg">
      <h2 className="text-3xl font-bold italic text-[#8B4513] p-8">20% Off Your <br /> First Order</h2>
          {/* <button className="mt-4 px-6 py-2 bg-[#8B4513] hover:bg-[#A0522D] text-white font-semibold rounded">
            More Detail
          </button> */}
      </div>
    </section>
  );
};






















// OfferBanner Component
// export const OfferBanner = () => {
//     return (
//       <section className="text-center bg-gray-100 py-10">
//         <h2 className="text-2xl font-bold">20% Off Your First Order</h2>
//         <button className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded">More Detail</button>
//       </section>
//     );
//   };