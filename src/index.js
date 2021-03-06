/**
 * Build styles
 */
require("./index.css").toString();

/**
 * @typedef {object} ListData
 * @property {string} style - can be ordered or unordered
 * @property {Array} items - li elements
 */

/**
 * List Tool for the Editor.js 2.0
 */
const traverseThroughNodes = (items) =>
  filterListItems(items).map((item) =>
    item.nodeName === "LI"
      ? item.innerHTML
      : traverseThroughNodes([...item.childNodes])
  );
const filterListItems = (items) =>
  items.filter((item) => ["LI", "UL", "OL"].includes(item.nodeName));

const listTypes = ["ordered", "unordered"];
class List {
  /**
   * Allow to use native Enter behaviour
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon:
        '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
      title: "List",
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - tool constructor options
   * @param {ListData} params.data - previously saved data
   * @param {object} params.config - user config for Tool
   * @param {object} params.api - Editor.js API
   */
  constructor({ data, config, api }) {
    /**
     * HTML nodes
     *
     * @private
     */
    this._elements = {
      wrapper: null,
    };

    this.api = api;

    this.settings = [
      {
        name: "unordered",
        title: this.api.i18n.t("Unordered"),
        icon:
          '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
        default: false,
      },
      {
        name: "ordered",
        title: this.api.i18n.t("Ordered"),
        icon:
          '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"><path d="M5.819 4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0-4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0 9.357h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 0 1 0-2.137zM1.468 4.155V1.33c-.554.404-.926.606-1.118.606a.338.338 0 0 1-.244-.104A.327.327 0 0 1 0 1.59c0-.107.035-.184.105-.234.07-.05.192-.114.369-.192.264-.118.475-.243.633-.373.158-.13.298-.276.42-.438a3.94 3.94 0 0 1 .238-.298C1.802.019 1.872 0 1.975 0c.115 0 .208.042.277.127.07.085.105.202.105.351v3.556c0 .416-.15.624-.448.624a.421.421 0 0 1-.32-.127c-.08-.085-.121-.21-.121-.376zm-.283 6.664h1.572c.156 0 .275.03.358.091a.294.294 0 0 1 .123.25.323.323 0 0 1-.098.238c-.065.065-.164.097-.296.097H.629a.494.494 0 0 1-.353-.119.372.372 0 0 1-.126-.28c0-.068.027-.16.081-.273a.977.977 0 0 1 .178-.268c.267-.264.507-.49.722-.678.215-.188.368-.312.46-.371.165-.11.302-.222.412-.334.109-.112.192-.226.25-.344a.786.786 0 0 0 .085-.345.6.6 0 0 0-.341-.553.75.75 0 0 0-.345-.08c-.263 0-.47.11-.62.329-.02.029-.054.107-.101.235a.966.966 0 0 1-.16.295c-.059.069-.145.103-.26.103a.348.348 0 0 1-.25-.094.34.34 0 0 1-.099-.258c0-.132.031-.27.093-.413.063-.143.155-.273.279-.39.123-.116.28-.21.47-.282.189-.072.411-.107.666-.107.307 0 .569.045.786.137a1.182 1.182 0 0 1 .618.623 1.18 1.18 0 0 1-.096 1.083 2.03 2.03 0 0 1-.378.457c-.128.11-.344.282-.646.517-.302.235-.509.417-.621.547a1.637 1.637 0 0 0-.148.187z"/></svg>',
        default: true,
      },
      {
        name: "removeTab",
        title: this.api.i18n.t("Remove Tab"),
        icon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>',
        default: false,
      },
      {
        name: "addTab",
        title: this.api.i18n.t("Add Tab"),
        icon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>',
        default: false,
      },
    ];

    /**
     * Tool's data
     *
     * @type {ListData}
     */
    this._data = {
      style: this.settings.find((tune) => tune.default === true).name,
      items: [],
    };

    this.data = data;
    this.selectedItem = null;
  }

  /**
   * Returns list tag with items
   *
   * @returns {Element}
   * @public
   */
  render() {
    const style =
      this._data.style === "ordered"
        ? this.CSS.wrapperOrdered
        : this.CSS.wrapperUnordered;

    this._elements.wrapper = this._make(
      "ul",
      [this.CSS.baseBlock, this.CSS.wrapper, style],
      {
        contentEditable: true,
      }
    );

    // fill with data
    if (this._data.items.length) {
      this._elements.wrapper = this.createAllElm(this._data.items);
    } else {
      this._elements.wrapper.appendChild(
        this._make("li", this.CSS.item, { tabIndex: "0" })
      );
    }

    // detect keydown on the last item to escape List
    this._elements.wrapper.addEventListener(
      "keydown",
      (event) => {
        const [ENTER, BACKSPACE, TAB] = [13, 8, 9]; // key codes

        switch (event.keyCode) {
          case ENTER:
            this.getOutofList(event);
            break;
          case BACKSPACE:
            this.backspace(event);
            break;
          case TAB:
            if (event.shiftKey) {
              if (this.currentItem.parentNode.parentNode.tagName === "UL") {
                this.removeTab(event);
              }
            } else {
              this.addTab(event);
            }
            break;
        }
      },
      false
    );
    this._elements.wrapper.addEventListener("click", (event) => {
      this.selectedItem = window.getSelection().anchorNode;
      this.selectedItem =
        this.selectedItem.parentElement.nodeName === "LI"
          ? this.selectedItem.parentElement
          : this.selectedItem.parentElement.parentElement;
    });
    return this._elements.wrapper;
  }

  /**
   * @returns {ListData}
   * @public
   */
  save() {
    return this.data;
  }

  /**
   * Allow List Tool to be converted to/from other block
   *
   * @returns {{export: Function, import: Function}}
   */
  static get conversionConfig() {
    return {
      /**
       * To create exported string from list, concatenate items by dot-symbol.
       *
       * @param {ListData} data - list data to create a string from thats
       * @returns {string}
       */
      export: (data) => {
        return data.items.join(". ");
      },
      /**
       * To create a list from other block's string, just put it at the first item
       *
       * @param {string} string - string to create list tool data from that
       * @returns {ListData}
       */
      import: (string) => {
        return {
          items: [string],
          style: "unordered",
        };
      },
    };
  }

  /**
   * Sanitizer rules
   *
   * @returns {object}
   */
  static get sanitize() {
    return {
      style: {},
      items: {
        br: true,
      },
    };
  }

  /**
   * Settings
   *
   * @public
   * @returns {Element}
   */
  renderSettings() {
    const wrapper = this._make("div", [this.CSS.settingsWrapper], {});

    this.settings.forEach((item) => {
      const itemEl = this._make("div", this.CSS.settingsButton, {
        innerHTML: item.icon,
      });

      itemEl.addEventListener("click", () => {
        this.toggleTune(item.name);

        // clear other buttons
        const buttons = itemEl.parentNode.querySelectorAll(
          "." + this.CSS.settingsButton
        );

        Array.from(buttons).forEach((button) =>
          button.classList.remove(this.CSS.settingsButtonActive)
        );

        // mark active
        if (listTypes.includes(item.name)) {
          itemEl.classList.toggle(this.CSS.settingsButtonActive);
        }
      });

      this.api.tooltip.onHover(itemEl, item.title, {
        placement: "top",
        hidingDelay: 500,
      });

      if (this._data.style === item.name) {
        itemEl.classList.add(this.CSS.settingsButtonActive);
      }
      this.setEndOfContentEditable(this.selectedItem); // Set cursor on selectedItem
      wrapper.appendChild(itemEl);
    });

    return wrapper;
  }

  /**
   * On paste callback that is fired from Editor
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(event) {
    const list = event.detail.data;

    this.data = this.pasteHandler(list);
  }

  /**
   * List Tool on paste configuration
   *
   * @public
   */
  static get pasteConfig() {
    return {
      tags: ["OL", "UL", "LI"],
    };
  }

  /**
   * Toggles List style
   *
   * @param {string} style - 'ordered'|'unordered'
   */
  toggleTune(style) {
    if (listTypes.includes(style)) {
      this._elements.wrapper.classList.toggle(
        this.CSS.wrapperOrdered,
        style === "ordered"
      );
      this._elements.wrapper.classList.toggle(
        this.CSS.wrapperUnordered,
        style === "unordered"
      );
      const items = this._elements.wrapper.querySelectorAll("ul");

      for (let i = 0; i < items.length; i++) {
        items[i].classList.toggle(this.CSS.wrapperOrdered, style === "ordered");
        items[i].classList.toggle(
          this.CSS.wrapperUnordered,
          style === "unordered"
        );
      }
      this._data.style = style;
    } else if (style === "addTab") {
      this.setEndOfContentEditable(this.selectedItem);
      this.addTab();
    } else if (style === "removeTab") {
      if (this.selectedItem.parentNode.parentNode.tagName === "UL") {
        this.setEndOfContentEditable(this.selectedItem);
        this.removeTab();
      }
    }
  }

  /**
   * Styles
   *
   * @private
   */
  get CSS() {
    return {
      baseBlock: this.api.styles.block,
      wrapper: "cdx-list",
      wrapperOrdered: "cdx-list--ordered",
      wrapperUnordered: "cdx-list--unordered",
      item: "cdx-list__item",
      settingsWrapper: "cdx-list-settings",
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
    };
  }

  /**
   * List data setter
   *
   * @param {ListData} listData
   */
  set data(listData) {
    if (!listData) {
      listData = {};
    }

    this._data.style =
      listData.style ||
      this.settings.find((tune) => tune.default === true).name;
    this._data.items = listData.items || [];

    const oldView = this._elements.wrapper;

    if (oldView) {
      oldView.parentNode.replaceChild(this.render(), oldView);
    }
  }

  /**
   * Return List data
   *
   * @returns {ListData}
   */
  get data() {
    this._data.items = [];

    const itemsList = this._elements.wrapper.childNodes;

    function getData(items) {
      let dataEach = [];
      for (let i = 0; i < items.length; i++) {
        const value = items[i].innerHTML.replace("<br>", " ").trim();

        if (items[i].tagName == "UL") {
          dataEach.push(getData(items[i].childNodes));
        } else if (value) {
          dataEach.push(items[i].innerHTML);
        }
      }

      return dataEach;
    }

    this._data.items = getData(itemsList);

    return this._data;
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS classname(s)
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  createAllElm(lidata) {
    const style =
      this._data.style === "ordered"
        ? this.CSS.wrapperOrdered
        : this.CSS.wrapperUnordered;
    const ulElem = this._make(
      "ul",
      [this.CSS.baseBlock, this.CSS.wrapper, style],
      {
        contentEditable: true,
      }
    );

    lidata.forEach((item) => {
      if (typeof item == "object") {
        ulElem.appendChild(this.createAllElm(item));
      } else {
        ulElem.appendChild(
          this._make("li", this.CSS.item, {
            innerHTML: item,
            tabIndex: "0",
          })
        );
      }
    });

    return ulElem;
  }

  /**
   * Returns current List item by the caret position
   *
   * @returns {Element}
   */
  get currentItem() {
    let currentNode = window.getSelection().anchorNode;

    if (currentNode.nodeType !== Node.ELEMENT_NODE) {
      currentNode = currentNode.parentNode;
    }
    return currentNode.closest(`.${this.CSS.item}`);
  }
  get unorderedList() {
    const style =
      this._data.style === "ordered"
        ? this.CSS.wrapperOrdered
        : this.CSS.wrapperUnordered;
    let ol = this._make("ul", [this.CSS.baseBlock, this.CSS.wrapper, style], {
      contentEditable: true,
    });
    return ol;
  }
  /**
   * Get out from List Tool
   * by Enter on the empty last item
   *
   * @param {KeyboardEvent} event
   */
  getOutofList(event) {
    const items = this._elements.wrapper.querySelectorAll("." + this.CSS.item);

    /**
     * Save the last one.
     */
    if (items.length < 2) {
      return;
    }

    const lastItem = items[items.length - 1];
    const currentItem = this.currentItem;

    /** Prevent Default li generation if item is empty */
    if (currentItem === lastItem && !lastItem.textContent.trim().length) {
      /** Insert New Block and set caret */
      currentItem.parentElement.removeChild(currentItem);
      this.api.blocks.insert(undefined, undefined, undefined, undefined, true);
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /**
   * Handle backspace
   *
   * @param {KeyboardEvent} event
   */
  backspace(event) {
    const items = this._elements.wrapper.querySelectorAll("." + this.CSS.item),
      firstItem = items[0];

    if (!firstItem) {
      return;
    }

    /**
     * Save the last one.
     */
    if (items.length < 2 && !firstItem.innerHTML.replace("<br>", " ").trim()) {
      event.preventDefault();
    }
  }

  /**
   * Indent the List Items
   *
   * @param {KeyboardEvent} event
   */
  addTab(event) {
    let ol = this.unorderedList;
    const currentSelectedItem = this.currentItem;
    if (this.currentItem == currentSelectedItem.parentNode.childNodes[0]) {
      return;
    } else if (
      !this.currentItem.nextSibling &&
      this.currentItem.previousSibling.tagName !== "UL"
    ) {
      this.currentItem.parentNode.appendChild(ol);
      ol.appendChild(this.currentItem);
    } else if (
      !this.currentItem.nextSibling &&
      this.currentItem.previousSibling.tagName == "UL"
    ) {
      currentSelectedItem.previousSibling.appendChild(currentSelectedItem);
    } else if (
      this.currentItem.nextSibling != null &&
      this.currentItem.nextSibling.tagName === "LI" &&
      this.currentItem.previousSibling.tagName !== "UL"
    ) {
      this.currentItem.parentNode.insertBefore(
        ol,
        this.currentItem.nextSibling
      );
      ol.appendChild(this.currentItem);
    } else if (
      this.currentItem.nextSibling != null &&
      this.currentItem.nextSibling.tagName === "UL" &&
      this.currentItem.previousSibling.tagName === "UL"
    ) {
      const sibLingNodes = [
        currentSelectedItem,
        ...this.currentItem.nextSibling.childNodes,
      ];
      for (let i = 0; i < sibLingNodes.length; i++) {
        if (sibLingNodes[i] === currentSelectedItem) {
          currentSelectedItem.previousSibling.appendChild(sibLingNodes[i]);
        } else {
          currentSelectedItem.parentNode.appendChild(sibLingNodes[i]);
        }
      }
      currentSelectedItem.parentNode.nextSibling.remove();
    } else if (
      this.currentItem.nextSibling != null &&
      this.currentItem.previousSibling.tagName === "UL" &&
      this.currentItem.nextSibling.tagName === "LI"
    ) {
      currentSelectedItem.previousSibling.appendChild(currentSelectedItem);
    } else {
      this.currentItem.nextSibling.insertBefore(
        this.currentItem,
        this.currentItem.nextSibling.childNodes[0]
      );
    }
    currentSelectedItem.focus();
    currentSelectedItem.addEventListener(
      "focus",
      this.setEndOfContentEditable(currentSelectedItem),
      false
    );
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  removeTab(event) {
    const currentSelectedItem = this.currentItem;
    let firstItem = false;
    if (this.currentItem.nextSibling != null) {
      if (this.currentItem.parentNode.childNodes[0] === this.currentItem) {
        firstItem = true;
      }
      let ol = this.unorderedList;
      const selectedNodeIndex = [
        ...this.currentItem.parentNode.childNodes,
      ].indexOf(this.currentItem);
      const subList = [...this.currentItem.parentNode.childNodes].filter(
        (item, index) => index >= selectedNodeIndex
      );
      let listItem = null;
      for (let i = 0; i < subList.length; i++) {
        if (i === 0) {
          listItem = subList[i];
        } else {
          ol.append(subList[i]);
        }
      }
      this.currentItem.parentNode.parentNode.insertBefore(
        ol,
        currentSelectedItem.parentNode.nextSibling
      );
      this.currentItem.parentNode.parentNode.insertBefore(
        listItem,
        currentSelectedItem.parentNode.nextSibling
      );
      if (firstItem) {
        currentSelectedItem.previousSibling.remove();
        this.firstItem = false;
      }
    } else if (this.currentItem.parentNode.nextSibling !== null) {
      if (this.currentItem.parentNode.childNodes[0] === this.currentItem) {
        firstItem = true;
      }
      this.currentItem.parentNode.parentNode.insertBefore(
        currentSelectedItem,
        currentSelectedItem.parentNode.nextSibling
      );
      if (firstItem) {
        currentSelectedItem.previousSibling.remove();
        this.firstItem = false;
      }
    } else if (this.currentItem.parentNode.parentNode.tagName === "UL") {
      this.currentItem.parentNode.parentNode.appendChild(currentSelectedItem);
      currentSelectedItem.previousSibling.remove();
    } else {
      this.currentItem.parentNode.parentNode.appendChild(currentSelectedItem);
    }
    currentSelectedItem.focus();
    currentSelectedItem.addEventListener(
      "focus",
      this.setEndOfContentEditable(currentSelectedItem),
      false
    );
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  setEndOfContentEditable(contentEditableElement) {
    let range = null;
    let selection = null;
    if (document.createRange) {
      //Firefox, Chrome, Opera, Safari, IE 9+
      range = document.createRange(); //Create a range (a range is a like the selection but invisible)
      range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
      range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
      selection = window.getSelection(); //get the selection object (allows you to change selection)
      selection.removeAllRanges(); //remove any selections already made
      selection.addRange(range); //make the range you have just created the visible selection
    } else if (document.selection) {
      //IE 8 and lower
      range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
      range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
      range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
      range.select(); //Select the range (make it the visible selection
    }
  }
  /**
   * Select LI content by CMD+A
   *
   * @param {KeyboardEvent} event
   */
  selectItem(event) {
    event.preventDefault();

    const selection = window.getSelection(),
      currentNode = selection.anchorNode.parentNode,
      currentItem = currentNode.closest("." + this.CSS.item),
      range = new Range();

    range.selectNodeContents(currentItem);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Handle UL, OL and LI tags paste and returns List data
   *
   * @param {HTMLUListElement|HTMLOListElement|HTMLLIElement} element
   * @returns {ListData}
   */
  pasteHandler(element) {
    const { tagName: tag } = element;
    let style;
    switch (tag) {
      case "OL":
        style = "ordered";
        break;
      case "UL":
      case "LI":
        style = "unordered";
    }
    const data = {
      style,
      items: [],
    };
    if (tag === "LI") {
      data.items = [element.innerHTML];
    } else {
      const newItems = traverseThroughNodes([...element.childNodes]);
      data.items = newItems;
    }
    return data;
  }
}

module.exports = List;
