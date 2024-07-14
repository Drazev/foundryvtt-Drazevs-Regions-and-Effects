var r = Object.defineProperty;
var l = (a, t, e) => t in a ? r(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var s = (a, t, e) => l(a, typeof t != "symbol" ? t + "" : t, e);
import { b as c } from "./constants-VtpJoDW0.js";
const { ApplicationV2: d, HandlebarsApplicationMixin: u } = foundry.applications.api, n = class n extends u(d) {
  /**
   * Here we set some data for our application. 
   * While you can do them individually, if you want to pass it for rendering it will be easier
   * to do it in a single object so you can use the elipsis to merge the data with the existing context during rendering
   */
  constructor() {
    super(), this.data = {
      title: "My title",
      text: "my text is here!",
      inputBoxText: ""
    };
  }
  /**
   * An event handler function. It's bound in DEFAULT_OPTIONS under the 'actions' field.
   * Foundry uses it as a static function but will bind the instance to this function as 'this' when called
   * @param {*} event 
   * @param {*} target 
   */
  static testAction(t, e) {
    console.log("Action Fired 'testAction', event: ", t, ", target: ", e);
  }
  updateText(t) {
    console.log("value", t.target.value), console.log("Action Fired 'updateText', event: ", t, ", target: ", t.target, ", value: ", t.target.value), console.log("class instance", this), this.data.inputBoxText = t.target.value, this.render();
  }
  /**
   * This lifecycle step gives us the opportunity to send data to the handlebars template to be rendered.
   * We can expand on the existing context to include our variables.
   * @param {*} partId 
   * @param {*} context 
   * @returns 
   */
  async _prepareContext(t, e) {
    const o = {
      ...e,
      ...this.data
    };
    return console.log("Preparing context", t, o), console.log("Parts:", n.PARTS), o;
  }
  /**
   * Here we setup listeners on elements that are not for click events. 
   * Click events should use the actions defined above.
   * In this example we need a change listener on a textbox.
   * @param {*} context 
   * @param {*} options 
   */
  async _onRender(t, e) {
    console.log("_onRender: context:", t, ", options: ", e, ", this: ", this);
    const o = this.element.querySelector(".js-testTextSelector");
    o == null || o.addEventListener("change", this.updateText.bind(this)), console.log("addedEventListener to", o);
  }
  /**
   * This is the form submit handler that we reference with our form optoins.
   * Application V2 will run this when the form is submitted instead of refreshing the entire page which is the default behavior for any other form element not controlled by Appve (the form added by the tag)
   * @param {*} event 
   * @param {*} form 
   * @param {*} formData 
   */
  static async handleSubmit(t, e, o) {
    console.log("Form Submit Handler Triggered: event: ", t, ", form: ", e, ", formData: ", o);
  }
};
//Instance of Foundryvtt Type [ApplicationConfiguration]{@link https://foundryvtt.com/api/v12/interfaces/foundry.applications.types.ApplicationConfiguration.html}
s(n, "DEFAULT_OPTIONS", {
  tag: "form",
  //The base tag of this element. It is default <div>. When switched to <form> Appv2 will setup listeners for the submit behavior. 
  form: {
    //Define  form behavior if tag=form, For this to work your handlebars file needs to contain form contents in a div, not a form or you will end up with a nested form. The listener will only be setup on the form tag created by Appv2
    handler: n.handleSubmit,
    closeOnSubmit: !0
  },
  actions: {
    //This field sends a map of keys : functions to be bound by listeners when the form is generated.
    testAction: n.testAction,
    submit: n.handleSubmit
  }
}), s(n, "PARTS", {
  form: {
    template: `${c}/TestApp.hbs`
  }
});
let i = n;
export {
  i as default
};
//# sourceMappingURL=TestApp.js.map
