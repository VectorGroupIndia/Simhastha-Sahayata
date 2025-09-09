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
 * @returns A promise that resolves to a string with navigation instructions.
 */
export const getNavigationRoute = async (query: string): Promise<string> => {
  console.log("Simulating Gemini API call for navigation with query:", query);
  await sleep(1500); // Simulate API latency

  // Mock logic based on keywords in the query
  if (query.toLowerCase().includes('water')) {
    return "The nearest water station with low crowd is near Sector 5 medical camp. I've highlighted the 5-minute walking route for you.";
  }
  if (query.toLowerCase().includes('toilet')) {
    return "There's a clean toilet facility behind the main stage. It's less crowded now. Follow the path I've marked on your map.";
  }
  if (query.toLowerCase().includes('food')) {
    return "For 'prasad' with smaller queues, head towards Harsiddhi Temple area. It's a 10-minute walk from your current location.";
  }

  return "I've found a route to the main bathing ghat. It is currently very crowded. A less crowded alternative is Datta Akhara Ghat. I've marked both routes.";
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
