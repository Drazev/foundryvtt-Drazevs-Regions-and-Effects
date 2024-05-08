# Guide

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

Here is an example of creating a new effect and applying it to an actor
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
fromUuidSync('Actor.Vcld2aYB5E9uPSdi').appliedEffects[0].update({disabled:true})