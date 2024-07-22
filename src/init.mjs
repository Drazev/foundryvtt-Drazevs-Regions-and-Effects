import {MODULE_ID} from "./constants.mjs";
import TestApp from './sheets/TestApp.mjs'
import ReactBaseApplication from './apps/ReactBaseApplication'
import DreRegionBehaviorBaseType from "./model/DreRegionBehaviorBaseType.mjs";
import DreRegionBehaviorItemType from "./model/DreRegionBehaviorItemType.mjs";

console.log("Initilizing module: ",MODULE_ID);

Hooks.once("init",() => {
    console.log("Init code for ",MODULE_ID);
    console.log("init this",this)
    console.log("config",CONFIG)
    console.log("check object to assign",CONFIG?.RegionBehavior?.dataModels)
    
    //The keys of this field must match the TYPES key assigned to the class for localization to work on dialogue windows
    Object.assign(CONFIG.RegionBehavior.dataModels,{
        [`${MODULE_ID}.DreRegionBehaviorItemType`] : DreRegionBehaviorItemType
    })
});

Hooks.once("ready",() => {
    console.log("Ready code for the module ",MODULE_ID);
    const testApp = new TestApp();
    const app = new ReactBaseApplication();
    console.log("check object to assign",CONFIG?.RegionBehavior?.dataModels)
    app.render(true);
});

Hooks.on('renderRegionBehaviorConfig',(app,html,data) =>{
    if(!app.document.type.includes(`${MODULE_ID}.DreRegionBehavior`)) {
        return;
    }
    console.log("DRE region behavior config rendered!",app,html,data);
    //todo: bind the instance listeners to the form. This should be delegated to a class that understands region behavior config with some type specific validation
});