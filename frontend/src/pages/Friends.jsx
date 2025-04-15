import { useEffect, useState } from "react";
import friendImage from "../assets/friends.svg";
import Card from "../components/Card";
import { 
  useFriends, 
  useAddFriend, 
  useRemoveFriend, 
  useUserTrades, 
  useSendTradeRequest, 
  useAcceptTrade, 
  useDeclineTrade 
} from '../hooks/useQueries';

const ConfirmationModal = ({ isConfirmOpen, onClose, onConfirm, actionType }) => {
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 z-15 ${
        isConfirmOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black opacity-75 transition-opacity duration-300"
      />
      
      {/* Modal content */}
      <div 
        className={`relative bg-white bg-opacity-95 rounded-xl shadow-lg transition-all duration-300 w-11/12 md:w-1/3 z-30 ${
          isConfirmOpen ? 'translate-y-0' : 'translate-y-10'
        }`}
        onClick={handleModalClick}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 bg-white hover:bg-zinc-300 cursor-pointer rounded-2xl px-4 py-2"
          onClick={onClose}
        >
          X
        </button>
        
        {/* Modal content */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
          <p className="mb-6">
            {actionType === 'accept' && "Are you sure you want to accept this trade?"}
            {actionType === 'deny' && "Are you sure you want to deny this trade?"}
            {actionType === 'cancel' && "Are you sure you want to cancel this trade?"}
          </p>
          
          <div className="flex justify-center space-x-4">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-all cursor-pointer hover:scale-105"
              onClick={onClose}
            >
              No, go back
            </button>
            <button 
              className={`px-4 py-2 text-white rounded-md transition-all cursor-pointer hover:scale-105 ${
                actionType === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
              onClick={onConfirm}
            >
              Yes, {actionType} trade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, status = 'sent' }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState(null);

  const acceptTradeMutation = useAcceptTrade();
  const declineTradeMutation = useDeclineTrade();

  const handleAction = (action) => {
    setActionType(action);
    setShowConfirmation(true);
  };

  // Do stuff in the database
  const handleConfirm = () => {
    if (actionType === 'accept') {
      acceptTradeMutation.mutate(tradeData.id);
    } else if (actionType === 'deny' || actionType === 'cancel') {
      declineTradeMutation.mutate(tradeData.id);
    }
    
    setShowConfirmation(false);
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 z-10 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black opacity-75 transition-opacity duration-300"
        />
        
        {/* Modal content */}
        <div 
          className={`relative bg-white rounded-xl shadow-lg transition-all duration-300 w-1/2 lg:w-2/5 max-h-3/4 z-20 ${
            isOpen ? 'translate-y-0' : 'translate-y-10'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 bg-white hover:bg-zinc-300 cursor-pointer rounded-2xl px-4 py-2"
            onClick={onClose}
          >
            X
          </button>
          
          {/* Modal header */}
          <div className="p-6 border-b text-center">
            <h3 className="text-2xl font-semibold">Trade Request</h3>
          </div>
          
          {/* Card images section */}
          <div className="pt-5 flex flex-row justify-center items-center">
            <div>
              <div className="-mb-12 text-center font-medium">You</div>
              <Card  
                title={"Hello"} 
                type={"breakfast"} 
                stars={3} 
                image={""} 
                description={"hello"} 
                power={10} 
                shrink={0}
                unlocked={0}
              />
            </div>
            
            <div className="flex items-center justify-center">
              -
            </div>
            
            <div>
              <div className="-mb-12 text-center font-medium">Friend</div>
              <Card  
                title={"Hello"} 
                type={"dinner"} 
                stars={3} 
                image={""} 
                description={"hello"} 
                power={10} 
                shrink={0}
                unlocked={0}
              />
            </div>
          </div>
          
          {/* Modal footer with buttons */}
          <div className="p-6 border-t flex justify-center space-x-4">
            {status === 'received' ? (
              <>
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all hover:scale-110 cursor-pointer"
                  onClick={() => handleAction('deny')}
                >
                  Deny
                </button>
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all hover:scale-110 cursor-pointer"
                  onClick={() => handleAction('accept')}
                >
                  Accept
                </button>
              </>
            ) : (
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all hover:scale-110 cursor-pointer"
                onClick={() => handleAction('cancel')}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal 
        isConfirmOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        actionType={actionType}
      />
    </>
  );
};

const TradeCreationModal = ({ isOpen, onClose, friendName }) => {
  const [selectedUserCard, setSelectedUserCard] = useState(null);
  const [selectedFriendCard, setSelectedFriendCard] = useState(null);
  
  // Sample data
  const [userCards, setUserCards] = useState([
    { id: 5, title: "Borgor", type: "lunch", stars: 4, power: 14 },
    { id: 6, title: "Pizza", type: "dinner", stars: 5, power: 22 },
    { id: 7, title: "McChicken", type: "breakfast", stars: 3, power: 12 }
  ]);
  
  const [friendCards, setFriendCards] = useState([
    { id: 1, title: "Pancake", type: "breakfast", stars: 4, power: 15 },
    { id: 2, title: "McMuffin", type: "breakfast", stars: 3, power: 10 },
    { id: 3, title: "Steak", type: "dinner", stars: 5, power: 20 },
    { id: 4, title: "Pasta", type: "dinner", stars: 4, power: 16 }
  ]);
  
  // Handle modal click to prevent closing
  const handleModalClick = (e) => {
    e.stopPropagation();
  };
  
  // Reset selections when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedUserCard(null);
      setSelectedFriendCard(null);
    }
  }, [isOpen]);
  
  const handleUserCardChange = (e) => {
    const cardId = parseInt(e.target.value);
    const card = userCards.find(c => c.id === cardId);
    setSelectedUserCard(card);
  };
  
  const handleFriendCardChange = (e) => {
    const cardId = parseInt(e.target.value);
    const card = friendCards.find(c => c.id === cardId);
    setSelectedFriendCard(card);
  };
  
  const handleSubmitTrade = () => {
    if (selectedUserCard && selectedFriendCard) {
      console.log("Submitting trade:", {
        friend: friendName,
        userCard: selectedUserCard.title,
        friendCard: selectedFriendCard.title
      });
      // Here you would handle the actual trade creation
      onClose();
    }
  };
  
  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 z-10 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black opacity-75 transition-opacity duration-300"
      />
      
      {/* Modal content */}
      <div 
        className={`relative bg-white rounded-xl shadow-lg transition-all duration-300 w-11/12 md:w-2/5 max-h-3/4 z-20 overflow-y-auto ${
          isOpen ? 'translate-y-0' : 'translate-y-10'
        }`}
        onClick={handleModalClick}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 bg-white hover:bg-zinc-300 cursor-pointer rounded-2xl px-4 py-2"
          onClick={onClose}
        >
          X
        </button>
        
        {/* Modal header */}
        <div className="p-6 border-b text-center">
          <h3 className="text-2xl font-semibold">Create Trade with {friendName}</h3>
        </div>
        
        {/* Trade creation form */}
        <div className="p-6">
          {/* Card selection section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Your card selection */}
            <div>
              <label className="block text-lg font-medium mb-2">Your Card:</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedUserCard?.id || ""}
                onChange={handleUserCardChange}
              >
                <option value="">Select your card</option>
                {userCards.map(card => (
                  <option key={card.id} value={card.id}>
                    {card.title} ({card.stars}★ - {card.power} Power)
                  </option>
                ))}
              </select>
              
              {/* Preview of selected user card - only shown when a card is selected */}
              <div className="flex justify-center mt-4">
                {selectedUserCard ? (
                  <Card
                    title={selectedUserCard.title}
                    type={selectedUserCard.type}
                    stars={selectedUserCard.stars}
                    image=""
                    description=""
                    power={selectedUserCard.power}
                    shrink={1}
                    unlocked={1}
                  />
                ) : null}
              </div>
            </div>
            
            {/* Friend's card selection */}
            <div>
              <label className="block text-lg font-medium mb-2">{friendName}'s Card:</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedFriendCard?.id || ""}
                onChange={handleFriendCardChange}
              >
                <option value="">Select {friendName}'s card</option>
                {friendCards.map(card => (
                  <option key={card.id} value={card.id}>
                    {card.title} ({card.stars}★ - {card.power} Power)
                  </option>
                ))}
              </select>
              
              {/* Preview of selected friend card - only shown when a card is selected */}
              <div className="flex justify-center mt-4">
                {selectedFriendCard ? (
                  <Card
                    title={selectedFriendCard.title}
                    type={selectedFriendCard.type}
                    stars={selectedFriendCard.stars}
                    image=""
                    description=""
                    power={selectedFriendCard.power}
                    shrink={1}
                    unlocked={1}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal footer with buttons */}
        <div className="p-6 border-t flex justify-center space-x-4">
          <button 
            className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all hover:scale-105 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all hover:scale-105 cursor-pointer"
            onClick={handleSubmitTrade}
            disabled={!selectedUserCard || !selectedFriendCard}
          >
            Send Trade
          </button>
        </div>
      </div>
    </div>
  );
};

const UnfriendModal = ({ isOpen, onClose, friendName, onConfirm }) => {
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 z-15 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black opacity-75 transition-opacity duration-300"
      />
      
      {/* Modal content */}
      <div 
        className={`relative bg-white bg-opacity-95 rounded-xl shadow-lg transition-all duration-300 w-11/12 md:w-1/3 z-30 ${
          isOpen ? 'translate-y-0' : 'translate-y-10'
        }`}
        onClick={handleModalClick}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 bg-white hover:bg-zinc-300 cursor-pointer rounded-2xl px-4 py-2"
          onClick={onClose}
        >
          X
        </button>
        
        {/* Modal content */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Unfriend Confirmation</h3>
          <p className="mb-6">
            Are you sure you want to unfriend {friendName}?
          </p>
          
          <div className="flex justify-center space-x-4">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-all cursor-pointer hover:scale-105"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all cursor-pointer hover:scale-105"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Unfriend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Friends = () => {
  // State for modals
  const [show, setShow] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [tradeStatus, setTradeStatus] = useState("");
  const [openTradeCreation, setOpenTradeCreation] = useState(false);
  const [openUnfriend, setOpenUnfriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState("");
  const [newFriendUsername, setNewFriendUsername] = useState("");
  const [selectedTradeId, setSelectedTradeId] = useState(null);

  // Fetch friends data
  const { data: friends = [], isLoading: isLoadingFriends } = useFriends();
  
  // Fetch trades data
  const { data: trades = { sent: [], received: [] }, isLoading: isLoadingTrades } = useUserTrades();
  
  // Mutation hooks
  const addFriend = useAddFriend();
  const removeFriend = useRemoveFriend();
  const sendTradeRequest = useSendTradeRequest();
  const acceptTrade = useAcceptTrade();
  const declineTrade = useDeclineTrade();

  const handleUnfriendClick = (friend) => {
    setSelectedFriend(friend);
    setOpenUnfriend(true);
  };

  const handleTradeClick = (friend) => {
    setSelectedFriend(friend);
    setOpenTradeCreation(true);
  };

  const handleUnfriend = () => {
    removeFriend.mutate(selectedFriend.id);
  };

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (newFriendUsername.trim()) {
      addFriend.mutate(newFriendUsername);
      setNewFriendUsername("");
    }
  };

  useEffect(() => {
    document.title = "Friends"
  }, []);

  return (
    <div className="h-screen select-none font-mono overflow-hidden">
      <div className="h-full w-full flex items-center justify-center">
        {/* Trade Request Modal */}
        <Modal 
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          status={tradeStatus}
        />
        
        {/* Trade Creation Modal */}
        <TradeCreationModal
          isOpen={openTradeCreation}
          onClose={() => setOpenTradeCreation(false)}
          friendName={selectedFriend}
        />
        
        {/* Unfriend Confirmation Modal */}
        <UnfriendModal
          isOpen={openUnfriend}
          onClose={() => setOpenUnfriend(false)}
          friendName={selectedFriend}
          onConfirm={handleUnfriend}
        />

        <div className="relative border-1 h-full w-3/4 shadow-[8px_6px_6px_4px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 w-full h-1/8 bg-linear-to-b from-white to-gray-300 border-b-25 border-green-800 z-5 flex items-end justify-end px-6 pb-4">            
            {/* Add Friend */}
            <form onSubmit={handleAddFriend} className="flex items-center">
              <input
                type="text"
                placeholder="Add friend by username"
                value={newFriendUsername}
                onChange={(e) => setNewFriendUsername(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-r-full hover:bg-green-500 transition-all cursor-pointer"
              >
                Add
              </button>
            </form>
          </div>

          <div className="absolute bottom-0 h-7/8 w-full bg-orange-300 text-xl overflow-y-auto">
            <div className="sticky flex items-center mx-10 my-5 z-1">
              <hr className="grow border-3 border-amber-700" />
              <span className="mx-4 text-center text-4xl cursor-pointer" onClick={() => setShow(!show)}>Trade</span>
              <hr className="grow border-3 border-amber-700" />
            </div>

            <div className={`w-full ${show ? "h-full lg:h-1/3 lg:mb-10" : "h-[10%]"} overflow-clip transition-all duration-250 flex flex-col lg:flex-row items-center justify-center`}>
              
              <div className="max-lg:h-1/2 lg:h-full w-full">
                <div className="text-center border-b-1 max-lg:mx-24 lg:mx-8">Sent</div>
                
                <div className={`w-full ${show ? "h-[90%]" : "h-0"} justify-items-center transition-all duration-250 overflow-y-scroll`}>
                  {[...Array(10)].map((_, index) => (
                    <div key={`sent-${index}`} className="relative w-4/5 h-20 flex items-center justify-center border-1 m-4 rounded-sm bg-white">
                      <div className="flex flex-row absolute left-5 cursor-pointer gap-4">
                        <img src={friendImage} alt="img" className="size-12 " />
                        <div className="flex items-center text-2xl">Gary</div>
                      </div>
                      <div className="flex flex-row absolute right-4">
                        <div 
                          className="mx-2 px-5 py-3 flex items-center justify-center text-black border-black bg-white hover:bg-zinc-400 rounded-full border-1 cursor-pointer transition-all duration-100 hover:scale-110 text-sm"
                          onClick={()=> { 
                            setOpenModal(true)
                            setTradeStatus("sent")
                          }}
                        >
                          Info
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="max-lg:h-1/2 lg:h-full w-full">
                <div className="text-center border-b-1 max-lg:mx-24 lg:mx-8">Received</div>
                
                <div className={`w-full ${show ? "h-[90%]" : "h-0"} justify-items-center transition-all duration-250 overflow-y-scroll`}>
                {[...Array(10)].map((_, index) => (
                  <div key={`received-${index}`} className="relative w-4/5 h-20 flex items-center justify-center border-1 m-4 rounded-sm bg-white">
                    <div className="flex flex-row absolute left-5 cursor-pointer gap-4">
                      <img src={friendImage} alt="img" className="size-12 " />
                      <div className="flex items-center text-2xl">Gary</div>
                    </div>
                    <div className="flex flex-row absolute right-4">
                      <div 
                        className="mx-2 px-5 py-3 flex items-center justify-center text-black border-black bg-white hover:bg-zinc-400 rounded-full border-1 cursor-pointer transition-all duration-100 hover:scale-110 text-sm"
                        onClick={()=> { 
                          setOpenModal(true)
                          setTradeStatus("received")
                        }}
                      >
                        Info
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>

            <div className="sticky flex items-center mx-10 my-5 z-1">
              <hr className="grow border-3 border-amber-700" />
              <span className="mx-4 text-center text-4xl">Friends</span>
              <hr className="grow border-3 border-amber-700" />
            </div>

            <div className="w-full h-full mb-10 flex flex-col lg:flex-row">
              <div className="h-full w-full lg:w-2/3 border-r-1">
                <div className="text-center border-b-1 max-lg:mx-24 lg:mx-8">List</div>

                <div className={`w-full h-[95%] justify-items-center overflow-y-scroll`}>
                {[...Array(10)].map((_, index) => (
                  <div key={`friend-${index}`} className="relative w-4/5 h-20 flex items-center justify-center border-1 m-4 rounded-full bg-white">
                    <div className="flex flex-row absolute left-5 cursor-pointer gap-4">
                      <img src={friendImage} alt="img" className="size-12 " />
                      <div className="flex items-center text-2xl">Gary</div>
                    </div>
                    <div className="flex flex-row absolute right-4">
                      <div 
                        className="mx-2 p-3 flex items-center justify-center rounded-full text-white border-black bg-sky-500 hover:bg-sky-400 border-1 cursor-pointer transition-all duration-100 hover:scale-110 text-sm"
                        onClick={() => handleTradeClick("Gary")}
                      >
                        Trade
                      </div>
                      <div 
                        className="mx-2 p-3 flex items-center justify-center rounded-full text-white border-black bg-red-500 hover:bg-red-400 border-1 cursor-pointer transition-all duration-100 hover:scale-110 text-sm"
                        onClick={() => handleUnfriendClick("Gary")}
                      >
                        Unfriend
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>

              <div className="h-full w-full lg:w-1/3 border-l-1 flex flex-col">
                <div className="text-center border-b-1 max-lg:mx-24 lg:mx-8">Sent</div>
                <div className="text-center border-b-1 max-lg:mx-24 lg:mx-8">Received</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
