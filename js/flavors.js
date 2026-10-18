/* =========================================================
   SITE SETTINGS
   The everyday switches. Change these without touching any
   other file.

   - preordersOpen: keep false until the Orange County Class B
                    Cottage Food Operation approval comes through.
                    While false, the site shows "Online Preorders
                    Coming Soon" instead of the order form.
                    Flip to true to turn the preorder form on.
   - boxes:         the box sizes customers can request. `price`
                    is optional text (e.g. "$18"); leave null to hide.
   - pickupNote:    shown under the pickup date field.
   ========================================================= */
window.SITE = {
  preordersOpen: false,
  instagram: 'caliauntiescookies',
  boxes: [
    { id: 'box-6', label: 'Box of 6', size: 6, maxFlavors: 1, price: null, note: 'One flavor' },
    { id: 'box-12', label: 'Box of 12', size: 12, maxFlavors: 2, price: null, note: 'Up to two flavors' }
  ],
  pickupNote: 'Local pickup in Irvine. We\'ll confirm your pickup time and payment details when we reply.'
};

/* =========================================================
   THE MENU
   Edit this list to change the flavors shown on the site.
   The same list also fills the flavor picker in the order form.

   - available: set to false to hide a flavor (sold out, off-season)
                without deleting it.
   - boxable:   false for items that can't go in a cookie box
                (e.g. cinnamon rolls). They show on the menu only.
   - photo:  set to an image path (e.g. "assets/images/flavors/chocolate-chip.jpg")
             to show a real photo instead of the illustrated cookie.
   - bg:     card background color
   - accent: sunburst color behind the cookie
   - dough:  [center color, edge color] for the illustration
   - toppings: chips, sprinkles, glaze, sugar, salt, coconut, zest

   TODO: Amanda submitted 10 cookie flavors + cinnamon rolls for
   county approval. Only the ones named so far are listed. Add the
   rest here as entries like the ones below.
   ========================================================= */
window.FLAVORS = [
  {
    slug: 'chocolate-chip',
    name: 'Classic Chocolate Chip',
    tag: 'The classic',
    blurb: 'Thick, buttery and absolutely loaded with chocolate. The one that never goes out of style.',
    notes: ['Brown sugar', 'Chocolate chips', 'Gooey center'],
    bg: '#FFF1C9',
    accent: '#FFD45E',
    dough: ['#EDBE7A', '#B87436'],
    toppings: { chips: '#3B1E14', chipCount: 13 },
    available: true,
    photo: null
  },
  {
    slug: 'monster',
    name: 'Monster',
    tag: 'Go big',
    blurb: 'Oats, peanut butter, chocolate and candy-coated chocolates, all in one cookie. Big, bold and a little out of control.',
    notes: ['Oats', 'Peanut butter', 'Candy-coated chocolate'],
    bg: '#E3F4FF',
    accent: '#8EC5FF',
    dough: ['#E8C489', '#B98446'],
    toppings: { chips: '#3B1E14', chipCount: 8, sprinkles: true },
    available: true,
    photo: null
  },
  {
    slug: 'smores',
    name: "S'mores",
    tag: 'Campfire vibes',
    blurb: 'Graham cracker cookie, melty chocolate and toasted marshmallow. No campfire required.',
    notes: ['Graham cracker', 'Marshmallow', 'Milk chocolate'],
    bg: '#FFE9D6',
    accent: '#F7B983',
    dough: ['#E4B57A', '#A86A34'],
    toppings: { chips: '#3B1E14', chipCount: 9, glaze: '#FFF8EC' },
    available: true,
    photo: null
  },
  {
    slug: 'cotton-candy',
    name: 'Cotton Candy',
    tag: 'Pure nostalgia',
    blurb: 'Soft, sweet and pretty in pink, with a sprinkle of fun. Tastes like the county fair.',
    notes: ['Cotton candy', 'Vanilla', 'Sprinkles'],
    bg: '#FFE4E8',
    accent: '#FFB0B9',
    dough: ['#FFC9D1', '#E496A6'],
    toppings: { sprinkles: 'dense', cracks: false },
    available: true,
    photo: null
  },
  {
    slug: 'cinnamon-rolls',
    name: 'Cinnamon Rolls',
    tag: 'Not a cookie (shh)',
    blurb: 'Soft, swirly, homemade cinnamon rolls with sweet icing. Ask about them when you preorder.',
    notes: ['Cinnamon sugar', 'Soft dough', 'Sweet icing'],
    bg: '#FFF4E3',
    accent: '#F2C98C',
    dough: ['#F0CF98', '#C58A4A'],
    toppings: { glaze: '#FFFDF5', sugar: true },
    available: true,
    boxable: false,
    photo: null
  }
];
