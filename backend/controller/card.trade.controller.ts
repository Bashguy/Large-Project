import { ObjectId } from "mongodb";
import { collections } from "../lib/mongo.lib";

// Helper function
async function removeCardFromUser(cardCountId: any, cardId: any, cardType: any) {
  const cardCountCollection = await collections.cardCount();
  const cardCount: any = await cardCountCollection.findOne({ _id: cardCountId });
  
  const typeArray = cardCount[cardType];
  const cardIndex = typeArray.findIndex(
    (item: any) => item.uCard_Id.toString() === cardId.toString()
  );
  
  if (cardIndex === -1) {
    console.log(`Card ${cardId} not found in user's ${cardType} collection`);
  }
  
  if (typeArray[cardIndex].count > 1) {
    // Decrement count
    const updatePath = `${cardType}.${cardIndex}.count`;
    
    await cardCountCollection.updateOne(  
      { _id: cardCountId },
      { $inc: { [updatePath]: -1 } }
    );
  }
}

async function addCardToUser(cardCountId: any, cardId: any, cardType: any) {
  const cardCountCollection = await collections.cardCount();
  const cardCount: any = await cardCountCollection.findOne({ _id: cardCountId });
  
  const typeArray = cardCount[cardType];
  const existCardIndex = typeArray.findIndex(
    (item: any) => item.uCard_Id.toString() === cardId.toString()
  );
  
  if (existCardIndex !== -1) {
    // Card exists, increment count
    const updatePath = `${cardType}.${existCardIndex}.count`;
    
    await cardCountCollection.updateOne(
      { _id: cardCountId },
      { $inc: { [updatePath]: 1 } }
    );
  } else [
    
    await cardCountCollection.updateOne(
      { _id: cardCountId },
      { $push: { [cardType]: { uCard_Id: cardId as string, count: 1 } as any } }
    )
  ]
}

export const SendTradeRequest = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;
    const { friendId, cardSentId, cardWantId } = req.body;
    
    if (!friendId || !cardSentId || !cardWantId) {
      return res.status(400).json({ success: false, msg: "Friend ID, sent card ID, and wanted card ID are all required" });
    }
    
    // Get user to find trade list ID
    const userCollection = await collections.users();

    const user = await userCollection.findOne({ _id: userID });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    
    // Verify friend exists
    const friend = await userCollection.findOne({ _id: new ObjectId(friendId) });
    if (!friend) {
      return res.status(404).json({ success: false, msg: "Friend not found" });
    }
    
    // Verify user has the card to send and want
    const cardCollection = await collections.cards();
    const sentCard = await cardCollection.findOne({ _id: new ObjectId(cardSentId) });
    const wantedCard = await cardCollection.findOne({ _id: new ObjectId(cardWantId) });
    
    if (!sentCard) {
      return res.status(404).json({ success: false, msg: "Sent card not found" });
    } else if (!wantedCard) {
      return res.status(404).json({ success: false, msg: "Wanted card not found" });
    }
    
    // Verify user has the card in their collection
    const cardCountCollection = await collections.cardCount();
    const userCardCount: any = await cardCountCollection.findOne({ _id: user.cards_unlocked });
    
    const hasCard = userCardCount[sentCard.type].some(
      (item: any) => item.uCard_Id.toString() === cardSentId && item.count > 0
    );
    
    if (!hasCard) {
      return res.status(400).json({ success: false, msg: "You don't have this card to trade" });
    }
    
    // Create trade request
    const tradeListCollection = await collections.tradeList();
    
    // Generate a shared trade ID for both sent and received trades
    const sharedTradeId = new ObjectId();
    const currentDate = new Date();
    
    // Add to user's sent trades
    await tradeListCollection.updateOne(
      { _id: user.trade },
      { 
        $push: { 
          sent: {
            _id: sharedTradeId,  // Use the same ID for both trade records
            friend_Id: new ObjectId(friendId),
            card_sent: cardSentId,
            card_want: cardWantId,
            date: currentDate
          } as any
        } 
      }
    );
    
    // Add to friend's received trades
    await tradeListCollection.updateOne(
      { _id: friend.trade },
      { 
        $push: { 
          received: {
            _id: sharedTradeId,  // Use the same ID for both trade records
            friend_Id: userID,
            card_sent: cardSentId,
            card_want: cardWantId,
            date: currentDate
          } as any
        } 
      }
    );
    
    return res.status(200).json({ 
      success: true, 
      msg: "Trade request sent successfully",
      data: { tradeId: sharedTradeId }
    });
    
  } catch (error) {
    console.error("SendTradeRequest error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const GetUserTrades = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;
    
    // Get user to find trade list ID
    const userCollection = await collections.users();
    const user = await userCollection.findOne({ _id: userID });
    
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    
    const tradeListCollection = await collections.tradeList();

    // Process sent trades
    const sentPipeline = [
      // Match the user's trade document
      { $match: { _id: user.trade } },
      
      // Only keep the sent array
      { $project: { sent: 1, _id: 0 } },
      
      // Unwind to work with individual trades
      { $unwind: { path: "$sent", preserveNullAndEmptyArrays: true } },
      
      // Add fields with ObjectId conversions
      { $addFields: {
          "friendObjectId": { $toObjectId: "$sent.friend_Id" },
          "cardSentId": { $toObjectId: "$sent.card_sent" },
          "cardWantId": { $toObjectId: "$sent.card_want" }
      }},
      
      // Lookup friend info
      { $lookup: {
          from: "users",
          localField: "friendObjectId",
          foreignField: "_id",
          as: "friendInfo"
      }},
      
      // Lookup sent card details
      { $lookup: {
          from: "cards",
          localField: "cardSentId",
          foreignField: "_id",
          as: "sentCardDetails"
      }},
      
      // Lookup want card details
      { $lookup: {
          from: "cards",
          localField: "cardWantId",
          foreignField: "_id",
          as: "wantCardDetails"
      }},
      
      // Unwind the arrays with one item
      { $unwind: { path: "$friendInfo", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$sentCardDetails", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$wantCardDetails", preserveNullAndEmptyArrays: true } },
      
      // Create the final structure
      { $project: {
          _id: 0,
          id: "$sent._id",
          friend: {
            id: "$friendInfo._id",
            username: "$friendInfo.username"
          },
          cardSent: {
            id: "$sentCardDetails._id",
            name: "$sentCardDetails.name",
            image: "$sentCardDetails.image",
            description: "$sentCardDetails.description",
            type: "$sentCardDetails.type",
            stars: "$sentCardDetails.stars"
          },
          cardWant: {
            id: "$wantCardDetails._id",
            name: "$wantCardDetails.name",
            image: "$wantCardDetails.image",
            description: "$sentCardDetails.description",
            type: "$wantCardDetails.type",
            stars: "$wantCardDetails.stars"
          },
          date: "$sent.date"
      }}
    ];
    
    // Process received trades with a similar pipeline
    const receivedPipeline = [
      { $match: { _id: user.trade } },
      { $project: { received: 1, _id: 0 } },
      { $unwind: { path: "$received", preserveNullAndEmptyArrays: true } },
      { $addFields: {
          "friendObjectId": { $toObjectId: "$received.friend_Id" },
          "cardSentId": { $toObjectId: "$received.card_sent" },
          "cardWantId": { $toObjectId: "$received.card_want" }
      }},
      { $lookup: {
          from: "users",
          localField: "friendObjectId",
          foreignField: "_id",
          as: "friendInfo"
      }},
      { $lookup: {
          from: "cards",
          localField: "cardSentId",
          foreignField: "_id",
          as: "sentCardDetails"
      }},
      { $lookup: {
          from: "cards",
          localField: "cardWantId",
          foreignField: "_id",
          as: "wantCardDetails"
      }},
      { $unwind: { path: "$friendInfo", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$sentCardDetails", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$wantCardDetails", preserveNullAndEmptyArrays: true } },
      { $project: {
          _id: 0,
          id: "$received._id",
          friend: {
            id: "$friendInfo._id",
            username: "$friendInfo.username"
          },
          cardOffered: {
            id: "$sentCardDetails._id",
            name: "$sentCardDetails.name",
            image: "$sentCardDetails.image",
            description: "$sentCardDetails.description",
            type: "$sentCardDetails.type",
            stars: "$sentCardDetails.stars"
          },
          cardWanted: {
            id: "$wantCardDetails._id",
            name: "$wantCardDetails.name",
            image: "$wantCardDetails.image",
            description: "$wantCardDetails.description",
            type: "$wantCardDetails.type",
            stars: "$wantCardDetails.stars"
          },
          date: "$received.date"
      }}
    ];
    
    // Run both pipelines in parallel
    const [sentTrades, receivedTrades] = await Promise.all([
      tradeListCollection.aggregate(sentPipeline).toArray(),
      tradeListCollection.aggregate(receivedPipeline).toArray()
    ]);
    
    return res.status(200).json({
      success: true,
      data: {
        sent: sentTrades,
        received: receivedTrades
      }
    });
    
  } catch (error) {
    console.error("GetUserTrades error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const AcceptTrade = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;
    const { tradeId } = req.params;
    
    if (!tradeId) {
      return res.status(400).json({ success: false, msg: "Trade ID is required" });
    }
    
    // Get user info
    const userCollection = await collections.users();
    const user = await userCollection.findOne({ _id: userID });
    
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    
    const tradeListCollection = await collections.tradeList();
    const trades: any = await tradeListCollection.findOne({ _id: user.trade });
    
    // Find the specific trade in received trades (using the shared ID)
    const tradeIndex = trades.received.findIndex(
      (trade: any) => trade._id.toString() === tradeId
    );
    
    if (tradeIndex === -1) {
      return res.status(404).json({ success: false, msg: "Trade not found" });
    }
    
    const trade = trades.received[tradeIndex];
    
    // Get friend's info
    const friend = await userCollection.findOne({ _id: trade.friend_Id });
    if (!friend) {
      return res.status(404).json({ success: false, msg: "Friend not found" });
    }
    
    // Verify both users still have the respective cards
    const cardCountCollection = await collections.cardCount();
    const userCardCount: any = await cardCountCollection.findOne({ _id: user.cards_unlocked });
    const friendCardCount: any = await cardCountCollection.findOne({ _id: friend.cards_unlocked });
    
    // Get card details to know types
    const cardCollection = await collections.cards();
    const offeredCard: any = await cardCollection.findOne({ _id: new ObjectId(trade.card_sent) });
    const wantedCard: any = await cardCollection.findOne({ _id: new ObjectId(trade.card_want) });
    
    if (!offeredCard || !wantedCard) {
      return res.status(404).json({ success: false, msg: "One or more cards not found" });
    }
    
    // Verify user has the card to give
    const userHasCard = userCardCount[wantedCard.type].some(
      (item: any) => item.uCard_Id.toString() === wantedCard._id.toString() && item.count > 0
    );
    
    // Verify friend has the card to give
    const friendHasCard = friendCardCount[offeredCard.type].some(
      (item: any) => item.uCard_Id.toString() === offeredCard._id.toString() && item.count > 0
    );

    if (!userHasCard || !friendHasCard) {
      return res.status(400).json({ success: false, msg: "One or more required cards are no longer available" });
    }
    
    // Process the trade - Remove cards
    await removeCardFromUser(user.cards_unlocked, wantedCard._id, wantedCard.type);
    await removeCardFromUser(friend.cards_unlocked, offeredCard._id, offeredCard.type);
    
    // Process the trade - Add cards
    await addCardToUser(user.cards_unlocked, offeredCard._id, offeredCard.type);
    await addCardToUser(friend.cards_unlocked, wantedCard._id, wantedCard.type);
    
    // Remove trade from both users' trade lists using the shared ID
    await tradeListCollection.updateOne(
      { _id: user.trade },
      { $pull: { received: { _id: new ObjectId(tradeId) } as any } }
    );

    await tradeListCollection.updateOne(
      { _id: friend.trade },
      { $pull: { sent: { _id: new ObjectId(tradeId) } as any } }
    );
    
    return res.status(200).json({ 
      success: true, 
      msg: "Trade completed successfully" 
    });
    
  } catch (error) {
    console.error("AcceptTrade error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const DeclineTrade = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;
    const { tradeId } = req.params;
    
    if (!tradeId) {
      return res.status(400).json({ success: false, msg: "Trade ID is required" });
    }
    
    // Get user info
    const userCollection = await collections.users();
    const user = await userCollection.findOne({ _id: userID });
    
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    
    const tradeListCollection = await collections.tradeList();
    const trades: any = await tradeListCollection.findOne({ _id: user.trade });
    
    // Find the specific trade in received trades using the shared ID
    const tradeIndex = trades.received.findIndex(
      (trade: any) => trade._id.toString() === tradeId
    );

    if (tradeIndex === -1) {
      return res.status(404).json({ success: false, msg: "Trade not found" });
    }
    
    // Get friend's info
    const trade = trades.received[tradeIndex];
    const friend = await userCollection.findOne({ _id: trade.friend_Id });
    if (!friend) {
      return res.status(404).json({ success: false, msg: "Friend not found" });
    }
    
    // Remove trade from both users' trade lists using the shared ID
    await tradeListCollection.updateOne(
      { _id: user.trade },
      { $pull: { received: { _id: new ObjectId(tradeId) } as any } }
    );
    
    await tradeListCollection.updateOne(
      { _id: friend.trade },
      { $pull: { sent: { _id: new ObjectId(tradeId) } as any } }
    );
    
    return res.status(200).json({ 
      success: true, 
      msg: "Trade declined successfully" 
    });
    
  } catch (error) {
    console.error("DeclineTrade error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};
