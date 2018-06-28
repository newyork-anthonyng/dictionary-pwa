(function() {
  const inputField = document.querySelector(".js-input");
  const template = document.getElementById("definition-template");
  const main = document.querySelector(".js-main");

  document.querySelector(".js-form").addEventListener("submit", searchForWord);

  function searchForWord(event) {
    event.preventDefault();
    const searchTerm = inputField.value;

    fetchDefinition(searchTerm).then(response => {
      renderWordCard(searchTerm, response.definition)
      saveDefinition(searchTerm, response.definition);
    });
  }

  function getAllDefinitions() {
    const LOCAL_STORAGE_KEY = "DICTIONARY_PWA_DEFINITIONS";

    return JSON.parse(localStorage[LOCAL_STORAGE_KEY] || "[]");
  }

  function saveDefinition(term, definition) {
      const LOCAL_STORAGE_KEY = "DICTIONARY_PWA_DEFINITIONS";
      const newDefinition = { term, definition };

      const storage = JSON.parse(localStorage[LOCAL_STORAGE_KEY] || "[]");
      storage.push(newDefinition);
      
      localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(storage);
  }

  function renderWordCard(term, definition) {
    const clone = document.importNode(template.content, true);
    const termNode = clone.querySelector(".word__term");
    termNode.textContent = term;

    const definitionNode = clone.querySelector(".word__definition");
    definitionNode.textContent = definition;

    main.appendChild(clone);
  }

  function fetchDefinition(searchTerm) {
    const URL = `https://www.dictionaryapi.com/api/v1/references/collegiate/xml/${searchTerm}?key=dda0e8f2-712a-4565-a9df-6890e188598a`;

    return fetch(URL)
      .then(response => {
        return response.text();
      })
      .then(response => {
        const parser = new DOMParser();
        xmlResponse = parser.parseFromString(response, "text/xml");

        const xmlDefinitions = xmlResponse
          .querySelector("entry")
          .querySelector("def")
          .querySelectorAll("dt");
        const textDefinitions = Array.prototype.slice
          .apply(xmlDefinitions)
          .map(a => a.textContent);

        return {
          definition: textDefinitions[0].slice(1)
        };
      });
  }

  // Initialization code
  // Render saved words onto screen
  const savedWords = getAllDefinitions();
  savedWords.forEach(word => {
    renderWordCard(word.term, word.definition);
  });

  // Add serviceworker.js
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(() => {
        console.log('%c[ServiceWorker] registered', 'color: green;');
      })
  }
})();
