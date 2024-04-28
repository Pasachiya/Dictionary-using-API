class DictionaryModel {
    constructor() {
        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    }

    async fetchWordData(word) {
        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await res.json();
            return data[0];
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    addToSearchHistory(word) {
        if (!this.searchHistory.includes(word)) {
            this.searchHistory.unshift(word);
            if (this.searchHistory.length > 5) {
                this.searchHistory.pop();
            }
            localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        }
    }

    clearSearchHistory() {
        this.searchHistory = [];
        localStorage.removeItem('searchHistory');
    }

    getSearchHistory() {
        return this.searchHistory;
    }
}

export default DictionaryModel;