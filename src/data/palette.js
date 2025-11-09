// GIMP palette format for PICO8 secret palette
//  https://lospec.com/palette-list/pico-8-secret-palette
let gpl = ` 0	0	0	000000
73	60	43	493c2b
190	38	51	be2633
224	111	139	e06f8b
164	100	34	a46422
235	137	49	eb8931
247	226	107	f7e26b
255	255	255	ffffff
157	157	157	9d9d9d
47	72	78	2f484e
27	38	50	1b2632
68	137	26	44891a
163	206	39	a3ce27
0	87	132	005784
49	162	242	31a2f2
178	220	239	b2dcef
52	42	151	342a97
101	109	113	656d71
204	204	204	cccccc
115	41	48	732930
203	67	167	cb43a7
82	79	64	524f40
173	157	51	ad9d33
236	71	0	ec4700
250	180	11	fab40b
17	94	51	115e33
20	128	126	14807e
21	194	165	15c2a5
34	90	246	225af6
153	100	249	9964f9
247	142	214	f78ed6
244	185	144	f4b990`;

const cols = [
  'black',
  'coffee',
  'red',
  'pink',
  'brown',
  'orange',
  'lemon',
  'white',
  'gray',
  'slate',
  'midnight_blue',
  'green',
  'lime',
  'navy_blue',
  'blue',
  'pale_blue',
  'royal_purple',
  'ash_gray',
  'light_gray',
  'maroon',
  'fuchsia',
  'olive',
  'mustard',
  'flame_orange',
  'yellow',
  'emerald',
  'dark_teal',
  'aqua',
  'electric_blue',
  'lavender',
  'bubblegum',
  'flesh'
];

const palette = {};

gpl.split('\n').forEach((row, i) => {
  let parts = row.split('\t');
  let [r, g, b, hex] = parts;
  let name = cols[i];
  palette[name] = {
    r: parseInt(r, 10) / 255,
    g: parseInt(g, 10) / 255,
    b: parseInt(b, 10) / 255,
    hex: '#' + hex,
  };
  let p = palette[name];
  palette[name].col = new Color(p.r, p.g, p.b, 1);
  palette[name].mk = (o = 1) => {
    return new Color(p.r, p.g, p.b, o);
  }
})


export default palette;
