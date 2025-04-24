# Kanji Tattoo Finder

A web-based tool to help users find and understand Japanese kanji characters for tattoos with semantic search capabilities and cultural context.

## 🌟 Features

- **Semantic Search**: Find kanji based on meaning and concepts rather than just keywords
- **Negative Connotation Warnings**: Alerts for kanji with potentially negative meanings
- **Cultural Context**: Provides cultural notes and common usage information
- **Stroke Order Diagrams**: Visual guides showing how to properly write each character
- **Font Variations**: Shows kanji in different Japanese font styles
- **Tattoo Examples**: Reference images of how characters look in tattoo designs

## 🚀 Getting Started

### Prerequisites

This is a client-side JavaScript application. You only need:
- A modern web browser (Chrome, Firefox, Safari, Edge)
- An internet connection (for initial loading and API calls)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/davesuzuki-hiya/kanji-tattoo-finder.git
   ```

2. Open the index.html file in your browser:
   ```
   cd kanji-tattoo-finder
   open index.html
   ```

### Usage

1. **Basic Search**:
   - Type a word or concept in the search box (e.g., "strength", "peace", "love")
   - Click "Search" or press Enter
   - Browse the results, which are sorted by relevance

2. **Understanding Results**:
   - Each result shows the kanji character, its meanings, and match percentage
   - Color coding indicates match quality (green for excellent, yellow for good, red for warnings)
   - Warning icons highlight potential negative connotations or mismatches

3. **Viewing Details**:
   - Click on any kanji card to see detailed information
   - The detail view shows stroke order, pronunciation, common words, and cultural context
   - The tattoo examples section shows how the character might look in a tattoo design

## 🧠 How It Works

The application uses:
- Semantic search techniques to find meaningful matches beyond exact keywords
- Levenshtein distance algorithm to calculate text similarity
- Internal thesaurus and external API for word variations
- Topic categorization to detect meaning mismatches
- Dynamic UI that adapts to match quality and potential issues

## 🛠️ Technical Details

- Pure vanilla JavaScript, HTML, and CSS
- No external JS libraries/frameworks
- Responsive design that works on mobile and desktop
- Modular code structure for easy maintenance
- Error handling for API failures and edge cases

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

If you have any questions or feedback, please open an issue on GitHub.

---

⚠️ **Disclaimer**: While this tool provides guidance and information about kanji characters, it is always recommended to consult with a fluent Japanese speaker or language expert before getting a permanent tattoo in a language you don't speak. 