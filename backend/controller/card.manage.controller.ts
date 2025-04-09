import { ObjectId } from "mongodb";
import cloudinary from "../lib/cloudinary.lib";
import { collections } from "../lib/mongo.lib";

export const CreateCard = async (req: any, res: any): Promise<void> => {
    const { name, stars, description, type, grid_id } = req.body;
    const { file: cardImage } = req;

    // Validate required fields
    try {
      if (!name || !stars || !description || !type || !grid_id) { //  || !cardImage
        return res.status(400).json({ success: false, msg: "All fields are required" });
      }

      // Validate card type
      if (!["breakfast", "dinner", "dessert"].includes(type)) {
        return res.status(400).json({ success: false, msg: "Invalid card type" });
      }

      /* Upload image to Cloudinary
      const uploadPromise = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(cardImage.buffer);
      });

      const imageResult = await uploadPromise;
      */

      // Create card document
      const cardCollection = await collections.cards();
      const cardData = {
        name,
        stars: parseInt(stars),
        description,
        type,
        grid_id,
        // image: (imageResult as any).secure_url,
        createdAt: new Date()
      };

      const cardResult = await cardCollection.insertOne(cardData);

      // Update card list collection with the new card
      const cardListCollection = await collections.cardList();
      
      // Find or create card list
      let cardList: any = await cardListCollection.findOne({});
      
      if (!cardList) {
        // Create new card list if it doesn't exist
        cardList = { breakfast: [], dinner: [], dessert: [] };
        await cardListCollection.insertOne(cardList);
      }
      
      // Update the appropriate card type array
      await cardListCollection.updateOne(
        {},
        { $push: { [type]: cardResult.insertedId as any } }
      );

      return res.status(201).json({
        success: true,
        msg: "Card created successfully",
        data: { ...cardData, _id: cardResult.insertedId }
      });

  } catch (error) {
    console.error("CreateCard error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const GetCardsByType = async (req: any, res: any): Promise<void> => {
  try {
    const { type } = req.params;
    
    if (!type || !["breakfast", "dinner", "dessert"].includes(type)) {
      return res.status(400).json({ success: false, msg: "Valid card type is required" });
    }
    
    const cardListCollection = await collections.cardList();
    
    // Get card list for the specific type
    const result = await cardListCollection.aggregate([
      { $project: { _id: 0, cards: `$${type}` } },
      { $lookup: {
          from: "cards",
          localField: "cards",
          foreignField: "_id",
          as: "cardDetails"
        }
      }
    ]).toArray();
    
    if (result.length === 0 || !result[0].cardDetails) {
      return res.status(200).json({ success: false, data: [] });
    }
    
    return res.status(200).json({ 
      success: true, 
      data: result[0].cardDetails
    });
    
  } catch (error) {
    console.error("GetCardsByType error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const GetCardById = async (req: any, res: any): Promise<void> => {
  try {
    const { cardId } = req.params;
    
    if (!cardId) {
      return res.status(400).json({ success: false, msg: "Card ID is required" });
    }
    
    const cardCollection = await collections.cards();
    const card = await cardCollection.findOne({ _id: new ObjectId(cardId) });
    
    if (!card) {
      return res.status(404).json({ success: false, msg: "Card not found" });
    }
    
    return res.status(200).json({ success: true, data: card });
    
  } catch (error) {
    console.error("GetCardById error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};
