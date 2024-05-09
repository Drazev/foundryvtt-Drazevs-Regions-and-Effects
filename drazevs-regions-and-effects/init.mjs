const CONFIG = {
    moduleId : "drazevs-regions-and-effects"
};

console.log("Initilizing module: ",CONFIG.moduleId);

Hooks.once("init",() => {
    console.log("Init code for ",CONFIG.moduleId);
});

Hooks.once("ready",() => {
    console.log("Ready code for ",CONFIG.moduleId);
});
//# sourceMappingURL=init.mjs.map
