import { NewgroundsMedal } from "../lib/newgrounds";

let medalData = [
  {
    name: 'Buddy',
    info: 'Play with a friend',
    icon: '😎',
    id: 0
  },
  {
    name: 'Achiever',
    info: 'Get a new HiScore',
    icon: '💸',
    id: 1
  },
  {
    name: 'Power',
    info: 'Achieve max powerups',
    icon: '⚡',
    id: 2
  },
  {
    name: 'Spelunker',
    info: 'Survive the caves',
    icon: '🦇',
    id: 3
  },
  {
    name: 'Champion',
    info: 'Beat the game',
    icon: '🏆',
    id: 4
  },
];


export default function generateMedals(gameTitle, g) {
  const medals = [];
  medalData.forEach((medal, i) => {
    medals.push(new NewgroundsMedal(i, medal.name, medal.info, medal.icon, false, g, medal.id));
  });
  medalsInit(gameTitle);
  return medals;
}

