const Random = () => (
  <div className="flex-1 pt-4">
    <button
      type="button"
      className="lg:float-right items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Mint
    </button>
    <select
      id="random"
      name="random"
      className="float-left lg:float-right pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-l-md"
      defaultValue="1"
    >
      <option value="1">1 random</option>
      <option value="2">2 random</option>
      <option value="3">3 random</option>
      <option value="4">4 random</option>
      <option value="5">5 random</option>
      <option value="6">6 random</option>
      <option value="7">7 random</option>
      <option value="8">8 random</option>
      <option value="9">9 random</option>
      <option value="10">10 random</option>
      <option value="11">11 random</option>
      <option value="12">12 random</option>
      <option value="13">13 random</option>
      <option value="14">14 random</option>
      <option value="15">15 random</option>
      <option value="16">16 random</option>
      <option value="17">17 random</option>
      <option value="18">18 random</option>
      <option value="19">19 random</option>
      <option value="20">20 random</option>
    </select>
  </div>
)

export default Random
