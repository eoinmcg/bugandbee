import keys from "../data/keys";

export default function postScore(score, game) {
  // console.log({
  //   message: 'post score',
  //   score: score,
  //   isNewgrounds: game.isNewgrounds
  // });
  game.ng.postScore(keys.ScoreBoard, score);
}

