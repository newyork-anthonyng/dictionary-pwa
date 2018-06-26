(function() {
  const inputField = document.querySelector(".js-input");
  const template = document.getElementById("definition-template");
  const main = document.querySelector(".js-main");

  document
    .querySelector(".js-search-button")
    .addEventListener("click", searchForWord);

  function searchForWord() {
    const searchTerm = inputField.value;

    fetchDefinition(searchTerm).then(response =>
      renderWordCard(searchTerm, response.definition)
    );
  }

  function renderWordCard(term, definition) {
    const clone = document.importNode(template.content, true);
    const termNode = clone.querySelector("dt");
    termNode.textContent = term;

    const definitionNode = clone.querySelector("dd");
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
})();
