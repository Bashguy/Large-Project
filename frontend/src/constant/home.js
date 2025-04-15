import cardImage from '../assets/cards.svg';
import codeImage from '../assets/code.svg';
import friendImage from '../assets/friends.svg';
import tradeImage from '../assets/swap.svg';
import battleImage from '../assets/death.svg';

export const HomeInfo = [
    ["Gacha", cardImage, "bg-indigo-500", "Collect cards!", "/gacha"], 
    ["Code", codeImage, "bg-green-500", "CODING", "/code"], 
    ["Collection", cardImage, "bg-amber-500", "unless you're lonely", "/collection"], 
    ["Friends", friendImage, "bg-teal-500", "Trade cards", "/friends"], 
    ["Battle", battleImage, "bg-rose-500", "BATTLE WITH FRIENDS", "/battle"]
];

export const typeColors = {
    all: "bg-white",
    breakfast: "bg-teal-300 border-teal-700",
    dinner: "bg-amber-600 border-amber-900",
    dessert: "bg-purple-300 border-purple-700"
};