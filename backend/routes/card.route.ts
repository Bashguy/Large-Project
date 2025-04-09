import express from "express";
import {
    CreateCard,
    GetCardsByType,
    GetCardById
} from "../controller/card.manage.controller";
import {
    GetUserCards,
    AddCardToUserCollection,
    RemoveCardFromUserCollection,
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
// router.get("/:cardId", GetCardById);

// Protected routes - User's card collection
router.get("/collection/:type?", securityRoute, GetUserCards);
router.post("/collection/add", securityRoute, AddCardToUserCollection);
router.delete("/collection/:cardId", securityRoute, RemoveCardFromUserCollection);
    
// Trade routes
router.post("/trade", securityRoute, SendTradeRequest);
router.get("/trades", securityRoute, GetUserTrades);
router.post("/trade/accept/:tradeId", securityRoute, AcceptTrade);
router.post("/trade/decline/:tradeId", securityRoute, DeclineTrade);

export default router;