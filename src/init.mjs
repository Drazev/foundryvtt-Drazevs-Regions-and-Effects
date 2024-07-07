import {default as LOCALCONFIG} from "./constants.mjs";
import TestApp from './apps/TestApp.mjs'
import DreRegionBehaviorBaseType from "./model/DreRegionBehaviorBaseType.mjs";

console.log("Initilizing module: ",LOCALCONFIG.moduleId);

Hooks.once("init",() => {
    console.log("Init code for ",LOCALCONFIG.moduleId);
    console.log("init this",this)
    console.log("config",CONFIG)
    console.log("check object to assign",CONFIG?.RegionBehavior?.dataModels)

    //The keys of this field must match the TYPES key assigned to the class for localization to work on dialogue windows
    Object.assign(CONFIG.RegionBehavior.dataModels,{
        "drazevs-regions-and-effects.DreRegionBehaviorBaseType" : DreRegionBehaviorBaseType
    })
});

Hooks.once("ready",() => {
    console.log("Ready code for the module ",LOCALCONFIG.moduleId);
    const testApp = new TestApp();
    console.log("check object to assign",CONFIG?.RegionBehavior?.dataModels)
    testApp.render(true);
});