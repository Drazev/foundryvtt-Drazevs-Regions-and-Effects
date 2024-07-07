
/**
 * Region Config Application for DRE which extends the default region config sheet to change the layout
 * and include DRE specific options.
 * 
 * This sheet is necessary because Foundry Version 12.328 BaseRegionBehavior::metadata.coreTypes is not
 * dynamic and doesn't support the addition of new behavior types to that array. Therefore you cannot
 * create new region behaviors that will appear in the add behavior context menu since they will not be
 * seen by Document.create()
 */
export default class DreRegionConfigSheet extends foundry.applications.sheets.RegionConfig {


    /**
     * @override
     * Handle button clicks to create a new behavior.
     * @this {RegionConfig}
     */
    static async #onBehaviorCreate(_event) {
        console.log("DreRegionConfigSheet.#onBehaviorCreate",this,_event);
          await RegionBehavior.implementation.createDialog({}, {parent: this.document});
        }
}