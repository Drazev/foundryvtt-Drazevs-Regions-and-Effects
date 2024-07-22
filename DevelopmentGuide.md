# Develop and Contribute
## Requirements
> [!IMPORTANT]
> You need `nodejs:v20.12` or later since some build script's use new features that appear in that version. 

## Code Style Guidelines

## Project Structure

```
.
├── public //These are not modified and copied directly to build
│   ├── module.json //This is the module config loaded by Foundry before the game instance is lanuched
│   ├── lang //Place your localization json files here
│   ├── packs //Place packs here
│   └── templates //These are the main templates for handlebars or any other templating engine
│       └── parts //Partial tempaltes that are used by main templates go here.
└── src //Code that is mutated goes here. When we build it will only use things included by the entrypoints
│   ├──  apps //Place base application classes here
│   ├──  css //Style sheets go here
│   ├──  model //If we add anything to the data model like types, they go here
│   ├──  services //Any scripts that are running at all times go here. Keep this minimal
│   ├──  sheets //All sheets which extend applications and are designed to modify some document. These are entrypoints.
│   |   └── Parts //Parts of a sheet, used by primary sheets to construct a view. These are not entrypoints.
│   ├──  constants.mjs //Declare any module wide constants here
│   ├──  Dre_Errors.mjs //This is where common error classes have been declared for debugging
│   └── init.mjs //This is the first script called to load the module
├── vite.config.js Configures vite engine normal, including build mode
├── vite.dev.config.js //Configures vite development build mode used for testing
└── vite.helpers.js //Helper functions used during the build process. This uses Nodejs.
```

### Important Notes
### Entrypoints
The vite build script will build and include only code that is used by an entrypoint. Since we are making a module for Foundryvtt there are multipole entrypoints we need to consider since anything we register with foundry that can be called to start some process is an entrypoint to our module.  Anything we have declared in `module.json` that refers to something in our module has the potential to be called independenly by foundry and should be considered an entry point.

The  `init.mjs` that we have identified in our `module.json` under the `esmodules` key is an entrypoint since they are called by foundry when our module loads. We also register sheets and types to our module which should also be considered entrypoints.

As a result our build script will walk the `src/model` and `src/sheets` folder and consider any valid scripts in that directory an entrypoint.


## Design

## Making a PR Request

## Gaining Recognition
When you add features or resolve issues I will recognize you in the patch notes and change log. 

After you have made some contributions if you want to be a regular part of development have a chat with me so we can make sure we are aligned. If we can work together then I'll recognize you as a contributor. If you at any point cease to be a contributor I'll still recognize you as a former contributor. 

# Guide

## Regions  and Region Behavior API

### How it works as of V12

#### class [RegionDocument](https://foundryvtt.com/api/v12/classes/client.RegionDocument.html)
A region is a mixin of `CanvasDocument` that contains data about it's canvas attributes. It is also a `BaseRegion` which are responsible for manageing the lifecycle and of `RegionBehavior`'s and `RegionEvent`'s. `RegionBehavior`'s are contained as a property including all state data while `RegionEvent`'s are created as modified `SocketEvent`'s and sent to each active  `RegionBehavior` contained in the Region that is subscribed to that RegionEvent type.

It's static functions implement the handlers for `RegionDocument`'s to use the Canvas Api for subscribed events such and inturrprut them as  `RegionEvent`'s that can be dispatched by individual region instances event handlers.

#### class [RegionEvent](https://foundryvtt.com/api/v12/interfaces/client.RegionEvent.html)
This is a transient data structure that includes event data 

#### class [RegionBehavior](https://foundryvtt.com/api/v12/classes/client.RegionBehavior.html)
This class is a `Document` responsible for implementing the behavior of a type that is part of its data model defined in `RegionBehaviorType`. This class is more a wrapper around a `RegionBehaviorType`. 

The default of behavior `async _handleRegionEvent(event)` is that it will act on the associated `RegionBehaviorType` subtype that is in context in the following order (It's accessed dynamically by the instanceOfBehaviorVariable.constructor to get the class of the instance and call its static properties).

1) Static `RegionBehaviorType` Events - Behaviors that belong to the static type and their associated callback functions. Generally these are events that target the game system.
2) Instance `Region Behavior Type` Events - Behaviors that belong to the type instance. These are specific to that instance and normally target some property set when it was created.

#### class [RegionBehaviorType](https://foundryvtt.com/api/v12/classes/foundry.data.foundry_data_regionBehaviors.RegionBehaviorType.html)
This class represents is a deceptive mix of data model and type specific behavior. It contains the subscribed triggers and handlers for them. 

The static `events` variable is a set of event names and their associated `EventBehaviorStaticHandler`'s that implement behaviors that are shared by all `RegionBehaviorTypes` of this subtype. 

The `events` property is a set of event types that have subscribed to the instance based handler for this event subtype. Through the `asyc _handleRegionEvent(event)` function on the subtype any instance related behaviors are implemented.

#### class [RegionConfig](https://foundryvtt.com/api/v12/classes/foundry.applications.sheets.RegionConfig.html)
This is the application is a `DocumentSheetV2` responsible for rendering and controlling the workflow for managing a `RegionDocument` and it's `RegionBehavior`'s. 

### Design Objectives

To enable our module to create new behavior types and use them within the existing system we will need to design with the following goals.
1) The workflow as familar as possible to the base Regional Effects workflow.
2) Regions should be left alone if possible so that they work regardless if the module is active.
3) Behavior Types unique to the module should fully support the normal Behavior API and workflow so that they can continue to work even after the module is removed, even if they cannot be created after that point.
4) Custom sheets should be used to augment the workflow and coordinate the native and module specific options in the same  UI. 

### Design

#### DreRegionConfigSheet
This sheet will replace the default sheet to augment the region configureation workflow for the module. It should fully support the original workflow elements and re-use their sheet parts if possible to keep things familiar. It may present and organize the elements to be more user friendly and enable interaction with module specific elements.

The sheets should be treated as the view and should not persist between  uses.

#### DreToggleBehaviorSheet
This will enhance the Enable/Disable behavior workflow so they can select a behavior from the same scene. It should filter for the current RegionBehavior first then also include others.

#### DreBehaviorType
This extends foundry.data.regionBehaviors.RegionBehaviorType and defines a new behavior and it's events which work within the existing region system. It will use flags attached to the sheet to persist any data specific to that behavior's instance. 

##### Possible Behavior Types
Note: Dre Can add event and region states which can be used by behaviors to make decisions. This is done using flags.

###### Active Effect
This behavior wraps an active effect by collecting and providing any information or functionality required to have it trigger on some target group. Active effects are normally attached to an item and associated with an actor, so this wrapper needs to sort out how an orphan active effect will work.

###### Item Trigger
This behavior wraps an item and determines how it's used and what it targets. It needs to sort out things like who owns the item if anyone, how the item should ber used, who it targets, how to handle consumable elements, and which actor should be used as the source if any. It will also need to handle if the item is being used as a reference to create an effect, or if it will persist afterwards.

###### Region Trigger
Trigger another region after this one concludes.

###### Encounter Trigger
Create or Modify an encounter. Encounter could add tokens to a combat, begin it, and also potentially change their visibility or disposition towards the players.

###### Spawn or Despawn Tokens
Spawn or despawn tokens to the scene. Uses a 'spawn point' shape which is assigned an id that can be referenced by this behavior. 

###### Chat Message
Send a message via chat card to specific players or a group of players.

###### Play Animation
Plays an animation on the scene at a specific location for some duration. The behavior type has a property for duration and toggle state. If duration is 0 it will remain in a loop while the animatino remains in an active state. Created animations should be owned by the behavior instance and is it to manage its lifecycle. The behavior should be prepared to handle the case where it was manually deleted.

## Active Effects API

### Active Effect Config Data
The config data is what is passed to the active effects class on creation `ActiveEffects`. This has two main keys that determine how an effect will impact the document it's embedded on which is currently either an Item or Actor.

#### Core Schema
Schema at core resources/app/common/documents/active-effect.mjs::defineSchema
```javascript
{
      _id: new fields.DocumentIdField(),
      name: new fields.StringField({required: true, blank: false, label: "EFFECT.Name", textSearch: true}),
      img: new fields.FilePathField({categories: ["IMAGE"], label: "EFFECT.Image"}),
      type: new fields.DocumentTypeField(this, {initial: CONST.BASE_DOCUMENT_TYPE}),
      system: new fields.TypeDataField(this),
      changes: new fields.ArrayField(new fields.SchemaField({
        key: new fields.StringField({required: true, label: "EFFECT.ChangeKey"}),
        value: new fields.StringField({required: true, label: "EFFECT.ChangeValue"}),
        mode: new fields.NumberField({integer: true, initial: CONST.ACTIVE_EFFECT_MODES.ADD,
          label: "EFFECT.ChangeMode"}),
        priority: new fields.NumberField()
      })),
      disabled: new fields.BooleanField(),
      duration: new fields.SchemaField({
        startTime: new fields.NumberField({initial: null, label: "EFFECT.StartTime"}),
        seconds: new fields.NumberField({integer: true, min: 0, label: "EFFECT.DurationSecs"}),
        combat: new fields.ForeignDocumentField(documents.BaseCombat, {label: "EFFECT.Combat"}),
        rounds: new fields.NumberField({integer: true, min: 0}),
        turns: new fields.NumberField({integer: true, min: 0, label: "EFFECT.DurationTurns"}),
        startRound: new fields.NumberField({integer: true, min: 0}),
        startTurn: new fields.NumberField({integer: true, min: 0, label: "EFFECT.StartTurns"})
      }),
      description: new fields.HTMLField({label: "EFFECT.Description", textSearch: true}),
      origin: new fields.StringField({nullable: true, blank: false, initial: null, label: "EFFECT.Origin"}),
      tint: new fields.ColorField({nullable: false, initial: "#ffffff", label: "EFFECT.Tint"}),
      transfer: new fields.BooleanField({initial: true, label: "EFFECT.Transfer"}),
      statuses: new fields.SetField(new fields.StringField({required: true, blank: false})),
      flags: new fields.ObjectField(),
      _stats: new fields.DocumentStatsField()
    }
```
#### DND5e Additions
module/documents/active-effect.mjs:31
```javascript
  /**
   * Is this active effect currently suppressed?
   * @type {boolean}
   */
  isSuppressed = false;
```


#### `changes` : Array of Objects
This key contains an array of objects that each describe a change.
```javascript
{
    key: An attribute of the document type to change
    mode: A valid enum key from CONST.ACTIVE_EFFECT_MODES
    priority: ??
    value: A value that will be used in the contect of the mode and applied against the attribute detailed in the key
}
```
#### `statuses` : Array of Strings
This key contains a list of keys for registered status effects defined in `CONFIG.statusEffects`

#### `duration` : EffectDurationData Object

Taken from core resources/app/client/data/documents/active-effect.js:1
```javascript
/**
 * @typedef {EffectDurationData} ActiveEffectDuration
 * @property {string} type            The duration type, either "seconds", "turns", or "none"
 * @property {number|null} duration   The total effect duration, in seconds of world time or as a decimal
 *                                    number with the format {rounds}.{turns}
 * @property {number|null} remaining  The remaining effect duration, in seconds of world time or as a decimal
 *                                    number with the format {rounds}.{turns}
 * @property {string} label           A formatted string label that represents the remaining duration
 * @property {number} [_worldTime]    An internal flag used determine when to recompute seconds-based duration
 * @property {number} [_combatTime]   An internal flag used determine when to recompute turns-based duration
 */
```


### Creating Active Effects
The ActiveEffect from foundry core defines `static async fromStatusEffect(statusId, options={})` as a way to create a status effect from a given ID listed in `CONFIG.statusEffects` defined by either foundry core or the system. Use this if you wish to apply something that already exists.

Here is an example of creating a new effect and applying it to an actor. In this example we use the `static async create(data, operation={})` function on the ActiveEffects class to create a new active effect. The `data` field will be merged with the newly created document and saved. The `operation` field defines special instructions for the new document, such as assigning it a parent and making it embedded on that parent.

[See: Creating Embedded Documents](https://foundryvtt.wiki/en/development/api/document)
```javascript
const actor = game.actors.getName('Foo');

const newActiveEffect = ActiveEffect.create({
  name: 'New Effect'
}, {
  parent: actor
});
```

### Deleting Active Effects
To delete an active effect call the Documents `delete(operation={})` function. This will cause the ActiveEffects _onDelete() functions to propogate through the inheritance chain and the document to be removed.
`myActiveEffectInstance.delete(operation={})`

### Toggling Active Effects ON/OFF
You can disable effects by calling the Document `async update(data={}, operation={})` function on the ActiveEffects instance and passing an object targeting its disabled property. For example getting the first element from an actor and disabling it.

This will trigger the _onUpdate() function to propogate up the ActiveEffects inheritance chain until it disables it.

myActiveEffectInstance.update({disabled:true | false})

Example:
```javascript
fromUuidSync('Actor.Vcld2aYB5E9uPSdi').appliedEffects[0].update({disabled:true})
```