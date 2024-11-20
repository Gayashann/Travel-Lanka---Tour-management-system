import React from "react";

const Home = () => {
  return (
    <div>
      {/* Hero Section with video background */}
      <section className="relative h-screen">
  <img
    src="http://www.adventurewomen.com/wp-content/uploads/2016/07/32.-sri-lanka-adventure-for-women.jpg" // Replace with your image URL
    alt="Travel Background"
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-black bg-opacity-25 flex flex-col justify-center items-center text-center text-white" >
    <h1 className="text-5xl font-bold">Explore The World With Us</h1>
    <p className="mt-4 text-lg">Plan your next adventure with our curated tours.</p>
  </div>
</section>


      

      {/* Popular Tours Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-8">Popular Tours</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Tropical Paradise",
              description: "Unwind in the beauty of Tropical Paradise with exclusive packages.",
              imageUrl: "https://thumbs.dreamstime.com/b/mirissa-beach-tropical-paradise-sri-lanka-tourist-wooden-signs-tropical-paradisiac-mirissa-beach-matara-district-249971319.jpg",
            },
            {
              title: "Cultural Heritage",
              description: "Explore ancient traditions in Cultural Heritage destinations.",
              imageUrl: "http://www.pulse.lk/wp-content/uploads/2015/04/Anuradhapura.jpg",
            },
            {
              title: "Wild Safari",
              description: "Embark on an adventurous Wild Safari experience.",
              imageUrl: "https://miro.medium.com/max/1400/1*nz4yQ6UA4FwF6tzR2NKC3g.jpeg",
            },
          ].map((tour, index) => (
            <div
              key={index}
              className="bg-white shadow-lg hover:shadow-2xl transition transform hover:scale-105 rounded-lg overflow-hidden"
            >
              <img
                src={tour.imageUrl}
                alt={tour.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-2xl font-bold text-black-600">{tour.title}</h3>
                <p className="mt-2 text-gray-600">{tour.description}</p>
                {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Click Me
        </button> */}
                
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Experiences Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">Featured Experiences</h2>
          <div className="flex justify-around space-x-6">
            <div className="text-center">
              <i className="fas fa-umbrella-beach text-4xl text-yellow-500"></i>
              <h3 className="text-xl font-bold mt-4">Beach Getaways</h3>
              <p className="mt-2 text-gray-600">Relax by the ocean with exclusive packages.</p>
              
            </div>
            <div className="text-center">
              <i className="fas fa-hiking text-4xl text-green-500"></i>
              <h3 className="text-xl font-bold mt-4">Mountain Trails</h3>
              <p className="mt-2 text-gray-600">Explore breathtaking mountain ranges.</p>
            </div>
            <div className="text-center">
              <i className="fas fa-city text-4xl text-blue-500"></i>
              <h3 className="text-xl font-bold mt-4">City Tours</h3>
              <p className="mt-2 text-gray-600">Discover vibrant city life and iconic landmarks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-8">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              title: "Beach Sunset",
              imageUrl: "https://d1bv4heaa2n05k.cloudfront.net/posts/BlogPost24769/1573555874883-shutterstock_1251162775.jpg",
            },
            {
              title: "Mountain Views",
              imageUrl: "https://www.riu.com/blog/wp-content/uploads/2019/08/sri-lanka-riu.jpg",
            },
            {
              title: "Cityscape",
              imageUrl: "https://www.kids-world-travel-guide.com/images/Srilanka_lotustower_msmclicks_Shutterstock.jpg",
            },
            {
              title: "Forest Trails",
              imageUrl: "https://tse1.mm.bing.net/th?id=OIP.BahWNcTD0_jVlYkSzzbaDgHaEK&pid=Api&P=0&h=220",
            },
            {
              title: "Desert Adventure",
              imageUrl: "https://overatours.com/wp-content/uploads/2017/11/68-1024x683.jpg",
            },
            {
              title: "Ocean Waves",
              imageUrl: "https://tickettoridegroup.com/blog/wp-content/uploads/2017/07/Rams-23rd-Nov-153.jpg",
            },
          ].map((image, index) => (
            <div key={index} className="relative group overflow-hidden rounded-lg">
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover transition-transform transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex justify-center items-center text-white">
                <h3 className="text-2xl font-bold">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-8">About Us</h2>
        <div className="">
          <span>Welcome to Travel Lanka, your ultimate guide to exploring the breathtaking beauty and rich cultural heritage of Sri Lanka!

At Travel Lanka, we are passionate about travel and committed to providing unforgettable experiences. Our mission is to showcase the diverse landscapes, vibrant traditions, and warm hospitality that make Sri Lanka a top destination for travelers from around the world.

Whether you are seeking pristine beaches, lush mountains, ancient temples, or wildlife adventures, our curated tours and tailored itineraries offer something for every kind of traveler. We pride ourselves on our local expertise and personal touch, ensuring that each journey is unique and memorable.

Our dedicated team of travel experts is here to assist you in planning your dream vacation, offering insights and recommendations to help you uncover hidden gems and popular attractions alike. We believe in sustainable tourism, and we strive to support local communities while protecting the natural beauty of our island.

Join us at Travel Lanka, and let us take you on a journey filled with adventure, culture, and unforgettable memories. Explore, experience, and enjoy everything Sri Lanka has to offer!</span>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
};

export default Home;
