// Statement generator using OpenAI or fallback to local data
import openAIService from './openaiService';

// Activities with components - all physically demonstrable for charades
const fullActivities = [
  // Physical activities perfect for charades
  "Building a house with hammer, nails, lumber, cement",
  "Baking a cake with flour, eggs, sugar, butter",
  "Planting a tree with shovel, seeds, water, soil",
  "Painting a mural with brushes, paint, canvas, palette",
  "Filming a movie with camera, microphone, script, tripod",
  "Sewing a quilt with fabric, thread, needle, scissors",
  "Repairing a car with wrench, screwdriver, pliers, oil",
  "Setting up a tent with poles, stakes, rope, tarp",
  "Drawing a comic with pencil, ink, eraser, markers",
  "Cooking pasta with pot, water, salt, strainer",
  "Cleaning a room with vacuum, mop, duster, spray",
  "Assembling furniture with screwdriver, bolts, instructions, wrench",
  "Washing a car with soap, sponge, hose, bucket",
  "Decorating a cake with frosting, sprinkles, piping bag, spatula",
  "Recording music with microphone, mixer, headphones, instruments",
  "Fishing at a lake with rod, bait, tackle box, net",
  "Fixing a bicycle with wrench, pump, oil, patches",
  "Sketching a landscape with pencil, paper, eraser, charcoal",
  "Creating a sculpture with clay, tools, kiln, glaze",
  "Making candles with wax, wicks, molds, scents",
  "Gardening in spring with shovel, seeds, watering can, gloves",
  "Flying a kite with string, frame, paper, tail",
  "Playing guitar with pick, strings, tuner, amplifier",
  "Practicing yoga with mat, blocks, strap, towel",
  "Editing a video with computer, software, footage, audio",
  "Playing tennis with racket, balls, net, court",
  "Climbing a wall with harness, rope, carabiners, chalk",
  "Photographing nature with camera, lens, tripod, filters",
  "Knitting a sweater with yarn, needles, pattern, scissors",
  "Teaching a class with whiteboard, markers, textbooks, handouts",
  "Driving a boat with steering wheel, throttle, compass, life jackets",
  "Carving a pumpkin with knife, scoop, marker, candle",
  "Baking bread with flour, yeast, water, salt",
  "Building a bookshelf with wood, nails, saw, sandpaper",
  "Cooking a stew with pot, vegetables, meat, broth",
  "Mixing cocktails with shaker, ice, spirits, garnishes",
  "Running a marathon with shoes, water bottle, energy gels, watch",
  "Hosting a party with food, drinks, music, decorations",
  "Walking a dog with leash, collar, treats, waste bags",
  "Practicing archery with bow, arrows, target, arm guard",
  "Kayaking a river with paddle, life vest, spray skirt, helmet",
  "Diving in the ocean with mask, fins, wetsuit, tank",
  "Ice skating at a rink with skates, gloves, helmet, warm clothes",
  "Snowboarding a slope with board, boots, bindings, goggles",
  "Skiing a mountain with skis, poles, boots, helmet",
  "Composing a song with piano, guitar, notebook, recording device",
  "Making jewelry with beads, wire, pliers, clasps",
  "Playing chess with board, pieces, clock, strategy book",
  "Doing magic tricks with cards, coins, wand, hat",
  "Organizing a closet with hangers, bins, labels, shelves",
  "Crafting a scrapbook with paper, photos, scissors, glue",
  "Making pottery with clay, wheel, tools, kiln",
  "Installing a sink with wrench, pipes, sealant, instructions",
  "Baking cookies with flour, sugar, butter, chocolate chips",
  "Practicing meditation with cushion, timer, candle, quiet space",
  "Training a dog with treats, clicker, leash, toys",
  "Making soap with oils, lye, molds, fragrances",
  "Surfing a wave with surfboard, wetsuit, wax, leash",
  "Mowing a lawn with lawnmower, gas, gloves, rake",
  "Riding a horse with saddle, bridle, helmet, boots",
  "Painting furniture with primer, paint, brushes, sandpaper",
  "Building a fence with posts, panels, concrete, level",
  "Playing drums with sticks, drums, cymbals, pedals",
  "Studying biology with microscope, slides, notebook, textbook",
  "Sculpting clay with tools, water, kiln, glaze",
  "Taking photographs with camera, lens, tripod, memory card",
  "Launching a rocket with fuel, igniter, parachute, launch pad",
  "Camping in woods with tent, sleeping bag, stove, backpack",
  "Lighting a fireplace with matches, kindling, logs, poker",
  "Baking a pie with flour, butter, filling, rolling pin",
  "Sharpening knives with whetstone, honing rod, oil, cloth",
  "Grilling burgers with grill, spatula, meat, buns",
  "Making pancakes with flour, eggs, milk, griddle",
  "Bathing a baby with tub, soap, towel, washcloth",
  "Brushing a cat with brush, treats, towel, comb",
  "Feeding chickens with feed, container, water, gloves",
  "Cleaning windows with squeegee, spray, cloth, ladder",
  "Polishing shoes with polish, brush, cloth, conditioner",
  "Grooming a dog with clippers, brush, shampoo, towel",
  "Changing a tire with jack, lug wrench, spare tire, gloves",
  "Watering plants with watering can, water, fertilizer, spray bottle",
  "Building a treehouse with wood, nails, saw, rope",
  "Repairing a roof with shingles, nails, hammer, ladder",
  "Hiking a trail with boots, backpack, map, water bottle",
  "Watching birds with binoculars, notebook, field guide, camera",
  "Restoring furniture with sandpaper, stain, brushes, varnish",
  "Canning vegetables with jars, lids, pot, tongs",
  "Drawing a blueprint with ruler, pencil, compass, paper",
  "Setting a table with plates, utensils, napkins, glasses",
  "Folding laundry with basket, hangers, iron, board",
  "Making origami with paper, scissors, ruler, instructions",
  "Crocheting a blanket with yarn, hook, pattern, scissors",
  "Reading a novel with book, bookmark, glasses, light",
  "Sanding wood with sandpaper, block, mask, goggles",
  "Building a model with glue, paint, pieces, tweezers",
  "Learning to juggle with balls, instructions, video, practice space",
  "Rehearsing a play with script, props, costumes, stage",
  "Serving food with plates, utensils, trays, napkins",
  "Catching butterflies with net, jar, notebook, field guide",
  "Feeding fish with food, tank, net, water conditioner",
  "Installing a light with fixture, wires, screwdriver, ladder",
  "Mixing paint with colors, palette, brushes, medium",
  "Baking muffins with flour, eggs, milk, muffin tin",
  "Washing dishes with soap, sponge, water, towel",
  "Making a kite with sticks, paper, string, tape",
  "Assembling a puzzle with pieces, box, sorting tray, mat",
  "Changing light bulbs with ladder, bulbs, gloves, switch",
  "Filming a vlog with camera, microphone, tripod, lights",
  "Conducting an interview with questions, recorder, notepad, pen",
  "Packing a suitcase with clothes, toiletries, documents, chargers",
  "Making a collage with photos, glue, scissors, paper",
  "Painting nails with polish, remover, file, cotton",
  "Decorating a room with paint, furniture, accessories, tools",
  "Wrapping gifts with paper, tape, scissors, ribbon",
  "Making a bed with sheets, pillows, blanket, comforter",
  "Filling a bird feeder with seeds, feeder, funnel, scoop",
  "Cutting fabric with scissors, ruler, chalk, pattern",
  "Weaving a basket with reeds, water, tools, base",
  "Learning origami with paper, instructions, ruler, bone folder",
  "Mending clothes with needle, thread, scissors, thimble",
  "Playing violin with violin, bow, rosin, music stand",
  "Making hot chocolate with milk, cocoa, sugar, whipped cream",
  "Sweeping the floor with broom, dustpan, trash can, vacuum",
  "Checking tire pressure with gauge, air pump, valve caps, chart",
  "Replacing batteries with batteries, screwdriver, manual, container",
  "Shining shoes with polish, brush, cloth, conditioner",
  "Ironing clothes with iron, board, water, spray",
  "Vacuuming a rug with vacuum, attachments, cleaner, extension cord",
  "Organizing files with folders, labels, cabinet, shredder",
  "Cooking rice with rice, water, pot, measuring cup",
  "Boiling eggs with eggs, pot, water, timer",
  "Steaming vegetables with steamer, vegetables, water, pot",
  "Grinding coffee with grinder, beans, container, scoop",
  "Cutting hair with scissors, comb, clippers, cape",
  "Filming a documentary with camera, microphone, tripod, lights",
  "Making lemonade with lemons, sugar, water, pitcher",
  "Building a sandcastle with sand, water, bucket, shovel",
  "Inflating a balloon with helium, balloon, string, regulator",
  "Operating a forklift with controls, safety gear, load, manual",
  "Picking apples with basket, ladder, gloves, clippers",
  "Training a parrot with treats, perch, clicker, toys",
  "Mowing a field with mower, gas, gloves, hat",
  "Spreading mulch with wheelbarrow, rake, gloves, mulch",
  "Clearing snow with shovel, salt, gloves, boots",
  "Measuring rainfall with gauge, notebook, calculator, map",
  "Dancing ballet with shoes, music, barre, mirror",
  "Filming a scene with camera, microphone, script, lights",
  "Painting a ceiling with paint, roller, ladder, drop cloth",
  "Recording sound with microphone, recorder, headphones, windscreen",
  "Baking pizza with dough, sauce, cheese, toppings",
  "Replacing a faucet with wrench, sealant, faucet, bucket",
  "Making ice cream with cream, sugar, flavoring, ice cream maker",
  "Casting a fishing line with rod, reel, line, bait",
  "Mounting a TV with bracket, drill, level, screws",
  "Cleaning gutters with ladder, gloves, scoop, hose",
  "Shampooing a carpet with shampooer, solution, water, brush",
  "Moving furniture with dolly, straps, gloves, padding",
  "Lighting a candle with match, candle, holder, lighter",
  "Melting wax with pot, thermometer, wax, stove",
  "Making a smoothie with blender, fruit, yogurt, ice",
  "Changing a diaper with diaper, wipes, cream, changing pad",
  "Taking a selfie with phone, stick, timer, props",
  "Building a rocket with tubes, fins, nose cone, engine",
  "Repairing a clock with tools, parts, oil, manual",
  "Charging a battery with charger, battery, outlet, timer",
  "Applying makeup with brushes, foundation, eyeshadow, lipstick",
  "Learning guitar with guitar, picks, tuner, instruction book",
  "Swimming laps with goggles, cap, swimsuit, kickboard",
  "Pitching a baseball with glove, ball, bat, helmet",
  "Dancing salsa with shoes, music, partner, dance floor",
  "Juggling balls with concentration, rhythm, coordination, practice",
  "Performing gymnastics with mat, beam, bars, chalk",
  "Playing basketball with ball, hoop, court, teammates",
  "Conducting an orchestra with baton, score, podium, musicians",
  "Fencing a match with foil, mask, jacket, glove",
  "Performing a magic trick with cards, hat, wand, assistant",
  "Directing traffic with whistle, vest, gloves, sign",
  "Delivering a speech with notes, podium, microphone, audience",
  "Marching in a band with instrument, uniform, music, formation",
  "Performing surgery with scalpel, gloves, mask, instruments",
  "Conducting an experiment with beaker, chemicals, goggles, notebook",
  "Serving a tennis ball with racket, ball, court, opponent",
  "Throwing a javelin with spear, runway, field, technique",
  "Performing a ballet with shoes, costume, music, stage",
  "Riding a motorcycle with helmet, jacket, gloves, boots",
  "Chopping vegetables with knife, cutting board, vegetables, bowl",
  "Washing hair with shampoo, conditioner, water, towel",
  "Brushing teeth with toothbrush, toothpaste, water, floss",
  "Tying shoelaces with shoes, laces, fingers, concentration",
  "Skipping rope with rope, rhythm, energy, coordination",
  "Hula hooping with hoop, waist, rhythm, balance",
  "Shooting an arrow with bow, arrow, target, focus",
  "Throwing a frisbee with disc, wrist, aim, field",
  "Blowing bubbles with wand, solution, breath, air",
  "Flipping pancakes with pan, spatula, batter, stove",
  "Shuffling cards with deck, hands, table, skill",
  "Typing on keyboard with fingers, keys, screen, desk",
  "Shoveling snow with shovel, snow, path, strength",
  "Raking leaves with rake, leaves, yard, bag",
  "Hammering a nail with hammer, nail, wood, aim",
  "Sawing wood with saw, wood, workbench, goggles",
  "Painting a portrait with brush, paint, canvas, subject",
  "Conducting a choir with hands, music, singers, podium",
  "Directing a movie with camera, actors, script, vision",
  "Performing a handstand with hands, balance, strength, focus",
  "Doing a cartwheel with hands, momentum, space, practice",
  "Shooting a basketball with ball, hoop, aim, technique",
  "Serving volleyball with ball, court, net, team",
  "Swinging a golf club with club, ball, tee, course",
  "Batting a baseball with bat, ball, stance, swing",
  "Kicking a soccer ball with foot, ball, field, goal",
  "Throwing a football with ball, arm, receiver, field"
];

// Helper function to extract components from a full activity
const extractComponents = (activity) => {
  // Extract the activity verb and components
  const match = activity.match(/^(.*?) with (.*?)$/);
  if (!match) return { activityVerb: activity, components: [] };
  
  const activityVerb = match[1];
  const componentsString = match[2];
  
  // Split the components string by commas
  const components = componentsString.split(/, /).filter(Boolean);
  
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

// Try to use OpenAI, fall back to local data if not available
export const generateStatement = async (numToReplace = 0) => {
  try {
    // Try to use OpenAI if it's initialized
    if (openAIService.initialized) {
      // Generate activity with OpenAI
      const numComponents = numToReplace === 0 ? Math.floor(Math.random() * 3) + 2 : numToReplace;
      const result = await openAIService.generateActivity(numComponents);
      
      // Format the result to match our expected structure
      return {
        activityVerb: result.activityVerb,
        selectedComponents: result.components
      };
    } else {
      // Fall back to local data
      console.log("OpenAI not initialized, using local data");
      return fallbackGenerateStatement(numToReplace);
    }
  } catch (error) {
    console.error("Error using OpenAI, falling back to local data:", error);
    return fallbackGenerateStatement(numToReplace);
  }
};

// Fallback to local data if OpenAI is not available
const fallbackGenerateStatement = async (numToReplace = 0) => {
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
