import cardImage from '../assets/cards.svg';
import codeImage from '../assets/code.svg';
import friendImage from '../assets/friends.svg';
import giftimage from '../assets/gift.svg';
import battleImage from '../assets/death.svg';

export const HomeInfo = [
    ["Gacha", giftimage, "bg-indigo-500", "Collect cards!", "/gacha"], 
    ["Code", codeImage, "bg-green-500", "CODING", "/code"], 
    ["Collection", cardImage, "bg-amber-500", "View your unlocked cards", "/collection"], 
    ["Friends", friendImage, "bg-teal-500", "Add Friends and Trade cards", "/friends"], 
    ["Battle", battleImage, "bg-rose-500", "BATTLE WITH FRIENDS", "/battle"]
];

export const typeColors = {
    all: "bg-black",
    breakfast: "bg-yellow-200 border-yellow-400",
    dinner: "bg-indigo-200 border-indigo-400", 
    dessert: "bg-pink-200 border-pink-400"
};