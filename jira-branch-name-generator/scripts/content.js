var branchNameGenerator = function() {

  const ticketTitle = document.querySelector("h1");
  const ticketID = document.querySelector('[data-testid*="current-issue"] span').textContent;
  let ticketTypeAriaLabel = document.querySelector('[data-testid*=".change-issue-type"] button[aria-label]').getAttribute('aria-label');
  let ticketType;
  const clipboardIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f5f5f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`;
  const branchIconSVG = `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M19 11c0 1.3-.8 2.4-2 2.8V15c0 2.2-1.8 4-4 4h-2.2c-.4 1.2-1.5 2-2.8 2-1.7 0-3-1.3-3-3 0-1.3.8-2.4 2-2.8V8.8C5.9 8.4 5 7.3 5 6c0-1.7 1.3-3 3-3s3 1.3 3 3c0 1.3-.8 2.4-2.1 2.8v6.4c.9.3 1.6.9 1.9 1.8H13c1.1 0 2-.9 2-2v-1.2c-1.2-.4-2-1.5-2-2.8 0-1.7 1.3-3 3-3s3 1.3 3 3zM8 5c-.5 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm8 7c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm-8 7c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z" fill="currentColor" fill-rule="evenodd"></path></svg>`;
  const checkIconSVG = `<svg width="20" height="20" color="#00875A"  viewBox="0 0 24 24" role="presentation"><path d="M6.735 12.322a1 1 0 00-1.47 1.356l3.612 3.919c.537.526 1.337.526 1.834.03l.364-.359a2335.638 2335.638 0 003.939-3.883l.04-.04a492.598 492.598 0 003.658-3.643 1 1 0 00-1.424-1.404 518.42 518.42 0 01-3.64 3.625l-.04.04a2049.114 2049.114 0 01-3.775 3.722l-3.098-3.363z" fill="currentColor"></path></svg>`;

  if (ticketTypeAriaLabel.toLowerCase().includes("bug")) {
    ticketType = "bugfix";
  }
  else if (ticketTypeAriaLabel.toLowerCase().includes("tâche")) {
    ticketType = "task";
  }
  else {
    ticketType = "feature";
  }
  
  
  if (ticketTitle) {
    // Special characters replacement
    var rules = {
      a:"àáâãäå",
      A:"ÀÁÂ",
      e:"èéêë",
      E:"ÈÉÊË",
      i:"ìíîï",
      I:"ÌÍÎÏ",
      o:"òóôõöø",
      O:"ÒÓÔÕÖØ",
      u:"ùúûü",
      U:"ÙÚÛÜ",
      y:"ÿ",
      c: "ç",
      C:"Ç",
      n:"ñ",
      N:"Ñ"
      }; 
  
    function  getJSONKey(key){
      for (acc in rules){
        if (rules[acc].indexOf(key)>-1){return acc}
      }
    }
  
    function replaceSpec(Texte){
      regstring=""
      for (acc in rules){
        regstring+=rules[acc]
      }
      reg=new RegExp("["+regstring+"]","g" )
      return Texte.replace(reg,function(t){ return getJSONKey(t) });
    }
  
    let ticketDescName = ticketTitle.textContent.toLowerCase().replace(/\s/g, '-');
    ticketDescName = replaceSpec(ticketDescName);
    ticketDescName = ticketDescName.replace(/[^a-z\-]/g, '');
  
    const generatorContainer = document.createElement("div");
    generatorContainer.setAttribute("id", "generator-container");

    const heading = document.getElementById("jira-issue-header-actions");
    (heading).insertAdjacentElement("afterend", generatorContainer);

    generatorContainer.innerHTML = `
      <div id="git-branch-label">
        <div id="git-branch-icon">
          ${branchIconSVG}
        </div>
        <div class="git-branch-title">
          Nom de la branche
        </div>
      </div>
      <div id="copy-to-clipboard-container">
        <fieldset>
          <input id="branch-name" value="${ticketType}/${ticketID}--${ticketDescName}" onClick="this.select();"/>
          <div id="copy-button-container">
            <button id="copy-to-clipboard">
              ${clipboardIconSVG}
            </button>
            <div id="copied-label">
              Copié !
            </div>
          </div>
        </fieldset>
      </div>
    `;

    var copyBranchName = function() {
      const branchName = document.getElementById("branch-name").value;
      const copyButton = document.getElementById("copy-to-clipboard");
      const copiedLabel = document.getElementById("copied-label");

      navigator.clipboard.writeText(branchName).then(
        () => {
          copyButton.innerHTML = checkIconSVG;
          copiedLabel.classList.add("active");
          setTimeout(() => {
            copyButton.innerHTML = clipboardIconSVG;
            copiedLabel.classList.remove("active");
          }, 3000);
        },
        () => {
          /* clipboard write failed */
          alert("Error")
        }
      );
    }
  }

  var selectBranchNameAndCopy = function() {
    this.select();
    copyBranchName();
  }
  
  const copyButton = document.getElementById("copy-to-clipboard");
  copyButton.addEventListener('click', copyBranchName);

  const branchNameEl = document.getElementById("branch-name");
  branchNameEl.addEventListener('click', selectBranchNameAndCopy);
}

window.addEventListener('load', branchNameGenerator);

