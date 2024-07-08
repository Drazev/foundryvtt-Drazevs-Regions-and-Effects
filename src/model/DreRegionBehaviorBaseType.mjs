import {BEHAVIOR_PREFIX} from '../constants.mjs'
import {InvalidFunctionArgument} from '../Dre_Errors.mjs'
const { RegionBehaviorType } = foundry.data.regionBehaviors;
const { SetField, StringField, DocumentUUIDField } = foundry.data.fields;

/**
 * @typedef {import("./foundryTypeDefs.mjs").DataFieldOptions} DataFieldOptions
 * @typedef {import("./foundryTypeDefs.mjs").SetField} SetField
 * @typedef {import("./foundryTypeDefs.mjs").StringField} StringField
 */

/**
 * The Base DRE Behavior for all DRE Behaviors.
 * 
 * T
 * @abstract
 * @property {string} uuid           The Macro UUID.
 */
export default class DreRegionBehaviorBaseType extends RegionBehaviorType {
  static BEHAVIOR_ID = 'BASE'
  /** @override */
  static LOCALIZATION_PREFIXES = [`${BEHAVIOR_PREFIX}.${this.BEHAVIOR_ID}`];
  static events = {}
  static EFFECT_SOURCE_CHOICES = [
    "ACTOR",
    "ENVIRONMENT",
    "PLACEABLE_OBJECT"
  ]

  static defineSchema() {
   
    //Apparently in JS you inherit static functions too
    return {
      events : this._createEventsField()
    }
  }

  // static _createEventsField() {
  //   return super._createEventsField();
  // }

  /** @override */
  async _handleRegionEvent(event) {
    console.debug(`${LOCALIZATION_PREFIXES} _handleRegionEvent`,event);
  }

/**
 * 
 * @param {Array<string>} optsArray A string array containing the options id's for the field
 * @param {string} localizationFieldPath The fully qualified localization path for this field that will appear before the choice keys.
 * @param {boolean} isRequired True if the field should be required. Overrides related key in fieldOptions if provided. Default: True
 * @param {bigint} defaultOptIndex The index of the default option contained in the array optsArray. Overrides related key in fieldOptions if provided.
 * @param {DataFieldOptions} fieldOptions Extra options. If a key contianed has an associated arg in this function which was explicitly passed it will override the related value in this object.
 * @return {StringField} A SetField containing the options required
 * @throws {InvalidFunctionArgument}
 */
  static _createOptionsField(optsArray,localizationFieldPath,isRequired,defaultOptIndex,fieldOptions) {
    if(!optsArray instanceof Array) {
      throw new InvalidFunctionArgument("optsArray",optsArray,"Must be an instance of Array<T>.");
    }
    else if(optsArray.length < 1) {
      throw new InvalidFunctionArgument("optsArray",optsArray,"optsArray must have at least one element.");
    }
    else if(defaultOptIndex && defaultOptIndex > -1 && optsArray.length <= defaultOptIndex) {
      throw new InvalidFunctionArgument("defaultOptIndex",defaultOptIndex,`Index ${defaultOptIndex} is not in optsArray.`)
    }
    else if(!localizationFieldPath) {
      throw new InvalidFunctionArgument("localizationFieldPath",localizationFieldPath,"Must be a valid localization path.")
    }

    let options = {
      'required' : true,
      'nullable' : false,
      'initial' : optsArray[0]
    }

    let explicitOptions = {};

    if(isRequired) {
      explicitOptions['required'] = isRequired
    }

    if(defaultOptIndex) {
      explicitOptions['initial'] = optsArray[defaultOptIndex]
    }
  
    if(fieldOptions && fieldOptions.hasOwnProperty('choices')) {
      console.warn("Choices key found on fieldOptions. Deleting choices and regenerating with given params.")
      delete fieldOptions.choices;
    }

    Object.assign(options,explicitOptions,fieldOptions)
    options['choices'] = {}
    
    //Populate map of options to localization labels that represent them
    for(const option of optsArray) {
      options.choices[option] = `${localizationFieldPath}.${option}.label`
    }
    console.log("setField options: ",options)
    return new StringField(options)
  }
}