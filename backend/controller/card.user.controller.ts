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

    if (type && ["breakfast", "dinner", "dessert"].includes(type)) {
      // Use aggregation to get populated card details
      const pipeline = [
        // Match the user's card count document
        { $match: { _id: user.cards_unlocked } },

        // Only keep the relevant card type array
        { $project: { [type]: 1, _id: 0 } },

        // Unwind to work with individual cards
        { $unwind: { path: `$${type}`, preserveNullAndEmptyArrays: true } },

        // Lookup the card details
        {
          $lookup: {
            from: "cards",
            localField: `${type}.uCard_Id`,
            foreignField: "_id",
            as: "cardDetails"
          }
        },

        // Unwind the cardDetails array (will contain only one item)
        { $unwind: "$cardDetails" },

        // Combine count with card details
        {
          $project: {
            _id: "$cardDetails._id",
            name: "$cardDetails.name",
            image: "$cardDetails.image",
            stars: "$cardDetails.stars",
            description: "$cardDetails.description",
            power: "$cardDetails.power",
            type: "$cardDetails.type",
            grid_id: "$cardDetails.grid_id",
            count: `$${type}.count`
          }
        },

        {
          $sort: {
            "stars": 1,
            "dateCreated": 1
          }
        },

        // Group all cards back together
        {
          $group: {
            _id: null,
            cards: { $push: "$$ROOT" }
          }
        },
      ];

      // Run aggregation
      const result = await cardCountCollection.aggregate(pipeline).toArray();

      // If no results, return empty array
      if (result.length === 0) {
        return res.status(200).json({ success: true, data: [] });
      }

      return res.status(200).json({ success: true, data: result[0].cards });
    } else {
      const cardCount = await cardCountCollection.findOne({ _id: user.cards_unlocked });

      if (!cardCount) {
        return res.status(200).json({ success: true, data: [] });
      }

      // Process each card type separately and then combine results
      const allCardTypes = ["breakfast", "dinner", "dessert"];
      const allCards = [];

      for (const cardType of allCardTypes) {
        if (!cardCount[cardType] || !Array.isArray(cardCount[cardType]) || cardCount[cardType].length === 0) {
          continue;
        }

        // Get all the card IDs for this type
        const cardIds = cardCount[cardType].map(item => item.uCard_Id);

        // Fetch all the card details in one query with sorting already applied
        const cardCollection = await collections.cards();
        const cardDetails: any = await cardCollection
          .find({ _id: { $in: cardIds } })
          .sort({ stars: 1, dateCreated: 1 }) // Sort at database level first
          .toArray();

        // Combine card details with count (excluding grid_id)
        const cardsWithCount = cardCount[cardType].map(item => {
          const card = cardDetails.find((c: any) => c._id.toString() === item.uCard_Id.toString());
          if (card) {
            return {
              ...card,
              count: item.count
            };
          }
          return null;
        }).filter(card => card !== null);

        // Sort the cards within this type
        cardsWithCount.sort((a: any, b: any) => {
          // First sort by stars (descending)
          if (a.stars !== b.stars) {
            return a.stars - b.stars;
          }
          // Then sort by dateCreated (descending)
          return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
        });

        // Add to the all cards array
        allCards.push(...cardsWithCount);
      }

      // Final sort of the combined cards
      allCards.sort((a: any, b: any) => {
        // First sort by stars (descending)
        if (a.stars !== b.stars) {
          return a.stars - b.stars;
        }
        // Then sort by dateCreated (descending)
        return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
      });

      return res.status(200).json({
        success: true,
        data: allCards
      });
    }

  } catch (error) {
    console.error("GetUserCards error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const GetFriendCards = async (req: any, res: any): Promise<void> => {
  try {
    // Get friendId from params
    const { friendId, type } = req.params;

    const userCollection = await collections.users();

    // Get the friend user
    const friend = await userCollection.findOne({ _id: ObjectId.createFromHexString(friendId) });

    if (!friend) {
      return res.status(404).json({ success: false, msg: "Friend not found" });
    }

    const cardCountCollection = await collections.cardCount();

    if (type && ["breakfast", "dinner", "dessert"].includes(type)) {
      // Use aggregation to get populated card details for specific type
      const pipeline = [
        // Match the friend's card count document
        { $match: { _id: friend.cards_unlocked } },

        // Only keep the relevant card type array
        { $project: { [type]: 1, _id: 0 } },

        // Unwind to work with individual cards
        { $unwind: { path: `$${type}`, preserveNullAndEmptyArrays: true } },

        // Lookup the card details
        {
          $lookup: {
            from: "cards",
            localField: `${type}.uCard_Id`,
            foreignField: "_id",
            as: "cardDetails"
          }
        },

        // Unwind the cardDetails array
        { $unwind: "$cardDetails" },

        // Combine count with card details
        {
          $project: {
            _id: "$cardDetails._id",
            name: "$cardDetails.name",
            image: "$cardDetails.image",
            stars: "$cardDetails.stars",
            description: "$cardDetails.description",
            power: "$cardDetails.power",
            type: "$cardDetails.type",
            grid_id: "$cardDetails.grid_id",
            count: `$${type}.count`
          }
        },

        {
          $sort: {
            "stars": 1,
            "dateCreated": 1
          }
        },

        // Group all cards back together
        {
          $group: {
            _id: null,
            cards: { $push: "$$ROOT" }
          }
        },
      ];

      // Run aggregation
      const result = await cardCountCollection.aggregate(pipeline).toArray();

      // If no results, return empty array
      if (result.length === 0) {
        return res.status(200).json({ success: true, data: [] });
      }

      return res.status(200).json({ success: true, data: result[0].cards });
    } else {
      // Get all card types for the friend
      const cardCount = await cardCountCollection.findOne({ _id: friend.cards_unlocked });

      if (!cardCount) {
        return res.status(200).json({ success: true, data: [] });
      }

      // Process each card type separately and then combine results
      const allCardTypes = ["breakfast", "dinner", "dessert"];
      const allCards = [];

      for (const cardType of allCardTypes) {
        if (!cardCount[cardType] || !Array.isArray(cardCount[cardType]) || cardCount[cardType].length === 0) {
          continue;
        }

        // Get all the card IDs for this type
        const cardIds = cardCount[cardType].map(item => item.uCard_Id);

        // Fetch all the card details in one query with sorting already applied
        const cardCollection = await collections.cards();
        const cardDetails: any = await cardCollection
          .find({ _id: { $in: cardIds } })
          .sort({ stars: 1, dateCreated: 1 }) // Sort at database level first
          .toArray();

        // Combine card details with count (excluding grid_id)
        const cardsWithCount = cardCount[cardType].map(item => {
          const card = cardDetails.find((c: any) => c._id.toString() === item.uCard_Id.toString());
          if (card) {
            return {
              ...card,
              count: item.count
            };
          }
          return null;
        }).filter(card => card !== null);

        // Sort the cards within this type
        cardsWithCount.sort((a: any, b: any) => {
          // First sort by stars (descending)
          if (a.stars !== b.stars) {
            return a.stars - b.stars;
          }
          // Then sort by dateCreated (descending)
          return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
        });

        // Add to the all cards array
        allCards.push(...cardsWithCount);
      }

      // Final sort of the combined cards
      allCards.sort((a: any, b: any) => {
        // First sort by stars (descending)
        if (a.stars !== b.stars) {
          return a.stars - b.stars;
        }
        // Then sort by dateCreated (descending)
        return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
      });


      return res.status(200).json({
        success: true,
        data: allCards
      });
    }

  } catch (error) {
    console.error("GetFriendCards error:", error);
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
      (item: any) => item.uCard_Id.toString() === cardId
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

    await userCollection.updateOne(
      { _id: userID },
      { $inc: { acorns: -25 } }
    );

    const cardListCollection = await collections.cardList();

    // Get card list for the specific type
    const getTypeArray = await cardListCollection.aggregate([
      { $project: { _id: 0, selectType: `$${type}` } },
      {
        $lookup: {
          from: "cards",
          localField: "selectType",
          foreignField: "_id",
          as: "cardDetails"
        }
      }
    ]).toArray();

    const cardTypeList = getTypeArray[0].cardDetails;
    const sortedCards = [...cardTypeList].sort((a: any, b: any) => a.stars - b.stars);

    const cardCountCollection = await collections.cardCount();
    const result: any = [];

    // Randomly select 4 cards from the pile (includes duplicates)
    for (let i = 0; i < 4; i++) {
      const randomValue = Math.random();
      let cardPool;
      
      if (randomValue < 0.60) {
        // 75% chance: select from first 1/4 of cards
        const oneQuarter = Math.floor(sortedCards.length * 0.25);
        cardPool = sortedCards.slice(0, oneQuarter);
      } else if (randomValue < 0.75) {
        // 50% chance: select from first 1/2 of cards
        const halfway = Math.floor(sortedCards.length / 2);
        cardPool = sortedCards.slice(0, halfway);
      } else if (randomValue < 0.85) {
        // 25% chance: select from first 3/4 of cards
        const threeQuarters = Math.floor(sortedCards.length * 0.75);
        cardPool = sortedCards.slice(0, threeQuarters);
      } else if (randomValue < 0.95) {
        // 10% chance: select from first 90% (almost all cards)
        const ninetyPercent = Math.floor(sortedCards.length * 0.9);
        cardPool = sortedCards.slice(0, ninetyPercent);
      } else {
        // 5% chance: select from any card (includes highest stars)
        cardPool = sortedCards;
      }
      
      // Get a random card from the selected pool
      const randomIndex = Math.floor(Math.random() * cardPool.length);
      const cardInfo = cardPool[randomIndex];
      result.push(cardInfo);

      // Check if card already exists in user's collection
      // Update the get command for every addition
      const cardCount: any = await cardCountCollection.findOne({ _id: user.cards_unlocked });
      const getCardArrayType = cardCount[cardInfo.type] || [];
      const cardIndex = getCardArrayType.findIndex(
        (item: any) => item.uCard_Id.toString() === cardInfo._id.toString()
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

    const updatedUser: any = await userCollection.findOne({ _id: userID });

    const { password, ...userData } = updatedUser;
    return res.status(200).json({
      success: true,
      cards: result,
      data: userData
    });

  } catch (error) {
    console.error("UnlockCardsByType error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};
