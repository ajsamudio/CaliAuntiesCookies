/* =========================================================
   SITE SETTINGS
   The everyday switches. Change these without touching any
   other file.

   - preordersOpen: keep false until the Orange County Class B
                    Cottage Food Operation approval comes through.
                    While false, the site is a menu showcase: it
                    shows "Online Preorders Coming Soon" instead of
                    the order form and hides the "Add to box" buttons.
                    Flip to true to turn the preorder form on.
   - boxes:         the box sizes (from the approved copy, Oct 19).
                    Also fills the "Three Levels of Temptation"
                    section and the box picker in the order form.
   - maxBoxes:      the most boxes one request can ask for (the
                    "How many boxes?" dropdown in the order form).
                    Each extra box adds to the flavor limit.
   - pickupNote:    shown under the pickup date field.
   ========================================================= */
window.SITE = {
  preordersOpen: false,
  instagram: 'caliauntiescookies',
  boxes: [
    { id: 'box-4', photo: 'assets/images/boxes/box-4.jpg', label: 'The Flirty 4-Pack', size: 4, maxFlavors: 1, price: '$18', note: 'One flavor', blurb: 'Four cookies. One flavor. A little something just for you.' },
    { id: 'box-6', photo: 'assets/images/boxes/box-6.jpg', label: 'The Sweet 6-Pack', size: 6, maxFlavors: 1, price: '$26', note: 'One flavor', blurb: 'Six cookies. One flavor. Sweet enough to share… if you\'re feeling generous.' },
    { id: 'box-12', photo: 'assets/images/boxes/box-12.jpg', label: 'The Party Dozen', size: 12, maxFlavors: 2, price: '$48', note: 'Up to two flavors', blurb: 'Twelve cookies. Up to two flavors. Because some occasions deserve a little extra temptation.' }
  ],
  maxBoxes: 10,
  pickupNote: 'Local pickup in Irvine. We\'ll confirm your pickup time and payment details when we reply.'
};

/* =========================================================
   THE MENU
   Edit this list to change the flavors shown on the site.
   The same list also fills the flavor picker in the order form.
   Names, nicknames and descriptions are the approved copy (Oct 19).

   - nickname:  shown under the name ("The Original Heartbreaker")
   - available: set to false to hide a flavor (sold out, off-season)
                without deleting it.
   - boxable:   false for items that can't go in a cookie box
                (e.g. cinnamon rolls). They show on the menu only.
   - photo / alt: the menu photo and its description for screen readers
   - photoPos:  optional CSS object-position to fine-tune the crop
   - bg:     card background color
   - dough:  [center color, edge color] for the illustrated cookies
             (preloader, decorations) and the form chip dot
   - toppings: chips, sprinkles, glaze, sugar, salt, coconut, zest
   ========================================================= */
window.FLAVORS = [
  {
    slug: 'chocolate-chip',
    name: 'Chocolate Chip',
    nickname: 'The Original Heartbreaker',
    blurb: 'A thick, buttery vanilla cookie loaded with chocolate chips. Classic, comforting, and dangerously easy to fall for.',
    bg: '#FFF1C9',
    dough: ['#EDBE7A', '#B87436'],
    toppings: { chips: '#3B1E14', chipCount: 13 },
    photo: 'assets/images/menu/chocolate-chip.jpg',
    alt: 'Thick chocolate chip cookies on a wooden board, scattered with chocolate chips',
    available: true
  },
  {
    slug: 'mm-chocolate-chip',
    name: 'M&M Chocolate Chip',
    nickname: 'The Colorful Crush',
    blurb: 'Our signature chocolate chip cookie meets a playful burst of mini M&M\'s. Colorful, chocolatey, and ready to steal your heart.',
    bg: '#E3F4FF',
    dough: ['#EDBE7A', '#B87436'],
    toppings: { chips: '#3B1E14', chipCount: 6, sprinkles: true },
    photo: 'assets/images/menu/mm-chocolate-chip.jpg',
    alt: 'Chocolate chip cookies studded with colorful mini M&M\'s on a cooling rack beside a bowl of candies',
    available: true
  },
  {
    slug: 'chocolate-mm',
    name: 'Chocolate M&M',
    nickname: 'The Double Trouble',
    blurb: 'Rich chocolate cookie dough meets colorful mini M&M\'s for a double dose of chocolatey temptation. Some trouble is just too delicious to resist.',
    bg: '#FFE4E8',
    dough: ['#5A3226', '#3B1E14'],
    toppings: { sprinkles: true, cracks: false },
    photo: 'assets/images/menu/chocolate-mm.jpg',
    alt: 'Dark chocolate cookies covered in bright M&M\'s on pink paper',
    available: true
  },
  {
    slug: 'monster',
    name: 'Monster',
    nickname: 'The Wild Child',
    blurb: 'A bold blue cookie packed with Oreo pieces and creamy white chocolate. Wildly delicious, unapologetically extra, and absolutely impossible to tame.',
    bg: '#DDF6F4',
    dough: ['#4FC9C4', '#2C9C98'],
    toppings: { chips: '#2A1A16', chipCount: 7, salt: true },
    photo: 'assets/images/menu/monster.jpg',
    alt: 'Bright blue cookies with Oreo chunks and white chocolate chips on pink paper',
    available: true
  },
  {
    slug: 'sprinklefetti',
    name: 'Sprinklefetti',
    nickname: 'The Life of the Party',
    blurb: 'A soft, buttery cookie bursting with colorful sprinkles and a whole lot of personality. No invitation needed — this sweet little showstopper IS the party.',
    bg: '#FFF4D6',
    dough: ['#F3D49A', '#C9964E'],
    toppings: { sprinkles: 'dense', cracks: false },
    photo: 'assets/images/menu/sprinklefetti.jpg',
    alt: 'Golden cookies topped with rainbow sprinkles around a heart-shaped dish of sprinkles',
    available: true
  },
  {
    slug: 'dark-chocolate',
    name: 'Dark Chocolate',
    nickname: 'The Midnight Crush',
    blurb: 'A thick, rich chocolate cookie with a soft, decadent center. Dark, dreamy, and the kind of temptation that keeps you coming back for one more bite.',
    bg: '#F1E6F8',
    dough: ['#4A281F', '#2E1610'],
    toppings: { chips: '#7A4A3A', chipCount: 9, cracks: false },
    photo: 'assets/images/menu/dark-chocolate.jpg',
    alt: 'Dark chocolate cookies topped with chocolate chips on heart-print paper',
    available: true
  },
  {
    slug: 'smores',
    name: 'S’mores',
    nickname: 'The Fireside Flirt',
    blurb: 'A deliciously thick cookie packed with graham crackers, milk chocolate, and marshmallow sweetness. Cozy, chocolatey, and just enough sparks to keep the fire burning.',
    bg: '#FFE9D6',
    dough: ['#E4B57A', '#A86A34'],
    toppings: { chips: '#3B1E14', chipCount: 9, glaze: '#FFF8EC' },
    photo: 'assets/images/menu/smores.jpg',
    alt: 'A close-up of a S’mores cookie topped with milk chocolate squares, graham cracker and mini marshmallows on heart-print paper',
    available: true
  },
  {
    slug: 'cotton-candy',
    name: 'Cotton Candy',
    nickname: 'The Pink Daydream',
    blurb: 'A whimsical cotton candy-flavored cookie dressed in a playful shade of pink. Sweet, dreamy, and just a little magical. Go ahead, get lost in the sugar-coated fantasy.',
    bg: '#FFE4E8',
    dough: ['#FFC9D1', '#E496A6'],
    toppings: { sprinkles: 'dense', cracks: false },
    photo: 'assets/images/menu/cotton-candy.jpg',
    alt: 'Pink and blue swirled cotton candy cookies coated in sparkling sugar',
    available: true
  },
  {
    slug: 'maple-chocolate-chip',
    name: 'Maple Chocolate Chip',
    nickname: 'The Cozy Crush',
    blurb: 'A buttery, maple-kissed cookie packed with sweet maple baking chips. Warm, dreamy, and the kind of crush you\'ll want to cuddle up with all season long.',
    bg: '#FFEFD9',
    dough: ['#E8C489', '#B98446'],
    toppings: { chips: '#D99A4E', chipCount: 10 },
    photo: 'assets/images/menu/maple-chocolate-chip.jpg',
    alt: 'Maple chocolate chip cookies with maple and white chips cooling on a wire rack',
    available: true
  },
  {
    slug: 'snickerdoodle',
    name: 'Snickerdoodle',
    nickname: 'The Sweet Talker',
    blurb: 'A soft, buttery cookie kissed with cinnamon sugar. Warm, charming, and dangerously good at making you fall head over heels.',
    bg: '#FFF4E3',
    dough: ['#E9C68F', '#B98446'],
    toppings: { sugar: true },
    photo: 'assets/images/menu/snickerdoodle.jpg',
    alt: 'Cinnamon sugar snickerdoodle cookies on a cooling rack next to a bowl of sugar',
    available: true
  },
  {
    slug: 'cinnamon-rolls',
    name: 'Cinnamon Rolls',
    nickname: 'The Morning Temptation',
    blurb: 'Soft, fluffy cinnamon rolls tangled in swirls of buttery cinnamon sugar and smothered in our homemade brown butter vanilla glaze. One bite, and you\'ll understand why some temptations are worth getting out of bed for.',
    bg: '#FFF4E3',
    dough: ['#F0CF98', '#C58A4A'],
    toppings: { glaze: '#FFFDF5', sugar: true },
    photo: 'assets/images/menu/cinnamon-rolls.jpg',
    alt: 'Glazed cinnamon rolls in a pan, with a close-up of one dripping with brown butter vanilla glaze',
    available: true,
    boxable: false
  }
];
