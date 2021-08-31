const HeroImages = () => (
  <main className="mt-8 lg:mt-16 mx-auto pb-10 max-w-7xl px-4 sm:px-6">
    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
      <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
        <h1>
          <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
            <span className="block text-gray-900">Hello, what's your</span>
            <span className="block text-indigo-600">Hexo</span>
          </span>
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
          Unique combos of basic colors and objects that form universally
          recognizable NFT identities.
        </p>
        <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
          <div className="rounded-md shadow">
            <a
              href="#"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            >
              Mint
            </a>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <a
              href="#"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Looks Rare
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 max-w-none lg:mx-0 col-span-6 flex items-center">
        <div className="relative mx-auto rounded-lg shadow-xl w-5/12">
          <img
            className="object-cover rounded-lg bg-white"
            src="images/red/dragon.svg"
            alt=""
          />
          <div className="text-2xl text-center my-3">
            <h3>Red Dragon</h3>
          </div>
        </div>
        <div className="relative mx-auto rounded-lg shadow-xl w-5/12">
          <img
            className="object-cover rounded-lg bg-white"
            src="images/blue/moon.svg"
            alt=""
          />
          <div className="text-2xl text-center my-3">
            <h3>Blue Moon</h3>
          </div>
        </div>
      </div>
    </div>
  </main>
)

export default HeroImages
