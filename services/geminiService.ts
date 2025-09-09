import { ChatMessage, LostFoundReport } from '../types';

// This file simulates interactions with the Google Gemini API.
// In a real application, this would contain the actual logic for making API calls
// to '@google/genai'. For this demo, it returns pre-defined, delayed responses
// to mimic network latency and AI processing time.

// Helper function to simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulates a Gemini API call to get a navigation route.
 * @param query - The user's natural language navigation query.
 * @returns A promise that resolves to an object with text instructions and an SVG path.
 */
export const getNavigationRoute = async (query: string): Promise<{ text: string; path: string }> => {
  console.log("Simulating Gemini API call for navigation with query:", query);
  await sleep(1500); // Simulate API latency

  // Mock logic based on keywords in the query
  if (query.toLowerCase().includes('water')) {
    return {
      text: "The nearest water station with low crowd is near Sector 5 medical camp. I've highlighted the 5-minute walking route for you.",
      path: "M 50 85 C 40 60, 60 40, 75 25"
    };
  }
  if (query.toLowerCase().includes('toilet')) {
    return {
      text: "There's a clean toilet facility behind the main stage. It's less crowded now. Follow the path I've marked on your map.",
      path: "M 50 85 Q 80 50, 40 20"
    };
  }
  if (query.toLowerCase().includes('food')) {
    return {
      text: "For 'prasad' with smaller queues, head towards Harsiddhi Temple area. It's a 10-minute walk from your current location.",
      path: "M 50 85 C 20 70, 20 30, 50 15"
    };
  }

  return {
    text: "I've found a route to the main bathing ghat. It is currently very crowded. A less crowded alternative is Datta Akhara Ghat. I've marked both routes.",
    path: "M 50 85 L 30 50 L 50 20"
  };
};

/**
 * Simulates a Gemini API call to get a chat response.
 * @param history - The existing chat history.
 * @param message - The new user message.
 * @returns A promise that resolves to the AI's string response.
 */
export const getChatResponse = async (history: ChatMessage[], message: string): Promise<string> => {
  console.log("Simulating Gemini API call for chat with message:", message);
  await sleep(1200); // Simulate API latency

  const lowerCaseMessage = message.toLowerCase();

  // Mock logic based on keywords
  if (lowerCaseMessage.includes('shahi snan') || lowerCaseMessage.includes('royal bath')) {
    return "The next Shahi Snan is scheduled for tomorrow at 4:00 AM at Ram Ghat. It's a very auspicious event where Naga sadhus lead the procession. It's advised to reach the area at least 2 hours early.";
  }
  if (lowerCaseMessage.includes('significance') || lowerCaseMessage.includes('mahakal temple')) {
    return "The Mahakaleshwar Temple is one of the twelve Jyotirlingas in India. The idol of Mahakal is Dakshinamurti, meaning it faces south. This is a unique feature not found in any other Jyotirlinga.";
  }
  if (lowerCaseMessage.includes('emergency') || lowerCaseMessage.includes('helpline')) {
    return "The central emergency helpline number for the Kumbh Mela is 1947. For medical emergencies, call 108. For police, dial 100.";
  }

  return "That's a great question. The Ujjain Simhastha Kumbh is held once every 12 years when Jupiter enters the Leo sign (Simha rashi). It's a time for spiritual cleansing and renewal for millions of devotees.";
};

/**
 * Simulates a Gemini API call to perform a semantic search on reports.
 * @param query - The user's natural language search query.
 * @param reports - The list of all reports to search through.
 * @returns A promise that resolves to an array of matching report IDs, sorted by relevance.
 */
export const getAiSearchResults = async (query: string, reports: LostFoundReport[]): Promise<string[]> => {
  console.log("Simulating Gemini AI Semantic Search with query:", query);
  await sleep(2000); // Simulate longer processing for AI search

  const lowerCaseQuery = query.toLowerCase();

  // This is a simplified mock of what a real AI would do.
  // It checks for keywords and semantic concepts.
  const rankedResults: { id: string, score: number }[] = [];

  reports.forEach(report => {
    let score = 0;
    const reportText = JSON.stringify(report).toLowerCase();

    // Simple keyword matching for demonstration
    if (lowerCaseQuery.includes('old woman') || lowerCaseQuery.includes('elderly lady') || (lowerCaseQuery.includes('woman') && (report.personAge && parseInt(report.personAge, 10) > 60))) {
      if (report.personGender?.toLowerCase() === 'female' && report.personAge && parseInt(report.personAge, 10) > 60) {
        score += 5;
      }
    }
    if (lowerCaseQuery.includes('saree') && report.clothingAppearance?.toLowerCase().includes('saree')) {
      score += 4;
    }
    if (lowerCaseQuery.includes('temple') && report.lastSeen?.toLowerCase().includes('temple')) {
      score += 3;
    }
    if (lowerCaseQuery.includes('child') || lowerCaseQuery.includes('boy')) {
        if(report.personAge && parseInt(report.personAge, 10) < 10){
            score += 5;
        }
    }
    if (lowerCaseQuery.includes('red t-shirt') && report.clothingAppearance?.toLowerCase().includes('red t-shirt')) {
        score += 4;
    }
    if (lowerCaseQuery.includes('wallet') && report.itemName?.toLowerCase().includes('wallet')) {
        score += 5;
    }
     if (lowerCaseQuery.includes('black') && report.itemColor?.toLowerCase().includes('black')) {
        score += 2;
    }

    // Generic word matching
    lowerCaseQuery.split(' ').forEach(word => {
        if(word.length > 2 && reportText.includes(word)) {
            score += 1;
        }
    });

    if (score > 0) {
      rankedResults.push({ id: report.id, score });
    }
  });

  // Sort by score descending
  const sortedResults = rankedResults.sort((a, b) => b.score - a.score);

  console.log("AI Search ranked results:", sortedResults);

  return sortedResults.map(r => r.id);
};

/**
 * Simulates a Gemini API call to parse a natural language prompt and autofill a report form.
 * @param prompt - The user's natural language description of the situation.
 * @returns A promise that resolves to a partial LostFoundReport object with extracted details.
 */
export const autofillReportForm = async (prompt: string): Promise<Partial<LostFoundReport>> => {
    console.log("Simulating Gemini AI Form Autofill with prompt:", prompt);
    await sleep(1800); // Simulate processing time

    const lowerCasePrompt = prompt.toLowerCase();
    const autofillData: Partial<LostFoundReport> = {};

    // Determine report type (Lost/Found)
    if (lowerCasePrompt.includes('found') || lowerCasePrompt.includes('saw a')) {
        autofillData.type = 'Found';
    } else {
        autofillData.type = 'Lost'; // Default
    }

    // Determine category (Person/Item)
    if (/\b(son|daughter|mother|father|child|boy|girl|man|woman|person|someone)\b/.test(lowerCasePrompt)) {
        autofillData.category = 'Person';
    } else if (/\b(bag|backpack|phone|wallet|item|keys|bottle)\b/.test(lowerCasePrompt)) {
        autofillData.category = 'Item';
    }
    
    // Extract details for Person
    if (autofillData.category === 'Person') {
        // Simple name extraction (mock)
        const nameMatch = prompt.match(/\b([A-Z][a-z]+)\b/);
        if (nameMatch) autofillData.personName = nameMatch[1];

        // Age
        const ageMatch = lowerCasePrompt.match(/(\d+)\s*year\s*old/);
        if (ageMatch) autofillData.personAge = ageMatch[1];

        // Gender
        if (/\b(son|boy|man|father|he)\b/.test(lowerCasePrompt)) autofillData.personGender = 'Male';
        if (/\b(daughter|girl|woman|mother|she)\b/.test(lowerCasePrompt)) autofillData.personGender = 'Female';

        // Clothing
        if(lowerCasePrompt.includes('wearing')) {
            autofillData.clothingAppearance = prompt.substring(lowerCasePrompt.indexOf('wearing') + 8).trim();
        }
    }

    // Extract details for Item
    if (autofillData.category === 'Item') {
         if (lowerCasePrompt.includes('backpack')) autofillData.itemName = 'Backpack';
         if (lowerCasePrompt.includes('phone')) autofillData.itemName = 'Phone';
         if (lowerCasePrompt.includes('wallet')) autofillData.itemName = 'Wallet';
         if (lowerCasePrompt.includes('bag')) autofillData.itemName = 'Bag';

         if (lowerCasePrompt.includes('red')) autofillData.itemColor = 'Red';
         if (lowerCasePrompt.includes('blue')) autofillData.itemColor = 'Blue';
         if (lowerCasePrompt.includes('black')) autofillData.itemColor = 'Black';
    }
    
    // Extract Location
    const locationMatch = prompt.match(/(near|at|in)\s+([A-Z][a-zA-Z\s]+)/);
    if(locationMatch) {
        autofillData.lastSeen = locationMatch[2].trim();
    }
    
    autofillData.description = prompt; // Use the full prompt as a base description

    console.log("AI Autofill result:", autofillData);
    return autofillData;
};

/**
 * NEW: Simulates a Gemini API call to analyze an image and extract details for a report.
 * @param imageBase64 - The base64 encoded string of the image to analyze.
 * @returns A promise that resolves to a partial LostFoundReport object with extracted details.
 */
export const analyzeReportImage = async (imageBase64: string): Promise<Partial<LostFoundReport>> => {
    console.log("Simulating Gemini Vision API for Image Analysis...");
    await sleep(2500); // Simulate longer processing for image analysis

    const analysisResult: Partial<LostFoundReport> = {};

    // Mocking: Randomly return one of two possible analyses for demonstration
    const isPerson = Math.random() > 0.5;

    if (isPerson) {
        analysisResult.category = 'Person';
        analysisResult.personName = 'Unknown';
        analysisResult.personAge = '5-7';
        analysisResult.personGender = 'Male';
        analysisResult.clothingAppearance = 'AI analysis suggests the person is wearing a red t-shirt and blue shorts.';
        analysisResult.description = 'Image appears to be of a young child, possibly lost. The photo was likely taken outdoors during the day.';
    } else {
        analysisResult.category = 'Item';
        analysisResult.itemName = 'Backpack';
        analysisResult.itemColor = 'Red';
        analysisResult.itemBrand = 'Unbranded';
        analysisResult.description = 'AI analysis suggests this is a red backpack. It seems to be moderately full.';
        analysisResult.identifyingMarks = 'A keychain is visible on the zipper.';
    }
    
    console.log("AI Image Analysis result:", analysisResult);
    return analysisResult;
};