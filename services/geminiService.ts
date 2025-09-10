import { ChatMessage, LostFoundReport, Navigatable, SosAlert } from '../types';

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

  const lowerQuery = query.toLowerCase();

  // Mock logic for navigating to family members
  if (lowerQuery.includes('route to')) {
    if (lowerQuery.includes('grandma sita')) {
        return {
            text: "Grandma Sita is near the Harsiddhi Temple. I've highlighted the safest, least crowded 8-minute walk for you.",
            path: "M 50 85 C 40 70, 30 50, 65 30",
        };
    }
    if (lowerQuery.includes('little anjali')) {
        return {
            text: "Anjali's SOS was activated near the river bank. The route is crowded, please be careful. Help is on the way to her location.",
            path: "M 50 85 Q 30 50, 75 20",
        };
    }
     if (lowerQuery.includes('uncle mohan')) {
        return {
            text: "Uncle Mohan is in the main market area. I'm routing you through a side-path to avoid the most congested sections.",
            path: "M 50 85 C 60 70, 80 80, 60 80",
        };
    }
  }


  // Mock logic based on keywords in the query
  if (lowerQuery.includes('water')) {
    return {
      text: "The nearest water station with low crowd is near Sector 5 medical camp. I've highlighted the 5-minute walking route for you.",
      path: "M 50 85 C 40 60, 60 40, 75 25"
    };
  }
  if (lowerQuery.includes('toilet')) {
    return {
      text: "There's a clean toilet facility behind the main stage. It's less crowded now. Follow the path I've marked on your map.",
      path: "M 50 85 Q 80 50, 40 20"
    };
  }
  if (lowerQuery.includes('food')) {
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
export const getChatResponse = async (history: ChatMessage[], message: string): Promise<{ text: string; action?: { type: 'navigate'; destination: Navigatable; } }> => {
  console.log("Simulating Gemini API call for chat with message:", message);
  await sleep(1200); // Simulate API latency

  const lowerCaseMessage = message.toLowerCase();
  const lastAiMessage = history.filter(m => m.sender === 'ai').pop()?.text.toLowerCase() || '';

  // --- Multi-turn conversation for finding a toilet ---
  if (lowerCaseMessage.includes('toilet') || lowerCaseMessage.includes('washroom') || lowerCaseMessage.includes('restroom')) {
      return { text: "Certainly. I can help with that. Are you looking for the nearest one, or one with specific facilities like wheelchair access?" };
  }
  
  if (lastAiMessage.includes('toilet') && (lowerCaseMessage.includes('nearest') || lowerCaseMessage.includes('any'))) {
      const toiletDestination: Navigatable = {
          name: "Clean Toilet Facility - Sector C",
          locationCoords: { lat: 52, lng: 82 } // Example coordinates
      };
      return {
          text: "The nearest clean toilet is in Sector C, near the medical camp. It is currently reporting low footfall. Would you like me to guide you there?",
          action: {
              type: 'navigate',
              destination: toiletDestination
          }
      };
  }
  
  // --- Multi-turn conversation for finding food ---
    if (lowerCaseMessage.includes('food') || lowerCaseMessage.includes('eat') || lowerCaseMessage.includes('hungry')) {
        return { text: "There are many food stalls. Are you looking for something specific, like 'prasad' or a full meal?" };
    }

    if (lastAiMessage.includes('prasad or a full meal')) {
        if (lowerCaseMessage.includes('full meal')) {
            return { text: "The main food court is in Sector C. It can be crowded. There are also smaller eateries near the Harsiddhi temple with good local food. Which would you prefer?" };
        }
        if (lowerCaseMessage.includes('prasad')) {
            const prasadDestination: Navigatable = {
                name: "Prasad Counter - Mahakal Temple",
                locationCoords: { lat: 58, lng: 48 }
            };
            return {
                text: "The main prasad counter is at the Mahakal Temple exit. I can show you the route.",
                action: { type: 'navigate', destination: prasadDestination }
            };
        }
    }

  // --- General queries ---
  if (lowerCaseMessage.includes('aarti time')) {
    return { text: "The main evening 'Shayan Aarti' at the Mahakal Temple is at 10:30 PM. It's best to arrive early. The 'Bhasma Aarti' is at 4:00 AM, but requires pre-booking." };
  }
  if (lowerCaseMessage.includes('history') || lowerCaseMessage.includes('significance')) {
    return { text: "The Ujjain Simhastha Kumbh is one of the four sacred Kumbh Melas, held when Jupiter enters the Leo sign. It's a time for ritual bathing in the Shipra river, believed to cleanse one of sins. Millions gather for this profound spiritual event." };
  }

  return { text: "I'm sorry, I'm not sure how to help with that. You can ask me about event timings, directions, or the history of the Kumbh Mela." };
};


/**
 * Simulates a Gemini API call to autofill the report form from a text prompt.
 * @param prompt - The user's natural language description.
 * @returns A promise that resolves to a partial LostFoundReport object.
 */
export const autofillReportForm = async (prompt: string): Promise<Partial<LostFoundReport>> => {
    console.log("Simulating Gemini API call for autofill with prompt:", prompt);
    await sleep(1800);

    const lowerPrompt = prompt.toLowerCase();
    let result: Partial<LostFoundReport> = { description: prompt };

    // Detect type
    if (lowerPrompt.includes('lost')) result.type = 'Lost';
    if (lowerPrompt.includes('found')) result.type = 'Found';
    
    // Detect category
    if (lowerPrompt.includes('father') || lowerPrompt.includes('son') || lowerPrompt.includes('child') || lowerPrompt.includes('mother') || lowerPrompt.includes('wife') || lowerPrompt.includes('person') || lowerPrompt.includes('man') || lowerPrompt.includes('woman')) {
        result.category = 'Person';
    } else if (lowerPrompt.includes('bag') || lowerPrompt.includes('backpack') || lowerPrompt.includes('phone') || lowerPrompt.includes('wallet') || lowerPrompt.includes('ring')) {
        result.category = 'Item';
    }
    
    // Extract details
    if (result.category === 'Person') {
        if (lowerPrompt.includes('child')) result.personAge = '5-7';
        if (lowerPrompt.includes('father') || lowerPrompt.includes('man')) result.personGender = 'Male';
        if (lowerPrompt.includes('mother') || lowerPrompt.includes('wife') || lowerPrompt.includes('woman')) result.personGender = 'Female';
        const clothingMatch = lowerPrompt.match(/(wearing|in a) (.*?)(?=(near|around|\.|$))/);
        if (clothingMatch) result.clothingAppearance = clothingMatch[2].trim();
    } else if (result.category === 'Item') {
        if (lowerPrompt.includes('backpack') || lowerPrompt.includes('bag')) {
            result.subCategory = 'Bags & Luggage';
            result.itemName = 'Backpack';
        }
        if (lowerPrompt.includes('red')) result.itemColor = 'Red';
        if (lowerPrompt.includes('laptop')) result.identifyingMarks = 'Contains a laptop.';
    }

    const locationMatch = lowerPrompt.match(/(near|at|in|around) (.*?)(?=(\.|$))/);
    if (locationMatch) result.lastSeen = locationMatch[2].trim();

    return result;
};


/**
 * Simulates a Gemini Vision API call to analyze an image for a report.
 * @param imageBase64 - The base64 encoded image string.
 * @returns A promise that resolves to a partial LostFoundReport object.
 */
export const analyzeReportImage = async (imageBase64: string): Promise<Partial<LostFoundReport>> => {
  console.log("Simulating Gemini Vision API call for image analysis.");
  await sleep(2000); // Simulate API latency

  // A more stable heuristic for the mock.
  // This uses a larger, more unique signature from the image data to generate a hash.
  // This should provide more consistent results for the same image during the demo.
  const signature = imageBase64.substring(100, 250); // Use a larger slice
  let hash = 0;
  for (let i = 0; i < signature.length; i++) {
    const char = signature.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }

  // Expanded mock responses to be more robust
  const itemResponses = [
    // Wallets
    { category: 'Item' as const, subCategory: 'Documents & Cards' as const, itemName: 'Brown Leather Wallet', itemMaterial: 'Leather', itemColor: 'Brown', description: 'A standard bifold wallet was found.' },
    // Keys
    { category: 'Item' as const, subCategory: 'Other' as const, itemName: 'Set of Keys', identifyingMarks: 'Has a car key fob and two house keys.', description: 'A set of keys on a metal ring.' },
    // Eyeglasses
    { category: 'Item' as const, subCategory: 'Jewelry & Accessories' as const, itemName: 'Black Eyeglasses', itemBrand: 'Ray-Ban', itemColor: 'Black', description: 'A pair of black-framed eyeglasses.'},
    // Backpack
    { category: 'Item' as const, subCategory: 'Bags & Luggage' as const, itemName: 'Red Backpack', itemBrand: 'American Tourister', itemColor: 'Red', description: 'A red backpack, appears to be for students.' },
    // Phone
    { category: 'Item' as const, subCategory: 'Electronics' as const, itemName: 'Smartphone', itemBrand: 'Samsung', itemColor: 'Black', description: 'A black smartphone with a cracked screen.' },
  ];
  
  const personResponses = [
      // Child
    { category: 'Person' as const, personName: 'Unknown Child', personAge: '4-5', personGender: 'Female' as const, clothingAppearance: 'Wearing a pink frock with cartoon characters.' },
    // Elderly man
    { category: 'Person' as const, personName: 'Unknown Male', personAge: '70-75', personGender: 'Male' as const, clothingAppearance: 'Wearing a white kurta and dhoti. Has a white beard.' },
    // Woman
    { category: 'Person' as const, personName: 'Unknown Female', personAge: '30-35', personGender: 'Female' as const, clothingAppearance: 'Wearing a blue saree with a gold border.' },
  ];
  
  // A simple heuristic: if the hash is even, it's a person, if odd, it's an item.
  // This creates a 50/50 split instead of being biased towards items.
  if (hash % 2 === 0) {
      // It's a person
      const selectedResponse = personResponses[Math.abs(hash) % personResponses.length];
      return selectedResponse;
  } else {
      // It's an item
      const selectedResponse = itemResponses[Math.abs(hash) % itemResponses.length];
      return selectedResponse;
  }
};


/**
 * Simulates a Gemini API call to generate a concise summary of a report.
 * @param report - The full LostFoundReport object.
 * @returns A promise that resolves to a string summary.
 */
export const getAiReportSummary = async (report: LostFoundReport): Promise<string> => {
    console.log("Simulating Gemini API call for report summary.");
    await sleep(2500);

    if (report.category === 'Person') {
        return `Subject: ${report.personName}, approx. age ${report.personAge}, ${report.personGender}.\n` +
               `Last seen wearing: ${report.clothingAppearance}.\n` +
               `Details: ${report.description}\n` +
               `Location: ${report.lastSeen}.\n` +
               `Status: ${report.status}, reported by ${report.reportedBy}.`;
    } else {
        return `Item: ${report.itemName} (${report.subCategory}).\n` +
               `Details: ${report.itemColor || ''} ${report.itemBrand || ''}. ${report.identifyingMarks || ''}\n` +
               `Description: ${report.description}\n` +
               `Location: ${report.lastSeen}.\n` +
               `Status: ${report.status}, reported by ${report.reportedBy}.`;
    }
};

// FIX: Added missing 'getAiSearchResults' function to resolve import error in AdminDashboard.
/**
 * Simulates a Gemini API call for semantic search on reports.
 * @param query - The user's natural language search query.
 * @param reports - The list of all reports to search through.
 * @returns A promise that resolves to an array of report IDs that match the query.
 */
export const getAiSearchResults = async (query: string, reports: LostFoundReport[]): Promise<string[]> => {
    console.log("Simulating Gemini API call for AI search with query:", query);
    await sleep(2200);

    const lowerQuery = query.toLowerCase();
    
    // A simple mock of semantic search: check multiple fields and keywords.
    const results = reports.filter(report => {
        // Direct keyword match in key fields
        if (report.id.toLowerCase().includes(lowerQuery) || 
            report.description.toLowerCase().includes(lowerQuery) ||
            report.reportedBy.toLowerCase().includes(lowerQuery)) {
            return true;
        }

        if (report.category === 'Person' && report.personName?.toLowerCase().includes(lowerQuery)) {
            return true;
        }

        if (report.category === 'Item' && report.itemName?.toLowerCase().includes(lowerQuery)) {
            return true;
        }

        // Simple semantic connections for the demo
        if ((lowerQuery.includes('kid') || lowerQuery.includes('child')) && report.category === 'Person' && report.personAge && parseInt(report.personAge) < 12) {
            return true;
        }
        if ((lowerQuery.includes('elderly') || lowerQuery.includes('old man') || lowerQuery.includes('old woman')) && report.category === 'Person' && report.personAge && parseInt(report.personAge) > 65) {
            return true;
        }
        if ((lowerQuery.includes('phone') || lowerQuery.includes('mobile')) && report.subCategory === 'Electronics') {
            return true;
        }
        
        return false;
    });

    // Return results in a plausible "relevance" order (newest first for the mock)
    return results
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .map(r => r.id);
};

// FIX: Refactored function with an explicit type guard to fix type errors.
// TypeScript now correctly infers that properties like 'category' and 'priority'
// are only accessed on objects of type 'LostFoundReport'.
/**
 * Simulates a Gemini API call to suggest resource allocation for a critical report.
 * @param report - The critical LostFoundReport object.
 * @returns A promise that resolves to a string with suggestions.
 */
export const getAiResourceSuggestion = async (report: LostFoundReport | SosAlert): Promise<string> => {
    console.log("Simulating Gemini API call for resource suggestion.");
    await sleep(3000);

    // Using a type guard to differentiate between the two types.
    // 'userId' is unique to SosAlert, and 'reportedById' is unique to LostFoundReport.
    if ('userId' in report && !('reportedById' in report)) {
        // Handle SosAlert
        return "Priority: URGENT\n" +
               "1. Dispatch nearest medical team to user's coordinates immediately.\n" +
               "2. Alert all volunteer units within a 1km radius to assist.\n" +
               `3. Notify authorities in Zone B about a medical emergency.\n` +
               `4. Attempt to contact user's emergency contacts.`;
    } else {
        // Handle LostFoundReport - TypeScript knows `report` is a LostFoundReport in this block.
        if (report.category === 'Person' && report.priority === 'Critical') {
            const zone = "A"; // Mock zone
            return `Priority: CRITICAL (Missing Child/Vulnerable Person)\n` +
                   `1. Broadcast alert to all units in Zone ${zone}.\n` +
                   `2. Assign 2 dedicated volunteers for ground search near '${report.lastSeen}'.\n` +
                   `3. Task security personnel to monitor CCTV feeds at Gates 2 & 3 for a match.\n` +
                   `4. Prepare announcement for public address system.`;
        }
    }

    return "No specific resource suggestions for this report type.";
};
