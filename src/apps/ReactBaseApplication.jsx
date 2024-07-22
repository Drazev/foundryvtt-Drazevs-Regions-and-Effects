import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '../styles/index.css'

const {ApplicationV2} = foundry.applications.api;

export default class ReactBaseApplication extends ApplicationV2 {
    static TARGET_ELEMENT_IDENTIFIER = '.window-content';
    
    /**
     * 
     * @override
     * @param {*} context 
     * @param {RenderOptions} options
     * @returns {Promise<any>} The HTML returned to be processed by _replaceHTML()
     */
    async _renderHTML(context,options) {
      console.log("_renderHTML",context,options,this);
        let targetElement = this.element.querySelector(ReactBaseApplication.TARGET_ELEMENT_IDENTIFIER);
        if(!targetElement) {
          console.warn(`React cannot locate identifier ${ReactBaseApplication.TARGET_ELEMENT_IDENTIFIER}. Fallback will replace entire window element.`);
          targetElement = this.element;
        }
        return ReactDOM.createRoot(targetElement).render(
              <App />
          )
    }

    /**
     * Method should do the necessary work replace old elements and render new elements
     * in the DOM. However, since we are using React this is done automatically. 
     * 
     * We want this function to do nothing!
     * 
     * @param {*} element Not used
     * @param {*} html Not Used
     * @returns {void}
     */
    async _replaceHTML(element,html) {
      return;      
    }
}


