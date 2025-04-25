// Global variables
// let kanjiDatabase = [];
let resultsContainer;
let wordInput;
let searchButton;
let loadingElement;
let lastSearchResults = []; // Store search results globally

// Internal thesaurus for when API is not available
const internalThesaurus = {
    'love': ['affection', 'passion', 'devotion', 'adoration', 'fondness', 'caring'],
    'courage': ['bravery', 'valor', 'fearlessness', 'heroism', 'daring', 'intrepid'],
    'brave': ['courageous', 'valiant', 'fearless', 'heroic', 'daring', 'bold'],
    'strength': ['power', 'might', 'force', 'vigor', 'potency', 'fortitude'],
    'peace': ['harmony', 'tranquility', 'calm', 'serenity', 'stillness', 'quiet'],
    'wisdom': ['knowledge', 'insight', 'intelligence', 'understanding', 'sagacity', 'enlightenment'],
    'beauty': ['gorgeous', 'attractive', 'lovely', 'elegant', 'stunning', 'exquisite'],
    'hope': ['wish', 'expectation', 'desire', 'aspiration', 'optimism', 'longing'],
    'truth': ['honesty', 'reality', 'veracity', 'integrity', 'authenticity', 'accuracy'],
    'joy': ['happiness', 'delight', 'pleasure', 'gladness', 'bliss', 'cheer'],
    'dream': ['vision', 'aspiration', 'fantasy', 'imagination', 'wish', 'goal'],
    'life': ['existence', 'living', 'being', 'vitality', 'animation', 'breath'],
    'friend': ['companion', 'ally', 'comrade', 'confidant', 'buddy', 'partner'],
    'family': ['relatives', 'household', 'kin', 'clan', 'home', 'kindred'],
    'power': ['strength', 'energy', 'force', 'ability', 'capability', 'potency'],
    'time': ['period', 'era', 'age', 'epoch', 'moment', 'instant'],
    'water': ['liquid', 'fluid', 'aqua', 'h2o', 'hydration', 'moisture'],
    'fire': ['flame', 'blaze', 'inferno', 'conflagration', 'heat', 'combustion'],
    'earth': ['ground', 'soil', 'land', 'terrain', 'globe', 'world'],
    'wind': ['breeze', 'gust', 'air', 'current', 'draft', 'flow'],
    'sky': ['heaven', 'firmament', 'atmosphere', 'air', 'cosmos', 'blue'],
    'mountain': ['peak', 'summit', 'hill', 'elevation', 'highland', 'mount'],
    'river': ['stream', 'brook', 'creek', 'waterway', 'tributary', 'flow'],
    'forest': ['woods', 'woodland', 'jungle', 'timberland', 'grove', 'thicket'],
    'sun': ['star', 'solar', 'daylight', 'sunshine', 'dawn', 'day'],
    'moon': ['lunar', 'satellite', 'crescent', 'night-light', 'orb', 'nocturnal'],
    'star': ['celestial', 'astral', 'heavenly', 'cosmic', 'luminary', 'stellar'],
    'danger': ['risk', 'hazard', 'peril', 'threat', 'jeopardy', 'menace'],
    'evil': ['wicked', 'sinful', 'malevolent', 'corrupt', 'vile', 'malicious'],
    'good': ['virtuous', 'righteous', 'moral', 'upright', 'benevolent', 'noble']
};

// Add semantic topic categories to detect meaning mismatches
const semanticTopics = {
    // Positive qualities and emotions
    "positive": ["love", "happy", "joy", "peace", "beauty", "hope", "kind", "gentle", "compassion", 
                "friendship", "harmony", "gratitude", "blessed", "optimism", "serenity"],
    
    // Travel and movement
    "travel": ["travel", "travelling", "journey", "adventure", "explore", "wander", "voyage", "trip", "discover",
              "touring", "visiting", "sightseeing", "excursion", "expedition", "trek", "roaming", "wanderlust"],
    
    // Nature and outdoors
    "nature": ["nature", "mountain", "ocean", "river", "forest", "flower", "tree", "sky", "sun", 
              "moon", "star", "earth", "garden", "landscape", "wilderness"],
    
    // Music and arts
    "music": ["music", "song", "melody", "rhythm", "harmony", "tune", "instrument", "sing", "musical", 
             "lyric", "musician", "concert", "orchestra", "band", "performance", "composer", "guitar", 
             "piano", "drum", "singing", "vocalist", "voice", "sound", "audio", "note", "composition"],
    
    // Negative concepts
    "negative": ["evil", "devil", "demon", "death", "fear", "hate", "anger", "rage", "jealousy",
                "envy", "greed", "cruel", "pain", "suffering", "destruction"],
    
    // Strength and power
    "strength": ["strong", "power", "might", "force", "energy", "vigor", "robust", "tough",
                "courage", "brave", "bold", "heroic", "warrior", "determined"],
    
    // Wisdom and intelligence
    "wisdom": ["wisdom", "knowledge", "intelligent", "smart", "clever", "insight", "understanding",
              "enlightenment", "awareness", "thoughtful", "mindful", "contemplative"],
    
    // Freedom and independence
    "freedom": ["free", "freedom", "liberty", "independence", "autonomous", "unrestrained",
               "liberated", "unrestricted", "emancipated", "sovereign", "self-determination"]
};

// Global function to show kanji details by index
function showKanjiForIndex(index) {
    console.log("showKanjiForIndex called with index:", index);
    
    // First ensure the database is loaded
    ensureKanjiDatabase().then(() => {
        if (!lastSearchResults || lastSearchResults.length === 0) {
            console.error("No search results available");
            alert("Error: No search results available. Please perform a search first.");
            return;
        }
        
        if (!lastSearchResults[index]) {
            console.error("No kanji found at index", index, "in lastSearchResults");
            alert("Error: Could not find the requested kanji. Please try searching again.");
            return;
        }
        
        try {
            showKanjiDetail(lastSearchResults[index]);
        } catch (error) {
            console.error("Error showing kanji details:", error);
            alert("Error: Could not display kanji details. Please try again.");
        }
    }).catch(error => {
        console.error("Failed to load kanji database:", error);
        alert("Error: Could not load kanji database. Please refresh the page and try again.");
    });
}

// Global function to close the kanji modal
function closeKanjiModal() {
    console.log("closeKanjiModal called");
    const modal = document.getElementById('kanji-detail-modal');
    if (modal) {
        // Add the hidden class to hide the modal
        modal.classList.add('hidden');
        
        // Remove the modal-open class from the body to enable scrolling
        document.body.classList.remove('modal-open');
        
        // Let's also clean up event listeners
        try {
            modal.onclick = null;
            const closeButton = modal.querySelector('.close-modal');
            if (closeButton) {
                closeButton.onclick = null;
            }
        } catch (error) {
            console.error("Error cleaning up modal event listeners:", error);
        }
    } else {
        console.error("Modal element not found");
    }
}

// Improved initialization and error handling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements with error checking
    const elements = {
        searchButton: document.getElementById('search-button'),
        wordInput: document.getElementById('word-input'),
        resultsContainer: document.getElementById('results'),
        loadingElement: document.getElementById('loading'),
        detailModal: document.getElementById('kanji-detail-modal')
    };

    // Check if all required elements exist
    const missingElements = Object.entries(elements)
        .filter(([key, element]) => !element)
        .map(([key]) => key);

    if (missingElements.length > 0) {
        console.error('Missing required DOM elements:', missingElements);
        return; // Exit initialization if elements are missing
    }

    // Assign to global variables only after validation
    searchButton = elements.searchButton;
    wordInput = elements.wordInput;
    resultsContainer = elements.resultsContainer;
    loadingElement = elements.loadingElement;
    
    // Initialize the modal close button
    const closeButton = elements.detailModal.querySelector('.close-modal');
    if (closeButton) {
        closeButton.addEventListener('click', closeKanjiModal);
    }
    
    // Add click outside handler to the modal
    elements.detailModal.addEventListener('click', function(e) {
        if (e.target === elements.detailModal) {
            closeKanjiModal();
        }
    });

    // Ensure database is loaded before enabling search
    ensureKanjiDatabase().then(() => {
        // Add event listeners only after database is ready
        searchButton.addEventListener('click', performSearch);
        wordInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
        
        // Enable search UI
        searchButton.disabled = false;
        wordInput.disabled = false;
    }).catch(error => {
        console.error('Failed to initialize kanji database:', error);
        resultsContainer.innerHTML = '<p class="error">Failed to initialize the search system. Please try again later.</p>';
    });
});

// Improved performSearch function with better error handling
async function performSearch() {
    console.log("performSearch called");
    
    try {
        // Validate input
        const searchInput = wordInput.value.trim();
        if (!searchInput) {
            alert("Please enter a search term");
            return;
        }

        // Show loading state
        loadingElement.classList.remove('hidden');
        resultsContainer.innerHTML = '';

        // Extract keywords with validation
        const keywords = extractKeywords(searchInput);
        console.log("Extracted keywords:", keywords);
        
        if (!keywords || keywords.length === 0) {
            resultsContainer.innerHTML = '<p>No meaningful keywords found. Please try a different search term.</p>';
            loadingElement.classList.add('hidden');
            return;
        }

        // Get word variations with error handling
        const uniqueWordVariations = new Set();
        for (const keyword of keywords) {
            try {
                const variations = await getWordVariations(keyword);
                console.log(`Variations for ${keyword}:`, variations);
                variations.forEach(v => uniqueWordVariations.add(v));
            } catch (error) {
                console.warn(`Failed to get variations for keyword "${keyword}":`, error);
                // Continue with other keywords if one fails
            }
        }

        console.log("All word variations (with duplicates removed):", Array.from(uniqueWordVariations));

        // Perform search with timeout
        const searchTimeout = 10000; // 10 seconds
        const searchPromise = findKanjiMatchesImproved(keywords, Array.from(uniqueWordVariations));
        const results = await Promise.race([
            searchPromise,
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Search timed out')), searchTimeout)
            )
        ]);

        // Display results
        if (results && results.length > 0) {
            console.log("Found matches:", results.length);
            lastSearchResults = results;
            displayResults(results, searchInput, Array.from(uniqueWordVariations));
        } else {
            resultsContainer.innerHTML = '<p>No matches found. Try different keywords or check your spelling.</p>';
        }

    } catch (error) {
        console.error("Error during search:", error);
        resultsContainer.innerHTML = `<p class="error">An error occurred while searching: ${error.message}</p>`;
    } finally {
        loadingElement.classList.add('hidden');
    }
}

// Improved database initialization
async function ensureKanjiDatabase() {
    if (!Array.isArray(kanjiDatabase) || kanjiDatabase.length === 0) {
        console.warn("kanjiDatabase missing or empty! Loading from source...");
        
        try {
            // Try to load the full database
            const response = await fetch('kanji-data.js');
            const databaseText = await response.text();
            
            // Safely evaluate the database content
            const databaseFunction = new Function(databaseText + '; return kanjiDatabase;');
            const loadedDatabase = databaseFunction();
            
            if (Array.isArray(loadedDatabase) && loadedDatabase.length > 0) {
                kanjiDatabase = loadedDatabase;
                console.log("kanjiDatabase loaded with", kanjiDatabase.length, "entries");
            } else {
                throw new Error('Invalid database format');
            }
        } catch (error) {
            console.error("Failed to load kanji database:", error);
            // Create minimal database for basic functionality
            kanjiDatabase = [
                // ... minimal database entries ...
            ];
            throw new Error('Failed to load full kanji database');
        }
    }
    return kanjiDatabase;
}

function findKanjiMatchesImproved(keywords, wordVariations) {
    console.log("Running findKanjiMatchesImproved with", keywords, "and", wordVariations.length, "variations");
    // Make sure we have a database
    if (!kanjiDatabase || !Array.isArray(kanjiDatabase) || kanjiDatabase.length === 0) {
        ensureKanjiDatabase();
    }
    
    // List of inherently negative words that should trigger a warning
    const inherentlyNegativeWords = [
        'evil', 'bad', 'death', 'hate', 'pain', 'anger', 'rage', 'destruction', 
        'kill', 'murder', 'chaos', 'suffering', 'cruel', 'wicked', 'sinister', 
        'violence', 'vengeance', 'jealousy', 'greed', 'envy', 'lust', 'sin',
        'demon', 'devil', 'hate', 'corrupt', 'doom', 'misery', 'poison', 'terror',
        'fear', 'war', 'disaster', 'disease', 'tragedy', 'nightmare', 'vicious'
    ];
    
    // Process each Kanji and calculate match scores
    const results = [];
    
    for (const kanjiData of kanjiDatabase) {
        // Skip if no meanings available
        if (!kanjiData.meanings || kanjiData.meanings.length === 0) continue;
        
        // 1. Check for meaning matches in all variations of search words
        const meaningMatches = [];
        
        for (const meaning of kanjiData.meanings) {
            // Skip if meaning is undefined or null
            if (!meaning) continue;
            
            // For each meaning of this kanji, find the best word match
            let bestMatchScore = 0;
            let bestMatchWord = '';
            
            for (const searchWord of wordVariations) {
                // Skip empty or undefined words
                if (!searchWord) continue;
                
                // Try to find a match between this meaning and search word
                const similarityScore = calculateImprovedSimilarity(meaning, searchWord);
                
                if (similarityScore > bestMatchScore) {
                    bestMatchScore = similarityScore;
                    bestMatchWord = searchWord;
                }
            }
            
            // If we found a decent match, add it to meaning matches
            if (bestMatchScore > 0.3) {
                meaningMatches.push({
                    meaning,
                    score: bestMatchScore,
                    word: bestMatchWord
                });
            }
        }
        
        // Skip if no meaning matches
        if (meaningMatches.length === 0) continue;
        
        // 2. Sort meaning matches by score (highest first)
        meaningMatches.sort((a, b) => b.score - a.score);
        
        // 3. Get the best match and calculate final score
        const bestMatch = meaningMatches.length > 0 ? meaningMatches[0] : { meaning: '', score: 0, word: '' };
        let adjustedScore = adjustMatchScore(bestMatch.score, meaningMatches, bestMatch.word);
        
        // 4. Calculate semantic compatibility
        const searchTopics = identifyTopics(keywords);
        // Safely map meanings to lowercase, handling potential null/undefined values
        const allMeanings = kanjiData.meanings
            .filter(m => m !== null && m !== undefined) // More explicit filter for null/undefined values
            .map(m => String(m).toLowerCase()); // Convert to string and lowercase

        const topicCompatibility = calculateTopicCompatibility(searchTopics, bestMatch.meaning ? bestMatch.meaning : '', allMeanings);
        
        // 5. Check for negative connotations - first, check existing negative flags
        let negativeConnotations = checkNegativeConnotations(bestMatch.word, kanjiData);
        let negativeMatch = null;
        
        // 6. NEW: Check if any of our best meaning matches are inherently negative terms
        const isInherentlyNegativeMeaning = 
            meaningMatches.some(match => 
                inherentlyNegativeWords.some(negWord => 
                    calculateImprovedSimilarity(match.meaning.toLowerCase(), negWord) > 0.8
                )
            );
        
        // If we found that this kanji has an inherently negative meaning that matched well,
        // overwrite the negativeConnotations to flag it
        if (isInherentlyNegativeMeaning) {
            const matchedNegativeMeanings = meaningMatches
                .filter(match => 
                    inherentlyNegativeWords.some(negWord => 
                        calculateImprovedSimilarity(match.meaning.toLowerCase(), negWord) > 0.8
                    )
                )
                .map(match => match.meaning);
            
            negativeConnotations = {
                exists: true,
                meanings: matchedNegativeMeanings
            };
            
            // Set negative match if the best match is negative
            if (inherentlyNegativeWords.some(negWord => 
                calculateImprovedSimilarity(bestMatch.meaning.toLowerCase(), negWord) > 0.8)) {
                negativeMatch = {
                    exists: true,
                    meaning: bestMatch.meaning,
                    matchPercentage: Math.round(bestMatch.score * 100)
                };
            }
        }
        
        // Check if any negative meanings match the search terms
        if (negativeConnotations && negativeConnotations.exists && 
            Array.isArray(negativeConnotations.meanings) && 
            negativeConnotations.meanings.length > 0 && !negativeMatch) {
            
            // Find if any of the negative meanings match the search term closely
            const searchTerms = [...keywords, ...wordVariations].filter(term => term); // Filter out null/undefined
            
            for (const negativeMeaning of negativeConnotations.meanings) {
                if (!negativeMeaning) continue; // Skip undefined or null meanings
                
                const negString = String(negativeMeaning); // Convert to string
                
                for (const term of searchTerms) {
                    if (!term) continue; // Skip undefined or null terms
                    
                    const termString = String(term); // Convert to string
                    
                    try {
                        const similarityScore = calculateImprovedSimilarity(negString, termString);
                        
                        if (similarityScore > 0.5) {
                            negativeMatch = {
                                exists: true,
                                meaning: negativeMeaning,
                                matchPercentage: Math.round(similarityScore * 100)
                            };
                            break;
                        }
                    } catch (error) {
                        console.error("Error calculating similarity:", error, "for", negString, "and", termString);
                        continue; // Skip this comparison on error
                    }
                }
                if (negativeMatch) break;
            }
        }
        
        // Calculate final match percentage (0-100)
        let matchPercentage = Math.round(adjustedScore * 100);
        
        // Apply topic compatibility as a direct modifier to the match percentage
        // This ensures that low topic relevance significantly reduces the final match percentage
        matchPercentage = Math.round(matchPercentage * topicCompatibility);
        
        // Add this kanji to results if score is above threshold
        if (matchPercentage >= 25) {
            // Calculate final result data
            results.push({
                kanji: kanjiData.kanji,
                matchPercentage,
                matchedMeaning: bestMatch.meaning,
                meaningMatches,
                pronunciation: kanjiData.pronunciation || '',
                commonUsage: kanjiData.commonUsage || '',
                negativeConnotations,
                negativeMatch,
                topicCompatibility,
                data: {
                    // These will be populated later when details are requested
                    strokeOrderImage: `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${encodeURIComponent(kanjiData.kanji)}.svg`,
                    strokeCount: kanjiData.strokeCount || estimateStrokeCount(kanjiData.kanji),
                    commonWords: [],
                    culturalNotes: ''
                },
                matchSource: (bestMatch.word !== keywords[0]) ? bestMatch.word : null
            });
        }
    }
    
    return results;
}

async function getWordVariations(word) {
    // Start with the original word
    let variations = [word];
    
    try {
        // First try our internal thesaurus
        if (internalThesaurus[word]) {
            variations = variations.concat(internalThesaurus[word]);
        } else {
            // Try to get synonyms from the Datamuse API
            const response = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(word)}&max=8`);
            if (response.ok) {
                const data = await response.json();
                // Extract the actual words from the response
                const synonyms = data.map(item => item.word);
                // Add the synonyms to our variations
                variations = variations.concat(synonyms);
            }
        }
    } catch (error) {
        console.error("Error fetching synonyms:", error);
        // Fall back to internal thesaurus for similar cases
        for (const baseWord in internalThesaurus) {
            if (calculateImprovedSimilarity(word, baseWord) > 0.7) {
                variations = variations.concat(internalThesaurus[baseWord]);
                break;
            }
        }
    }
    
    // Filter out duplicates and return
    return [...new Set(variations)];
}

function calculateImprovedSimilarity(word1, word2) {
    // Handle undefined or null inputs
    if (!word1 || !word2) {
        console.log("Warning: Undefined or null word in similarity calculation");
        return 0; // No similarity for undefined/null words
    }
    
    // Ensure both inputs are strings
    word1 = String(word1);
    word2 = String(word2);
    
    // Convert both words to lowercase for consistency
    word1 = word1.toLowerCase();
    word2 = word2.toLowerCase();
    
    // Exact match
    if (word1 === word2) {
        return 1.0;
    }
    
    // One word contains the other as a whole word (more precise than simple inclusion)
    if (word1.match(new RegExp(`\\b${word2}\\b`)) || word2.match(new RegExp(`\\b${word1}\\b`))) {
        const longerLength = Math.max(word1.length, word2.length);
        const shorterLength = Math.min(word1.length, word2.length);
        return Math.min(0.95, (shorterLength / longerLength * 0.95)); // 95% match max if one contains the other as a whole word
    }
    
    // One is a substring of the other but not a whole word (less valuable match)
    if (word1.includes(word2) || word2.includes(word1)) {
        const longerLength = Math.max(word1.length, word2.length);
        const shorterLength = Math.min(word1.length, word2.length);
        // Reduce the match score for substring matches
        return Math.min(0.80, (shorterLength / longerLength * 0.8)); // 80% match max for substring
    }
    
    // Root word check (basic stemming)
    if (word1.length > 4 && word2.length > 4) {
        // Check if one word is a root of the other (e.g. "happy" and "happiness")
        const root1 = word1.substring(0, Math.floor(word1.length * 0.75));
        const root2 = word2.substring(0, Math.floor(word2.length * 0.75));
        
        if (word1.startsWith(root2) || word2.startsWith(root1)) {
            return 0.85; // 85% match for sharing a root
        }
    }
    
    // Calculate semantic distance (Levenshtein distance)
    const distance = levenshteinDistance(word1, word2);
    const maxLength = Math.max(word1.length, word2.length);
    
    // Convert distance to similarity score with a non-linear scaling for better precision
    const rawSimilarity = 1 - (distance / maxLength);
    
    // Apply stricter scaling function to reduce high scores for partial matches
    // This will give lower scores to words that are only somewhat similar
    return Math.pow(rawSimilarity, 1.5); // The power of 1.5 makes the score curve steeper
}

function adjustMatchScore(bestScore, meaningMatches, searchWord) {
    // Start with the best raw score
    let adjustedScore = bestScore;
    
    // 1. Exact matches should remain at 100%
    if (bestScore >= 0.99) {
        return 1.0;
    }
    
    // 2. Check for semantic equivalents - words that mean the same thing
    // This is a critical improvement for words like "brave" matching "courage"
    const semanticBoostWords = {
        // Courage/bravery semantic group
        'brave': ['courage', 'bravery', 'valor', 'heroism'],
        'courage': ['brave', 'bravery', 'valor', 'heroism'],
        'bravery': ['brave', 'courage', 'valor', 'heroism'],
        'valor': ['brave', 'courage', 'bravery', 'heroism'],
        'heroism': ['brave', 'courage', 'bravery', 'valor'],
        
        // Strength/power semantic group
        'strength': ['power', 'strong', 'might', 'force'],
        'power': ['strength', 'strong', 'might', 'force'],
        'strong': ['strength', 'power', 'might', 'force'],
        'might': ['strength', 'power', 'strong', 'force'],
        'force': ['strength', 'power', 'strong', 'might'],
        
        // Beauty semantic group
        'beauty': ['beautiful', 'gorgeous', 'pretty', 'aesthetic'],
        'beautiful': ['beauty', 'gorgeous', 'pretty', 'aesthetic'],
        'gorgeous': ['beauty', 'beautiful', 'pretty', 'aesthetic'],
        'pretty': ['beauty', 'beautiful', 'gorgeous', 'aesthetic'],
        
        // Intelligence semantic group
        'wisdom': ['intelligent', 'smart', 'knowledge', 'intellect'],
        'intelligent': ['wisdom', 'smart', 'knowledge', 'intellect'],
        'smart': ['wisdom', 'intelligent', 'knowledge', 'intellect'],
        'intellect': ['wisdom', 'intelligent', 'smart', 'knowledge'],
        'knowledge': ['wisdom', 'intelligent', 'smart', 'intellect'],
        
        // Love semantic group
        'love': ['affection', 'caring', 'passion', 'devotion'],
        'affection': ['love', 'caring', 'passion', 'devotion'],
        'caring': ['love', 'affection', 'passion', 'devotion'],
        
        // Peace semantic group
        'peace': ['harmony', 'tranquility', 'calm', 'serenity'],
        'harmony': ['peace', 'tranquility', 'calm', 'serenity'],
        'tranquility': ['peace', 'harmony', 'calm', 'serenity'],
        'calm': ['peace', 'harmony', 'tranquility', 'serenity'],
        'serenity': ['peace', 'harmony', 'tranquility', 'calm'],
        
        // Joy/happiness semantic group
        'joy': ['happiness', 'delight', 'pleasure', 'gladness'],
        'happiness': ['joy', 'delight', 'pleasure', 'gladness'],
        'delight': ['joy', 'happiness', 'pleasure', 'gladness'],
        'pleasure': ['joy', 'happiness', 'delight', 'gladness'],
        
        // Danger/risk semantic group
        'danger': ['risk', 'hazard', 'peril', 'threat'],
        'risk': ['danger', 'hazard', 'peril', 'threat'],
        'hazard': ['danger', 'risk', 'peril', 'threat'],
        'peril': ['danger', 'risk', 'hazard', 'threat'],
        
        // Truth/honesty semantic group
        'truth': ['honesty', 'integrity', 'sincerity', 'genuine'],
        'honesty': ['truth', 'integrity', 'sincerity', 'genuine'],
        'integrity': ['truth', 'honesty', 'sincerity', 'genuine'],
        'sincerity': ['truth', 'honesty', 'integrity', 'genuine']
    };
    
    // Check if we have a semantic match
    const semanticBoost = checkSemanticEquivalence(searchWord, meaningMatches, semanticBoostWords);
    if (semanticBoost > 0) {
        // Apply a significant boost to semantically equivalent matches
        // but only if they match the original search word, not synonyms
        const isDirectMatch = meaningMatches.some(match => 
            match.word === searchWord && 
            semanticBoostWords[searchWord] && 
            semanticBoostWords[searchWord].includes(match.meaning)
        );
        
        if (isDirectMatch) {
            adjustedScore = Math.min(0.95, adjustedScore + semanticBoost);
        } else {
            // Smaller boost for semantic matches through synonyms
            adjustedScore = Math.min(0.85, adjustedScore + (semanticBoost * 0.5));
        }
    }
    
    // 3. Penalize matches that are just "okay" more severely
    if (bestScore < 0.7 && semanticBoost === 0) {
        // Only reduce scores for mediocre matches if they didn't get a semantic boost
        adjustedScore = Math.pow(bestScore, 1.2);
    }
    
    // 4. Boost scores if multiple meanings match well
    if (meaningMatches.length > 1) {
        // Calculate how many meanings have good scores
        const goodMatches = meaningMatches.filter(match => match.score >= 0.7).length;
        if (goodMatches > 1) {
            // Add a small boost for multiple good matching meanings
            adjustedScore = Math.min(1.0, adjustedScore + (goodMatches * 0.03));
        }
    }
    
    // 5. Consider word length - shorter words should need more precision
    if (searchWord.length <= 4 && bestScore < 0.9 && semanticBoost === 0) {
        // Reduce scores for short words that don't match very well and didn't get a semantic boost
        adjustedScore *= 0.9;
    }
    
    // 6. Apply threshold scaling to create better separation between good and mediocre matches
    if (adjustedScore < 0.6 && semanticBoost === 0) {
        adjustedScore *= 0.85; // Further reduce low-quality matches
    }
    
    // 7. Apply a final curve to increase contrast between good and poor matches
    if (adjustedScore >= 0.6) {
        // Boost scores in the upper range (60%+)
        adjustedScore = Math.min(1.0, adjustedScore * 1.2);
    } else if (adjustedScore < 0.4) {
        // Decrease scores in the lower range
        adjustedScore = adjustedScore * 0.8;
    }
    
    return adjustedScore;
}

function checkSemanticEquivalence(searchWord, meaningMatches, semanticGroups) {
    // Handle undefined or null searchWord
    if (!searchWord) {
        return 0; // No semantic equivalence for undefined/null
    }
    
    // Convert search word to lowercase
    searchWord = String(searchWord).toLowerCase();
    
    // Check if our search word is in the semantic groups
    if (semanticGroups[searchWord]) {
        // Get the list of semantically equivalent words
        const equivalentWords = semanticGroups[searchWord];
        
        // Look for matches where the kanji meaning is in our equivalent words list
        for (const match of meaningMatches) {
            // Skip undefined or null meanings
            if (!match || !match.meaning) continue;
            
            const meaning = String(match.meaning).toLowerCase();
            
            if (equivalentWords.includes(meaning)) {
                return 0.3; // Significant boost for semantic equivalents
            }
        }
        
        // If we didn't find a direct match, check for partial matches
        for (const match of meaningMatches) {
            // Skip undefined or null meanings
            if (!match || !match.meaning) continue;
            
            const meaning = String(match.meaning).toLowerCase();
            
            // Check if any equivalent words are part of the meaning
            for (const equiv of equivalentWords) {
                if (meaning.includes(equiv)) {
                    return 0.2; // Smaller boost for partial semantic matches
                }
            }
        }
    }
    
    return 0; // No semantic equivalence found
}

function checkNegativeConnotations(searchWord, kanjiData) {
    // If kanjiData or negativeConnotations is null or undefined, return a default object
    if (!kanjiData || !kanjiData.negativeConnotations) {
        console.log("Warning: kanjiData or negativeConnotations is undefined for searchWord:", searchWord);
        return { exists: false, matchPercentage: 0, meaning: '', meanings: [] };
    }
    
    // If no negative connotations exist, return a properly formed object instead of null
    if (!kanjiData.negativeConnotations.exists) {
        return { exists: false, matchPercentage: 0, meaning: '', meanings: [] };
    }
    
    // Ensure meanings is an array
    const negativeMeanings = Array.isArray(kanjiData.negativeConnotations.meanings) 
        ? kanjiData.negativeConnotations.meanings 
        : [];
    
    if (negativeMeanings.length === 0) {
        return { exists: false, matchPercentage: 0, meaning: '', meanings: [] };
    }
    
    let highestMatch = 0;
    let matchedNegativeMeaning = '';
    
    negativeMeanings.forEach(meaning => {
        const score = calculateImprovedSimilarity(searchWord, meaning);
        if (score > highestMatch) {
            highestMatch = score;
            matchedNegativeMeaning = meaning;
        }
    });
    
    // If there's a significant match to a negative meaning
    if (highestMatch >= 0.4) {
        return {
            exists: true,
            matchPercentage: Math.round(highestMatch * 100),
            meaning: matchedNegativeMeaning,
            meanings: negativeMeanings
        };
    }
    
    // Return info that there are negative meanings but they don't match the search
    return {
        exists: false,
        matchPercentage: 0,
        meaning: '',
        meanings: negativeMeanings
    };
}

function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    
    // Create matrix
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // Initialize first row and column
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }
    
    // Fill the matrix
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],     // deletion
                    dp[i][j - 1],     // insertion
                    dp[i - 1][j - 1]  // substitution
                );
            }
        }
    }
    
    return dp[m][n];
}

function displayResults(results, searchInput, wordVariations) {
    // Handle undefined/null parameters
    if (!results) {
        console.error("displayResults called with undefined/null results");
        resultsContainer.innerHTML = '<p class="error">Error: No results to display</p>';
        return;
    }
    
    // Ensure searchInput is a string
    searchInput = searchInput || "";
    
    // Ensure wordVariations is an array
    wordVariations = Array.isArray(wordVariations) ? wordVariations : [];
    
    // Store results globally for access from detail view
    lastSearchResults = results;
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h2>No Kanji Found</h2>
                <p>No Kanji characters were found that match "${searchInput}".</p>
                <p>Try a different word or check your spelling.</p>
            </div>
        `;
        return;
    }
    
    // Create a header showing extracted keywords
    const keywords = extractKeywords(searchInput);
    let keywordText = keywords.join(', ');
    
    // Identify the topics for explanation
    const searchTopics = identifyTopics(keywords);
    let topicsText = '';
    if (searchTopics.length > 0) {
        topicsText = `<p class="search-topics">Identified topics: ${searchTopics.join(', ')}</p>`;
    }
    
    // Create a summary of other word variations used
    let variationsText = '';
    const uniqueVariations = [...new Set(wordVariations.filter(w => !keywords.includes(w)))];
    if (uniqueVariations.length > 0) {
        variationsText = `<p class="search-keywords">Related words used: ${uniqueVariations.join(', ')}</p>`;
    }
    
    // Create the results header
    const resultHeader = `
        <div class="results-header">
            <h2>Kanji Matches for "${searchInput}"</h2>
            <p class="search-keywords">Keywords extracted: ${keywordText}</p>
            ${topicsText}
            ${variationsText}
            <p class="results-count">${results.length} results found</p>
        </div>
    `;
    
    // Sort results by match percentage (highest first)
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Create result items HTML
    let resultItemsHTML = '';
    
    // Loop through results and create each Kanji card
    results.forEach((result, index) => {
        // Skip results with very low match percentages after adjustment
        if (result.matchPercentage < 25) {
            return;
        }
        
        const kanjiCard = document.createElement('div');
        kanjiCard.className = 'kanji-card';
        kanjiCard.dataset.index = index; // Store the result index for lookup
        kanjiCard.setAttribute('role', 'button');
        kanjiCard.setAttribute('tabindex', '0');
        kanjiCard.setAttribute('aria-label', `View details for kanji ${result.kanji}`);
        
        // Determine card status class based on match percentage and negative connotations
        if (result.negativeMatch && result.negativeMatch.exists) {
            kanjiCard.classList.add('negative-match');
        } else if (result.negativeConnotations && result.negativeConnotations.exists) {
            // Add a warning class for kanji with negative connotations even if not directly matched
            kanjiCard.classList.add('negative-match');
        } else if (result.matchPercentage >= 75) {
            kanjiCard.classList.add('perfect-match');
        } else if (result.matchPercentage >= 55) {
            kanjiCard.classList.add('good-match');
        }
        
        // Add topic mismatch class if topic compatibility is low
        if (result.topicCompatibility < 0.7) {
            kanjiCard.classList.add('topic-mismatch');
        }
        
        let matchQuality;
        if (result.matchPercentage >= 85) {
            matchQuality = '★★★ Perfect match ★★★';
        } else if (result.matchPercentage >= 70) {
            matchQuality = '★★ Excellent match ★★';
        } else if (result.matchPercentage >= 55) {
            matchQuality = '★ Good match ★';
        } else if (result.matchPercentage >= 40) {
            matchQuality = 'Moderate match';
        } else {
            matchQuality = 'Partial match';
        }
        
        // Create additional meanings HTML
        let additionalMeaningsHtml = '';
        if (result.meaningMatches.length > 1) {
            additionalMeaningsHtml = '<div class="additional-meanings"><strong>All meanings:</strong> ';
            result.meaningMatches.forEach((match, index) => {
                additionalMeaningsHtml += `<span>${match.meaning} (${Math.round(match.score * 100)}%)</span>`;
                if (index < result.meaningMatches.length - 1) {
                    additionalMeaningsHtml += ', ';
                }
            });
            additionalMeaningsHtml += '</div>';
        }
        
        // Add matched via information if applicable
        let matchSourceHtml = '';
        if (result.matchSource) {
            matchSourceHtml = `<div class="match-source">Matched via similar word: "${result.matchSource}"</div>`;
        }
        
        // Create topical relevance indicator
        let topicRelevanceHtml = '';
        const topicPercentage = Math.round(result.topicCompatibility * 100);
        if (result.topicCompatibility < 0.7) {
            topicRelevanceHtml = `<div class="topic-relevance low">Topic relevance: ${topicPercentage}%</div>`;
        } else if (result.topicCompatibility < 1.0) {
            topicRelevanceHtml = `<div class="topic-relevance medium">Topic relevance: ${topicPercentage}%</div>`;
        } else {
            topicRelevanceHtml = `<div class="topic-relevance high">Topic relevance: ${topicPercentage}%</div>`;
        }
        
        // Create warning HTML if necessary
        let warningHtml = '';
        if (result.negativeConnotations && result.negativeConnotations.exists) {
            if (result.negativeMatch && result.negativeMatch.exists) {
                warningHtml = `
                <div class="warning-box">
                    <div class="warning-icon">⚠️</div>
                    <div class="warning-text">
                        <strong>IMPORTANT WARNING:</strong> This kanji can have the negative meaning "${result.negativeMatch.meaning}" 
                        which is ${result.negativeMatch.matchPercentage}% similar to your search term.
                    </div>
                </div>`;
            } else {
                const negativeMeanings = Array.isArray(result.negativeConnotations.meanings) 
                    ? result.negativeConnotations.meanings.join(', ') 
                    : '';
                warningHtml = `
                <div class="caution-box">
                    <div class="caution-icon">ℹ️</div>
                    <div class="caution-text">
                        <strong>Be Aware:</strong> This kanji can also carry negative connotations: ${negativeMeanings}
                    </div>
                </div>`;
            }
        }
        
        // Add conceptual mismatch warning if applicable
        if (result.topicCompatibility < 0.6) {
            warningHtml += `
            <div class="caution-box topic-warning">
                <div class="caution-icon">⚠️</div>
                <div class="caution-text">
                    <strong>Note:</strong> This kanji may not be directly related to your search topic.
                </div>
            </div>`;
        }
        
        // Add view details button with icon
        const viewDetailsHtml = `
        <div class="view-details-button">
            <button class="view-details" data-index="${index}">
                <i class="ri-information-line"></i> View Detailed Information
            </button>
        </div>`;
        
        kanjiCard.innerHTML = `
            <div class="kanji-character">${result.kanji}</div>
            <div class="match-percentage">${result.matchPercentage}% Match</div>
            <div class="match-indicator">${matchQuality}</div>
            ${topicRelevanceHtml}
            ${matchSourceHtml}
            <div class="kanji-info">
                <div><strong>Primary meaning:</strong> ${result.matchedMeaning}</div>
                ${additionalMeaningsHtml}
                <div><strong>Pronunciation:</strong> ${result.pronunciation}</div>
                <div><strong>Common usage:</strong> ${result.commonUsage}</div>
            </div>
            ${warningHtml}
            ${viewDetailsHtml}
        `;
        
        resultItemsHTML += kanjiCard.outerHTML;
    });
    
    // Calculate appropriate grid layout based on number of results
    let gridLayoutClass = '';
    if (results.length === 1) {
        gridLayoutClass = 'single-result';
    } else if (results.length === 2) {
        gridLayoutClass = 'two-results';
    } else if (results.length >= 3) {
        gridLayoutClass = 'multi-results';
    }
    
    // Create the final results container with the appropriate grid layout class
    const resultsContainerContent = `
        ${resultHeader}
        <div class="results-container ${gridLayoutClass}">
            ${resultItemsHTML}
        </div>
    `;
    
    resultsContainer.innerHTML = resultsContainerContent;
    
    // Add event listeners to kanji cards
    document.querySelectorAll('.kanji-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger the card click if the user clicked on a button
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            const resultIndex = parseInt(this.dataset.index);
            showKanjiForIndex(resultIndex);
        });
        
        // Also handle keyboard navigation for accessibility
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const resultIndex = parseInt(this.dataset.index);
                showKanjiForIndex(resultIndex);
                e.preventDefault();
            }
        });
    });
    
    // Add event listeners to view details buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function(e) {
            const resultIndex = parseInt(this.dataset.index);
            console.log("View details button clicked with index:", resultIndex);
            showKanjiForIndex(resultIndex);
            e.preventDefault();
        });
    });
    
    // Close modal when clicking outside the content
    const modal = document.getElementById('kanji-detail-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeKanjiModal();
            }
        });
    }
}

/**
 * Show detailed information about a kanji in a modal window
 * @param {object} kanjiData - The kanji data object
 */
function showKanjiDetail(kanjiData) {
    console.log("showKanjiDetail called with:", kanjiData);
    
    try {
        // Validate the input data more thoroughly
        if (!kanjiData) {
            console.error("Invalid kanji data: null or undefined");
            alert("Error: Could not load kanji details. Invalid data received.");
            return;
        }
        
        if (!kanjiData.kanji) {
            console.error("Invalid kanji data: missing kanji property", kanjiData);
            alert("Error: Could not load kanji details. Incomplete data received.");
            return;
        }
        
        // Get the modal and detail container
        const detailModal = document.getElementById('kanji-detail-modal');
        const detailContainer = document.getElementById('kanji-detail-container');
        
        if (!detailModal) {
            console.error("Modal element not found");
            alert("Error: Could not find the modal element. Please refresh the page.");
            return;
        }
        
        if (!detailContainer) {
            console.error("Detail container element not found");
            alert("Error: Could not find the detail container. Please refresh the page.");
            return;
        }
        
        // Update the modal title
        const modalTitle = detailModal.querySelector('.modal-header h2');
        if (modalTitle) {
            modalTitle.textContent = `Details for ${kanjiData.kanji}`;
        }
        
        // Ensure kanjiData.data exists
        if (!kanjiData.data) {
            kanjiData.data = {};
        }
        
        // Get or estimate stroke count
        const strokeCount = kanjiData.data.strokeCount || estimateStrokeCount(kanjiData.kanji);
        
        // Generate example common words using the kanji
        const generatedCommonWords = generateCommonWords(kanjiData);
        const commonWords = kanjiData.data && kanjiData.data.commonWords && Array.isArray(kanjiData.data.commonWords) && kanjiData.data.commonWords.length > 0 ? 
                            kanjiData.data.commonWords : generatedCommonWords;
        
        // Generate cultural notes if needed
        const generatedCulturalNotes = generateCulturalNotes(kanjiData);
        const culturalNotes = kanjiData.data && kanjiData.data.culturalNotes && typeof kanjiData.data.culturalNotes === 'string' && kanjiData.data.culturalNotes.length > 0 ? 
                             kanjiData.data.culturalNotes : generatedCulturalNotes;
        
        // Format the common words into a list
        let commonWordsHTML = '<ul class="common-words-list">';
        if (commonWords.length > 0) {
            commonWords.forEach(word => {
                commonWordsHTML += `
                    <li>
                        <span class="common-word-kanji">${word.kanji || ''}</span>
                        <span class="common-word-reading">${word.reading || ''}</span>
                        <span class="common-word-meaning">${word.meaning || ''}</span>
                    </li>
                `;
            });
        } else {
            commonWordsHTML += '<li>No common words available.</li>';
        }
        commonWordsHTML += '</ul>';
        
        // Create an empty container for the font display that will be populated by fetchAndDisplayJishoData
        const fontDisplayContainer = `
            <div id="stroke-order-display">
                <!-- This will be filled with font options by fetchAndDisplayJishoData -->
            </div>
        `;
        
        // Create the content for the detail container
        detailContainer.innerHTML = `
            <div class="kanji-font-options-container">
                <h3>Kanji Font Options for Tattoo</h3>
                <div class="tattoo-font-display">
                    ${fontDisplayContainer}
                </div>
            </div>
            <div class="common-words-container">
                <h3>Common Words</h3>
                ${commonWordsHTML}
            </div>
            <div class="cultural-notes">
                <h3>Cultural Notes</h3>
                <p>${culturalNotes}</p>
            </div>
            <div class="tattoo-examples">
                <h3>Sample Tattoo Styles</h3>
                <div class="tattoo-examples-container" id="tattooExamples">
                    <p>Loading examples...</p>
                </div>
            </div>
        `;
        
        // Add event handlers
        const closeButton = detailModal.querySelector('.close-modal');
        if (closeButton) {
            closeButton.onclick = function() {
                closeKanjiModal();
                return false;
            };
        } else {
            console.error("Close button not found in modal");
        }
        
        detailModal.onclick = function(event) {
            if (event.target === detailModal) {
                closeKanjiModal();
            }
        };
        
        // Add styles for the tattoo fonts
        ensureTattooFontStyles();
        
        // Display the modal
        detailModal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        
        // Fetch and display Jisho data (which now immediately shows the font options)
        fetchAndDisplayJishoData(kanjiData.kanji);
        
        // Load tattoo examples after showing the modal
        try {
            searchTattooExamples(kanjiData.kanji);
        } catch (error) {
            console.warn("Non-critical error loading tattoo examples:", error);
            const examplesContainer = document.getElementById('tattooExamples');
            if (examplesContainer) {
                examplesContainer.innerHTML = '<p>Unable to load tattoo examples at this time.</p>';
            }
        }
        
    } catch (error) {
        console.error("Error displaying kanji detail:", error);
        alert("Error: Could not display kanji details. Please try again.");
    }
}

/**
 * Fetch and display kanji data from Jisho
 * @param {string} kanji - The kanji character
 */
async function fetchAndDisplayJishoData(kanji) {
    try {
        const strokeOrderDisplay = document.getElementById('stroke-order-display');
        
        if (!strokeOrderDisplay) {
            console.error("Could not find stroke order display element");
            return;
        }
        
        // Immediately show the kanji in different fonts first
        strokeOrderDisplay.innerHTML = getKanjiTattooFontsHtml(kanji);
        
        // Then fetch Jisho data in the background
        const jishoData = await fetchKanjiDataFromJisho(kanji);
        
        if (!jishoData || !jishoData.data || jishoData.data.length === 0) {
            // Keep the tattoo fonts display if Jisho data isn't available
            return;
        }
        
        // Get stroke count from our estimate as fallback
        let strokeCount = estimateStrokeCount(kanji);
        let meanings = [];
        let kunReadings = [];
        let onReadings = [];
        
        // Process Jisho data to find kanji information
        for (const item of jishoData.data) {
            // Look for items with the kanji tag
            if (item.tags && item.tags.includes("kanji")) {
                console.log("Found kanji data in Jisho response:", item);
                
                // Extract stroke count if available
                if (item.stroke_count) {
                    strokeCount = item.stroke_count;
                }
                
                // Extract readings and meanings
                if (item.japanese && item.japanese.length > 0) {
                    for (const jp of item.japanese) {
                        if (jp.word === kanji) {
                            // Found matching kanji
                            if (jp.reading) {
                                kunReadings.push(jp.reading);
                            }
                        }
                    }
                }
                
                // Extract meanings
                if (item.senses && item.senses.length > 0) {
                    for (const sense of item.senses) {
                        if (sense.english_definitions) {
                            meanings = meanings.concat(sense.english_definitions);
                        }
                    }
                }
                
                // Extract more readings
                if (item.japanese && item.japanese.length > 0) {
                    for (const jp of item.japanese) {
                        if (jp.reading && !kunReadings.includes(jp.reading)) {
                            onReadings.push(jp.reading);
                        }
                    }
                }
            }
        }
        
        // Try to extract more information by looking at all entries
        if (meanings.length === 0 || kunReadings.length === 0) {
            for (const item of jishoData.data) {
                if (item.japanese) {
                    for (const jp of item.japanese) {
                        if (jp.word && jp.word.includes(kanji)) {
                            // This entry contains our kanji
                            if (jp.reading && !kunReadings.includes(jp.reading) && !onReadings.includes(jp.reading)) {
                                kunReadings.push(jp.reading);
                            }
                            
                            if (item.senses && meanings.length === 0) {
                                for (const sense of item.senses) {
                                    if (sense.english_definitions) {
                                        meanings = meanings.concat(sense.english_definitions.slice(0, 3)); // Take just first 3 meanings
                                        break; // Just take meanings from first sense
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // Update the jisho info section if we found additional information
        if (meanings.length > 0 || kunReadings.length > 0 || onReadings.length > 0) {
            const infoSection = document.createElement('div');
            infoSection.className = 'jisho-info-section';
            infoSection.innerHTML = `
                <div class="stroke-count-info">Stroke count: ${strokeCount}</div>
                <div class="jisho-info">
                    ${meanings.length > 0 ? `<div class="jisho-meanings">Meanings: ${meanings.slice(0, 5).join(', ')}</div>` : ''}
                    ${kunReadings.length > 0 ? `<div class="jisho-kun">Readings: ${kunReadings.slice(0, 3).join(', ')}</div>` : ''}
                    ${onReadings.length > 0 ? `<div class="jisho-on">Alternative: ${onReadings.slice(0, 3).join(', ')}</div>` : ''}
                </div>
                <div class="alternative-sources">
                    <p>Additional Resources:</p>
                    <div class="alt-buttons">
                        <a href="https://jisho.org/search/${encodeURIComponent(kanji)}%20%23kanji" target="_blank" class="alt-link">Jisho</a>
                        <a href="https://en.wiktionary.org/wiki/${encodeURIComponent(kanji)}" target="_blank" class="alt-link">Wiktionary</a>
                    </div>
                </div>
            `;
            
            // Add the info section before the tattoo-notes div
            const tattooNotes = strokeOrderDisplay.querySelector('.tattoo-notes');
            if (tattooNotes) {
                strokeOrderDisplay.insertBefore(infoSection, tattooNotes);
            } else {
                strokeOrderDisplay.appendChild(infoSection);
            }
        }
        
        // Ensure tattoo fonts styles are added
        ensureTattooFontStyles();
        
    } catch (error) {
        console.error("Error fetching or displaying Jisho data:", error);
        const strokeOrderDisplay = document.getElementById('stroke-order-display');
        if (strokeOrderDisplay) {
            strokeOrderDisplay.innerHTML = getKanjiTattooFontsHtml(kanji);
        }
    }
}

/**
 * Get HTML for displaying kanji in different tattoo fonts
 * @param {string} kanji - The kanji character
 * @return {string} - HTML for tattoo font display
 */
function getKanjiTattooFontsHtml(kanji) {
    return `
        <div class="tattoo-fonts-display">
            <!-- Traditional style -->
            <div class="tattoo-font-card">
                <div class="font-sample font-traditional">${kanji}</div>
                <div class="font-info">
                    <div class="font-name">Traditional</div>
                    <div class="font-desc">Classic block style</div>
                </div>
            </div>

            <!-- Artistic style -->
            <div class="tattoo-font-card">
                <div class="font-sample font-artistic">${kanji}</div>
                <div class="font-info">
                    <div class="font-name">Artistic</div>
                    <div class="font-desc">Flowing brush style</div>
                </div>
            </div>

            <!-- Bold style -->
            <div class="tattoo-font-card">
                <div class="font-sample font-bold">${kanji}</div>
                <div class="font-info">
                    <div class="font-name">Bold</div>
                    <div class="font-desc">Strong impact style</div>
                </div>
            </div>

            <!-- Elegant style -->
            <div class="tattoo-font-card">
                <div class="font-sample font-elegant">${kanji}</div>
                <div class="font-info">
                    <div class="font-name">Elegant</div>
                    <div class="font-desc">Refined thin style</div>
                </div>
            </div>

            <!-- Modern style -->
            <div class="tattoo-font-card">
                <div class="font-sample font-modern">${kanji}</div>
                <div class="font-info">
                    <div class="font-name">Modern</div>
                    <div class="font-desc">Contemporary style</div>
                </div>
            </div>
        </div>
        
        <div class="tattoo-notes">
            <p class="note-heading">Tattoo Artist Tip:</p>
            <p>Japanese kanji for tattoos are best rendered by artists with experience in Asian calligraphy. 
            Bring reference images and consult with a professional tattoo artist who specializes in this style.</p>
        </div>
    `;
}

/**
 * Ensure tattoo font styles are added to the page
 */
function ensureTattooFontStyles() {
    if (!document.getElementById('tattoo-font-styles')) {
        // Create style element for tattoo fonts
        const styleElement = document.createElement('style');
        styleElement.id = 'tattoo-font-styles';
        
        // Add CSS for tattoo fonts
        styleElement.textContent = `
            .kanji-font-options-container {
                margin-bottom: 25px;
                background-color: #f9f9f9;
                padding: 20px;
                border-radius: 8px;
            }
            
            .tattoo-font-display {
                margin-top: 15px;
            }
            
            .tattoo-fonts-display {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 20px;
                margin: 25px 0;
            }
            
            .tattoo-font-card {
                width: 130px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                padding: 15px;
                text-align: center;
                transition: transform 0.2s, box-shadow 0.3s;
                overflow: hidden;
            }
            
            .tattoo-font-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .font-sample {
                font-size: 80px;
                line-height: 1.2;
                margin-bottom: 10px;
                color: black;
                padding: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100px;
                width: 100%;
            }
            
            .font-info {
                border-top: 1px solid #eee;
                padding-top: 10px;
            }
            
            .font-name {
                font-weight: bold;
                color: #333;
                margin-bottom: 3px;
                font-size: 16px;
            }
            
            .font-desc {
                color: #777;
                font-size: 12px;
            }
            
            /* Font Styles - Made visually distinct */
            .font-traditional {
                font-family: serif;
                font-weight: 500;
                border: 2px solid #000;
                background-color: #fff;
                text-shadow: none;
                transform: none;
                border-radius: 0;
            }
            
            .font-artistic {
                font-family: cursive, serif;
                font-style: italic;
                transform: skewX(-10deg) rotate(-3deg);
                text-shadow: 2px 2px 3px rgba(0,0,0,0.2);
                background: linear-gradient(180deg, #fcfcfc, #f0f0f0);
                border-radius: 5px;
                color: #000;
            }
            
            .font-bold {
                font-family: sans-serif;
                font-weight: 900;
                transform: scale(1.1);
                letter-spacing: -0.05em;
                color: #000;
                -webkit-text-stroke: 1px #000;
                filter: contrast(1.2);
                background-color: #f8f8f8;
                box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
            }
            
            .font-elegant {
                font-family: "Times New Roman", serif;
                font-weight: 300;
                transform: scaleY(1.2);
                letter-spacing: 0.1em;
                color: #333;
                background: linear-gradient(135deg, #f9f9f9, #e0e0e0);
                border-radius: 10px;
                border: 1px solid #ddd;
                box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
            }
            
            .font-modern {
                font-family: Arial, sans-serif;
                font-weight: 400;
                letter-spacing: 0.05em;
                color: white;
                background-color: #333;
                border-radius: 5px;
                padding: 5px;
                box-shadow: 0 3px 5px rgba(0,0,0,0.2);
            }
            
            /* Additional styling to enhance font display */
            .tattoo-font-card:first-child { border-top: 3px solid #8a2be2; }
            .tattoo-font-card:nth-child(2) { border-top: 3px solid #ff4500; }
            .tattoo-font-card:nth-child(3) { border-top: 3px solid #2e8b57; }
            .tattoo-font-card:nth-child(4) { border-top: 3px solid #1e90ff; }
            .tattoo-font-card:nth-child(5) { border-top: 3px solid #ff6347; }
            
            /* Tattoo notes */
            .tattoo-notes {
                margin-top: 15px;
                padding: 15px;
                background-color: #f0f8ff;
                border-left: 4px solid #4da6ff;
                border-radius: 4px;
                font-size: 0.9em;
                line-height: 1.4;
            }
            
            .note-heading {
                font-weight: bold;
                margin-bottom: 5px;
                color: #2c5777;
            }
            
            /* Alternative sources styling */
            .alternative-sources {
                margin-top: 25px;
                border-top: 1px solid #eee;
                padding-top: 15px;
                text-align: center;
            }
            
            .alt-buttons {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-top: 8px;
            }
            
            .alt-link {
                display: inline-block;
                padding: 8px 15px;
                background-color: #f0f0f0;
                color: #555;
                border-radius: 4px;
                text-decoration: none;
                transition: background-color 0.2s;
            }
            
            .alt-link:hover {
                background-color: #e0e0e0;
                color: #333;
            }
            
            /* CSS hack to ensure proper kanji display in different browsers */
            @supports (-webkit-appearance:none) {
                .font-sample {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            }
            
            /* Additional styles from stroke diagram styles */
            .stroke-count-info {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 15px;
                color: #333;
            }
            
            .jisho-info {
                margin-top: 15px;
                text-align: left;
                padding: 10px;
                background-color: #f5f5f5;
                border-radius: 5px;
            }
            
            .jisho-meanings {
                margin-bottom: 8px;
                font-weight: bold;
            }
            
            .jisho-kun, .jisho-on {
                margin-bottom: 5px;
                color: #555;
            }
            
            .jisho-info-section {
                margin: 20px 0;
                padding: 15px;
                background-color: #f9f9f9;
                border-radius: 8px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }
            
            /* Common container styles */
            .stroke-order-container,
            .common-words-container,
            .cultural-notes,
            .tattoo-examples {
                margin-bottom: 25px;
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 8px;
            }
            
            /* Common words styles */
            .common-words-list {
                padding: 0;
                margin: 0;
                list-style-type: none;
            }
            
            .common-words-list li {
                padding: 10px;
                border-bottom: 1px solid #eee;
                margin-bottom: 5px;
            }
            
            .common-word-kanji {
                font-size: 1.2em;
                font-weight: bold;
                margin-right: 10px;
            }
            
            .common-word-reading {
                color: #666;
                font-style: italic;
                margin-right: 10px;
            }
            
            .common-word-meaning {
                color: #333;
            }
            
            /* Responsive styles */
            @media (max-width: 600px) {
                .tattoo-fonts-display {
                    gap: 10px;
                }
                
                .tattoo-font-card {
                    width: 100px;
                }
                
                .font-sample {
                    font-size: 60px;
                    height: 80px;
                }
                
                .font-name {
                    font-size: 14px;
                }
                
                .font-desc {
                    font-size: 10px;
                }
                
                .stroke-count-info {
                    font-size: 16px;
                }
                
                .jisho-info {
                    font-size: 14px;
                }
            }
        `;
        
        // Append to document head
        document.head.appendChild(styleElement);
    }
}

/**
 * Generate common words for a kanji based on its commonUsage property
 * @param {object} kanjiData - The kanji data
 * @return {array} - Array of common word objects
 */
function generateCommonWords(kanjiData) {
    const commonWords = [];
    
    // If no kanji data, return empty array
    if (!kanjiData) return commonWords;
    
    try {
        // Extract from commonUsage field if available
        if (kanjiData.commonUsage) {
            // Look for patterns like "Word (漢字 reading)"
            const matches = kanjiData.commonUsage.match(/([^,()]+)\s+\(([^)]+)\s+([^)]+)\)/g);
            
            if (matches) {
                matches.forEach(match => {
                    const parts = match.match(/([^,()]+)\s+\(([^)]+)\s+([^)]+)\)/);
                    if (parts && parts.length >= 4) {
                        commonWords.push({
                            kanji: parts[2],
                            reading: parts[3],
                            meaning: parts[1]
                        });
                    }
                });
            }
            
            // If we couldn't extract from the pattern, create at least one word
            if (commonWords.length === 0) {
                const parts = kanjiData.commonUsage.split(',');
                if (parts.length > 0) {
                    parts.forEach(part => {
                        const cleaned = part.trim();
                        if (cleaned) {
                            // Look for patterns with parentheses
                            const partMatch = cleaned.match(/([^()]+)\s+\(([^)]+)\)/);
                            if (partMatch) {
                                commonWords.push({
                                    kanji: partMatch[1],
                                    reading: partMatch[2],
                                    meaning: kanjiData.meanings && Array.isArray(kanjiData.meanings) && kanjiData.meanings.length > 0 
                                            ? kanjiData.meanings[0] 
                                            : cleaned
                                });
                            }
                        }
                    });
                }
            }
        }
        
        // If we still have no common words, create a default one
        if (commonWords.length === 0) {
            commonWords.push({
                kanji: kanjiData.kanji,
                reading: kanjiData.pronunciation || 'N/A',
                meaning: kanjiData.meanings && Array.isArray(kanjiData.meanings) && kanjiData.meanings.length > 0 
                        ? kanjiData.meanings[0] 
                        : 'No meaning available'
            });
        }
    } catch (error) {
        console.error("Error generating common words:", error);
        // Ensure we return at least something even if an error occurs
        if (commonWords.length === 0) {
            commonWords.push({
                kanji: kanjiData.kanji || '?',
                reading: 'N/A',
                meaning: 'No meaning available'
            });
        }
    }
    
    return commonWords;
}

/**
 * Generate cultural notes for a kanji based on its properties
 * @param {object} kanjiData - The kanji data
 * @return {string} - Generated cultural notes
 */
function generateCulturalNotes(kanjiData) {
    if (!kanjiData) return 'No cultural information available.';
    
    try {
        let primaryMeaning = 'unknown meaning';
        if (kanjiData.meanings && Array.isArray(kanjiData.meanings) && kanjiData.meanings.length > 0) {
            primaryMeaning = kanjiData.meanings[0];
        }
        
        let notes = `The kanji ${kanjiData.kanji} represents ${primaryMeaning}.`;
        
        // Add pronunciation information
        if (kanjiData.pronunciation) {
            notes += ` In Japanese, it is pronounced as "${kanjiData.pronunciation}".`;
        }
        
        return notes;
    } catch (error) {
        console.error("Error generating cultural notes:", error);
        return `The kanji ${kanjiData.kanji || '?'} has limited cultural information available.`;
    }
}

/**
 * Get stroke order diagram URL from external API
 * @param {string} kanji - The kanji character
 * @return {string} - URL to the stroke order diagram
 */
function getKanjiStrokeOrderUrl(kanji) {
    // For Jisho, we'll use their API to get data for this kanji
    return `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(kanji)}%20%23kanji`;
}

/**
 * Fetch kanji data from Jisho API
 * @param {string} kanji - The kanji character
 * @return {Promise<object>} - Promise resolving to kanji data
 */
async function fetchKanjiDataFromJisho(kanji) {
    console.log(`Fetching Jisho data for kanji: ${kanji}`);
    
    const directUrl = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(kanji)}%20%23kanji`;
    // CORS proxy URLs as fallbacks (only use if direct URL fails due to CORS)
    const proxyUrls = [
        `https://cors-anywhere.herokuapp.com/${directUrl}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(directUrl)}`,
        `https://corsproxy.io/?${encodeURIComponent(directUrl)}`
    ];
    
    // First try direct call without proxy
    try {
        console.log("Trying direct API call to Jisho...");
        const response = await fetch(directUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch from Jisho API: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Successfully fetched data from Jisho:", data);
        return data;
    } catch (error) {
        console.warn("Direct API call failed, may be CORS issue:", error);
        
        // Try with various CORS proxies as fallback
        for (const proxyUrl of proxyUrls) {
            try {
                console.log(`Trying with CORS proxy: ${proxyUrl}`);
                const response = await fetch(proxyUrl);
                
                if (!response.ok) {
                    console.warn(`Proxy attempt failed: ${response.status}`);
                    continue;
                }
                
                const data = await response.json();
                console.log("Successfully fetched data via proxy:", data);
                return data;
            } catch (proxyError) {
                console.warn(`Proxy attempt failed:`, proxyError);
                // Continue to next proxy
            }
        }
        
        // All attempts failed, create fallback data
        console.error("All API attempts failed, using fallback data");
        return createFallbackJishoData(kanji);
    }
}

/**
 * Create fallback Jisho data when API calls fail
 * @param {string} kanji - The kanji character
 * @return {object} - Fallback data structure
 */
function createFallbackJishoData(kanji) {
    // Find in our local database if possible
    const localKanjiData = kanjiDatabase.find(k => k.kanji === kanji);
    
    // Construct an object that mimics Jisho API response format
    const fallbackData = {
        meta: {
            status: 200,
            source: "local_fallback"
        },
        data: []
    };
    
    if (localKanjiData) {
        // Use our local data
        fallbackData.data.push({
            slug: kanji,
            tags: ["kanji"],
            japanese: [
                {
                    word: kanji,
                    reading: localKanjiData.pronunciation || ""
                }
            ],
            senses: [
                {
                    english_definitions: localKanjiData.meanings || ["unknown"]
                }
            ],
            stroke_count: estimateStrokeCount(kanji)
        });
    } else {
        // Completely fallback data
        fallbackData.data.push({
            slug: kanji,
            tags: ["kanji"],
            japanese: [
                {
                    word: kanji,
                    reading: ""
                }
            ],
            senses: [
                {
                    english_definitions: ["Meaning not available"]
                }
            ],
            stroke_count: estimateStrokeCount(kanji)
        });
    }
    
    return fallbackData;
}

/**
 * Extract stroke order URL from Jisho data
 * @param {object} jishoData - Data from Jisho API
 * @return {string|null} - URL to stroke order SVG or null if not found
 */
function extractStrokeOrderFromJishoData(jishoData) {
    if (!jishoData || !jishoData.data || !jishoData.data.length) {
        return null;
    }
    
    // Look through the data for kanji information
    for (const item of jishoData.data) {
        if (item.japanese && item.japanese.length && item.japanese[0].word) {
            const kanji = item.japanese[0].word;
            
            // Jisho doesn't directly provide stroke order SVGs in their API
            // Instead, we'll construct a URL to their stroke order diagram page
            return `https://jisho.org/search/${encodeURIComponent(kanji)}%20%23kanji`;
        }
    }
    
    return null;
}

/**
 * Create reliable HTML for the stroke order
 * @param {string} kanji - The kanji character
 * @return {string} - HTML for the stroke order
 */
function getReliableStrokeOrderHtml(kanji) {
    // Estimated stroke count for common kanji
    const strokeCounts = {
        '木': 4, '水': 4, '人': 2, '日': 4, '心': 4, '力': 2, '火': 4,
        '大': 3, '小': 3, '中': 4, '口': 3, '山': 3, '川': 3, '田': 5
    };
    
    const strokeCount = strokeCounts[kanji] || '?';
    
    // Create reliable HTML with multiple fallbacks
    return `
        <div class="reliable-stroke-order">
            <div class="kanji-large">${kanji}</div>
            <div class="stroke-count">Strokes: ${strokeCount}</div>
            <div class="stroke-image-container">
                <!-- Primary image from KanjiVG -->
                <img src="https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${encodeURIComponent(kanji)}.svg" 
                     class="stroke-order-img primary"
                     alt="Stroke order for ${kanji}"
                     onerror="this.style.display='none'; document.getElementById('fallback-${kanji}').style.display='block';" />
                
                <!-- Fallback for when the primary source fails -->
                <div id="fallback-${kanji}" class="fallback-container" style="display:none;">
                    <div class="fallback-kanji">${kanji}</div>
                    <div class="fallback-instructions">
                        <p>Visit one of these sites for stroke order:</p>
                        <ul>
                            <li><a href="https://jisho.org/search/${encodeURIComponent(kanji)}%20%23kanji" target="_blank">Jisho</a></li>
                            <li><a href="https://app.kanjialive.com/${encodeURIComponent(kanji)}" target="_blank">Kanji Alive</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Ensure that the necessary styles for stroke diagram are in place
 */
function ensureStrokeDiagramStyles() {
    // Check if the styles have already been added
    if (!document.getElementById('stroke-diagram-styles')) {
        // Create a style element
        const styleElement = document.createElement('style');
        styleElement.id = 'stroke-diagram-styles';
        
        // Add CSS for stroke diagram
        styleElement.textContent = `
            /* Simplified stroke order display that won't have CORS issues */
            .simple-stroke-order {
                padding: 20px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 400px;
                margin: 0 auto;
            }
            
            .kanji-display {
                font-size: 150px;
                line-height: 1.2;
                margin-bottom: 15px;
            }
            
            .stroke-count-info {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 15px;
                color: #333;
            }
            
            .loading-jisho {
                margin: 20px 0;
                font-style: italic;
                color: #666;
            }
            
            .jisho-link {
                margin: 15px 0;
            }
            
            .jisho-button {
                display: inline-block;
                background-color: #4da6ff;
                color: white;
                padding: 8px 20px;
                border-radius: 5px;
                text-decoration: none;
                font-weight: bold;
                transition: background-color 0.3s;
            }
            
            .jisho-button:hover {
                background-color: #3399ff;
            }
            
            .jisho-info {
                margin-top: 15px;
                text-align: left;
                padding: 10px;
                background-color: #f5f5f5;
                border-radius: 5px;
            }
            
            .jisho-meanings {
                margin-bottom: 8px;
                font-weight: bold;
            }
            
            .jisho-kun, .jisho-on {
                margin-bottom: 5px;
                color: #555;
            }
            
            .external-links {
                margin-top: 15px;
                text-align: center;
            }
            
            .external-links p {
                margin-bottom: 10px;
                font-weight: bold;
            }
            
            .link-buttons {
                display: flex;
                justify-content: center;
                gap: 10px;
            }
            
            .ext-link {
                display: inline-block;
                background-color: #4a4ae4;
                color: white;
                padding: 8px 15px;
                border-radius: 5px;
                text-decoration: none;
                font-weight: bold;
                transition: background-color 0.3s;
            }
            
            .ext-link:hover {
                background-color: #3a3ad4;
            }
            
            /* Common container styles */
            .stroke-order-container,
            .common-words-container,
            .cultural-notes,
            .tattoo-examples {
                margin-bottom: 25px;
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 8px;
            }
            
            /* Common words styles */
            .common-words-list {
                padding: 0;
                margin: 0;
                list-style-type: none;
            }
            
            .common-words-list li {
                padding: 10px;
                border-bottom: 1px solid #eee;
                margin-bottom: 5px;
            }
            
            .common-word-kanji {
                font-size: 1.2em;
                font-weight: bold;
                margin-right: 10px;
            }
            
            .common-word-reading {
                color: #666;
                font-style: italic;
                margin-right: 10px;
            }
            
            .common-word-meaning {
                color: #333;
            }
            
            /* Cultural notes styles */
            .cultural-notes p {
                margin: 0;
                line-height: 1.6;
                color: #333;
            }
            
            /* Responsive styles */
            @media (max-width: 480px) {
                .kanji-display {
                    font-size: 120px;
                }
                
                .link-buttons {
                    flex-direction: column;
                    gap: 5px;
                }
                
                .ext-link {
                    width: 100%;
                }
                
                .jisho-info {
                    font-size: 14px;
                }
            }
        `;
        
        // Append to document head
        document.head.appendChild(styleElement);
    }
}

// Helper function to estimate stroke count for kanji not in our database
function estimateStrokeCount(kanji) {
    // This is a very rough estimate based on visual complexity
    const complexityMap = {
        '一': 1, '二': 2, '三': 3, '四': 5, '五': 4, '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,
        '口': 3, '日': 4, '月': 4, '田': 5, '目': 5, '石': 5, '立': 5, '水': 4, '火': 4, '犬': 4,
        '王': 4, '玉': 5, '生': 5, '糸': 6, '子': 3, '女': 3, '好': 6, '字': 6, '学': 8, '小': 3,
        '大': 3, '天': 4, '夫': 4, '木': 4, '林': 8, '森': 12, '花': 7, '草': 9, '虫': 6, '村': 7,
        '町': 7, '雨': 8, '電': 13, '車': 7, '金': 8, '長': 8, '門': 8, '間': 12, '雲': 12, '数': 13
    };
    
    // If we have the kanji in our complexity map, return that
    if (complexityMap[kanji]) {
        return complexityMap[kanji];
    }
    
    // Otherwise, estimate based on the kanji's unicode value
    // Generally, more complex kanji have higher unicode values
    const code = kanji.charCodeAt(0);
    
    if (code < 0x4E00) {
        return 1; // Not a kanji
    } else if (code < 0x5000) {
        return 4; // Simple kanji
    } else if (code < 0x6000) {
        return 7; // Medium complexity
    } else if (code < 0x7000) {
        return 10; // Medium-high complexity
    } else if (code < 0x8000) {
        return 12; // High complexity
    } else {
        return 15; // Very high complexity
    }
}

/**
 * Search for tattoo examples with the given kanji
 * @param {string} kanji - The kanji character
 */
function searchTattooExamples(kanji) {
    const examplesContainer = document.getElementById('tattooExamples');
    
    // Debug logging
    console.log("Searching tattoo examples for", kanji);
    console.log("Examples container found:", examplesContainer);
    
    // Show loading state
    if (examplesContainer) {
        examplesContainer.innerHTML = '<p>Searching for tattoo examples...</p>';
        
        // Simulate image search results
        setTimeout(() => {
            // This would be replaced with actual API calls to image search services
            examplesContainer.innerHTML = `
                <div class="tattoo-images-grid">
                    <p>Tattoo examples for the kanji "${kanji}":</p>
                    <div class="tattoo-image-container">
                        <p>In a real implementation, this would show actual search results from Google, Bing, or other image search APIs.</p>
                        <p>For privacy and legal reasons, we're showing placeholder content instead.</p>
                    </div>
                    <div class="tattoo-search-links">
                        <p>Search for examples on:</p>
                        <a href="https://www.google.com/search?q=${kanji}+tattoo&tbm=isch" target="_blank" class="external-search">Google Images</a>
                        <a href="https://www.pinterest.com/search/pins/?q=${kanji}%20tattoo" target="_blank" class="external-search">Pinterest</a>
                        <a href="https://www.instagram.com/explore/tags/${kanji}tattoo/" target="_blank" class="external-search">Instagram</a>
                    </div>
                </div>
            `;
        }, 1000);
    } else {
        console.error("Could not find tattoo examples container with ID 'tattooExamples'");
    }
}

function showLoading(isLoading) {
    if (isLoading) {
        loadingElement.classList.remove('hidden');
    } else {
        loadingElement.classList.add('hidden');
    }
}

// Calculate how semantically related two words are
function calculateSemanticSimilarity(word1, word2) {
    // First check if they're exactly the same
    if (word1 === word2) return 1.0;
    
    // Check if they're in the same semantic group in our thesaurus
    if (internalThesaurus[word1] && internalThesaurus[word1].includes(word2)) {
        return 0.7; // Words in the same semantic group are somewhat related
    }
    
    // Use string similarity as a fallback
    const stringSimScore = calculateImprovedSimilarity(word1, word2);
    
    // Scale string similarity to be more conservative
    return Math.pow(stringSimScore, 1.5) * 0.7;
}

/**
 * Extract meaningful keywords from natural language input
 * @param {string} input - The natural language input
 * @return {array} - Array of extracted keywords
 */
function extractKeywords(input) {
    // Handle null or undefined input
    if (!input) {
        console.warn("extractKeywords received null or undefined input");
        return [];
    }
    
    // Ensure input is a string
    input = String(input);
    
    // Convert to lowercase
    const text = input.toLowerCase();
    
    // Comprehensive concept mapping for common phrases and ideas
    const conceptMappings = {
        // Add music-related concepts
        'music': ['melody', 'rhythm', 'sound', 'harmony', 'musical', 'song'],
        'musician': ['artist', 'performer', 'player', 'composer', 'instrumentalist'],
        'song': ['melody', 'tune', 'music', 'composition', 'lyric'],
        'musical': ['melodic', 'harmonic', 'rhythmic', 'tuneful', 'orchestral'],
        'love of music': ['music', 'melody', 'appreciation', 'passion', 'harmony'],
        'music lover': ['music', 'appreciation', 'enthusiasm', 'passion', 'melody'],
        
        // Freedom/Independence concepts
        'free spirit': ['freedom', 'independence', 'unrestrained', 'liberated', 'spontaneous'],
        'free spirited': ['freedom', 'independence', 'unrestrained', 'liberated', 'spontaneous'],
        'independent': ['freedom', 'self-reliant', 'autonomous', 'self-sufficient'],
        'liberty': ['freedom', 'independence', 'autonomy', 'emancipation'],
        
        // Travel concepts
        'travel': ['journey', 'voyage', 'adventure', 'explore', 'discovery', 'wanderlust'],
        'travelling': ['journey', 'voyage', 'adventure', 'explore', 'discovery', 'wanderlust'],
        'journey': ['travel', 'voyage', 'adventure', 'path', 'expedition', 'trek'],
        'adventure': ['journey', 'exploration', 'excitement', 'discovery', 'expedition'],
        'exploring': ['discover', 'adventure', 'journey', 'search', 'expedition'],
        'love to travel': ['journey', 'adventure', 'explore', 'wanderlust', 'discovery'],
        'world traveler': ['journey', 'adventure', 'explore', 'global', 'wanderlust'],
        
        // Strength/Power concepts
        'strong willed': ['determination', 'resolve', 'perseverance', 'tenacity', 'willpower'],
        'inner strength': ['resilience', 'fortitude', 'endurance', 'courage', 'power'],
        'powerful': ['strength', 'force', 'might', 'potent', 'influential'],
        
        // Perseverance concepts
        'never give up': ['perseverance', 'persistence', 'determination', 'endurance', 'resolve'],
        'perseverance': ['persistence', 'determination', 'steadfastness', 'tenacity'],
        'endurance': ['stamina', 'resilience', 'fortitude', 'persistence'],
        
        // Peace/Harmony concepts
        'inner peace': ['tranquility', 'serenity', 'calm', 'harmony', 'balance'],
        'peaceful': ['tranquil', 'serene', 'calm', 'harmonious', 'placid'],
        'harmony': ['balance', 'accord', 'unity', 'concord'],
        
        // Prosperity concepts
        'good luck': ['fortune', 'prosperity', 'success', 'blessing', 'auspicious'],
        'good fortune': ['luck', 'prosperity', 'success', 'blessing', 'wealth'],
        'prosperity': ['abundance', 'wealth', 'success', 'thriving', 'fortune'],
        
        // Wisdom concepts
        'wisdom': ['knowledge', 'insight', 'understanding', 'enlightenment', 'sagacity'],
        'intelligent': ['smart', 'wise', 'knowledgeable', 'intellectual', 'perceptive'],
        
        // Courage concepts
        'brave': ['courage', 'valor', 'daring', 'fearless', 'bold'],
        'courage': ['bravery', 'valor', 'fearlessness', 'heroism', 'boldness'],
        
        // Love concepts
        'love': ['affection', 'compassion', 'devotion', 'adoration', 'fondness'],
        'loving': ['affectionate', 'caring', 'devoted', 'tender', 'warm'],
        'love for': ['affection', 'passion', 'appreciation', 'fondness'],
        'i love': ['passion', 'affection', 'appreciation', 'fondness'],
        
        // Beauty concepts
        'beautiful': ['beauty', 'attractive', 'lovely', 'elegant', 'pleasing'],
        'elegance': ['grace', 'refinement', 'style', 'sophistication', 'poise']
    };
    
    // Common stop words to filter out
    const stopWords = [
        'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 
        'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 
        'out', 'of', 'from', 'up', 'down', 'me', 'i', 'my', 'myself', 'we', 'our', 
        'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 
        'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 
        'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 
        'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 
        'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'would', 
        'should', 'could', 'ought', 'i\'m', 'you\'re', 'he\'s', 'she\'s', 'it\'s', 
        'we\'re', 'they\'re', 'i\'ve', 'you\'ve', 'we\'ve', 'they\'ve', 'i\'d', 'you\'d', 
        'he\'d', 'she\'d', 'we\'d', 'they\'d', 'i\'ll', 'you\'ll', 'he\'ll', 'she\'ll', 
        'we\'ll', 'they\'ll', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t', 'hasn\'t', 
        'haven\'t', 'hadn\'t', 'doesn\'t', 'don\'t', 'didn\'t', 'won\'t', 'wouldn\'t', 
        'shan\'t', 'shouldn\'t', 'can\'t', 'cannot', 'couldn\'t', 'mustn\'t', 'let\'s', 
        'that\'s', 'who\'s', 'what\'s', 'here\'s', 'there\'s', 'when\'s', 'where\'s', 
        'why\'s', 'how\'s', 'find', 'me', 'that', 'represent', 'am', 'is', 'are', 'kanji',
        'looking', 'search', 'means', 'meaning', 'represents', 'symbolize', 'symbolizes', 'tattoo'
    ];
    
    // Extract phrases containing "of" to handle constructs like "love of music"
    const ofPhrases = text.match(/\b\w+\s+of\s+\w+\b/g) || [];
    
    // Check if any of the "X of Y" phrases are in our concept mappings
    for (const phrase of ofPhrases) {
        if (conceptMappings[phrase]) {
            return conceptMappings[phrase];
        }
        
        // If not found in mappings, extract both parts and include them
        const parts = phrase.split(' of ');
        if (parts.length === 2) {
            const part1 = parts[0].trim();
            const part2 = parts[1].trim();
            
            if (!stopWords.includes(part1) && !stopWords.includes(part2)) {
                // Check if each part has a mapping
                const keywords = [];
                
                // Add mapped concepts if available
                if (conceptMappings[part1]) {
                    keywords.push(...conceptMappings[part1]);
                } else {
                    keywords.push(part1);
                }
                
                if (conceptMappings[part2]) {
                    keywords.push(...conceptMappings[part2]);
                } else {
                    keywords.push(part2);
                }
                
                return [...new Set(keywords)]; // Remove duplicates
            }
        }
    }
    
    // First, check for complete concept phrases
    for (const [phrase, keywords] of Object.entries(conceptMappings)) {
        if (text.includes(phrase)) {
            return keywords;
        }
    }
    
    // Handle more complex query patterns
    // Look for patterns like "find me a kanji for X" or "kanji that represents X"
    const representPatterns = [
        /kanji (?:for|that represents|that means|meaning|symbolizing|symbolizes|about) ([^.?!]+)/i,
        /find (?:a|me a|me some|some) kanji (?:for|that represents|that means|meaning|symbolizing|about) ([^.?!]+)/i,
        /looking for (?:a|some) kanji (?:for|that represents|that means|symbolizing|about) ([^.?!]+)/i,
        /i want (?:a|some) kanji (?:for|that represents|that means|symbolizing|about) ([^.?!]+)/i,
        /kanji (?:that|which|to) (?:represents|means|symbolizes|expresses) ([^.?!]+)/i
    ];
    
    for (const pattern of representPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            // Extract the concept after the pattern
            const conceptPhrase = match[1].trim();
            // Process the extracted concept
            return processConceptPhrase(conceptPhrase, conceptMappings, stopWords);
        }
    }
    
    // If no patterns matched, process the whole text
    return processConceptPhrase(text, conceptMappings, stopWords);
}

/**
 * Process a concept phrase to extract meaningful keywords
 * @param {string} phrase - The phrase to process
 * @param {object} conceptMappings - Concept mappings dictionary
 * @param {array} stopWords - Stop words to filter out
 * @return {array} - Array of keywords
 */
function processConceptPhrase(phrase, conceptMappings, stopWords) {
    // Remove punctuation and split into words
    const words = phrase.replace(/[^\w\s]/g, '').split(/\s+/);
    
    // First, try to find multi-word concepts in the phrase
    for (const [conceptPhrase, keywords] of Object.entries(conceptMappings)) {
        if (phrase.includes(conceptPhrase)) {
            return keywords;
        }
    }
    
    // Track all important words, not just those in our concept mappings
    const extractedWords = [];
    const conceptWords = [];
    
    // Extract all non-stopwords and check for concept mappings
    for (const word of words) {
        if (!stopWords.includes(word)) {
            extractedWords.push(word);
            
            if (conceptMappings[word]) {
                conceptWords.push(...conceptMappings[word]);
            }
        }
    }
    
    // If we have both extracted words and concept words, combine them
    if (extractedWords.length > 0 && conceptWords.length > 0) {
        return [...new Set([...extractedWords, ...conceptWords])]; // Remove duplicates
    }
    
    // Just return the extracted words if no concept words were found
    if (extractedWords.length > 0) {
        return extractedWords;
    }
    
    // As a fallback, extract any word that isn't a stop word
    return words.filter(word => !stopWords.includes(word));
}

/**
 * Check if two words sound similar but have different meanings
 * @param {string} word1 - First word
 * @param {string} word2 - Second word
 * @return {boolean} - True if they sound similar
 */
function soundsSimilar(word1, word2) {
    // Simple check for words that start with the same sound but aren't the same word
    if (word1 !== word2 && 
        word1.substring(0, 3) === word2.substring(0, 3) && 
        Math.abs(word1.length - word2.length) <= 3) {
        return true;
    }
    return false;
}

/**
 * Check if two words are conceptually related
 * @param {string} word1 - First word
 * @param {string} word2 - Second word
 * @return {boolean} - True if they are conceptually related
 */
function areConceptuallyRelated(word1, word2) {
    // List of conceptually related word pairs
    const relatedConcepts = {
        'free': ['freedom', 'liberty', 'independent', 'unrestrained', 'liberated'],
        'spirit': ['soul', 'essence', 'energy', 'vitality', 'life'],
        'brave': ['courage', 'valor', 'fearless', 'heroic', 'bold'],
        'strength': ['power', 'might', 'force', 'energy', 'robust'],
        'peace': ['harmony', 'tranquility', 'calm', 'serenity', 'still'],
        'hope': ['wish', 'expect', 'desire', 'aspire', 'optimism'],
        'love': ['affection', 'adore', 'passion', 'devotion', 'care']
    };
    
    // Check if word2 is related to word1
    if (relatedConcepts[word1] && relatedConcepts[word1].includes(word2)) {
        return true;
    }
    
    // Check if word1 is related to word2
    if (relatedConcepts[word2] && relatedConcepts[word2].includes(word1)) {
        return true;
    }
    
    return false;
}

/**
 * Identify the semantic topics present in the search keywords
 * @param {array} keywords - Search keywords
 * @return {array} - Array of topics
 */
function identifyTopics(keywords) {
    const topics = [];
    
    if (!Array.isArray(keywords) || keywords.length === 0) {
        return topics;
    }
    
    for (const keyword of keywords) {
        // Skip null/undefined keywords
        if (!keyword) continue;
        
        // Ensure keyword is a string before calling toLowerCase
        const keywordStr = String(keyword).toLowerCase();
        
        for (const [topic, words] of Object.entries(semanticTopics)) {
            if (words.includes(keywordStr)) {
                if (!topics.includes(topic)) {
                    topics.push(topic);
                }
            }
        }
    }
    
    return topics;
}

/**
 * Calculate how compatible the kanji's meanings are with the search topics
 * @param {array} searchTopics - Topics extracted from search keywords
 * @param {string} bestMatch - Best matching meaning
 * @param {array} allMeanings - All meanings of the kanji
 * @return {number} - Compatibility score between 0.4 and 1.0
 */
function calculateTopicCompatibility(searchTopics, bestMatch, allMeanings) {
    // If no topics were identified, no penalty
    if (!searchTopics || searchTopics.length === 0) {
        return 1.0;
    }
    
    // Identify the topics of the kanji meanings
    const kanjiTopics = [];
    
    // Add type check for bestMatch and convert to string if needed
    if (typeof bestMatch !== 'string') {
        if (bestMatch === undefined || bestMatch === null) {
            console.error('bestMatch is undefined or null in calculateTopicCompatibility');
            bestMatch = ''; // Use empty string
        } else {
            console.warn('Expected bestMatch to be a string, converting:', typeof bestMatch);
            bestMatch = String(bestMatch);
        }
    }
    
    // Check the best match first (higher weight)
    for (const [topic, words] of Object.entries(semanticTopics)) {
        // Make sure words is an array
        if (!Array.isArray(words)) continue;
        
        if (words.some(word => word && bestMatch.includes(word))) {
            if (!kanjiTopics.includes(topic)) {
                kanjiTopics.push(topic);
            }
        }
    }
    
    // Then check all other meanings
    if (Array.isArray(allMeanings)) {
        for (const meaning of allMeanings) {
            if (!meaning) continue; // Skip null/undefined meanings
            
            for (const [topic, words] of Object.entries(semanticTopics)) {
                // Make sure words is an array
                if (!Array.isArray(words)) continue;
                
                if (words.some(word => word && meaning.includes(word))) {
                    if (!kanjiTopics.includes(topic)) {
                        kanjiTopics.push(topic);
                    }
                }
            }
        }
    }
    
    // Calculate how many search topics match with kanji topics
    let matchingTopics = 0;
    for (const searchTopic of searchTopics) {
        if (kanjiTopics.includes(searchTopic)) {
            matchingTopics++;
        }
    }
    
    // Calculate the compatibility score
    if (searchTopics.length > 0) {
        const rawScore = matchingTopics / searchTopics.length;
        
        // Apply a more aggressive curve to the score to make relevance more impactful
        // A score of 0 becomes 0.3 (stronger penalty for complete topic mismatch)
        // A score of 1.0 remains 1.0 (no penalty)
        return 0.3 + (rawScore * 0.7);
    }
    
    return 1.0; // No topics to match, so no penalty
}

/**
 * Check for direct conceptual contradictions between search topics and kanji meanings
 * @param {array} searchTopics - Topics from the search keywords
 * @param {array} meanings - All meanings of the kanji
 * @return {number} - Adjustment factor between 0.1 and 1.0
 */
function checkConceptualContradiction(searchTopics, meanings) {
    // Validate inputs
    if (!Array.isArray(searchTopics) || searchTopics.length === 0 || 
        !Array.isArray(meanings) || meanings.length === 0) {
        return 1.0; // No contradictions if invalid inputs
    }
    
    // Define opposing concept pairs that should significantly reduce relevance
    const opposingConcepts = {
        "positive": "negative",
        "negative": "positive",
        "love": "hate",
        "peace": "war",
        "good": "evil"
    };
    
    // If "travel" is in search topics but meanings contain "devil" or "demon", apply penalty
    if (searchTopics.includes("travel") || searchTopics.includes("positive")) {
        for (const meaning of meanings) {
            // Skip null/undefined meanings
            if (!meaning) continue;
            
            // Ensure meaning is a string
            const meaningStr = String(meaning);
            
            if (meaningStr.includes("devil") || meaningStr.includes("demon") || meaningStr.includes("evil")) {
                return 0.1; // Severe penalty for complete mismatch
            }
        }
    }
    
    // Check for other opposing concepts
    for (const searchTopic of searchTopics) {
        if (opposingConcepts[searchTopic]) {
            const opposingTopic = opposingConcepts[searchTopic];
            
            // Check if any meaning belongs to the opposing topic
            for (const meaning of meanings) {
                // Skip null/undefined meanings
                if (!meaning) continue;
                
                // Ensure meaning is a string
                const meaningStr = String(meaning);
                
                if (semanticTopics[opposingTopic] && 
                    semanticTopics[opposingTopic].some(word => word && meaningStr.includes(word))) {
                    return 0.3; // Strong penalty for conceptual contradiction
                }
            }
        }
    }
    
    return 1.0; // No contradictions found
}

// Add the base findKanjiMatches function 
function findKanjiMatches(searchWord, wordVariations) {
    // If we have an array of search words, use the improved function
    if (Array.isArray(searchWord)) {
        return findKanjiMatchesImproved(searchWord, wordVariations);
    }
    
    // For backward compatibility, convert single searchWord to array
    console.log("Converting single search word to array for improved matching:", searchWord);
    return findKanjiMatchesImproved([searchWord], wordVariations);
}