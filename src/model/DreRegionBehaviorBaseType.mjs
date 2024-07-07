const { RegionBehaviorType } = foundry.data.regionBehaviors;
const { StringField } = foundry.data.fields;
const REGION_EVENTS = foundry.CONST.REGION_EVENTS

/**
 * The data model a behavior that executes a Macro.
 *
 * @property {string} uuid           The Macro UUID.
 */
export default class DreRegionBehaviorBaseType extends RegionBehaviorType {

  /** @override */
  static LOCALIZATION_PREFIXES = ["DRE.BEHAVIOR"];
  static events = {}

  /** @override */
  static defineSchema() {
    const schOut = {
      events: this._createEventsField(),
      uuid: new foundry.data.fields.DocumentUUIDField(
        {
          type: "ActiveEffect"
        }
      )
    };
    console.log("Schema Defined for DRE:",schOut)
    return schOut;
  }

  /* ---------------------------------------- */

  /** @override */
  async _handleRegionEvent(event) {
    console.log("DRE _handleRegionEvent",event);
    if ( !this.uuid ) return;
    const macro = await fromUuid(this.uuid);
    if ( !(macro instanceof Macro) ) {
      console.error(`${this.uuid} does not exist`);
      return;
    }
    await macro.execute({scene: this.scene, region: this.region, behavior: this.behavior, event, actor: null, token: null});
  }
}