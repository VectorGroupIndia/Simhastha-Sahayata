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

  // More extensive synonym dictionary, especially for clothing and accessories
  const synonyms: { [key: string]: string[] } = {
    'bag': ['backpack', 'luggage', 'suitcase', 'rucksack', 'purse', 'handbag'],
    'backpack': ['bag', 'rucksack'],
    'phone': ['smartphone', 'mobile', 'cellphone'],
    'child': ['boy', 'girl', 'son', 'daughter', 'kid', 'toddler', 'infant'],
    'man': ['gentleman', 'male', 'father', 'husband'],
    'woman': ['lady', 'female', 'mother', 'wife', 'grandmother'],
    'elderly': ['old', 'senior', 'grandma', 'grandpa', 'grandmother', 'grandfather'],
    'old': ['elderly', 'senior'],
    'shirt': ['t-shirt', 'top', 'blouse', 'kurta'],
    'pants': ['trousers', 'jeans', 'shorts', 'pyjamas'],
    'jewelry': ['necklace', 'bracelet', 'earrings', 'ring', 'bangle'],
    'document': ['card', 'id', 'passport', 'wallet', 'license'],
    'wallet': ['purse', 'document'],
    'card': ['document', 'id', 'license'],
    'glasses': ['spectacles', 'eyewear'],
  };

  const colors = ['red', 'blue', 'green', 'black', 'white', 'yellow', 'orange', 'purple', 'brown', 'grey', 'gray', 'pink', 'silver', 'gold'];

  // Utility to get all synonyms for a word, including the word itself
  const getSynonyms = (word: string): string[] => {
    return [word, ...(synonyms[word] || [])];
  };

  const queryWords = new Set(lowerCaseQuery.split(' ').filter(w => w.length > 2));
  
  const rankedResults: { id: string, score: number }[] = [];

  reports.forEach(report => {
    let score = 0;

    // Field-specific weighted scoring
    const checkField = (fieldValue: string | undefined | null, weight: number, exact = false) => {
        if (!fieldValue) return;
        const text = fieldValue.toLowerCase();
        queryWords.forEach(word => {
            const wordSynonyms = getSynonyms(word);
            for (const s of wordSynonyms) {
                if (exact && text === s) {
                    score += weight;
                    break;
                }
                if (!exact && text.includes(s)) {
                    score += weight;
                    break;
                }
            }
        });
    };
    
    // 1. Category check - very important
    const personQueryWords = new Set(['person', 'child', 'woman', 'man', 'son', 'daughter', 'boy', 'girl', 'elderly']);
    const itemQueryWords = new Set(['item', 'bag', 'phone', 'wallet', 'backpack', 'jewelry', 'document']);
    
    let isPersonQuery = false;
    let isItemQuery = false;
    queryWords.forEach(word => {
        if(personQueryWords.has(word)) isPersonQuery = true;
        if(itemQueryWords.has(word)) isItemQuery = true;
    });

    if (report.category === 'Person') {
        if (isPersonQuery) score += 10;
        else if (isItemQuery) score -= 20; // Heavy penalty for category mismatch
    } else if (report.category === 'Item') {
        if (isItemQuery) score += 10;
        else if (isPersonQuery) score -= 20; // Heavy penalty
    }

    // 2. Score main identifiers
    checkField(report.personName, 15);
    checkField(report.itemName, 15);
    checkField(report.subCategory, 8, true);
    checkField(report.itemBrand, 10);
    checkField(report.itemColor, 10, true);

    // 3. Score descriptive fields
    checkField(report.description, 2);
    checkField(report.identifyingMarks, 6);

    // 4. Advanced clothing/appearance scoring
    if (report.clothingAppearance) {
        const clothingText = report.clothingAppearance.toLowerCase();
        let clothingItemMatches = 0;
        let colorInClothingMatch = false;

        const clothingKeywords = new Set([
            ...getSynonyms('shirt'), ...getSynonyms('pants'), ...getSynonyms('jewelry'), ...getSynonyms('glasses'),
            'dress', 'saree', 'kurta', 'hat', 'cap', 'scarf', 'shawl', 'shoes', 'sandals',
        ]);
        
        const queryClothingWords = new Set<string>();
        queryWords.forEach(word => {
            if(clothingKeywords.has(word)) queryClothingWords.add(word);
        });

        queryClothingWords.forEach(word => {
            if(clothingText.includes(word)) {
                clothingItemMatches++;
                score += 5;
            }
        });

        queryWords.forEach(word => {
            if (colors.includes(word) && clothingText.includes(word)) {
                colorInClothingMatch = true;
                score += 6;
            }
        });
        
        // Bonus for matching both color and item type in query and clothing description
        if (colorInClothingMatch && clothingItemMatches > 0) {
            score += 8;
        }
    }
    
    // 5. Demographic matching
    if (report.category === 'Person' && report.personAge) {
        const age = parseInt(report.personAge, 10);
        if (!isNaN(age)) {
            if ((queryWords.has('child') || queryWords.has('kid')) && age < 12) score += 8;
            if (queryWords.has('toddler') && age < 4) score += 10;
            if ((queryWords.has('elderly') || queryWords.has('senior')) && age > 65) score += 10;
        }
    }


    if (score > 5) { // Threshold for a result to be considered relevant
      rankedResults.push({ id: report.id, score });
    }
  });

  // Sort by score descending
  const sortedResults = rankedResults.sort((a, b) => b.score - a.score);

  console.log("AI Search refined ranked results:", sortedResults);

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
    } else if (/\b(bag|backpack|phone|wallet|item|keys|bottle|card|jewelry)\b/.test(lowerCasePrompt)) {
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
         if (lowerCasePrompt.includes('backpack') || lowerCasePrompt.includes('bag')) {
            autofillData.itemName = 'Backpack';
            autofillData.subCategory = 'Bags & Luggage';
         }
         if (lowerCasePrompt.includes('phone')) {
            autofillData.itemName = 'Phone';
            autofillData.subCategory = 'Electronics';
         }
         if (lowerCasePrompt.includes('wallet') || lowerCasePrompt.includes('card')) {
            autofillData.itemName = 'Wallet';
            autofillData.subCategory = 'Documents & Cards';
         }
         if (lowerCasePrompt.includes('ring') || lowerCasePrompt.includes('jewelry')) {
            autofillData.itemName = 'Jewelry';
            autofillData.subCategory = 'Jewelry & Accessories';
         }

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
 * Simulates a Gemini API call to analyze an image and extract details for a report.
 * @param imageBase64 - The base64 encoded string of the image to analyze.
 * @returns A promise that resolves to a partial LostFoundReport object with extracted details.
 */
export const analyzeReportImage = async (imageBase64: string): Promise<Partial<LostFoundReport>> => {
    console.log("Simulating smart Gemini Vision API for Image Analysis...");
    await sleep(2500); // Simulate longer processing for image analysis

    // --- Mock AI Vision Logic ---
    // This has been improved to provide varied but deterministic results.
    // Different images will now yield different analysis results.
    const MOCK_RESPONSES: Partial<LostFoundReport>[] = [
        { // Elderly Man
            category: 'Person',
            personName: 'Unidentified Senior',
            personAge: 'Approx. 70-75 years old',
            personGender: 'Male',
            clothingAppearance: 'AI analysis: Appears to be an elderly man wearing a white shirt or kurta and glasses.',
            description: 'The person in the photo seems disoriented.',
        },
        { // Blue Backpack
            category: 'Item',
            itemName: 'Backpack',
            itemColor: 'Blue',
            subCategory: 'Bags & Luggage',
            itemBrand: 'Unknown',
            description: 'AI analysis: A blue backpack, possibly made of canvas material. Appears to be in good condition.',
            identifyingMarks: 'No distinct markings are visible from this angle.',
        },
        { // Young Child
            category: 'Person',
            personName: 'Unidentified Child',
            personAge: 'Approx. 5-7 years old',
            personGender: 'Female',
            clothingAppearance: 'AI analysis: A young girl wearing a red t-shirt.',
            description: 'The child appears to be alone and looking for someone.',
        },
        { // Black Phone
            category: 'Item',
            itemName: 'Smartphone',
            itemColor: 'Black',
            subCategory: 'Electronics',
            itemBrand: 'Unspecified',
            description: 'AI analysis: A black smartphone with the screen facing down.',
            identifyingMarks: 'A crack might be visible on the back casing.',
        }
    ];

    // Simple hash function to get a deterministic index based on image content
    const hash = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const hashValue = Math.abs(hash(imageBase64.substring(0, 1000))); // Hash a substring for performance
    const index = hashValue % MOCK_RESPONSES.length;
    
    const result = MOCK_RESPONSES[index];
    console.log(`AI decided on mock response index ${index}:`, result);
    return result;
};


/**
 * Simulates a Gemini API call to summarize a report.
 * @param report - The report to be summarized.
 * @returns A promise that resolves to a string summary.
 */
export const getAiReportSummary = async (report: LostFoundReport): Promise<string> => {
  console.log("Simulating Gemini API call for report summarization:", report.id);
  await sleep(1500); // Simulate API latency

  const { type, category, personName, itemName, description, lastSeen, status, assignedToName } = report;

  let summary = `This is a report for a ${type.toLowerCase()} ${category.toLowerCase()}. `;

  if (category === 'Person') {
    summary += `The missing person is ${personName || 'unnamed'}`;
    if(report.personAge) summary += `, approximately ${report.personAge} years old. `;
    else summary += `. `;
    if(report.clothingAppearance) summary += `They were last seen wearing: ${report.clothingAppearance}. `;
  } else {
    summary += `The item is a ${itemName || 'unspecified item'}. `;
    if(report.subCategory) summary += `It is classified under ${report.subCategory}. `;
    if(report.itemColor) summary += `Primary color is ${report.itemColor}. `;
    if(report.itemBrand) summary += `Brand is ${report.itemBrand}. `;
    if(report.identifyingMarks) summary += `Unique marks: ${report.identifyingMarks}. `;
  }

  summary += `It was last seen at/near "${lastSeen}". `;
  summary += `The core of the report states: "${description}". `;
  summary += `Current status is "${status}". `;

  if (assignedToName) {
    summary += `The case is assigned to ${assignedToName}.`;
  } else {
    summary += `The case is currently unassigned.`;
  }
  
  return summary;
};