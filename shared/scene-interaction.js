// Shared Scene Object Interaction schema and route resolver. Studio and Website use this single contract.
(function exposeSceneInteraction(global) {
  const actions = Object.freeze(["none", "scene", "work", "character", "game", "url", "previous-page", "next-page", "toggle-menu", "go-back", "previous-item", "next-item", "clear-filters", "media-toggle-play", "media-toggle-sound"]);
  const targetlessActions = Object.freeze(["previous-page", "next-page", "toggle-menu", "go-back", "previous-item", "next-item", "clear-filters", "media-toggle-play", "media-toggle-sound"]);
  const openModes = Object.freeze(["same-tab", "new-tab", "scene-transition"]);
  const cursors = Object.freeze(["default", "pointer"]);
  const legacyActions = Object.freeze({ page: "url", external: "url" });
  // Games Hub v1 has four existing non-editable entries. This is a UI source list, not a second data registry.
  const gameOptions = Object.freeze([{ id: "lottery", label: "Lottery" }, { id: "dice", label: "Dice" }, { id: "coin", label: "Coin" }, { id: "fortune", label: "Fortune" }]);
  const clean = (value, limit = 500) => typeof value === "string" ? value.trim().slice(0, limit) : "";
  const action = (value) => actions.includes(value) ? value : (legacyActions[value] || "none");
  const normalize = (value) => {
    const source = value && typeof value === "object" ? value : {};
    const nextAction = action(source.action || source.type);
    const target = clean(source.target);
    return Object.freeze({
      enabled: source.enabled === undefined ? Boolean(nextAction !== "none" && target) : Boolean(source.enabled),
      cursor: cursors.includes(source.cursor) ? source.cursor : (nextAction !== "none" ? "pointer" : "default"),
      action: nextAction,
      target,
      openMode: openModes.includes(source.openMode) ? source.openMode : "same-tab"
    });
  };
  const isActionable = (value) => {
    const interaction = normalize(value);
    return interaction.enabled && interaction.action !== "none" && (targetlessActions.includes(interaction.action) || Boolean(interaction.target));
  };
  const route = (value) => {
    const interaction = normalize(value);
    if (!isActionable(interaction) || interaction.action === "scene") return "";
    if (interaction.action === "work") return "work.html?id=" + encodeURIComponent(interaction.target);
    if (interaction.action === "character") return "character.html?id=" + encodeURIComponent(interaction.target);
    if (interaction.action === "game") return "games.html#" + encodeURIComponent(interaction.target);
    return interaction.target;
  };
  const api = Object.freeze({ actions, targetlessActions, openModes, cursors, gameOptions, normalize, isActionable, route });
  if (global) global.ShiGaiSceneInteraction = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
