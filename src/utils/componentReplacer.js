// This module provides logical component replacements for activities

// Map of activity types to appropriate components - all visually demonstrable for charades
const activityComponentMap = {
  // Cooking/Food related activities (all mimeable)
  "cooking": [
    // Objects (all can be mimed)
    "pot", "pan", "spatula", "whisk", "bowl", "spoon", "knife", "cutting board", "plate", "fork", "oven", "stove", "mixer", "blender", "grater", "peeler", "measuring cup", "measuring spoon", "timer", "recipe", "apron", "oven mitt", "tongs", "ladle", "colander", "strainer",
    // People/Roles (all can be acted out)
    "chef", "sous chef", "pastry chef", "line cook", "kitchen assistant", "food critic", "culinary instructor", "food blogger"
  ],
  
  "baking": [
    // Objects (all mimeable)
    "flour", "sugar", "eggs", "butter", "milk", "mixing bowl", "whisk", "spatula", "measuring cup", "measuring spoon", "rolling pin", "baking sheet", "oven", "timer", "mixer", "sifter", "cooling rack", "cake pan", "muffin tin", "piping bag", "frosting", "sprinkles", "vanilla extract", "chocolate chips",
    // People/Roles (all can be acted out)
    "baker", "pastry chef", "cake decorator", "baking instructor", "food stylist", "dessert blogger"
  ],
  
  // Specific Cooking Activities (all mimeable)
  "sushi": [
    "sushi rice", "seaweed", "bamboo mat", "raw fish", "wasabi", "soy sauce", "rice paddle", "sharp knife", "cutting board", "ginger", "sushi chef", "fish supplier", "restaurant owner"
  ],
  
  "grilling": [
    "grill", "charcoal", "propane tank", "grill brush", "tongs", "spatula", "meat thermometer", "marinade", "barbecue sauce", "smoke chips", "grill master", "butcher", "outdoor chef"
  ],
  
  "brewing": [
    "fermentation tank", "hops", "barley", "yeast", "brew kettle", "airlock", "hydrometer", "thermometer", "bottle capper", "sanitizer", "brewer", "beer judge", "maltster"
  ],
  
  "pasta": [
    "pasta machine", "flour", "eggs", "rolling pin", "pasta cutter", "drying rack", "large pot", "colander", "olive oil", "pasta chef", "italian grandmother", "pasta instructor"
  ],
  
  "sandwich": [
    "bread", "meat", "cheese", "lettuce", "tomato", "mayonnaise", "mustard", "cutting board", "knife", "toaster", "sandwich press", "deli worker", "sandwich artist", "food truck owner"
  ],
  
  "cocktail": [
    "shaker", "jigger", "muddler", "strainer", "bar spoon", "ice", "liquor", "mixer", "garnish", "cocktail glass", "bartender", "mixologist", "bar manager", "spirits distributor"
  ],
  
  // Arts & Crafts activities (highly mimeable)
  "painting": [
    // Objects (all can be mimed)
    "canvas", "brush", "paint", "palette", "easel", "water jar", "cloth", "smock", "pencil", "eraser", "sketch pad", "reference photo", "masking tape", "frame", "varnish", "sponge", "spray bottle", "color wheel", "dropper", "paint tube",
    // People/Roles (all can be acted out)
    "artist", "painter", "art instructor", "art critic", "gallery owner", "art student", "portrait subject"
  ],
  
  "drawing": [
    // Objects (all mimeable)
    "pencil", "paper", "eraser", "sharpener", "ruler", "compass", "marker", "pen", "sketchbook", "charcoal", "blending stump", "clipboard", "desk lamp", "template", "tracing paper", "ink bottle", "colored pencil set",
    // People/Roles (all can be acted out)
    "illustrator", "sketch artist", "cartoonist", "comic artist", "drawing instructor", "art student"
  ],
  
  "crafting": [
    // Objects (all mimeable)
    "scissors", "glue stick", "construction paper", "cardboard", "masking tape", "ruler", "marker", "string", "ribbon", "fabric", "needle", "thread", "beads", "wire", "pliers", "acrylic paint", "paintbrush", "template", "stickers", "buttons", "yarn", "felt sheet",
    // People/Roles (all can be acted out)
    "craft instructor", "DIY enthusiast", "craft blogger", "jewelry maker", "scrapbooker", "quilter"
  ],
  
  "knitting": [
    "knitting needles", "yarn", "pattern", "stitch marker", "tape measure", "yarn swift", "ball winder", "cable needle", "stitch holder", "row counter", "knitter", "yarn store owner", "pattern designer", "wool producer"
  ],
  
  "sculpting": [
    "clay", "sculpting tools", "armature", "kiln", "pottery wheel", "glaze", "carving knife", "chisel", "mallet", "plaster", "sculptor", "ceramics teacher", "gallery curator", "art collector"
  ],
  
  "embroidery": [
    "embroidery hoop", "embroidery floss", "needle", "fabric", "pattern", "scissors", "thimble", "pin cushion", "embroiderer", "textile artist", "fashion designer", "craft store owner"
  ],
  
  // Building/Construction activities (highly mimeable)
  "building": [
    // Objects (all can be mimed)
    "hammer", "nail", "screwdriver", "screw", "power drill", "saw", "lumber", "measuring tape", "level", "square", "pencil", "sandpaper", "clamp", "workbench", "safety goggles", "work gloves", "blueprint", "ladder", "paint can", "paintbrush",
    // People/Roles (all can be acted out)
    "architect", "construction worker", "carpenter", "contractor", "project manager", "building inspector", "electrician", "plumber"
  ],
  
  "repairing": [
    // Objects (all mimeable)
    "screwdriver", "wrench", "pliers", "hammer", "tape measure", "level", "spare parts", "instruction manual", "lubricant oil", "replacement part", "super glue", "clamp", "multimeter", "flashlight", "safety glasses", "work gloves", "electrical wire", "duct tape", "battery", "fuse",
    // People/Roles (all can be acted out)
    "mechanic", "repair technician", "handyman", "electrician", "plumber", "appliance repair person", "computer technician"
  ],
  
  "woodworking": [
    "table saw", "router", "chisel", "hand plane", "wood glue", "clamp", "sanding block", "wood stain", "varnish", "wood lathe", "carpenter", "furniture maker", "woodworking instructor", "lumber supplier"
  ],
  
  "plumbing": [
    "pipe wrench", "plumber's tape", "pipe cutter", "soldering iron", "drain snake", "plunger", "pipe", "fitting", "valve", "water meter", "plumber", "apprentice", "building inspector", "homeowner"
  ],
  
  "electrical": [
    "wire stripper", "voltage tester", "electrical tape", "wire nuts", "circuit breaker", "junction box", "conduit", "outlet", "switch", "fuse box", "electrician", "electrical engineer", "safety inspector", "lighting designer"
  ],
  
  // Gardening/Outdoor activities (all mimeable)
  "gardening": [
    // Objects (all can be mimed)
    "shovel", "rake", "hoe", "trowel", "seed packet", "potting soil", "watering can", "gardening gloves", "sun hat", "kneeling pad", "wheelbarrow", "pruning shears", "seedling", "plant pot", "fertilizer", "garden hose", "sprinkler", "weed puller",
    // People/Roles (all can be acted out)
    "gardener", "landscaper", "horticulturist", "garden designer", "botanist", "plant nursery owner", "garden blogger"
  ],
  
  "planting": [
    // Objects (all mimeable)
    "seed packet", "potting soil", "terracotta pot", "trowel", "watering can", "gardening gloves", "fertilizer", "plant label", "spray bottle", "pruning shears", "seedling", "bulb", "root ball", "garden bed", "compost", "mulch", "plant stake", "garden twine",
    // People/Roles (all can be acted out)
    "gardener", "landscaper", "botanist", "garden center employee", "plant enthusiast", "urban farmer"
  ],
  
  "landscaping": [
    "lawn mower", "edger", "hedge trimmer", "leaf blower", "sprinkler system", "sod roller", "landscape fabric", "mulch", "decorative stone", "landscape plan", "landscaper", "landscape architect", "irrigation specialist", "tree surgeon"
  ],
  
  "pruning": [
    "pruning shears", "loppers", "pruning saw", "hedge trimmer", "garden gloves", "ladder", "tree wound dressing", "branch collar", "growth bud", "pruning guide", "arborist", "tree surgeon", "gardener", "orchard manager"
  ],
  
  // Cleaning activities (highly mimeable)
  "cleaning": [
    // Objects (all can be mimed)
    "vacuum cleaner", "mop", "broom", "feather duster", "microfiber cloth", "cleaning spray", "bucket", "sponge", "rubber gloves", "dish soap", "laundry detergent", "scrub brush", "toilet brush", "trash bag", "paper towel roll", "plunger", "window squeegee", "bleach bottle",
    // People/Roles (all can be acted out)
    "cleaning person", "housekeeper", "janitor", "maid", "cleaning service owner", "home organizer", "cleaning blogger"
  ],
  
  "vacuuming": [
    "vacuum cleaner", "vacuum attachment", "power cord", "dust bag", "carpet", "floor vent", "furniture leg", "vacuum filter", "carpet freshener", "edge tool", "housekeeper", "cleaning technician", "carpet cleaner", "pet owner"
  ],
  
  "dusting": [
    "feather duster", "microfiber cloth", "extendable duster", "furniture polish", "compressed air can", "dust mask", "step stool", "bookshelf", "ceiling fan", "picture frame", "housekeeper", "cleaning service", "museum curator", "antique collector"
  ],
  
  "organizing": [
    "storage bin", "label maker", "shelving unit", "drawer divider", "hanging organizer", "sorting box", "file folder", "storage system", "decluttering guide", "donation box", "professional organizer", "minimalist coach", "storage consultant", "home stager"
  ],
  
  // Sports/Exercise activities (highly mimeable)
  "tennis": [
    "tennis racket", "tennis ball", "tennis court", "tennis net", "tennis shoes", "sweatband", "water bottle", "tennis bag", "ball machine", "line judge", "tennis player", "tennis coach", "umpire", "ball boy"
  ],
  
  "basketball": [
    "basketball", "basketball hoop", "backboard", "court", "basketball shoes", "jersey", "whistle", "scoreboard", "shot clock", "referee", "point guard", "center", "coach", "team captain"
  ],
  
  "baseball": [
    "baseball", "baseball bat", "baseball glove", "baseball cap", "pitcher's mound", "home plate", "baseball diamond", "dugout", "catcher's mask", "umpire", "pitcher", "catcher", "outfielder", "coach"
  ],
  
  "soccer": [
    "soccer ball", "soccer goal", "soccer field", "soccer cleats", "shin guards", "goalkeeper gloves", "corner flag", "penalty spot", "referee whistle", "soccer player", "goalkeeper", "striker", "midfielder", "coach"
  ],
  
  "golf": [
    "golf club", "golf ball", "golf tee", "golf bag", "golf cart", "putting green", "sand trap", "fairway", "golf glove", "scorecard", "golfer", "caddie", "golf instructor", "groundskeeper"
  ],
  
  "swimming": [
    "swimsuit", "swim cap", "goggles", "kickboard", "lane line", "diving board", "starting block", "pool", "swim fins", "stopwatch", "swimmer", "swim coach", "lifeguard", "diving judge"
  ],
  
  "running": [
    "running shoes", "running shorts", "water bottle", "stopwatch", "race bib", "starting line", "finish line", "running track", "energy gel", "heart rate monitor", "runner", "track coach", "race director", "physical therapist"
  ],
  
  "cycling": [
    "bicycle", "helmet", "cycling shorts", "water bottle", "bike pump", "bike chain", "bike pedal", "cycling shoes", "bike path", "bike rack", "cyclist", "bike mechanic", "tour guide", "race official"
  ],
  
  "yoga": [
    "yoga mat", "yoga block", "yoga strap", "meditation cushion", "yoga pants", "yoga studio", "incense", "yoga pose", "breathing technique", "relaxation music", "yoga instructor", "meditation guide", "studio owner", "wellness coach"
  ],
  
  "weightlifting": [
    "barbell", "dumbbell", "weight plate", "weight bench", "squat rack", "lifting belt", "chalk", "gym mirror", "spotter", "workout plan", "weightlifter", "personal trainer", "gym owner", "competition judge"
  ],
  
  // Music activities (all mimeable)
  "guitar": [
    "acoustic guitar", "guitar pick", "guitar string", "guitar tuner", "capo", "guitar strap", "amplifier", "effects pedal", "guitar case", "sheet music", "guitarist", "guitar teacher", "sound engineer", "music producer"
  ],
  
  "piano": [
    "piano", "piano bench", "sheet music", "metronome", "sustain pedal", "piano key", "music stand", "piano tuner", "recording device", "concert hall", "pianist", "piano teacher", "composer", "audience member"
  ],
  
  "drums": [
    "drum set", "drum stick", "drum head", "cymbal", "hi-hat", "drum throne", "drum key", "drum brush", "practice pad", "metronome", "drummer", "percussion teacher", "band member", "sound technician"
  ],
  
  "singing": [
    "microphone", "lyrics sheet", "vocal warm-up", "recording booth", "stage", "backing track", "pitch pipe", "sheet music", "vocal coach", "audience", "singer", "choir director", "recording engineer", "talent scout"
  ],
  
  "composing": [
    "music sheet", "piano keyboard", "staff paper", "pencil", "eraser", "headphones", "reference recordings", "music theory book", "metronome", "instrument samples", "composer", "arranger", "music publisher", "performer"
  ],
  
  // Technology activities (visible actions)
  "coding": [
    "laptop", "keyboard", "mouse", "monitor", "code editor", "programming language", "debugging tool", "version control", "documentation", "coffee mug", "software developer", "project manager", "QA tester", "UX designer"
  ],
  
  "filming": [
    // Objects (all mimeable)
    "video camera", "tripod", "microphone", "lighting kit", "green screen", "movie script", "costume rack", "makeup kit", "camera lens", "memory card", "camera battery", "director's monitor", "clapperboard", "filming location", "boom microphone", "green screen backdrop",
    // People/Roles (all can be acted out)
    "film director", "actor", "actress", "camera operator", "cinematographer", "script supervisor", "makeup artist", "costume designer", "stunt coordinator", "film producer"
  ],
  
  "editing": [
    // Objects (all mimeable)
    "computer", "editing software", "mouse", "keyboard", "monitors", "footage", "audio track", "editing timeline", "visual effect", "transition effect", "text overlay", "motion graphic", "export button", "backup drive", "headphones", "reference video", "client feedback", "deadline calendar",
    // People/Roles (all can be acted out)
    "video editor", "film editor", "post-production supervisor", "colorist", "sound designer", "visual effects artist", "motion graphics designer"
  ],
  
  "photography": [
    "camera", "camera lens", "tripod", "memory card", "camera flash", "light meter", "reflector", "backdrop", "photo subject", "photo location", "photographer", "photo assistant", "model", "photo editor"
  ],
  
  "gaming": [
    "gaming console", "controller", "gaming PC", "gaming headset", "gaming chair", "game disc", "game download", "gaming monitor", "gaming keyboard", "gaming mouse", "gamer", "game developer", "esports player", "game streamer"
  ],
  
  // Outdoor/Adventure activities (all mimeable)
  "camping": [
    // Objects (all can be mimed)
    "tent", "sleeping bag", "hiking backpack", "camping stove", "lantern", "flashlight", "waterproof matches", "freeze-dried food", "water bottle", "trail map", "compass", "pocket knife", "paracord", "first aid kit", "insect repellent", "sunscreen", "hiking hat", "hiking boots",
    // People/Roles (all can be acted out)
    "camp counselor", "wilderness guide", "park ranger", "outdoor instructor", "survival expert", "hiking partner", "trail leader"
  ],
  
  "hiking": [
    // Objects (all mimeable)
    "hiking boots", "backpack", "trail map", "compass", "water bottle", "trail mix", "sun hat", "sunscreen lotion", "trekking pole", "binoculars", "camera", "first aid kit", "emergency whistle", "rain jacket", "base layer", "hiking trail", "guidebook",
    // People/Roles (all can be acted out)
    "trail guide", "hiking instructor", "park ranger", "nature photographer", "birdwatcher", "mountaineer", "hiking partner"
  ],
  
  "fishing": [
    "fishing rod", "fishing reel", "fishing line", "fishing hook", "fishing bait", "tackle box", "fishing net", "fishing boat", "life jacket", "fish finder", "angler", "fishing guide", "boat captain", "fish monger"
  ],
  
  "hunting": [
    "hunting rifle", "ammunition", "hunting blind", "camouflage clothing", "game call", "hunting knife", "binoculars", "hunting license", "scent blocker", "tree stand", "hunter", "hunting guide", "game warden", "taxidermist"
  ],
  
  "birdwatching": [
    "binoculars", "bird guide book", "spotting scope", "camera with zoom lens", "field notebook", "bird call app", "camouflage clothing", "bird feeder", "bird house", "observation blind", "ornithologist", "bird guide", "conservation biologist", "bird photographer"
  ],
  
  // Professional activities (mimeable actions)
  "surgery": [
    // Objects (all can be mimed)
    "scalpel", "surgical forceps", "retractor", "suture needle", "surgical thread", "surgical scissors", "surgical gloves", "surgical mask", "operating table", "anesthesia machine", "vital monitor", "surgical light", "sterilized gauze", "surgical tray", "IV drip", "blood pressure cuff", "stethoscope", "surgical gown",
    // People/Roles (all can be acted out)
    "surgeon", "anesthesiologist", "surgical nurse", "operating room technician", "medical resident", "medical student", "patient", "hospital administrator"
  ],
  
  "teaching": [
    "textbook", "whiteboard", "marker", "lesson plan", "student desk", "teacher's desk", "projector", "assignment", "test paper", "grade book", "teacher", "student", "teaching assistant", "school principal"
  ],
  
  "lawyering": [
    "law book", "legal brief", "court document", "evidence folder", "legal pad", "pen", "law office", "courtroom", "judge's bench", "witness stand", "lawyer", "paralegal", "judge", "client"
  ],
  
  "writing": [
    "laptop", "notebook", "pen", "reference book", "thesaurus", "coffee mug", "desk lamp", "writing desk", "manuscript", "publishing contract", "writer", "editor", "literary agent", "publisher"
  ],
  
  "researching": [
    "research paper", "laboratory equipment", "microscope", "data set", "reference material", "notebook", "computer", "research grant", "experiment setup", "research findings", "researcher", "research assistant", "peer reviewer", "grant committee"
  ],
  
  // Transportation activities (highly mimeable)
  "driving": [
    "car", "steering wheel", "car key", "seat belt", "gas pedal", "brake pedal", "gear shift", "dashboard", "windshield", "rear-view mirror", "driver", "passenger", "driving instructor", "traffic officer"
  ],
  
  "flying": [
    "airplane", "cockpit", "control yoke", "instrument panel", "runway", "flight plan", "navigation chart", "headset", "altimeter", "fuel gauge", "pilot", "co-pilot", "flight attendant", "air traffic controller"
  ],
  
  "sailing": [
    "sailboat", "sail", "rudder", "compass", "life jacket", "anchor", "nautical chart", "wind indicator", "boat hook", "mooring line", "sailor", "captain", "first mate", "harbor master"
  ],
  
  "motorcycling": [
    "motorcycle", "helmet", "leather jacket", "motorcycle gloves", "motorcycle boots", "throttle", "brake lever", "clutch", "motorcycle chain", "spark plug", "motorcyclist", "mechanic", "riding instructor", "motorcycle club member"
  ],
  
  // Entertainment activities (perfect for charades)
  "acting": [
    "script", "stage", "costume", "prop", "makeup", "stage light", "microphone", "stage direction", "rehearsal space", "audience seating", "actor", "actress", "director", "stage manager"
  ],
  
  "dancing": [
    "dance floor", "dance shoes", "music", "choreography notes", "mirror", "ballet barre", "dance costume", "stage", "spotlight", "audience", "dancer", "choreographer", "dance instructor", "dance partner"
  ],
  
  "magic": [
    "magic wand", "playing cards", "magic hat", "magic prop", "stage costume", "smoke machine", "hidden compartment", "audience volunteer", "stage curtain", "misdirection technique", "magician", "assistant", "audience member", "magic consultant"
  ],
  
  // General/Miscellaneous activities (all mimeable)
  "assembling": [
    // Objects (all can be mimed)
    "component parts", "instruction manual", "screwdriver", "wrench", "bolt", "nut", "washer", "allen key", "rubber mallet", "pliers", "wood glue", "tape measure", "bubble level", "assembly diagram", "parts box", "packaging material", "warranty card", "user manual",
    // People/Roles (all can be acted out)
    "assembly technician", "furniture assembler", "quality control inspector", "product designer", "technical writer", "customer service representative"
  ],
  
  "studying": [
    "textbook", "notebook", "highlighter", "flashcard", "study guide", "desk lamp", "calculator", "reference book", "study schedule", "practice test", "student", "tutor", "professor", "study group member"
  ],
  
  "presenting": [
    "slideshow", "laser pointer", "presentation notes", "microphone", "projector", "presentation remote", "podium", "conference room", "audience seating", "feedback form", "presenter", "audience member", "event organizer", "technical support"
  ],
  
  "interviewing": [
    "question list", "recording device", "notepad", "pen", "interview location", "microphone", "camera", "consent form", "business card", "portfolio", "interviewer", "interviewee", "producer", "research subject"
  ],
  
  // Default components for any activity - all mimeable
  "default": [
    // Objects (all can be mimed)
    "wooden mallet", "steel pliers", "leather gloves", "safety goggles", "digital timer", "measuring tape", "precision scale", "utility knife", "magnifying glass", "clipboard", "instruction manual", "reference guide", "protective mask", "storage container", "carrying case", "extension cord", "work table", "adjustable lamp",
    // People/Roles (all can be acted out)
    "instructor", "assistant", "supervisor", "manager", "specialist", "consultant", "expert", "apprentice", "trainee", "mentor", "student", "professional"
  ]
};

// List of celebrities and famous movie characters for replacements - all recognizable for charades
const celebritiesAndCharacters = [
  // Actors/Actresses (easily recognizable)
  "Tom Hanks", "Meryl Streep", "Leonardo DiCaprio", "Jennifer Lawrence", "Denzel Washington", 
  "Brad Pitt", "Angelina Jolie", "Robert Downey Jr.", "Scarlett Johansson",
  "Dwayne Johnson", "Emma Stone", "Keanu Reeves", "Sandra Bullock", "Will Smith",
  "Johnny Depp", "Morgan Freeman", "Julia Roberts",
  "Samuel L. Jackson", "Tom Cruise", "Hugh Jackman",
  "Jennifer Aniston", "Chris Hemsworth", "Ryan Reynolds", "Emma Watson",
  
  // Directors/Filmmakers (recognizable)
  "Steven Spielberg", "Martin Scorsese", "Quentin Tarantino", "Christopher Nolan", 
  "James Cameron", "Wes Anderson", "Peter Jackson",
  
  // Musicians (easily mimeable)
  "Beyoncé", "Taylor Swift", "Ed Sheeran", "Adele", "Bruno Mars", 
  "Lady Gaga", "Justin Bieber", "Rihanna", "Drake", "Ariana Grande",
  "Billie Eilish", "The Weeknd", "Kendrick Lamar", "Katy Perry", 
  "Harry Styles", "Dua Lipa", "BTS", "Bad Bunny",
  
  // Athletes (recognizable movements)
  "LeBron James", "Serena Williams", "Cristiano Ronaldo", "Simone Biles", "Tom Brady", 
  "Lionel Messi", "Michael Phelps", "Usain Bolt",
  "Stephen Curry", "Rafael Nadal", "Tiger Woods",
  "Novak Djokovic",
  
  // TV Personalities (recognizable)
  "Oprah Winfrey", "Ellen DeGeneres", "Jimmy Fallon", "Trevor Noah", "Stephen Colbert", 
  "Jimmy Kimmel", "RuPaul", "Gordon Ramsay",
  
  // Famous Movie Characters (highly mimeable)
  "Iron Man", "Wonder Woman", "Harry Potter", "Princess Leia", "James Bond", 
  "Black Panther", "Hermione Granger", "Indiana Jones", "Captain Marvel", "Darth Vader",
  "Batman", "Katniss Everdeen", "Spider-Man", "Black Widow", "Captain America",
  "Thor", "Doctor Strange", "Harley Quinn",
  "Gandalf", "Gollum", "Frodo Baggins", "Aragorn", "Legolas",
  "Luke Skywalker", "Han Solo", "Yoda", "Obi-Wan Kenobi", "Chewbacca",
  "Sherlock Holmes", "Hannibal Lecter", "Ellen Ripley", "Forrest Gump", "Jack Sparrow",
  "Neo", "Trinity", "Morpheus", "John Wick", "Ethan Hunt",
  "Rocky Balboa", "Terminator", "Marty McFly", "Doc Brown", "E.T.",
  
  // Animated Characters (distinctive and mimeable)
  "Mickey Mouse", "Elsa", "Buzz Lightyear", "Woody", "Shrek", 
  "Moana", "Simba", "Mulan", "Aladdin", "Ariel",
  "Spongebob Squarepants", "Homer Simpson", "Bart Simpson", "Peter Griffin", "Stewie Griffin",
  "Rick Sanchez", "Morty Smith", "Bugs Bunny", "Daffy Duck"
];

// Helper function to determine the activity type from the activity verb
const determineActivityType = (activityVerb) => {
  // Convert to lowercase for case-insensitive matching
  const verb = activityVerb.toLowerCase();
  
  // Check for specific activities first (more specific matching)
  if (verb.includes("tennis")) return "tennis";
  if (verb.includes("basketball")) return "basketball";
  if (verb.includes("baseball")) return "baseball";
  if (verb.includes("soccer")) return "soccer";
  if (verb.includes("golf")) return "golf";
  if (verb.includes("swimming")) return "swimming";
  if (verb.includes("running")) return "running";
  if (verb.includes("cycling")) return "cycling";
  if (verb.includes("yoga")) return "yoga";
  if (verb.includes("weightlifting") || verb.includes("lifting weights")) return "weightlifting";
  
  if (verb.includes("guitar")) return "guitar";
  if (verb.includes("piano")) return "piano";
  if (verb.includes("drums") || verb.includes("drumming")) return "drums";
  if (verb.includes("singing") || verb.includes("vocal")) return "singing";
  if (verb.includes("composing") || verb.includes("composition")) return "composing";
  
  if (verb.includes("sushi")) return "sushi";
  if (verb.includes("grill")) return "grilling";
  if (verb.includes("brewing") || verb.includes("beer")) return "brewing";
  if (verb.includes("pasta")) return "pasta";
  if (verb.includes("sandwich")) return "sandwich";
  if (verb.includes("cocktail") || verb.includes("mojito")) return "cocktail";
  
  if (verb.includes("knitting") || verb.includes("knit")) return "knitting";
  if (verb.includes("sculpting") || verb.includes("sculpture")) return "sculpting";
  if (verb.includes("embroidery") || verb.includes("embroidering")) return "embroidery";
  
  if (verb.includes("woodworking") || verb.includes("carpentry")) return "woodworking";
  if (verb.includes("plumbing")) return "plumbing";
  if (verb.includes("electrical")) return "electrical";
  
  if (verb.includes("landscaping")) return "landscaping";
  if (verb.includes("pruning")) return "pruning";
  
  if (verb.includes("vacuuming")) return "vacuuming";
  if (verb.includes("dusting")) return "dusting";
  if (verb.includes("organizing") || verb.includes("organization")) return "organizing";
  
  if (verb.includes("coding") || verb.includes("programming")) return "coding";
  if (verb.includes("photography") || verb.includes("photographing")) return "photography";
  if (verb.includes("gaming") || verb.includes("video game")) return "gaming";
  
  if (verb.includes("fishing")) return "fishing";
  if (verb.includes("hunting")) return "hunting";
  if (verb.includes("birdwatching")) return "birdwatching";
  
  if (verb.includes("teaching") || verb.includes("education")) return "teaching";
  if (verb.includes("lawyer") || verb.includes("legal") || verb.includes("court case")) return "lawyering";
  if (verb.includes("writing") || verb.includes("novel") || verb.includes("book")) return "writing";
  if (verb.includes("research") || verb.includes("studying")) return "researching";
  
  if (verb.includes("driving") || verb.includes("car")) return "driving";
  if (verb.includes("flying") || verb.includes("pilot")) return "flying";
  if (verb.includes("sailing") || verb.includes("boat")) return "sailing";
  if (verb.includes("motorcycle") || verb.includes("biking")) return "motorcycling";
  
  if (verb.includes("acting") || verb.includes("actor")) return "acting";
  if (verb.includes("dancing") || verb.includes("dance")) return "dancing";
  if (verb.includes("magic") || verb.includes("trick")) return "magic";
  
  if (verb.includes("studying") || verb.includes("study")) return "studying";
  if (verb.includes("presenting") || verb.includes("presentation")) return "presenting";
  if (verb.includes("interviewing") || verb.includes("interview")) return "interviewing";
  
  // Check for activity types (more general matching)
  for (const [type, _] of Object.entries(activityComponentMap)) {
    if (verb.includes(type)) {
      return type;
    }
  }
  
  // Check for common cooking verbs
  if (verb.includes("cook") || verb.includes("mak") || verb.includes("prepar") || 
      verb.includes("mix") || verb.includes("stir") || verb.includes("chop") ||
      verb.includes("slice") || verb.includes("dice") || verb.includes("grill") ||
      verb.includes("roast") || verb.includes("boil") || verb.includes("fry")) {
    return "cooking";
  }
  
  // Check for baking verbs
  if (verb.includes("bak") || verb.includes("knead") || verb.includes("frost") ||
      verb.includes("decorate") || verb.includes("whip") || verb.includes("cream")) {
    return "baking";
  }
  
  // Check for art verbs
  if (verb.includes("paint") || verb.includes("sketch") || verb.includes("draw") ||
      verb.includes("illustrat") || verb.includes("color") || verb.includes("design")) {
    return "painting";
  }
  
  // Check for building verbs
  if (verb.includes("build") || verb.includes("construct") || verb.includes("assemble") ||
      verb.includes("erect") || verb.includes("install") || verb.includes("create")) {
    return "building";
  }
  
  // Check for repair verbs
  if (verb.includes("fix") || verb.includes("repair") || verb.includes("mend") ||
      verb.includes("restore") || verb.includes("service") || verb.includes("maintain")) {
    return "repairing";
  }
  
  // Check for gardening verbs
  if (verb.includes("garden") || verb.includes("grow") || verb.includes("cultivat") ||
      verb.includes("weed") || verb.includes("prune") || verb.includes("harvest")) {
    return "gardening";
  }
  
  // Check for cleaning verbs
  if (verb.includes("clean") || verb.includes("wash") || verb.includes("scrub") ||
      verb.includes("dust") || verb.includes("vacuum") || verb.includes("mop") ||
      verb.includes("polish") || verb.includes("sanitize")) {
    return "cleaning";
  }
  
  // Check for playing verbs
  if (verb.includes("play") || verb.includes("compet") || verb.includes("game") ||
      verb.includes("match") || verb.includes("sport")) {
    return "playing";
  }
  
  // Check for music verbs
  if (verb.includes("sing") || verb.includes("perform") || verb.includes("play music") ||
      verb.includes("concert") || verb.includes("recital") || verb.includes("band")) {
    return "performing";
  }
  
  // Check for filming verbs
  if (verb.includes("film") || verb.includes("shoot") || verb.includes("record") ||
      verb.includes("direct") || verb.includes("produce") || verb.includes("movie")) {
    return "filming";
  }
  
  // Check for outdoor verbs
  if (verb.includes("camp") || verb.includes("hike") || verb.includes("climb") ||
      verb.includes("trek") || verb.includes("backpack") || verb.includes("outdoor")) {
    return "camping";
  }
  
  // Check for medical verbs
  if (verb.includes("surg") || verb.includes("operat") || verb.includes("transplant") ||
      verb.includes("remov") || verb.includes("implant")) {
    return "surgery";
  }
  
  if (verb.includes("diagnos") || verb.includes("examin") || verb.includes("check") ||
      verb.includes("test") || verb.includes("scan") || verb.includes("screen")) {
    return "diagnosing";
  }
  
  // Check for performance verbs
  if (verb.includes("danc") || verb.includes("choreograph") || verb.includes("ballet")) {
    return "dancing";
  }
  
  if (verb.includes("act") || verb.includes("perform") || verb.includes("portray") ||
      verb.includes("character") || verb.includes("role")) {
    return "acting";
  }
  
  // Default to "default" if no specific type is found
  return "default";
};

// Check if a component is a person/role
const isPersonOrRole = (component) => {
  // List of common person/role indicators
  const personRoleIndicators = [
    "er", "or", "ist", "ian", "ent", "ant", "ive", "ee", "man", "woman", 
    "person", "people", "assistant", "expert", "professional", "specialist",
    "teacher", "student", "master", "coach", "instructor", "guide", "leader",
    "chef", "artist", "doctor", "nurse", "driver", "pilot", "captain",
    "director", "producer", "manager", "supervisor", "consultant", "advisor",
    "player", "actor", "actress", "dancer", "singer", "writer", "author",
    "designer", "developer", "engineer", "technician", "mechanic", "operator",
    "agent", "representative", "associate", "partner", "member", "owner",
    "critic", "enthusiast", "blogger", "vlogger", "influencer", "creator"
  ];
  
  // Convert to lowercase for case-insensitive matching
  const lowerComponent = component.toLowerCase();
  
  // Check if the component ends with common person/role suffixes
  for (const indicator of personRoleIndicators) {
    if (lowerComponent.endsWith(indicator) || lowerComponent.includes(indicator)) {
      return true;
    }
  }
  
  // Explicit list of person/role components that might not be caught by the suffix check
  const explicitPersonRoles = [
    "chef", "sous chef", "cook", "baker", "artist", "painter", "doctor", "nurse",
    "teacher", "student", "coach", "player", "actor", "actress", "dancer", "singer",
    "writer", "author", "designer", "developer", "engineer", "technician", "mechanic",
    "driver", "pilot", "captain", "director", "producer", "manager", "supervisor",
    "consultant", "advisor", "agent", "representative", "associate", "partner",
    "member", "owner", "critic", "enthusiast", "blogger", "vlogger", "influencer",
    "creator", "guide", "instructor", "master", "expert", "professional", "specialist",
    "assistant", "helper", "aide", "apprentice", "intern", "trainee", "mentor",
    "tutor", "professor", "dean", "principal", "president", "CEO", "CFO", "CTO",
    "COO", "VP", "director", "manager", "supervisor", "team lead", "coordinator",
    "analyst", "specialist", "consultant", "advisor", "counselor", "therapist",
    "psychologist", "psychiatrist", "physician", "surgeon", "nurse", "paramedic",
    "EMT", "firefighter", "police officer", "detective", "agent", "guard", "security",
    "soldier", "sailor", "airman", "marine", "officer", "general", "admiral",
    "captain", "commander", "lieutenant", "sergeant", "corporal", "private"
  ];
  
  // Check if the component is in the explicit list
  if (explicitPersonRoles.includes(lowerComponent)) {
    return true;
  }
  
  return false;
};

// Get a random celebrity or character for replacement
const getRandomCelebrityOrCharacter = (usedWords) => {
  // Convert usedWords to lowercase for case-insensitive comparison
  const usedWordsLower = new Set(Array.from(usedWords).map(word => word.toLowerCase()));
  
  // Filter out celebrities/characters that have been used before
  const availableCelebrities = celebritiesAndCharacters.filter(celeb => 
    !usedWordsLower.has(celeb.toLowerCase())
  );
  
  // If we have no available celebrities, generate a random name
  if (availableCelebrities.length === 0) {
    const firstNames = ["James", "Emma", "Michael", "Olivia", "Robert", "Sophia", "William", "Ava", "David", "Isabella"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${randomFirstName} ${randomLastName}`;
  }
  
  // Get a random celebrity/character from available ones
  const randomIndex = Math.floor(Math.random() * availableCelebrities.length);
  return availableCelebrities[randomIndex];
};

// Get a random component that is appropriate for the activity
export const getRandomComponent = (activityVerb) => {
  // Determine the activity type
  const activityType = determineActivityType(activityVerb);
  
  // Get the appropriate components for this activity type
  const components = activityComponentMap[activityType] || activityComponentMap["default"];
  
  // Choose a random component
  const randomIndex = Math.floor(Math.random() * components.length);
  return components[randomIndex];
};

// Get a random component that is appropriate for the activity and not already used
export const getUniqueRandomComponent = (activityVerb, existingComponents = [], usedWords = new Set()) => {
  // Determine the activity type
  const activityType = determineActivityType(activityVerb);
  
  // Get the appropriate components for this activity type
  const allComponents = activityComponentMap[activityType] || activityComponentMap["default"];
  
  // Convert usedWords to lowercase for case-insensitive comparison
  const usedWordsLower = new Set(Array.from(usedWords).map(word => word.toLowerCase()));
  
  // Convert existingComponents to lowercase for case-insensitive comparison
  const existingComponentsLower = existingComponents.map(comp => comp.toLowerCase());
  
  // Filter out components that are already in use or have been used before
  const availableComponents = allComponents.filter(component => 
    !existingComponentsLower.includes(component.toLowerCase()) &&
    !usedWordsLower.has(component.toLowerCase())
  );
  
  // If we've exhausted all components for this activity type, try the default category
  if (availableComponents.length === 0) {
    const defaultComponents = activityComponentMap["default"].filter(component => 
      !existingComponentsLower.includes(component.toLowerCase()) &&
      !usedWordsLower.has(component.toLowerCase())
    );
    
    // If even the default category is exhausted, generate a completely unique component
    if (defaultComponents.length === 0) {
      // Generate a more specific component name based on the activity type
      const specificItems = {
        "cooking": ["wooden spoon", "chef's hat", "oven mitt", "kitchen timer"],
        "baking": ["rolling pin", "cookie cutter", "cake pan", "measuring cup"],
        "surgery": ["surgical mask", "stethoscope", "surgical gloves", "bandage"],
        "painting": ["paint brush", "palette", "easel", "canvas"],
        "default": ["tool", "equipment", "accessory", "implement"]
      };
      
      const specificList = specificItems[activityType] || specificItems["default"];
      const randomSpecific = specificList[Math.floor(Math.random() * specificList.length)];
      return `${randomSpecific} #${Math.floor(Math.random() * 100) + 1}`;
    }
    
    const randomIndex = Math.floor(Math.random() * defaultComponents.length);
    return defaultComponents[randomIndex];
  }
  
  // Choose a random component from the available ones
  const randomIndex = Math.floor(Math.random() * availableComponents.length);
  return availableComponents[randomIndex];
};

// Generate a set of unique components for an activity
export const generateUniqueComponents = (activityVerb, count = 3, usedWords = new Set()) => {
  const components = [];
  
  for (let i = 0; i < count; i++) {
    const component = getUniqueRandomComponent(activityVerb, components, usedWords);
    components.push(component);
  }
  
  return components;
};

// Export additional functions for use in other modules
export { 
  activityComponentMap, 
  determineActivityType, 
  isPersonOrRole, 
  getRandomCelebrityOrCharacter,
  celebritiesAndCharacters
};
