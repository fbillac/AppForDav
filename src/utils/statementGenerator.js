// This is a mock implementation that would normally use the OpenAI API
// In a real implementation, you would call the OpenAI API here

// Activities with components - all physically demonstrable for charades
const fullActivities = [
  // Physical activities perfect for charades
  "Building a house with hammer, nails, lumber, and cement.",
  "Baking a cake with flour, eggs, sugar, and butter.",
  "Planting a tree with shovel, seeds, water, and soil.",
  "Painting a mural with brushes, paint, canvas, and palette.",
  "Filming a movie with camera, microphone, script, and tripod.",
  "Sewing a quilt with fabric, thread, needle, and scissors.",
  "Repairing a car with wrench, screwdriver, pliers, and oil.",
  "Setting up a tent with poles, stakes, rope, and tarp.",
  "Drawing a comic with pencil, ink, eraser, and markers.",
  "Cooking pasta with pot, water, salt, and strainer.",
  "Cleaning a room with vacuum, mop, duster, and spray.",
  "Assembling furniture with screwdriver, bolts, instructions, and wrench.",
  "Washing a car with soap, sponge, hose, and bucket.",
  "Decorating a cake with frosting, sprinkles, piping bag, and spatula.",
  "Recording music with microphone, mixer, headphones, and instruments.",
  "Fishing at a lake with rod, bait, tackle box, and net.",
  "Fixing a bicycle with wrench, pump, oil, and patches.",
  "Sketching a landscape with pencil, paper, eraser, and charcoal.",
  "Creating a sculpture with clay, tools, kiln, and glaze.",
  "Making candles with wax, wicks, molds, and scents.",
  "Gardening in spring with shovel, seeds, watering can, and gloves.",
  "Flying a kite with string, frame, paper, and tail.",
  "Playing guitar with pick, strings, tuner, and amplifier.",
  "Practicing yoga with mat, blocks, strap, and towel.",
  "Editing a video with computer, software, footage, and audio.",
  "Playing tennis with racket, balls, net, and court.",
  "Climbing a wall with harness, rope, carabiners, and chalk.",
  "Photographing nature with camera, lens, tripod, and filters.",
  "Knitting a sweater with yarn, needles, pattern, and scissors.",
  "Teaching a class with whiteboard, markers, textbooks, and handouts.",
  "Driving a boat with steering wheel, throttle, compass, and life jackets.",
  "Carving a pumpkin with knife, scoop, marker, and candle.",
  "Baking bread with flour, yeast, water, and salt.",
  "Building a bookshelf with wood, nails, saw, and sandpaper.",
  "Cooking a stew with pot, vegetables, meat, and broth.",
  "Mixing cocktails with shaker, ice, spirits, and garnishes.",
  "Running a marathon with shoes, water bottle, energy gels, and watch.",
  "Hosting a party with food, drinks, music, and decorations.",
  "Walking a dog with leash, collar, treats, and waste bags.",
  "Practicing archery with bow, arrows, target, and arm guard.",
  "Kayaking a river with paddle, life vest, spray skirt, and helmet.",
  "Diving in the ocean with mask, fins, wetsuit, and tank.",
  "Ice skating at a rink with skates, gloves, helmet, and warm clothes.",
  "Snowboarding a slope with board, boots, bindings, and goggles.",
  "Skiing a mountain with skis, poles, boots, and helmet.",
  "Composing a song with piano, guitar, notebook, and recording device.",
  "Making jewelry with beads, wire, pliers, and clasps.",
  "Playing chess with board, pieces, clock, and strategy book.",
  "Doing magic tricks with cards, coins, wand, and hat.",
  "Organizing a closet with hangers, bins, labels, and shelves.",
  "Crafting a scrapbook with paper, photos, scissors, and glue.",
  "Making pottery with clay, wheel, tools, and kiln.",
  "Installing a sink with wrench, pipes, sealant, and instructions.",
  "Baking cookies with flour, sugar, butter, and chocolate chips.",
  "Practicing meditation with cushion, timer, candle, and quiet space.",
  "Training a dog with treats, clicker, leash, and toys.",
  "Making soap with oils, lye, molds, and fragrances.",
  "Surfing a wave with surfboard, wetsuit, wax, and leash.",
  "Mowing a lawn with lawnmower, gas, gloves, and rake.",
  "Riding a horse with saddle, bridle, helmet, and boots.",
  "Painting furniture with primer, paint, brushes, and sandpaper.",
  "Building a fence with posts, panels, concrete, and level.",
  "Playing drums with sticks, drums, cymbals, and pedals.",
  "Studying biology with microscope, slides, notebook, and textbook.",
  "Sculpting clay with tools, water, kiln, and glaze.",
  "Taking photographs with camera, lens, tripod, and memory card.",
  "Launching a rocket with fuel, igniter, parachute, and launch pad.",
  "Camping in woods with tent, sleeping bag, stove, and backpack.",
  "Lighting a fireplace with matches, kindling, logs, and poker.",
  "Baking a pie with flour, butter, filling, and rolling pin.",
  "Sharpening knives with whetstone, honing rod, oil, and cloth.",
  "Grilling burgers with grill, spatula, meat, and buns.",
  "Making pancakes with flour, eggs, milk, and griddle.",
  "Bathing a baby with tub, soap, towel, and washcloth.",
  "Brushing a cat with brush, treats, towel, and comb.",
  "Feeding chickens with feed, container, water, and gloves.",
  "Cleaning windows with squeegee, spray, cloth, and ladder.",
  "Polishing shoes with polish, brush, cloth, and conditioner.",
  "Grooming a dog with clippers, brush, shampoo, and towel.",
  "Changing a tire with jack, lug wrench, spare tire, and gloves.",
  "Watering plants with watering can, water, fertilizer, and spray bottle.",
  "Building a treehouse with wood, nails, saw, and rope.",
  "Repairing a roof with shingles, nails, hammer, and ladder.",
  "Hiking a trail with boots, backpack, map, and water bottle.",
  "Watching birds with binoculars, notebook, field guide, and camera.",
  "Restoring furniture with sandpaper, stain, brushes, and varnish.",
  "Canning vegetables with jars, lids, pot, and tongs.",
  "Drawing a blueprint with ruler, pencil, compass, and paper.",
  "Setting a table with plates, utensils, napkins, and glasses.",
  "Folding laundry with basket, hangers, iron, and board.",
  "Making origami with paper, scissors, ruler, and instructions.",
  "Crocheting a blanket with yarn, hook, pattern, and scissors.",
  "Reading a novel with book, bookmark, glasses, and light.",
  "Sanding wood with sandpaper, block, mask, and goggles.",
  "Building a model with glue, paint, pieces, and tweezers.",
  "Learning to juggle with balls, instructions, video, and practice space.",
  "Rehearsing a play with script, props, costumes, and stage.",
  "Serving food with plates, utensils, trays, and napkins.",
  "Catching butterflies with net, jar, notebook, and field guide.",
  "Feeding fish with food, tank, net, and water conditioner.",
  "Installing a light with fixture, wires, screwdriver, and ladder.",
  "Mixing paint with colors, palette, brushes, and medium.",
  "Baking muffins with flour, eggs, milk, and muffin tin.",
  "Washing dishes with soap, sponge, water, and towel.",
  "Making a kite with sticks, paper, string, and tape.",
  "Assembling a puzzle with pieces, box, sorting tray, and mat.",
  "Changing light bulbs with ladder, bulbs, gloves, and switch.",
  "Filming a vlog with camera, microphone, tripod, and lights.",
  "Conducting an interview with questions, recorder, notepad, and pen.",
  "Packing a suitcase with clothes, toiletries, documents, and chargers.",
  "Making a collage with photos, glue, scissors, and paper.",
  "Painting nails with polish, remover, file, and cotton.",
  "Decorating a room with paint, furniture, accessories, and tools.",
  "Wrapping gifts with paper, tape, scissors, and ribbon.",
  "Making a bed with sheets, pillows, blanket, and comforter.",
  "Filling a bird feeder with seeds, feeder, funnel, and scoop.",
  "Cutting fabric with scissors, ruler, chalk, and pattern.",
  "Weaving a basket with reeds, water, tools, and base.",
  "Learning origami with paper, instructions, ruler, and bone folder.",
  "Mending clothes with needle, thread, scissors, and thimble.",
  "Playing violin with violin, bow, rosin, and music stand.",
  "Making hot chocolate with milk, cocoa, sugar, and whipped cream.",
  "Sweeping the floor with broom, dustpan, trash can, and vacuum.",
  "Checking tire pressure with gauge, air pump, valve caps, and chart.",
  "Replacing batteries with batteries, screwdriver, manual, and container.",
  "Shining shoes with polish, brush, cloth, and conditioner.",
  "Ironing clothes with iron, board, water, and spray.",
  "Vacuuming a rug with vacuum, attachments, cleaner, and extension cord.",
  "Organizing files with folders, labels, cabinet, and shredder.",
  "Cooking rice with rice, water, pot, and measuring cup.",
  "Boiling eggs with eggs, pot, water, and timer.",
  "Steaming vegetables with steamer, vegetables, water, and pot.",
  "Grinding coffee with grinder, beans, container, and scoop.",
  "Cutting hair with scissors, comb, clippers, and cape.",
  "Filming a documentary with camera, microphone, tripod, and lights.",
  "Making lemonade with lemons, sugar, water, and pitcher.",
  "Building a sandcastle with sand, water, bucket, and shovel.",
  "Inflating a balloon with helium, balloon, string, and regulator.",
  "Operating a forklift with controls, safety gear, load, and manual.",
  "Picking apples with basket, ladder, gloves, and clippers.",
  "Training a parrot with treats, perch, clicker, and toys.",
  "Mowing a field with mower, gas, gloves, and hat.",
  "Spreading mulch with wheelbarrow, rake, gloves, and mulch.",
  "Clearing snow with shovel, salt, gloves, and boots.",
  "Measuring rainfall with gauge, notebook, calculator, and map.",
  "Dancing ballet with shoes, music, barre, and mirror.",
  "Filming a scene with camera, microphone, script, and lights.",
  "Painting a ceiling with paint, roller, ladder, and drop cloth.",
  "Recording sound with microphone, recorder, headphones, and windscreen.",
  "Baking pizza with dough, sauce, cheese, and toppings.",
  "Replacing a faucet with wrench, sealant, faucet, and bucket.",
  "Making ice cream with cream, sugar, flavoring, and ice cream maker.",
  "Casting a fishing line with rod, reel, line, and bait.",
  "Mounting a TV with bracket, drill, level, and screws.",
  "Cleaning gutters with ladder, gloves, scoop, and hose.",
  "Shampooing a carpet with shampooer, solution, water, and brush.",
  "Moving furniture with dolly, straps, gloves, and padding.",
  "Lighting a candle with match, candle, holder, and lighter.",
  "Melting wax with pot, thermometer, wax, and stove.",
  "Making a smoothie with blender, fruit, yogurt, and ice.",
  "Changing a diaper with diaper, wipes, cream, and changing pad.",
  "Taking a selfie with phone, stick, timer, and props.",
  "Building a rocket with tubes, fins, nose cone, and engine.",
  "Repairing a clock with tools, parts, oil, and manual.",
  "Charging a battery with charger, battery, outlet, and timer.",
  "Applying makeup with brushes, foundation, eyeshadow, and lipstick.",
  "Learning guitar with guitar, picks, tuner, and instruction book.",
  "Swimming laps with goggles, cap, swimsuit, and kickboard.",
  "Pitching a baseball with glove, ball, bat, and helmet.",
  "Dancing salsa with shoes, music, partner, and dance floor.",
  "Juggling balls with concentration, rhythm, coordination, and practice.",
  "Performing gymnastics with mat, beam, bars, and chalk.",
  "Playing basketball with ball, hoop, court, and teammates.",
  "Conducting an orchestra with baton, score, podium, and musicians.",
  "Fencing a match with foil, mask, jacket, and glove.",
  "Performing a magic trick with cards, hat, wand, and assistant.",
  "Directing traffic with whistle, vest, gloves, and sign.",
  "Delivering a speech with notes, podium, microphone, and audience.",
  "Marching in a band with instrument, uniform, music, and formation.",
  "Performing surgery with scalpel, gloves, mask, and instruments.",
  "Conducting an experiment with beaker, chemicals, goggles, and notebook.",
  "Serving a tennis ball with racket, ball, court, and opponent.",
  "Throwing a javelin with spear, runway, field, and technique.",
  "Performing a ballet with shoes, costume, music, and stage.",
  "Riding a motorcycle with helmet, jacket, gloves, and boots.",
  "Chopping vegetables with knife, cutting board, vegetables, and bowl.",
  "Washing hair with shampoo, conditioner, water, and towel.",
  "Brushing teeth with toothbrush, toothpaste, water, and floss.",
  "Tying shoelaces with shoes, laces, fingers, and concentration.",
  "Skipping rope with rope, rhythm, energy, and coordination.",
  "Hula hooping with hoop, waist, rhythm, and balance.",
  "Shooting an arrow with bow, arrow, target, and focus.",
  "Throwing a frisbee with disc, wrist, aim, and field.",
  "Blowing bubbles with wand, solution, breath, and air.",
  "Flipping pancakes with pan, spatula, batter, and stove.",
  "Shuffling cards with deck, hands, table, and skill.",
  "Typing on keyboard with fingers, keys, screen, and desk.",
  "Shoveling snow with shovel, snow, path, and strength.",
  "Raking leaves with rake, leaves, yard, and bag.",
  "Hammering a nail with hammer, nail, wood, and aim.",
  "Sawing wood with saw, wood, workbench, and goggles.",
  "Painting a portrait with brush, paint, canvas, and subject.",
  "Conducting a choir with hands, music, singers, and podium.",
  "Directing a movie with camera, actors, script, and vision.",
  "Performing a handstand with hands, balance, strength, and focus.",
  "Doing a cartwheel with hands, momentum, space, and practice.",
  "Shooting a basketball with ball, hoop, aim, and technique.",
  "Serving volleyball with ball, court, net, and team.",
  "Swinging a golf club with club, ball, tee, and course.",
  "Batting a baseball with bat, ball, stance, and swing.",
  "Kicking a soccer ball with foot, ball, field, and goal.",
  "Throwing a football with ball, arm, receiver, and field."
];

// Helper function to extract components from a full activity
const extractComponents = (activity) => {
  // Extract the activity verb and components
  const match = activity.match(/^(.*?) with (.*?)\.$/);
  if (!match) return { activityVerb: activity, components: [] };
  
  const activityVerb = match[1];
  const componentsString = match[2];
  
  // Split the components string by commas and "and"
  const components = componentsString.split(/, | and /).filter(Boolean);
  
  return { activityVerb, components };
};

// Create a statement with only the specified number of components
// and format it according to the new syntax
const createStatementWithComponents = (activityVerb, components, numComponents) => {
  // If numComponents is 0 (auto), choose between 2-4
  const actualNumComponents = numComponents === 0 
    ? Math.floor(Math.random() * 3) + 2 
    : numComponents;
  
  // Ensure we don't try to use more components than available
  const count = Math.min(actualNumComponents, components.length);
  
  // Randomly select 'count' components from the available components
  const selectedComponents = [];
  const availableIndices = Array.from({ length: components.length }, (_, i) => i);
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const componentIndex = availableIndices.splice(randomIndex, 1)[0];
    selectedComponents.push(components[componentIndex]);
  }
  
  // Return the activity verb and selected components
  return {
    activityVerb,
    selectedComponents
  };
};

export const generateStatement = async (numToReplace = 0) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get a random activity from our list
  const randomIndex = Math.floor(Math.random() * fullActivities.length);
  const fullActivity = fullActivities[randomIndex];
  
  // Extract the activity verb and components
  const { activityVerb, components } = extractComponents(fullActivity);
  
  // Create a statement with only the specified number of components
  // This now returns an object with activityVerb and selectedComponents
  return createStatementWithComponents(activityVerb, components, numToReplace);
};
