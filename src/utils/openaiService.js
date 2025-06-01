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
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
      this.initialized = true;
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
The activity must be something that can be physically acted out. The components must be physical objects that would logically be used in the activity.
IMPORTANT: Each component must be unique - do not repeat any component.`;

      const response = await this.openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.7,
      });

      const text = response.choices[0].text.trim();
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating activity:", error);
      throw error;
    }
  }

  async generateReplacements(components, usedWords) {
    if (!this.initialized) {
      throw new Error("OpenAI service not initialized");
    }

    try {
      // Convert usedWords Set to Array for the prompt
      const usedWordsArray = Array.from(usedWords);
      
      const prompt = `Generate creative, unexpected replacement words for the following components in a charades game:
${components.join(", ")}

Rules:
1. Each replacement should be a single noun
2. Words should be appropriate for 10th grade reading level
3. Words should NOT include "and"
4. Words should NOT be in this list: ${usedWordsArray.slice(0, 200).join(", ")}
5. Each replacement must be UNIQUE - do not repeat any word
6. IMPORTANT: Do not use any words that have been used before, even if they're not in the list above

Format the response as a JSON array with the following structure:
[
  {"original": "component1", "replacement": "replacement1"},
  {"original": "component2", "replacement": "replacement2"},
  ...
]`;

      const response = await this.openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.8,
      });

      const text = response.choices[0].text.trim();
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating replacements:", error);
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
IMPORTANT: Each component must be unique - do not repeat any component.

Format the response as a JSON object with the following structure:
{
  "activityVerb": "The simplified activity",
  "components": ["simpler component1", "simpler component2", "simpler component3"]
}`;

      const response = await this.openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.5,
      });

      const text = response.choices[0].text.trim();
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
