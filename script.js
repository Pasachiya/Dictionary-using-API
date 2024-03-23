document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const clearHistoryButton = document.querySelector('.clear-history-button');
    const dictionary = document.querySelector('.dictionary-app');
    const searchHistoryDiv = document.querySelector('.search-history');

    // Function to fetch data from the dictionary API
    async function dictionaryFn(word) {
        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await res.json();
            return data[0];
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    // Function to display search history
    function displaySearchHistory() {
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchHistoryDiv.innerHTML = '';
        const historyElement = document.createElement('div');
        historyElement.innerHTML = '<h3>Search History:</h3>';
        if (searchHistory.length > 0) {
            const historyList = document.createElement('ul');
            searchHistory.forEach(word => {
                const listItem = document.createElement('li');
                listItem.textContent = word;
                historyList.appendChild(listItem);
            });
            historyElement.appendChild(historyList);
        } else {
            historyElement.innerHTML += '<p>No search history available</p>';
        }
        searchHistoryDiv.appendChild(historyElement);
    }

    // Function to update search history
    function updateSearchHistory(word) {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!searchHistory.includes(word)) {
            searchHistory.unshift(word);
            if (searchHistory.length > 5) {
                searchHistory.pop();
            }
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
        // Update display of search history
        displaySearchHistory();
    }

    // Function to clear search history
    function clearSearchHistory() {
        localStorage.removeItem('searchHistory');
        // Update display of search history
        displaySearchHistory();
    }

    // Event listener for search button
    searchButton.addEventListener('click', async () => {
        const word = input.value;
        const data = await dictionaryFn(word);

        if (data) {
            // Update search history
            updateSearchHistory(word);

            // Display word details
            const partOfSpeechArray = data.meanings.map(meaning => meaning.partOfSpeech).join(', ');
            dictionary.innerHTML = `
                <div class="card">
                    <div class="property">
                        <span>Word</span>
                        <span>${data.word}</span>
                    </div>
                    <div class="property">
                        <span>Phonetics</span>
                        <span>${data.phonetics[0].text}</span>
                    </div>
                    <div class="property">
                        <span>
                            <audio controls src="${data.phonetics[0].audio}"></audio>
                        </span>
                    </div>
                    <div class="property">
                        <span>Definition</span>
                        <span>${data.meanings[0].definitions[0].definition}</span>
                    </div>
                    <div class="property">
                        <span>Example</span>
                        <span>${data.meanings[0].definitions[0].example}</span>
                    </div>
                    <div class="property">
                        <span>Part of Speech</span>
                        <span>${partOfSpeechArray}</span>
                    </div>
                </div>`;
        } else {
            dictionary.innerHTML = '<p>No data found for the given word.</p>';
        }
    });

    // Event listener for clear history button
    clearHistoryButton.addEventListener('click', clearSearchHistory);

    // Display initial search history on page load
    displaySearchHistory();
});
