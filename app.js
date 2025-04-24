document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const wordInput = document.getElementById('word-input');
    const resultsContainer = document.getElementById('results');
    const loadingElement = document.getElementById('loading');

    // Add event listeners
    searchButton.addEventListener('click', performSearch);
    wordInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

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

    async function performSearch() {
        const searchInput = wordInput.value.trim();
        
        if (!searchInput) {
            alert('Please enter some text to search for.');
            return;
        }

        // Show loading indicator
        showLoading(true);
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        try {
            // Extract keywords from natural language input
            const keywords = extractKeywords(searchInput);
            
            if (keywords.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="no-results">
                        <h2>No Keywords Found</h2>
                        <p>Couldn't extract meaningful keywords from "${searchInput}".</p>
                        <p>Try using more specific terms related to the concept you're looking for.</p>
                    </div>
                `;
                showLoading(false);
                return;
            }
            
            // Get word variations including synonyms for each keyword
            const allWordVariations = [];
            for (const keyword of keywords) {
                const variations = await getWordVariations(keyword);
                allWordVariations.push(...variations);
            }
            
            // Remove duplicates and prioritize original keywords
            const uniqueWordVariations = [
                ...keywords, // Put original keywords first for higher priority
                ...allWordVariations.filter(word => !keywords.includes(word))
            ];
            
            // Remove duplicates
            const finalWordVariations = [...new Set(uniqueWordVariations)];
            
            // Find Kanji matches with expanded word list - pass all keywords for better matching
            const matchResults = findKanjiMatchesImproved(keywords, finalWordVariations);
            
            // Display results
            displayResults(matchResults, searchInput, finalWordVariations);
        } catch (error) {
            console.error("Error during search:", error);
            resultsContainer.innerHTML = '<p class="error">An error occurred during search. Please try again.</p>';
        }
        
        // Hide loading indicator
        showLoading(false);
    }

    function findKanjiMatchesImproved(keywords, wordVariations) {
        const results = [];
        const processedKanji = new Set(); // To avoid duplicate Kanji in results
        
        // Identify the topics of the search query
        const searchTopics = identifyTopics(keywords);
        
        // Loop through each kanji in our database
        kanjiDatabase.forEach(kanjiData => {
            // Skip if we already processed this Kanji
            if (processedKanji.has(kanjiData.kanji)) {
                return;
            }
            
            // Track all meaning matches for this kanji
            const meaningMatches = [];
            let bestMatchScore = 0;
            let bestMatchWord = '';
            let bestMatchKeyword = '';
            
            // Check each primary keyword against each kanji meaning
            for (const keyword of keywords) {
                let keywordBestScore = 0;
                let keywordBestMeaning = '';
                
                kanjiData.meanings.forEach(meaning => {
                    const score = calculateImprovedSimilarity(keyword, meaning);
                    
                    // If there's a decent direct match, record it
                    if (score >= 0.35) {
                        meaningMatches.push({
                            meaning: meaning,
                            score: score,
                            variation: keyword
                        });
                        
                        if (score > keywordBestScore) {
                            keywordBestScore = score;
                            keywordBestMeaning = meaning;
                        }
                    }
                });
                
                // Update the overall best match if this keyword had a better match
                if (keywordBestScore > bestMatchScore) {
                    bestMatchScore = keywordBestScore;
                    bestMatchWord = keywordBestMeaning;
                    bestMatchKeyword = keyword;
                }
            }
            
            // Then check the extended variations, but with lower priority
            if (bestMatchScore < 0.75) { // Only use synonyms if direct match isn't already strong
                // Skip the primary keywords since we already checked them
                const variations = wordVariations.filter(word => !keywords.includes(word));
                
                for (const variation of variations) {
                    kanjiData.meanings.forEach(meaning => {
                        // Calculate similarity score with improved algorithm
                        const score = calculateImprovedSimilarity(variation, meaning);
                        
                        // Apply a synonym penalty to the score (75% of original score)
                        // This ensures synonym matches are weighted lower than direct matches
                        const adjustedScore = score * 0.75;
                        
                        // If it's a decent match, add it to our matches
                        if (adjustedScore >= 0.35) {
                            meaningMatches.push({
                                meaning: meaning,
                                score: adjustedScore, // Use the penalized score
                                variation: variation
                            });
                        }
                        
                        if (adjustedScore > bestMatchScore) {
                            bestMatchScore = adjustedScore;
                            bestMatchWord = meaning;
                            bestMatchKeyword = variation;
                        }
                    }); 
                }
            }
            
            // Only include results with a match score above threshold
            if (bestMatchScore >= 0.35) {
                // Apply topic-based scoring adjustments
                const topicScore = calculateTopicCompatibility(searchTopics, bestMatchWord, kanjiData.meanings);
                
                // Apply a more nuanced scoring system to the final percentage
                let adjustedScore = adjustMatchScore(bestMatchScore, meaningMatches, bestMatchKeyword);
                
                // Apply the topic-based adjustment (penalize topic mismatches)
                adjustedScore = adjustedScore * topicScore;
                
                // Increase score for matches to primary keywords (extracted concepts)
                if (keywords.includes(bestMatchKeyword)) {
                    adjustedScore = Math.min(1.0, adjustedScore * 1.15); // Boost by 15%
                }
                
                // Check for conceptual contradictions (e.g., "love" matching with "devil")
                const contradictionScore = checkConceptualContradiction(searchTopics, kanjiData.meanings);
                if (contradictionScore < 1.0) {
                    adjustedScore = adjustedScore * contradictionScore;
                }
                
                // Check negative connotations against all keywords
                let highestNegativeMatch = null;
                let highestNegativeScore = 0;
                
                for (const keyword of keywords) {
                    const negativeMatchInfo = checkNegativeConnotations(keyword, kanjiData);
                    if (negativeMatchInfo && negativeMatchInfo.exists && negativeMatchInfo.matchPercentage > highestNegativeScore) {
                        highestNegativeMatch = negativeMatchInfo;
                        highestNegativeScore = negativeMatchInfo.matchPercentage;
                    }
                }
                
                // Apply a relevance threshold - only include results above a certain score
                // This helps eliminate completely irrelevant matches
                if (adjustedScore >= 0.30) {
                    results.push({
                        kanji: kanjiData.kanji,
                        matchPercentage: Math.round(adjustedScore * 100),
                        matchedMeaning: bestMatchWord,
                        matchedKeyword: bestMatchKeyword,
                        pronunciation: kanjiData.pronunciation,
                        commonUsage: kanjiData.commonUsage,
                        meaningMatches: meaningMatches.sort((a, b) => b.score - a.score),
                        negativeConnotations: kanjiData.negativeConnotations,
                        negativeMatch: highestNegativeMatch,
                        rawScore: bestMatchScore,
                        matchSource: !keywords.includes(bestMatchKeyword) ? bestMatchKeyword : null,
                        topicCompatibility: topicScore
                    });
                    
                    processedKanji.add(kanjiData.kanji);
                }
            }
        });
        
        // Apply a more conceptual filtering to remove literal matches that don't fit
        // For example, this would filter out "freeze" when searching for "free spirited"
        const filteredResults = results.filter(result => {
            // If the match is to a primary keyword, keep it (unless it's a severe topic mismatch)
            if (keywords.includes(result.matchedKeyword) && result.topicCompatibility > 0.6) {
                return true;
            }
            
            // Check if the matched word is semantically related to any primary keyword
            for (const keyword of keywords) {
                const similarity = calculateSemanticSimilarity(keyword, result.matchedKeyword);
                if (similarity >= 0.6) {
                    return true;
                }
            }
            
            // For high-scoring matches that also have good topic compatibility, be more lenient
            if (result.matchPercentage >= 85 && result.topicCompatibility >= 0.8) {
                return true;
            }
            
            // Filter out lower-scoring matches that aren't conceptually related
            if (result.matchPercentage < 70) {
                // Additional check for homonyms (words that sound similar but mean different things)
                // This helps filter out things like "freeze" when looking for "free"
                const isPossibleHomonym = keywords.some(keyword => 
                    soundsSimilar(keyword, result.matchedKeyword) && 
                    !areConceptuallyRelated(keyword, result.matchedKeyword)
                );
                
                if (isPossibleHomonym) {
                    return false;
                }
            }
            
            // Filter out matches with very low topic compatibility (likely irrelevant)
            if (result.topicCompatibility < 0.5) {
                return false;
            }
            
            return true;
        });
        
        // Sort by match percentage (highest first)
        return filteredResults.sort((a, b) => b.matchPercentage - a.matchPercentage);
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
                match.variation === searchWord && 
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
        // Convert search word to lowercase
        searchWord = searchWord.toLowerCase();
        
        // Check if our search word is in the semantic groups
        if (semanticGroups[searchWord]) {
            // Get the list of semantically equivalent words
            const equivalentWords = semanticGroups[searchWord];
            
            // Check if any meaning matches are in the equivalent words list
            for (const match of meaningMatches) {
                const meaning = match.meaning.toLowerCase();
                
                if (equivalentWords.includes(meaning)) {
                    // We found a semantic match - return a substantial boost value
                    return 0.4; // This will significantly boost the score for semantic matches
                }
                
                // Check for partial word matches (useful for compound words)
                for (const eqWord of equivalentWords) {
                    if (meaning.includes(eqWord) || eqWord.includes(meaning)) {
                        return 0.3; // Slightly smaller boost for partial semantic matches
                    }
                }
            }
        }
        
        // Also check if any of the meanings are in semantic groups and the search word is a related term
        for (const match of meaningMatches) {
            const meaning = match.meaning.toLowerCase();
            
            if (semanticGroups[meaning] && semanticGroups[meaning].includes(searchWord)) {
                return 0.4; // Boost for semantic match in the reverse direction
            }
        }
        
        return 0; // No semantic boost
    }
    
    function checkNegativeConnotations(searchWord, kanjiData) {
        // If no negative connotations exist, return null
        if (!kanjiData.negativeConnotations.exists) {
            return null;
        }
        
        // Check if any negative meaning matches the search word
        const negativeMeanings = kanjiData.negativeConnotations.meanings;
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
                meaning: matchedNegativeMeaning
            };
        }
        
        // Return info that there are negative meanings but they don't match the search
        return {
            exists: false,
            matchPercentage: 0,
            meaning: ''
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
            if (result.negativeConnotations.exists && result.negativeMatch && result.negativeMatch.exists) {
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
            if (result.negativeConnotations.exists) {
                if (result.negativeMatch && result.negativeMatch.exists) {
                    warningHtml = `
                    <div class="warning-box">
                        <div class="warning-icon">⚠️</div>
                        <div class="warning-text">
                            <strong>Warning:</strong> This kanji can have the negative meaning "${result.negativeMatch.meaning}" 
                            which is ${result.negativeMatch.matchPercentage}% similar to your search term.
                        </div>
                    </div>`;
                } else {
                    warningHtml = `
                    <div class="caution-box">
                        <div class="caution-icon">ℹ️</div>
                        <div class="caution-text">
                            <strong>Note:</strong> This kanji can also mean: ${result.negativeConnotations.meanings.join(', ')}
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
                        <strong>Topic Mismatch:</strong> This kanji may not be conceptually related to your search.
                    </div>
                </div>`;
            }
            
            // Add view details button
            const viewDetailsHtml = `
            <div class="view-details-button">
                <button class="view-details">View Detailed Information</button>
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
        
        // Create the final results container
        const resultsContainerContent = `
            ${resultHeader}
            <div class="results-container">
                ${resultItemsHTML}
            </div>
            <div id="kanji-detail-modal" class="modal hidden">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div id="kanji-detail-container"></div>
                </div>
            </div>
        `;
        
        resultsContainer.innerHTML = resultsContainerContent;
        
        // Add event listeners to kanji cards
        document.querySelectorAll('.kanji-card').forEach(card => {
            card.addEventListener('click', function() {
                const resultIndex = parseInt(this.dataset.index);
                showKanjiDetail(results[resultIndex]);
            });
            
            // Also handle keyboard navigation for accessibility
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    const resultIndex = parseInt(this.dataset.index);
                    showKanjiDetail(results[resultIndex]);
                    e.preventDefault();
                }
            });
        });
        
        // Add event listener to close button in modal
        const closeModalButton = document.querySelector('.close-modal');
        if (closeModalButton) {
            closeModalButton.addEventListener('click', function() {
                document.getElementById('kanji-detail-modal').classList.add('hidden');
                document.body.classList.remove('modal-open');
            });
        }
        
        // Close modal when clicking outside the content
        const modal = document.getElementById('kanji-detail-modal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    document.body.classList.remove('modal-open');
                }
            });
        }
    }
    
    /**
     * Show detailed information about a kanji in a modal window
     * @param {object} kanjiData - The kanji data object
     */
    function showKanjiDetail(kanjiData) {
        const modal = document.getElementById('kanji-detail-modal');
        const detailContainer = document.getElementById('kanji-detail-container');
        
        // Fetch additional details if needed
        fetchKanjiDetails(kanjiData.kanji)
            .then(details => {
                // Combine our data with fetched details
                const combinedData = { ...kanjiData, ...details };
                
                // Create the detailed view HTML
                const detailHTML = `
                    <div class="kanji-detail-view">
                        <div class="kanji-detail-header">
                            <div class="detail-kanji">${combinedData.kanji}</div>
                            <div class="detail-meanings">
                                <h2>${combinedData.matchedMeaning}</h2>
                                <div class="all-meanings">
                                    ${combinedData.meaningMatches.map(m => 
                                        `<span class="meaning-tag">${m.meaning}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-sections">
                            <section class="detail-section">
                                <h3>Pronunciation</h3>
                                <div class="pronunciation-container">
                                    <div class="on-yomi">${combinedData.pronunciation.split(',')[0]}</div>
                                    ${combinedData.pronunciation.includes(',') ? 
                                        `<div class="kun-yomi">${combinedData.pronunciation.split(',')[1]}</div>` : ''}
                                </div>
                            </section>
                            
                            <section class="detail-section">
                                <h3>Stroke Order</h3>
                                <div class="stroke-order-container">
                                    ${combinedData.strokeOrderImage ? 
                                        `<img src="${combinedData.strokeOrderImage}" alt="Stroke order for ${combinedData.kanji}" class="stroke-order-img">` :
                                        `<div class="stroke-order-placeholder">Stroke order animation loading...</div>`}
                                </div>
                            </section>
                            
                            <section class="detail-section">
                                <h3>Common Words</h3>
                                <div class="common-words">
                                    ${combinedData.commonWords ? 
                                        combinedData.commonWords.map(word => 
                                            `<div class="common-word">
                                                <div class="word-kanji">${word.kanji}</div>
                                                <div class="word-reading">${word.reading}</div>
                                                <div class="word-meaning">${word.meaning}</div>
                                            </div>`
                                        ).join('') : 
                                        '<p>Loading common words...</p>'}
                                </div>
                            </section>
                            
                            <section class="detail-section">
                                <h3>Tattoo Examples</h3>
                                <div class="tattoo-examples" id="tattoo-examples-container">
                                    <p>Loading tattoo examples...</p>
                                    <button id="load-tattoo-examples" class="detail-button">
                                        View Tattoo Examples
                                    </button>
                                </div>
                            </section>
                            
                            <section class="detail-section">
                                <h3>Cultural Context</h3>
                                <div class="cultural-context">
                                    ${combinedData.culturalNotes ? 
                                        `<p>${combinedData.culturalNotes}</p>` :
                                        `<p>This kanji ${combinedData.matchedMeaning} is commonly used in Japanese writing.
                                        ${combinedData.negativeConnotations.exists ? 
                                            `<strong>Note:</strong> This kanji can have negative connotations in certain contexts: ${combinedData.negativeConnotations.meanings.join(', ')}.` : 
                                            `It has generally positive or neutral connotations in Japanese culture.`}
                                        </p>`}
                                </div>
                            </section>
                        </div>
                    </div>
                `;
                
                // Set the HTML content
                detailContainer.innerHTML = detailHTML;
                
                // Add event listener for loading tattoo examples
                const loadTattooButton = document.getElementById('load-tattoo-examples');
                if (loadTattooButton) {
                    loadTattooButton.addEventListener('click', function() {
                        searchTattooExamples(kanjiData.kanji);
                    });
                }
                
                // Show the modal
                modal.classList.remove('hidden');
                document.body.classList.add('modal-open');
            })
            .catch(error => {
                console.error("Error fetching kanji details:", error);
                
                // Still show a basic detail view with the data we have
                const basicDetailHTML = `
                    <div class="kanji-detail-view">
                        <div class="kanji-detail-header">
                            <div class="detail-kanji">${kanjiData.kanji}</div>
                            <div class="detail-meanings">
                                <h2>${kanjiData.matchedMeaning}</h2>
                            </div>
                        </div>
                        
                        <div class="detail-sections">
                            <section class="detail-section">
                                <h3>Basic Information</h3>
                                <p><strong>Pronunciation:</strong> ${kanjiData.pronunciation}</p>
                                <p><strong>Common usage:</strong> ${kanjiData.commonUsage}</p>
                            </section>
                            
                            <section class="detail-section">
                                <h3>Tattoo Examples</h3>
                                <div class="tattoo-examples" id="tattoo-examples-container">
                                    <button id="load-tattoo-examples" class="detail-button">
                                        View Tattoo Examples
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                `;
                
                // Set the HTML content
                detailContainer.innerHTML = basicDetailHTML;
                
                // Add event listener for loading tattoo examples
                const loadTattooButton = document.getElementById('load-tattoo-examples');
                if (loadTattooButton) {
                    loadTattooButton.addEventListener('click', function() {
                        searchTattooExamples(kanjiData.kanji);
                    });
                }
                
                // Show the modal
                modal.classList.remove('hidden');
                document.body.classList.add('modal-open');
            });
    }
    
    /**
     * Fetch detailed information about a kanji
     * @param {string} kanji - The kanji character
     * @return {Promise} - Promise resolving to kanji details object
     */
    async function fetchKanjiDetails(kanji) {
        // For now, return placeholder data to demonstrate the UI
        // In a real implementation, you would fetch this from an API
        
        // Mock delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // This would be replaced with actual API calls in production
        return {
            strokeOrderImage: `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/0${kanji.charCodeAt(0).toString(16)}.svg`,
            commonWords: [
                { kanji: `${kanji}人`, reading: 'jin', meaning: 'Person with this quality' },
                { kanji: `${kanji}的`, reading: 'teki', meaning: 'Related to this concept' },
                { kanji: `大${kanji}`, reading: 'dai-', meaning: 'Great/big version of this concept' }
            ],
            culturalNotes: `This kanji has been used in Japanese culture for centuries and represents an important concept in Eastern philosophy.`
        };
    }
    
    /**
     * Search for tattoo examples with the given kanji
     * @param {string} kanji - The kanji character
     */
    function searchTattooExamples(kanji) {
        const examplesContainer = document.getElementById('tattoo-examples-container');
        
        // Show loading state
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
        
        // If we have concept words, return those
        if (conceptWords.length > 0) {
            return [...new Set(conceptWords)]; // Remove duplicates
        }
        
        // If we have filtered words, return those
        if (extractedWords.length > 0) {
            return extractedWords;
        }
        
        // Last resort: find the most meaningful word
        // Sort words by length (longer words tend to be more meaningful)
        const sortedWords = [...words].sort((a, b) => b.length - a.length);
        
        // Return the longest word if it exists
        if (sortedWords.length > 0) {
            return [sortedWords[0]];
        }
        
        // If nothing else works, return an empty array
        return [];
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
        
        for (const keyword of keywords) {
            for (const [topic, words] of Object.entries(semanticTopics)) {
                if (words.includes(keyword.toLowerCase())) {
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
        if (searchTopics.length === 0) {
            return 1.0;
        }
        
        // Identify the topics of the kanji meanings
        const kanjiTopics = [];
        
        // Check the best match first (higher weight)
        for (const [topic, words] of Object.entries(semanticTopics)) {
            if (words.some(word => bestMatch.includes(word))) {
                if (!kanjiTopics.includes(topic)) {
                    kanjiTopics.push(topic);
                }
            }
        }
        
        // Then check all other meanings
        for (const meaning of allMeanings) {
            for (const [topic, words] of Object.entries(semanticTopics)) {
                if (words.some(word => meaning.includes(word))) {
                    if (!kanjiTopics.includes(topic)) {
                        kanjiTopics.push(topic);
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
            
            // Apply a curve to the score to make it more impactful
            // A score of 0 becomes 0.4 (significant penalty but not total rejection)
            // A score of 1.0 remains 1.0 (no penalty)
            return 0.4 + (rawScore * 0.6);
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
                if (meaning.includes("devil") || meaning.includes("demon") || meaning.includes("evil")) {
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
                    if (semanticTopics[opposingTopic] && 
                        semanticTopics[opposingTopic].some(word => meaning.includes(word))) {
                        return 0.3; // Strong penalty for conceptual contradiction
                    }
                }
            }
        }
        
        return 1.0; // No contradictions found
    }
}); 