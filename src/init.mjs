import CONFIG from "./constants.mjs";
import TestApp from './apps/TestApp.mjs'

console.log("Initilizing module: ",CONFIG.moduleId);

Hooks.once("init",() => {
    console.log("Init code for ",CONFIG.moduleId);
});

Hooks.once("ready",() => {
    console.log("Ready code for the module ",CONFIG.moduleId);
    const testApp = new TestApp();
    testApp.render(true);
});