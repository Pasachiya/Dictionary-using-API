class DictionaryView {
    constructor() {
        this.input = document.querySelector('.search-input');
        this.searchButton = document.querySelector('.search-button');
        this.clearHistoryButton = document.querySelector('.clear-history-button');
        this.dictionary = document.querySelector('.dictionary-app');
        this.searchHistoryDiv = document.querySelector('.search-history');
        this.suggestionsDiv = document.querySelector('.suggestions');
    }

    displayWordData(data) {
        if (data) {
            const partOfSpeechArray = data.meanings.map(meaning => meaning.partOfSpeech).join(', ');
            this.dictionary.innerHTML = `
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
                        <span>${data.meanings[0].definitions[0].example || 'No example available'}</span>
                    </div>
                    <div class="property">
                        <span>Part of Speech</span>
                        <span>${partOfSpeechArray}</span>
                    </div>
                    <div class="property">
                        <span>Synonyms</span>
                        <span>${data.meanings[0].synonyms.join(', ') || 'No synonyms available'}</span>
                    </div>
                    <div class="property">
                        <span>Antonyms</span>
                        <span>${data.meanings[0].antonyms.join(', ') || 'No antonyms available'}</span>
                    </div>
                </div>`;

            // Text-to-speech functionality
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(data.phonetics[0].text);
            const voiceSelect = document.createElement('select');
            const voices = synth.getVoices();

            voices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                voiceSelect.appendChild(option);
            });

            const speakButton = document.createElement('button');
            speakButton.textContent = 'Speak';
            speakButton.addEventListener('click', () => {
                utterance.voice = voices.find(voice => voice.name === voiceSelect.value);
                synth.speak(utterance);
            });

            this.dictionary.appendChild(voiceSelect);
            this.dictionary.appendChild(speakButton);
        } else {
            this.dictionary.innerHTML = '<p>No data found for the given word.</p>';
        }
    }

    displaySearchHistory(searchHistory) {
        this.searchHistoryDiv.innerHTML = '';
        const historyElement = document.createElement('div');
        historyElement.innerHTML = '<h3>Search History:</h3>';
        if (searchHistory.length > 0) {
            const historyList = document.createElement('ul');
            searchHistory.forEach(word => {
                const listItem = document.createElement('li');
                listItem.textContent = word;
                listItem.addEventListener('click', () => {
                    this.input.value = word;
                    this.controller.getWordDefinition(word);
                });
                historyList.appendChild(listItem);
            });
            historyElement.appendChild(historyList);
        } else {
            historyElement.innerHTML += '<p>No search history available</p>';
        }
        this.searchHistoryDiv.appendChild(historyElement);
    }

    displaySuggestions(suggestions) {
        this.suggestionsDiv.innerHTML = '';
        if (suggestions.length > 0) {
            const suggestionList = document.createElement('ul');
            suggestions.forEach(word => {
                const listItem = document.createElement('li');
                listItem.textContent = word;
                listItem.addEventListener('click', () => {
                    this.input.value = word;
                    this.controller.getWordDefinition(word);
                });
                suggestionList.appendChild(listItem);
            });
            this.suggestionsDiv.appendChild(suggestionList);
        } else {
            this.suggestionsDiv.innerHTML = '<p>No suggestions found</p>';
        }
    }

    bindController(controller) {
        this.controller = controller;
    }
}

export default DictionaryView;