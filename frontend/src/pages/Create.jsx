import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { cardApi } from '../services/api';
import toast from 'react-hot-toast';

const Create = () => {
  const [loading, setLoading] = useState(false);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cards, setCards] = useState([]);
  
  const defaultForm = {
    title: "",
    type: "breakfast",
    stars: 3,
    description: "",
    power: Math.floor(Math.random() * 20) + 10,
    locked: false,
    imageFile: null,
    imagePreview: null,
    grid_id: -1
  }

  const [formData, setFormData] = useState(defaultForm);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    const updatedValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: updatedValue
    }));
    
    // If the dropdown type changes, update the card grid
    if (name === 'type' && updatedValue !== formData.type) {
      getCards(updatedValue);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result
        }));
      };

      reader.readAsDataURL(file); // Convert the file to a data URL
    } else {
      setFormData(prev => ({
        ...prev,
        imageFile: null,
        imagePreview: null
      }));
    }
  };

  // Fetch cards by type
  const getCards = async (selectedType = formData.type) => {
    try {
      const response = await cardApi.getCardsByType(selectedType);
      const grid = response.data.pop();
      
      if (response.success) {
        setCards(response.data || []);
        setFormData(prev => ({
          ...prev,
          grid_id: grid.count + 1
        }));
      } else {
        toast.error("Failed to fetch cards");
        setCards([]);
      }
    } catch (error) {
      toast.error("Error fetching cards");
      setCards([]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Create FormData object
    const submitData = new FormData();

    submitData.append('name', formData.title);
    submitData.append('stars', formData.stars);
    submitData.append('description', formData.description);
    submitData.append('type', formData.type);
    submitData.append('power', formData.power);
    submitData.append('grid_id', formData.grid_id || -1);
    
    if (formData.imageFile) {
      submitData.append('cardImage', formData.imageFile);
    } else {
      toast.error("Please complete all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await cardApi.createCard(submitData);
      if (response.success) {
        toast.success(response.msg);
        
        // Reset form but maintain the current type
        const currentType = formData.type;
        setFormData({
          ...defaultForm,
          type: currentType
        });
        
        // Update card grid with latest data (using the current type)
        getCards(currentType);
      } else {
        toast.error(response.msg);
      }
    } catch (error) {
      toast.error("An error occurred while creating the card");
    } finally {
      setLoading(false);
    }
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData((prev) => ({
      ...defaultForm,
      type: prev.type,
      grid_id: prev.grid_id
    }));
  };

  // Fetch cards when component mounts
  useEffect(() => {
    getCards();
    document.title = "Create";
  }, []);

  return (
    <div className="min-h-screen select-none font-mono py-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 bg-amber-50 rounded-2xl">
          <h1 className="text-2xl font-bold text-amber-800">Create New Card</h1>
          <p className="mt-1 text-sm text-amber-600">Design your card below!</p>
        </div>

        {/* Form and Preview container */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          {/* Form Section */}
          <div className="md:w-1/2">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-amber-200">
              <div className="p-4 bg-amber-50">
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-3">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="text-sm font-medium text-amber-700">
                      Card Name
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border-amber-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    />
                  </div>

                  {/* Two columns layout for smaller fields */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Type - This dropdown will trigger the grid update */}
                    <div>
                      <p className="text-sm font-medium text-amber-700">
                        Card Type
                      </p>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border-amber-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm cursor-pointer"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="dinner">Dinner</option>
                        <option value="dessert">Dessert</option>
                      </select>
                    </div>

                    {/* Stars */}
                    <div>
                      <p className="text-sm font-medium text-amber-700">
                        Stars (1-5)
                      </p>
                      <input
                        type="number"
                        name="stars"
                        id="stars"
                        min="1"
                        max="5"
                        value={formData.stars}
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full border-amber-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Power */}
                    <div>
                      <p className="text-sm font-medium text-amber-700">
                        Power
                      </p>
                      <input
                        type="number"
                        name="power"
                        id="power"
                        min="0"
                        value={formData.power}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border-amber-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      />
                    </div>

                    {/* Grid ID */}
                    <div>
                      <p className="text-sm font-medium text-amber-700">
                        Grid ID
                      </p>
                      <input
                        type="text"
                        name="grid_id"
                        id="grid_id"
                        value={formData.grid_id}
                        onChange={handleChange}
                        disabled={true}
                        className="mt-1 p-2 w-full border-amber-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-sm font-medium text-amber-700">
                      Description
                    </p>
                    <textarea
                      id="description"
                      name="description"
                      rows={2}
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border-amber-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <p className="text-sm font-medium text-amber-700">
                      Card Image
                    </p>
                    <input
                      type="file"
                      id="cardImage"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-1 p-2 w-full text-amber-700 text-sm cursor-pointer"
                    />
                  </div>

                  {/* Toggle Options */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {/* Locked Toggle */}
                    <div className="flex items-center">
                      <input
                        id="locked"
                        name="locked"
                        type="checkbox"
                        checked={formData.locked}
                        onChange={handleChange}
                        className="h-3 w-3 cursor-pointer text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
                      />
                      <p className="ml-1 text-xs text-amber-700">
                        Locked (Preview)
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-3 py-1 cursor-pointer border border-amber-300 rounded-md shadow-sm text-xs font-medium text-amber-700 bg-white hover:bg-amber-50"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-3 py-1 cursor-pointer border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      {loading ? 'Saving...' : 'Save Card'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="md:w-1/2 flex flex-col items-center">
            <div className="bg-white h-full flex flex-col items-center justify-center shadow-md rounded-lg p-5 border border-amber-200 w-full">
              <h3 className="text-center text-lg font-medium text-amber-800 transition mb-8">Preview</h3>
              <div className="flex justify-center">
                {/* Card Preview */}
                <Card
                  title={formData.title}
                  type={formData.type}
                  stars={parseInt(formData.stars)}
                  image={formData.imagePreview}
                  description={formData.description}
                  power={parseInt(formData.power)}
                  count={0}
                  shrink={1}
                  locked={formData.locked}
                  tilt={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card Grid Section with scrollable container */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-amber-800">
              {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Cards
            </h2>
            <div className="text-sm text-amber-600">
              {cardsLoading ? 'Loading...' : (cards.length > 0 ? `${cards.length} cards found` : 'No cards found')}
            </div>
          </div>

          {/* Scrollable container for the card grid */}
          <div className="bg-white rounded-lg border-1 border-amber-200 shadow-md overflow-hidden">
            <div className="max-h-96 overflow-y-auto p-2 ml-10">
              {cardsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cards.length > 0 ? (
                    cards.map((card) => (
                      <Card
                        key={card._id}
                        title={card.name}
                        type={card.type}
                        stars={card.stars}
                        image={card.image}
                        description={card.description}
                        power={card.power}
                        count={0}
                        shrink={1}
                        locked={false}
                        tilt={false}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center text-amber-700">
                      <p className="text-lg">No {formData.type} cards found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;