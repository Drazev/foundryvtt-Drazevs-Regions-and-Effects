import CONFIG from "static/constants.mjs";

console.log("Initilizing module: ",CONFIG.moduleId);

Hooks.once("init",() => {
    console.log("Init code for ",CONFIG.moduleId);
});

Hooks.once("ready",() => {
    console.log("Ready code for ",CONFIG.moduleId);
});