import { NewgroundsMedal } from "../lib/newgrounds";

let medalData = [
  {
    name: 'Buddy',
    info: 'Play with a friend',
    icon: '😎',
    id: 87233,
  },
  {
    name: 'Achiever',
    info: 'Get a new HiScore',
    icon: '💸',
    id: 87234,
  },
  {
    name: 'Power',
    info: 'Achieve max powerups',
    icon: '⚡',
    id: 87235,
  },
  {
    name: 'Spelunker',
    info: 'Survive the caves',
    icon: '🦇',
    id: 87236,
  },
  {
    name: 'Champion',
    info: 'Beat the game',
    icon: '🏆',
    id: 87237,
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
