/* =========================================================
   THE MENU
   Edit this list to change the flavors shown on the site.
   The same list also fills the flavor picker in the order form.

   - photo:  set to an image path (e.g. "assets/images/flavors/og-auntie.jpg")
             to show a real photo instead of the illustrated cookie.
   - bg:     card background color
   - accent: sunburst color behind the cookie
   - dough:  [center color, edge color] for the illustration
   - toppings: chips, sprinkles, glaze, sugar, salt, coconut, zest
   ========================================================= */
window.FLAVORS = [
  {
    slug: 'og-auntie',
    name: 'The OG Auntie',
    tag: 'Fan favorite',
    blurb: 'Brown butter, a ridiculous amount of chocolate, and a sprinkle of flaky sea salt. The one that started it all.',
    notes: ['Brown butter', 'Dark chocolate', 'Sea salt'],
    bg: '#FFF1C9',
    accent: '#FFD45E',
    dough: ['#EDBE7A', '#B87436'],
    toppings: { chips: '#3B1E14', chipCount: 12, salt: true },
    photo: null
  },
  {
    slug: 'pretty-in-pink',
    name: 'Pretty in Pink',
    tag: 'Most photographed',
    blurb: 'Soft strawberry sugar cookie, pink vanilla glaze and a confetti of sprinkles. Basically a personality.',
    notes: ['Strawberry', 'Vanilla glaze', 'Sprinkles'],
    bg: '#FFE1EA',
    accent: '#FF9DC0',
    dough: ['#FBD3DD', '#E59AAE'],
    toppings: { glaze: '#FF7FAE', sprinkles: true, cracks: false },
    photo: null
  },
  {
    slug: 'birthday-suit',
    name: 'Birthday Suit',
    tag: 'Party starter',
    blurb: 'Buttery vanilla cake-batter cookie, absolutely loaded with rainbow sprinkles. No birthday required.',
    notes: ['Cake batter', 'Vanilla', 'Rainbow sprinkles'],
    bg: '#DDF6EC',
    accent: '#9FE3C8',
    dough: ['#F7E0B5', '#DDB27A'],
    toppings: { sprinkles: 'dense' },
    photo: null
  },
  {
    slug: 'snicker-sass',
    name: 'Snicker-Sass',
    tag: 'Auntie approved',
    blurb: 'A pillowy snickerdoodle rolled in cinnamon sugar, with a little extra attitude.',
    notes: ['Cinnamon sugar', 'Cream of tartar', 'Soft center'],
    bg: '#FFE9D6',
    accent: '#F7B983',
    dough: ['#EFCB92', '#C4894D'],
    toppings: { sugar: true },
    photo: null
  },
  {
    slug: 'ube-mine',
    name: 'Ube Mine',
    tag: 'Cali classic',
    blurb: 'Purple yam cookie with white chocolate chunks and toasted coconut. Love at first bite.',
    notes: ['Ube', 'White chocolate', 'Toasted coconut'],
    bg: '#EEE3FB',
    accent: '#C9A8F2',
    dough: ['#CDAAE8', '#8E62B9'],
    toppings: { chips: '#FFF5E4', chipCount: 9, coconut: true },
    photo: null
  },
  {
    slug: 'lemon-drop',
    name: "Lemon Drop It Like It's Hot",
    tag: 'Seasonal',
    blurb: 'Bright lemon-zest cookie with a tangy glaze. Sunshine you can eat, no SPF needed.',
    notes: ['Lemon zest', 'Tangy glaze', 'Sunshine'],
    bg: '#FFF7C2',
    accent: '#FFE36B',
    dough: ['#FBE6A0', '#E2BB54'],
    toppings: { glaze: '#FFFDF2', zest: true },
    photo: null
  }
];
