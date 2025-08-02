import Character from "../scripts/Character.js";

class GameInterface {
  constructor() {
    this.character = null;
    this.gameState = "menu";

    // DOM Elements using BEM naming
    this.characterInfo = document.querySelector(".character__info");
    this.gameContent = document.querySelector(".display__content");
    this.actionButtons = document.querySelector(".interaction__buttons");
    this.textInput = document.querySelector(".input--text");

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.showWelcomeScreen();
    // Set up mobile toggle after DOM is fully ready
    setTimeout(() => this.setupMobileToggle(), 100);
  }

  setupEventListeners() {
    // Handle text input submissions
    const textInputArea = document.querySelector(".interaction__input");
    if (textInputArea) {
      textInputArea.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleTextInput();
      });
    }
  }

  showWelcomeScreen() {
    this.updateGameContent(`
      <h3>Welcome to Project Hope</h3>
      <p>Before you walked the Usual Road, you lived a quiet life. But something shaped you, more than anyone knew.</p>
      <p>Ready to begin your journey?</p>
    `);

    this.updateActionButtons([
      {
        text: "Start Character Creation",
        action: () => this.startCharacterCreation(),
      },
      { text: "Load Character", action: () => this.loadCharacter() },
    ]);
  }

  startCharacterCreation() {
    this.gameState = "character-creation";
    this.updateGameContent(`
      <h3>Character Creation</h3>
      <p>What part of you always refused to be ignored?</p>
    `);

    this.updateActionButtons([
      {
        text: '"The ache in my bones to act when others waited."',
        action: () => this.selectBackground("body"),
        color: "red",
      },
      {
        text: '"The itch in my brain to understand what others missed."',
        action: () => this.selectBackground("mind"),
        color: "blue",
      },
      {
        text: '"The pull in my chest when others looked my way."',
        action: () => this.selectBackground("soul"),
        color: "purple",
      },
      {
        text: '"I don\'t know. Maybe I was never meant to fit here."',
        action: () => this.selectBackground("nameless"),
        color: "black",
      },
    ]);
  }

  selectBackground(type) {
    // Handle background selection logic
    console.log(`Selected background type: ${type}`);
    // This would continue the character creation flow
  }

  updateGameContent(content) {
    if (this.gameContent) {
      this.gameContent.innerHTML = content;
      this.gameContent.classList.add("u-fade-in");
      setTimeout(() => this.gameContent.classList.remove("u-fade-in"), 500);
    }
  }

  updateActionButtons(buttons) {
    if (!this.actionButtons) return;

    this.actionButtons.innerHTML = "";

    buttons.forEach((button) => {
      const btn = document.createElement("button");
      btn.className = "btn btn--action";
      btn.textContent = button.text;
      btn.onclick = button.action;

      if (button.color) {
        btn.style.borderLeft = `4px solid var(--color-${button.color})`;
      }

      this.actionButtons.appendChild(btn);
    });
  }

  updateCharacterSheet(character) {
    if (!this.characterInfo || !character) return;

    const status = character.statusReport();

    this.characterInfo.innerHTML = `
      <div class="character__basic">
        <h3 class="character__basic-name">${status.name}</h3>
        <p class="character__basic-detail"><strong>${
          status.background
        }</strong> | <strong>${status.archetype}</strong></p>
      </div>

      <div class="character__section character__hope">
        <div class="character__section-header" data-toggle="hope">
          <h4 class="character__section-title">Hope</h4>
          <span class="character__section-toggle">▼</span>
        </div>
        <div class="character__section-content">
          <div class="character__stat-item character__stat-item--hope">
            ${status.resources.HP} / ${status.resources.maxHP}
          </div>
        </div>
      </div>

      <div class="character__section">
        <div class="character__section-header" data-toggle="experience">
          <h4 class="character__section-title">Experience</h4>
          <span class="character__section-toggle">▼</span>
        </div>
        <div class="character__section-content">
          <div class="character__stat-item">
            <span>Current Experience:</span><span>${
              status.experience?.current || 0
            }</span>
          </div>
          <div class="character__stat-item">
            <span>Total Experience:</span><span>${
              status.experience?.total || 0
            }</span>
          </div>
        </div>
      </div>
      
      <div class="character__section character__section--collapsed">
        <div class="character__section-header" data-toggle="core-stats">
          <h4 class="character__section-title">Core Statistics</h4>
          <span class="character__section-toggle">▼</span>
        </div>
        <div class="character__section-content">
          <div class="character__subsection">
            <h5 class="character__subsection-title">Attributes</h5>
            <div class="character__compact-grid">
              <div class="character__compact-item">Body: ${
                status.attributes.BDY
              }</div>
              <div class="character__compact-item">Mind: ${
                status.attributes.MND
              }</div>
              <div class="character__compact-item">Soul: ${
                status.attributes.SOL
              }</div>
            </div>
          </div>
          <div class="character__subsection">
            <h5 class="character__subsection-title">Approaches</h5>
            <div class="character__compact-grid">
              <div class="character__compact-item">Force: ${
                status.approaches.FRC
              }</div>
              <div class="character__compact-item">Focus: ${
                status.approaches.FOC
              }</div>
              <div class="character__compact-item">Finesse: ${
                status.approaches.FNS
              }</div>
            </div>
          </div>
        </div>
      </div>

      <div class="character__section">
        <div class="character__section-header" data-toggle="equipment">
          <h4 class="character__section-title">Equipment</h4>
          <span class="character__section-toggle">▼</span>
        </div>
        <div class="character__section-content">
          <div class="character__equipment-item ${
            !status.equipment.weapon ? "character__equipment-item--empty" : ""
          }">
            <span>Weapon:</span><span>${
              status.equipment.weapon || "None"
            }</span>
          </div>
          <div class="character__equipment-item ${
            !status.equipment.armor ? "character__equipment-item--empty" : ""
          }">
            <span>Armor:</span><span>${status.equipment.armor || "None"}</span>
          </div>
          <div class="character__equipment-item ${
            !status.equipment.accessory
              ? "character__equipment-item--empty"
              : ""
          }">
            <span>Accessory:</span><span>${
              status.equipment.accessory || "None"
            }</span>
          </div>
        </div>
      </div>

      <div class="character__section character__section--collapsed">
        <div class="character__section-header" data-toggle="combat">
          <h4 class="character__section-title">Combat Statistics</h4>
          <span class="character__section-toggle">▼</span>
        </div>
        <div class="character__section-content">
          <div class="character__subsection character__subsection--offensive">
            <h5 class="character__subsection-title">Offensive Power</h5>
            <div class="character__stat-item">
              <span>Might (Strike):</span><span>${status.stats.MIG}</span>
            </div>
            <div class="character__stat-item">
              <span>Technique (Craft):</span><span>${status.stats.TEC}</span>
            </div>
            <div class="character__stat-item">
              <span>Influence (Talk):</span><span>${status.stats.INF}</span>
            </div>
          </div>
          <div class="character__subsection character__subsection--defensive">
            <h5 class="character__subsection-title">Defensive Mitigation</h5>
            <div class="character__stat-item">
              <span>Agility:</span><span>${status.stats.AGI}</span>
            </div>
            <div class="character__stat-item">
              <span>Wisdom:</span><span>${status.stats.WIS}</span>
            </div>
            <div class="character__stat-item">
              <span>Charisma:</span><span>${status.stats.CHA}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="character__section character__section--collapsed">
        <div class="character__section-header" data-toggle="resources">
          <h4 class="character__section-title">Energy Resources</h4>
          <span class="character__section-toggle">▼</span>
        </div>
        <div class="character__section-content">
          <div class="character__stat-item">
            <span>Stamina:</span><span>${status.resources.STA} / ${
      status.resources.maxSTA
    }</span>
          </div>
          <div class="character__stat-item">
            <span>Concentration:</span><span>${status.resources.CON} / ${
      status.resources.maxCON
    }</span>
          </div>
          <div class="character__stat-item">
            <span>Resolve:</span><span>${status.resources.RES} / ${
      status.resources.maxRES
    }</span>
          </div>
          <div class="character__subsection">
            <h5 class="character__subsection-title">Recovery Rates</h5>
            <div class="character__stat-item">
              <span>Stamina Recovery:</span><span>${status.recovery.STA}</span>
            </div>
            <div class="character__stat-item">
              <span>Concentration Recovery:</span><span>${
                status.recovery.CON
              }</span>
            </div>
            <div class="character__stat-item">
              <span>Resolve Recovery:</span><span>${status.recovery.RES}</span>
            </div>
          </div>
        </div>
      </div>

      ${
        status.states.length > 0
          ? `
        <div class="character__section">
          <div class="character__section-header" data-toggle="states">
            <h4 class="character__section-title">Current States</h4>
            <span class="character__section-toggle">▼</span>
          </div>
          <div class="character__section-content">
            ${status.states
              .map(
                (state) =>
                  `<div class="character__state-item character__state-item--${state.toLowerCase()}">${state}</div>`
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }
    `;

    // Add click handlers for collapsible sections after updating content
    this.setupCollapsibleSections();

    // Re-setup mobile toggle after character sheet content changes
    setTimeout(() => this.setupMobileToggle(), 50);
  }

  setupCollapsibleSections() {
    const headers = document.querySelectorAll(".character__section-header");
    headers.forEach((header) => {
      header.addEventListener("click", () => {
        const section = header.closest(".character__section");
        section.classList.toggle("character__section--collapsed");
      });
    });
  }

  setupMobileToggle() {
    console.log("Setting up mobile toggle..."); // Debug log

    const mobileToggle = document.querySelector(".character__mobile-toggle");
    const characterSheet = document.querySelector(".character");

    console.log("Mobile toggle element:", mobileToggle); // Debug log
    console.log("Character sheet element:", characterSheet); // Debug log

    if (mobileToggle && characterSheet) {
      // Clear any existing event listeners by cloning
      const newMobileToggle = mobileToggle.cloneNode(true);
      mobileToggle.parentNode.replaceChild(newMobileToggle, mobileToggle);

      newMobileToggle.addEventListener("click", (e) => {
        console.log("Mobile toggle clicked!"); // Debug log
        e.preventDefault();
        e.stopPropagation();

        const isCurrentlyCollapsed = characterSheet.classList.contains(
          "character--mobile-collapsed"
        );
        console.log("Currently collapsed:", isCurrentlyCollapsed); // Debug log

        characterSheet.classList.toggle("character--mobile-collapsed");

        // Update button text to indicate state
        const isNowCollapsed = characterSheet.classList.contains(
          "character--mobile-collapsed"
        );
        newMobileToggle.textContent = isNowCollapsed ? "📄" : "📋";

        console.log("Now collapsed:", isNowCollapsed); // Debug log
      });

      // Auto-expand character sheet on larger screens
      const mediaQuery = window.matchMedia("(min-width: 769px)");
      const handleMediaChange = (e) => {
        if (e.matches) {
          // Desktop/tablet view - always expand character sheet
          characterSheet.classList.remove("character--mobile-collapsed");
          newMobileToggle.textContent = "📋";
        }
      };

      // Check initial state
      handleMediaChange(mediaQuery);

      // Listen for changes with better browser support
      try {
        mediaQuery.addEventListener("change", handleMediaChange);
      } catch (e1) {
        try {
          mediaQuery.addListener(handleMediaChange);
        } catch (e2) {
          console.warn("Media query listeners not supported");
        }
      }
    } else {
      console.error("Mobile toggle setup failed - elements not found");
    }
  }

  handleTextInput() {
    // Handle text input from user
    const input = this.textInput?.value.trim();
    if (input) {
      console.log("User input:", input);
      this.textInput.value = "";
    }
  }

  loadCharacter() {
    // Minimal test character - only essential data needed
    this.character = new Character({
      name: "Revulo Kosmaroj",
      background: "Nameless",
      archetype: "Harmonic Seeker",
      attributes: {
        BDY: 3,
        MND: 2,
        SOL: 2,
      },
      approaches: {
        FRC: 2,
        FOC: 4,
        FNS: 2,
      },
      equipment: {
        weapon: "Worn Blade",
        armor: "Leather Vest",
        accessory: null, // No accessory equipped
      },
      experience: {
        current: 5,
        total: 15,
      },
    });

    this.updateCharacterSheet(this.character);
    this.showGameStart();
  }

  showGameStart() {
    this.gameState = "playing";
    this.updateGameContent(`
      <h3>The Usual Road</h3>
      <p>You stand at the edge of the Usual Road, where every journey starts the same: a cracked path, a crooked sign, a distant light barely flickering through the morning fog.</p>
      <p>A worn satchel rests on your shoulder. The memory of your background presses faintly against your spine.</p>
      <p>Footsteps echo behind you. A voice calls out—not unkind, but unfamiliar: "Hey. You coming or what?"</p>
    `);

    this.updateActionButtons([
      { text: "Look behind you", action: () => this.lookBehind() },
      { text: "Continue forward", action: () => this.continueForward() },
      { text: "Check your satchel", action: () => this.checkSatchel() },
    ]);
  }

  lookBehind() {
    this.updateGameContent(`
      <p>You turn to see a figure approaching through the mist...</p>
    `);
  }

  continueForward() {
    this.updateGameContent(`
      <p>You step forward onto the cracked stones of the Usual Road...</p>
    `);
  }

  checkSatchel() {
    this.updateGameContent(`
      <p>You open your satchel and find...</p>
    `);
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new GameInterface();
});
