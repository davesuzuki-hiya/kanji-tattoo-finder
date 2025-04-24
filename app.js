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
        const searchWord = wordInput.value.trim().toLowerCase();
        
        if (!searchWord) {
            alert('Please enter an English word to search.');
            return;
        }

        // Show loading indicator
        showLoading(true);
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        try {
            // Get word variations including synonyms
            const wordVariations = await getWordVariations(searchWord);
            
            // Find Kanji matches with expanded word list
            const matchResults = findKanjiMatches(searchWord, wordVariations);
            
            // Display results
            displayResults(matchResults, searchWord, wordVariations);
        } catch (error) {
            console.error("Error during search:", error);
            resultsContainer.innerHTML = '<p class="error">An error occurred during search. Please try again.</p>';
        }
        
        // Hide loading indicator
        showLoading(false);
    }

    function findKanjiMatches(searchWord, wordVariations) {
        const results = [];
        const processedKanji = new Set(); // To avoid duplicate Kanji in results
        
        // Track which variation matched best for each Kanji
        const matchSources = {};
        
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
            let bestVariation = searchWord; // Default to original search word
            
            // First check direct matches with the original search word
            let directMatchScore = 0;
            let directMatchWord = '';
            
            kanjiData.meanings.forEach(meaning => {
                const score = calculateImprovedSimilarity(searchWord, meaning);
                
                // If there's a decent direct match, record it
                if (score >= 0.35) {
                    meaningMatches.push({
                        meaning: meaning,
                        score: score,
                        variation: searchWord
                    });
                    
                    if (score > directMatchScore) {
                        directMatchScore = score;
                        directMatchWord = meaning;
                    }
                }
            });
            
            // Then check matches with word variations, but only if we don't have a strong direct match
            if (directMatchScore < 0.75) { // Only use synonyms if direct match isn't already strong
                // Check each meaning of the kanji with word variations
                kanjiData.meanings.forEach(meaning => {
                    // Skip the original word since we already checked it
                    for (let i = 1; i < wordVariations.length; i++) {
                        const variation = wordVariations[i];
                        
                        // Calculate similarity score with improved algorithm
                        const score = calculateImprovedSimilarity(variation, meaning);
                        
                        // Apply a synonym penalty to the score (80% of original score)
                        // This ensures synonym matches are weighted lower than direct matches
                        const adjustedScore = score * 0.8;
                        
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
                            bestVariation = variation;
                        }
                    }
                });
            }
            
            // If direct match is better, use that instead
            if (directMatchScore > bestMatchScore) {
                bestMatchScore = directMatchScore;
                bestMatchWord = directMatchWord;
                bestVariation = searchWord;
            }
            
            // Only include results with a match score above threshold
            if (bestMatchScore >= 0.35) {
                // Apply a more nuanced scoring system to the final percentage
                let adjustedScore = adjustMatchScore(bestMatchScore, meaningMatches, searchWord);
                
                // Additional adjustment for matches found through synonyms
                // If the best match is through a synonym and not the original word,
                // further reduce the score based on the semantic distance between 
                // the original word and the synonym that matched
                if (bestVariation !== searchWord) {
                    const similarityToOriginal = calculateSemanticSimilarity(searchWord, bestVariation);
                    
                    // Scale the final score based on how similar the synonym is to the original word
                    // This prevents unrelated synonyms from giving inappropriately high scores
                    adjustedScore = adjustedScore * similarityToOriginal;
                    
                    // Add an extra penalty for matches through synonyms
                    adjustedScore = adjustedScore * 0.85;
                }
                
                // Check negative connotations against search term
                const negativeMatchInfo = checkNegativeConnotations(searchWord, kanjiData);
                
                // Track which word variation led to this match
                matchSources[kanjiData.kanji] = bestVariation !== searchWord ? bestVariation : null;
                
                results.push({
                    kanji: kanjiData.kanji,
                    matchPercentage: Math.round(adjustedScore * 100),
                    matchedMeaning: bestMatchWord,
                    pronunciation: kanjiData.pronunciation,
                    commonUsage: kanjiData.commonUsage,
                    meaningMatches: meaningMatches.sort((a, b) => b.score - a.score),
                    negativeConnotations: kanjiData.negativeConnotations,
                    negativeMatch: negativeMatchInfo,
                    rawScore: bestMatchScore,
                    matchSource: bestVariation !== searchWord ? bestVariation : null
                });
                
                processedKanji.add(kanjiData.kanji);
            }
        });
        
        // Sort by match percentage (highest first)
        return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
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
    
    function displayResults(results, searchWord, wordVariations) {
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No matching Kanji found. Try a different word.</p>';
            return;
        }
        
        // Add header with search term and included variations
        const searchHeader = document.createElement('div');
        searchHeader.className = 'search-header';
        
        // Create a shortened list of variations for display (to avoid cluttering the UI)
        const variationsToShow = wordVariations.slice(1, 5); // Skip original word, show up to 4 variations
        const variationsText = variationsToShow.length > 0 ? 
            ` (including similar words: ${variationsToShow.join(", ")}${wordVariations.length > 5 ? "..." : ""})` : 
            '';
        
        searchHeader.innerHTML = `<h3>Results for "${searchWord}"${variationsText}</h3>`;
        resultsContainer.appendChild(searchHeader);
        
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
            
            resultsContainer.appendChild(kanjiCard);
        });
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
}); 