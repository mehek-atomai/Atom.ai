// All astronomical data used across the scene.
// Distances/sizes are artistically scaled for visibility, not to true real-world scale
// (if they were to true scale, planets would be invisible specks kilometers apart).

export const OBJECTS = {
  sun: {
    name: "The Sun",
    type: "Star (G-type Main Sequence)",
    color: 0xfff2a8,
    emissive: 0xffcc33,
    radius: 8,
    orbitRadius: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.001,
    glow: "#ffcc33",
    desc: "The Sun is the star at the center of our Solar System, a nearly perfect sphere of hot plasma. Its gravity holds the whole Solar System together, and its light takes about 8 minutes to reach Earth.",
    stats: {
      "Diameter": "1,391,000 km",
      "Surface Temp": "5,500 °C",
      "Age": "4.6 billion years",
      "Distance from Earth": "150 million km"
    },
    funFacts: [
      "The Sun's core fuses hydrogen so slowly, gram-for-gram, that it produces less heat per volume than a compost heap — it's only hot overall because it's enormous.",
      "Sound can't travel through space, but the Sun's surface actually rings like a bell — vibrations captured by 'helioseismology' reveal what's happening deep inside it.",
      "A single photon generated in the Sun's core takes tens of thousands of years (bouncing around randomly) just to reach the surface, even though it then only takes 8 minutes to reach Earth."
    ]
  },
  mercury: {
    name: "Mercury",
    type: "Terrestrial Planet",
    color: 0x9c9c9c,
    radius: 0.9,
    orbitRadius: 16,
    orbitSpeed: 0.048,
    rotationSpeed: 0.004,
    glow: "#9c9c9c",
    desc: "Mercury is the smallest and fastest planet, whizzing around the Sun in just 88 Earth days. It has almost no atmosphere, so temperatures swing wildly between scorching day and freezing night.",
    stats: { "Diameter": "4,879 km", "Day Length": "59 Earth days", "Year Length": "88 Earth days", "Moons": "0" },
    funFacts: [
      "Mercury has ice at its poles — permanently shadowed crater floors near a planet that also gets hot enough to melt lead.",
      "A day on Mercury (sunrise to sunrise) lasts about 176 Earth days — twice as long as its own year, because of its odd spin-orbit lock.",
      "If you stood on Mercury near sunset at the right spot, the Sun would briefly rise, reverse course, set, then rise again, due to its lopsided orbit speed."
    ]
  },
  venus: {
    name: "Venus",
    type: "Terrestrial Planet",
    color: 0xe8c27a,
    radius: 1.4,
    orbitRadius: 22,
    orbitSpeed: 0.035,
    rotationSpeed: 0.002,
    glow: "#e8c27a",
    desc: "Venus is Earth's 'evil twin' — similar in size, but wrapped in a thick toxic atmosphere that traps heat, making it the hottest planet in the Solar System, even hotter than Mercury.",
    stats: { "Diameter": "12,104 km", "Day Length": "243 Earth days", "Year Length": "225 Earth days", "Moons": "0" },
    funFacts: [
      "Venus spins backwards compared to almost every other planet — the Sun would rise in the west and set in the east.",
      "A year on Venus is shorter than a Venus day: it orbits the Sun in 225 Earth days but takes 243 Earth days to rotate once.",
      "Venus likely has active volcanoes today — recent radar data from old Magellan images shows changes in surface vents consistent with ongoing eruptions."
    ]
  },
  earth: {
    name: "Earth",
    type: "Terrestrial Planet",
    color: 0x2f7cff,
    radius: 1.5,
    orbitRadius: 28,
    orbitSpeed: 0.029,
    rotationSpeed: 0.02,
    glow: "#2f7cff",
    desc: "Our home. Earth is the only known planet with life, liquid water oceans, and a breathable atmosphere. Everything you have ever known has happened here.",
    stats: { "Diameter": "12,742 km", "Day Length": "24 hours", "Year Length": "365.25 days", "Moons": "1" },
    funFacts: [
      "Earth isn't a perfect sphere — it bulges at the equator, so the point farthest from Earth's center isn't Mount Everest, it's the peak of Chimborazo in Ecuador.",
      "A day used to be much shorter: about 1.4 billion years ago, an Earth day lasted only around 19 hours because the Moon was closer and Earth spun faster.",
      "Earth has a second, temporary 'quasi-moon' — small asteroids occasionally get trapped in horseshoe-shaped orbits around us for a few decades before drifting off."
    ]
  },
  mars: {
    name: "Mars",
    type: "Terrestrial Planet",
    color: 0xdd6b4d,
    radius: 1.1,
    orbitRadius: 35,
    orbitSpeed: 0.024,
    rotationSpeed: 0.018,
    glow: "#dd6b4d",
    desc: "The Red Planet, named for its rusty iron-oxide surface. Mars has the largest volcano and canyon in the Solar System, and is the main target for future human exploration.",
    stats: { "Diameter": "6,779 km", "Day Length": "24.6 hours", "Year Length": "687 Earth days", "Moons": "2" },
    funFacts: [
      "Mars has the largest dust storms in the Solar System — they can grow to engulf the entire planet for months at a time.",
      "Olympus Mons, Mars's giant volcano, is so wide (about the size of Arizona) that if you stood at its base, the slope would be too gradual to see the summit at all.",
      "Mars's two moons, Phobos and Deimos, are so small and oddly shaped that scientists think they may be captured asteroids rather than 'real' moons — and Phobos is slowly spiraling inward, doomed to crash into Mars or break apart in a few tens of millions of years."
    ]
  },
  jupiter: {
    name: "Jupiter",
    type: "Gas Giant",
    color: 0xd9b382,
    radius: 4.2,
    orbitRadius: 48,
    orbitSpeed: 0.013,
    rotationSpeed: 0.04,
    glow: "#d9b382",
    desc: "The largest planet in the Solar System, a giant ball of gas with a storm — the Great Red Spot — bigger than Earth that has raged for centuries. Jupiter's gravity acts like a shield, deflecting comets and asteroids.",
    stats: { "Diameter": "139,820 km", "Day Length": "10 hours", "Year Length": "12 Earth years", "Moons": "95" },
    funFacts: [
      "Jupiter radiates about twice as much heat as it receives from the Sun — leftover warmth from its formation, still slowly contracting under its own gravity.",
      "Jupiter has faint rings too, made of dust kicked up by meteorite impacts on its small inner moons — they're just too thin and dark to see without a spacecraft.",
      "Jupiter's magnetic field is so powerful it produces auroras hundreds of times more energetic than Earth's, and its magnetosphere would appear larger than the full Moon if you could see it from Earth."
    ]
  },
  saturn: {
    name: "Saturn",
    type: "Gas Giant",
    color: 0xe8d3a0,
    radius: 3.6,
    orbitRadius: 60,
    orbitSpeed: 0.0097,
    rotationSpeed: 0.038,
    hasRing: true,
    glow: "#e8d3a0",
    desc: "Famous for its spectacular rings made of billions of ice and rock chunks. Saturn is so light that, in theory, it could float in water.",
    stats: { "Diameter": "116,460 km", "Day Length": "10.7 hours", "Year Length": "29 Earth years", "Moons": "146" },
    funFacts: [
      "Saturn's moon Enceladus shoots geysers of water/ice out of its south pole into space — some of that spray actually feeds one of Saturn's faint outer rings.",
      "There's a persistent hexagon-shaped jet stream at Saturn's north pole, wide enough to fit several Earths inside, and no one fully understands why it stays hexagonal.",
      "Saturn's rings are surprisingly thin — on average only about 10 meters thick — despite spanning up to 280,000 km across, roughly like a sheet of paper spread across a football field."
    ]
  },
  uranus: {
    name: "Uranus",
    type: "Ice Giant",
    color: 0x9fe8e8,
    radius: 2.4,
    orbitRadius: 70,
    orbitSpeed: 0.0068,
    rotationSpeed: 0.03,
    glow: "#9fe8e8",
    desc: "Uranus is tipped on its side, rolling around the Sun like a ball rather than spinning upright. It's a cold world made of icy water, methane, and ammonia over a small rocky core.",
    stats: { "Diameter": "50,724 km", "Day Length": "17 hours", "Year Length": "84 Earth years", "Moons": "27" },
    funFacts: [
      "Uranus's moons are named after Shakespeare and Alexander Pope characters (Titania, Oberon, Miranda) instead of Greek/Roman mythology like every other planet's moons.",
      "Because Uranus is tipped almost fully on its side, each pole gets 42 years of continuous sunlight followed by 42 years of continuous darkness.",
      "Uranus was almost named 'George' — its discoverer William Herschel wanted to call it 'Georgium Sidus' after King George III."
    ]
  },
  neptune: {
    name: "Neptune",
    type: "Ice Giant",
    color: 0x4361ee,
    radius: 2.3,
    orbitRadius: 80,
    orbitSpeed: 0.0054,
    rotationSpeed: 0.032,
    glow: "#4361ee",
    desc: "The windiest planet, with storms howling at over 2,000 km/h. Neptune is so far away that it takes sunlight about 4 hours to reach it, compared to 8 minutes for Earth.",
    stats: { "Diameter": "49,244 km", "Day Length": "16 hours", "Year Length": "165 Earth years", "Moons": "16" },
    funFacts: [
      "Neptune was discovered through math, not observation — astronomers predicted its exact location from wobbles in Uranus's orbit before anyone pointed a telescope at it.",
      "Neptune has only completed one full orbit of the Sun since its discovery in 1846 — its 'first birthday' happened in 2011.",
      "It may literally rain diamonds deep inside Neptune (and Uranus) — immense pressure is thought to crush carbon compounds into diamond that sinks toward the core."
    ]
  },
  moon: {
    name: "The Moon",
    type: "Natural Satellite of Earth",
    color: 0xcfcfcf,
    radius: 0.4,
    orbitRadius: 2.6,
    orbitSpeed: 0.3,
    rotationSpeed: 0.01,
    glow: "#cfcfcf",
    desc: "Earth's only natural satellite, and the only other world humans have ever walked on. The Moon's gravity causes ocean tides on Earth.",
    stats: { "Diameter": "3,474 km", "Distance from Earth": "384,400 km", "Orbit Period": "27.3 days" },
    funFacts: [
      "The Moon is slowly drifting away from Earth, about 3.8 cm per year — roughly the speed your fingernails grow.",
      "Moonquakes are real — seismometers left by Apollo astronauts recorded moonquakes that can last for over 10 minutes, far longer than earthquakes, because the Moon's rock is drier and doesn't dampen vibrations as quickly.",
      "There's no 'dark side' of the Moon in the sense of permanent darkness — the far side gets just as much sunlight, it simply always faces away from Earth."
    ]
  },
  india: {
    name: "India",
    type: "Location on Earth",
    color: 0xff6b3d,
    glow: "#ff6b3d",
    desc: "You're looking at India, on the globe's surface. India has a rich astronomy history — ancient observatories like Jantar Mantar were built centuries ago to track the Sun, Moon, and stars using only stone instruments, no telescopes.",
    stats: {
      "Latitude": "22.0° N",
      "Longitude": "79.0° E",
      "Time Zone": "IST (UTC+5:30)",
      "Notable Site": "Jantar Mantar, Jaipur"
    },
    funFacts: [
      "The Jantar Mantar in Jaipur has a sundial accurate to about 2 seconds — built in the 1700s, entirely out of stone and masonry, no electronics.",
      "India's Aryabhata, writing around 500 CE, calculated Earth's circumference and proposed that Earth rotates on its axis — over a thousand years before this was widely accepted in Europe.",
      "India's Mars Orbiter Mission (Mangalyaan) reached Mars in 2014 on a budget of about $74 million — famously cheaper than the Hollywood movie 'Gravity'."
    ]
  },
  milkyway: {
    name: "The Milky Way",
    type: "Barred Spiral Galaxy",
    color: 0xffffff,
    glow: "#b98bff",
    desc: "Our home galaxy, containing 100–400 billion stars — including our Sun. It's shaped like a flattened spiral disc about 100,000 light-years across. From Earth, we see it edge-on as a hazy band of light across the night sky.",
    stats: { "Diameter": "~100,000 light-years", "Stars": "100–400 billion", "Our Solar System's Location": "Orion Arm", "Age": "13.6 billion years" },
    funFacts: [
      "The Milky Way is on a collision course with the Andromeda galaxy — they'll begin merging in about 4 billion years, though individual stars are so far apart that almost none will actually collide.",
      "You can't see most of the Milky Way's stars with the naked eye at once — even on the clearest night, we only see a few thousand out of hundreds of billions.",
      "Our galaxy is warped, not flat — its outer disk is bent like a wavy potato chip, likely from the gravitational tug of smaller neighboring galaxies."
    ]
  },
  blackhole: {
    name: "Sagittarius A*",
    type: "Supermassive Black Hole",
    color: 0x000000,
    glow: "#ff8b3d",
    desc: "The supermassive black hole at the very center of the Milky Way. It's so massive and dense that not even light can escape its gravity. Everything we see — stars, planets, us — orbits around the galactic center where it sits, about 26,000 light-years from Earth.",
    stats: { "Mass": "~4.3 million Suns", "Distance from Earth": "~26,000 light-years", "Event Horizon Diameter": "~24 million km" },
    funFacts: [
      "We didn't get an actual image of Sagittarius A* until 2022 — the Event Horizon Telescope had to combine radio dishes across the entire planet into one Earth-sized virtual telescope to resolve it.",
      "A star named S2 orbits Sagittarius A* at up to 3% the speed of light, swinging closer to it than Mercury does to the Sun — and its orbit has been used to test Einstein's general relativity, successfully.",
      "Despite its mass, Sagittarius A* is a surprisingly 'quiet' black hole — it's not actively feeding on much matter right now, so it's far dimmer than many supermassive black holes seen in other galaxies."
    ]
  }
};

export const PLANET_KEYS = ["mercury","venus","earth","mars","jupiter","saturn","uranus","neptune"];
