const Hero = () => (
  <div className="bg-white">
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Infinite possible JPEGs
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          With a Hexo, you don't just own a single image. You own a namespace
          that can be visually represented however you want.
        </p>
      </div>
      <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 max-w-none mx-0 col-span-6 flex items-center">
        <div className="relative mx-auto rounded-lg shadow-xl w-3/12">
          <img
            className="object-cover rounded-lg bg-white"
            src="images/red/dragon.svg"
            alt=""
          />
        </div>
        <div className="relative mx-auto rounded-lg shadow-xl w-3/12">
          <img
            className="object-cover rounded-lg bg-white"
            src="images/dragonbit.png"
            alt=""
          />
        </div>
        <div className="relative mx-auto rounded-lg shadow-xl w-3/12">
          <img
            className="object-cover rounded-lg bg-white"
            src="images/3ddragon.png"
            alt=""
          />
        </div>
      </div>
      <div className="max-w-3xl mx-auto text-center">
        <p className="mt-10 text-xl text-gray-500">Hi, I'm Red Dragon</p>
      </div>
    </div>
  </div>
)

export default Hero
