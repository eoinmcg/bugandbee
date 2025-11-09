// Change canvas background via CSS
// Call without param to reset
// @param {string} style - css class name
export default function changeBg(style = '') {
  let cs = document.querySelectorAll('canvas');
  cs[0].className = style;
}
