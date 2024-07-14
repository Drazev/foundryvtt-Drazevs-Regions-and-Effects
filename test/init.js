var g = Object.defineProperty;
var C = (o, e, t) => e in o ? g(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var i = (o, e, t) => C(o, typeof e != "symbol" ? e + "" : e, t);
import { M as E, B as S } from "./constants-VtpJoDW0.js";
import F from "./TestApp.js";
class A extends Error {
  constructor(e = "DRE_ERROR", t, ...a) {
    super(t, a), this.name = `${E}.${e}`;
  }
}
const r = class r extends A {
  constructor(e, t, a, ...s) {
    super(
      r.ID,
      `${r.BASE_MSG} reason: ${a} param: ${e}, value: ${t}`,
      s
    );
  }
};
i(r, "ID", "INVALID_FUNC_ARG"), i(r, "BASE_MSG", "An argument provided to the function was invalid.");
let l = r;
const { RegionBehaviorType: _ } = foundry.data.regionBehaviors, { SetField: w, StringField: $, DocumentUUIDField: M } = foundry.data.fields, c = class c extends _ {
  static defineSchema() {
    return {
      events: this._createEventsField()
    };
  }
  // static _createEventsField() {
  //   return super._createEventsField();
  // }
  /** @override */
  async _handleRegionEvent(e) {
    console.debug(`${LOCALIZATION_PREFIXES} _handleRegionEvent`, e);
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
  static _createOptionsField(e, t, a, s, I) {
    if (!e instanceof Array)
      throw new l("optsArray", e, "Must be an instance of Array<T>.");
    if (e.length < 1)
      throw new l("optsArray", e, "optsArray must have at least one element.");
    if (s && s > -1 && e.length <= s)
      throw new l("defaultOptIndex", s, `Index ${s} is not in optsArray.`);
    if (!t)
      throw new l("localizationFieldPath", t, "Must be a valid localization path.");
    let d = {
      required: !0,
      nullable: !1,
      initial: e[0]
    }, h = {};
    a && (h.required = a), s && (h.initial = e[s]), I && I.hasOwnProperty("choices") && (console.warn("Choices key found on fieldOptions. Deleting choices and regenerating with given params."), delete I.choices), Object.assign(d, h, I), d.choices = {};
    for (const f of e)
      d.choices[f] = `${t}.${f}.label`;
    return console.log("setField options: ", d), new $(d);
  }
};
i(c, "BEHAVIOR_ID", "BASE"), /** @override */
i(c, "LOCALIZATION_PREFIXES", [`${S}.${c.BEHAVIOR_ID}`]), i(c, "events", {}), i(c, "EFFECT_SOURCE_CHOICES", [
  "ACTOR",
  "ENVIRONMENT",
  "PLACEABLE_OBJECT"
]);
let O = c;
foundry.data.regionBehaviors;
const { SetField: v, StringField: b, DocumentUUIDField: R } = foundry.data.fields;
foundry.CONST.REGION_EVENTS;
const n = class n extends O {
  /** @override */
  static defineSchema() {
    const e = {
      itemOpt: this._createOptionsField(this.ITEM_OPTION_CHOICES, `${this.LOCALIZATION_PREFIXES}.FIELDS.itemOpt`, !0, 0),
      effectSource: this._createOptionsField(this.EFFECT_SOURCE_CHOICES, `${this.LOCALIZATION_PREFIXES}.FIELDS.effectSource`, !0, 0),
      events: this._createEventsField(),
      item: new R(
        {
          type: "Item",
          validate: this.validateItem
        }
      )
    };
    return console.log(`Schema Defined for ${n.LOCALIZATION_PREFIXES}:`, e), e;
  }
  /**
   * Validates the item given against a criteria.
   * @param {uuid} ItemUuid 
   * @returns {boolean} True if item is valid.
   */
  static validateItem(e) {
    return console.log("Item Validator: ", e), !0;
  }
  /* ---------------------------------------- */
  /** @override */
  async _handleRegionEvent(e) {
    if (console.debug(`${LOCALIZATION_PREFIXES} _handleRegionEvent`, e), !this.uuid) return;
    const t = await fromUuid(this.uuid);
    if (!(t instanceof Macro)) {
      console.error(`${this.uuid} does not exist`);
      return;
    }
    await t.execute({ scene: this.scene, region: this.region, behavior: this.behavior, event: e, actor: null, token: null });
  }
};
i(n, "BEHAVIOR_ID", "ITEM"), /** @override */
i(n, "LOCALIZATION_PREFIXES", [`${S}.${n.BEHAVIOR_ID}`]), i(n, "events", {}), i(n, "ITEM_OPTION_CHOICES", [
  "USE_ITEM",
  "USE_ITEM_COPY"
]);
let u = n;
console.log("Initilizing module: ", E);
Hooks.once("init", () => {
  var o;
  console.log("Init code for ", E), console.log("init this", void 0), console.log("config", CONFIG), console.log("check object to assign", (o = CONFIG == null ? void 0 : CONFIG.RegionBehavior) == null ? void 0 : o.dataModels), Object.assign(CONFIG.RegionBehavior.dataModels, {
    [`${E}.DreRegionBehaviorItemType`]: u
  });
});
Hooks.once("ready", () => {
  var e;
  console.log("Ready code for the module ", E);
  const o = new F();
  console.log("check object to assign", (e = CONFIG == null ? void 0 : CONFIG.RegionBehavior) == null ? void 0 : e.dataModels), o.render(!0);
});
Hooks.on("renderRegionBehaviorConfig", (o, e, t) => {
  o.document.type.includes(`${E}.DreRegionBehavior`) && console.log("DRE region behavior config rendered!", o, e, t);
});
//# sourceMappingURL=init.js.map
