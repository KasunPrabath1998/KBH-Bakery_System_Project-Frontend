// AboutUs Component

import aboutImage from '../../assets/AboutUsImages/about.jpeg';

export const AboutUs = () => {
  const aboutText = [
    `We, KBH deliver the best food
for you with care and
ensuring the taste, leading
the bakery market.
We, KBH deliver the best food
for you with care and
ensuring the taste, leading
the bakery market.`
  ];

  return (
    <section
    id="aboutus"
      className="text-center py-16 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${aboutImage})` }}
    >
      <div className="py-8 px-6 max-w-2xl mx-auto rounded-lg">
        <h1 className="text-3xl font-bold italic text-white p-0">About Us</h1>
        <br />
        <h2 className="text-1xl text-white p-0">
          {aboutText[0].split('\n').map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
};
