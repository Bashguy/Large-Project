import { ObjectId } from "mongodb";
import { collections } from "../lib/mongo.lib";

export const GetUserCards = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;
    const { type } = req.params; // Can be 'breakfast', 'dinner', 'dessert', or undefined for all
    
    const userCollection = await collections.users();
    
    // Get user to find card_count ID
    const user = await userCollection.findOne({ _id: userID });
    
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    
    const cardCountCollection = await collections.cardCount();
    
    // Use aggregation to get populated card details
    const pipeline = [
      // Match the user's card count document
      { $match: { _id: user.cards_unlocked } },
      
      // Only keep the relevant card type array
      { $project: { [type]: 1, _id: 0 } },
      
      // Unwind to work with individual cards
      { $unwind: { path: `$${type}`, preserveNullAndEmptyArrays: true } },

      // Lookup the card details
      { $lookup: {
          from: "cards",
          localField: `${type}.uCard_Id`,
          foreignField: "_id",
          as: "cardDetails"
      }},
      
      // Unwind the cardDetails array (will contain only one item)
      { $unwind: "$cardDetails" },
      
      // Combine count with card details
      { $project: {
          _id: "$cardDetails._id",
          name: "$cardDetails.name",
          image: "$cardDetails.image",
          stars: "$cardDetails.stars",
          description: "$cardDetails.description",
          type: "$cardDetails.type",
          grid_id: "$cardDetails.grid_id",
          count: `$${type}.count`
      }},
      
      // Group all cards back together
      { $group: {
          _id: null,
          cards: { $push: "$$ROOT" }
      }},
    ];
    
    // Run aggregation
    const result = await cardCountCollection.aggregate(pipeline).toArray();
    
    // If no results, return empty array
    if (result.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }
    
    return res.status(200).json({ success: true, data: result[0].cards });
    
  } catch (error) {
    console.error("GetUserCards error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const AddCardToUserCollection = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;
    const { cardId } = req.body;
    
    if (!cardId) {
      return res.status(400).json({ success: false, msg: "Card ID is required" });
    }
    
    // Get user to find card_count ID
    const userCollection = await collections.users();
    const user = await userCollection.findOne({ _id: userID });
    
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    
    // Get card to determine type
    const cardCollection = await collections.cards();
    const card = await cardCollection.findOne({ _id: ObjectId.createFromHexString(cardId) });
    
    if (!card) {
      return res.status(404).json({ success: false, msg: "Card not found" });
    }
    
    const cardCountCollection = await collections.cardCount();
    const cardCount: any = await cardCountCollection.findOne({ _id: user.cards_unlocked });
    
    // Check if card already exists in user's collection
    const getCardArrayType = cardCount[card.type] || [];
    const cardIndex = getCardArrayType.findIndex(
      (item: any)  => item.uCard_Id.toString() === cardId
    );
    
    if (cardIndex !== -1) {
      // Card exists, increment count
      const updatePath = `${card.type}.${cardIndex}.count`;
      
      await cardCountCollection.updateOne(
        { _id: user.cards_unlocked },
        { $inc: { [updatePath]: 1 } }
      );
    } else {
      // Card doesn't exist, add it
      await cardCountCollection.updateOne(
        { _id: user.cards_unlocked },
        { $push: { [card.type]: { uCard_Id: ObjectId.createFromHexString(cardId), count: 1 } as any } }
      );
    }
    
    return res.status(200).json({ success: true, msg: "Card added to collection" });
    
  } catch (error) {
    console.error("AddCardToUserCollection error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const RemoveCardFromUserCollection = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;
    const { cardId } = req.params;
    
    if (!cardId) {
      return res.status(400).json({ success: false, msg: "Card ID is required" });
    }
    
    // Get user to find card_count ID
    const userCollection = await collections.users();
    const user = await userCollection.findOne({ _id: userID });
    
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    
    // Get card to determine type
    const cardCollection = await collections.cards();
    const card = await cardCollection.findOne({ _id: ObjectId.createFromHexString(cardId) });
    
    if (!card) {
      return res.status(404).json({ success: false, msg: "Card not found" });
    }
    
    const cardCountCollection = await collections.cardCount();
    const cardCount: any = await cardCountCollection.findOne({ _id: user.cards_unlocked });
    
    // Check if card exists in user's collection
    const getCardArrayType = cardCount[card.type] || [];
    const cardIndex = getCardArrayType.findIndex(
      (item: any) => item.uCard_Id.toString() === cardId
    );
    
    if (cardIndex === -1) {
      return res.status(404).json({ success: false, msg: "Card not in collection" });
    }
    
    const currentCount = getCardArrayType[cardIndex].count;
    
    // If the count is 0, make the card grayed out
    if (currentCount > 1) {
      // Decrement count
      const updatePath = `${card.type}.${cardIndex}.count`;
      
      await cardCountCollection.updateOne(
        { _id: user.cards_unlocked },
        { $inc: { [updatePath]: -1 } }
      );
    } else {
      return res.status(400).json({ success: false, msg: "You don't have this card.." });
    }
    
    return res.status(200).json({ success: true, msg: "Card removed from collection" });
    
  } catch (error) {
    console.error("RemoveCardFromUserCollection error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const Unlock4CardsByType = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;
    const { type } = req.params;

    const userCollection = await collections.users();
    const user = await userCollection.findOne({ _id: userID });
    
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (parseInt(user.acorns) < 25) {
      return res.status(400).json({ success: false, msg: "You don't have enough acorns!" });
    }
    
    const cardListCollection = await collections.cardList();
    
    // Get card list for the specific type
    const getTypeArray = await cardListCollection.aggregate([
      { $project: { _id: 0, selectType: `$${type}` } },
      { $lookup: {
          from: "cards",
          localField: "selectType",
          foreignField: "_id",
          as: "cardDetails"
        }
      }
    ]).toArray();

    const cardTypeList = getTypeArray[0].cardDetails;

    const cardCountCollection = await collections.cardCount();
    const result: any = [];

    // Randomly select 4 cards from the pile (includes duplicates)
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * cardTypeList.length);
      const cardInfo = cardTypeList[randomIndex];

      result.push(cardInfo);

      // Check if card already exists in user's collection
      // Update the get command for every addition
      const cardCount: any = await cardCountCollection.findOne({ _id: user.cards_unlocked });
      const getCardArrayType = cardCount[cardInfo.type] || [];
      const cardIndex = getCardArrayType.findIndex(
        (item: any)  => item.uCard_Id.toString() === cardInfo._id.toString()
      );
    
      if (cardIndex !== -1) {
        // Card exists, increment count
        const updatePath = `${cardInfo.type}.${cardIndex}.count`;
        
        await cardCountCollection.updateOne(
          { _id: user.cards_unlocked },
          { $inc: { [updatePath]: 1 } }
        );
      } else {
        // Card doesn't exist, add it
        await cardCountCollection.updateOne(
          { _id: user.cards_unlocked },
          { $push: { [cardInfo.type]: { uCard_Id: cardInfo._id, count: 1 } as any } }
        );
      }
    }
    
    return res.status(200).json({ 
      success: true, 
      data: result
    });
    
  } catch (error) {
    console.error("UnlockCardsByType error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};
