import express from "express";
import {
    CreateCard,
    GetCardCounts,
    GetCardsByType
} from "../controller/card.manage.controller";
import {
    GetUserCards,
    AddCardToUserCollection,
    Unlock4CardsByType,
    RemoveCardFromUserCollection,
    GetFriendCards
} from "../controller/card.user.controller";
import {
    SendTradeRequest,
    GetUserTrades,
    AcceptTrade,
    DeclineTrade
} from "../controller/card.trade.controller";
import { securityRoute } from "../middleware/auth.middleware";

const router = express.Router();

// Admin routes
router.post("/create", CreateCard);

// Public routes
router.get("/type/:type", GetCardsByType);
router.get("/count", GetCardCounts)
// router.get("/:cardId", GetCardById);

// Protected routes - User's card collection
router.get("/collection/:type?", securityRoute, GetUserCards);
router.get("/friend-collection/:friendId/:type?", securityRoute, GetFriendCards);
router.post("/collection/add", securityRoute, AddCardToUserCollection);
router.post("/collection/unlock/:type", securityRoute, Unlock4CardsByType);
router.delete("/collection/:cardId", securityRoute, RemoveCardFromUserCollection);
    
// Trade routes
router.post("/trade", securityRoute, SendTradeRequest);
router.get("/trades", securityRoute, GetUserTrades);
router.post("/trade/accept/:tradeId", securityRoute, AcceptTrade);
router.post("/trade/decline/:tradeType/:tradeId", securityRoute, DeclineTrade);

export default router;