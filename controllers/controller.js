import DictionaryModel from '../models/model.js';
import DictionaryView from '../views/view.js';

class DictionaryController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.bindController(this);

        this.view.searchButton.addEventListener('click', () => {
            const word = this.view.input.value.trim();
            if (word) {
                this.getWordDefinition(word);
                this.getWordSuggestions(word);
            }
        });

        this.view.input.addEventListener('input', () => {
            const query = this.view.input.value.trim();
            if (query) {
                this.getWordSuggestions(query);
            } else {
                this.view.displaySuggestions([]);
            }
        });

        this.view.clearHistoryButton.addEventListener('click', () => {
            this.clearSearchHistory();
        });

        this.initializeSearchHistory();
    }

    async getWordDefinition(word) {
        const data = await this.model.fetchWordData(word);
        this.view.displayWordData(data);

        if (data) {
            this.model.addToSearchHistory(word);
            this.view.displaySearchHistory(this.model.getSearchHistory());
        }
    }

    async getWordSuggestions(query) {
        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
            const data = await res.json();
            const suggestions = data.map(entry => entry.word);
            this.view.displaySuggestions(suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            this.view.displaySuggestions([]);
        }
    }

    clearSearchHistory() {
        this.model.clearSearchHistory();
        this.view.displaySearchHistory([]);
    }

    initializeSearchHistory() {
        const searchHistory = this.model.getSearchHistory();
        this.view.displaySearchHistory(searchHistory);
    }
}

// Initialize the application
const dictionaryModel = new DictionaryModel();
const dictionaryView = new DictionaryView();
const dictionaryController = new DictionaryController(dictionaryModel, dictionaryView);