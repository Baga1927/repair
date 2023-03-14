(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
    function addTouchClass() {
        if (isMobile.any()) document.documentElement.classList.add("touch");
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    if (spollersBlock.classList.contains("_spoller-init")) {
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        spollerClose.classList.remove("_spoller-active");
                        _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                    }
                }));
            }));
        }
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Прокинувся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if ("error" !== this._dataValue) {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Йой, не заповнено атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Відкрив попап`);
                } else this.popupLogging(`Йой, такого попапу немає. Перевірте коректність введення. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрив попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && 0 === focusedIndex) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((null !== formRequiredItem.offsetParent || "SELECT" === formRequiredItem.tagName) && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if ("email" === formRequiredItem.dataset.required) {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if ("checkbox" === formRequiredItem.type && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    class SelectConstructor {
        constructor(props, data = null) {
            let defaultConfig = {
                init: true,
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.selectClasses = {
                classSelect: "select",
                classSelectBody: "select__body",
                classSelectTitle: "select__title",
                classSelectValue: "select__value",
                classSelectLabel: "select__label",
                classSelectInput: "select__input",
                classSelectText: "select__text",
                classSelectLink: "select__link",
                classSelectOptions: "select__options",
                classSelectOptionsScroll: "select__scroll",
                classSelectOption: "select__option",
                classSelectContent: "select__content",
                classSelectRow: "select__row",
                classSelectData: "select__asset",
                classSelectDisabled: "_select-disabled",
                classSelectTag: "_select-tag",
                classSelectOpen: "_select-open",
                classSelectActive: "_select-active",
                classSelectFocus: "_select-focus",
                classSelectMultiple: "_select-multiple",
                classSelectCheckBox: "_select-checkbox",
                classSelectOptionSelected: "_select-selected",
                classSelectPseudoLabel: "_select-pseudo-label"
            };
            this._this = this;
            if (this.config.init) {
                const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll("select");
                if (selectItems.length) {
                    this.selectsInit(selectItems);
                    this.setLogging(`Прокинувся, построїв селектов: (${selectItems.length})`);
                } else this.setLogging("Сплю, немає жодного select");
            }
        }
        getSelectClass(className) {
            return `.${className}`;
        }
        getSelectElement(selectItem, className) {
            return {
                originalSelect: selectItem.querySelector("select"),
                selectElement: selectItem.querySelector(this.getSelectClass(className))
            };
        }
        selectsInit(selectItems) {
            selectItems.forEach(((originalSelect, index) => {
                this.selectInit(originalSelect, index + 1);
            }));
            document.addEventListener("click", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusin", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusout", function(e) {
                this.selectsActions(e);
            }.bind(this));
        }
        selectInit(originalSelect, index) {
            const _this = this;
            let selectItem = document.createElement("div");
            selectItem.classList.add(this.selectClasses.classSelect);
            originalSelect.parentNode.insertBefore(selectItem, originalSelect);
            selectItem.appendChild(originalSelect);
            originalSelect.hidden = true;
            index ? originalSelect.dataset.id = index : null;
            if (this.getSelectPlaceholder(originalSelect)) {
                originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
                if (this.getSelectPlaceholder(originalSelect).label.show) {
                    const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
                    selectItemTitle.insertAdjacentHTML("afterbegin", `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
                }
            }
            selectItem.insertAdjacentHTML("beforeend", `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
            this.selectBuild(originalSelect);
            originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : "150";
            originalSelect.addEventListener("change", (function(e) {
                _this.selectChange(e);
            }));
        }
        selectBuild(originalSelect) {
            const selectItem = originalSelect.parentElement;
            selectItem.dataset.id = originalSelect.dataset.id;
            originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;
            originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
            originalSelect.hasAttribute("data-checkbox") && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
            this.setSelectTitleValue(selectItem, originalSelect);
            this.setOptions(selectItem, originalSelect);
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
            originalSelect.hasAttribute("data-open") ? this.selectAction(selectItem) : null;
            this.selectDisabled(selectItem, originalSelect);
        }
        selectsActions(e) {
            const targetElement = e.target;
            const targetType = e.type;
            if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                const selectItem = targetElement.closest(".select") ? targetElement.closest(".select") : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
                const originalSelect = this.getSelectElement(selectItem).originalSelect;
                if ("click" === targetType) {
                    if (!originalSelect.disabled) if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                        const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
                        const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
                        this.optionAction(selectItem, originalSelect, optionItem);
                    } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) this.selectAction(selectItem); else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
                        const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
                        this.optionAction(selectItem, originalSelect, optionItem);
                    }
                } else if ("focusin" === targetType || "focusout" === targetType) {
                    if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) "focusin" === targetType ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
                } else if ("keydown" === targetType && "Escape" === e.code) this.selectsСlose();
            } else this.selectsСlose();
        }
        selectsСlose(selectOneGroup) {
            const selectsGroup = selectOneGroup ? selectOneGroup : document;
            const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
            if (selectActiveItems.length) selectActiveItems.forEach((selectActiveItem => {
                this.selectСlose(selectActiveItem);
            }));
        }
        selectСlose(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            if (!selectOptions.classList.contains("_slide")) {
                selectItem.classList.remove(this.selectClasses.classSelectOpen);
                _slideUp(selectOptions, originalSelect.dataset.speed);
            }
        }
        selectAction(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            if (originalSelect.closest("[data-one-select]")) {
                const selectOneGroup = originalSelect.closest("[data-one-select]");
                this.selectsСlose(selectOneGroup);
            }
            if (!selectOptions.classList.contains("_slide")) {
                selectItem.classList.toggle(this.selectClasses.classSelectOpen);
                _slideToggle(selectOptions, originalSelect.dataset.speed);
            }
        }
        setSelectTitleValue(selectItem, originalSelect) {
            const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
            const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
            if (selectItemTitle) selectItemTitle.remove();
            selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
        }
        getSelectTitleValue(selectItem, originalSelect) {
            let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
            if (originalSelect.multiple && originalSelect.hasAttribute("data-tags")) {
                selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map((option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`)).join("");
                if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
                    document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
                    if (originalSelect.hasAttribute("data-search")) selectTitleValue = false;
                }
            }
            selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : "";
            let pseudoAttribute = "";
            let pseudoAttributeClass = "";
            if (originalSelect.hasAttribute("data-pseudo-label")) {
                pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заповніть атрибут"`;
                pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
            }
            this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
            if (originalSelect.hasAttribute("data-search")) return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`; else {
                const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : "";
                return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
            }
        }
        getSelectElementContent(selectOption) {
            const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : "";
            const selectOptionDataHTML = selectOptionData.indexOf("img") >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
            let selectOptionContentHTML = ``;
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : "";
            selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : "";
            selectOptionContentHTML += selectOption.textContent;
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            return selectOptionContentHTML;
        }
        getSelectPlaceholder(originalSelect) {
            const selectPlaceholder = Array.from(originalSelect.options).find((option => !option.value));
            if (selectPlaceholder) return {
                value: selectPlaceholder.textContent,
                show: selectPlaceholder.hasAttribute("data-show"),
                label: {
                    show: selectPlaceholder.hasAttribute("data-label"),
                    text: selectPlaceholder.dataset.label
                }
            };
        }
        getSelectedOptionsData(originalSelect, type) {
            let selectedOptions = [];
            if (originalSelect.multiple) selectedOptions = Array.from(originalSelect.options).filter((option => option.value)).filter((option => option.selected)); else selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
            return {
                elements: selectedOptions.map((option => option)),
                values: selectedOptions.filter((option => option.value)).map((option => option.value)),
                html: selectedOptions.map((option => this.getSelectElementContent(option)))
            };
        }
        getOptions(originalSelect) {
            let selectOptionsScroll = originalSelect.hasAttribute("data-scroll") ? `data-simplebar` : "";
            let selectOptionsScrollHeight = originalSelect.dataset.scroll ? `style="max-height:${originalSelect.dataset.scroll}px"` : "";
            let selectOptions = Array.from(originalSelect.options);
            if (selectOptions.length > 0) {
                let selectOptionsHTML = ``;
                if (this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show || originalSelect.multiple) selectOptions = selectOptions.filter((option => option.value));
                selectOptionsHTML += selectOptionsScroll ? `<div ${selectOptionsScroll} ${selectOptionsScrollHeight} class="${this.selectClasses.classSelectOptionsScroll}">` : "";
                selectOptions.forEach((selectOption => {
                    selectOptionsHTML += this.getOption(selectOption, originalSelect);
                }));
                selectOptionsHTML += selectOptionsScroll ? `</div>` : "";
                return selectOptionsHTML;
            }
        }
        getOption(selectOption, originalSelect) {
            const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : "";
            const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute("data-show-selected") && !originalSelect.multiple ? `hidden` : ``;
            const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : "";
            const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
            const selectOptionLinkTarget = selectOption.hasAttribute("data-href-blank") ? `target="_blank"` : "";
            let selectOptionHTML = ``;
            selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
            selectOptionHTML += this.getSelectElementContent(selectOption);
            selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
            return selectOptionHTML;
        }
        setOptions(selectItem, originalSelect) {
            const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            selectItemOptions.innerHTML = this.getOptions(originalSelect);
        }
        optionAction(selectItem, originalSelect, optionItem) {
            if (originalSelect.multiple) {
                optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
                const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
                originalSelectSelectedItems.forEach((originalSelectSelectedItem => {
                    originalSelectSelectedItem.removeAttribute("selected");
                }));
                const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
                selectSelectedItems.forEach((selectSelectedItems => {
                    originalSelect.querySelector(`option[value="${selectSelectedItems.dataset.value}"]`).setAttribute("selected", "selected");
                }));
            } else {
                if (!originalSelect.hasAttribute("data-show-selected")) {
                    if (selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`)) selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`).hidden = false;
                    optionItem.hidden = true;
                }
                originalSelect.value = optionItem.hasAttribute("data-value") ? optionItem.dataset.value : optionItem.textContent;
                this.selectAction(selectItem);
            }
            this.setSelectTitleValue(selectItem, originalSelect);
            this.setSelectChange(originalSelect);
        }
        selectChange(e) {
            const originalSelect = e.target;
            this.selectBuild(originalSelect);
            this.setSelectChange(originalSelect);
        }
        setSelectChange(originalSelect) {
            if (originalSelect.hasAttribute("data-validate")) formValidate.validateInput(originalSelect);
            if (originalSelect.hasAttribute("data-submit") && originalSelect.value) {
                let tempButton = document.createElement("button");
                tempButton.type = "submit";
                originalSelect.closest("form").append(tempButton);
                tempButton.click();
                tempButton.remove();
            }
            const selectItem = originalSelect.parentElement;
            this.selectCallback(selectItem, originalSelect);
        }
        selectDisabled(selectItem, originalSelect) {
            if (originalSelect.disabled) {
                selectItem.classList.add(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
            } else {
                selectItem.classList.remove(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
            }
        }
        searchActions(selectItem) {
            this.getSelectElement(selectItem).originalSelect;
            const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption}`);
            const _this = this;
            selectInput.addEventListener("input", (function() {
                selectOptionsItems.forEach((selectOptionsItem => {
                    if (selectOptionsItem.textContent.toUpperCase().includes(selectInput.value.toUpperCase())) selectOptionsItem.hidden = false; else selectOptionsItem.hidden = true;
                }));
                true === selectOptions.hidden ? _this.selectAction(selectItem) : null;
            }));
        }
        selectCallback(selectItem, originalSelect) {
            document.dispatchEvent(new CustomEvent("selectCallback", {
                detail: {
                    select: originalSelect
                }
            }));
        }
        setLogging(message) {
            this.config.logging ? functions_FLS(`[select]: ${message}`) : null;
        }
    }
    modules_flsModules.select = new SelectConstructor({});
    let addWindowScrollEvent = false;
    function headerScroll() {
        addWindowScrollEvent = true;
        const header = document.querySelector("header.header");
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        let scrollDirection = 0;
        let timer;
        document.addEventListener("windowScroll", (function(e) {
            const scrollTop = window.scrollY;
            clearTimeout(timer);
            if (scrollTop >= startPoint) {
                !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
                if (headerShow) {
                    if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    timer = setTimeout((() => {
                        !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    }), headerShowTimer);
                }
            } else {
                header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
                if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
            }
            scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
        }));
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    !function(t, e) {
        "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define([ "exports" ], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).noUiSlider = {});
    }(void 0, (function(ot) {
        "use strict";
        function n(t) {
            return "object" == typeof t && "function" == typeof t.to;
        }
        function st(t) {
            t.parentElement.removeChild(t);
        }
        function at(t) {
            return null != t;
        }
        function lt(t) {
            t.preventDefault();
        }
        function i(t) {
            return "number" == typeof t && !isNaN(t) && isFinite(t);
        }
        function ut(t, e, r) {
            0 < r && (ft(t, e), setTimeout((function() {
                dt(t, e);
            }), r));
        }
        function ct(t) {
            return Math.max(Math.min(t, 100), 0);
        }
        function pt(t) {
            return Array.isArray(t) ? t : [ t ];
        }
        function e(t) {
            t = (t = String(t)).split(".");
            return 1 < t.length ? t[1].length : 0;
        }
        function ft(t, e) {
            t.classList && !/\s/.test(e) ? t.classList.add(e) : t.className += " " + e;
        }
        function dt(t, e) {
            t.classList && !/\s/.test(e) ? t.classList.remove(e) : t.className = t.className.replace(new RegExp("(^|\\b)" + e.split(" ").join("|") + "(\\b|$)", "gi"), " ");
        }
        function ht(t) {
            var e = void 0 !== window.pageXOffset, r = "CSS1Compat" === (t.compatMode || "");
            return {
                x: e ? window.pageXOffset : (r ? t.documentElement : t.body).scrollLeft,
                y: e ? window.pageYOffset : (r ? t.documentElement : t.body).scrollTop
            };
        }
        function s(t, e) {
            return 100 / (e - t);
        }
        function a(t, e, r) {
            return 100 * e / (t[r + 1] - t[r]);
        }
        function l(t, e) {
            for (var r = 1; t >= e[r]; ) r += 1;
            return r;
        }
        function r(t, e, r) {
            if (r >= t.slice(-1)[0]) return 100;
            var n = l(r, t), i = t[n - 1], o = t[n];
            t = e[n - 1], n = e[n];
            return t + (r, a(o = [ i, o ], o[0] < 0 ? r + Math.abs(o[0]) : r - o[0], 0) / s(t, n));
        }
        function o(t, e, r, n) {
            if (100 === n) return n;
            var i = l(n, t), o = t[i - 1], s = t[i];
            return r ? (s - o) / 2 < n - o ? s : o : e[i - 1] ? t[i - 1] + (t = n - t[i - 1], 
            i = e[i - 1], Math.round(t / i) * i) : n;
        }
        ot.PipsMode = void 0, (H = ot.PipsMode || (ot.PipsMode = {})).Range = "range", H.Steps = "steps", 
        H.Positions = "positions", H.Count = "count", H.Values = "values", ot.PipsType = void 0, 
        (H = ot.PipsType || (ot.PipsType = {}))[H.None = -1] = "None", H[H.NoValue = 0] = "NoValue", 
        H[H.LargeValue = 1] = "LargeValue", H[H.SmallValue = 2] = "SmallValue";
        var u = (t.prototype.getDistance = function(t) {
            for (var e = [], r = 0; r < this.xNumSteps.length - 1; r++) e[r] = a(this.xVal, t, r);
            return e;
        }, t.prototype.getAbsoluteDistance = function(t, e, r) {
            var n = 0;
            if (t < this.xPct[this.xPct.length - 1]) for (;t > this.xPct[n + 1]; ) n++; else t === this.xPct[this.xPct.length - 1] && (n = this.xPct.length - 2);
            r || t !== this.xPct[n + 1] || n++;
            for (var i, o = 1, s = (e = null === e ? [] : e)[n], a = 0, l = 0, u = 0, c = r ? (t - this.xPct[n]) / (this.xPct[n + 1] - this.xPct[n]) : (this.xPct[n + 1] - t) / (this.xPct[n + 1] - this.xPct[n]); 0 < s; ) i = this.xPct[n + 1 + u] - this.xPct[n + u], 
            100 < e[n + u] * o + 100 - 100 * c ? (a = i * c, o = (s - 100 * c) / e[n + u], c = 1) : (a = e[n + u] * i / 100 * o, 
            o = 0), r ? (l -= a, 1 <= this.xPct.length + u && u--) : (l += a, 1 <= this.xPct.length - u && u++), 
            s = e[n + u] * o;
            return t + l;
        }, t.prototype.toStepping = function(t) {
            return t = r(this.xVal, this.xPct, t);
        }, t.prototype.fromStepping = function(t) {
            return function(t, e, r) {
                if (100 <= r) return t.slice(-1)[0];
                var n = l(r, e), i = t[n - 1], o = t[n];
                t = e[n - 1], n = e[n];
                return (r - t) * s(t, n) * ((o = [ i, o ])[1] - o[0]) / 100 + o[0];
            }(this.xVal, this.xPct, t);
        }, t.prototype.getStep = function(t) {
            return t = o(this.xPct, this.xSteps, this.snap, t);
        }, t.prototype.getDefaultStep = function(t, e, r) {
            var n = l(t, this.xPct);
            return (100 === t || e && t === this.xPct[n - 1]) && (n = Math.max(n - 1, 1)), (this.xVal[n] - this.xVal[n - 1]) / r;
        }, t.prototype.getNearbySteps = function(t) {
            t = l(t, this.xPct);
            return {
                stepBefore: {
                    startValue: this.xVal[t - 2],
                    step: this.xNumSteps[t - 2],
                    highestStep: this.xHighestCompleteStep[t - 2]
                },
                thisStep: {
                    startValue: this.xVal[t - 1],
                    step: this.xNumSteps[t - 1],
                    highestStep: this.xHighestCompleteStep[t - 1]
                },
                stepAfter: {
                    startValue: this.xVal[t],
                    step: this.xNumSteps[t],
                    highestStep: this.xHighestCompleteStep[t]
                }
            };
        }, t.prototype.countStepDecimals = function() {
            var t = this.xNumSteps.map(e);
            return Math.max.apply(null, t);
        }, t.prototype.hasNoSize = function() {
            return this.xVal[0] === this.xVal[this.xVal.length - 1];
        }, t.prototype.convert = function(t) {
            return this.getStep(this.toStepping(t));
        }, t.prototype.handleEntryPoint = function(t, e) {
            t = "min" === t ? 0 : "max" === t ? 100 : parseFloat(t);
            if (!i(t) || !i(e[0])) throw new Error("noUiSlider: 'range' value isn't numeric.");
            this.xPct.push(t), this.xVal.push(e[0]);
            e = Number(e[1]);
            t ? this.xSteps.push(!isNaN(e) && e) : isNaN(e) || (this.xSteps[0] = e), this.xHighestCompleteStep.push(0);
        }, t.prototype.handleStepPoint = function(t, e) {
            e && (this.xVal[t] !== this.xVal[t + 1] ? (this.xSteps[t] = a([ this.xVal[t], this.xVal[t + 1] ], e, 0) / s(this.xPct[t], this.xPct[t + 1]), 
            e = (this.xVal[t + 1] - this.xVal[t]) / this.xNumSteps[t], e = Math.ceil(Number(e.toFixed(3)) - 1), 
            e = this.xVal[t] + this.xNumSteps[t] * e, this.xHighestCompleteStep[t] = e) : this.xSteps[t] = this.xHighestCompleteStep[t] = this.xVal[t]);
        }, t);
        function t(e, t, r) {
            var n;
            this.xPct = [], this.xVal = [], this.xSteps = [], this.xNumSteps = [], this.xHighestCompleteStep = [], 
            this.xSteps = [ r || !1 ], this.xNumSteps = [ !1 ], this.snap = t;
            var i = [];
            for (Object.keys(e).forEach((function(t) {
                i.push([ pt(e[t]), t ]);
            })), i.sort((function(t, e) {
                return t[0][0] - e[0][0];
            })), n = 0; n < i.length; n++) this.handleEntryPoint(i[n][1], i[n][0]);
            for (this.xNumSteps = this.xSteps.slice(0), n = 0; n < this.xNumSteps.length; n++) this.handleStepPoint(n, this.xNumSteps[n]);
        }
        var c = {
            to: function(t) {
                return void 0 === t ? "" : t.toFixed(2);
            },
            from: Number
        }, p = {
            target: "target",
            base: "base",
            origin: "origin",
            handle: "handle",
            handleLower: "handle-lower",
            handleUpper: "handle-upper",
            touchArea: "touch-area",
            horizontal: "horizontal",
            vertical: "vertical",
            background: "background",
            connect: "connect",
            connects: "connects",
            ltr: "ltr",
            rtl: "rtl",
            textDirectionLtr: "txt-dir-ltr",
            textDirectionRtl: "txt-dir-rtl",
            draggable: "draggable",
            drag: "state-drag",
            tap: "state-tap",
            active: "active",
            tooltip: "tooltip",
            pips: "pips",
            pipsHorizontal: "pips-horizontal",
            pipsVertical: "pips-vertical",
            marker: "marker",
            markerHorizontal: "marker-horizontal",
            markerVertical: "marker-vertical",
            markerNormal: "marker-normal",
            markerLarge: "marker-large",
            markerSub: "marker-sub",
            value: "value",
            valueHorizontal: "value-horizontal",
            valueVertical: "value-vertical",
            valueNormal: "value-normal",
            valueLarge: "value-large",
            valueSub: "value-sub"
        }, mt = {
            tooltips: ".__tooltips",
            aria: ".__aria"
        };
        function f(t, e) {
            if (!i(e)) throw new Error("noUiSlider: 'step' is not numeric.");
            t.singleStep = e;
        }
        function d(t, e) {
            if (!i(e)) throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.");
            t.keyboardPageMultiplier = e;
        }
        function h(t, e) {
            if (!i(e)) throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");
            t.keyboardMultiplier = e;
        }
        function m(t, e) {
            if (!i(e)) throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");
            t.keyboardDefaultStep = e;
        }
        function g(t, e) {
            if ("object" != typeof e || Array.isArray(e)) throw new Error("noUiSlider: 'range' is not an object.");
            if (void 0 === e.min || void 0 === e.max) throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
            t.spectrum = new u(e, t.snap || !1, t.singleStep);
        }
        function v(t, e) {
            if (e = pt(e), !Array.isArray(e) || !e.length) throw new Error("noUiSlider: 'start' option is incorrect.");
            t.handles = e.length, t.start = e;
        }
        function b(t, e) {
            if ("boolean" != typeof e) throw new Error("noUiSlider: 'snap' option must be a boolean.");
            t.snap = e;
        }
        function S(t, e) {
            if ("boolean" != typeof e) throw new Error("noUiSlider: 'animate' option must be a boolean.");
            t.animate = e;
        }
        function x(t, e) {
            if ("number" != typeof e) throw new Error("noUiSlider: 'animationDuration' option must be a number.");
            t.animationDuration = e;
        }
        function y(t, e) {
            var r, n = [ !1 ];
            if ("lower" === e ? e = [ !0, !1 ] : "upper" === e && (e = [ !1, !0 ]), !0 === e || !1 === e) {
                for (r = 1; r < t.handles; r++) n.push(e);
                n.push(!1);
            } else {
                if (!Array.isArray(e) || !e.length || e.length !== t.handles + 1) throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
                n = e;
            }
            t.connect = n;
        }
        function w(t, e) {
            switch (e) {
              case "horizontal":
                t.ort = 0;
                break;

              case "vertical":
                t.ort = 1;
                break;

              default:
                throw new Error("noUiSlider: 'orientation' option is invalid.");
            }
        }
        function E(t, e) {
            if (!i(e)) throw new Error("noUiSlider: 'margin' option must be numeric.");
            0 !== e && (t.margin = t.spectrum.getDistance(e));
        }
        function P(t, e) {
            if (!i(e)) throw new Error("noUiSlider: 'limit' option must be numeric.");
            if (t.limit = t.spectrum.getDistance(e), !t.limit || t.handles < 2) throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.");
        }
        function C(t, e) {
            var r;
            if (!i(e) && !Array.isArray(e)) throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
            if (Array.isArray(e) && 2 !== e.length && !i(e[0]) && !i(e[1])) throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
            if (0 !== e) {
                for (Array.isArray(e) || (e = [ e, e ]), t.padding = [ t.spectrum.getDistance(e[0]), t.spectrum.getDistance(e[1]) ], 
                r = 0; r < t.spectrum.xNumSteps.length - 1; r++) if (t.padding[0][r] < 0 || t.padding[1][r] < 0) throw new Error("noUiSlider: 'padding' option must be a positive number(s).");
                var n = e[0] + e[1];
                e = t.spectrum.xVal[0];
                if (1 < n / (t.spectrum.xVal[t.spectrum.xVal.length - 1] - e)) throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.");
            }
        }
        function N(t, e) {
            switch (e) {
              case "ltr":
                t.dir = 0;
                break;

              case "rtl":
                t.dir = 1;
                break;

              default:
                throw new Error("noUiSlider: 'direction' option was not recognized.");
            }
        }
        function V(t, e) {
            if ("string" != typeof e) throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
            var r = 0 <= e.indexOf("tap"), n = 0 <= e.indexOf("drag"), i = 0 <= e.indexOf("fixed"), o = 0 <= e.indexOf("snap"), s = 0 <= e.indexOf("hover"), a = 0 <= e.indexOf("unconstrained"), l = 0 <= e.indexOf("drag-all");
            e = 0 <= e.indexOf("smooth-steps");
            if (i) {
                if (2 !== t.handles) throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");
                E(t, t.start[1] - t.start[0]);
            }
            if (a && (t.margin || t.limit)) throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");
            t.events = {
                tap: r || o,
                drag: n,
                dragAll: l,
                smoothSteps: e,
                fixed: i,
                snap: o,
                hover: s,
                unconstrained: a
            };
        }
        function A(t, e) {
            if (!1 !== e) if (!0 === e || n(e)) {
                t.tooltips = [];
                for (var r = 0; r < t.handles; r++) t.tooltips.push(e);
            } else {
                if ((e = pt(e)).length !== t.handles) throw new Error("noUiSlider: must pass a formatter for all handles.");
                e.forEach((function(t) {
                    if ("boolean" != typeof t && !n(t)) throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
                })), t.tooltips = e;
            }
        }
        function k(t, e) {
            if (e.length !== t.handles) throw new Error("noUiSlider: must pass a attributes for all handles.");
            t.handleAttributes = e;
        }
        function M(t, e) {
            if (!n(e)) throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");
            t.ariaFormat = e;
        }
        function U(t, e) {
            if (!n(r = e) || "function" != typeof r.from) throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
            var r;
            t.format = e;
        }
        function D(t, e) {
            if ("boolean" != typeof e) throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");
            t.keyboardSupport = e;
        }
        function O(t, e) {
            t.documentElement = e;
        }
        function L(t, e) {
            if ("string" != typeof e && !1 !== e) throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
            t.cssPrefix = e;
        }
        function T(e, r) {
            if ("object" != typeof r) throw new Error("noUiSlider: 'cssClasses' must be an object.");
            "string" == typeof e.cssPrefix ? (e.cssClasses = {}, Object.keys(r).forEach((function(t) {
                e.cssClasses[t] = e.cssPrefix + r[t];
            }))) : e.cssClasses = r;
        }
        function gt(e) {
            var r = {
                margin: null,
                limit: null,
                padding: null,
                animate: !0,
                animationDuration: 300,
                ariaFormat: c,
                format: c
            }, n = {
                step: {
                    r: !1,
                    t: f
                },
                keyboardPageMultiplier: {
                    r: !1,
                    t: d
                },
                keyboardMultiplier: {
                    r: !1,
                    t: h
                },
                keyboardDefaultStep: {
                    r: !1,
                    t: m
                },
                start: {
                    r: !0,
                    t: v
                },
                connect: {
                    r: !0,
                    t: y
                },
                direction: {
                    r: !0,
                    t: N
                },
                snap: {
                    r: !1,
                    t: b
                },
                animate: {
                    r: !1,
                    t: S
                },
                animationDuration: {
                    r: !1,
                    t: x
                },
                range: {
                    r: !0,
                    t: g
                },
                orientation: {
                    r: !1,
                    t: w
                },
                margin: {
                    r: !1,
                    t: E
                },
                limit: {
                    r: !1,
                    t: P
                },
                padding: {
                    r: !1,
                    t: C
                },
                behaviour: {
                    r: !0,
                    t: V
                },
                ariaFormat: {
                    r: !1,
                    t: M
                },
                format: {
                    r: !1,
                    t: U
                },
                tooltips: {
                    r: !1,
                    t: A
                },
                keyboardSupport: {
                    r: !0,
                    t: D
                },
                documentElement: {
                    r: !1,
                    t: O
                },
                cssPrefix: {
                    r: !0,
                    t: L
                },
                cssClasses: {
                    r: !0,
                    t: T
                },
                handleAttributes: {
                    r: !1,
                    t: k
                }
            }, i = {
                connect: !1,
                direction: "ltr",
                behaviour: "tap",
                orientation: "horizontal",
                keyboardSupport: !0,
                cssPrefix: "noUi-",
                cssClasses: p,
                keyboardPageMultiplier: 5,
                keyboardMultiplier: 1,
                keyboardDefaultStep: 10
            };
            e.format && !e.ariaFormat && (e.ariaFormat = e.format), Object.keys(n).forEach((function(t) {
                if (at(e[t]) || void 0 !== i[t]) n[t].t(r, (at(e[t]) ? e : i)[t]); else if (n[t].r) throw new Error("noUiSlider: '" + t + "' is required.");
            })), r.pips = e.pips;
            var t = document.createElement("div"), o = void 0 !== t.style.msTransform;
            t = void 0 !== t.style.transform;
            r.transformRule = t ? "transform" : o ? "msTransform" : "webkitTransform";
            return r.style = [ [ "left", "top" ], [ "right", "bottom" ] ][r.dir][r.ort], r;
        }
        function j(t, f, o) {
            var i, l, a, n, s, u, c = window.navigator.pointerEnabled ? {
                start: "pointerdown",
                move: "pointermove",
                end: "pointerup"
            } : window.navigator.msPointerEnabled ? {
                start: "MSPointerDown",
                move: "MSPointerMove",
                end: "MSPointerUp"
            } : {
                start: "mousedown touchstart",
                move: "mousemove touchmove",
                end: "mouseup touchend"
            }, p = window.CSS && CSS.supports && CSS.supports("touch-action", "none") && function() {
                var t = !1;
                try {
                    var e = Object.defineProperty({}, "passive", {
                        get: function() {
                            t = !0;
                        }
                    });
                    window.addEventListener("test", null, e);
                } catch (t) {}
                return t;
            }(), d = t, S = f.spectrum, h = [], m = [], g = [], v = 0, b = {}, x = t.ownerDocument, y = f.documentElement || x.documentElement, w = x.body, E = "rtl" === x.dir || 1 === f.ort ? 0 : 100;
            function P(t, e) {
                var r = x.createElement("div");
                return e && ft(r, e), t.appendChild(r), r;
            }
            function C(t, e) {
                t = P(t, f.cssClasses.origin);
                var r, n = P(t, f.cssClasses.handle);
                return P(n, f.cssClasses.touchArea), n.setAttribute("data-handle", String(e)), f.keyboardSupport && (n.setAttribute("tabindex", "0"), 
                n.addEventListener("keydown", (function(t) {
                    return function(t, e) {
                        if (V() || A(e)) return !1;
                        var r = [ "Left", "Right" ], n = [ "Down", "Up" ], i = [ "PageDown", "PageUp" ], o = [ "Home", "End" ];
                        f.dir && !f.ort ? r.reverse() : f.ort && !f.dir && (n.reverse(), i.reverse());
                        var s = t.key.replace("Arrow", ""), a = s === i[0], l = s === i[1];
                        i = s === n[0] || s === r[0] || a, n = s === n[1] || s === r[1] || l, r = s === o[0], 
                        o = s === o[1];
                        if (!(i || n || r || o)) return !0;
                        if (t.preventDefault(), n || i) {
                            var u = i ? 0 : 1;
                            u = nt(e)[u];
                            if (null === u) return !1;
                            !1 === u && (u = S.getDefaultStep(m[e], i, f.keyboardDefaultStep)), u *= l || a ? f.keyboardPageMultiplier : f.keyboardMultiplier, 
                            u = Math.max(u, 1e-7), u *= i ? -1 : 1, u = h[e] + u;
                        } else u = o ? f.spectrum.xVal[f.spectrum.xVal.length - 1] : f.spectrum.xVal[0];
                        return Q(e, S.toStepping(u), !0, !0), I("slide", e), I("update", e), I("change", e), 
                        I("set", e), !1;
                    }(t, e);
                }))), void 0 !== f.handleAttributes && (r = f.handleAttributes[e], Object.keys(r).forEach((function(t) {
                    n.setAttribute(t, r[t]);
                }))), n.setAttribute("role", "slider"), n.setAttribute("aria-orientation", f.ort ? "vertical" : "horizontal"), 
                0 === e ? ft(n, f.cssClasses.handleLower) : e === f.handles - 1 && ft(n, f.cssClasses.handleUpper), 
                t.handle = n, t;
            }
            function N(t, e) {
                return !!e && P(t, f.cssClasses.connect);
            }
            function e(t, e) {
                return !(!f.tooltips || !f.tooltips[e]) && P(t.firstChild, f.cssClasses.tooltip);
            }
            function V() {
                return d.hasAttribute("disabled");
            }
            function A(t) {
                return l[t].hasAttribute("disabled");
            }
            function k() {
                s && (Y("update" + mt.tooltips), s.forEach((function(t) {
                    t && st(t);
                })), s = null);
            }
            function M() {
                k(), s = l.map(e), X("update" + mt.tooltips, (function(t, e, r) {
                    s && f.tooltips && !1 !== s[e] && (t = t[e], !0 !== f.tooltips[e] && (t = f.tooltips[e].to(r[e])), 
                    s[e].innerHTML = t);
                }));
            }
            function U(t, e) {
                return t.map((function(t) {
                    return S.fromStepping(e ? S.getStep(t) : t);
                }));
            }
            function D(d) {
                var h = function(t) {
                    if (t.mode === ot.PipsMode.Range || t.mode === ot.PipsMode.Steps) return S.xVal;
                    if (t.mode !== ot.PipsMode.Count) return t.mode === ot.PipsMode.Positions ? U(t.values, t.stepped) : t.mode === ot.PipsMode.Values ? t.stepped ? t.values.map((function(t) {
                        return S.fromStepping(S.getStep(S.toStepping(t)));
                    })) : t.values : [];
                    if (t.values < 2) throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");
                    for (var e = t.values - 1, r = 100 / e, n = []; e--; ) n[e] = e * r;
                    return n.push(100), U(n, t.stepped);
                }(d), m = {}, t = S.xVal[0], e = S.xVal[S.xVal.length - 1], g = !1, v = !1, b = 0;
                return (h = h.slice().sort((function(t, e) {
                    return t - e;
                })).filter((function(t) {
                    return !this[t] && (this[t] = !0);
                }), {}))[0] !== t && (h.unshift(t), g = !0), h[h.length - 1] !== e && (h.push(e), 
                v = !0), h.forEach((function(t, e) {
                    t;
                    var r, n, i, o, s, a, l, u, c = h[e + 1], p = d.mode === ot.PipsMode.Steps, f = (f = p ? S.xNumSteps[e] : f) || c - t;
                    for (void 0 === c && (c = t), f = Math.max(f, 1e-7), r = t; r <= c; r = Number((r + f).toFixed(7))) {
                        for (a = (o = (i = S.toStepping(r)) - b) / (d.density || 1), u = o / (l = Math.round(a)), 
                        n = 1; n <= l; n += 1) m[(s = b + n * u).toFixed(5)] = [ S.fromStepping(s), 0 ];
                        a = -1 < h.indexOf(r) ? ot.PipsType.LargeValue : p ? ot.PipsType.SmallValue : ot.PipsType.NoValue, 
                        !e && g && r !== c && (a = 0), r === c && v || (m[i.toFixed(5)] = [ r, a ]), b = i;
                    }
                })), m;
            }
            function O(i, o, s) {
                var t, a = x.createElement("div"), n = ((t = {})[ot.PipsType.None] = "", t[ot.PipsType.NoValue] = f.cssClasses.valueNormal, 
                t[ot.PipsType.LargeValue] = f.cssClasses.valueLarge, t[ot.PipsType.SmallValue] = f.cssClasses.valueSub, 
                t), l = ((t = {})[ot.PipsType.None] = "", t[ot.PipsType.NoValue] = f.cssClasses.markerNormal, 
                t[ot.PipsType.LargeValue] = f.cssClasses.markerLarge, t[ot.PipsType.SmallValue] = f.cssClasses.markerSub, 
                t), u = [ f.cssClasses.valueHorizontal, f.cssClasses.valueVertical ], c = [ f.cssClasses.markerHorizontal, f.cssClasses.markerVertical ];
                function p(t, e) {
                    var r = e === f.cssClasses.value;
                    return e + " " + (r ? u : c)[f.ort] + " " + (r ? n : l)[t];
                }
                return ft(a, f.cssClasses.pips), ft(a, 0 === f.ort ? f.cssClasses.pipsHorizontal : f.cssClasses.pipsVertical), 
                Object.keys(i).forEach((function(t) {
                    var e, r, n;
                    r = i[e = t][0], n = i[t][1], (n = o ? o(r, n) : n) !== ot.PipsType.None && ((t = P(a, !1)).className = p(n, f.cssClasses.marker), 
                    t.style[f.style] = e + "%", n > ot.PipsType.NoValue && ((t = P(a, !1)).className = p(n, f.cssClasses.value), 
                    t.setAttribute("data-value", String(r)), t.style[f.style] = e + "%", t.innerHTML = String(s.to(r))));
                })), a;
            }
            function L() {
                n && (st(n), n = null);
            }
            function T(t) {
                L();
                var e = D(t), r = t.filter;
                t = t.format || {
                    to: function(t) {
                        return String(Math.round(t));
                    }
                };
                return n = d.appendChild(O(e, r, t));
            }
            function j() {
                var t = i.getBoundingClientRect(), e = "offset" + [ "Width", "Height" ][f.ort];
                return 0 === f.ort ? t.width || i[e] : t.height || i[e];
            }
            function z(n, i, o, s) {
                function e(t) {
                    var e, r = function(e, t, r) {
                        var n = 0 === e.type.indexOf("touch"), i = 0 === e.type.indexOf("mouse"), o = 0 === e.type.indexOf("pointer"), s = 0, a = 0;
                        0 === e.type.indexOf("MSPointer") && (o = !0);
                        if ("mousedown" === e.type && !e.buttons && !e.touches) return !1;
                        if (n) {
                            var l = function(t) {
                                t = t.target;
                                return t === r || r.contains(t) || e.composed && e.composedPath().shift() === r;
                            };
                            if ("touchstart" === e.type) {
                                n = Array.prototype.filter.call(e.touches, l);
                                if (1 < n.length) return !1;
                                s = n[0].pageX, a = n[0].pageY;
                            } else {
                                l = Array.prototype.find.call(e.changedTouches, l);
                                if (!l) return !1;
                                s = l.pageX, a = l.pageY;
                            }
                        }
                        t = t || ht(x), (i || o) && (s = e.clientX + t.x, a = e.clientY + t.y);
                        return e.pageOffset = t, e.points = [ s, a ], e.cursor = i || o, e;
                    }(t, s.pageOffset, s.target || i);
                    return !!r && !(V() && !s.doNotReject) && (e = d, t = f.cssClasses.tap, !((e.classList ? e.classList.contains(t) : new RegExp("\\b" + t + "\\b").test(e.className)) && !s.doNotReject) && !(n === c.start && void 0 !== r.buttons && 1 < r.buttons) && (!s.hover || !r.buttons) && (p || r.preventDefault(), 
                    r.calcPoint = r.points[f.ort], void o(r, s)));
                }
                var r = [];
                return n.split(" ").forEach((function(t) {
                    i.addEventListener(t, e, !!p && {
                        passive: !0
                    }), r.push([ t, e ]);
                })), r;
            }
            function H(t) {
                var e, r, n = ct(n = 100 * (t - (n = i, e = f.ort, r = n.getBoundingClientRect(), 
                n = (t = n.ownerDocument).documentElement, t = ht(t), /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) && (t.x = 0), 
                e ? r.top + t.y - n.clientTop : r.left + t.x - n.clientLeft)) / j());
                return f.dir ? 100 - n : n;
            }
            function F(t, e) {
                "mouseout" === t.type && "HTML" === t.target.nodeName && null === t.relatedTarget && _(t, e);
            }
            function R(t, e) {
                if (-1 === navigator.appVersion.indexOf("MSIE 9") && 0 === t.buttons && 0 !== e.buttonsProperty) return _(t, e);
                t = (f.dir ? -1 : 1) * (t.calcPoint - e.startCalcPoint);
                G(0 < t, 100 * t / e.baseSize, e.locations, e.handleNumbers, e.connect);
            }
            function _(t, e) {
                e.handle && (dt(e.handle, f.cssClasses.active), --v), e.listeners.forEach((function(t) {
                    y.removeEventListener(t[0], t[1]);
                })), 0 === v && (dt(d, f.cssClasses.drag), K(), t.cursor && (w.style.cursor = "", 
                w.removeEventListener("selectstart", lt))), f.events.smoothSteps && (e.handleNumbers.forEach((function(t) {
                    Q(t, m[t], !0, !0, !1, !1);
                })), e.handleNumbers.forEach((function(t) {
                    I("update", t);
                }))), e.handleNumbers.forEach((function(t) {
                    I("change", t), I("set", t), I("end", t);
                }));
            }
            function B(t, e) {
                var r, n, i, o;
                e.handleNumbers.some(A) || (1 === e.handleNumbers.length && (o = l[e.handleNumbers[0]].children[0], 
                v += 1, ft(o, f.cssClasses.active)), t.stopPropagation(), n = z(c.move, y, R, {
                    target: t.target,
                    handle: o,
                    connect: e.connect,
                    listeners: r = [],
                    startCalcPoint: t.calcPoint,
                    baseSize: j(),
                    pageOffset: t.pageOffset,
                    handleNumbers: e.handleNumbers,
                    buttonsProperty: t.buttons,
                    locations: m.slice()
                }), i = z(c.end, y, _, {
                    target: t.target,
                    handle: o,
                    listeners: r,
                    doNotReject: !0,
                    handleNumbers: e.handleNumbers
                }), o = z("mouseout", y, F, {
                    target: t.target,
                    handle: o,
                    listeners: r,
                    doNotReject: !0,
                    handleNumbers: e.handleNumbers
                }), r.push.apply(r, n.concat(i, o)), t.cursor && (w.style.cursor = getComputedStyle(t.target).cursor, 
                1 < l.length && ft(d, f.cssClasses.drag), w.addEventListener("selectstart", lt, !1)), 
                e.handleNumbers.forEach((function(t) {
                    I("start", t);
                })));
            }
            function r(t) {
                t.stopPropagation();
                var i, o, s, e = H(t.calcPoint), r = (i = e, s = !(o = 100), l.forEach((function(t, e) {
                    var r, n;
                    A(e) || (r = m[e], ((n = Math.abs(r - i)) < o || n <= o && r < i || 100 === n && 100 === o) && (s = e, 
                    o = n));
                })), s);
                !1 !== r && (f.events.snap || ut(d, f.cssClasses.tap, f.animationDuration), Q(r, e, !0, !0), 
                K(), I("slide", r, !0), I("update", r, !0), f.events.snap ? B(t, {
                    handleNumbers: [ r ]
                }) : (I("change", r, !0), I("set", r, !0)));
            }
            function q(t) {
                t = H(t.calcPoint), t = S.getStep(t);
                var e = S.fromStepping(t);
                Object.keys(b).forEach((function(t) {
                    "hover" === t.split(".")[0] && b[t].forEach((function(t) {
                        t.call(it, e);
                    }));
                }));
            }
            function X(t, e) {
                b[t] = b[t] || [], b[t].push(e), "update" === t.split(".")[0] && l.forEach((function(t, e) {
                    I("update", e);
                }));
            }
            function Y(t) {
                var n = t && t.split(".")[0], i = n ? t.substring(n.length) : t;
                Object.keys(b).forEach((function(t) {
                    var e = t.split(".")[0], r = t.substring(e.length);
                    n && n !== e || i && i !== r || ((e = r) !== mt.aria && e !== mt.tooltips || i === r) && delete b[t];
                }));
            }
            function I(r, n, i) {
                Object.keys(b).forEach((function(t) {
                    var e = t.split(".")[0];
                    r === e && b[t].forEach((function(t) {
                        t.call(it, h.map(f.format.to), n, h.slice(), i || !1, m.slice(), it);
                    }));
                }));
            }
            function W(t, e, r, n, i, o, s) {
                var a;
                return 1 < l.length && !f.events.unconstrained && (n && 0 < e && (a = S.getAbsoluteDistance(t[e - 1], f.margin, !1), 
                r = Math.max(r, a)), i && e < l.length - 1 && (a = S.getAbsoluteDistance(t[e + 1], f.margin, !0), 
                r = Math.min(r, a))), 1 < l.length && f.limit && (n && 0 < e && (a = S.getAbsoluteDistance(t[e - 1], f.limit, !1), 
                r = Math.min(r, a)), i && e < l.length - 1 && (a = S.getAbsoluteDistance(t[e + 1], f.limit, !0), 
                r = Math.max(r, a))), f.padding && (0 === e && (a = S.getAbsoluteDistance(0, f.padding[0], !1), 
                r = Math.max(r, a)), e === l.length - 1 && (a = S.getAbsoluteDistance(100, f.padding[1], !0), 
                r = Math.min(r, a))), !((r = ct(r = !s ? S.getStep(r) : r)) === t[e] && !o) && r;
            }
            function $(t, e) {
                var r = f.ort;
                return (r ? e : t) + ", " + (r ? t : e);
            }
            function G(t, r, n, e, i) {
                var o = n.slice(), s = e[0], a = f.events.smoothSteps, l = [ !t, t ], u = [ t, !t ];
                e = e.slice(), t && e.reverse(), 1 < e.length ? e.forEach((function(t, e) {
                    e = W(o, t, o[t] + r, l[e], u[e], !1, a);
                    !1 === e ? r = 0 : (r = e - o[t], o[t] = e);
                })) : l = u = [ !0 ];
                var c = !1;
                e.forEach((function(t, e) {
                    c = Q(t, n[t] + r, l[e], u[e], !1, a) || c;
                })), c && (e.forEach((function(t) {
                    I("update", t), I("slide", t);
                })), null != i && I("drag", s));
            }
            function J(t, e) {
                return f.dir ? 100 - t - e : t;
            }
            function K() {
                g.forEach((function(t) {
                    var e = 50 < m[t] ? -1 : 1;
                    e = 3 + (l.length + e * t);
                    l[t].style.zIndex = String(e);
                }));
            }
            function Q(t, e, r, n, i, o) {
                return !1 !== (e = i ? e : W(m, t, e, r, n, !1, o)) && (e, m[t] = e, h[t] = S.fromStepping(e), 
                e = "translate(" + $(J(e, 0) - E + "%", "0") + ")", l[t].style[f.transformRule] = e, 
                Z(t), Z(t + 1), !0);
            }
            function Z(t) {
                var e, r;
                a[t] && (r = 100, e = "translate(" + $(J(e = (e = 0) !== t ? m[t - 1] : e, r = (r = t !== a.length - 1 ? m[t] : r) - e) + "%", "0") + ")", 
                r = "scale(" + $(r / 100, "1") + ")", a[t].style[f.transformRule] = e + " " + r);
            }
            function tt(t, e) {
                return null === t || !1 === t || void 0 === t ? m[e] : ("number" == typeof t && (t = String(t)), 
                !1 === (t = !1 !== (t = f.format.from(t)) ? S.toStepping(t) : t) || isNaN(t) ? m[e] : t);
            }
            function et(t, e, r) {
                var n = pt(t);
                t = void 0 === m[0];
                e = void 0 === e || e, f.animate && !t && ut(d, f.cssClasses.tap, f.animationDuration), 
                g.forEach((function(t) {
                    Q(t, tt(n[t], t), !0, !1, r);
                }));
                var i, o = 1 === g.length ? 0 : 1;
                for (t && S.hasNoSize() && (r = !0, m[0] = 0, 1 < g.length && (i = 100 / (g.length - 1), 
                g.forEach((function(t) {
                    m[t] = t * i;
                })))); o < g.length; ++o) g.forEach((function(t) {
                    Q(t, m[t], !0, !0, r);
                }));
                K(), g.forEach((function(t) {
                    I("update", t), null !== n[t] && e && I("set", t);
                }));
            }
            function rt(t) {
                if (t = void 0 === t ? !1 : t) return 1 === h.length ? h[0] : h.slice(0);
                t = h.map(f.format.to);
                return 1 === t.length ? t[0] : t;
            }
            function nt(t) {
                var e = m[t], r = S.getNearbySteps(e), n = h[t], i = r.thisStep.step;
                t = null;
                if (f.snap) return [ n - r.stepBefore.startValue || null, r.stepAfter.startValue - n || null ];
                !1 !== i && n + i > r.stepAfter.startValue && (i = r.stepAfter.startValue - n), 
                t = n > r.thisStep.startValue ? r.thisStep.step : !1 !== r.stepBefore.step && n - r.stepBefore.highestStep, 
                100 === e ? i = null : 0 === e && (t = null);
                e = S.countStepDecimals();
                return null !== i && !1 !== i && (i = Number(i.toFixed(e))), [ t = null !== t && !1 !== t ? Number(t.toFixed(e)) : t, i ];
            }
            ft(t = d, f.cssClasses.target), 0 === f.dir ? ft(t, f.cssClasses.ltr) : ft(t, f.cssClasses.rtl), 
            0 === f.ort ? ft(t, f.cssClasses.horizontal) : ft(t, f.cssClasses.vertical), ft(t, "rtl" === getComputedStyle(t).direction ? f.cssClasses.textDirectionRtl : f.cssClasses.textDirectionLtr), 
            i = P(t, f.cssClasses.base), function(t, e) {
                var r = P(e, f.cssClasses.connects);
                l = [], (a = []).push(N(r, t[0]));
                for (var n = 0; n < f.handles; n++) l.push(C(e, n)), g[n] = n, a.push(N(r, t[n + 1]));
            }(f.connect, i), (u = f.events).fixed || l.forEach((function(t, e) {
                z(c.start, t.children[0], B, {
                    handleNumbers: [ e ]
                });
            })), u.tap && z(c.start, i, r, {}), u.hover && z(c.move, i, q, {
                hover: !0
            }), u.drag && a.forEach((function(e, t) {
                var r, n, i, o, s;
                !1 !== e && 0 !== t && t !== a.length - 1 && (r = l[t - 1], n = l[t], i = [ e ], 
                o = [ r, n ], s = [ t - 1, t ], ft(e, f.cssClasses.draggable), u.fixed && (i.push(r.children[0]), 
                i.push(n.children[0])), u.dragAll && (o = l, s = g), i.forEach((function(t) {
                    z(c.start, t, B, {
                        handles: o,
                        handleNumbers: s,
                        connect: e
                    });
                })));
            })), et(f.start), f.pips && T(f.pips), f.tooltips && M(), Y("update" + mt.aria), 
            X("update" + mt.aria, (function(t, e, o, r, s) {
                g.forEach((function(t) {
                    var e = l[t], r = W(m, t, 0, !0, !0, !0), n = W(m, t, 100, !0, !0, !0), i = s[t];
                    t = String(f.ariaFormat.to(o[t])), r = S.fromStepping(r).toFixed(1), n = S.fromStepping(n).toFixed(1), 
                    i = S.fromStepping(i).toFixed(1);
                    e.children[0].setAttribute("aria-valuemin", r), e.children[0].setAttribute("aria-valuemax", n), 
                    e.children[0].setAttribute("aria-valuenow", i), e.children[0].setAttribute("aria-valuetext", t);
                }));
            }));
            var it = {
                destroy: function() {
                    for (Y(mt.aria), Y(mt.tooltips), Object.keys(f.cssClasses).forEach((function(t) {
                        dt(d, f.cssClasses[t]);
                    })); d.firstChild; ) d.removeChild(d.firstChild);
                    delete d.noUiSlider;
                },
                steps: function() {
                    return g.map(nt);
                },
                on: X,
                off: Y,
                get: rt,
                set: et,
                setHandle: function(t, e, r, n) {
                    if (!(0 <= (t = Number(t)) && t < g.length)) throw new Error("noUiSlider: invalid handle number, got: " + t);
                    Q(t, tt(e, t), !0, !0, n), I("update", t), r && I("set", t);
                },
                reset: function(t) {
                    et(f.start, t);
                },
                disable: function(t) {
                    null != t ? (l[t].setAttribute("disabled", ""), l[t].handle.removeAttribute("tabindex")) : (d.setAttribute("disabled", ""), 
                    l.forEach((function(t) {
                        t.handle.removeAttribute("tabindex");
                    })));
                },
                enable: function(t) {
                    null != t ? (l[t].removeAttribute("disabled"), l[t].handle.setAttribute("tabindex", "0")) : (d.removeAttribute("disabled"), 
                    l.forEach((function(t) {
                        t.removeAttribute("disabled"), t.handle.setAttribute("tabindex", "0");
                    })));
                },
                __moveHandles: function(t, e, r) {
                    G(t, e, m, r);
                },
                options: o,
                updateOptions: function(e, t) {
                    var r = rt(), n = [ "margin", "limit", "padding", "range", "animate", "snap", "step", "format", "pips", "tooltips" ];
                    n.forEach((function(t) {
                        void 0 !== e[t] && (o[t] = e[t]);
                    }));
                    var i = gt(o);
                    n.forEach((function(t) {
                        void 0 !== e[t] && (f[t] = i[t]);
                    })), S = i.spectrum, f.margin = i.margin, f.limit = i.limit, f.padding = i.padding, 
                    f.pips ? T(f.pips) : L(), (f.tooltips ? M : k)(), m = [], et(at(e.start) ? e.start : r, t);
                },
                target: d,
                removePips: L,
                removeTooltips: k,
                getPositions: function() {
                    return m.slice();
                },
                getTooltips: function() {
                    return s;
                },
                getOrigins: function() {
                    return l;
                },
                pips: T
            };
            return it;
        }
        function z(t, e) {
            if (!t || !t.nodeName) throw new Error("noUiSlider: create requires a single element, got: " + t);
            if (t.noUiSlider) throw new Error("noUiSlider: Slider was already initialized.");
            e = j(t, gt(e), e);
            return t.noUiSlider = e;
        }
        var H = {
            __spectrum: u,
            cssClasses: p,
            create: z
        };
        ot.create = z, ot.cssClasses = p, ot.default = H, Object.defineProperty(ot, "__esModule", {
            value: !0
        });
    }));
    function _typeof(obj) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        }, _typeof(obj);
    }
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", {
            writable: false
        });
        return Constructor;
    }
    function _defineProperty(obj, key, value) {
        if (key in obj) Object.defineProperty(obj, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
        }); else obj[key] = value;
        return obj;
    }
    function _inherits(subClass, superClass) {
        if ("function" !== typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: true,
                configurable: true
            }
        });
        Object.defineProperty(subClass, "prototype", {
            writable: false
        });
        if (superClass) _setPrototypeOf(subClass, superClass);
    }
    function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
        };
        return _getPrototypeOf(o);
    }
    function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
        };
        return _setPrototypeOf(o, p);
    }
    function _isNativeReflectConstruct() {
        if ("undefined" === typeof Reflect || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if ("function" === typeof Proxy) return true;
        try {
            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {})));
            return true;
        } catch (e) {
            return false;
        }
    }
    function _objectWithoutPropertiesLoose(source, excluded) {
        if (null == source) return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;
        for (i = 0; i < sourceKeys.length; i++) {
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            target[key] = source[key];
        }
        return target;
    }
    function _objectWithoutProperties(source, excluded) {
        if (null == source) return {};
        var target = _objectWithoutPropertiesLoose(source, excluded);
        var key, i;
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for (i = 0; i < sourceSymbolKeys.length; i++) {
                key = sourceSymbolKeys[i];
                if (excluded.indexOf(key) >= 0) continue;
                if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
                target[key] = source[key];
            }
        }
        return target;
    }
    function _assertThisInitialized(self) {
        if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    }
    function _possibleConstructorReturn(self, call) {
        if (call && ("object" === typeof call || "function" === typeof call)) return call; else if (void 0 !== call) throw new TypeError("Derived constructors may only return object or undefined");
        return _assertThisInitialized(self);
    }
    function _createSuper(Derived) {
        var hasNativeReflectConstruct = _isNativeReflectConstruct();
        return function _createSuperInternal() {
            var result, Super = _getPrototypeOf(Derived);
            if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
            } else result = Super.apply(this, arguments);
            return _possibleConstructorReturn(this, result);
        };
    }
    function _superPropBase(object, property) {
        while (!Object.prototype.hasOwnProperty.call(object, property)) {
            object = _getPrototypeOf(object);
            if (null === object) break;
        }
        return object;
    }
    function _get() {
        if ("undefined" !== typeof Reflect && Reflect.get) _get = Reflect.get.bind(); else _get = function _get(target, property, receiver) {
            var base = _superPropBase(target, property);
            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);
            if (desc.get) return desc.get.call(arguments.length < 3 ? target : receiver);
            return desc.value;
        };
        return _get.apply(this, arguments);
    }
    function set(target, property, value, receiver) {
        if ("undefined" !== typeof Reflect && Reflect.set) set = Reflect.set; else set = function set(target, property, value, receiver) {
            var base = _superPropBase(target, property);
            var desc;
            if (base) {
                desc = Object.getOwnPropertyDescriptor(base, property);
                if (desc.set) {
                    desc.set.call(receiver, value);
                    return true;
                } else if (!desc.writable) return false;
            }
            desc = Object.getOwnPropertyDescriptor(receiver, property);
            if (desc) {
                if (!desc.writable) return false;
                desc.value = value;
                Object.defineProperty(receiver, property, desc);
            } else _defineProperty(receiver, property, value);
            return true;
        };
        return set(target, property, value, receiver);
    }
    function _set(target, property, value, receiver, isStrict) {
        var s = set(target, property, value, receiver || target);
        if (!s && isStrict) throw new Error("failed to set property");
        return value;
    }
    function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }
    function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }
    function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }
    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
    }
    function _iterableToArray(iter) {
        if ("undefined" !== typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) return Array.from(iter);
    }
    function _iterableToArrayLimit(arr, i) {
        var _i = null == arr ? null : "undefined" !== typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
        if (null == _i) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && null != _i["return"]) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }
        return _arr;
    }
    function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if ("string" === typeof o) return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if ("Object" === n && o.constructor) n = o.constructor.name;
        if ("Map" === n || "Set" === n) return Array.from(o);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
        if (null == len || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
        return arr2;
    }
    function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var ChangeDetails = function() {
        function ChangeDetails(details) {
            _classCallCheck(this, ChangeDetails);
            Object.assign(this, {
                inserted: "",
                rawInserted: "",
                skip: false,
                tailShift: 0
            }, details);
        }
        _createClass(ChangeDetails, [ {
            key: "aggregate",
            value: function aggregate(details) {
                this.rawInserted += details.rawInserted;
                this.skip = this.skip || details.skip;
                this.inserted += details.inserted;
                this.tailShift += details.tailShift;
                return this;
            }
        }, {
            key: "offset",
            get: function get() {
                return this.tailShift + this.inserted.length;
            }
        } ]);
        return ChangeDetails;
    }();
    function isString(str) {
        return "string" === typeof str || str instanceof String;
    }
    var DIRECTION = {
        NONE: "NONE",
        LEFT: "LEFT",
        FORCE_LEFT: "FORCE_LEFT",
        RIGHT: "RIGHT",
        FORCE_RIGHT: "FORCE_RIGHT"
    };
    function forceDirection(direction) {
        switch (direction) {
          case DIRECTION.LEFT:
            return DIRECTION.FORCE_LEFT;

          case DIRECTION.RIGHT:
            return DIRECTION.FORCE_RIGHT;

          default:
            return direction;
        }
    }
    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
    }
    function normalizePrepare(prep) {
        return Array.isArray(prep) ? prep : [ prep, new ChangeDetails ];
    }
    function objectIncludes(b, a) {
        if (a === b) return true;
        var i, arrA = Array.isArray(a), arrB = Array.isArray(b);
        if (arrA && arrB) {
            if (a.length != b.length) return false;
            for (i = 0; i < a.length; i++) if (!objectIncludes(a[i], b[i])) return false;
            return true;
        }
        if (arrA != arrB) return false;
        if (a && b && "object" === _typeof(a) && "object" === _typeof(b)) {
            var dateA = a instanceof Date, dateB = b instanceof Date;
            if (dateA && dateB) return a.getTime() == b.getTime();
            if (dateA != dateB) return false;
            var regexpA = a instanceof RegExp, regexpB = b instanceof RegExp;
            if (regexpA && regexpB) return a.toString() == b.toString();
            if (regexpA != regexpB) return false;
            var keys = Object.keys(a);
            for (i = 0; i < keys.length; i++) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
            for (i = 0; i < keys.length; i++) if (!objectIncludes(b[keys[i]], a[keys[i]])) return false;
            return true;
        } else if (a && b && "function" === typeof a && "function" === typeof b) return a.toString() === b.toString();
        return false;
    }
    var ActionDetails = function() {
        function ActionDetails(value, cursorPos, oldValue, oldSelection) {
            _classCallCheck(this, ActionDetails);
            this.value = value;
            this.cursorPos = cursorPos;
            this.oldValue = oldValue;
            this.oldSelection = oldSelection;
            while (this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos)) --this.oldSelection.start;
        }
        _createClass(ActionDetails, [ {
            key: "startChangePos",
            get: function get() {
                return Math.min(this.cursorPos, this.oldSelection.start);
            }
        }, {
            key: "insertedCount",
            get: function get() {
                return this.cursorPos - this.startChangePos;
            }
        }, {
            key: "inserted",
            get: function get() {
                return this.value.substr(this.startChangePos, this.insertedCount);
            }
        }, {
            key: "removedCount",
            get: function get() {
                return Math.max(this.oldSelection.end - this.startChangePos || this.oldValue.length - this.value.length, 0);
            }
        }, {
            key: "removed",
            get: function get() {
                return this.oldValue.substr(this.startChangePos, this.removedCount);
            }
        }, {
            key: "head",
            get: function get() {
                return this.value.substring(0, this.startChangePos);
            }
        }, {
            key: "tail",
            get: function get() {
                return this.value.substring(this.startChangePos + this.insertedCount);
            }
        }, {
            key: "removeDirection",
            get: function get() {
                if (!this.removedCount || this.insertedCount) return DIRECTION.NONE;
                return (this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos) && this.oldSelection.end === this.oldSelection.start ? DIRECTION.RIGHT : DIRECTION.LEFT;
            }
        } ]);
        return ActionDetails;
    }();
    var ContinuousTailDetails = function() {
        function ContinuousTailDetails() {
            var value = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
            var from = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
            var stop = arguments.length > 2 ? arguments[2] : void 0;
            _classCallCheck(this, ContinuousTailDetails);
            this.value = value;
            this.from = from;
            this.stop = stop;
        }
        _createClass(ContinuousTailDetails, [ {
            key: "toString",
            value: function toString() {
                return this.value;
            }
        }, {
            key: "extend",
            value: function extend(tail) {
                this.value += String(tail);
            }
        }, {
            key: "appendTo",
            value: function appendTo(masked) {
                return masked.append(this.toString(), {
                    tail: true
                }).aggregate(masked._appendPlaceholder());
            }
        }, {
            key: "state",
            get: function get() {
                return {
                    value: this.value,
                    from: this.from,
                    stop: this.stop
                };
            },
            set: function set(state) {
                Object.assign(this, state);
            }
        }, {
            key: "unshift",
            value: function unshift(beforePos) {
                if (!this.value.length || null != beforePos && this.from >= beforePos) return "";
                var shiftChar = this.value[0];
                this.value = this.value.slice(1);
                return shiftChar;
            }
        }, {
            key: "shift",
            value: function shift() {
                if (!this.value.length) return "";
                var shiftChar = this.value[this.value.length - 1];
                this.value = this.value.slice(0, -1);
                return shiftChar;
            }
        } ]);
        return ContinuousTailDetails;
    }();
    function IMask(el) {
        var opts = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return new IMask.InputMask(el, opts);
    }
    var Masked = function() {
        function Masked(opts) {
            _classCallCheck(this, Masked);
            this._value = "";
            this._update(Object.assign({}, Masked.DEFAULTS, opts));
            this.isInitialized = true;
        }
        _createClass(Masked, [ {
            key: "updateOptions",
            value: function updateOptions(opts) {
                if (!Object.keys(opts).length) return;
                this.withValueRefresh(this._update.bind(this, opts));
            }
        }, {
            key: "_update",
            value: function _update(opts) {
                Object.assign(this, opts);
            }
        }, {
            key: "state",
            get: function get() {
                return {
                    _value: this.value
                };
            },
            set: function set(state) {
                this._value = state._value;
            }
        }, {
            key: "reset",
            value: function reset() {
                this._value = "";
            }
        }, {
            key: "value",
            get: function get() {
                return this._value;
            },
            set: function set(value) {
                this.resolve(value);
            }
        }, {
            key: "resolve",
            value: function resolve(value) {
                this.reset();
                this.append(value, {
                    input: true
                }, "");
                this.doCommit();
                return this.value;
            }
        }, {
            key: "unmaskedValue",
            get: function get() {
                return this.value;
            },
            set: function set(value) {
                this.reset();
                this.append(value, {}, "");
                this.doCommit();
            }
        }, {
            key: "typedValue",
            get: function get() {
                return this.doParse(this.value);
            },
            set: function set(value) {
                this.value = this.doFormat(value);
            }
        }, {
            key: "rawInputValue",
            get: function get() {
                return this.extractInput(0, this.value.length, {
                    raw: true
                });
            },
            set: function set(value) {
                this.reset();
                this.append(value, {
                    raw: true
                }, "");
                this.doCommit();
            }
        }, {
            key: "isComplete",
            get: function get() {
                return true;
            }
        }, {
            key: "isFilled",
            get: function get() {
                return this.isComplete;
            }
        }, {
            key: "nearestInputPos",
            value: function nearestInputPos(cursorPos, direction) {
                return cursorPos;
            }
        }, {
            key: "extractInput",
            value: function extractInput() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                return this.value.slice(fromPos, toPos);
            }
        }, {
            key: "extractTail",
            value: function extractTail() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                return new ContinuousTailDetails(this.extractInput(fromPos, toPos), fromPos);
            }
        }, {
            key: "appendTail",
            value: function appendTail(tail) {
                if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
                return tail.appendTo(this);
            }
        }, {
            key: "_appendCharRaw",
            value: function _appendCharRaw(ch) {
                if (!ch) return new ChangeDetails;
                this._value += ch;
                return new ChangeDetails({
                    inserted: ch,
                    rawInserted: ch
                });
            }
        }, {
            key: "_appendChar",
            value: function _appendChar(ch) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                var checkTail = arguments.length > 2 ? arguments[2] : void 0;
                var consistentState = this.state;
                var details;
                var _normalizePrepare = normalizePrepare(this.doPrepare(ch, flags));
                var _normalizePrepare2 = _slicedToArray(_normalizePrepare, 2);
                ch = _normalizePrepare2[0];
                details = _normalizePrepare2[1];
                details = details.aggregate(this._appendCharRaw(ch, flags));
                if (details.inserted) {
                    var consistentTail;
                    var appended = false !== this.doValidate(flags);
                    if (appended && null != checkTail) {
                        var beforeTailState = this.state;
                        if (true === this.overwrite) {
                            consistentTail = checkTail.state;
                            checkTail.unshift(this.value.length);
                        }
                        var tailDetails = this.appendTail(checkTail);
                        appended = tailDetails.rawInserted === checkTail.toString();
                        if (!(appended && tailDetails.inserted) && "shift" === this.overwrite) {
                            this.state = beforeTailState;
                            consistentTail = checkTail.state;
                            checkTail.shift();
                            tailDetails = this.appendTail(checkTail);
                            appended = tailDetails.rawInserted === checkTail.toString();
                        }
                        if (appended && tailDetails.inserted) this.state = beforeTailState;
                    }
                    if (!appended) {
                        details = new ChangeDetails;
                        this.state = consistentState;
                        if (checkTail && consistentTail) checkTail.state = consistentTail;
                    }
                }
                return details;
            }
        }, {
            key: "_appendPlaceholder",
            value: function _appendPlaceholder() {
                return new ChangeDetails;
            }
        }, {
            key: "_appendEager",
            value: function _appendEager() {
                return new ChangeDetails;
            }
        }, {
            key: "append",
            value: function append(str, flags, tail) {
                if (!isString(str)) throw new Error("value should be string");
                var details = new ChangeDetails;
                var checkTail = isString(tail) ? new ContinuousTailDetails(String(tail)) : tail;
                if (null !== flags && void 0 !== flags && flags.tail) flags._beforeTailState = this.state;
                for (var ci = 0; ci < str.length; ++ci) details.aggregate(this._appendChar(str[ci], flags, checkTail));
                if (null != checkTail) details.tailShift += this.appendTail(checkTail).tailShift;
                if (this.eager && null !== flags && void 0 !== flags && flags.input && str) details.aggregate(this._appendEager());
                return details;
            }
        }, {
            key: "remove",
            value: function remove() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                this._value = this.value.slice(0, fromPos) + this.value.slice(toPos);
                return new ChangeDetails;
            }
        }, {
            key: "withValueRefresh",
            value: function withValueRefresh(fn) {
                if (this._refreshing || !this.isInitialized) return fn();
                this._refreshing = true;
                var rawInput = this.rawInputValue;
                var value = this.value;
                var ret = fn();
                this.rawInputValue = rawInput;
                if (this.value && this.value !== value && 0 === value.indexOf(this.value)) this.append(value.slice(this.value.length), {}, "");
                delete this._refreshing;
                return ret;
            }
        }, {
            key: "runIsolated",
            value: function runIsolated(fn) {
                if (this._isolated || !this.isInitialized) return fn(this);
                this._isolated = true;
                var state = this.state;
                var ret = fn(this);
                this.state = state;
                delete this._isolated;
                return ret;
            }
        }, {
            key: "doPrepare",
            value: function doPrepare(str) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                return this.prepare ? this.prepare(str, this, flags) : str;
            }
        }, {
            key: "doValidate",
            value: function doValidate(flags) {
                return (!this.validate || this.validate(this.value, this, flags)) && (!this.parent || this.parent.doValidate(flags));
            }
        }, {
            key: "doCommit",
            value: function doCommit() {
                if (this.commit) this.commit(this.value, this);
            }
        }, {
            key: "doFormat",
            value: function doFormat(value) {
                return this.format ? this.format(value, this) : value;
            }
        }, {
            key: "doParse",
            value: function doParse(str) {
                return this.parse ? this.parse(str, this) : str;
            }
        }, {
            key: "splice",
            value: function splice(start, deleteCount, inserted, removeDirection) {
                var flags = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {
                    input: true
                };
                var tailPos = start + deleteCount;
                var tail = this.extractTail(tailPos);
                var oldRawValue;
                if (this.eager) {
                    removeDirection = forceDirection(removeDirection);
                    oldRawValue = this.extractInput(0, tailPos, {
                        raw: true
                    });
                }
                var startChangePos = this.nearestInputPos(start, deleteCount > 1 && 0 !== start && !this.eager ? DIRECTION.NONE : removeDirection);
                var details = new ChangeDetails({
                    tailShift: startChangePos - start
                }).aggregate(this.remove(startChangePos));
                if (this.eager && removeDirection !== DIRECTION.NONE && oldRawValue === this.rawInputValue) if (removeDirection === DIRECTION.FORCE_LEFT) {
                    var valLength;
                    while (oldRawValue === this.rawInputValue && (valLength = this.value.length)) details.aggregate(new ChangeDetails({
                        tailShift: -1
                    })).aggregate(this.remove(valLength - 1));
                } else if (removeDirection === DIRECTION.FORCE_RIGHT) tail.unshift();
                return details.aggregate(this.append(inserted, flags, tail));
            }
        }, {
            key: "maskEquals",
            value: function maskEquals(mask) {
                return this.mask === mask;
            }
        }, {
            key: "typedValueEquals",
            value: function typedValueEquals(value) {
                var tval = this.typedValue;
                return value === tval || Masked.EMPTY_VALUES.includes(value) && Masked.EMPTY_VALUES.includes(tval) || this.doFormat(value) === this.doFormat(this.typedValue);
            }
        } ]);
        return Masked;
    }();
    Masked.DEFAULTS = {
        format: function format(v) {
            return v;
        },
        parse: function parse(v) {
            return v;
        }
    };
    Masked.EMPTY_VALUES = [ void 0, null, "" ];
    IMask.Masked = Masked;
    function maskedClass(mask) {
        if (null == mask) throw new Error("mask property should be defined");
        if (mask instanceof RegExp) return IMask.MaskedRegExp;
        if (isString(mask)) return IMask.MaskedPattern;
        if (mask instanceof Date || mask === Date) return IMask.MaskedDate;
        if (mask instanceof Number || "number" === typeof mask || mask === Number) return IMask.MaskedNumber;
        if (Array.isArray(mask) || mask === Array) return IMask.MaskedDynamic;
        if (IMask.Masked && mask.prototype instanceof IMask.Masked) return mask;
        if (mask instanceof IMask.Masked) return mask.constructor;
        if (mask instanceof Function) return IMask.MaskedFunction;
        console.warn("Mask not found for mask", mask);
        return IMask.Masked;
    }
    function createMask(opts) {
        if (IMask.Masked && opts instanceof IMask.Masked) return opts;
        opts = Object.assign({}, opts);
        var mask = opts.mask;
        if (IMask.Masked && mask instanceof IMask.Masked) return mask;
        var MaskedClass = maskedClass(mask);
        if (!MaskedClass) throw new Error("Masked class is not found for provided mask, appropriate module needs to be import manually before creating mask.");
        return new MaskedClass(opts);
    }
    IMask.createMask = createMask;
    var _excluded = [ "mask" ];
    var DEFAULT_INPUT_DEFINITIONS = {
        0: /\d/,
        a: /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
        "*": /./
    };
    var PatternInputDefinition = function() {
        function PatternInputDefinition(opts) {
            _classCallCheck(this, PatternInputDefinition);
            var mask = opts.mask, blockOpts = _objectWithoutProperties(opts, _excluded);
            this.masked = createMask({
                mask
            });
            Object.assign(this, blockOpts);
        }
        _createClass(PatternInputDefinition, [ {
            key: "reset",
            value: function reset() {
                this.isFilled = false;
                this.masked.reset();
            }
        }, {
            key: "remove",
            value: function remove() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                if (0 === fromPos && toPos >= 1) {
                    this.isFilled = false;
                    return this.masked.remove(fromPos, toPos);
                }
                return new ChangeDetails;
            }
        }, {
            key: "value",
            get: function get() {
                return this.masked.value || (this.isFilled && !this.isOptional ? this.placeholderChar : "");
            }
        }, {
            key: "unmaskedValue",
            get: function get() {
                return this.masked.unmaskedValue;
            }
        }, {
            key: "isComplete",
            get: function get() {
                return Boolean(this.masked.value) || this.isOptional;
            }
        }, {
            key: "_appendChar",
            value: function _appendChar(ch) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                if (this.isFilled) return new ChangeDetails;
                var state = this.masked.state;
                var details = this.masked._appendChar(ch, flags);
                if (details.inserted && false === this.doValidate(flags)) {
                    details.inserted = details.rawInserted = "";
                    this.masked.state = state;
                }
                if (!details.inserted && !this.isOptional && !this.lazy && !flags.input) details.inserted = this.placeholderChar;
                details.skip = !details.inserted && !this.isOptional;
                this.isFilled = Boolean(details.inserted);
                return details;
            }
        }, {
            key: "append",
            value: function append() {
                var _this$masked;
                return (_this$masked = this.masked).append.apply(_this$masked, arguments);
            }
        }, {
            key: "_appendPlaceholder",
            value: function _appendPlaceholder() {
                var details = new ChangeDetails;
                if (this.isFilled || this.isOptional) return details;
                this.isFilled = true;
                details.inserted = this.placeholderChar;
                return details;
            }
        }, {
            key: "_appendEager",
            value: function _appendEager() {
                return new ChangeDetails;
            }
        }, {
            key: "extractTail",
            value: function extractTail() {
                var _this$masked2;
                return (_this$masked2 = this.masked).extractTail.apply(_this$masked2, arguments);
            }
        }, {
            key: "appendTail",
            value: function appendTail() {
                var _this$masked3;
                return (_this$masked3 = this.masked).appendTail.apply(_this$masked3, arguments);
            }
        }, {
            key: "extractInput",
            value: function extractInput() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                var flags = arguments.length > 2 ? arguments[2] : void 0;
                return this.masked.extractInput(fromPos, toPos, flags);
            }
        }, {
            key: "nearestInputPos",
            value: function nearestInputPos(cursorPos) {
                var direction = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : DIRECTION.NONE;
                var minPos = 0;
                var maxPos = this.value.length;
                var boundPos = Math.min(Math.max(cursorPos, minPos), maxPos);
                switch (direction) {
                  case DIRECTION.LEFT:
                  case DIRECTION.FORCE_LEFT:
                    return this.isComplete ? boundPos : minPos;

                  case DIRECTION.RIGHT:
                  case DIRECTION.FORCE_RIGHT:
                    return this.isComplete ? boundPos : maxPos;

                  case DIRECTION.NONE:
                  default:
                    return boundPos;
                }
            }
        }, {
            key: "doValidate",
            value: function doValidate() {
                var _this$masked4, _this$parent;
                return (_this$masked4 = this.masked).doValidate.apply(_this$masked4, arguments) && (!this.parent || (_this$parent = this.parent).doValidate.apply(_this$parent, arguments));
            }
        }, {
            key: "doCommit",
            value: function doCommit() {
                this.masked.doCommit();
            }
        }, {
            key: "state",
            get: function get() {
                return {
                    masked: this.masked.state,
                    isFilled: this.isFilled
                };
            },
            set: function set(state) {
                this.masked.state = state.masked;
                this.isFilled = state.isFilled;
            }
        } ]);
        return PatternInputDefinition;
    }();
    var PatternFixedDefinition = function() {
        function PatternFixedDefinition(opts) {
            _classCallCheck(this, PatternFixedDefinition);
            Object.assign(this, opts);
            this._value = "";
            this.isFixed = true;
        }
        _createClass(PatternFixedDefinition, [ {
            key: "value",
            get: function get() {
                return this._value;
            }
        }, {
            key: "unmaskedValue",
            get: function get() {
                return this.isUnmasking ? this.value : "";
            }
        }, {
            key: "reset",
            value: function reset() {
                this._isRawInput = false;
                this._value = "";
            }
        }, {
            key: "remove",
            value: function remove() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this._value.length;
                this._value = this._value.slice(0, fromPos) + this._value.slice(toPos);
                if (!this._value) this._isRawInput = false;
                return new ChangeDetails;
            }
        }, {
            key: "nearestInputPos",
            value: function nearestInputPos(cursorPos) {
                var direction = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : DIRECTION.NONE;
                var minPos = 0;
                var maxPos = this._value.length;
                switch (direction) {
                  case DIRECTION.LEFT:
                  case DIRECTION.FORCE_LEFT:
                    return minPos;

                  case DIRECTION.NONE:
                  case DIRECTION.RIGHT:
                  case DIRECTION.FORCE_RIGHT:
                  default:
                    return maxPos;
                }
            }
        }, {
            key: "extractInput",
            value: function extractInput() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this._value.length;
                var flags = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                return flags.raw && this._isRawInput && this._value.slice(fromPos, toPos) || "";
            }
        }, {
            key: "isComplete",
            get: function get() {
                return true;
            }
        }, {
            key: "isFilled",
            get: function get() {
                return Boolean(this._value);
            }
        }, {
            key: "_appendChar",
            value: function _appendChar(ch) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                var details = new ChangeDetails;
                if (this._value) return details;
                var appended = this.char === ch;
                var isResolved = appended && (this.isUnmasking || flags.input || flags.raw) && (!flags.raw || !this.eager) && !flags.tail;
                if (isResolved) details.rawInserted = this.char;
                this._value = details.inserted = this.char;
                this._isRawInput = isResolved && (flags.raw || flags.input);
                return details;
            }
        }, {
            key: "_appendEager",
            value: function _appendEager() {
                return this._appendChar(this.char, {
                    tail: true
                });
            }
        }, {
            key: "_appendPlaceholder",
            value: function _appendPlaceholder() {
                var details = new ChangeDetails;
                if (this._value) return details;
                this._value = details.inserted = this.char;
                return details;
            }
        }, {
            key: "extractTail",
            value: function extractTail() {
                arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                return new ContinuousTailDetails("");
            }
        }, {
            key: "appendTail",
            value: function appendTail(tail) {
                if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
                return tail.appendTo(this);
            }
        }, {
            key: "append",
            value: function append(str, flags, tail) {
                var details = this._appendChar(str[0], flags);
                if (null != tail) details.tailShift += this.appendTail(tail).tailShift;
                return details;
            }
        }, {
            key: "doCommit",
            value: function doCommit() {}
        }, {
            key: "state",
            get: function get() {
                return {
                    _value: this._value,
                    _isRawInput: this._isRawInput
                };
            },
            set: function set(state) {
                Object.assign(this, state);
            }
        } ]);
        return PatternFixedDefinition;
    }();
    var chunk_tail_details_excluded = [ "chunks" ];
    var ChunksTailDetails = function() {
        function ChunksTailDetails() {
            var chunks = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
            var from = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
            _classCallCheck(this, ChunksTailDetails);
            this.chunks = chunks;
            this.from = from;
        }
        _createClass(ChunksTailDetails, [ {
            key: "toString",
            value: function toString() {
                return this.chunks.map(String).join("");
            }
        }, {
            key: "extend",
            value: function extend(tailChunk) {
                if (!String(tailChunk)) return;
                if (isString(tailChunk)) tailChunk = new ContinuousTailDetails(String(tailChunk));
                var lastChunk = this.chunks[this.chunks.length - 1];
                var extendLast = lastChunk && (lastChunk.stop === tailChunk.stop || null == tailChunk.stop) && tailChunk.from === lastChunk.from + lastChunk.toString().length;
                if (tailChunk instanceof ContinuousTailDetails) if (extendLast) lastChunk.extend(tailChunk.toString()); else this.chunks.push(tailChunk); else if (tailChunk instanceof ChunksTailDetails) {
                    if (null == tailChunk.stop) {
                        var firstTailChunk;
                        while (tailChunk.chunks.length && null == tailChunk.chunks[0].stop) {
                            firstTailChunk = tailChunk.chunks.shift();
                            firstTailChunk.from += tailChunk.from;
                            this.extend(firstTailChunk);
                        }
                    }
                    if (tailChunk.toString()) {
                        tailChunk.stop = tailChunk.blockIndex;
                        this.chunks.push(tailChunk);
                    }
                }
            }
        }, {
            key: "appendTo",
            value: function appendTo(masked) {
                if (!(masked instanceof IMask.MaskedPattern)) {
                    var tail = new ContinuousTailDetails(this.toString());
                    return tail.appendTo(masked);
                }
                var details = new ChangeDetails;
                for (var ci = 0; ci < this.chunks.length && !details.skip; ++ci) {
                    var chunk = this.chunks[ci];
                    var lastBlockIter = masked._mapPosToBlock(masked.value.length);
                    var stop = chunk.stop;
                    var chunkBlock = void 0;
                    if (null != stop && (!lastBlockIter || lastBlockIter.index <= stop)) {
                        if (chunk instanceof ChunksTailDetails || masked._stops.indexOf(stop) >= 0) details.aggregate(masked._appendPlaceholder(stop));
                        chunkBlock = chunk instanceof ChunksTailDetails && masked._blocks[stop];
                    }
                    if (chunkBlock) {
                        var tailDetails = chunkBlock.appendTail(chunk);
                        tailDetails.skip = false;
                        details.aggregate(tailDetails);
                        masked._value += tailDetails.inserted;
                        var remainChars = chunk.toString().slice(tailDetails.rawInserted.length);
                        if (remainChars) details.aggregate(masked.append(remainChars, {
                            tail: true
                        }));
                    } else details.aggregate(masked.append(chunk.toString(), {
                        tail: true
                    }));
                }
                return details;
            }
        }, {
            key: "state",
            get: function get() {
                return {
                    chunks: this.chunks.map((function(c) {
                        return c.state;
                    })),
                    from: this.from,
                    stop: this.stop,
                    blockIndex: this.blockIndex
                };
            },
            set: function set(state) {
                var chunks = state.chunks, props = _objectWithoutProperties(state, chunk_tail_details_excluded);
                Object.assign(this, props);
                this.chunks = chunks.map((function(cstate) {
                    var chunk = "chunks" in cstate ? new ChunksTailDetails : new ContinuousTailDetails;
                    chunk.state = cstate;
                    return chunk;
                }));
            }
        }, {
            key: "unshift",
            value: function unshift(beforePos) {
                if (!this.chunks.length || null != beforePos && this.from >= beforePos) return "";
                var chunkShiftPos = null != beforePos ? beforePos - this.from : beforePos;
                var ci = 0;
                while (ci < this.chunks.length) {
                    var chunk = this.chunks[ci];
                    var shiftChar = chunk.unshift(chunkShiftPos);
                    if (chunk.toString()) {
                        if (!shiftChar) break;
                        ++ci;
                    } else this.chunks.splice(ci, 1);
                    if (shiftChar) return shiftChar;
                }
                return "";
            }
        }, {
            key: "shift",
            value: function shift() {
                if (!this.chunks.length) return "";
                var ci = this.chunks.length - 1;
                while (0 <= ci) {
                    var chunk = this.chunks[ci];
                    var shiftChar = chunk.shift();
                    if (chunk.toString()) {
                        if (!shiftChar) break;
                        --ci;
                    } else this.chunks.splice(ci, 1);
                    if (shiftChar) return shiftChar;
                }
                return "";
            }
        } ]);
        return ChunksTailDetails;
    }();
    var PatternCursor = function() {
        function PatternCursor(masked, pos) {
            _classCallCheck(this, PatternCursor);
            this.masked = masked;
            this._log = [];
            var _ref = masked._mapPosToBlock(pos) || (pos < 0 ? {
                index: 0,
                offset: 0
            } : {
                index: this.masked._blocks.length,
                offset: 0
            }), offset = _ref.offset, index = _ref.index;
            this.offset = offset;
            this.index = index;
            this.ok = false;
        }
        _createClass(PatternCursor, [ {
            key: "block",
            get: function get() {
                return this.masked._blocks[this.index];
            }
        }, {
            key: "pos",
            get: function get() {
                return this.masked._blockStartPos(this.index) + this.offset;
            }
        }, {
            key: "state",
            get: function get() {
                return {
                    index: this.index,
                    offset: this.offset,
                    ok: this.ok
                };
            },
            set: function set(s) {
                Object.assign(this, s);
            }
        }, {
            key: "pushState",
            value: function pushState() {
                this._log.push(this.state);
            }
        }, {
            key: "popState",
            value: function popState() {
                var s = this._log.pop();
                this.state = s;
                return s;
            }
        }, {
            key: "bindBlock",
            value: function bindBlock() {
                if (this.block) return;
                if (this.index < 0) {
                    this.index = 0;
                    this.offset = 0;
                }
                if (this.index >= this.masked._blocks.length) {
                    this.index = this.masked._blocks.length - 1;
                    this.offset = this.block.value.length;
                }
            }
        }, {
            key: "_pushLeft",
            value: function _pushLeft(fn) {
                this.pushState();
                for (this.bindBlock(); 0 <= this.index; --this.index, this.offset = (null === (_this$block = this.block) || void 0 === _this$block ? void 0 : _this$block.value.length) || 0) {
                    var _this$block;
                    if (fn()) return this.ok = true;
                }
                return this.ok = false;
            }
        }, {
            key: "_pushRight",
            value: function _pushRight(fn) {
                this.pushState();
                for (this.bindBlock(); this.index < this.masked._blocks.length; ++this.index, this.offset = 0) if (fn()) return this.ok = true;
                return this.ok = false;
            }
        }, {
            key: "pushLeftBeforeFilled",
            value: function pushLeftBeforeFilled() {
                var _this = this;
                return this._pushLeft((function() {
                    if (_this.block.isFixed || !_this.block.value) return;
                    _this.offset = _this.block.nearestInputPos(_this.offset, DIRECTION.FORCE_LEFT);
                    if (0 !== _this.offset) return true;
                }));
            }
        }, {
            key: "pushLeftBeforeInput",
            value: function pushLeftBeforeInput() {
                var _this2 = this;
                return this._pushLeft((function() {
                    if (_this2.block.isFixed) return;
                    _this2.offset = _this2.block.nearestInputPos(_this2.offset, DIRECTION.LEFT);
                    return true;
                }));
            }
        }, {
            key: "pushLeftBeforeRequired",
            value: function pushLeftBeforeRequired() {
                var _this3 = this;
                return this._pushLeft((function() {
                    if (_this3.block.isFixed || _this3.block.isOptional && !_this3.block.value) return;
                    _this3.offset = _this3.block.nearestInputPos(_this3.offset, DIRECTION.LEFT);
                    return true;
                }));
            }
        }, {
            key: "pushRightBeforeFilled",
            value: function pushRightBeforeFilled() {
                var _this4 = this;
                return this._pushRight((function() {
                    if (_this4.block.isFixed || !_this4.block.value) return;
                    _this4.offset = _this4.block.nearestInputPos(_this4.offset, DIRECTION.FORCE_RIGHT);
                    if (_this4.offset !== _this4.block.value.length) return true;
                }));
            }
        }, {
            key: "pushRightBeforeInput",
            value: function pushRightBeforeInput() {
                var _this5 = this;
                return this._pushRight((function() {
                    if (_this5.block.isFixed) return;
                    _this5.offset = _this5.block.nearestInputPos(_this5.offset, DIRECTION.NONE);
                    return true;
                }));
            }
        }, {
            key: "pushRightBeforeRequired",
            value: function pushRightBeforeRequired() {
                var _this6 = this;
                return this._pushRight((function() {
                    if (_this6.block.isFixed || _this6.block.isOptional && !_this6.block.value) return;
                    _this6.offset = _this6.block.nearestInputPos(_this6.offset, DIRECTION.NONE);
                    return true;
                }));
            }
        } ]);
        return PatternCursor;
    }();
    var MaskedRegExp = function(_Masked) {
        _inherits(MaskedRegExp, _Masked);
        var _super = _createSuper(MaskedRegExp);
        function MaskedRegExp() {
            _classCallCheck(this, MaskedRegExp);
            return _super.apply(this, arguments);
        }
        _createClass(MaskedRegExp, [ {
            key: "_update",
            value: function _update(opts) {
                if (opts.mask) opts.validate = function(value) {
                    return value.search(opts.mask) >= 0;
                };
                _get(_getPrototypeOf(MaskedRegExp.prototype), "_update", this).call(this, opts);
            }
        } ]);
        return MaskedRegExp;
    }(Masked);
    IMask.MaskedRegExp = MaskedRegExp;
    var pattern_excluded = [ "_blocks" ];
    var MaskedPattern = function(_Masked) {
        _inherits(MaskedPattern, _Masked);
        var _super = _createSuper(MaskedPattern);
        function MaskedPattern() {
            var opts = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            _classCallCheck(this, MaskedPattern);
            opts.definitions = Object.assign({}, DEFAULT_INPUT_DEFINITIONS, opts.definitions);
            return _super.call(this, Object.assign({}, MaskedPattern.DEFAULTS, opts));
        }
        _createClass(MaskedPattern, [ {
            key: "_update",
            value: function _update() {
                var opts = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                opts.definitions = Object.assign({}, this.definitions, opts.definitions);
                _get(_getPrototypeOf(MaskedPattern.prototype), "_update", this).call(this, opts);
                this._rebuildMask();
            }
        }, {
            key: "_rebuildMask",
            value: function _rebuildMask() {
                var _this = this;
                var defs = this.definitions;
                this._blocks = [];
                this._stops = [];
                this._maskedBlocks = {};
                var pattern = this.mask;
                if (!pattern || !defs) return;
                var unmaskingBlock = false;
                var optionalBlock = false;
                for (var i = 0; i < pattern.length; ++i) {
                    if (this.blocks) {
                        var _ret = function() {
                            var p = pattern.slice(i);
                            var bNames = Object.keys(_this.blocks).filter((function(bName) {
                                return 0 === p.indexOf(bName);
                            }));
                            bNames.sort((function(a, b) {
                                return b.length - a.length;
                            }));
                            var bName = bNames[0];
                            if (bName) {
                                var maskedBlock = createMask(Object.assign({
                                    parent: _this,
                                    lazy: _this.lazy,
                                    eager: _this.eager,
                                    placeholderChar: _this.placeholderChar,
                                    overwrite: _this.overwrite
                                }, _this.blocks[bName]));
                                if (maskedBlock) {
                                    _this._blocks.push(maskedBlock);
                                    if (!_this._maskedBlocks[bName]) _this._maskedBlocks[bName] = [];
                                    _this._maskedBlocks[bName].push(_this._blocks.length - 1);
                                }
                                i += bName.length - 1;
                                return "continue";
                            }
                        }();
                        if ("continue" === _ret) continue;
                    }
                    var char = pattern[i];
                    var isInput = char in defs;
                    if (char === MaskedPattern.STOP_CHAR) {
                        this._stops.push(this._blocks.length);
                        continue;
                    }
                    if ("{" === char || "}" === char) {
                        unmaskingBlock = !unmaskingBlock;
                        continue;
                    }
                    if ("[" === char || "]" === char) {
                        optionalBlock = !optionalBlock;
                        continue;
                    }
                    if (char === MaskedPattern.ESCAPE_CHAR) {
                        ++i;
                        char = pattern[i];
                        if (!char) break;
                        isInput = false;
                    }
                    var def = isInput ? new PatternInputDefinition({
                        parent: this,
                        lazy: this.lazy,
                        eager: this.eager,
                        placeholderChar: this.placeholderChar,
                        mask: defs[char],
                        isOptional: optionalBlock
                    }) : new PatternFixedDefinition({
                        char,
                        eager: this.eager,
                        isUnmasking: unmaskingBlock
                    });
                    this._blocks.push(def);
                }
            }
        }, {
            key: "state",
            get: function get() {
                return Object.assign({}, _get(_getPrototypeOf(MaskedPattern.prototype), "state", this), {
                    _blocks: this._blocks.map((function(b) {
                        return b.state;
                    }))
                });
            },
            set: function set(state) {
                var _blocks = state._blocks, maskedState = _objectWithoutProperties(state, pattern_excluded);
                this._blocks.forEach((function(b, bi) {
                    return b.state = _blocks[bi];
                }));
                _set(_getPrototypeOf(MaskedPattern.prototype), "state", maskedState, this, true);
            }
        }, {
            key: "reset",
            value: function reset() {
                _get(_getPrototypeOf(MaskedPattern.prototype), "reset", this).call(this);
                this._blocks.forEach((function(b) {
                    return b.reset();
                }));
            }
        }, {
            key: "isComplete",
            get: function get() {
                return this._blocks.every((function(b) {
                    return b.isComplete;
                }));
            }
        }, {
            key: "isFilled",
            get: function get() {
                return this._blocks.every((function(b) {
                    return b.isFilled;
                }));
            }
        }, {
            key: "isFixed",
            get: function get() {
                return this._blocks.every((function(b) {
                    return b.isFixed;
                }));
            }
        }, {
            key: "isOptional",
            get: function get() {
                return this._blocks.every((function(b) {
                    return b.isOptional;
                }));
            }
        }, {
            key: "doCommit",
            value: function doCommit() {
                this._blocks.forEach((function(b) {
                    return b.doCommit();
                }));
                _get(_getPrototypeOf(MaskedPattern.prototype), "doCommit", this).call(this);
            }
        }, {
            key: "unmaskedValue",
            get: function get() {
                return this._blocks.reduce((function(str, b) {
                    return str += b.unmaskedValue;
                }), "");
            },
            set: function set(unmaskedValue) {
                _set(_getPrototypeOf(MaskedPattern.prototype), "unmaskedValue", unmaskedValue, this, true);
            }
        }, {
            key: "value",
            get: function get() {
                return this._blocks.reduce((function(str, b) {
                    return str += b.value;
                }), "");
            },
            set: function set(value) {
                _set(_getPrototypeOf(MaskedPattern.prototype), "value", value, this, true);
            }
        }, {
            key: "appendTail",
            value: function appendTail(tail) {
                return _get(_getPrototypeOf(MaskedPattern.prototype), "appendTail", this).call(this, tail).aggregate(this._appendPlaceholder());
            }
        }, {
            key: "_appendEager",
            value: function _appendEager() {
                var _this$_mapPosToBlock;
                var details = new ChangeDetails;
                var startBlockIndex = null === (_this$_mapPosToBlock = this._mapPosToBlock(this.value.length)) || void 0 === _this$_mapPosToBlock ? void 0 : _this$_mapPosToBlock.index;
                if (null == startBlockIndex) return details;
                if (this._blocks[startBlockIndex].isFilled) ++startBlockIndex;
                for (var bi = startBlockIndex; bi < this._blocks.length; ++bi) {
                    var d = this._blocks[bi]._appendEager();
                    if (!d.inserted) break;
                    details.aggregate(d);
                }
                return details;
            }
        }, {
            key: "_appendCharRaw",
            value: function _appendCharRaw(ch) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                var blockIter = this._mapPosToBlock(this.value.length);
                var details = new ChangeDetails;
                if (!blockIter) return details;
                for (var bi = blockIter.index; ;++bi) {
                    var _flags$_beforeTailSta, _flags$_beforeTailSta2;
                    var _block = this._blocks[bi];
                    if (!_block) break;
                    var blockDetails = _block._appendChar(ch, Object.assign({}, flags, {
                        _beforeTailState: null === (_flags$_beforeTailSta = flags._beforeTailState) || void 0 === _flags$_beforeTailSta ? void 0 : null === (_flags$_beforeTailSta2 = _flags$_beforeTailSta._blocks) || void 0 === _flags$_beforeTailSta2 ? void 0 : _flags$_beforeTailSta2[bi]
                    }));
                    var skip = blockDetails.skip;
                    details.aggregate(blockDetails);
                    if (skip || blockDetails.rawInserted) break;
                }
                return details;
            }
        }, {
            key: "extractTail",
            value: function extractTail() {
                var _this2 = this;
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                var chunkTail = new ChunksTailDetails;
                if (fromPos === toPos) return chunkTail;
                this._forEachBlocksInRange(fromPos, toPos, (function(b, bi, bFromPos, bToPos) {
                    var blockChunk = b.extractTail(bFromPos, bToPos);
                    blockChunk.stop = _this2._findStopBefore(bi);
                    blockChunk.from = _this2._blockStartPos(bi);
                    if (blockChunk instanceof ChunksTailDetails) blockChunk.blockIndex = bi;
                    chunkTail.extend(blockChunk);
                }));
                return chunkTail;
            }
        }, {
            key: "extractInput",
            value: function extractInput() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                var flags = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                if (fromPos === toPos) return "";
                var input = "";
                this._forEachBlocksInRange(fromPos, toPos, (function(b, _, fromPos, toPos) {
                    input += b.extractInput(fromPos, toPos, flags);
                }));
                return input;
            }
        }, {
            key: "_findStopBefore",
            value: function _findStopBefore(blockIndex) {
                var stopBefore;
                for (var si = 0; si < this._stops.length; ++si) {
                    var stop = this._stops[si];
                    if (stop <= blockIndex) stopBefore = stop; else break;
                }
                return stopBefore;
            }
        }, {
            key: "_appendPlaceholder",
            value: function _appendPlaceholder(toBlockIndex) {
                var _this3 = this;
                var details = new ChangeDetails;
                if (this.lazy && null == toBlockIndex) return details;
                var startBlockIter = this._mapPosToBlock(this.value.length);
                if (!startBlockIter) return details;
                var startBlockIndex = startBlockIter.index;
                var endBlockIndex = null != toBlockIndex ? toBlockIndex : this._blocks.length;
                this._blocks.slice(startBlockIndex, endBlockIndex).forEach((function(b) {
                    if (!b.lazy || null != toBlockIndex) {
                        var args = null != b._blocks ? [ b._blocks.length ] : [];
                        var bDetails = b._appendPlaceholder.apply(b, args);
                        _this3._value += bDetails.inserted;
                        details.aggregate(bDetails);
                    }
                }));
                return details;
            }
        }, {
            key: "_mapPosToBlock",
            value: function _mapPosToBlock(pos) {
                var accVal = "";
                for (var bi = 0; bi < this._blocks.length; ++bi) {
                    var _block2 = this._blocks[bi];
                    var blockStartPos = accVal.length;
                    accVal += _block2.value;
                    if (pos <= accVal.length) return {
                        index: bi,
                        offset: pos - blockStartPos
                    };
                }
            }
        }, {
            key: "_blockStartPos",
            value: function _blockStartPos(blockIndex) {
                return this._blocks.slice(0, blockIndex).reduce((function(pos, b) {
                    return pos += b.value.length;
                }), 0);
            }
        }, {
            key: "_forEachBlocksInRange",
            value: function _forEachBlocksInRange(fromPos) {
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                var fn = arguments.length > 2 ? arguments[2] : void 0;
                var fromBlockIter = this._mapPosToBlock(fromPos);
                if (fromBlockIter) {
                    var toBlockIter = this._mapPosToBlock(toPos);
                    var isSameBlock = toBlockIter && fromBlockIter.index === toBlockIter.index;
                    var fromBlockStartPos = fromBlockIter.offset;
                    var fromBlockEndPos = toBlockIter && isSameBlock ? toBlockIter.offset : this._blocks[fromBlockIter.index].value.length;
                    fn(this._blocks[fromBlockIter.index], fromBlockIter.index, fromBlockStartPos, fromBlockEndPos);
                    if (toBlockIter && !isSameBlock) {
                        for (var bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) fn(this._blocks[bi], bi, 0, this._blocks[bi].value.length);
                        fn(this._blocks[toBlockIter.index], toBlockIter.index, 0, toBlockIter.offset);
                    }
                }
            }
        }, {
            key: "remove",
            value: function remove() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                var removeDetails = _get(_getPrototypeOf(MaskedPattern.prototype), "remove", this).call(this, fromPos, toPos);
                this._forEachBlocksInRange(fromPos, toPos, (function(b, _, bFromPos, bToPos) {
                    removeDetails.aggregate(b.remove(bFromPos, bToPos));
                }));
                return removeDetails;
            }
        }, {
            key: "nearestInputPos",
            value: function nearestInputPos(cursorPos) {
                var direction = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : DIRECTION.NONE;
                if (!this._blocks.length) return 0;
                var cursor = new PatternCursor(this, cursorPos);
                if (direction === DIRECTION.NONE) {
                    if (cursor.pushRightBeforeInput()) return cursor.pos;
                    cursor.popState();
                    if (cursor.pushLeftBeforeInput()) return cursor.pos;
                    return this.value.length;
                }
                if (direction === DIRECTION.LEFT || direction === DIRECTION.FORCE_LEFT) {
                    if (direction === DIRECTION.LEFT) {
                        cursor.pushRightBeforeFilled();
                        if (cursor.ok && cursor.pos === cursorPos) return cursorPos;
                        cursor.popState();
                    }
                    cursor.pushLeftBeforeInput();
                    cursor.pushLeftBeforeRequired();
                    cursor.pushLeftBeforeFilled();
                    if (direction === DIRECTION.LEFT) {
                        cursor.pushRightBeforeInput();
                        cursor.pushRightBeforeRequired();
                        if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
                        cursor.popState();
                        if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
                        cursor.popState();
                    }
                    if (cursor.ok) return cursor.pos;
                    if (direction === DIRECTION.FORCE_LEFT) return 0;
                    cursor.popState();
                    if (cursor.ok) return cursor.pos;
                    cursor.popState();
                    if (cursor.ok) return cursor.pos;
                    return 0;
                }
                if (direction === DIRECTION.RIGHT || direction === DIRECTION.FORCE_RIGHT) {
                    cursor.pushRightBeforeInput();
                    cursor.pushRightBeforeRequired();
                    if (cursor.pushRightBeforeFilled()) return cursor.pos;
                    if (direction === DIRECTION.FORCE_RIGHT) return this.value.length;
                    cursor.popState();
                    if (cursor.ok) return cursor.pos;
                    cursor.popState();
                    if (cursor.ok) return cursor.pos;
                    return this.nearestInputPos(cursorPos, DIRECTION.LEFT);
                }
                return cursorPos;
            }
        }, {
            key: "maskedBlock",
            value: function maskedBlock(name) {
                return this.maskedBlocks(name)[0];
            }
        }, {
            key: "maskedBlocks",
            value: function maskedBlocks(name) {
                var _this4 = this;
                var indices = this._maskedBlocks[name];
                if (!indices) return [];
                return indices.map((function(gi) {
                    return _this4._blocks[gi];
                }));
            }
        } ]);
        return MaskedPattern;
    }(Masked);
    MaskedPattern.DEFAULTS = {
        lazy: true,
        placeholderChar: "_"
    };
    MaskedPattern.STOP_CHAR = "`";
    MaskedPattern.ESCAPE_CHAR = "\\";
    MaskedPattern.InputDefinition = PatternInputDefinition;
    MaskedPattern.FixedDefinition = PatternFixedDefinition;
    IMask.MaskedPattern = MaskedPattern;
    var MaskedRange = function(_MaskedPattern) {
        _inherits(MaskedRange, _MaskedPattern);
        var _super = _createSuper(MaskedRange);
        function MaskedRange() {
            _classCallCheck(this, MaskedRange);
            return _super.apply(this, arguments);
        }
        _createClass(MaskedRange, [ {
            key: "_matchFrom",
            get: function get() {
                return this.maxLength - String(this.from).length;
            }
        }, {
            key: "_update",
            value: function _update(opts) {
                opts = Object.assign({
                    to: this.to || 0,
                    from: this.from || 0,
                    maxLength: this.maxLength || 0
                }, opts);
                var maxLength = String(opts.to).length;
                if (null != opts.maxLength) maxLength = Math.max(maxLength, opts.maxLength);
                opts.maxLength = maxLength;
                var fromStr = String(opts.from).padStart(maxLength, "0");
                var toStr = String(opts.to).padStart(maxLength, "0");
                var sameCharsCount = 0;
                while (sameCharsCount < toStr.length && toStr[sameCharsCount] === fromStr[sameCharsCount]) ++sameCharsCount;
                opts.mask = toStr.slice(0, sameCharsCount).replace(/0/g, "\\0") + "0".repeat(maxLength - sameCharsCount);
                _get(_getPrototypeOf(MaskedRange.prototype), "_update", this).call(this, opts);
            }
        }, {
            key: "isComplete",
            get: function get() {
                return _get(_getPrototypeOf(MaskedRange.prototype), "isComplete", this) && Boolean(this.value);
            }
        }, {
            key: "boundaries",
            value: function boundaries(str) {
                var minstr = "";
                var maxstr = "";
                var _ref = str.match(/^(\D*)(\d*)(\D*)/) || [], _ref2 = _slicedToArray(_ref, 3), placeholder = _ref2[1], num = _ref2[2];
                if (num) {
                    minstr = "0".repeat(placeholder.length) + num;
                    maxstr = "9".repeat(placeholder.length) + num;
                }
                minstr = minstr.padEnd(this.maxLength, "0");
                maxstr = maxstr.padEnd(this.maxLength, "9");
                return [ minstr, maxstr ];
            }
        }, {
            key: "doPrepare",
            value: function doPrepare(ch) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                var details;
                var _normalizePrepare = normalizePrepare(_get(_getPrototypeOf(MaskedRange.prototype), "doPrepare", this).call(this, ch.replace(/\D/g, ""), flags));
                var _normalizePrepare2 = _slicedToArray(_normalizePrepare, 2);
                ch = _normalizePrepare2[0];
                details = _normalizePrepare2[1];
                if (!this.autofix || !ch) return ch;
                var fromStr = String(this.from).padStart(this.maxLength, "0");
                var toStr = String(this.to).padStart(this.maxLength, "0");
                var nextVal = this.value + ch;
                if (nextVal.length > this.maxLength) return "";
                var _this$boundaries = this.boundaries(nextVal), _this$boundaries2 = _slicedToArray(_this$boundaries, 2), minstr = _this$boundaries2[0], maxstr = _this$boundaries2[1];
                if (Number(maxstr) < this.from) return fromStr[nextVal.length - 1];
                if (Number(minstr) > this.to) {
                    if ("pad" === this.autofix && nextVal.length < this.maxLength) return [ "", details.aggregate(this.append(fromStr[nextVal.length - 1] + ch, flags)) ];
                    return toStr[nextVal.length - 1];
                }
                return ch;
            }
        }, {
            key: "doValidate",
            value: function doValidate() {
                var _get2;
                var str = this.value;
                var firstNonZero = str.search(/[^0]/);
                if (-1 === firstNonZero && str.length <= this._matchFrom) return true;
                var _this$boundaries3 = this.boundaries(str), _this$boundaries4 = _slicedToArray(_this$boundaries3, 2), minstr = _this$boundaries4[0], maxstr = _this$boundaries4[1];
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                return this.from <= Number(maxstr) && Number(minstr) <= this.to && (_get2 = _get(_getPrototypeOf(MaskedRange.prototype), "doValidate", this)).call.apply(_get2, [ this ].concat(args));
            }
        } ]);
        return MaskedRange;
    }(MaskedPattern);
    IMask.MaskedRange = MaskedRange;
    var MaskedDate = function(_MaskedPattern) {
        _inherits(MaskedDate, _MaskedPattern);
        var _super = _createSuper(MaskedDate);
        function MaskedDate(opts) {
            _classCallCheck(this, MaskedDate);
            return _super.call(this, Object.assign({}, MaskedDate.DEFAULTS, opts));
        }
        _createClass(MaskedDate, [ {
            key: "_update",
            value: function _update(opts) {
                if (opts.mask === Date) delete opts.mask;
                if (opts.pattern) opts.mask = opts.pattern;
                var blocks = opts.blocks;
                opts.blocks = Object.assign({}, MaskedDate.GET_DEFAULT_BLOCKS());
                if (opts.min) opts.blocks.Y.from = opts.min.getFullYear();
                if (opts.max) opts.blocks.Y.to = opts.max.getFullYear();
                if (opts.min && opts.max && opts.blocks.Y.from === opts.blocks.Y.to) {
                    opts.blocks.m.from = opts.min.getMonth() + 1;
                    opts.blocks.m.to = opts.max.getMonth() + 1;
                    if (opts.blocks.m.from === opts.blocks.m.to) {
                        opts.blocks.d.from = opts.min.getDate();
                        opts.blocks.d.to = opts.max.getDate();
                    }
                }
                Object.assign(opts.blocks, this.blocks, blocks);
                Object.keys(opts.blocks).forEach((function(bk) {
                    var b = opts.blocks[bk];
                    if (!("autofix" in b) && "autofix" in opts) b.autofix = opts.autofix;
                }));
                _get(_getPrototypeOf(MaskedDate.prototype), "_update", this).call(this, opts);
            }
        }, {
            key: "doValidate",
            value: function doValidate() {
                var _get2;
                var date = this.date;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                return (_get2 = _get(_getPrototypeOf(MaskedDate.prototype), "doValidate", this)).call.apply(_get2, [ this ].concat(args)) && (!this.isComplete || this.isDateExist(this.value) && null != date && (null == this.min || this.min <= date) && (null == this.max || date <= this.max));
            }
        }, {
            key: "isDateExist",
            value: function isDateExist(str) {
                return this.format(this.parse(str, this), this).indexOf(str) >= 0;
            }
        }, {
            key: "date",
            get: function get() {
                return this.typedValue;
            },
            set: function set(date) {
                this.typedValue = date;
            }
        }, {
            key: "typedValue",
            get: function get() {
                return this.isComplete ? _get(_getPrototypeOf(MaskedDate.prototype), "typedValue", this) : null;
            },
            set: function set(value) {
                _set(_getPrototypeOf(MaskedDate.prototype), "typedValue", value, this, true);
            }
        }, {
            key: "maskEquals",
            value: function maskEquals(mask) {
                return mask === Date || _get(_getPrototypeOf(MaskedDate.prototype), "maskEquals", this).call(this, mask);
            }
        } ]);
        return MaskedDate;
    }(MaskedPattern);
    MaskedDate.DEFAULTS = {
        pattern: "d{.}`m{.}`Y",
        format: function format(date) {
            if (!date) return "";
            var day = String(date.getDate()).padStart(2, "0");
            var month = String(date.getMonth() + 1).padStart(2, "0");
            var year = date.getFullYear();
            return [ day, month, year ].join(".");
        },
        parse: function parse(str) {
            var _str$split = str.split("."), _str$split2 = _slicedToArray(_str$split, 3), day = _str$split2[0], month = _str$split2[1], year = _str$split2[2];
            return new Date(year, month - 1, day);
        }
    };
    MaskedDate.GET_DEFAULT_BLOCKS = function() {
        return {
            d: {
                mask: MaskedRange,
                from: 1,
                to: 31,
                maxLength: 2
            },
            m: {
                mask: MaskedRange,
                from: 1,
                to: 12,
                maxLength: 2
            },
            Y: {
                mask: MaskedRange,
                from: 1900,
                to: 9999
            }
        };
    };
    IMask.MaskedDate = MaskedDate;
    var MaskElement = function() {
        function MaskElement() {
            _classCallCheck(this, MaskElement);
        }
        _createClass(MaskElement, [ {
            key: "selectionStart",
            get: function get() {
                var start;
                try {
                    start = this._unsafeSelectionStart;
                } catch (e) {}
                return null != start ? start : this.value.length;
            }
        }, {
            key: "selectionEnd",
            get: function get() {
                var end;
                try {
                    end = this._unsafeSelectionEnd;
                } catch (e) {}
                return null != end ? end : this.value.length;
            }
        }, {
            key: "select",
            value: function select(start, end) {
                if (null == start || null == end || start === this.selectionStart && end === this.selectionEnd) return;
                try {
                    this._unsafeSelect(start, end);
                } catch (e) {}
            }
        }, {
            key: "_unsafeSelect",
            value: function _unsafeSelect(start, end) {}
        }, {
            key: "isActive",
            get: function get() {
                return false;
            }
        }, {
            key: "bindEvents",
            value: function bindEvents(handlers) {}
        }, {
            key: "unbindEvents",
            value: function unbindEvents() {}
        } ]);
        return MaskElement;
    }();
    IMask.MaskElement = MaskElement;
    var HTMLMaskElement = function(_MaskElement) {
        _inherits(HTMLMaskElement, _MaskElement);
        var _super = _createSuper(HTMLMaskElement);
        function HTMLMaskElement(input) {
            var _this;
            _classCallCheck(this, HTMLMaskElement);
            _this = _super.call(this);
            _this.input = input;
            _this._handlers = {};
            return _this;
        }
        _createClass(HTMLMaskElement, [ {
            key: "rootElement",
            get: function get() {
                var _this$input$getRootNo, _this$input$getRootNo2, _this$input;
                return null !== (_this$input$getRootNo = null === (_this$input$getRootNo2 = (_this$input = this.input).getRootNode) || void 0 === _this$input$getRootNo2 ? void 0 : _this$input$getRootNo2.call(_this$input)) && void 0 !== _this$input$getRootNo ? _this$input$getRootNo : document;
            }
        }, {
            key: "isActive",
            get: function get() {
                return this.input === this.rootElement.activeElement;
            }
        }, {
            key: "_unsafeSelectionStart",
            get: function get() {
                return this.input.selectionStart;
            }
        }, {
            key: "_unsafeSelectionEnd",
            get: function get() {
                return this.input.selectionEnd;
            }
        }, {
            key: "_unsafeSelect",
            value: function _unsafeSelect(start, end) {
                this.input.setSelectionRange(start, end);
            }
        }, {
            key: "value",
            get: function get() {
                return this.input.value;
            },
            set: function set(value) {
                this.input.value = value;
            }
        }, {
            key: "bindEvents",
            value: function bindEvents(handlers) {
                var _this2 = this;
                Object.keys(handlers).forEach((function(event) {
                    return _this2._toggleEventHandler(HTMLMaskElement.EVENTS_MAP[event], handlers[event]);
                }));
            }
        }, {
            key: "unbindEvents",
            value: function unbindEvents() {
                var _this3 = this;
                Object.keys(this._handlers).forEach((function(event) {
                    return _this3._toggleEventHandler(event);
                }));
            }
        }, {
            key: "_toggleEventHandler",
            value: function _toggleEventHandler(event, handler) {
                if (this._handlers[event]) {
                    this.input.removeEventListener(event, this._handlers[event]);
                    delete this._handlers[event];
                }
                if (handler) {
                    this.input.addEventListener(event, handler);
                    this._handlers[event] = handler;
                }
            }
        } ]);
        return HTMLMaskElement;
    }(MaskElement);
    HTMLMaskElement.EVENTS_MAP = {
        selectionChange: "keydown",
        input: "input",
        drop: "drop",
        click: "click",
        focus: "focus",
        commit: "blur"
    };
    IMask.HTMLMaskElement = HTMLMaskElement;
    var HTMLContenteditableMaskElement = function(_HTMLMaskElement) {
        _inherits(HTMLContenteditableMaskElement, _HTMLMaskElement);
        var _super = _createSuper(HTMLContenteditableMaskElement);
        function HTMLContenteditableMaskElement() {
            _classCallCheck(this, HTMLContenteditableMaskElement);
            return _super.apply(this, arguments);
        }
        _createClass(HTMLContenteditableMaskElement, [ {
            key: "_unsafeSelectionStart",
            get: function get() {
                var root = this.rootElement;
                var selection = root.getSelection && root.getSelection();
                var anchorOffset = selection && selection.anchorOffset;
                var focusOffset = selection && selection.focusOffset;
                if (null == focusOffset || null == anchorOffset || anchorOffset < focusOffset) return anchorOffset;
                return focusOffset;
            }
        }, {
            key: "_unsafeSelectionEnd",
            get: function get() {
                var root = this.rootElement;
                var selection = root.getSelection && root.getSelection();
                var anchorOffset = selection && selection.anchorOffset;
                var focusOffset = selection && selection.focusOffset;
                if (null == focusOffset || null == anchorOffset || anchorOffset > focusOffset) return anchorOffset;
                return focusOffset;
            }
        }, {
            key: "_unsafeSelect",
            value: function _unsafeSelect(start, end) {
                if (!this.rootElement.createRange) return;
                var range = this.rootElement.createRange();
                range.setStart(this.input.firstChild || this.input, start);
                range.setEnd(this.input.lastChild || this.input, end);
                var root = this.rootElement;
                var selection = root.getSelection && root.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }, {
            key: "value",
            get: function get() {
                return this.input.textContent;
            },
            set: function set(value) {
                this.input.textContent = value;
            }
        } ]);
        return HTMLContenteditableMaskElement;
    }(HTMLMaskElement);
    IMask.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;
    var input_excluded = [ "mask" ];
    var InputMask = function() {
        function InputMask(el, opts) {
            _classCallCheck(this, InputMask);
            this.el = el instanceof MaskElement ? el : el.isContentEditable && "INPUT" !== el.tagName && "TEXTAREA" !== el.tagName ? new HTMLContenteditableMaskElement(el) : new HTMLMaskElement(el);
            this.masked = createMask(opts);
            this._listeners = {};
            this._value = "";
            this._unmaskedValue = "";
            this._saveSelection = this._saveSelection.bind(this);
            this._onInput = this._onInput.bind(this);
            this._onChange = this._onChange.bind(this);
            this._onDrop = this._onDrop.bind(this);
            this._onFocus = this._onFocus.bind(this);
            this._onClick = this._onClick.bind(this);
            this.alignCursor = this.alignCursor.bind(this);
            this.alignCursorFriendly = this.alignCursorFriendly.bind(this);
            this._bindEvents();
            this.updateValue();
            this._onChange();
        }
        _createClass(InputMask, [ {
            key: "mask",
            get: function get() {
                return this.masked.mask;
            },
            set: function set(mask) {
                if (this.maskEquals(mask)) return;
                if (!(mask instanceof IMask.Masked) && this.masked.constructor === maskedClass(mask)) {
                    this.masked.updateOptions({
                        mask
                    });
                    return;
                }
                var masked = createMask({
                    mask
                });
                masked.unmaskedValue = this.masked.unmaskedValue;
                this.masked = masked;
            }
        }, {
            key: "maskEquals",
            value: function maskEquals(mask) {
                var _this$masked;
                return null == mask || (null === (_this$masked = this.masked) || void 0 === _this$masked ? void 0 : _this$masked.maskEquals(mask));
            }
        }, {
            key: "value",
            get: function get() {
                return this._value;
            },
            set: function set(str) {
                if (this.value === str) return;
                this.masked.value = str;
                this.updateControl();
                this.alignCursor();
            }
        }, {
            key: "unmaskedValue",
            get: function get() {
                return this._unmaskedValue;
            },
            set: function set(str) {
                if (this.unmaskedValue === str) return;
                this.masked.unmaskedValue = str;
                this.updateControl();
                this.alignCursor();
            }
        }, {
            key: "typedValue",
            get: function get() {
                return this.masked.typedValue;
            },
            set: function set(val) {
                if (this.masked.typedValueEquals(val)) return;
                this.masked.typedValue = val;
                this.updateControl();
                this.alignCursor();
            }
        }, {
            key: "_bindEvents",
            value: function _bindEvents() {
                this.el.bindEvents({
                    selectionChange: this._saveSelection,
                    input: this._onInput,
                    drop: this._onDrop,
                    click: this._onClick,
                    focus: this._onFocus,
                    commit: this._onChange
                });
            }
        }, {
            key: "_unbindEvents",
            value: function _unbindEvents() {
                if (this.el) this.el.unbindEvents();
            }
        }, {
            key: "_fireEvent",
            value: function _fireEvent(ev) {
                for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
                var listeners = this._listeners[ev];
                if (!listeners) return;
                listeners.forEach((function(l) {
                    return l.apply(void 0, args);
                }));
            }
        }, {
            key: "selectionStart",
            get: function get() {
                return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
            }
        }, {
            key: "cursorPos",
            get: function get() {
                return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
            },
            set: function set(pos) {
                if (!this.el || !this.el.isActive) return;
                this.el.select(pos, pos);
                this._saveSelection();
            }
        }, {
            key: "_saveSelection",
            value: function _saveSelection() {
                if (this.value !== this.el.value) console.warn("Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.");
                this._selection = {
                    start: this.selectionStart,
                    end: this.cursorPos
                };
            }
        }, {
            key: "updateValue",
            value: function updateValue() {
                this.masked.value = this.el.value;
                this._value = this.masked.value;
            }
        }, {
            key: "updateControl",
            value: function updateControl() {
                var newUnmaskedValue = this.masked.unmaskedValue;
                var newValue = this.masked.value;
                var isChanged = this.unmaskedValue !== newUnmaskedValue || this.value !== newValue;
                this._unmaskedValue = newUnmaskedValue;
                this._value = newValue;
                if (this.el.value !== newValue) this.el.value = newValue;
                if (isChanged) this._fireChangeEvents();
            }
        }, {
            key: "updateOptions",
            value: function updateOptions(opts) {
                var mask = opts.mask, restOpts = _objectWithoutProperties(opts, input_excluded);
                var updateMask = !this.maskEquals(mask);
                var updateOpts = !objectIncludes(this.masked, restOpts);
                if (updateMask) this.mask = mask;
                if (updateOpts) this.masked.updateOptions(restOpts);
                if (updateMask || updateOpts) this.updateControl();
            }
        }, {
            key: "updateCursor",
            value: function updateCursor(cursorPos) {
                if (null == cursorPos) return;
                this.cursorPos = cursorPos;
                this._delayUpdateCursor(cursorPos);
            }
        }, {
            key: "_delayUpdateCursor",
            value: function _delayUpdateCursor(cursorPos) {
                var _this = this;
                this._abortUpdateCursor();
                this._changingCursorPos = cursorPos;
                this._cursorChanging = setTimeout((function() {
                    if (!_this.el) return;
                    _this.cursorPos = _this._changingCursorPos;
                    _this._abortUpdateCursor();
                }), 10);
            }
        }, {
            key: "_fireChangeEvents",
            value: function _fireChangeEvents() {
                this._fireEvent("accept", this._inputEvent);
                if (this.masked.isComplete) this._fireEvent("complete", this._inputEvent);
            }
        }, {
            key: "_abortUpdateCursor",
            value: function _abortUpdateCursor() {
                if (this._cursorChanging) {
                    clearTimeout(this._cursorChanging);
                    delete this._cursorChanging;
                }
            }
        }, {
            key: "alignCursor",
            value: function alignCursor() {
                this.cursorPos = this.masked.nearestInputPos(this.masked.nearestInputPos(this.cursorPos, DIRECTION.LEFT));
            }
        }, {
            key: "alignCursorFriendly",
            value: function alignCursorFriendly() {
                if (this.selectionStart !== this.cursorPos) return;
                this.alignCursor();
            }
        }, {
            key: "on",
            value: function on(ev, handler) {
                if (!this._listeners[ev]) this._listeners[ev] = [];
                this._listeners[ev].push(handler);
                return this;
            }
        }, {
            key: "off",
            value: function off(ev, handler) {
                if (!this._listeners[ev]) return this;
                if (!handler) {
                    delete this._listeners[ev];
                    return this;
                }
                var hIndex = this._listeners[ev].indexOf(handler);
                if (hIndex >= 0) this._listeners[ev].splice(hIndex, 1);
                return this;
            }
        }, {
            key: "_onInput",
            value: function _onInput(e) {
                this._inputEvent = e;
                this._abortUpdateCursor();
                if (!this._selection) return this.updateValue();
                var details = new ActionDetails(this.el.value, this.cursorPos, this.value, this._selection);
                var oldRawValue = this.masked.rawInputValue;
                var offset = this.masked.splice(details.startChangePos, details.removed.length, details.inserted, details.removeDirection, {
                    input: true,
                    raw: true
                }).offset;
                var removeDirection = oldRawValue === this.masked.rawInputValue ? details.removeDirection : DIRECTION.NONE;
                var cursorPos = this.masked.nearestInputPos(details.startChangePos + offset, removeDirection);
                if (removeDirection !== DIRECTION.NONE) cursorPos = this.masked.nearestInputPos(cursorPos, DIRECTION.NONE);
                this.updateControl();
                this.updateCursor(cursorPos);
                delete this._inputEvent;
            }
        }, {
            key: "_onChange",
            value: function _onChange() {
                if (this.value !== this.el.value) this.updateValue();
                this.masked.doCommit();
                this.updateControl();
                this._saveSelection();
            }
        }, {
            key: "_onDrop",
            value: function _onDrop(ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
        }, {
            key: "_onFocus",
            value: function _onFocus(ev) {
                this.alignCursorFriendly();
            }
        }, {
            key: "_onClick",
            value: function _onClick(ev) {
                this.alignCursorFriendly();
            }
        }, {
            key: "destroy",
            value: function destroy() {
                this._unbindEvents();
                this._listeners.length = 0;
                delete this.el;
            }
        } ]);
        return InputMask;
    }();
    IMask.InputMask = InputMask;
    var MaskedEnum = function(_MaskedPattern) {
        _inherits(MaskedEnum, _MaskedPattern);
        var _super = _createSuper(MaskedEnum);
        function MaskedEnum() {
            _classCallCheck(this, MaskedEnum);
            return _super.apply(this, arguments);
        }
        _createClass(MaskedEnum, [ {
            key: "_update",
            value: function _update(opts) {
                if (opts.enum) opts.mask = "*".repeat(opts.enum[0].length);
                _get(_getPrototypeOf(MaskedEnum.prototype), "_update", this).call(this, opts);
            }
        }, {
            key: "doValidate",
            value: function doValidate() {
                var _get2, _this = this;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                return this.enum.some((function(e) {
                    return e.indexOf(_this.unmaskedValue) >= 0;
                })) && (_get2 = _get(_getPrototypeOf(MaskedEnum.prototype), "doValidate", this)).call.apply(_get2, [ this ].concat(args));
            }
        } ]);
        return MaskedEnum;
    }(MaskedPattern);
    IMask.MaskedEnum = MaskedEnum;
    var MaskedNumber = function(_Masked) {
        _inherits(MaskedNumber, _Masked);
        var _super = _createSuper(MaskedNumber);
        function MaskedNumber(opts) {
            _classCallCheck(this, MaskedNumber);
            return _super.call(this, Object.assign({}, MaskedNumber.DEFAULTS, opts));
        }
        _createClass(MaskedNumber, [ {
            key: "_update",
            value: function _update(opts) {
                _get(_getPrototypeOf(MaskedNumber.prototype), "_update", this).call(this, opts);
                this._updateRegExps();
            }
        }, {
            key: "_updateRegExps",
            value: function _updateRegExps() {
                var start = "^" + (this.allowNegative ? "[+|\\-]?" : "");
                var midInput = "(0|([1-9]+\\d*))?";
                var mid = "\\d*";
                var end = (this.scale ? "(" + escapeRegExp(this.radix) + "\\d{0," + this.scale + "})?" : "") + "$";
                this._numberRegExpInput = new RegExp(start + midInput + end);
                this._numberRegExp = new RegExp(start + mid + end);
                this._mapToRadixRegExp = new RegExp("[" + this.mapToRadix.map(escapeRegExp).join("") + "]", "g");
                this._thousandsSeparatorRegExp = new RegExp(escapeRegExp(this.thousandsSeparator), "g");
            }
        }, {
            key: "_removeThousandsSeparators",
            value: function _removeThousandsSeparators(value) {
                return value.replace(this._thousandsSeparatorRegExp, "");
            }
        }, {
            key: "_insertThousandsSeparators",
            value: function _insertThousandsSeparators(value) {
                var parts = value.split(this.radix);
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
                return parts.join(this.radix);
            }
        }, {
            key: "doPrepare",
            value: function doPrepare(ch) {
                var _get2;
                ch = ch.replace(this._mapToRadixRegExp, this.radix);
                var noSepCh = this._removeThousandsSeparators(ch);
                for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
                var _normalizePrepare = normalizePrepare((_get2 = _get(_getPrototypeOf(MaskedNumber.prototype), "doPrepare", this)).call.apply(_get2, [ this, noSepCh ].concat(args))), _normalizePrepare2 = _slicedToArray(_normalizePrepare, 2), prepCh = _normalizePrepare2[0], details = _normalizePrepare2[1];
                if (ch && !noSepCh) details.skip = true;
                return [ prepCh, details ];
            }
        }, {
            key: "_separatorsCount",
            value: function _separatorsCount(to) {
                var extendOnSeparators = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : false;
                var count = 0;
                for (var pos = 0; pos < to; ++pos) if (this._value.indexOf(this.thousandsSeparator, pos) === pos) {
                    ++count;
                    if (extendOnSeparators) to += this.thousandsSeparator.length;
                }
                return count;
            }
        }, {
            key: "_separatorsCountFromSlice",
            value: function _separatorsCountFromSlice() {
                var slice = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this._value;
                return this._separatorsCount(this._removeThousandsSeparators(slice).length, true);
            }
        }, {
            key: "extractInput",
            value: function extractInput() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                var flags = arguments.length > 2 ? arguments[2] : void 0;
                var _this$_adjustRangeWit = this._adjustRangeWithSeparators(fromPos, toPos);
                var _this$_adjustRangeWit2 = _slicedToArray(_this$_adjustRangeWit, 2);
                fromPos = _this$_adjustRangeWit2[0];
                toPos = _this$_adjustRangeWit2[1];
                return this._removeThousandsSeparators(_get(_getPrototypeOf(MaskedNumber.prototype), "extractInput", this).call(this, fromPos, toPos, flags));
            }
        }, {
            key: "_appendCharRaw",
            value: function _appendCharRaw(ch) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                if (!this.thousandsSeparator) return _get(_getPrototypeOf(MaskedNumber.prototype), "_appendCharRaw", this).call(this, ch, flags);
                var prevBeforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
                var prevBeforeTailSeparatorsCount = this._separatorsCountFromSlice(prevBeforeTailValue);
                this._value = this._removeThousandsSeparators(this.value);
                var appendDetails = _get(_getPrototypeOf(MaskedNumber.prototype), "_appendCharRaw", this).call(this, ch, flags);
                this._value = this._insertThousandsSeparators(this._value);
                var beforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
                var beforeTailSeparatorsCount = this._separatorsCountFromSlice(beforeTailValue);
                appendDetails.tailShift += (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length;
                appendDetails.skip = !appendDetails.rawInserted && ch === this.thousandsSeparator;
                return appendDetails;
            }
        }, {
            key: "_findSeparatorAround",
            value: function _findSeparatorAround(pos) {
                if (this.thousandsSeparator) {
                    var searchFrom = pos - this.thousandsSeparator.length + 1;
                    var separatorPos = this.value.indexOf(this.thousandsSeparator, searchFrom);
                    if (separatorPos <= pos) return separatorPos;
                }
                return -1;
            }
        }, {
            key: "_adjustRangeWithSeparators",
            value: function _adjustRangeWithSeparators(from, to) {
                var separatorAroundFromPos = this._findSeparatorAround(from);
                if (separatorAroundFromPos >= 0) from = separatorAroundFromPos;
                var separatorAroundToPos = this._findSeparatorAround(to);
                if (separatorAroundToPos >= 0) to = separatorAroundToPos + this.thousandsSeparator.length;
                return [ from, to ];
            }
        }, {
            key: "remove",
            value: function remove() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                var _this$_adjustRangeWit3 = this._adjustRangeWithSeparators(fromPos, toPos);
                var _this$_adjustRangeWit4 = _slicedToArray(_this$_adjustRangeWit3, 2);
                fromPos = _this$_adjustRangeWit4[0];
                toPos = _this$_adjustRangeWit4[1];
                var valueBeforePos = this.value.slice(0, fromPos);
                var valueAfterPos = this.value.slice(toPos);
                var prevBeforeTailSeparatorsCount = this._separatorsCount(valueBeforePos.length);
                this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(valueBeforePos + valueAfterPos));
                var beforeTailSeparatorsCount = this._separatorsCountFromSlice(valueBeforePos);
                return new ChangeDetails({
                    tailShift: (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length
                });
            }
        }, {
            key: "nearestInputPos",
            value: function nearestInputPos(cursorPos, direction) {
                if (!this.thousandsSeparator) return cursorPos;
                switch (direction) {
                  case DIRECTION.NONE:
                  case DIRECTION.LEFT:
                  case DIRECTION.FORCE_LEFT:
                    var separatorAtLeftPos = this._findSeparatorAround(cursorPos - 1);
                    if (separatorAtLeftPos >= 0) {
                        var separatorAtLeftEndPos = separatorAtLeftPos + this.thousandsSeparator.length;
                        if (cursorPos < separatorAtLeftEndPos || this.value.length <= separatorAtLeftEndPos || direction === DIRECTION.FORCE_LEFT) return separatorAtLeftPos;
                    }
                    break;

                  case DIRECTION.RIGHT:
                  case DIRECTION.FORCE_RIGHT:
                    var separatorAtRightPos = this._findSeparatorAround(cursorPos);
                    if (separatorAtRightPos >= 0) return separatorAtRightPos + this.thousandsSeparator.length;
                }
                return cursorPos;
            }
        }, {
            key: "doValidate",
            value: function doValidate(flags) {
                var regexp = flags.input ? this._numberRegExpInput : this._numberRegExp;
                var valid = regexp.test(this._removeThousandsSeparators(this.value));
                if (valid) {
                    var number = this.number;
                    valid = valid && !isNaN(number) && (null == this.min || this.min >= 0 || this.min <= this.number) && (null == this.max || this.max <= 0 || this.number <= this.max);
                }
                return valid && _get(_getPrototypeOf(MaskedNumber.prototype), "doValidate", this).call(this, flags);
            }
        }, {
            key: "doCommit",
            value: function doCommit() {
                if (this.value) {
                    var number = this.number;
                    var validnum = number;
                    if (null != this.min) validnum = Math.max(validnum, this.min);
                    if (null != this.max) validnum = Math.min(validnum, this.max);
                    if (validnum !== number) this.unmaskedValue = String(validnum);
                    var formatted = this.value;
                    if (this.normalizeZeros) formatted = this._normalizeZeros(formatted);
                    if (this.padFractionalZeros && this.scale > 0) formatted = this._padFractionalZeros(formatted);
                    this._value = formatted;
                }
                _get(_getPrototypeOf(MaskedNumber.prototype), "doCommit", this).call(this);
            }
        }, {
            key: "_normalizeZeros",
            value: function _normalizeZeros(value) {
                var parts = this._removeThousandsSeparators(value).split(this.radix);
                parts[0] = parts[0].replace(/^(\D*)(0*)(\d*)/, (function(match, sign, zeros, num) {
                    return sign + num;
                }));
                if (value.length && !/\d$/.test(parts[0])) parts[0] = parts[0] + "0";
                if (parts.length > 1) {
                    parts[1] = parts[1].replace(/0*$/, "");
                    if (!parts[1].length) parts.length = 1;
                }
                return this._insertThousandsSeparators(parts.join(this.radix));
            }
        }, {
            key: "_padFractionalZeros",
            value: function _padFractionalZeros(value) {
                if (!value) return value;
                var parts = value.split(this.radix);
                if (parts.length < 2) parts.push("");
                parts[1] = parts[1].padEnd(this.scale, "0");
                return parts.join(this.radix);
            }
        }, {
            key: "unmaskedValue",
            get: function get() {
                return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, ".");
            },
            set: function set(unmaskedValue) {
                _set(_getPrototypeOf(MaskedNumber.prototype), "unmaskedValue", unmaskedValue.replace(".", this.radix), this, true);
            }
        }, {
            key: "typedValue",
            get: function get() {
                return Number(this.unmaskedValue);
            },
            set: function set(n) {
                _set(_getPrototypeOf(MaskedNumber.prototype), "unmaskedValue", String(n), this, true);
            }
        }, {
            key: "number",
            get: function get() {
                return this.typedValue;
            },
            set: function set(number) {
                this.typedValue = number;
            }
        }, {
            key: "allowNegative",
            get: function get() {
                return this.signed || null != this.min && this.min < 0 || null != this.max && this.max < 0;
            }
        }, {
            key: "typedValueEquals",
            value: function typedValueEquals(value) {
                return (_get(_getPrototypeOf(MaskedNumber.prototype), "typedValueEquals", this).call(this, value) || MaskedNumber.EMPTY_VALUES.includes(value) && MaskedNumber.EMPTY_VALUES.includes(this.typedValue)) && !(0 === value && "" === this.value);
            }
        } ]);
        return MaskedNumber;
    }(Masked);
    MaskedNumber.DEFAULTS = {
        radix: ",",
        thousandsSeparator: "",
        mapToRadix: [ "." ],
        scale: 2,
        signed: false,
        normalizeZeros: true,
        padFractionalZeros: false
    };
    MaskedNumber.EMPTY_VALUES = [].concat(_toConsumableArray(Masked.EMPTY_VALUES), [ 0 ]);
    IMask.MaskedNumber = MaskedNumber;
    var MaskedFunction = function(_Masked) {
        _inherits(MaskedFunction, _Masked);
        var _super = _createSuper(MaskedFunction);
        function MaskedFunction() {
            _classCallCheck(this, MaskedFunction);
            return _super.apply(this, arguments);
        }
        _createClass(MaskedFunction, [ {
            key: "_update",
            value: function _update(opts) {
                if (opts.mask) opts.validate = opts.mask;
                _get(_getPrototypeOf(MaskedFunction.prototype), "_update", this).call(this, opts);
            }
        } ]);
        return MaskedFunction;
    }(Masked);
    IMask.MaskedFunction = MaskedFunction;
    var dynamic_excluded = [ "compiledMasks", "currentMaskRef", "currentMask" ];
    var MaskedDynamic = function(_Masked) {
        _inherits(MaskedDynamic, _Masked);
        var _super = _createSuper(MaskedDynamic);
        function MaskedDynamic(opts) {
            var _this;
            _classCallCheck(this, MaskedDynamic);
            _this = _super.call(this, Object.assign({}, MaskedDynamic.DEFAULTS, opts));
            _this.currentMask = null;
            return _this;
        }
        _createClass(MaskedDynamic, [ {
            key: "_update",
            value: function _update(opts) {
                _get(_getPrototypeOf(MaskedDynamic.prototype), "_update", this).call(this, opts);
                if ("mask" in opts) this.compiledMasks = Array.isArray(opts.mask) ? opts.mask.map((function(m) {
                    return createMask(m);
                })) : [];
            }
        }, {
            key: "_appendCharRaw",
            value: function _appendCharRaw(ch) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                var details = this._applyDispatch(ch, flags);
                if (this.currentMask) details.aggregate(this.currentMask._appendChar(ch, this.currentMaskFlags(flags)));
                return details;
            }
        }, {
            key: "_applyDispatch",
            value: function _applyDispatch() {
                var appended = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                var prevValueBeforeTail = flags.tail && null != flags._beforeTailState ? flags._beforeTailState._value : this.value;
                var inputValue = this.rawInputValue;
                var insertValue = flags.tail && null != flags._beforeTailState ? flags._beforeTailState._rawInputValue : inputValue;
                var tailValue = inputValue.slice(insertValue.length);
                var prevMask = this.currentMask;
                var details = new ChangeDetails;
                var prevMaskState = null === prevMask || void 0 === prevMask ? void 0 : prevMask.state;
                this.currentMask = this.doDispatch(appended, Object.assign({}, flags));
                if (this.currentMask) if (this.currentMask !== prevMask) {
                    this.currentMask.reset();
                    if (insertValue) {
                        var d = this.currentMask.append(insertValue, {
                            raw: true
                        });
                        details.tailShift = d.inserted.length - prevValueBeforeTail.length;
                    }
                    if (tailValue) details.tailShift += this.currentMask.append(tailValue, {
                        raw: true,
                        tail: true
                    }).tailShift;
                } else this.currentMask.state = prevMaskState;
                return details;
            }
        }, {
            key: "_appendPlaceholder",
            value: function _appendPlaceholder() {
                var details = this._applyDispatch.apply(this, arguments);
                if (this.currentMask) details.aggregate(this.currentMask._appendPlaceholder());
                return details;
            }
        }, {
            key: "_appendEager",
            value: function _appendEager() {
                var details = this._applyDispatch.apply(this, arguments);
                if (this.currentMask) details.aggregate(this.currentMask._appendEager());
                return details;
            }
        }, {
            key: "currentMaskFlags",
            value: function currentMaskFlags(flags) {
                var _flags$_beforeTailSta, _flags$_beforeTailSta2;
                return Object.assign({}, flags, {
                    _beforeTailState: (null === (_flags$_beforeTailSta = flags._beforeTailState) || void 0 === _flags$_beforeTailSta ? void 0 : _flags$_beforeTailSta.currentMaskRef) === this.currentMask && (null === (_flags$_beforeTailSta2 = flags._beforeTailState) || void 0 === _flags$_beforeTailSta2 ? void 0 : _flags$_beforeTailSta2.currentMask) || flags._beforeTailState
                });
            }
        }, {
            key: "doDispatch",
            value: function doDispatch(appended) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                return this.dispatch(appended, this, flags);
            }
        }, {
            key: "doValidate",
            value: function doValidate(flags) {
                return _get(_getPrototypeOf(MaskedDynamic.prototype), "doValidate", this).call(this, flags) && (!this.currentMask || this.currentMask.doValidate(this.currentMaskFlags(flags)));
            }
        }, {
            key: "doPrepare",
            value: function doPrepare(str) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                var _normalizePrepare = normalizePrepare(_get(_getPrototypeOf(MaskedDynamic.prototype), "doPrepare", this).call(this, str, flags)), _normalizePrepare2 = _slicedToArray(_normalizePrepare, 2), s = _normalizePrepare2[0], details = _normalizePrepare2[1];
                if (this.currentMask) {
                    var currentDetails;
                    var _normalizePrepare3 = normalizePrepare(_get(_getPrototypeOf(MaskedDynamic.prototype), "doPrepare", this).call(this, s, this.currentMaskFlags(flags)));
                    var _normalizePrepare4 = _slicedToArray(_normalizePrepare3, 2);
                    s = _normalizePrepare4[0];
                    currentDetails = _normalizePrepare4[1];
                    details = details.aggregate(currentDetails);
                }
                return [ s, details ];
            }
        }, {
            key: "reset",
            value: function reset() {
                var _this$currentMask;
                null === (_this$currentMask = this.currentMask) || void 0 === _this$currentMask ? void 0 : _this$currentMask.reset();
                this.compiledMasks.forEach((function(m) {
                    return m.reset();
                }));
            }
        }, {
            key: "value",
            get: function get() {
                return this.currentMask ? this.currentMask.value : "";
            },
            set: function set(value) {
                _set(_getPrototypeOf(MaskedDynamic.prototype), "value", value, this, true);
            }
        }, {
            key: "unmaskedValue",
            get: function get() {
                return this.currentMask ? this.currentMask.unmaskedValue : "";
            },
            set: function set(unmaskedValue) {
                _set(_getPrototypeOf(MaskedDynamic.prototype), "unmaskedValue", unmaskedValue, this, true);
            }
        }, {
            key: "typedValue",
            get: function get() {
                return this.currentMask ? this.currentMask.typedValue : "";
            },
            set: function set(value) {
                var unmaskedValue = String(value);
                if (this.currentMask) {
                    this.currentMask.typedValue = value;
                    unmaskedValue = this.currentMask.unmaskedValue;
                }
                this.unmaskedValue = unmaskedValue;
            }
        }, {
            key: "isComplete",
            get: function get() {
                var _this$currentMask2;
                return Boolean(null === (_this$currentMask2 = this.currentMask) || void 0 === _this$currentMask2 ? void 0 : _this$currentMask2.isComplete);
            }
        }, {
            key: "isFilled",
            get: function get() {
                var _this$currentMask3;
                return Boolean(null === (_this$currentMask3 = this.currentMask) || void 0 === _this$currentMask3 ? void 0 : _this$currentMask3.isFilled);
            }
        }, {
            key: "remove",
            value: function remove() {
                var details = new ChangeDetails;
                if (this.currentMask) {
                    var _this$currentMask4;
                    details.aggregate((_this$currentMask4 = this.currentMask).remove.apply(_this$currentMask4, arguments)).aggregate(this._applyDispatch());
                }
                return details;
            }
        }, {
            key: "state",
            get: function get() {
                var _this$currentMask5;
                return Object.assign({}, _get(_getPrototypeOf(MaskedDynamic.prototype), "state", this), {
                    _rawInputValue: this.rawInputValue,
                    compiledMasks: this.compiledMasks.map((function(m) {
                        return m.state;
                    })),
                    currentMaskRef: this.currentMask,
                    currentMask: null === (_this$currentMask5 = this.currentMask) || void 0 === _this$currentMask5 ? void 0 : _this$currentMask5.state
                });
            },
            set: function set(state) {
                var compiledMasks = state.compiledMasks, currentMaskRef = state.currentMaskRef, currentMask = state.currentMask, maskedState = _objectWithoutProperties(state, dynamic_excluded);
                this.compiledMasks.forEach((function(m, mi) {
                    return m.state = compiledMasks[mi];
                }));
                if (null != currentMaskRef) {
                    this.currentMask = currentMaskRef;
                    this.currentMask.state = currentMask;
                }
                _set(_getPrototypeOf(MaskedDynamic.prototype), "state", maskedState, this, true);
            }
        }, {
            key: "extractInput",
            value: function extractInput() {
                var _this$currentMask6;
                return this.currentMask ? (_this$currentMask6 = this.currentMask).extractInput.apply(_this$currentMask6, arguments) : "";
            }
        }, {
            key: "extractTail",
            value: function extractTail() {
                var _this$currentMask7, _get2;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                return this.currentMask ? (_this$currentMask7 = this.currentMask).extractTail.apply(_this$currentMask7, args) : (_get2 = _get(_getPrototypeOf(MaskedDynamic.prototype), "extractTail", this)).call.apply(_get2, [ this ].concat(args));
            }
        }, {
            key: "doCommit",
            value: function doCommit() {
                if (this.currentMask) this.currentMask.doCommit();
                _get(_getPrototypeOf(MaskedDynamic.prototype), "doCommit", this).call(this);
            }
        }, {
            key: "nearestInputPos",
            value: function nearestInputPos() {
                var _this$currentMask8, _get3;
                for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
                return this.currentMask ? (_this$currentMask8 = this.currentMask).nearestInputPos.apply(_this$currentMask8, args) : (_get3 = _get(_getPrototypeOf(MaskedDynamic.prototype), "nearestInputPos", this)).call.apply(_get3, [ this ].concat(args));
            }
        }, {
            key: "overwrite",
            get: function get() {
                return this.currentMask ? this.currentMask.overwrite : _get(_getPrototypeOf(MaskedDynamic.prototype), "overwrite", this);
            },
            set: function set(overwrite) {
                console.warn('"overwrite" option is not available in dynamic mask, use this option in siblings');
            }
        }, {
            key: "eager",
            get: function get() {
                return this.currentMask ? this.currentMask.eager : _get(_getPrototypeOf(MaskedDynamic.prototype), "eager", this);
            },
            set: function set(eager) {
                console.warn('"eager" option is not available in dynamic mask, use this option in siblings');
            }
        }, {
            key: "maskEquals",
            value: function maskEquals(mask) {
                return Array.isArray(mask) && this.compiledMasks.every((function(m, mi) {
                    var _mask$mi;
                    return m.maskEquals(null === (_mask$mi = mask[mi]) || void 0 === _mask$mi ? void 0 : _mask$mi.mask);
                }));
            }
        }, {
            key: "typedValueEquals",
            value: function typedValueEquals(value) {
                var _this$currentMask9;
                return Boolean(null === (_this$currentMask9 = this.currentMask) || void 0 === _this$currentMask9 ? void 0 : _this$currentMask9.typedValueEquals(value));
            }
        } ]);
        return MaskedDynamic;
    }(Masked);
    MaskedDynamic.DEFAULTS = {
        dispatch: function dispatch(appended, masked, flags) {
            if (!masked.compiledMasks.length) return;
            var inputValue = masked.rawInputValue;
            var inputs = masked.compiledMasks.map((function(m, index) {
                m.reset();
                m.append(inputValue, {
                    raw: true
                });
                m.append(appended, masked.currentMaskFlags(flags));
                var weight = m.rawInputValue.length;
                return {
                    weight,
                    index
                };
            }));
            inputs.sort((function(i1, i2) {
                return i2.weight - i1.weight;
            }));
            return masked.compiledMasks[inputs[0].index];
        }
    };
    IMask.MaskedDynamic = MaskedDynamic;
    var PIPE_TYPE = {
        MASKED: "value",
        UNMASKED: "unmaskedValue",
        TYPED: "typedValue"
    };
    function createPipe(mask) {
        var from = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : PIPE_TYPE.MASKED;
        var to = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : PIPE_TYPE.MASKED;
        var masked = createMask(mask);
        return function(value) {
            return masked.runIsolated((function(m) {
                m[from] = value;
                return m[to];
            }));
        };
    }
    function pipe(value) {
        for (var _len = arguments.length, pipeArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) pipeArgs[_key - 1] = arguments[_key];
        return createPipe.apply(void 0, pipeArgs)(value);
    }
    IMask.PIPE_TYPE = PIPE_TYPE;
    IMask.createPipe = createPipe;
    IMask.pipe = pipe;
    try {
        globalThis.IMask = IMask;
    } catch (e) {}
    const animItems = document.querySelectorAll("._anim-items");
    if (animItems.length > 0) {
        window.addEventListener("scroll", animOnScroll);
        function animOnScroll() {
            for (let index = 0; index < animItems.length; index++) {
                const animItem = animItems[index];
                const animItemHeight = animItem.offsetHeight;
                const animItemOffset = offset(animItem).top;
                const animStart = 4;
                const yOffset = window.pageYOffset;
                let animItemPoint = window.innerHeight - animItemHeight / animStart;
                if (animItemHeight > window.innerHeight) animItemPoint = window.innerHeight - window.innerHeight / animStart;
                if (yOffset > animItemOffset - animItemPoint && yOffset < animItemOffset + animItemHeight) animItem.classList.add("_active"); else animItem.classList.remove("_active");
            }
        }
        function offset(el) {
            const rect = el.getBoundingClientRect(), scrollLeft = window.pageXOffset || document.documentElement / screenLeft, scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            };
        }
        setTimeout((() => {
            animOnScroll();
        }), 300);
    }
    const rangeSlider = document.getElementById("range-slider");
    if (rangeSlider) {
        noUiSlider.create(rangeSlider, {
            start: [ 155 ],
            connect: "lower",
            tooltips: true,
            step: 1,
            range: {
                min: [ 10 ],
                max: [ 300 ]
            }
        });
        const input0 = document.getElementById("input-0");
        const inputs = [ input0 ];
        rangeSlider.noUiSlider.on("update", (function(values, handle, tooltips) {
            inputs[handle].value = Math.round(values[handle]);
        }));
    }
    var script_element = document.getElementById("phone");
    var maskOptions = {
        mask: "+{38}(000)000-00-00"
    };
    IMask(script_element, maskOptions);
    script_element = document.getElementById("phone1");
    maskOptions = {
        mask: "+{38}(000)000-00-00"
    };
    IMask(script_element, maskOptions);
    script_element = document.getElementById("phone2");
    maskOptions = {
        mask: "+{38}(000)000-00-00"
    };
    IMask(script_element, maskOptions);
    window["FLS"] = true;
    isWebp();
    addTouchClass();
    spollers();
    headerScroll();
})();