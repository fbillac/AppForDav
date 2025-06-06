import OpenAI from "openai";

// OpenAI service for generating content
class OpenAIService {
  constructor() {
    this.openai = null;
    this.initialized = false;
  }

  initialize(apiKey) {
    if (!apiKey) {
      console.error("OpenAI API key is required");
      return false;
    }

    try {
      // Validate API key format (basic check)
      if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
        console.error("Invalid API key format");
        return false;
      }

      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Required for browser environments
      });
      
      this.initialized = true;
      console.log("OpenAI service initialized successfully");
      return true;
    } catch (error) {
      console.error("Error initializing OpenAI:", error);
      return false;
    }
  }

  async generateActivity(numComponents = 3) {
    if (!this.initialized) {
      throw new Error("OpenAI service not initialized");
    }

    try {
      const prompt = `Generate a physically demonstrable activity for a charades game with exactly ${numComponents} logical components.
Format the response as a JSON object with the following structure:
{
  "activityVerb": "The activity (e.g., 'Building a house')",
  "components": ["component1", "component2", "component3"]
}
The activity must be something that can be physically acted out. 

IMPORTANT: The components must be SPECIFIC, TANGIBLE objects, roles, or locations that would logically be used in the activity.
- Use specific physical objects/tools (e.g., "hammer" not "tool", "chef's knife" not "equipment")
- Use specific rooms (e.g., "kitchen" not "room", "operating theater" not "medical facility")
- Use specific people or occupations (e.g., "surgeon" not "medical professional", "quarterback" not "player")

AVOID vague or categorical terms like "equipment", "supplies", "materials", "tools", "items", etc.

Examples of good components:
- For "Sanding wood": "sandpaper", "wooden plank", "workbench"
- For "Performing surgery": "scalpel", "surgical gloves", "operating theater"
- For "Baking cookies": "mixing bowl", "cookie sheet", "oven"

IMPORTANT: Each component must be unique - do not repeat any component.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that generates charades activities." },
          { role: "user", content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const text = response.choices[0].message.content.trim();
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating activity:", error);
      throw error;
    }
  }

  async generateReplacements(components, usedWords, forceIncongruous = false) {
    if (!this.initialized) {
      throw new Error("OpenAI service not initialized");
    }

    try {
      // Convert usedWords Set to Array for the prompt
      const usedWordsArray = Array.from(usedWords);
      
      const prompt = `Generate interesting replacement words for the following components in a charades-like game:
${components.join(", ")}

Rules:
1. Each replacement MUST be COMPLETELY INCONGRUOUS to the original component - NOT a synonym or related item
2. Replacements MUST be from a DIFFERENT CATEGORY than the original (e.g., if original is a tool, replacement should NOT be any kind of tool)
3. Replacements MUST be VISUALLY DEMONSTRABLE (can be acted out physically)
4. Choose replacements that would be SURPRISING and UNEXPECTED when mimed like in charades
5. Words should be appropriate for all ages
6. Words should NOT include "and"
7. Words should NOT be in this list: ${usedWordsArray.slice(0, 100).join(", ")}
8. Each replacement must be UNIQUE - do not repeat any word
9. IMPORTANT: Do not use any words that have been used before
10. CRITICAL: The replacement should create HUMOR through INCONGRUITY with the original

SPECIAL VARIATIONS:
- For people/roles (like "chef", "doctor", "player"), you can use a celebrity or fictional character name 20% of the time
- For objects (like "hammer", "ball", "chair"), you can use "made of [material]" 20% of the time where [material] is an unexpected material

Examples of good replacements:
- "hammer" → "ballerina" or "jellyfish" or "made of chocolate" (NOT "screwdriver" or any tool)
- "chef" → "skateboard" or "volcano" or "Brad Pitt" (NOT "waiter" or any profession)
- "hospital" → "banana" or "trampoline" (NOT "clinic" or any location)
- "basketball" → "teapot" or "vampire" or "made of glass" (NOT "football" or any sports equipment)

Format the response as a JSON array with the following structure:
[
  {"original": "component1", "replacement": "interesting_replacement1"},
  {"original": "component2", "replacement": "interesting_replacement2"},
  ...
]`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that generates interesting word replacements for charades." },
          { role: "user", content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.8, // Higher temperature for more creative, incongruous replacements
      });

      const text = response.choices[0].message.content.trim();
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating replacements:", error);
      throw error;
    }
  }

  async generateSingleComponent(activityVerb, existingComponents, usedWords) {
    if (!this.initialized) {
      throw new Error("OpenAI service not initialized");
    }

    try {
      // Convert usedWords Set to Array for the prompt
      const usedWordsArray = Array.from(usedWords);
      
      const prompt = `Generate a single new component for the charades activity: "${activityVerb}"

Current components: ${existingComponents.join(", ")}

Rules:
1. The new component MUST be LOGICALLY ASSOCIATED with the activity
2. It MUST be VISUALLY DEMONSTRABLE (can be acted out physically)
3. It must be a SPECIFIC, TANGIBLE object, role, or location that would logically be used in the activity
4. It should NOT be in this list: ${usedWordsArray.slice(0, 100).join(", ")}
5. It should NOT be similar to the existing components
6. It should be appropriate for all ages
7. It should be a single word or short phrase (no "and")

Examples of good components:
- For "Baking cookies": "mixing bowl", "cookie sheet", "oven", "spatula", "flour", "chef"
- For "Playing basketball": "basketball", "hoop", "court", "referee", "jersey", "scoreboard"
- For "Performing surgery": "scalpel", "surgical gloves", "operating table", "surgeon", "nurse", "anesthesia mask"

IMPORTANT: Return ONLY the new component as a single string, with no additional text, quotes, or formatting.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that generates charades components." },
          { role: "user", content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.6, // Slightly lower temperature for more focused results
      });

      // Extract and clean the response
      const newComponent = response.choices[0].message.content.trim()
        .replace(/^["'](.*)["']$/, '$1') // Remove quotes if present
        .replace(/^\s*-\s*/, ''); // Remove leading dash if present
      
      return newComponent;
    } catch (error) {
      console.error("Error generating single component:", error);
      throw error;
    }
  }

  async simplifyActivity(activity) {
    if (!this.initialized) {
      throw new Error("OpenAI service not initialized");
    }

    try {
      const prompt = `Simplify this activity for a charades game to make it easier to act out:
"${activity.activityVerb}" with components: ${activity.selectedComponents.join(", ")}

Create a simpler version with 2-3 components that are easier to understand and act out.

IMPORTANT: The components must be SPECIFIC, TANGIBLE objects, roles, or locations that would logically be used in the activity.
- Use specific physical objects/tools (e.g., "hammer" not "tool", "chef's knife" not "equipment")
- Use specific rooms (e.g., "kitchen" not "room", "operating theater" not "medical facility")
- Use specific people or occupations (e.g., "surgeon" not "medical professional", "quarterback" not "player")

AVOID vague or categorical terms like "equipment", "supplies", "materials", "tools", "items", etc.

Examples of good components:
- For "Sanding wood": "sandpaper", "wooden plank", "workbench"
- For "Performing surgery": "scalpel", "surgical gloves", "operating theater"
- For "Baking cookies": "mixing bowl", "cookie sheet", "oven"

IMPORTANT: Each component must be unique - do not repeat any component.

Format the response as a JSON object with the following structure:
{
  "activityVerb": "The simplified activity",
  "components": ["specific component1", "specific component2", "specific component3"]
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that simplifies charades activities." },
          { role: "user", content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.5,
      });

      const text = response.choices[0].message.content.trim();
      const parsed = JSON.parse(text);
      
      return {
        activityVerb: parsed.activityVerb,
        selectedComponents: parsed.components
      };
    } catch (error) {
      console.error("Error simplifying activity:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const openAIService = new OpenAIService();
export default openAIService;
