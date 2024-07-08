import {BEHAVIOR_PREFIX} from '../constants.mjs'
import DreRegionBehaviorBaseType from './DreRegionBehaviorBaseType.mjs';
const { RegionBehaviorType } = foundry.data.regionBehaviors;
const { SetField, StringField, DocumentUUIDField } = foundry.data.fields;
const REGION_EVENTS = foundry.CONST.REGION_EVENTS


/**
 * A Behavior that uses an item as the source of an effect. 
 * 
 * Targets will be affected regardless of item's range because
 * we will assume that any target in the region is valid unless
 * filtered out.
 *
 * @property {string} uuid           The Macro UUID.
 */
export default class DreRegionBehaviorItemType extends DreRegionBehaviorBaseType {
  static BEHAVIOR_ID = 'ITEM'
  /** @override */
  static LOCALIZATION_PREFIXES = [`${BEHAVIOR_PREFIX}.${this.BEHAVIOR_ID}`];
  static events = {}
  static  ITEM_OPTION_CHOICES = [
    "USE_ITEM",
    "USE_ITEM_COPY"
  ]


  /** @override */
  static defineSchema() {
    const schOut = {
      itemOpt : this._createOptionsField(this.ITEM_OPTION_CHOICES,`${this.LOCALIZATION_PREFIXES}.FIELDS.itemOpt`,true,0),
      effectSource : this._createOptionsField(this.EFFECT_SOURCE_CHOICES,`${this.LOCALIZATION_PREFIXES}.FIELDS.effectSource`,true,0),
      events: this._createEventsField(),
      item: new DocumentUUIDField(
        {
          type: "Item",
          validate : this.validateItem
        }
      )
    };
    console.log(`Schema Defined for ${DreRegionBehaviorItemType.LOCALIZATION_PREFIXES}:`,schOut)
    return schOut;
  }

  /**
   * Validates the item given against a criteria.
   * @param {uuid} ItemUuid 
   * @returns {boolean} True if item is valid.
   */
  static validateItem(ItemUuid) {
    console.log("Item Validator: ",ItemUuid);
    return true
  }

  /* ---------------------------------------- */

  /** @override */
  async _handleRegionEvent(event) {
    console.debug(`${LOCALIZATION_PREFIXES} _handleRegionEvent`,event);
    if ( !this.uuid ) return;
    const macro = await fromUuid(this.uuid);
    if ( !(macro instanceof Macro) ) {
      console.error(`${this.uuid} does not exist`);
      return;
    }
    await macro.execute({scene: this.scene, region: this.region, behavior: this.behavior, event, actor: null, token: null});
  }
}