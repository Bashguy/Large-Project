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
  useDeclineTrade,
  useFriendCards,
  useUserCards
} from '../hooks/useQueries';

const ConfirmationModal = ({ isConfirmOpen, onClose, onConfirm, actionType }) => {
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 z-15 ${isConfirmOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      onClick={onClose}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-75 transition-opacity duration-300"
      />

      {/* Modal content */}
      <div
        className={`relative bg-white bg-opacity-95 rounded-xl shadow-lg transition-all duration-300 w-11/12 md:w-1/3 z-30 ${isConfirmOpen ? 'translate-y-0' : 'translate-y-10'
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
              className={`px-4 py-2 text-white rounded-md transition-all cursor-pointer hover:scale-105 ${actionType === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
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

const Modal = ({ isOpen, onClose, status = 'sent', tradeData }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState(null);

  // Mutations
  const acceptTradeMutation = useAcceptTrade();
  const declineTradeMutation = useDeclineTrade();

  const handleAction = (action) => {
    setActionType(action);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (actionType === 'accept') {
      acceptTradeMutation.mutate(tradeData?.id);
    } else if (actionType === 'deny') {
      declineTradeMutation.mutate({
        tradeId: tradeData?.id,
        tradeType: 'received'
      });
    } else if (actionType === 'cancel') {
      declineTradeMutation.mutate({
        tradeId: tradeData?.id,
        tradeType: 'sent'
      });
    }

    setShowConfirmation(false);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 z-10 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-75 transition-opacity duration-300" />

        {/* Modal content */}
        <div
          className={`relative bg-white rounded-xl shadow-lg transition-all duration-300 w-1/2 lg:w-2/5 max-h-3/4 z-20 ${isOpen ? 'translate-y-0' : 'translate-y-10'
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
          <div className={`pt-4 flex ${status === 'sent' ? "flex-row" : "flex-row-reverse"} justify-center items-center mb-8`}>
            <div>
              <div className="mb-2 text-center font-medium">{status === 'sent' ? "You" : "Friend"}</div>
              {tradeData?.cardSent ? (
                <Card
                  title={tradeData.cardSent.name}
                  type={tradeData.cardSent.type}
                  stars={tradeData.cardSent.stars}
                  image={tradeData.cardSent.image || ""}
                  description={tradeData.cardSent.description || ""}
                  power={tradeData.cardSent.power || 0}
                  shrink={0}
                  unlocked={1}
                  tilt={false}
                />
              ) : (
                <div className="h-48 w-32 bg-gray-200 flex items-center justify-center">Loading...</div>
              )}
            </div>

            <div className="flex items-center justify-center mx-4">
              ↔️
            </div>

            <div>
              <div className="mb-2 text-center font-medium">{status === 'sent' ? "Friend" : "You"}</div>
              {tradeData?.cardWant ? (
                <Card
                  title={tradeData.cardWant.name}
                  type={tradeData.cardWant.type}
                  stars={tradeData.cardWant.stars}
                  image={tradeData.cardWant.image || ""}
                  description={tradeData.cardWant.description || ""}
                  power={tradeData.cardWant.power || 0}
                  shrink={0}
                  unlocked={1}
                  tilt={false}
                />
              ) : (
                <div className="h-48 w-32 bg-gray-200 flex items-center justify-center">Loading...</div>
              )}
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

const TradeCreationModal = ({ isOpen, onClose, friendData }) => {
  const [selectedUserCard, setSelectedUserCard] = useState(null);
  const [selectedFriendCard, setSelectedFriendCard] = useState(null);

  // Fetch user's cards
  const { data: userCards = [], isLoading: isLoadingUserCards } = useUserCards("");

  // Fetch friend's cards
  const { data: friendCards = [], isLoading: isLoadingFriendCards } = useFriendCards(friendData?._id, "");

  // Get mutation for sending trade
  const sendTradeRequest = useSendTradeRequest();

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
    const cardId = e.target.value;
    const card = userCards.find(c => c._id === cardId);
    setSelectedUserCard(card);
  };

  const handleFriendCardChange = (e) => {
    const cardId = e.target.value;
    const card = friendCards.find(c => c._id === cardId);
    setSelectedFriendCard(card);
  };

  const handleSubmitTrade = () => {
    if (selectedUserCard && selectedFriendCard) {
      sendTradeRequest.mutate({
        friendId: friendData._id,
        cardSentId: selectedUserCard._id,
        cardWantId: selectedFriendCard._id
      });
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 z-10 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-75 transition-opacity duration-300" />

      {/* Modal content */}
      <div
        className={`relative bg-white rounded-xl shadow-lg transition-all duration-300 w-11/12 md:w-2/5 max-h-3/4 z-20 overflow-y-auto ${isOpen ? 'translate-y-0' : 'translate-y-10'
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
          <h3 className="text-2xl font-semibold">Create Trade with {friendData?.username}</h3>
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
                value={selectedUserCard?._id || ""}
                onChange={handleUserCardChange}
              >
                <option value="">Select your card</option>
                {isLoadingUserCards ? (
                  <option disabled>Loading...</option>
                ) : (
                  userCards.map(card => (
                    <option key={card._id} value={card._id}>
                      {card.name} ({card.stars}★ - Power: {card.power || 0})
                    </option>
                  ))
                )}
              </select>

              {/* Preview of selected user card */}
              <div className="flex justify-center mt-4">
                {selectedUserCard ? (
                  <Card
                    title={selectedUserCard.name}
                    type={selectedUserCard.type}
                    stars={selectedUserCard.stars}
                    image={selectedUserCard.image || ""}
                    description={selectedUserCard.description || ""}
                    power={selectedUserCard.power || 0}
                    shrink={1}
                    unlocked={1}
                    tilt={false}
                  />
                ) : null}
              </div>
            </div>

            {/* Friend's card selection */}
            <div>
              <label className="block text-lg font-medium mb-2">{friendData?.username}'s Card:</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedFriendCard?._id || ""}
                onChange={handleFriendCardChange}
              >
                <option value="">Select {friendData?.username}'s card</option>
                {isLoadingFriendCards ? (
                  <option disabled>Loading...</option>
                ) : (
                  friendCards.map(card => (
                    <option key={card._id} value={card._id}>
                      {card.name} ({card.stars}★ - Power: {card.power || 0})
                    </option>
                  ))
                )}
              </select>

              {/* Preview of selected friend card */}
              <div className="flex justify-center mt-4">
                {selectedFriendCard ? (
                  <Card
                    title={selectedFriendCard.name}
                    type={selectedFriendCard.type}
                    stars={selectedFriendCard.stars}
                    image={selectedFriendCard.image || ""}
                    description={selectedFriendCard.description || ""}
                    power={selectedFriendCard.power || 0}
                    shrink={1}
                    unlocked={1}
                    tilt={false}
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
            className={`px-6 py-3 bg-blue-600 text-white rounded-md transition-all hover:scale-105 cursor-pointer ${(!selectedUserCard || !selectedFriendCard) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
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

const UnfriendModal = ({ isOpen, onClose, friendData, onConfirm }) => {
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  // Get mutation for unfriending
  const removeFriend = useRemoveFriend();

  const handleUnfriend = () => {
    removeFriend.mutate(friendData);
    onConfirm();
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 z-15 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      onClick={onClose}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-75 transition-opacity duration-300"
      />

      {/* Modal content */}
      <div
        className={`relative bg-white bg-opacity-95 rounded-xl shadow-lg transition-all duration-300 w-11/12 md:w-1/3 z-30 ${isOpen ? 'translate-y-0' : 'translate-y-10'
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
            Are you sure you want to unfriend {friendData?.username}?
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
              onClick={handleUnfriend}
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
  const [show, setShow] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [tradeStatus, setTradeStatus] = useState("");
  const [openTradeCreation, setOpenTradeCreation] = useState(false);
  const [openUnfriend, setOpenUnfriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedTradeId, setSelectedTradeId] = useState(null);
  const [newFriendUsername, setNewFriendUsername] = useState("");

  // Fetch friends data
  const { data: friends = [], isLoading: isLoadingFriends } = useFriends();

  // Fetch trades data
  const {
    data: trades = { sent: [], received: [] },
    isLoading: isLoadingTrades
  } = useUserTrades();

  // Mutations
  const addFriend = useAddFriend();
  const removeFriend = useRemoveFriend();

  // Handle unfriend action
  const handleUnfriendClick = (friend) => {
    setSelectedFriend(friend);
    setOpenUnfriend(true);
  };

  // Handle trade creation
  const handleTradeClick = (friend) => {
    setSelectedFriend(friend);
    setOpenTradeCreation(true);
  };

  // Handle unfriend confirmation
  const handleUnfriend = () => {
    if (selectedFriend?.id) {
      removeFriend.mutate(selectedFriend.id);
    }
  };

  // Handle add friend form submission
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
          tradeData={
            tradeStatus === "sent"
              ? trades.sent.find(t => t.id === selectedTradeId)
              : trades.received.find(t => t.id === selectedTradeId)
          }
        />

        {/* Trade Creation Modal */}
        <TradeCreationModal
          isOpen={openTradeCreation}
          onClose={() => setOpenTradeCreation(false)}
          friendData={selectedFriend}
        />

        {/* Unfriend Confirmation Modal */}
        <UnfriendModal
          isOpen={openUnfriend}
          onClose={() => setOpenUnfriend(false)}
          friendData={selectedFriend?._id}
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
                disabled={addFriend.isPending}
              >
                {addFriend.isPending ? "Adding..." : "Add"}
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
                  {isLoadingTrades ? (
                    <div className="flex justify-center items-center h-32">Loading trades...</div>
                  ) : trades.sent.length === 0 ? (
                    <div className="flex justify-center items-center h-32">No sent trades</div>
                  ) : (
                    trades.sent.map((trade) => (
                      <div key={trade.id} className="relative w-4/5 h-20 flex items-center justify-center border-1 m-4 rounded-sm bg-white">
                        <div className="flex flex-row absolute left-5 cursor-pointer gap-4">
                          <img src={friendImage} alt="img" className="size-12 " />
                          <div className="flex items-center text-2xl">{trade.friend.username}</div>
                        </div>
                        <div className="flex flex-row absolute right-4">
                          <div
                            className="mx-2 px-5 py-3 flex items-center justify-center text-black border-black bg-white hover:bg-zinc-400 rounded-full border-1 cursor-pointer transition-all duration-100 hover:scale-110 text-sm"
                            onClick={() => {
                              setSelectedTradeId(trade.id);
                              setOpenModal(true);
                              setTradeStatus("sent");
                            }}
                          >
                            Info
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="max-lg:h-1/2 lg:h-full w-full">
                <div className="text-center border-b-1 max-lg:mx-24 lg:mx-8">Received</div>

                <div className={`w-full ${show ? "h-[90%]" : "h-0"} justify-items-center transition-all duration-250 overflow-y-scroll`}>
                  {isLoadingTrades ? (
                    <div className="flex justify-center items-center h-32">Loading trades...</div>
                  ) : trades.received.length === 0 ? (
                    <div className="flex justify-center items-center h-32">No received trades</div>
                  ) : (
                    trades.received.map((trade) => (
                      <div key={trade.id} className="relative w-4/5 h-20 flex items-center justify-center border-1 m-4 rounded-sm bg-white">
                        <div className="flex flex-row absolute left-5 cursor-pointer gap-4">
                          <img src={friendImage} alt="img" className="size-12 " />
                          <div className="flex items-center text-2xl">{trade.friend.username}</div>
                        </div>
                        <div className="flex flex-row absolute right-4">
                          <div
                            className="mx-2 px-5 py-3 flex items-center justify-center text-black border-black bg-white hover:bg-zinc-400 rounded-full border-1 cursor-pointer transition-all duration-100 hover:scale-110 text-sm"
                            onClick={() => {
                              setSelectedTradeId(trade.id);
                              setOpenModal(true);
                              setTradeStatus("received");
                            }}
                          >
                            Info
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                  {isLoadingFriends ? (
                    <div className="flex justify-center items-center h-32">Loading friends...</div>
                  ) : friends.length === 0 ? (
                    <div className="flex justify-center items-center h-32">No friends yet</div>
                  ) : (
                    friends.map((friend) => (
                      <div key={friend.id} className="relative w-4/5 h-20 flex items-center justify-center border-1 m-4 rounded-full bg-white">
                        <div className="flex flex-row absolute left-5 cursor-pointer gap-4">
                          <img src={friendImage} alt="img" className="size-12 " />
                          <div className="flex items-center text-2xl">{friend.username}</div>
                        </div>
                        <div className="flex flex-row absolute right-4">
                          <div
                            className="mx-2 p-3 flex items-center justify-center rounded-full text-white border-black bg-sky-500 hover:bg-sky-400 border-1 cursor-pointer transition-all duration-100 hover:scale-110 text-sm"
                            onClick={() => handleTradeClick(friend)}
                          >
                            Trade
                          </div>
                          <div
                            className="mx-2 p-3 flex items-center justify-center rounded-full text-white border-black bg-red-500 hover:bg-red-400 border-1 cursor-pointer transition-all duration-100 hover:scale-110 text-sm"
                            onClick={() => handleUnfriendClick(friend)}
                          >
                            Unfriend
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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