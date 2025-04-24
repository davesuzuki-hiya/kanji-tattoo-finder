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
                // Apply a more nuanced scoring system to the final percentage
                let adjustedScore = adjustMatchScore(bestMatchScore, meaningMatches, bestMatchKeyword);
                
                // Increase score for matches to primary keywords (extracted concepts)
                if (keywords.includes(bestMatchKeyword)) {
                    adjustedScore = Math.min(1.0, adjustedScore * 1.15); // Boost by 15%
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
                    matchSource: !keywords.includes(bestMatchKeyword) ? bestMatchKeyword : null
                });
                
                processedKanji.add(kanjiData.kanji);
            }
        });
        
        // Apply a more conceptual filtering to remove literal matches that don't fit
        // For example, this would filter out "freeze" when searching for "free spirited"
        const filteredResults = results.filter(result => {
            // If the match is to a primary keyword, keep it
            if (keywords.includes(result.matchedKeyword)) {
                return true;
            }
            
            // Check if the matched word is semantically related to any primary keyword
            for (const keyword of keywords) {
                const similarity = calculateSemanticSimilarity(keyword, result.matchedKeyword);
                if (similarity >= 0.6) {
                    return true;
                }
            }
            
            // For high-scoring matches, be more lenient
            if (result.matchPercentage >= 85) {
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
                ${variationsText}
                <p class="results-count">${results.length} results found</p>
            </div>
        `;
        
        // Sort results by match percentage (highest first)
        results.sort((a, b) => b.matchPercentage - a.matchPercentage);
        
        // Create result items HTML
        let resultItemsHTML = '';
        
        results.forEach(result => {
            // Skip results with very low match percentages after adjustment
            if (result.matchPercentage < 25) {
                return;
            }
            
            const kanjiCard = document.createElement('div');
            kanjiCard.className = 'kanji-card';
            
            // Determine card status class based on match percentage and negative connotations
            if (result.negativeConnotations.exists && result.negativeMatch && result.negativeMatch.exists) {
                kanjiCard.classList.add('negative-match');
            } else if (result.matchPercentage >= 75) {
                kanjiCard.classList.add('perfect-match');
            } else if (result.matchPercentage >= 55) {
                kanjiCard.classList.add('good-match');
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
            
            kanjiCard.innerHTML = `
                <div class="kanji-character">${result.kanji}</div>
                <div class="match-percentage">${result.matchPercentage}% Match</div>
                <div class="match-indicator">${matchQuality}</div>
                ${matchSourceHtml}
                <div class="kanji-info">
                    <div><strong>Primary meaning:</strong> ${result.matchedMeaning}</div>
                    ${additionalMeaningsHtml}
                    <div><strong>Pronunciation:</strong> ${result.pronunciation}</div>
                    <div><strong>Common usage:</strong> ${result.commonUsage}</div>
                </div>
                ${warningHtml}
            `;
            
            resultItemsHTML += kanjiCard.outerHTML;
        });
        
        // Create the final results container
        const resultsContainerContent = `
            ${resultHeader}
            <div class="results-container">
                ${resultItemsHTML}
            </div>
        `;
        
        resultsContainer.innerHTML = resultsContainerContent;
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
            // Freedom/Independence concepts
            'free spirit': ['freedom', 'independence', 'unrestrained', 'liberated', 'spontaneous'],
            'free spirited': ['freedom', 'independence', 'unrestrained', 'liberated', 'spontaneous'],
            'independent': ['freedom', 'self-reliant', 'autonomous', 'self-sufficient'],
            'liberty': ['freedom', 'independence', 'autonomy', 'emancipation'],
            
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
        
        // Check for individual concept words
        const conceptWords = [];
        for (const word of words) {
            if (conceptMappings[word]) {
                conceptWords.push(...conceptMappings[word]);
            }
        }
        
        if (conceptWords.length > 0) {
            return [...new Set(conceptWords)]; // Remove duplicates
        }
        
        // Filter out stop words for regular processing
        const filteredWords = words.filter(word => !stopWords.includes(word));
        
        // If we have filtered words, return those
        if (filteredWords.length > 0) {
            return filteredWords;
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
}); 