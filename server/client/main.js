(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "+NIJ":
/*!***************************************!*\
  !*** ./src/app/plugins/hystModal_.js ***!
  \***************************************/
/*! exports provided: HystModal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HystModal", function() { return HystModal; });
class HystModal {
    constructor(props) {
        let defaultConfig = {
            backscroll: true,
            linkAttributeName: 'data-hystmodal',
            closeOnOverlay: true,
            closeOnEsc: true,
            closeOnButton: true,
            waitTransitions: false,
            catchFocus: true,
            fixedSelectors: '*[data-hystfixed]',
            beforeOpen: () => {},
            afterClose: () => {},
        }
        this.config = Object.assign(defaultConfig, props)
        if (this.config.linkAttributeName) {
            this.init()
        }
        this._closeAfterTransition = this._closeAfterTransition.bind(this)
    }

    init() {
        this.isOpened = false
        this.openedWindow = false
        this.starter = false
        this._nextWindows = false
        this._scrollPosition = 0
        this._reopenTrigger = false
        this._overlayChecker = false
        this._isMoved = false
        this._focusElements = [
            'a[href]',
            'area[href]',
            'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
            'select:not([disabled]):not([aria-hidden])',
            'textarea:not([disabled]):not([aria-hidden])',
            'button:not([disabled]):not([aria-hidden])',
            'iframe',
            'object',
            'embed',
            '[contenteditable]',
            '[tabindex]:not([tabindex^="-"])',
        ]
        this._modalBlock = false

        let existingShadow = document.querySelector('.hystmodal__shadow')
        if (existingShadow) {
            this.shadow = existingShadow
        } else {
            this.shadow = document.createElement('div')
            this.shadow.classList.add('hystmodal__shadow')
            document.body.appendChild(this.shadow)
        }
        this.eventsFeeler()
    }

    eventsFeeler() {
        document.addEventListener(
            'click',
            function (e) {
                const clickedlink = e.target.closest(
                    '[' + this.config.linkAttributeName + ']',
                )
                if (!this._isMoved && clickedlink) {
                    e.preventDefault()
                    this.starter = clickedlink
                    let targetSelector = this.starter.getAttribute(
                        this.config.linkAttributeName,
                    )
                    this._nextWindows = document.querySelector(targetSelector)
                    this.open()
                    return
                }
                if (
                    this.config.closeOnButton &&
                    e.target.closest('[data-hystclose]')
                ) {
                    this.close()
                    return
                }
            }.bind(this),
        )

        if (this.config.closeOnOverlay) {
            document.addEventListener(
                'mousedown',
                function (e) {
                    if (
                        !this._isMoved &&
                        e.target instanceof Element &&
                        !e.target.classList.contains('hystmodal__wrap')
                    )
                        return
                    this._overlayChecker = true
                }.bind(this),
            )

            document.addEventListener(
                'mouseup',
                function (e) {
                    if (
                        !this._isMoved &&
                        e.target instanceof Element &&
                        this._overlayChecker &&
                        e.target.classList.contains('hystmodal__wrap')
                    ) {
                        e.preventDefault()
                        !this._overlayChecker
                        this.close()
                        return
                    }
                    this._overlayChecker = false
                }.bind(this),
            )
        }

        window.addEventListener(
            'keydown',
            function (e) {
                if (
                    !this._isMoved &&
                    this.config.closeOnEsc &&
                    e.which == 27 &&
                    this.isOpened
                ) {
                    e.preventDefault()
                    this.close()
                    return
                }
                if (
                    !this._isMoved &&
                    this.config.catchFocus &&
                    e.which == 9 &&
                    this.isOpened
                ) {
                    this.focusCatcher(e)
                    return
                }
            }.bind(this),
        )
    }

    open(selector) {
        if (selector) {
            if (typeof selector === 'string') {
                this._nextWindows = document.querySelector(selector)
            } else {
                this._nextWindows = selector
            }
        }
        if (!this._nextWindows) {
            console.log('Warning: hystModal selector is not found')
            return
        }
        if (this.isOpened) {
            this._reopenTrigger = true
            this.close()
            return
        }
        this.openedWindow = this._nextWindows
        this._modalBlock = this.openedWindow.querySelector('.hystmodal__window')
        this.config.beforeOpen(this)
        this._bodyScrollControl()
        this.shadow.classList.add('hystmodal__shadow--show')
        this.openedWindow.classList.add('hystmodal--active')
        this.openedWindow.setAttribute('aria-hidden', 'false')
        if (this.config.catchFocus) this.focusControl()
        this.isOpened = true
    }

    close() {
        if (!this.isOpened) {
            return
        }
        if (this.config.waitTransitions) {
            this.openedWindow.classList.add('hystmodal--moved')
            this._isMoved = true
            this.openedWindow.addEventListener(
                'transitionend',
                this._closeAfterTransition,
            )
            this.openedWindow.classList.remove('hystmodal--active')
        } else {
            this.openedWindow.classList.remove('hystmodal--active')
            this._closeAfterTransition()
        }
    }

    _closeAfterTransition() {
        this.openedWindow.classList.remove('hystmodal--moved')
        this.openedWindow.removeEventListener(
            'transitionend',
            this._closeAfterTransition,
        )
        this._isMoved = false
        this.shadow.classList.remove('hystmodal__shadow--show')
        this.openedWindow.setAttribute('aria-hidden', 'true')

        if (this.config.catchFocus) this.focusControl()
        this._bodyScrollControl()
        this.isOpened = false
        this.openedWindow.scrollTop = 0
        this.config.afterClose(this)

        if (this._reopenTrigger) {
            this._reopenTrigger = false
            this.open()
        }
    }

    focusControl() {
        const nodes = this.openedWindow.querySelectorAll(this._focusElements)
        if (this.isOpened && this.starter) {
            this.starter.focus()
        } else {
            if (nodes.length) nodes[0].focus()
        }
    }

    focusCatcher(e) {
        const nodes = this.openedWindow.querySelectorAll(this._focusElements)
        const nodesArray = Array.prototype.slice.call(nodes)
        if (!this.openedWindow.contains(document.activeElement)) {
            nodesArray[0].focus()
            e.preventDefault()
        } else {
            const focusedItemIndex = nodesArray.indexOf(document.activeElement)
            console.log(focusedItemIndex)
            if (e.shiftKey && focusedItemIndex === 0) {
                nodesArray[nodesArray.length - 1].focus()
                e.preventDefault()
            }
            if (!e.shiftKey && focusedItemIndex === nodesArray.length - 1) {
                nodesArray[0].focus()
                e.preventDefault()
            }
        }
    }

    _bodyScrollControl() {
        if (!this.config.backscroll) return

        // collect fixed selectors to array
        let fixedSelectors = Array.prototype.slice.call(
            document.querySelectorAll(this.config.fixedSelectors),
        )

        let html = document.documentElement
        if (this.isOpened === true) {
            html.classList.remove('hystmodal__opened')
            html.style.marginRight = ''
            fixedSelectors.map(el => {
                el.style.marginRight = ''
            })
            window.scrollTo(0, this._scrollPosition)
            html.style.top = ''
            return
        }
        this._scrollPosition = window.pageYOffset
        let marginSize = window.innerWidth - html.clientWidth
        html.style.top = -this._scrollPosition + 'px'

        if (marginSize) {
            html.style.marginRight = marginSize + 'px'
            fixedSelectors.map(el => {
                el.style.marginRight =
                    parseInt(getComputedStyle(el).marginRight) +
                    marginSize +
                    'px'
            })
        }
        html.classList.add('hystmodal__opened')
    }
}


/***/ }),

/***/ "+PC+":
/*!*************************************************************!*\
  !*** ./src/app/views/feed/feed-main/feed-main.component.ts ***!
  \*************************************************************/
/*! exports provided: FeedMainComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeedMainComponent", function() { return FeedMainComponent; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _store_posts_post_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../store/posts/post.actions */ "YBVe");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _store_posts_post_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../store/posts/post.selectors */ "wXBG");
/* harmony import */ var _store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../store/my-profile/my-profile.selectors */ "0jmn");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var src_app_services_file_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/file.service */ "cpn4");








function FeedMainComponent_a_16_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "a", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const attach_r5 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpropertyInterpolate"]("download", attach_r5.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("href", attach_r5.result, _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](attach_r5.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](attach_r5.size);
} }
function FeedMainComponent_div_37_app_post_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "app-post", 30);
} if (rf & 2) {
    const post_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("postInfo", post_r7);
} }
function FeedMainComponent_div_37_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](1, FeedMainComponent_div_37_app_post_1_Template, 1, 1, "app-post", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, ctx_r3.posts$));
} }
function FeedMainComponent_h2_39_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "h2", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, "There are no posts in your feed yet");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} }
class FeedMainComponent {
    constructor(fileService, store$) {
        this.fileService = fileService;
        this.store$ = store$;
        this.posts$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_posts_post_selectors__WEBPACK_IMPORTED_MODULE_3__["postsSelector"]));
        this.isPosts$ = this.posts$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(posts => !!posts[0]));
        this.creator$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_4__["myProfileSelector"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(profile => {
            var _a, _b;
            console.log('PROFILE => ', profile);
            return {
                id: profile.id,
                fullName: `${profile.firstName} ${profile.lastName}`,
                profession: profile.info.profession,
                avatar: (_b = (_a = profile.info.avatar) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : '../../../../assets/img/avatar-man.png',
            };
        }));
        this.feedPostSortingType = 'trending';
        this.attached = {};
        this.creator = {
            id: 0,
            fullName: '',
            profession: '',
            avatar: '',
        };
        this.textareaContent = '';
    }
    createPost() {
        this.store$.dispatch(new _store_posts_post_actions__WEBPACK_IMPORTED_MODULE_1__["PostCreateAction"]({
            creator: this.creator,
            content: this.textareaContent,
            dateOfCreation: Date.now(),
            attached: this.attached,
        }));
        this.textareaContent = '';
    }
    textareaResize(e) {
        const elem = e.target;
        const offset = elem.offsetHeight - elem.clientHeight;
        elem.style.height = 'auto';
        elem.style.height = elem.scrollHeight + offset + 'px';
    }
    changeSortingType(e, sortList) {
        const elem = e.target;
        this.feedPostSortingType = elem.textContent;
        sortList.classList.remove('active');
    }
    fileUpload(fileInput, type) {
        this.fileService.fileUpload(fileInput, type, this.attached);
    }
    ngOnInit() {
        this.creator$.subscribe(creator => (this.creator = creator));
        this.posts$.subscribe(posts => console.log('posts =>', posts));
        this.store$.dispatch(new _store_posts_post_actions__WEBPACK_IMPORTED_MODULE_1__["PostGetAction"]({ id: 'all' }));
    }
}
FeedMainComponent.ɵfac = function FeedMainComponent_Factory(t) { return new (t || FeedMainComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](src_app_services_file_service__WEBPACK_IMPORTED_MODULE_6__["FileService"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["Store"])); };
FeedMainComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({ type: FeedMainComponent, selectors: [["app-feed-main"]], decls: 41, vars: 9, consts: [[1, "feed__main"], [1, "new-post"], [1, "create-post"], ["rows", "2", "contenteditable", "true", "onblur", "this.value = this.value.trim()", "placeholder", "What's on your mind?", 3, "ngModel", "input", "ngModelChange"], [1, "controls"], ["type", "file", "multiple", "", 2, "display", "none"], ["fileInput", ""], ["icon", "attach", 1, "attach-icon", 3, "click"], ["icon", "picture", 1, "attach-icon", 3, "click"], ["icon", "film", 1, "attach-icon", 3, "click"], [1, "btn-post", 3, "click"], ["icon", "send", 1, "send"], [1, "attached"], [1, "files"], [3, "href", "download", 4, "ngFor", "ngForOf"], [1, "images"], [1, "videos"], [1, "sort"], [1, "sort-type", 3, "click"], ["icon", "chevronDown", 1, "icon"], [1, "sort-list"], ["sortList", ""], [1, "list", 3, "click"], ["class", "posts", 4, "ngIf"], ["class", "no-posts", 4, "ngIf"], [3, "href", "download"], [1, "name"], [1, "size"], [1, "posts"], [3, "postInfo", 4, "ngFor", "ngForOf"], [3, "postInfo"], [1, "no-posts"]], template: function FeedMainComponent_Template(rf, ctx) { if (rf & 1) {
        const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3, "NEW POST");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "textarea", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("input", function FeedMainComponent_Template_textarea_input_5_listener($event) { return ctx.textareaResize($event); })("ngModelChange", function FeedMainComponent_Template_textarea_ngModelChange_5_listener($event) { return ctx.textareaContent = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](7, "input", 5, 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](9, "svg", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function FeedMainComponent_Template__svg_svg_click_9_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r8); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](8); return ctx.fileUpload(_r0, "file"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](10, "svg", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function FeedMainComponent_Template__svg_svg_click_10_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r8); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](8); return ctx.fileUpload(_r0, "image"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](11, "svg", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function FeedMainComponent_Template__svg_svg_click_11_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r8); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](8); return ctx.fileUpload(_r0, "video"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](12, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function FeedMainComponent_Template_button_click_12_listener() { return ctx.createPost(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](13, "svg", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](14, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](15, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](16, FeedMainComponent_a_16_Template, 5, 4, "a", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](17, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](18, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](19, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](20, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](21, " SORT BY: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](22, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](23, "span", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function FeedMainComponent_Template_span_click_23_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r8); const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](27); return _r2.classList.toggle("active"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](24);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](25, "svg", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](26, "div", 20, 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](28, "ul", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function FeedMainComponent_Template_ul_click_28_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r8); const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](27); return ctx.changeSortingType($event, _r2); });
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](29, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](30, "trending");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](31, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](32, "newest first");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](33, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](34, "lastest first");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](35, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](36, "by title");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](37, FeedMainComponent_div_37_Template, 3, 3, "div", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](38, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](39, FeedMainComponent_h2_39_Template, 2, 0, "h2", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](40, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngModel", ctx.textareaContent);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx.attached.files);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", ctx.feedPostSortingType, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](38, 5, ctx.isPosts$));
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", !_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](40, 7, ctx.isPosts$));
    } }, styles: [".user-select-none[_ngcontent-%COMP%] {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.feed__main[_ngcontent-%COMP%]   .new-post[_ngcontent-%COMP%] {\n  min-height: 135px;\n  padding: 25px 30px;\n  margin-bottom: 30px;\n}\n.feed__main[_ngcontent-%COMP%]   .new-post[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin-bottom: 30px;\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 600;\n}\n.feed__main[_ngcontent-%COMP%]   .new-post[_ngcontent-%COMP%]   .create-post[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n}\n.feed__main[_ngcontent-%COMP%]   .new-post[_ngcontent-%COMP%]   .create-post[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  width: 70%;\n  border: none;\n  outline: none;\n  resize: none;\n  overflow: hidden;\n  font-family: 'Poppins', sans-serif;\n  font-size: 18px;\n  font-weight: 500;\n  line-height: 25px;\n}\n.feed__main[_ngcontent-%COMP%]   .new-post[_ngcontent-%COMP%]   .create-post[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]::-webkit-input-placeholder {\n  color: rgba(24, 24, 24, 0.22);\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.feed__main[_ngcontent-%COMP%]   .new-post[_ngcontent-%COMP%]   .create-post[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]::-moz-placeholder {\n  color: rgba(24, 24, 24, 0.22);\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.feed__main[_ngcontent-%COMP%]   .new-post[_ngcontent-%COMP%]   .create-post[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%] {\n  width: 30%;\n  display: flex;\n  justify-content: space-around;\n  align-items: center;\n}\n.feed__main[_ngcontent-%COMP%]   .new-post[_ngcontent-%COMP%]   .create-post[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .attach-icon[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  stroke: #181818;\n  opacity: 0.2;\n  transition: opacity 0.3s;\n  cursor: pointer;\n}\n.feed__main[_ngcontent-%COMP%]   .new-post[_ngcontent-%COMP%]   .create-post[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .attach-icon[_ngcontent-%COMP%]:hover {\n  opacity: 1;\n}\n.feed__main[_ngcontent-%COMP%]   .new-post[_ngcontent-%COMP%]   .create-post[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .btn-post[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border-radius: 4px;\n  border: 0;\n  outline: 0;\n  background-color: #0871a8;\n  cursor: pointer;\n}\n.feed__main[_ngcontent-%COMP%]   .new-post[_ngcontent-%COMP%]   .create-post[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .btn-post[_ngcontent-%COMP%]   .send[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  vertical-align: middle;\n}\n.feed__main[_ngcontent-%COMP%]   .sort[_ngcontent-%COMP%] {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.feed__main[_ngcontent-%COMP%]   .sort[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  color: #181818;\n  font-weight: 600;\n  text-transform: uppercase;\n  display: flex;\n  align-items: center;\n}\n.feed__main[_ngcontent-%COMP%]   .sort[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  width: 140px;\n  position: relative;\n  display: inline-block;\n  margin-left: 0.6rem;\n  color: #0871a8;\n}\n.feed__main[_ngcontent-%COMP%]   .sort[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  stroke: #0871a8;\n}\n.feed__main[_ngcontent-%COMP%]   .sort[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .sort-type[_ngcontent-%COMP%] {\n  cursor: pointer;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.feed__main[_ngcontent-%COMP%]   .sort[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .sort-list[_ngcontent-%COMP%] {\n  position: absolute;\n  height: 500px;\n  width: 100%;\n  overflow: hidden;\n}\n.feed__main[_ngcontent-%COMP%]   .sort[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .sort-list[_ngcontent-%COMP%]   .list[_ngcontent-%COMP%] {\n  list-style: none;\n  position: absolute;\n  top: -100%;\n  border-radius: 0 0 8px 8px;\n  border: 1px solid #ccc;\n  overflow: hidden;\n  transition: top 0.3s;\n  background-color: #fff;\n}\n.feed__main[_ngcontent-%COMP%]   .sort[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .sort-list[_ngcontent-%COMP%]   .list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  padding: 0.5rem;\n  cursor: pointer;\n}\n.feed__main[_ngcontent-%COMP%]   .sort[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .sort-list[_ngcontent-%COMP%]   .list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:not(:first-child) {\n  border-top: 1px solid #e7e7e7;\n}\n.feed__main[_ngcontent-%COMP%]   .sort[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .sort-list[_ngcontent-%COMP%]   .list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover {\n  background-color: rgba(8, 113, 168, 0.8);\n  color: white;\n}\n.feed__main[_ngcontent-%COMP%]   .sort[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .sort-list.active[_ngcontent-%COMP%]   .list[_ngcontent-%COMP%] {\n  top: 0;\n}\n.feed__main[_ngcontent-%COMP%]   .sort[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]:before, .feed__main[_ngcontent-%COMP%]   .sort[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]:after {\n  content: '';\n  margin: 0 auto;\n  border-bottom: 1px solid #e7e7e7;\n  flex: 1 1;\n}\n.feed__main[_ngcontent-%COMP%]   .sort[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]:before {\n  margin-right: 20px;\n}\n.feed__main[_ngcontent-%COMP%]   .sort[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]:after {\n  margin-left: 20px;\n}\n.feed__main[_ngcontent-%COMP%]   .no-posts[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-top: 150px;\n  font-weight: 500;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHN0eWxlc1xcbWl4aW5zXFx0ZXh0LW1peGlucy5sZXNzIiwiZmVlZC1tYWluLmNvbXBvbmVudC5sZXNzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksaUJBQUE7RUFDQSx5QkFBQTtFQUNBLHNCQUFBO0VBQ0EscUJBQUE7QUNDSjtBQUZBO0VBRVEsaUJBQUE7RUFFQSxrQkFBQTtFQUNBLG1CQUFBO0FBRVI7QUFQQTtFQVFZLG1CQUFBO0VBRUEseUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7QUFDWjtBQWJBO0VBZ0JZLFdBQUE7RUFDQSxhQUFBO0VBQ0EsOEJBQUE7QUFBWjtBQWxCQTtFQXFCZ0IsVUFBQTtFQUVBLFlBQUE7RUFDQSxhQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBRUEsa0NBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtBQUZoQjtBQU1nQjtFQUNJLDZCQUFBO0VEdENoQixpQkFBQTtFQUNBLHlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxxQkFBQTtBQ21DSjtBQUlnQjtFQUNJLDZCQUFBO0VEM0NoQixpQkFBQTtFQUNBLHlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxxQkFBQTtBQzBDSjtBQTNDQTtFQStDZ0IsVUFBQTtFQUNBLGFBQUE7RUFDQSw2QkFBQTtFQUNBLG1CQUFBO0FBRGhCO0FBakRBO0VBcURvQixXQUFBO0VBQ0EsWUFBQTtFQUVBLGVBQUE7RUFDQSxZQUFBO0VBQ0Esd0JBQUE7RUFFQSxlQUFBO0FBSHBCO0FBS29CO0VBQ0ksVUFBQTtBQUh4QjtBQTVEQTtFQW9Fb0IsV0FBQTtFQUNBLFlBQUE7RUFFQSxrQkFBQTtFQUNBLFNBQUE7RUFDQSxVQUFBO0VBRUEseUJBQUE7RUFFQSxlQUFBO0FBUnBCO0FBckVBO0VBZ0Z3QixXQUFBO0VBQ0EsWUFBQTtFQUVBLHNCQUFBO0FBVHhCO0FBMUVBO0VERkksaUJBQUE7RUFDQSx5QkFBQTtFQUNBLHNCQUFBO0VBQ0EscUJBQUE7QUMrRUo7QUFoRkE7RUFnR1ksY0FBQTtFQUNBLGdCQUFBO0VBQ0EseUJBQUE7RUFFQSxhQUFBO0VBQ0EsbUJBQUE7QUFkWjtBQWdCWTtFQUNJLFlBQUE7RUFFQSxrQkFBQTtFQUNBLHFCQUFBO0VBRUEsbUJBQUE7RUFDQSxjQUFBO0FBaEJoQjtBQVNZO0VBVVEsZUFBQTtBQWhCcEI7QUFNWTtFQWNRLGVBQUE7RUFFQSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtBQWxCcEI7QUFBWTtFQXNCUSxrQkFBQTtFQUNBLGFBQUE7RUFDQSxXQUFBO0VBQ0EsZ0JBQUE7QUFuQnBCO0FBTlk7RUE0QlksZ0JBQUE7RUFFQSxrQkFBQTtFQUNBLFVBQUE7RUFFQSwwQkFBQTtFQUNBLHNCQUFBO0VBRUEsZ0JBQUE7RUFDQSxvQkFBQTtFQUVBLHNCQUFBO0FBdkJ4QjtBQWhCWTtFQXlDZ0IsZUFBQTtFQUNBLGVBQUE7QUF0QjVCO0FBd0I0QjtFQUNJLDZCQUFBO0FBdEJoQztBQXlCNEI7RUFDSSx3Q0FBQTtFQUNBLFlBQUE7QUF2QmhDO0FBNEJvQjtFQUVRLE1BQUE7QUEzQjVCO0FBaUNZOztFQUVJLFdBQUE7RUFDQSxjQUFBO0VBQ0EsZ0NBQUE7RUFDQSxTQUFBO0FBL0JoQjtBQWtDWTtFQUNJLGtCQUFBO0FBaENoQjtBQW1DWTtFQUNJLGlCQUFBO0FBakNoQjtBQWxKQTtFQTJMUSxrQkFBQTtFQUNBLGlCQUFBO0VBRUEsZ0JBQUE7QUF2Q1IiLCJmaWxlIjoiZmVlZC1tYWluLmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiLnVzZXItc2VsZWN0LW5vbmUge1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG59XG4iLCJAaW1wb3J0ICdzcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMnO1xuQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvbWl4aW5zL3RleHQtbWl4aW5zJztcblxuLmZlZWRfX21haW4ge1xuICAgIC5uZXctcG9zdCB7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDEzNXB4O1xuXG4gICAgICAgIHBhZGRpbmc6IDI1cHggMzBweDtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMzBweDtcblxuICAgICAgICBoMyB7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xuXG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5jcmVhdGUtcG9zdCB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cbiAgICAgICAgICAgIHRleHRhcmVhIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogNzAlO1xuXG4gICAgICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgICAgICAgICAgcmVzaXplOiBub25lO1xuICAgICAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgICAgICAgICAgICAgICBmb250LWZhbWlseTogJ1BvcHBpbnMnLCBzYW5zLXNlcmlmO1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAyNXB4O1xuXG4gICAgICAgICAgICAgICAgLy90cmFuc2l0aW9uOiBoZWlnaHQgLjFzO1xuXG4gICAgICAgICAgICAgICAgJjo6LXdlYmtpdC1pbnB1dC1wbGFjZWhvbGRlciB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiByZ2JhKDI0LCAyNCwgMjQsIDAuMjIpO1xuICAgICAgICAgICAgICAgICAgICAudXNlci1zZWxlY3Qtbm9uZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICY6Oi1tb3otcGxhY2Vob2xkZXIge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogcmdiYSgyNCwgMjQsIDI0LCAwLjIyKTtcbiAgICAgICAgICAgICAgICAgICAgLnVzZXItc2VsZWN0LW5vbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5jb250cm9scyB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDMwJTtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgICAgICAgICAuYXR0YWNoLWljb24ge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMjRweDtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyNHB4O1xuXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZTogQGJhc2U7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuMjtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjNzO1xuXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICAgICAgICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAuYnRuLXBvc3Qge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMzJweDtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMnB4O1xuXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAwO1xuICAgICAgICAgICAgICAgICAgICBvdXRsaW5lOiAwO1xuXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IEBhY3RpdmU7XG5cbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuXG4gICAgICAgICAgICAgICAgICAgIC5zZW5kIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxNnB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxNnB4O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSAvLyAuY29udHJvbHMgZW5kXG4gICAgICAgIH0gLy8gLmNyZWF0ZS1wb3N0IGVuZFxuICAgIH0gLy8gLm5ldy1wb3N0IGVuZFxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLnNvcnQge1xuICAgICAgICAudXNlci1zZWxlY3Qtbm9uZSgpO1xuXG4gICAgICAgIGg0IHtcbiAgICAgICAgICAgIGNvbG9yOiBAYmFzZTtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuXG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAgICAgJiA+IGRpdiB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDE0MHB4O1xuXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcblxuICAgICAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAwLjZyZW07XG4gICAgICAgICAgICAgICAgY29sb3I6IEBhY3RpdmU7XG5cbiAgICAgICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgICAgICBzdHJva2U6IEBhY3RpdmU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLnNvcnQtdHlwZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLnNvcnQtbGlzdCB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA1MDBweDtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgICAgICAgICAgICAgICAgICAgLmxpc3Qge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC1zdHlsZTogbm9uZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAtMTAwJTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMCAwIDhweCA4cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogdG9wIDAuM3M7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMC41cmVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICY6bm90KDpmaXJzdC1jaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXItdG9wOiAxcHggc29saWQgI2U3ZTdlNztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShAYWN0aXZlLCAwLjgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogd2hpdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJi5hY3RpdmUge1xuICAgICAgICAgICAgICAgICAgICAgICAgLmxpc3Qge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJjpiZWZvcmUsXG4gICAgICAgICAgICAmOmFmdGVyIHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiAnJztcbiAgICAgICAgICAgICAgICBtYXJnaW46IDAgYXV0bztcbiAgICAgICAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2U3ZTdlNztcbiAgICAgICAgICAgICAgICBmbGV4OiAxIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICY6YmVmb3JlIHtcbiAgICAgICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDIwcHg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICY6YWZ0ZXIge1xuICAgICAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAyMHB4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSAvLyAuc29ydCBlbmRcblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAubm8tcG9zdHMge1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIG1hcmdpbi10b3A6IDE1MHB4O1xuXG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgfVxufVxuIl19 */", ".feed[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 1440px;\n  margin: 0 auto;\n}\n.feed__wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 1440px;\n  margin: 40px 130px;\n  display: flex;\n}\n.main[_ngcontent-%COMP%] {\n  width: 75%;\n  max-width: 850px;\n  margin-right: 40px;\n}\n.side[_ngcontent-%COMP%] {\n  width: 25%;\n  max-width: 290px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZlZWQuY29tcG9uZW50Lmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxXQUFBO0VBQ0EsaUJBQUE7RUFDQSxjQUFBO0FBREo7QUFHSTtFQUNJLFdBQUE7RUFDQSxpQkFBQTtFQUVBLGtCQUFBO0VBQ0EsYUFBQTtBQUZSO0FBTUE7RUFDSSxVQUFBO0VBQ0EsZ0JBQUE7RUFFQSxrQkFBQTtBQUxKO0FBUUE7RUFDSSxVQUFBO0VBQ0EsZ0JBQUE7QUFOSiIsImZpbGUiOiJmZWVkLmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvdmFyaWFibGVzJztcblxuLmZlZWQge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1heC13aWR0aDogMTQ0MHB4O1xuICAgIG1hcmdpbjogMCBhdXRvO1xuXG4gICAgJl9fd3JhcHBlciB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBtYXgtd2lkdGg6IDE0NDBweDtcblxuICAgICAgICBtYXJnaW46IDQwcHggMTMwcHg7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgfVxufVxuXG4ubWFpbiB7XG4gICAgd2lkdGg6IDc1JTtcbiAgICBtYXgtd2lkdGg6IDg1MHB4O1xuXG4gICAgbWFyZ2luLXJpZ2h0OiA0MHB4O1xufVxuXG4uc2lkZSB7XG4gICAgd2lkdGg6IDI1JTtcbiAgICBtYXgtd2lkdGg6IDI5MHB4O1xufVxuIl19 */"] });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\ale53\Desktop\Web\projects\linkedin\client\src\main.ts */"zUnb");


/***/ }),

/***/ "0jmn":
/*!**********************************************************!*\
  !*** ./src/app/store/my-profile/my-profile.selectors.ts ***!
  \**********************************************************/
/*! exports provided: myProfileFeatureSelector, myProfileSelector, myProfileIdSelector, myProfileNameSelector, myProfilePhoneSelector, myProfileEmailSelector, myProfilePostsSelector, myProfileCurrentViewsSelector, myProfilePrevViewsSelector, myProfileAvatarSelector, myProfileProfessionSelector, myProfileRoleSelector, myProfileDescriptionSelector, myProfileAboutSelector, myProfileDOBSelector, myProfileLocalitySelector, myProfileGenderSelector, myProfileDateOfLastPasswordUpdateSelector, myProfileSentConnectionsSelector, myProfileReceivedConnectionsSelector, myProfileConnectionsSelector, myProfileContactInfoSelector, myProfileProjectsSelector, myProfileExperienceSelector, myProfileEducationSelector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileFeatureSelector", function() { return myProfileFeatureSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileSelector", function() { return myProfileSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileIdSelector", function() { return myProfileIdSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileNameSelector", function() { return myProfileNameSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfilePhoneSelector", function() { return myProfilePhoneSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileEmailSelector", function() { return myProfileEmailSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfilePostsSelector", function() { return myProfilePostsSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileCurrentViewsSelector", function() { return myProfileCurrentViewsSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfilePrevViewsSelector", function() { return myProfilePrevViewsSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileAvatarSelector", function() { return myProfileAvatarSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileProfessionSelector", function() { return myProfileProfessionSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileRoleSelector", function() { return myProfileRoleSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileDescriptionSelector", function() { return myProfileDescriptionSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileAboutSelector", function() { return myProfileAboutSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileDOBSelector", function() { return myProfileDOBSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileLocalitySelector", function() { return myProfileLocalitySelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileGenderSelector", function() { return myProfileGenderSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileDateOfLastPasswordUpdateSelector", function() { return myProfileDateOfLastPasswordUpdateSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileSentConnectionsSelector", function() { return myProfileSentConnectionsSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileReceivedConnectionsSelector", function() { return myProfileReceivedConnectionsSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileConnectionsSelector", function() { return myProfileConnectionsSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileContactInfoSelector", function() { return myProfileContactInfoSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileProjectsSelector", function() { return myProfileProjectsSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileExperienceSelector", function() { return myProfileExperienceSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileEducationSelector", function() { return myProfileEducationSelector; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _my_profile_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./my-profile.reducer */ "i2O+");


const myProfileFeatureSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createFeatureSelector"])(_my_profile_reducer__WEBPACK_IMPORTED_MODULE_1__["myProfileNode"]);
const myProfileSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state);
const myProfileIdSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.id);
const myProfileNameSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => ({
    firstName: state.firstName,
    lastName: state.lastName,
}));
const myProfilePhoneSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.phone);
const myProfileEmailSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.email);
const myProfilePostsSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.posts);
const myProfileCurrentViewsSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.views.current);
const myProfilePrevViewsSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.views.prev);
const myProfileAvatarSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => {
    var _a, _b;
    return (_b = (_a = state.info.avatar) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : '../../../assets/img/avatar-man.png';
});
const myProfileProfessionSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.profession);
const myProfileRoleSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.role);
const myProfileDescriptionSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.description);
const myProfileAboutSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.about);
const myProfileDOBSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.dateOfBirth);
const myProfileLocalitySelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.locality);
const myProfileGenderSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.gender);
const myProfileDateOfLastPasswordUpdateSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.dateOfLastPasswordUpdate);
const myProfileSentConnectionsSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.sentConnections);
const myProfileReceivedConnectionsSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.receivedConnections);
const myProfileConnectionsSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.connections);
const myProfileContactInfoSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.contactInfo);
const myProfileProjectsSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.projects);
const myProfileExperienceSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.experience);
const myProfileEducationSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(myProfileFeatureSelector, state => state.info.education);


/***/ }),

/***/ "2MiI":
/*!*******************************************************!*\
  !*** ./src/app/components/header/header.component.ts ***!
  \*******************************************************/
/*! exports provided: HeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderComponent", function() { return HeaderComponent; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../store/my-profile/my-profile.selectors */ "0jmn");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _services_profile_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/profile.service */ "Aso2");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../svg-icon/svg-icon.component */ "W/uP");
/* harmony import */ var _pipes_prefix_plus_pipe_prefix_plus_pipe__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../pipes/prefix-plus-pipe/prefix-plus.pipe */ "aeBj");










function HeaderComponent_a_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "a", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "svg", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const route_r1 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassProp"]("active", ctx_r0.location.pathname === route_r1.path);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("routerLink", route_r1.path);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("icon", route_r1.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", route_r1.name, " ");
} }
class HeaderComponent {
    constructor(profileService, store$) {
        this.profileService = profileService;
        this.store$ = store$;
        this.prevViews$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfilePrevViewsSelector"]));
        this.currentViews$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileCurrentViewsSelector"]));
        this.fullName$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileNameSelector"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(name => `${name.firstName[0]}. ${name.lastName}`));
        this.avatar$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileAvatarSelector"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(avatar => {
            return avatar;
        }));
        this.routes = [
            { path: '/feed', icon: 'feed', name: 'feed' },
            { path: '/network', icon: 'network', name: 'network' },
            { path: '/jobs', icon: 'jobs', name: 'jobs' },
            { path: '/chats', icon: 'chats', name: 'chats' },
            { path: '/notices', icon: 'notices', name: 'notices' },
        ];
        this.location = location;
    }
    viewsProgress() {
        let prev;
        let current;
        this.currentViews$.subscribe(res => {
            current = res;
        });
        this.prevViews$.subscribe(res => {
            prev = res;
        });
        // @ts-ignore
        return current - prev;
    }
    trendingIcon() {
        if (this.viewsProgress() > 0)
            return 'trendingUp';
        if (this.viewsProgress() < 0)
            return 'trendingDown';
        return 'trendingFlat';
    }
    ngOnInit() { }
}
HeaderComponent.ɵfac = function HeaderComponent_Factory(t) { return new (t || HeaderComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_profile_service__WEBPACK_IMPORTED_MODULE_4__["ProfileService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["Store"])); };
HeaderComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: HeaderComponent, selectors: [["app-header"]], decls: 29, vars: 20, consts: [[1, "header"], [1, "left-side"], [1, "navigation"], ["id", "logo", "routerLink", "/feed", 1, "link"], ["alt", "logo", "src", "../../assets/img/logo.png"], ["class", "link", 3, "active", "routerLink", 4, "ngFor", "ngForOf"], [1, "right-side"], ["routerLink", "/profile", 1, "profile-link"], [1, "profile"], [1, "photo"], ["alt", "avatar", "id", "avatar", 3, "src"], [1, "info"], [1, "name"], [1, "views"], ["id", "progress"], [3, "icon"], ["href", "#", 1, "link"], ["icon", "other", 1, "icon"], [1, "link", 3, "routerLink"], [1, "icon", 3, "icon"]], template: function HeaderComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "header", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "nav", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "img", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](5, HeaderComponent_a_5_Template, 3, 5, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "a", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](10, "img", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](11, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "p", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](15, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](17, "YOU");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](18, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](20, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](21, "span", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](22);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](23, "prefixPlus");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](24, "svg", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](25, "a", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](26, "svg", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](27, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](28, "OTHER");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.routes);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("src", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](11, 12, ctx.avatar$), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](15, 14, ctx.fullName$), " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](20, 16, ctx.currentViews$), " views today ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassProp"]("danger", ctx.viewsProgress() < 0)("success", ctx.viewsProgress() > 0)("base", ctx.viewsProgress() === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](23, 18, ctx.viewsProgress()), " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("icon", ctx.trendingIcon());
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterLinkWithHref"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgForOf"], _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_7__["SvgIconComponent"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_6__["AsyncPipe"], _pipes_prefix_plus_pipe_prefix_plus_pipe__WEBPACK_IMPORTED_MODULE_8__["PrefixPlusPipe"]], styles: [".header[_ngcontent-%COMP%] {\n  margin: 0 auto;\n  height: 80px;\n  max-width: 1440px;\n  display: flex;\n  justify-content: space-between;\n  font-family: 'Poppins', sans-serif;\n  text-transform: uppercase;\n}\n.header[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%] {\n  width: 70%;\n  height: 100%;\n  display: flex;\n}\n.header[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .navigation[_ngcontent-%COMP%] {\n  height: 100%;\n  display: flex;\n}\n.header[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .navigation[_ngcontent-%COMP%]   #logo[_ngcontent-%COMP%] {\n  width: 130px;\n  text-align: center;\n}\n.header[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .search[_ngcontent-%COMP%] {\n  max-width: 360px;\n  display: flex;\n  align-items: center;\n}\n.header[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .search[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 25px;\n  height: 25px;\n  margin: 1rem;\n}\n.header[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .search[_ngcontent-%COMP%]   #search[_ngcontent-%COMP%] {\n  padding: 0.5rem;\n  border-radius: 5px;\n  border: none;\n  outline: none;\n}\n.header[_ngcontent-%COMP%]   .right-side[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  width: 30%;\n  height: 100%;\n  max-width: 420px;\n}\n.header[_ngcontent-%COMP%]   .right-side[_ngcontent-%COMP%]   .profile-link[_ngcontent-%COMP%] {\n  text-decoration: none;\n  display: flex;\n  max-width: 330px;\n  height: 100%;\n  align-items: center;\n  color: #181818;\n}\n.header[_ngcontent-%COMP%]   .right-side[_ngcontent-%COMP%]   .profile-link[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  justify-content: space-evenly;\n  align-items: center;\n}\n.header[_ngcontent-%COMP%]   .right-side[_ngcontent-%COMP%]   .profile-link[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .photo[_ngcontent-%COMP%] {\n  width: 50px;\n  height: 50px;\n  margin-right: 1rem;\n  overflow: hidden;\n  border-radius: 50%;\n  display: flex;\n  justify-content: center;\n}\n.header[_ngcontent-%COMP%]   .right-side[_ngcontent-%COMP%]   .profile-link[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .photo[_ngcontent-%COMP%]   #avatar[_ngcontent-%COMP%] {\n  width: 70px;\n  height: 70px;\n}\n.header[_ngcontent-%COMP%]   .right-side[_ngcontent-%COMP%]   .profile-link[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%] {\n  font-size: 12px;\n}\n.header[_ngcontent-%COMP%]   .right-side[_ngcontent-%COMP%]   .profile-link[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  font-weight: 600;\n  margin-bottom: 0.4rem;\n}\n.header[_ngcontent-%COMP%]   .right-side[_ngcontent-%COMP%]   .profile-link[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin-left: 0.5rem;\n  color: rgba(24, 24, 24, 0.2);\n}\n.header[_ngcontent-%COMP%]   .right-side[_ngcontent-%COMP%]   .profile-link[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .views[_ngcontent-%COMP%] {\n  color: #747474;\n  fill: #747474;\n  text-transform: none;\n}\n.header[_ngcontent-%COMP%]   .right-side[_ngcontent-%COMP%]   .profile-link[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .views[_ngcontent-%COMP%]   #progress[_ngcontent-%COMP%] {\n  margin-left: 0.4rem;\n  font-weight: 600;\n}\n.header[_ngcontent-%COMP%]   .right-side[_ngcontent-%COMP%]   .profile-link[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .views[_ngcontent-%COMP%]   #progress[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  vertical-align: bottom;\n}\n.link[_ngcontent-%COMP%] {\n  width: 90px;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-evenly;\n  padding: 0.5rem;\n  border-bottom: 3px solid #fff;\n  font-weight: 600;\n  font-size: 12px;\n  text-decoration: none;\n  color: #181818;\n  stroke: #181818;\n}\n.link[_ngcontent-%COMP%]:hover {\n  color: #0871a8;\n}\n.link[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  stroke: #0871a8;\n}\n.link.active[_ngcontent-%COMP%]:not(#logo) {\n  color: #0871a8;\n  border-bottom: 3px solid #0871a8;\n}\n.link.active[_ngcontent-%COMP%]:not(#logo)   svg[_ngcontent-%COMP%] {\n  stroke: #0871a8;\n}\n.icon[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  stroke: #181818;\n  stroke-width: 2px;\n}\n.success[_ngcontent-%COMP%] {\n  color: #02b033;\n}\n.success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #02b033;\n}\n.danger[_ngcontent-%COMP%] {\n  color: #de0e0e;\n}\n.danger[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #de0e0e;\n}\n.base[_ngcontent-%COMP%] {\n  color: #181818;\n}\n.base[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #181818;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlYWRlci5jb21wb25lbnQubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNJLGNBQUE7RUFHQSxZQUFBO0VBQ0EsaUJBQUE7RUFFQSxhQUFBO0VBRUEsOEJBQUE7RUFFQSxrQ0FBQTtFQUNBLHlCQUFBO0FBTko7QUFOQTtFQWVRLFVBQUE7RUFDQSxZQUFBO0VBRUEsYUFBQTtBQVBSO0FBWEE7RUFxQlksWUFBQTtFQUVBLGFBQUE7QUFSWjtBQWZBO0VBMkJnQixZQUFBO0VBQ0Esa0JBQUE7QUFUaEI7QUFuQkE7RUFpQ1ksZ0JBQUE7RUFFQSxhQUFBO0VBQ0EsbUJBQUE7QUFaWjtBQXhCQTtFQXVDZ0IsV0FBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0FBWmhCO0FBN0JBO0VBNkNnQixlQUFBO0VBRUEsa0JBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtBQWRoQjtBQW5DQTtFQXVEUSxhQUFBO0VBQ0EsOEJBQUE7RUFFQSxVQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0FBbEJSO0FBMUNBO0VBK0RZLHFCQUFBO0VBQ0EsYUFBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtFQUVBLG1CQUFBO0VBQ0EsY0FBQTtBQW5CWjtBQWxEQTtFQXdFZ0IsV0FBQTtFQUNBLGFBQUE7RUFDQSw2QkFBQTtFQUNBLG1CQUFBO0FBbkJoQjtBQXhEQTtFQThFb0IsV0FBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUVBLGdCQUFBO0VBQ0Esa0JBQUE7RUFFQSxhQUFBO0VBQ0EsdUJBQUE7QUFyQnBCO0FBakVBO0VBeUZ3QixXQUFBO0VBQ0EsWUFBQTtBQXJCeEI7QUFyRUE7RUErRm9CLGVBQUE7QUF2QnBCO0FBeEVBO0VBa0d3QixnQkFBQTtFQUNBLHFCQUFBO0FBdkJ4QjtBQTVFQTtFQXNHNEIsbUJBQUE7RUFDQSw0QkFBQTtBQXZCNUI7QUFoRkE7RUE0R3dCLGNBQUE7RUFDQSxhQUFBO0VBRUEsb0JBQUE7QUExQnhCO0FBckZBO0VBa0g0QixtQkFBQTtFQUNBLGdCQUFBO0FBMUI1QjtBQXpGQTtFQXNIZ0MsV0FBQTtFQUNBLFlBQUE7RUFDQSxzQkFBQTtBQTFCaEM7QUFvQ0E7RUFDSSxXQUFBO0VBQ0EsWUFBQTtFQUVBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0EsNkJBQUE7RUFFQSxlQUFBO0VBQ0EsNkJBQUE7RUFFQSxnQkFBQTtFQUNBLGVBQUE7RUFFQSxxQkFBQTtFQUNBLGNBQUE7RUFDQSxlQUFBO0FBdENKO0FBd0NJO0VBQ0ksY0FBQTtBQXRDUjtBQXlDSTtFQUNJLGVBQUE7QUF2Q1I7QUEwQ0k7RUFDSSxjQUFBO0VBQ0EsZ0NBQUE7QUF4Q1I7QUFzQ0k7RUFLUSxlQUFBO0FBeENaO0FBNkNBO0VBQ0ksV0FBQTtFQUNBLFlBQUE7RUFFQSxlQUFBO0VBQ0EsaUJBQUE7QUE1Q0o7QUErQ0E7RUFDSSxjQUFBO0FBN0NKO0FBNENBO0VBSVEsYUFBQTtBQTdDUjtBQWlEQTtFQUNJLGNBQUE7QUEvQ0o7QUE4Q0E7RUFJUSxhQUFBO0FBL0NSO0FBbURBO0VBQ0ksY0FBQTtBQWpESjtBQWdEQTtFQUlRLGFBQUE7QUFqRFIiLCJmaWxlIjoiaGVhZGVyLmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvdmFyaWFibGVzJztcblxuLmhlYWRlciB7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gICAgLy9ib3JkZXI6IDFweCBkYXNoZWQgI2NjYztcblxuICAgIGhlaWdodDogODBweDtcbiAgICBtYXgtd2lkdGg6IDE0NDBweDtcblxuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgLy9mbGV4LXdyYXA6IHdyYXA7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuXG4gICAgZm9udC1mYW1pbHk6IEBmZjtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuXG4gICAgLmxlZnQtc2lkZSB7XG4gICAgICAgIHdpZHRoOiA3MCU7XG4gICAgICAgIGhlaWdodDogMTAwJTtcblxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuXG4gICAgICAgIC5uYXZpZ2F0aW9uIHtcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcblxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIC8vZmxleC13cmFwOiB3cmFwO1xuXG4gICAgICAgICAgICAjbG9nbyB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEzMHB4O1xuICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSAvLy5uYXZpZ2F0aW9uIGVuZFxuXG4gICAgICAgIC5zZWFyY2gge1xuICAgICAgICAgICAgbWF4LXdpZHRoOiAzNjBweDtcblxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgICAgIGltZyB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDI1cHg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAyNXB4O1xuICAgICAgICAgICAgICAgIG1hcmdpbjogMXJlbTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgI3NlYXJjaCB7XG4gICAgICAgICAgICAgICAgcGFkZGluZzogMC41cmVtO1xuXG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IC8vIC5zZWFyY2ggZW5kXG4gICAgfSAvLyAubGVmdC1zaWRlIGVuZFxuXG4gICAgLnJpZ2h0LXNpZGUge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cbiAgICAgICAgd2lkdGg6IDMwJTtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICBtYXgtd2lkdGg6IDQyMHB4O1xuXG4gICAgICAgIC5wcm9maWxlLWxpbmsge1xuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIG1heC13aWR0aDogMzMwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG5cbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBjb2xvcjogQGJhc2U7XG5cbiAgICAgICAgICAgIC5wcm9maWxlIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgICAgICAgICAucGhvdG8ge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNTBweDtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA1MHB4O1xuICAgICAgICAgICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDFyZW07XG5cbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xuXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXG4gICAgICAgICAgICAgICAgICAgICNhdmF0YXIge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDcwcHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDcwcHg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAuaW5mbyB7XG4gICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcblxuICAgICAgICAgICAgICAgICAgICAubmFtZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMC40cmVtO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4tbGVmdDogMC41cmVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiByZ2JhKDI0LCAyNCwgMjQsIDAuMik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAudmlld3Mge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEBsaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IEBsaWdodDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICNwcm9ncmVzcyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDAuNHJlbTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDE2cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTZweDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWwtYWxpZ246IGJvdHRvbTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IC8vIC5yaWdodC1zaWRlIGVuZFxufSAvLyAuaGVhZGVyIGVuZFxuXG4ubGluayB7XG4gICAgd2lkdGg6IDkwcHg7XG4gICAgaGVpZ2h0OiAxMDAlO1xuXG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG5cbiAgICBwYWRkaW5nOiAwLjVyZW07XG4gICAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkICNmZmY7XG5cbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcblxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICBjb2xvcjogQGJhc2U7XG4gICAgc3Ryb2tlOiBAYmFzZTtcblxuICAgICY6aG92ZXIge1xuICAgICAgICBjb2xvcjogQGFjdGl2ZTtcbiAgICB9XG5cbiAgICAmOmhvdmVyIHN2ZyB7XG4gICAgICAgIHN0cm9rZTogQGFjdGl2ZTtcbiAgICB9XG5cbiAgICAmLmFjdGl2ZTpub3QoI2xvZ28pIHtcbiAgICAgICAgY29sb3I6IEBhY3RpdmU7XG4gICAgICAgIGJvcmRlci1ib3R0b206IDNweCBzb2xpZCBAYWN0aXZlO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBzdHJva2U6IEBhY3RpdmU7XG4gICAgICAgIH1cbiAgICB9XG59IC8vIC5saW5rIGVuZFxuXG4uaWNvbiB7XG4gICAgd2lkdGg6IDI0cHg7XG4gICAgaGVpZ2h0OiAyNHB4O1xuXG4gICAgc3Ryb2tlOiBAYmFzZTtcbiAgICBzdHJva2Utd2lkdGg6IDJweDtcbn1cblxuLnN1Y2Nlc3Mge1xuICAgIGNvbG9yOiBAc3VjY2VzcztcblxuICAgIHN2ZyB7XG4gICAgICAgIGZpbGw6IEBzdWNjZXNzO1xuICAgIH1cbn1cblxuLmRhbmdlciB7XG4gICAgY29sb3I6IEBkYW5nZXI7XG5cbiAgICBzdmcge1xuICAgICAgICBmaWxsOiBAZGFuZ2VyO1xuICAgIH1cbn1cblxuLmJhc2Uge1xuICAgIGNvbG9yOiBAYmFzZTtcblxuICAgIHN2ZyB7XG4gICAgICAgIGZpbGw6IEBiYXNlO1xuICAgIH1cbn1cbiJdfQ== */"] });


/***/ }),

/***/ "3BcM":
/*!*********************************************************!*\
  !*** ./src/app/pipes/masked-email/masked-email.pipe.ts ***!
  \*********************************************************/
/*! exports provided: MaskedEmailPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaskedEmailPipe", function() { return MaskedEmailPipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class MaskedEmailPipe {
    transform(value, ...args) {
        const [startEmail, endEmail] = value.split('@');
        const maskedStart = `${startEmail[0] + startEmail[1]}•••`;
        return maskedStart + '@' + endEmail;
    }
}
MaskedEmailPipe.ɵfac = function MaskedEmailPipe_Factory(t) { return new (t || MaskedEmailPipe)(); };
MaskedEmailPipe.ɵpipe = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({ name: "maskedEmail", type: MaskedEmailPipe, pure: true });


/***/ }),

/***/ "4Zo2":
/*!**********************************************!*\
  !*** ./src/app/store/auth/auth.selectors.ts ***!
  \**********************************************/
/*! exports provided: authFeatureSelector, authStatusSelector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "authFeatureSelector", function() { return authFeatureSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "authStatusSelector", function() { return authStatusSelector; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _auth_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth.reducer */ "pja6");


const authFeatureSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createFeatureSelector"])(_auth_reducer__WEBPACK_IMPORTED_MODULE_1__["authNode"]);
const authStatusSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(authFeatureSelector, (state) => state.authStatus);


/***/ }),

/***/ "5hme":
/*!*******************************************************************************************************************!*\
  !*** ./src/app/views/profile/edit-profile/edit-components/edit-additional-info/edit-additional-info.component.ts ***!
  \*******************************************************************************************************************/
/*! exports provided: EditAdditionalInfoComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditAdditionalInfoComponent", function() { return EditAdditionalInfoComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _components_select_select_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../components/select/select.component */ "yoGk");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../svg-icon/svg-icon.component */ "W/uP");







function EditAdditionalInfoComponent_div_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "div", 30);
} }
function EditAdditionalInfoComponent_div_38_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r1.projectsError);
} }
function EditAdditionalInfoComponent_label_39_Template(rf, ctx) { if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "input", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_label_39_Template_input_ngModelChange_1_listener($event) { const contact_r9 = ctx.$implicit; return contact_r9.contactWay = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "input", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_label_39_Template_input_ngModelChange_2_listener($event) { const contact_r9 = ctx.$implicit; return contact_r9.data = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "svg", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_label_39_Template__svg_svg_click_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r13); const contact_r9 = ctx.$implicit; const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r12.removeContactWay(contact_r9); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const contact_r9 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", contact_r9.contactWay);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", contact_r9.data);
} }
function EditAdditionalInfoComponent_div_48_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r3.projectsError);
} }
function EditAdditionalInfoComponent_div_49_div_20_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 45, 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "img", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](1);
    const project_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", project_r14.poster.url, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_r18.clientWidth + "x" + _r18.clientHeight);
} }
function EditAdditionalInfoComponent_div_49_Template(rf, ctx) { if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "svg", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_div_49_Template__svg_svg_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r21); const project_r14 = ctx.$implicit; const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r20.removeProject(project_r14); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, " Name ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "input", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_div_49_Template_input_ngModelChange_4_listener($event) { const project_r14 = ctx.$implicit; return project_r14.name = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, " Role ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "input", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_div_49_Template_input_ngModelChange_7_listener($event) { const project_r14 = ctx.$implicit; return project_r14.role = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " Date ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "input", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_div_49_Template_input_ngModelChange_10_listener($event) { const project_r14 = ctx.$implicit; return project_r14.date = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, " About ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "textarea", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_div_49_Template_textarea_ngModelChange_13_listener($event) { const project_r14 = ctx.$implicit; return project_r14.about = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, " Upload poster ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "input", 41, 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function EditAdditionalInfoComponent_div_49_Template_input_change_16_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r21); const project_r14 = ctx.$implicit; const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r26.uploadPosterHandler($event, project_r14); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "button", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_div_49_Template_button_click_18_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r21); const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](17); return _r16.click(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Upload");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](20, EditAdditionalInfoComponent_div_49_div_20_Template, 5, 2, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const project_r14 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", project_r14.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", project_r14.role);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", project_r14.date);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", project_r14.about);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", project_r14.poster);
} }
function EditAdditionalInfoComponent_div_58_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r5.jobError);
} }
function EditAdditionalInfoComponent_div_59_div_20_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 45, 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "img", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r31 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](1);
    const job_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", job_r28.logo.url, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_r31.clientWidth + "x" + _r31.clientHeight);
} }
function EditAdditionalInfoComponent_div_59_Template(rf, ctx) { if (rf & 1) {
    const _r34 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "svg", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_div_59_Template__svg_svg_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r34); const job_r28 = ctx.$implicit; const ctx_r33 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r33.removeJob(job_r28); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, " Company ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "input", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_div_59_Template_input_ngModelChange_5_listener($event) { const job_r28 = ctx.$implicit; return job_r28.companyName = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, " Profession ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "input", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_div_59_Template_input_ngModelChange_9_listener($event) { const job_r28 = ctx.$implicit; return job_r28.profession = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, " Worked from ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "input", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_div_59_Template_input_ngModelChange_13_listener($event) { const job_r28 = ctx.$implicit; return job_r28.start = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, " Worked to ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "input", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_div_59_Template_input_ngModelChange_17_listener($event) { const job_r28 = ctx.$implicit; return job_r28.end = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, " Logo ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](20, EditAdditionalInfoComponent_div_59_div_20_Template, 5, 2, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "button", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_div_59_Template_button_click_21_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r34); const _r30 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](24); return _r30.click(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Upload");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "input", 41, 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function EditAdditionalInfoComponent_div_59_Template_input_change_23_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r34); const job_r28 = ctx.$implicit; const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r40.uploadJobLogoHandler($event, job_r28); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const job_r28 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", job_r28.companyName);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", job_r28.profession);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", job_r28.start);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", job_r28.end);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", job_r28.logo);
} }
function EditAdditionalInfoComponent_div_68_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r7.educationError);
} }
function EditAdditionalInfoComponent_div_69_div_24_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 45, 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "img", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r44 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](1);
    const university_r41 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", university_r41.logo.url, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_r44.clientWidth + "x" + _r44.clientHeight);
} }
function EditAdditionalInfoComponent_div_69_Template(rf, ctx) { if (rf & 1) {
    const _r47 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "svg", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_div_69_Template__svg_svg_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r47); const university_r41 = ctx.$implicit; const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r46.removeUniversity(university_r41); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, " University name ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "input", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_div_69_Template_input_ngModelChange_5_listener($event) { const university_r41 = ctx.$implicit; return university_r41.name = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, " Faculty and degree ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "input", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_div_69_Template_input_ngModelChange_9_listener($event) { const university_r41 = ctx.$implicit; return university_r41.facultyAndDegree = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, " Studied from ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "input", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_div_69_Template_input_ngModelChange_13_listener($event) { const university_r41 = ctx.$implicit; return university_r41.start = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, " Studied to ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "input", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_div_69_Template_input_ngModelChange_17_listener($event) { const university_r41 = ctx.$implicit; return university_r41.end = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, " Comment ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "textarea", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_div_69_Template_textarea_ngModelChange_21_listener($event) { const university_r41 = ctx.$implicit; return university_r41.comment = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, " Logo ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](24, EditAdditionalInfoComponent_div_69_div_24_Template, 5, 2, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "button", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_div_69_Template_button_click_25_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r47); const _r43 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](28); return _r43.click(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Upload");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "input", 41, 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function EditAdditionalInfoComponent_div_69_Template_input_change_27_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r47); const university_r41 = ctx.$implicit; const ctx_r54 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r54.uploadUniversityLogoHandler($event, university_r41); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const university_r41 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", university_r41.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", university_r41.facultyAndDegree);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", university_r41.start);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", university_r41.end);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", university_r41.comment);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", university_r41.logo);
} }
const _c0 = function () { return ["HR", "jobseeker"]; };
class EditAdditionalInfoComponent {
    constructor() {
        this.role = '';
        this.about = '';
        this.profession = '';
        this.locality = {
            country: '',
            city: '',
        };
        this.contactInfo = [{ contactWay: null, data: null }];
        this.projects = [
            {
                name: null,
                role: null,
                date: null,
                about: null,
                poster: null,
            },
        ];
        this.experience = [];
        this.education = [];
        this.onChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.localityForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroup"]({
            country: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.locality.country, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
            city: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.locality.city, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
        });
        this.contactInfoError = '';
        this.projectsError = '';
        this.jobError = '';
        this.educationError = '';
    }
    addContactWay() {
        this.contactInfo.push({
            contactWay: null,
            data: null,
        });
    }
    removeContactWay(contact) {
        this.contactInfo = this.contactInfo.filter(c => c !== contact);
    }
    addProject() {
        this.projects.push({
            name: null,
            role: null,
            date: null,
            about: null,
            poster: null,
        });
    }
    removeProject(project) {
        this.projects = this.projects.filter(p => p !== project);
    }
    addJob() {
        this.experience.push({
            companyName: '',
            profession: '',
            start: '',
            end: '',
            logo: null,
        });
    }
    removeJob(job) {
        this.experience = this.experience.filter(j => j !== job);
    }
    addUniversity() {
        this.education.push({
            name: '',
            facultyAndDegree: '',
            comment: '',
            start: '',
            end: '',
            logo: null,
        });
    }
    removeUniversity(university) {
        this.education = this.education.filter(u => u !== university);
    }
    uploadPosterHandler(e, project) {
        var _a;
        const target = e.target;
        const file = (_a = target.files) === null || _a === void 0 ? void 0 : _a.item(0);
        this.uploadPoster(file, project);
    }
    uploadJobLogoHandler(e, job) {
        var _a;
        const target = e.target;
        const file = (_a = target.files) === null || _a === void 0 ? void 0 : _a.item(0);
        this.uploadJobLogo(file, job);
    }
    uploadUniversityLogoHandler(e, university) {
        var _a;
        const target = e.target;
        const file = (_a = target.files) === null || _a === void 0 ? void 0 : _a.item(0);
        this.uploadUniversityLogo(file, university);
    }
    uploadPoster(file, project) {
        this.uploadFile(file, (e) => {
            console.log(e);
            const fr = e.target;
            if (project.poster)
                project.poster.url = fr.result;
            else {
                project.poster = {
                    encoding: '',
                    fileName: '',
                    mimetype: '',
                    size: 0,
                    url: fr.result,
                    file,
                };
            }
        });
    }
    uploadJobLogo(file, job) {
        this.uploadFile(file, (e) => {
            const fr = e.target;
            if (job.logo)
                job.logo.url = fr.result;
            else {
                job.logo = {
                    encoding: '',
                    fileName: '',
                    mimetype: '',
                    size: 0,
                    url: fr.result,
                    file,
                };
            }
        });
    }
    uploadUniversityLogo(file, university) {
        this.uploadFile(file, (e) => {
            const fr = e.target;
            if (university.logo)
                university.logo.url = fr.result;
            else {
                university.logo = {
                    encoding: '',
                    fileName: '',
                    mimetype: '',
                    size: 0,
                    url: fr.result,
                    file,
                };
            }
        });
    }
    uploadFile(file, cb) {
        const fr = new FileReader();
        fr.onload = cb;
        fr.readAsDataURL(file);
    }
    changeRole() {
        this.onChange.emit({ type: 'role', data: this.role });
    }
    changeAbout() {
        this.onChange.emit({ type: 'about', data: this.about });
    }
    changeProfession() {
        this.onChange.emit({ type: 'profession', data: this.profession });
    }
    changeLocality() {
        this.onChange.emit({ type: 'locality', data: this.localityForm.value });
    }
    changeContactInfo() {
        for (const contactWay of this.contactInfo) {
            if (this.isEmpty(contactWay)) {
                this.projectsError = 'All fields must be filled';
                return;
            }
        }
        this.onChange.emit({ type: 'contact-info', data: this.contactInfo });
    }
    changeProjects() {
        for (const project of this.projects) {
            if (this.isEmpty(project)) {
                this.projectsError = 'All fields must be filled';
                return;
            }
        }
        this.onChange.emit({ type: 'projects', data: this.projects });
        this.projectsError = '';
    }
    changeExperience() {
        for (const job of this.experience) {
            console.log(job);
            if (this.isEmpty(job)) {
                this.jobError = 'All fields must be filled';
                return;
            }
            if (!this.dateValidation(job.start, job.end)) {
                this.jobError = 'The date of dismissal cannot be earlier than the date of employment';
                return;
            }
        }
        this.onChange.emit({ type: 'experience', data: this.experience });
        this.jobError = '';
    }
    changeEducation() {
        for (const university of this.education) {
            if (this.isEmpty(university)) {
                this.jobError = 'All fields must be filled';
                return;
            }
            if (!this.dateValidation(university.start, university.end)) {
                this.educationError = 'The graduation date of the university cannot be earlier than the admission date';
                return;
            }
        }
        this.onChange.emit({ type: 'education', data: this.education });
        this.educationError = '';
    }
    entries(object) {
        return Object.entries(object);
    }
    isEmpty(entity) {
        entity = Object.entries(entity);
        for (const [_, val] of entity) {
            if (val === '')
                return true;
        }
        return false;
    }
    dateValidation(start, end) {
        const [startYear, startMonth, startDay] = start.split('-');
        const [endYear, endMonth, endDay] = end.split('-');
        if (endYear < startYear
            || ((endYear === startYear) && (endMonth < startMonth))
            || ((endYear === startYear) && (endMonth === startMonth) && (endDay < startDay)))
            return false;
        return true;
    }
    ngOnInit() { }
}
EditAdditionalInfoComponent.ɵfac = function EditAdditionalInfoComponent_Factory(t) { return new (t || EditAdditionalInfoComponent)(); };
EditAdditionalInfoComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: EditAdditionalInfoComponent, selectors: [["app-edit-additional-info"]], inputs: { role: "role", about: "about", profession: "profession", locality: "locality", contactInfo: "contactInfo", projects: "projects", experience: "experience", education: "education" }, outputs: { onChange: "onChange" }, decls: 75, vars: 20, consts: [[1, "additional-info-edit"], [1, "role"], [1, "title"], [1, "role__select"], [1, "select", 3, "options", "selectedByDefault", "error", "onChange"], [1, "btn", 3, "disabled", "click"], ["class", "company", 4, "ngIf"], [1, "about"], ["rows", "6", "placeholder", "White about yourself", 1, "about__textarea", "control-textarea", 3, "ngModel", "ngModelChange"], [1, "profession"], ["type", "text", "id", "profession", "placeholder", "White your profession", 1, "control", 3, "ngModel", "ngModelChange"], [1, "locality"], ["id", "locality", 3, "formGroup", "ngSubmit"], [1, "control-wrapper"], ["type", "text", "formControlName", "country", "name", "country", 1, "control"], ["type", "text", "formControlName", "city", "name", "city", 1, "control"], ["type", "submit", 1, "btn", 3, "disabled"], [1, "contact-info"], [1, "help"], ["class", "error", 4, "ngIf"], ["class", "control-wrapper", 4, "ngFor", "ngForOf"], [1, "controls"], [1, "btn", 3, "click"], [1, "btn"], [1, "projects"], ["class", "project", 4, "ngFor", "ngForOf"], [1, "experience"], ["class", "job", 4, "ngFor", "ngForOf"], [1, "education"], ["class", "university", 4, "ngFor", "ngForOf"], [1, "company"], [1, "error"], ["type", "text", "placeholder", "Way of contact", 1, "control", 3, "ngModel", "ngModelChange"], ["type", "text", "placeholder", "Contact data", 1, "control", 3, "ngModel", "ngModelChange"], ["icon", "close", 1, "remove", 3, "click"], [1, "project"], ["icon", "close", 1, "close", 3, "click"], ["type", "text", 1, "control", 3, "ngModel", "ngModelChange"], ["type", "date", 1, "control", 3, "ngModel", "ngModelChange"], ["rows", "3", "placeholder", "Write about project", 1, "control-textarea", 3, "ngModel", "ngModelChange"], [1, "poster-upload"], ["type", "file", 1, "hidden", 3, "change"], ["input_file", ""], [1, "btn-outline", "upload", 3, "click"], ["class", "uploaded", 4, "ngIf"], [1, "uploaded"], ["uploaded", ""], ["alt", "poster", 3, "src"], [1, "size"], [1, "job"], [1, "start"], [1, "end"], [1, "logo"], ["job_logo_upload", ""], ["alt", "logo", 3, "src"], [1, "university"], [1, "name"], [1, "faculty-and-degree"], [1, "comment"], ["rows", "3", 1, "control-textarea", 3, "ngModel", "ngModelChange"], ["university_logo_upload", ""]], template: function EditAdditionalInfoComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "h3", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Role");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "app-select", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("onChange", function EditAdditionalInfoComponent_Template_app_select_onChange_5_listener($event) { return ctx.role = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_Template_button_click_6_listener() { return ctx.changeRole(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Choose");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, EditAdditionalInfoComponent_div_8_Template, 1, 0, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "h3", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "About yourself");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "textarea", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_Template_textarea_ngModelChange_12_listener($event) { return ctx.about = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_Template_button_click_13_listener() { return ctx.changeAbout(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "Save");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "h3", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Profession");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "input", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function EditAdditionalInfoComponent_Template_input_ngModelChange_18_listener($event) { return ctx.profession = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_Template_button_click_19_listener() { return ctx.changeProfession(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Save");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "h3", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "Locality");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "form", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngSubmit", function EditAdditionalInfoComponent_Template_form_ngSubmit_24_listener() { return ctx.changeLocality(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "label", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, " Country ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](27, "input", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "label", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, " City ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](30, "input", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "button", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "Save");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "h3", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, "Contact Information");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "p", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, "Write here ways of contacting you. Please note that this data will be available to everyone!");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](38, EditAdditionalInfoComponent_div_38_Template, 2, 1, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](39, EditAdditionalInfoComponent_label_39_Template, 4, 2, "label", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "button", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_Template_button_click_41_listener() { return ctx.addContactWay(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, "Add");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "button", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "Save");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "h3", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](47, "Projects");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](48, EditAdditionalInfoComponent_div_48_Template, 2, 1, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](49, EditAdditionalInfoComponent_div_49_Template, 21, 5, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "button", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_Template_button_click_51_listener() { return ctx.addProject(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, "Add");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "button", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](54, "Save");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "div", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "h3", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "Experience");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](58, EditAdditionalInfoComponent_div_58_Template, 2, 1, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](59, EditAdditionalInfoComponent_div_59_Template, 25, 5, "div", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "button", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_Template_button_click_61_listener() { return ctx.addJob(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](62, "Add");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "button", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_Template_button_click_63_listener() { return ctx.changeExperience(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](64, "Save");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "div", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "h3", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](67, "Education");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](68, EditAdditionalInfoComponent_div_68_Template, 2, 1, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](69, EditAdditionalInfoComponent_div_69_Template, 29, 6, "div", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](71, "button", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_Template_button_click_71_listener() { return ctx.addUniversity(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](72, "Add");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](73, "button", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditAdditionalInfoComponent_Template_button_click_73_listener() { return ctx.changeEducation(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](74, "Save");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("options", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](19, _c0))("selectedByDefault", ctx.role ? ctx.role : "Choose your role")("error", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.role === "" || ctx.role === "Choose your role");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.role === "HR");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.about);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.about === "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.profession);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.profession === "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.localityForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.localityForm.invalid);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.projectsError);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.contactInfo);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.projectsError);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.projects);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.jobError);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.experience);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.educationError);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.education);
    } }, directives: [_components_select_select_component__WEBPACK_IMPORTED_MODULE_2__["SelectComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgModel"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlName"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgForOf"], _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_4__["SvgIconComponent"]], styles: [".user-select-none[_ngcontent-%COMP%] {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.additional-info-edit[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  margin-bottom: 40px;\n  width: 80%;\n}\n.additional-info-edit[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-weight: 500;\n  margin-bottom: 10px;\n}\n.additional-info-edit[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .additional-info-edit[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  font-family: 'Poppins', sans-serif;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .control[_ngcontent-%COMP%] {\n  display: block;\n  width: 60%;\n  height: 40px;\n  padding: 10px;\n  border-radius: 8px;\n  border: 1px solid #ccc;\n  outline: none;\n  font-size: 16px;\n  transition: border-color 0.5s;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .control[_ngcontent-%COMP%]:hover, .additional-info-edit[_ngcontent-%COMP%]   .control[_ngcontent-%COMP%]:focus {\n  border: 1px solid #0a92d9;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .control-textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  display: block;\n  border: 1px solid #ccc;\n  border-radius: 8px;\n  padding: 10px;\n  transition: border-color 0.5s;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .control-textarea[_ngcontent-%COMP%]:focus, .additional-info-edit[_ngcontent-%COMP%]   .control-textarea[_ngcontent-%COMP%]:hover {\n  border-color: #0a92d9;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .control-textarea[_ngcontent-%COMP%]::-webkit-scrollbar {\n  display: none;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .control-wrapper[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 14px;\n  color: #747474;\n  margin-bottom: 20px;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .upload[_ngcontent-%COMP%] {\n  display: block;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .uploaded[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .uploaded[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .uploaded[_ngcontent-%COMP%]   .size[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  padding: 0 5px;\n  background-color: rgba(0, 0, 0, 0.3);\n  color: white;\n  font-size: 12px;\n  text-align: center;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .role__select[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .role__select[_ngcontent-%COMP%]   .select[_ngcontent-%COMP%] {\n  width: 250px;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .role__select[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  height: 40px;\n  margin: 0;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .about__textarea[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%]   .help[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #747474;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%]   .control-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 15px 0;\n  margin: 10px 0 0;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%]   .control-wrapper[_ngcontent-%COMP%]   .control[_ngcontent-%COMP%] {\n  margin-right: 10px;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%]   .control-wrapper[_ngcontent-%COMP%]   .remove[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  fill: #aaa;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%]   .control-wrapper[_ngcontent-%COMP%]    + .control-wrapper[_ngcontent-%COMP%] {\n  border-top: 1px solid #b4b4b4;\n  margin-top: 0;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .projects[_ngcontent-%COMP%]   .project[_ngcontent-%COMP%]   .poster-upload[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 400;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .projects[_ngcontent-%COMP%]   .project[_ngcontent-%COMP%]   .poster-upload[_ngcontent-%COMP%]   .uploaded[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  max-width: 250px;\n  max-height: 160px;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .experience[_ngcontent-%COMP%]   .uploaded[_ngcontent-%COMP%] {\n  max-width: 150px;\n  max-height: 150px;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .education[_ngcontent-%COMP%]   .uploaded[_ngcontent-%COMP%] {\n  max-width: 150px;\n  max-height: 150px;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .project[_ngcontent-%COMP%], .additional-info-edit[_ngcontent-%COMP%]   .job[_ngcontent-%COMP%], .additional-info-edit[_ngcontent-%COMP%]   .university[_ngcontent-%COMP%] {\n  position: relative;\n  padding-bottom: 20px;\n  margin-top: 20px;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .project[_ngcontent-%COMP%]   .close[_ngcontent-%COMP%], .additional-info-edit[_ngcontent-%COMP%]   .job[_ngcontent-%COMP%]   .close[_ngcontent-%COMP%], .additional-info-edit[_ngcontent-%COMP%]   .university[_ngcontent-%COMP%]   .close[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  fill: #747474;\n  position: absolute;\n  right: 0;\n  top: 10px;\n  cursor: pointer;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .project[_ngcontent-%COMP%]:not(:nth-last-child(2)), .additional-info-edit[_ngcontent-%COMP%]   .job[_ngcontent-%COMP%]:not(:nth-last-child(2)), .additional-info-edit[_ngcontent-%COMP%]   .university[_ngcontent-%COMP%]:not(:nth-last-child(2)) {\n  padding-bottom: 20px;\n  border-bottom: 1px solid #aaa;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .project[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%], .additional-info-edit[_ngcontent-%COMP%]   .job[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%], .additional-info-edit[_ngcontent-%COMP%]   .university[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%], .additional-info-edit[_ngcontent-%COMP%]   .project[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%], .additional-info-edit[_ngcontent-%COMP%]   .job[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%], .additional-info-edit[_ngcontent-%COMP%]   .university[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%] {\n  padding-bottom: 0;\n  border-bottom: 0;\n}\n.additional-info-edit[_ngcontent-%COMP%]   .projects[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%], .additional-info-edit[_ngcontent-%COMP%]   .experience[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%], .additional-info-edit[_ngcontent-%COMP%]   .education[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%], .additional-info-edit[_ngcontent-%COMP%]   .contact-info[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  margin-bottom: 10px;\n  background-color: rgba(222, 14, 14, 0.3);\n  border: 2px solid #de0e0e;\n  border-radius: 8px;\n  color: #ae0b0b;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc3R5bGVzXFxtaXhpbnNcXHRleHQtbWl4aW5zLmxlc3MiLCJlZGl0LWFkZGl0aW9uYWwtaW5mby5jb21wb25lbnQubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGlCQUFBO0VBQ0EseUJBQUE7RUFDQSxzQkFBQTtFQUNBLHFCQUFBO0FDQ0o7QUFESTtFQUNJLG1CQUFBO0VBQ0EsVUFBQTtBQUdSO0FBTEk7RUFJUSxnQkFBQTtFQUNBLG1CQUFBO0FBSVo7QUFWQTs7RUFZUSxrQ0FBQTtBQUVSO0FBZEE7RUFnQlEsY0FBQTtFQUVBLFVBQUE7RUFDQSxZQUFBO0VBRUEsYUFBQTtFQUVBLGtCQUFBO0VBQ0Esc0JBQUE7RUFDQSxhQUFBO0VBRUEsZUFBQTtFQUVBLDZCQUFBO0FBSlI7QUFNUTs7RUFFSSx5QkFBQTtBQUpaO0FBN0JBO0VBc0NRLFdBQUE7RUFDQSxjQUFBO0VBRUEsc0JBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7RUFFQSw2QkFBQTtBQVJSO0FBVVE7O0VBRUkscUJBQUE7QUFSWjtBQVdRO0VBQ0ksYUFBQTtBQVRaO0FBNUNBO0VBMERRLGNBQUE7RUFDQSxlQUFBO0VBQ0EsY0FBQTtFQUVBLG1CQUFBO0FBWlI7QUFsREE7RUFrRVEsY0FBQTtBQWJSO0FBckRBO0VBc0VRLGtCQUFBO0VBQ0EsZ0JBQUE7QUFkUjtBQXpEQTtFQTBFWSxXQUFBO0FBZFo7QUE1REE7RUE4RVksa0JBQUE7RUFDQSxRQUFBO0VBQ0EsU0FBQTtFQUVBLGNBQUE7RUFFQSxvQ0FBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0Esa0JBQUE7QUFqQlo7QUFzQlE7RUFDSSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtBQXBCWjtBQWlCUTtFQU1RLFlBQUE7QUFwQmhCO0FBY1E7RUFVUSxZQUFBO0VBQ0EsU0FBQTtBQXJCaEI7QUEyQlE7RUFDSSxXQUFBO0FBekJaO0FBckZBO0VBdUhZLGVBQUE7RUFDQSxjQUFBO0FBL0JaO0FBekZBO0VBNEhZLGFBQUE7RUFDQSw4QkFBQTtFQUNBLG1CQUFBO0VBRUEsZUFBQTtFQUNBLGdCQUFBO0FBakNaO0FBaEdBO0VBb0lnQixrQkFBQTtBQWpDaEI7QUFuR0E7RUF3SWdCLFdBQUE7RUFDQSxZQUFBO0VBRUEsVUFBQTtBQW5DaEI7QUFzQ1k7RUFDSSw2QkFBQTtFQUNBLGFBQUE7QUFwQ2hCO0FBNUdBO0VBeUpnQixlQUFBO0VBQ0EsZ0JBQUE7QUExQ2hCO0FBaEhBO0VBNkpvQixnQkFBQTtFQUVBLGdCQUFBO0VBQ0EsaUJBQUE7QUEzQ3BCO0FBckhBO0VBd0tZLGdCQUFBO0VBQ0EsaUJBQUE7QUFoRFo7QUF6SEE7RUErS1ksZ0JBQUE7RUFDQSxpQkFBQTtBQW5EWjtBQTdIQTs7O0VBcUxRLGtCQUFBO0VBQ0Esb0JBQUE7RUFDQSxnQkFBQTtBQW5EUjtBQXBJQTs7O0VBMExZLFdBQUE7RUFDQSxZQUFBO0VBRUEsYUFBQTtFQUVBLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLFNBQUE7RUFFQSxlQUFBO0FBcERaO0FBdURROzs7RUFDSSxvQkFBQTtFQUNBLDZCQUFBO0FBbkRaO0FBckpBOzs7Ozs7RUE0TVksaUJBQUE7RUFDQSxnQkFBQTtBQS9DWjtBQTlKQTs7OztFQW1OWSxrQkFBQTtFQUNBLG1CQUFBO0VBRUEsd0NBQUE7RUFDQSx5QkFBQTtFQUNBLGtCQUFBO0VBQ0EsY0FBQTtBQWhEWiIsImZpbGUiOiJlZGl0LWFkZGl0aW9uYWwtaW5mby5jb21wb25lbnQubGVzcyIsInNvdXJjZXNDb250ZW50IjpbIi51c2VyLXNlbGVjdC1ub25lIHtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xufVxuIiwiQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvdmFyaWFibGVzJztcbkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL21peGlucy90ZXh0LW1peGlucyc7XG5cbi5hZGRpdGlvbmFsLWluZm8tZWRpdCB7XG4gICAgJiA+IGRpdiB7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDQwcHg7XG4gICAgICAgIHdpZHRoOiA4MCU7XG4gICAgICAgIC50aXRsZSB7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlucHV0LFxuICAgIHRleHRhcmVhIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IEBmZjtcbiAgICB9XG5cbiAgICAuY29udHJvbCB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuXG4gICAgICAgIHdpZHRoOiA2MCU7XG4gICAgICAgIGhlaWdodDogNDBweDtcblxuICAgICAgICBwYWRkaW5nOiAxMHB4O1xuXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcbiAgICAgICAgb3V0bGluZTogbm9uZTtcblxuICAgICAgICBmb250LXNpemU6IDE2cHg7XG5cbiAgICAgICAgdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIDAuNXM7XG5cbiAgICAgICAgJjpob3ZlcixcbiAgICAgICAgJjpmb2N1cyB7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBsaWdodGVuKEBhY3RpdmUsIDEwJSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuY29udHJvbC10ZXh0YXJlYSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcblxuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgIHBhZGRpbmc6IDEwcHg7XG5cbiAgICAgICAgdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIDAuNXM7XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6IGxpZ2h0ZW4oQGFjdGl2ZSwgMTAlKTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuY29udHJvbC13cmFwcGVyIHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgY29sb3I6IEBsaWdodDtcblxuICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuICAgIH1cblxuICAgIC51cGxvYWQge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICB9XG5cbiAgICAudXBsb2FkZWQge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgICAgICAgaW1nIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICB9XG5cbiAgICAgICAgLnNpemUge1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgcmlnaHQ6IDA7XG4gICAgICAgICAgICBib3R0b206IDA7XG5cbiAgICAgICAgICAgIHBhZGRpbmc6IDAgNXB4O1xuXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKCMwMDAsIDAuMyk7XG4gICAgICAgICAgICBjb2xvcjogd2hpdGU7XG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAucm9sZSB7XG4gICAgICAgICZfX3NlbGVjdCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAgICAgLnNlbGVjdCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDI1MHB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAuYnRuIHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmFib3V0IHtcbiAgICAgICAgJl9fdGV4dGFyZWEge1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAucHJvZmVzc2lvbiB7XG4gICAgfVxuXG4gICAgLmNvbnRhY3QtaW5mbyB7XG4gICAgICAgIC5oZWxwIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgIGNvbG9yOiBAbGlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICAuY29udHJvbC13cmFwcGVyIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgICAgICBwYWRkaW5nOiAxNXB4IDA7XG4gICAgICAgICAgICBtYXJnaW46IDEwcHggMCAwO1xuXG4gICAgICAgICAgICAuY29udHJvbCB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAucmVtb3ZlIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMThweDtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDE4cHg7XG5cbiAgICAgICAgICAgICAgICBmaWxsOiAjYWFhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmICsgLmNvbnRyb2wtd3JhcHBlciB7XG4gICAgICAgICAgICAgICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIGxpZ2h0ZW4oQGxpZ2h0LCAyNSUpO1xuICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAucHJvamVjdHMge1xuICAgICAgICAucHJvamVjdCB7XG5cbiAgICAgICAgICAgIC5wb3N0ZXItdXBsb2FkIHtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcblxuICAgICAgICAgICAgICAgIC51cGxvYWRlZCB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IDIwcHg7XG5cbiAgICAgICAgICAgICAgICAgICAgbWF4LXdpZHRoOiAyNTBweDtcbiAgICAgICAgICAgICAgICAgICAgbWF4LWhlaWdodDogMTYwcHg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmV4cGVyaWVuY2Uge1xuICAgICAgICAudXBsb2FkZWQge1xuICAgICAgICAgICAgbWF4LXdpZHRoOiAxNTBweDtcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IDE1MHB4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmVkdWNhdGlvbiB7XG4gICAgICAgIC51cGxvYWRlZCB7XG4gICAgICAgICAgICBtYXgtd2lkdGg6IDE1MHB4O1xuICAgICAgICAgICAgbWF4LWhlaWdodDogMTUwcHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAucHJvamVjdCwgLmpvYiwgLnVuaXZlcnNpdHkge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIHBhZGRpbmctYm90dG9tOiAyMHB4O1xuICAgICAgICBtYXJnaW4tdG9wOiAyMHB4O1xuXG4gICAgICAgIC5jbG9zZSB7XG4gICAgICAgICAgICB3aWR0aDogMTZweDtcbiAgICAgICAgICAgIGhlaWdodDogMTZweDtcblxuICAgICAgICAgICAgZmlsbDogQGxpZ2h0O1xuXG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICByaWdodDogMDtcbiAgICAgICAgICAgIHRvcDogMTBweDtcblxuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpub3QoOm50aC1sYXN0LWNoaWxkKDIpKSB7XG4gICAgICAgICAgICBwYWRkaW5nLWJvdHRvbTogMjBweDtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjYWFhO1xuICAgICAgICB9XG5cbiAgICAgICAgLnRpdGxlLCAuZXJyb3Ige1xuICAgICAgICAgICAgcGFkZGluZy1ib3R0b206IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tOiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLnByb2plY3RzLCAuZXhwZXJpZW5jZSwgLmVkdWNhdGlvbiwgLmNvbnRhY3QtaW5mbyB7XG4gICAgICAgIC5lcnJvciB7XG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4IDIwcHg7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKEBkYW5nZXIsIC4zKTtcbiAgICAgICAgICAgIGJvcmRlcjogMnB4IHNvbGlkIEBkYW5nZXI7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgICAgICBjb2xvcjogZGFya2VuKEBkYW5nZXIsIDEwJSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0= */"] });


/***/ }),

/***/ "7Nds":
/*!********************************************************!*\
  !*** ./src/app/store/my-profile/my-profile.effects.ts ***!
  \********************************************************/
/*! exports provided: MyProfileEffects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileEffects", function() { return MyProfileEffects; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/effects */ "9jGm");
/* harmony import */ var _my_profile_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./my-profile.actions */ "fLR6");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _services_profile_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/profile.service */ "Aso2");
/* harmony import */ var _services_chat_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/chat.service */ "sjK5");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common/http */ "tk/3");










class MyProfileEffects {
    constructor(actions$, profileService, chatService, http) {
        this.actions$ = actions$;
        this.profileService = profileService;
        this.chatService = chatService;
        this.http = http;
    }
    getProfileInfo$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["GET_MY_PROFILE_INFO_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            if (Number.isInteger(action.payload.id)) {
                return this.profileService
                    .getProfileInfo(action.payload.id)
                    .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(res => {
                    console.log(res.user);
                    return new _my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileGetInfoSuccessAction"]({
                        profile: res.user,
                    });
                }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(() => rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"]));
            }
            return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
        }));
    }
    acceptConnection$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["ACCEPT_CONNECTION_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            const payload = action.payload;
            return this.profileService
                .acceptConnection(payload.senderId, payload.userId, payload.date)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(res => {
                this.chatService.joinToChat(res.chatId);
                return new _my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileAcceptConnectionSuccessAction"]({
                    senderId: payload.senderId,
                    date: payload.date,
                });
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
                console.log('MyProfileAcceptConnectionAction error: ', err);
                return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
            }));
        }));
    }
    declineConnection$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["DECLINE_CONNECTION_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            const payload = action.payload;
            return this.profileService
                .declineConnection(payload.senderId, payload.userId)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(() => new _my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileDeclineConnectionSuccessAction"]({
                senderId: payload.senderId,
            })), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
                console.log('MyProfileDeclineConnectionAction error:', err);
                return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
            }));
        }));
    }
    cancelConnection$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["CANCEL_CONNECTION_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            const payload = action.payload;
            return this.profileService
                .cancelConnection(payload.senderId, payload.userId)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(() => new _my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileCancelConnectionSuccessAction"]({
                userId: payload.userId,
            })), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"]));
        }));
    }
    removeConnection$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["REMOVE_CONNECTION_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])((action) => {
            const payload = action.payload;
            return this.profileService
                .removeConnection(payload.senderId, payload.userId)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(() => new _my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileRemoveConnectionSuccessAction"]({
                userId: payload.userId,
            })), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
                console.log('ProfileRemoveConnectionAction error:', err);
                return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
            }));
        }));
    }
    changeRole$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["CHANGE_ROLE_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])((action) => {
            const { role, id } = action.payload;
            return this.profileService
                .changeRole(role, id)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(changed => {
                console.log(changed);
                return new _my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileChangeRoleSuccessAction"]({});
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
                console.log(err);
                return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
            }));
        }));
    }
    // changeCompany$(): Observable<MyProfileActions> {}
    changeAbout$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["CHANGE_ABOUT_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])((action) => {
            const { about, id } = action.payload;
            return this.profileService
                .changeAbout(about, id)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(changed => {
                console.log(changed);
                return new _my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileChangeAboutSuccessAction"]({});
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
                console.log(err);
                return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
            }));
        }));
    }
    changeProfession$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["CHANGE_PROFESSION_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])((action) => {
            const { profession, id } = action.payload;
            return this.profileService
                .changeProfession(profession, id)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(changed => {
                console.log(changed);
                return new _my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileChangeProfessionSuccessAction"]({});
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
                console.log(err);
                return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
            }));
        }));
    }
    changeLocality$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["CHANGE_LOCALITY_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])((action) => {
            const { locality, id } = action.payload;
            return this.profileService
                .changeLocality(locality, id)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(changed => {
                console.log(changed);
                return new _my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileChangeLocalitySuccessAction"]({});
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
                console.log(err);
                return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
            }));
        }));
    }
    changeContactInfo$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["CHANGE_CONTACT_INFO_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])((action) => {
            const { contactInfo, id } = action.payload;
            return this.profileService
                .changeContactInfo(contactInfo, id)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(changed => {
                console.log(changed);
                return new _my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileChangeContactInfoSuccessAction"]({});
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
                console.log(err);
                return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
            }));
        }));
    }
    changeProjects$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["CHANGE_PROJECTS_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])((action) => {
            const { projects, id } = action.payload;
            return this.profileService
                .changeProjects(projects, id)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(changed => {
                console.log(changed);
                return new _my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileChangeProjectsSuccessAction"]({});
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
                console.log(err);
                return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
            }));
        }));
    }
    changeExperience$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["CHANGE_EXPERIENCE_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])((action) => {
            const { experience, id } = action.payload;
            return this.profileService
                .changeExperience(experience, id)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(changed => {
                console.log(changed);
                return new _my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileChangeEducationSuccessAction"]({});
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
                console.log(err);
                return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
            }));
        }));
    }
    changeEducation$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["CHANGE_EDUCATION_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])((action) => {
            const { education, id } = action.payload;
            return this.profileService
                .changeEducation(education, id)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(changed => {
                console.log(changed);
                return new _my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileChangeEducationSuccessAction"]({});
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
                console.log(err);
                return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
            }));
        }));
    }
}
MyProfileEffects.ɵfac = function MyProfileEffects_Factory(t) { return new (t || MyProfileEffects)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_services_profile_service__WEBPACK_IMPORTED_MODULE_6__["ProfileService"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_services_chat_service__WEBPACK_IMPORTED_MODULE_7__["ChatService"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_8__["HttpClient"])); };
MyProfileEffects.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({ token: MyProfileEffects, factory: MyProfileEffects.ɵfac });
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], MyProfileEffects.prototype, "getProfileInfo$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], MyProfileEffects.prototype, "acceptConnection$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], MyProfileEffects.prototype, "declineConnection$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], MyProfileEffects.prototype, "cancelConnection$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], MyProfileEffects.prototype, "removeConnection$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], MyProfileEffects.prototype, "changeRole$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], MyProfileEffects.prototype, "changeAbout$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], MyProfileEffects.prototype, "changeProfession$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], MyProfileEffects.prototype, "changeLocality$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], MyProfileEffects.prototype, "changeContactInfo$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], MyProfileEffects.prototype, "changeProjects$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], MyProfileEffects.prototype, "changeExperience$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], MyProfileEffects.prototype, "changeEducation$", null);


/***/ }),

/***/ "8r/t":
/*!*************************************************!*\
  !*** ./src/app/views/profile/profile.module.ts ***!
  \*************************************************/
/*! exports provided: ProfileModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileModule", function() { return ProfileModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _components_components_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/components.module */ "j1ZV");
/* harmony import */ var _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../svg-icon/svg-icon.module */ "uQlT");
/* harmony import */ var _profile_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./profile.component */ "wF9P");
/* harmony import */ var _profile_main_profile_main_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./profile-main/profile-main.component */ "BUNl");
/* harmony import */ var _profile_side_profile_side_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./profile-side/profile-side.component */ "fDhk");
/* harmony import */ var _edit_profile_edit_profile_side_edit_profile_side_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./edit-profile/edit-profile-side/edit-profile-side.component */ "W0ui");
/* harmony import */ var _edit_profile_edit_profile_main_edit_profile_main_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./edit-profile/edit-profile-main/edit-profile-main.component */ "fb7c");
/* harmony import */ var _edit_profile_edit_profile_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./edit-profile/edit-profile.component */ "QBc3");
/* harmony import */ var _edit_profile_edit_components_edit_personal_data_edit_personal_data_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./edit-profile/edit-components/edit-personal-data/edit-personal-data.component */ "oVQW");
/* harmony import */ var _edit_profile_edit_components_edit_login_and_security_edit_login_and_security_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./edit-profile/edit-components/edit-login-and-security/edit-login-and-security.component */ "dCal");
/* harmony import */ var _edit_profile_edit_components_edit_additional_info_edit_additional_info_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./edit-profile/edit-components/edit-additional-info/edit-additional-info.component */ "5hme");
/* harmony import */ var _pipes_pipes_module__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../pipes/pipes.module */ "iTUp");
/* harmony import */ var _directives_directives_module__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../directives/directives.module */ "FUS3");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/core */ "fXoL");


















class ProfileModule {
}
ProfileModule.ɵfac = function ProfileModule_Factory(t) { return new (t || ProfileModule)(); };
ProfileModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdefineNgModule"]({ type: ProfileModule });
ProfileModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdefineInjector"]({ imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
            _components_components_module__WEBPACK_IMPORTED_MODULE_3__["ComponentsModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
            _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_4__["SvgIconModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
            _pipes_pipes_module__WEBPACK_IMPORTED_MODULE_14__["PipesModule"],
            _directives_directives_module__WEBPACK_IMPORTED_MODULE_15__["DirectivesModule"],
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵsetNgModuleScope"](ProfileModule, { declarations: [_profile_component__WEBPACK_IMPORTED_MODULE_5__["ProfileComponent"],
        _profile_main_profile_main_component__WEBPACK_IMPORTED_MODULE_6__["ProfileMainComponent"],
        _profile_side_profile_side_component__WEBPACK_IMPORTED_MODULE_7__["ProfileSideComponent"],
        _edit_profile_edit_profile_component__WEBPACK_IMPORTED_MODULE_10__["EditProfileComponent"],
        _edit_profile_edit_profile_side_edit_profile_side_component__WEBPACK_IMPORTED_MODULE_8__["EditProfileSideComponent"],
        _edit_profile_edit_profile_main_edit_profile_main_component__WEBPACK_IMPORTED_MODULE_9__["EditProfileMainComponent"],
        _edit_profile_edit_components_edit_personal_data_edit_personal_data_component__WEBPACK_IMPORTED_MODULE_11__["EditPersonalDataComponent"],
        _edit_profile_edit_components_edit_login_and_security_edit_login_and_security_component__WEBPACK_IMPORTED_MODULE_12__["EditLoginAndSecurityComponent"],
        _edit_profile_edit_components_edit_additional_info_edit_additional_info_component__WEBPACK_IMPORTED_MODULE_13__["EditAdditionalInfoComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
        _components_components_module__WEBPACK_IMPORTED_MODULE_3__["ComponentsModule"],
        _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
        _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_4__["SvgIconModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
        _pipes_pipes_module__WEBPACK_IMPORTED_MODULE_14__["PipesModule"],
        _directives_directives_module__WEBPACK_IMPORTED_MODULE_15__["DirectivesModule"]] }); })();
_angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵsetComponentScope"](_profile_component__WEBPACK_IMPORTED_MODULE_5__["ProfileComponent"], [_profile_main_profile_main_component__WEBPACK_IMPORTED_MODULE_6__["ProfileMainComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_0__["NgIf"], _profile_side_profile_side_component__WEBPACK_IMPORTED_MODULE_7__["ProfileSideComponent"]], []);


/***/ }),

/***/ "99sx":
/*!*************************************************************!*\
  !*** ./src/app/views/chat/chat-main/chat-main.component.ts ***!
  \*************************************************************/
/*! exports provided: ChatMainComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatMainComponent", function() { return ChatMainComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _services_chat_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../services/chat.service */ "sjK5");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../svg-icon/svg-icon.component */ "W/uP");





function ChatMainComponent_div_15_div_8__svg_svg_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "svg", 25);
} }
function ChatMainComponent_div_15_div_8__svg_svg_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "svg", 26);
} }
function ChatMainComponent_div_15_div_8__svg_svg_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "svg", 27);
} }
function ChatMainComponent_div_15_div_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, ChatMainComponent_div_15_div_8__svg_svg_1_Template, 1, 0, "svg", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, ChatMainComponent_div_15_div_8__svg_svg_2_Template, 1, 0, "svg", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, ChatMainComponent_div_15_div_8__svg_svg_3_Template, 1, 0, "svg", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const message_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", message_r1.status === "wait");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", message_r1.status === "sent");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", message_r1.status === "read");
} }
function ChatMainComponent_div_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](7, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, ChatMainComponent_div_15_div_8_Template, 4, 3, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const message_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("message-in", message_r1.type === "in")("message-out", message_r1.type === "out");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](message_r1.content);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](7, 7, message_r1.time, "h:mm a"));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", message_r1.type === "out" && message_r1.status);
} }
class ChatMainComponent {
    constructor(chatService) {
        this.chatService = chatService;
        this.buddy = {
            isOnline: false,
            lastOnline: Date.now() - 60 * 60 * 5,
        };
        this.Date = Date;
        this.messageContent = '';
        this.messages = [
            {
                type: 'in',
                content: 'Hello!',
                time: Date.now(),
                status: 'sent',
            },
            {
                type: 'in',
                content: 'How do you do?',
                time: Date.now(),
                status: 'sent',
            },
            {
                type: 'out',
                content: 'Hello, my friend!',
                time: Date.now(),
                status: 'read',
            },
            {
                type: 'out',
                content: "I'm fine, thank you)",
                time: Date.now(),
                status: 'read',
            },
            {
                type: 'out',
                content: 'And you?',
                time: Date.now(),
                status: 'read',
            },
        ];
    }
    sendMessage() {
        this.chatService.test(this.messageContent);
    }
    dateParser(now, last) {
        const deltaSec = (now - last) / 1000;
        const secondsPerDay = 60 * 60 * 24;
        const secondsPerHour = 60 * 60;
        const secondsPerMinute = 60;
        if (deltaSec > secondsPerDay) {
            const days = Math.floor(deltaSec / secondsPerDay);
            if (days < 2)
                return 'day ago';
            return Math.floor(deltaSec / secondsPerDay) + ' days ago';
        }
        else if (deltaSec > secondsPerHour) {
            const hours = Math.floor(deltaSec / secondsPerDay);
            if (hours < 2)
                return 'hour ago';
            return Math.floor(deltaSec / secondsPerHour) + ' hours ago';
        }
        else if (deltaSec > secondsPerMinute) {
            const minutes = Math.floor(deltaSec / secondsPerDay);
            if (minutes < 2)
                return 'minute ago';
            return Math.floor(deltaSec / secondsPerMinute) + ' minutes ago';
        }
        else
            return 'minute ago';
    }
    ngOnInit() { }
}
ChatMainComponent.ɵfac = function ChatMainComponent_Factory(t) { return new (t || ChatMainComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_chat_service__WEBPACK_IMPORTED_MODULE_1__["ChatService"])); };
ChatMainComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ChatMainComponent, selectors: [["app-chat-main"]], decls: 22, vars: 5, consts: [[1, "chat"], [1, "chat__header"], [1, "buddy-info"], [1, "name"], [1, "online-status"], [1, "shared-media"], [1, "chat__body"], [1, "messages"], [1, "day"], [3, "message-in", "message-out", 4, "ngFor", "ngForOf"], [1, "chat__footer"], ["rows", "3", "contenteditable", "true", "onblur", "this.value = this.value.trim()", "placeholder", "White your message", 3, "ngModel", "ngModelChange"], [1, "controls"], ["icon", "attach", 1, "attach"], [1, "send", 3, "click"], ["icon", "send"], [1, "message"], [1, "content"], [1, "info"], [1, "time"], ["class", "status", 4, "ngIf"], [1, "status"], ["icon", "chatStatusWait", 4, "ngIf"], ["icon", "chatStatusSent", 4, "ngIf"], ["icon", "chatStatusRead", 4, "ngIf"], ["icon", "chatStatusWait"], ["icon", "chatStatusSent"], ["icon", "chatStatusRead"]], template: function ChatMainComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Chat with ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, " Yesterday, 12 apr ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](15, ChatMainComponent_div_15_Template, 9, 10, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "textarea", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function ChatMainComponent_Template_textarea_ngModelChange_17_listener($event) { return ctx.messageContent = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](19, "svg", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ChatMainComponent_Template_button_click_20_listener() { return ctx.sendMessage(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](21, "svg", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"]("buddy name");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.buddy.isOnline ? "Online" : "Last seen " + ctx.dateParser(ctx.Date.now(), ctx.buddy.lastOnline), " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" Shared media (", "shared.length", ") ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.messages);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.messageContent);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["NgForOf"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgModel"], _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_4__["SvgIconComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["DatePipe"]], styles: [".user-select-none[_ngcontent-%COMP%] {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.light-thin-scrollbar[_ngcontent-%COMP%] {\n  \n}\n.light-thin-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 5px;\n  \n  background-color: white;\n}\n.light-thin-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background-color: #c1c1c1;\n  border-radius: 20px;\n}\n.chat[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.chat__header[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 50px;\n  line-height: 50px;\n  padding-left: 25px;\n  padding-right: 25px;\n  display: flex;\n  justify-content: space-between;\n  text-transform: uppercase;\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.chat__header[_ngcontent-%COMP%]   .buddy-info[_ngcontent-%COMP%] {\n  display: flex;\n}\n.chat__header[_ngcontent-%COMP%]   .buddy-info[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n  margin-right: 10px;\n}\n.chat__header[_ngcontent-%COMP%]   .buddy-info[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #0871a8;\n  cursor: pointer;\n}\n.chat__header[_ngcontent-%COMP%]   .buddy-info[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.chat__header[_ngcontent-%COMP%]   .buddy-info[_ngcontent-%COMP%]   .online-status[_ngcontent-%COMP%] {\n  color: #747474;\n  text-transform: none;\n}\n.chat__body[_ngcontent-%COMP%] {\n  position: relative;\n  height: 520px;\n  max-height: 520px;\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: flex;\n  flex-direction: column;\n  padding-left: 5%;\n  padding-right: 5%;\n  margin-bottom: 40px;\n  \n}\n.chat__body[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 5px;\n  \n  background-color: white;\n}\n.chat__body[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background-color: #c1c1c1;\n  border-radius: 20px;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%] {\n  width: 90%;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  color: #747474;\n  font-size: 16px;\n  font-weight: 500;\n  width: 100%;\n  text-align: center;\n  margin: 20px;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-in[_ngcontent-%COMP%], .chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-out[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-in[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%], .chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-out[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%] {\n  position: relative;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  max-width: 70%;\n  border-radius: 8px;\n  padding: 10px 20px;\n  word-wrap: break-word;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-in[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%], .chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-out[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%] {\n  display: flex;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-in[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .status[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%], .chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-out[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .status[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 12px;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-in[_ngcontent-%COMP%] {\n  align-items: flex-start;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-in[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%] {\n  background-color: #e9f0f8;\n  color: #181818;\n  margin-bottom: 10px;\n  padding-right: 70px;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-in[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n  position: absolute;\n  bottom: 5px;\n  right: 10px;\n  width: 100%;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-in[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .time[_ngcontent-%COMP%] {\n  color: #747474;\n  font-size: 11px;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-out[_ngcontent-%COMP%] {\n  align-items: flex-end;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-out[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%] {\n  align-items: flex-end;\n  margin-bottom: 20px;\n  background-color: #0871a8;\n  color: white;\n  border-bottom-right-radius: 0;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-out[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: flex-end;\n  align-items: center;\n  position: absolute;\n  bottom: -22px;\n  right: -15px;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-out[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .time[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: #747474;\n  width: 55px;\n  text-align: center;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message-out[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%]:after {\n  content: '';\n  position: absolute;\n  right: -20px;\n  bottom: 0;\n  border: 10px solid transparent;\n  border-bottom: 10px solid #0871a8;\n  border-left: 10px solid #0871a8;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%] {\n  color: white;\n  background-color: #0871a8;\n  position: relative;\n  margin-bottom: 25px;\n  border-bottom-right-radius: 0;\n}\n.chat__body[_ngcontent-%COMP%]   .messages[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%] {\n  width: 100%;\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  bottom: -25px;\n  right: -15px;\n}\n.chat__footer[_ngcontent-%COMP%] {\n  height: 80px;\n  display: flex;\n  justify-content: space-between;\n}\n.chat__footer[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  width: 70%;\n}\n.chat__footer[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%] {\n  width: 20%;\n  display: flex;\n  align-items: center;\n}\n.chat__footer[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.chat__footer[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .attach[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  margin-right: 15px;\n  stroke: #181818;\n  opacity: 0.4;\n  transition: opacity 0.3s;\n}\n.chat__footer[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .attach[_ngcontent-%COMP%]:hover {\n  opacity: 1;\n}\n.chat__footer[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .send[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  text-align: center;\n  border: none;\n  outline: none;\n  border-radius: 4px;\n  background-color: #0871a8;\n}\n.chat__footer[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .send[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHN0eWxlc1xcbWl4aW5zXFx0ZXh0LW1peGlucy5sZXNzIiwiY2hhdC1tYWluLmNvbXBvbmVudC5sZXNzIiwiLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc3R5bGVzXFxtaXhpbnNcXHNjcm9sbGJhci1taXhpbnMubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGlCQUFBO0VBQ0EseUJBQUE7RUFDQSxzQkFBQTtFQUNBLHFCQUFBO0FDQ0o7QUNMQTtFRE9FLHdCQUF3QjtBQUMxQjtBQ1BJO0VBQ0ksVUFBQTtFRFNOLHFDQUFxQztFQ1IvQix1QkFBQTtBRFVSO0FDTkk7RUFDSSx5QkFBQTtFQUNBLG1CQUFBO0FEUVI7QUFiQTtFQUNJLFdBQUE7QUFlSjtBQWRJO0VBQ0ksV0FBQTtFQUNBLFlBQUE7RUFDQSxpQkFBQTtFQUVBLGtCQUFBO0VBQ0EsbUJBQUE7RUFFQSxhQUFBO0VBQ0EsOEJBQUE7RUFFQSx5QkFBQTtFRGhCSixpQkFBQTtFQUNBLHlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxxQkFBQTtBQzhCSjtBQTVCSTtFQWNRLGFBQUE7QUFpQlo7QUEvQkk7RUFnQlksZUFBQTtFQUNBLGdCQUFBO0VBRUEsa0JBQUE7QUFpQmhCO0FBcENJO0VBcUJnQixjQUFBO0VBQ0EsZUFBQTtBQWtCcEI7QUFqQm9CO0VBQ0ksMEJBQUE7QUFtQnhCO0FBM0NJO0VBOEJZLGNBQUE7RUFDQSxvQkFBQTtBQWdCaEI7QUFUSTtFQUNJLGtCQUFBO0VBQ0EsYUFBQTtFQUNBLGlCQUFBO0VBRUEsZ0JBQUE7RUFDQSxrQkFBQTtFQUVBLGFBQUE7RUFDQSxzQkFBQTtFQUVBLGdCQUFBO0VBQ0EsaUJBQUE7RUFFQSxtQkFBQTtFQU9OLHdCQUF3QjtBQUMxQjtBQ2pFSTtFQUNJLFVBQUE7RURtRU4scUNBQXFDO0VDbEUvQix1QkFBQTtBRG9FUjtBQ2hFSTtFQUNJLHlCQUFBO0VBQ0EsbUJBQUE7QURrRVI7QUEvQkk7RUFtQlEsVUFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLHlCQUFBO0FBZVo7QUFyQ0k7RUF5QlkseUJBQUE7RUFDQSxjQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0VBRUEsWUFBQTtBQWNoQjtBQTlDSTs7RUFxQ1ksYUFBQTtFQUNBLHNCQUFBO0FBYWhCO0FBbkRJOztFQXdDZ0Isa0JBQUE7RUFFQSwwQkFBQTtFQUFBLHVCQUFBO0VBQUEsa0JBQUE7RUFDQSxjQUFBO0VBRUEsa0JBQUE7RUFDQSxrQkFBQTtFQUVBLHFCQUFBO0FBWXBCO0FBNURJOztFQW1Eb0IsYUFBQTtBQWF4QjtBQWhFSTs7RUF1RDRCLFdBQUE7RUFDQSxZQUFBO0FBYWhDO0FBckVJO0VBZ0VZLHVCQUFBO0FBUWhCO0FBeEVJO0VBa0VnQix5QkFBQTtFQUNBLGNBQUE7RUFDQSxtQkFBQTtFQUNBLG1CQUFBO0FBU3BCO0FBOUVJO0VBd0VvQix5QkFBQTtFQUNBLGtCQUFBO0VBQ0EsV0FBQTtFQUNBLFdBQUE7RUFFQSxXQUFBO0FBUXhCO0FBckZJO0VBZ0Z3QixjQUFBO0VBQ0EsZUFBQTtBQVE1QjtBQXpGSTtFQXdGWSxxQkFBQTtBQUloQjtBQTVGSTtFQTBGZ0IscUJBQUE7RUFDQSxtQkFBQTtFQUVBLHlCQUFBO0VBQ0EsWUFBQTtFQUVBLDZCQUFBO0FBR3BCO0FBbkdJO0VBbUdvQixXQUFBO0VBQ0EseUJBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsYUFBQTtFQUNBLFlBQUE7QUFHeEI7QUEzR0k7RUEyR3dCLGVBQUE7RUFDQSxjQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0FBRzVCO0FBQ29CO0VBQ0ksV0FBQTtFQUNBLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLFNBQUE7RUFDQSw4QkFBQTtFQUNBLGlDQUFBO0VBQ0EsK0JBQUE7QUFDeEI7QUExSEk7RUFnSVEsYUFBQTtFQUNBLHNCQUFBO0VBQ0EseUJBQUE7QUFIWjtBQS9ISTtFQXFJWSxZQUFBO0VBQ0EseUJBQUE7RUFDQSxrQkFBQTtFQUVBLG1CQUFBO0VBQ0EsNkJBQUE7QUFKaEI7QUF0SUk7RUE2SWdCLFdBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHlCQUFBO0VBQ0EsYUFBQTtFQUNBLFlBQUE7QUFKcEI7QUFVSTtFQUNJLFlBQUE7RUFFQSxhQUFBO0VBQ0EsOEJBQUE7QUFUUjtBQUtJO0VBT1EsVUFBQTtBQVRaO0FBRUk7RUFXUSxVQUFBO0VBRUEsYUFBQTtFQUNBLG1CQUFBO0FBWFo7QUFhWTtFQUNJLGVBQUE7QUFYaEI7QUFOSTtFQXFCWSxXQUFBO0VBQ0EsWUFBQTtFQUVBLGtCQUFBO0VBRUEsZUFBQTtFQUNBLFlBQUE7RUFFQSx3QkFBQTtBQWZoQjtBQWdCZ0I7RUFDSSxVQUFBO0FBZHBCO0FBakJJO0VBb0NZLFdBQUE7RUFDQSxZQUFBO0VBRUEsa0JBQUE7RUFFQSxZQUFBO0VBQ0EsYUFBQTtFQUVBLGtCQUFBO0VBQ0EseUJBQUE7QUFuQmhCO0FBMUJJO0VBZ0RnQixXQUFBO0VBQ0EsWUFBQTtBQW5CcEIiLCJmaWxlIjoiY2hhdC1tYWluLmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiLnVzZXItc2VsZWN0LW5vbmUge1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG59XG4iLCJAaW1wb3J0ICdzcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMnO1xuQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvbWl4aW5zL3RleHQtbWl4aW5zJztcbkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL21peGlucy9zY3JvbGxiYXItbWl4aW5zJztcblxuLmNoYXQge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgICZfX2hlYWRlciB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IDUwcHg7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiA1MHB4O1xuXG4gICAgICAgIHBhZGRpbmctbGVmdDogMjVweDtcbiAgICAgICAgcGFkZGluZy1yaWdodDogMjVweDtcblxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cbiAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICAgICAgLnVzZXItc2VsZWN0LW5vbmUoKTtcbiAgICAgICAgLmJ1ZGR5LWluZm8ge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIC5uYW1lIHtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcblxuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICAgICAgICAgICAgICBzcGFuIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IEBhY3RpdmU7XG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLm9ubGluZS1zdGF0dXMge1xuICAgICAgICAgICAgICAgIGNvbG9yOiBAbGlnaHQ7XG4gICAgICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLnNoYXJlZC1tZWRpYSB7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19ib2R5IHtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICBoZWlnaHQ6IDUyMHB4O1xuICAgICAgICBtYXgtaGVpZ2h0OiA1MjBweDtcblxuICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgICAgICBvdmVyZmxvdy14OiBoaWRkZW47XG5cbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblxuICAgICAgICBwYWRkaW5nLWxlZnQ6IDUlO1xuICAgICAgICBwYWRkaW5nLXJpZ2h0OiA1JTtcblxuICAgICAgICBtYXJnaW4tYm90dG9tOiA0MHB4O1xuXG4gICAgICAgIC5saWdodC10aGluLXNjcm9sbGJhcigpO1xuXG4gICAgICAgIC5tZXNzYWdlcyB7XG4gICAgICAgICAgICB3aWR0aDogOTAlO1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuXG4gICAgICAgICAgICAuZGF5IHtcbiAgICAgICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICAgICAgICAgIGNvbG9yOiBAbGlnaHQ7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuXG4gICAgICAgICAgICAgICAgbWFyZ2luOiAyMHB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAubWVzc2FnZS1pbixcbiAgICAgICAgICAgIC5tZXNzYWdlLW91dCB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAgICAgIC5tZXNzYWdlIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBmaXQtY29udGVudDtcbiAgICAgICAgICAgICAgICAgICAgbWF4LXdpZHRoOiA3MCU7XG5cbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAxMHB4IDIwcHg7XG5cbiAgICAgICAgICAgICAgICAgICAgd29yZC13cmFwOiBicmVhay13b3JkO1xuXG4gICAgICAgICAgICAgICAgICAgIC5pbmZvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdGF0dXMge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxN3B4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDEycHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAubWVzc2FnZS1pbiB7XG4gICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gICAgICAgICAgICAgICAgLm1lc3NhZ2Uge1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBAYWN0aXZlLWxpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogQGJhc2U7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDcwcHg7XG5cbiAgICAgICAgICAgICAgICAgICAgLmluZm8ge1xuICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogNXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDEwcHg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAudGltZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEBsaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5tZXNzYWdlLW91dCB7XG4gICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xuICAgICAgICAgICAgICAgIC5tZXNzYWdlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xuICAgICAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IEBhY3RpdmU7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcblxuICAgICAgICAgICAgICAgICAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcblxuICAgICAgICAgICAgICAgICAgICAuaW5mbyB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAtMjJweDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAtMTVweDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLnRpbWUge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQGxpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA1NXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICY6YWZ0ZXIge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodDogLTIwcHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3R0b206IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXItYm90dG9tOiAxMHB4IHNvbGlkIEBhY3RpdmU7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXItbGVmdDogMTBweCBzb2xpZCBAYWN0aXZlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLm1lc3NhZ2VzIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcblxuICAgICAgICAgICAgLm1lc3NhZ2Uge1xuICAgICAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBAYWN0aXZlO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDI1cHg7XG4gICAgICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDA7XG5cbiAgICAgICAgICAgICAgICAuaW5mbyB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbTogLTI1cHg7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAtMTVweDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19mb290ZXIge1xuICAgICAgICBoZWlnaHQ6IDgwcHg7XG5cbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuXG4gICAgICAgIHRleHRhcmVhIHtcbiAgICAgICAgICAgIHdpZHRoOiA3MCU7XG4gICAgICAgIH1cblxuICAgICAgICAuY29udHJvbHMge1xuICAgICAgICAgICAgd2lkdGg6IDIwJTtcblxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgICAgICYgPiAqIHtcbiAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5hdHRhY2gge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAyNHB4O1xuICAgICAgICAgICAgICAgIGhlaWdodDogMjRweDtcblxuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTVweDtcblxuICAgICAgICAgICAgICAgIHN0cm9rZTogQGJhc2U7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC40O1xuXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjNzO1xuICAgICAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLnNlbmQge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAzMnB4O1xuICAgICAgICAgICAgICAgIGhlaWdodDogMzJweDtcblxuICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcblxuICAgICAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgICAgICBvdXRsaW5lOiBub25lO1xuXG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IEBhY3RpdmU7XG5cbiAgICAgICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTZweDtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxNnB4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi5saWdodC10aGluLXNjcm9sbGJhciB7XG4gICAgJjo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgICAgICB3aWR0aDogNXB4OyAvKiDRiNC40YDQuNC90LAg0LTQu9GPINCy0LXRgNGC0LjQutCw0LvRjNC90L7Qs9C+INGB0LrRgNC+0LvQu9CwICovXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICAgIH1cblxuICAgIC8qINC/0L7Qu9C30YPQvdC+0Log0YHQutGA0L7Qu9C70LHQsNGA0LAgKi9cbiAgICAmOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0ZW4oQGxpZ2h0LCAzMCUpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xuICAgIH1cbn1cbiJdfQ== */"] });


/***/ }),

/***/ "Aso2":
/*!*********************************************!*\
  !*** ./src/app/services/profile.service.ts ***!
  \*********************************************/
/*! exports provided: ProfileService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileService", function() { return ProfileService; });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../environments/environment */ "AytR");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "tk/3");





class ProfileService {
    constructor(http) {
        this.http = http;
    }
    getProfileInfo(id) {
        return this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/find/${id}`);
    }
    getConnectionsById$(connections) {
        const identifiers = connections.map(connection => connection.userId);
        if (identifiers.length > 1) {
            return this.getProfileInfo(identifiers.join(',')).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(res => {
                return connections.map(connection => {
                    return {
                        user: res.users.find(us => us.id === connection.userId),
                        date: connection.date,
                    };
                });
            }));
        }
        else if (identifiers.length === 1) {
            return this.getProfileInfo(identifiers.join(',')).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(res => {
                return connections.map(connection => {
                    return {
                        user: res.user,
                        date: connection.date,
                    };
                });
            }));
        }
        else {
            console.log('connections is empty');
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])([]);
        }
    }
    sendConnection(senderId, userId, message) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/connections/send/${userId}`, {
            senderId,
            message,
        });
    }
    acceptConnection(senderId, userId, date) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/connections/accept/${senderId}`, { userId, date });
    }
    declineConnection(senderId, userId) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/connections/decline/${senderId}`, { userId });
    }
    cancelConnection(senderId, userId) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/connections/decline/${senderId}`, { userId });
    }
    removeConnection(senderId, userId) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/connections/remove/${senderId}`, { userId });
    }
    editPersonalInfo(info, id) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/find/${id}/edit/profile-info`, info);
    }
    changeAvatar(fileToUpload, id) {
        const formData = new FormData();
        formData.append('avatar', fileToUpload, fileToUpload.name);
        console.log(formData);
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/${id}/avatar/upload`, formData);
    }
    deleteAvatar(id) {
        return this.http.delete(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/${id}/avatar/delete`);
    }
    changeEmail(id, email) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/${id}/change/email`, { email });
    }
    changePhone(id, phone) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/${id}/change/phone`, { phone });
    }
    changePassword(id, newPassword, oldPassword) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/${id}/change/password`, { oldPassword, newPassword });
    }
    deleteAccount(userId, password) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/remove/${userId}`, { password });
    }
    changeRole(role, id) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/${id}/change/role`, { role });
    }
    changeCompany(company, id) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/${id}/change/company`, { company });
    }
    changeAbout(about, id) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/${id}/change/about`, { about });
    }
    changeProfession(profession, id) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/${id}/change/profession`, { profession });
    }
    changeLocality(locality, id) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/${id}/change/locality`, { locality });
    }
    changeContactInfo(contactInfo, id) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/${id}/change/contact-info`, { contactInfo });
    }
    changeProjects(projects, id) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/${id}/change/projects`, { projects });
    }
    changeExperience(experience, id) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/${id}/change/experience`, { experience });
    }
    changeEducation(education, id) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/${id}/change/education`, { education });
    }
}
ProfileService.ɵfac = function ProfileService_Factory(t) { return new (t || ProfileService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"])); };
ProfileService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({ token: ProfileService, factory: ProfileService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false,
    server_url: '',
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "BNsp":
/*!**************************************************!*\
  !*** ./src/app/store/profile/profile.effects.ts ***!
  \**************************************************/
/*! exports provided: ProfileEffects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileEffects", function() { return ProfileEffects; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/effects */ "9jGm");
/* harmony import */ var _profile_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./profile.actions */ "Bx40");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _services_profile_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/profile.service */ "Aso2");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "tyNb");










class ProfileEffects {
    constructor(actions$, profileService, http, router) {
        this.actions$ = actions$;
        this.profileService = profileService;
        this.http = http;
        this.router = router;
    }
    getProfileInfo$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_profile_actions__WEBPACK_IMPORTED_MODULE_2__["GET_PROFILE_INFO_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            if (Number.isInteger(action.payload.id)) {
                return this.profileService
                    .getProfileInfo(action.payload.id)
                    .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(res => {
                    return new _profile_actions__WEBPACK_IMPORTED_MODULE_2__["ProfileGetInfoSuccessAction"]({
                        profile: res.user,
                    });
                }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(() => {
                    this.router.navigate(['/profile/not-found']);
                    return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
                }));
            }
            return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
        }));
    }
    sendConnection$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_profile_actions__WEBPACK_IMPORTED_MODULE_2__["SEND_CONNECTION_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            const payload = action.payload;
            return this.profileService
                .sendConnection(payload.senderId, payload.userId, payload.message)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(() => {
                return new _profile_actions__WEBPACK_IMPORTED_MODULE_2__["ProfileSendConnectionSuccessAction"]({
                    senderId: payload.senderId,
                });
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
                console.log('send connection effect error: ', err);
                return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
            }));
        }));
    }
    acceptConnection$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_profile_actions__WEBPACK_IMPORTED_MODULE_2__["ACCEPT_CONNECTION_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            const payload = action.payload;
            return this.profileService
                .acceptConnection(payload.senderId, payload.userId, payload.date)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(() => new _profile_actions__WEBPACK_IMPORTED_MODULE_2__["ProfileAcceptConnectionSuccessAction"]({
                userId: payload.userId,
                date: payload.date,
            })), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
                console.log('ProfileAcceptConnectionAction error: ', err);
                return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
            }));
        }));
    }
    declineConnection$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_profile_actions__WEBPACK_IMPORTED_MODULE_2__["DECLINE_CONNECTION_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            const payload = action.payload;
            return this.profileService
                .declineConnection(payload.senderId, payload.userId)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(() => new _profile_actions__WEBPACK_IMPORTED_MODULE_2__["ProfileDeclineConnectionSuccessAction"]({
                senderId: payload.senderId,
            })), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
                console.log('ProfileDeclineConnectionAction error:', err);
                return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
            }));
        }));
    }
    removeConnection$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_profile_actions__WEBPACK_IMPORTED_MODULE_2__["REMOVE_CONNECTION_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            const payload = action.payload;
            return this.profileService
                .removeConnection(payload.senderId, payload.userId)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(() => new _profile_actions__WEBPACK_IMPORTED_MODULE_2__["ProfileRemoveConnectionSuccessAction"]({
                senderId: payload.senderId,
            })), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
                console.log('ProfileRemoveConnectionAction error:', err);
                return rxjs__WEBPACK_IMPORTED_MODULE_4__["EMPTY"];
            }));
        }));
    }
}
ProfileEffects.ɵfac = function ProfileEffects_Factory(t) { return new (t || ProfileEffects)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_services_profile_service__WEBPACK_IMPORTED_MODULE_6__["ProfileService"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_7__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"])); };
ProfileEffects.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({ token: ProfileEffects, factory: ProfileEffects.ɵfac });
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], ProfileEffects.prototype, "getProfileInfo$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], ProfileEffects.prototype, "sendConnection$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], ProfileEffects.prototype, "acceptConnection$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], ProfileEffects.prototype, "declineConnection$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], ProfileEffects.prototype, "removeConnection$", null);


/***/ }),

/***/ "BUNl":
/*!**********************************************************************!*\
  !*** ./src/app/views/profile/profile-main/profile-main.component.ts ***!
  \**********************************************************************/
/*! exports provided: ProfileMainComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileMainComponent", function() { return ProfileMainComponent; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _store_profile_profile_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../store/profile/profile.selectors */ "v3Q/");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../store/my-profile/my-profile.selectors */ "0jmn");
/* harmony import */ var _plugins_hystModal_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../plugins/hystModal_.js */ "+NIJ");
/* harmony import */ var _store_profile_profile_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../store/profile/profile.actions */ "Bx40");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _services_profile_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../services/profile.service */ "Aso2");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _components_network_users_list_users_list_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../components/network/users-list/users-list.component */ "p0Ul");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ "tyNb");




// @ts-ignore








function ProfileMainComponent_button_28_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "i", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, " Edit profile ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} }
function ProfileMainComponent_button_29_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Send connection ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} }
function ProfileMainComponent_button_30_Template(rf, ctx) { if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ProfileMainComponent_button_30_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r7); const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](); return ctx_r6.declineConnection(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Connection was sent ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} }
function ProfileMainComponent_button_31_Template(rf, ctx) { if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ProfileMainComponent_button_31_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r9); const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](); return ctx_r8.acceptConnection(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Accept connection ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} }
function ProfileMainComponent_button_32_Template(rf, ctx) { if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ProfileMainComponent_button_32_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r11); const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](); return ctx_r10.removeConnection(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, "Remove connection");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
} }
const _c0 = function () { return []; };
class ProfileMainComponent {
    constructor(store$, profileService) {
        this.store$ = store$;
        this.profileService = profileService;
        this.isMyProfile = false;
        this.currentTab = 'profile';
        this.headerBg$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_profile_profile_selectors__WEBPACK_IMPORTED_MODULE_1__["profileHeaderBgSelector"]));
        this.avatar$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_profile_profile_selectors__WEBPACK_IMPORTED_MODULE_1__["profileAvatarSelector"]));
        this.fullName$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_profile_profile_selectors__WEBPACK_IMPORTED_MODULE_1__["profileNameSelector"]));
        this.description$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_profile_profile_selectors__WEBPACK_IMPORTED_MODULE_1__["profileDescriptionSelector"]));
        this.profession$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_profile_profile_selectors__WEBPACK_IMPORTED_MODULE_1__["profileProfessionSelector"]));
        this.connections$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_profile_profile_selectors__WEBPACK_IMPORTED_MODULE_1__["profileConnectionsSelector"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])(connections => {
            return this.profileService.getConnectionsById$(connections);
        }));
        this.connectionsLength$ = this.connections$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(connections => connections.length));
        this.locality$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_profile_profile_selectors__WEBPACK_IMPORTED_MODULE_1__["profileLocalitySelector"]));
        this.sentConnection = false;
        this.incomingConnection = false;
        this.isConnection = false;
        this.myProfile = { id: 0 };
        this.profile = { id: 0 };
    }
    sendConnection(message) {
        this.store$.dispatch(new _store_profile_profile_actions__WEBPACK_IMPORTED_MODULE_5__["ProfileSendConnectionAction"]({
            senderId: this.myProfile.id,
            userId: this.profile.id,
            message,
        }));
    }
    acceptConnection() {
        this.store$.dispatch(new _store_profile_profile_actions__WEBPACK_IMPORTED_MODULE_5__["ProfileAcceptConnectionAction"]({
            senderId: this.profile.id,
            userId: this.myProfile.id,
            date: Date.now(),
        }));
    }
    declineConnection() {
        this.store$.dispatch(new _store_profile_profile_actions__WEBPACK_IMPORTED_MODULE_5__["ProfileDeclineConnectionAction"]({
            senderId: this.myProfile.id,
            userId: this.profile.id,
        }));
    }
    removeConnection() {
        this.store$.dispatch(new _store_profile_profile_actions__WEBPACK_IMPORTED_MODULE_5__["ProfileRemoveConnectionAction"]({
            senderId: this.myProfile.id,
            userId: this.profile.id,
        }));
    }
    activateTab(e) {
        const element = e.target;
        const parent = element.parentNode;
        const children = Array.from(parent.children);
        children.forEach(el => el.classList.remove('active'));
        element.classList.add('active');
        this.currentTab = element.textContent.toLowerCase();
    }
    ngOnInit() {
        const sendConnectionModal = new _plugins_hystModal_js__WEBPACK_IMPORTED_MODULE_4__["HystModal"]({
            linkAttributeName: 'data-hystmodal',
        });
        const connectionsListModal = new _plugins_hystModal_js__WEBPACK_IMPORTED_MODULE_4__["HystModal"]({
            linkAttributeName: 'data-hystmodal',
        });
        const profile$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_profile_profile_selectors__WEBPACK_IMPORTED_MODULE_1__["profileSelector"]));
        this.store$
            .pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_3__["myProfileSelector"]))
            .subscribe(res => (this.myProfile = res));
        profile$.subscribe(res => {
            this.profile = res;
            this.store$
                .pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_profile_profile_selectors__WEBPACK_IMPORTED_MODULE_1__["profileSentConnectionsSelector"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(incoming => incoming.some(user => user.userId === this.myProfile.id)))
                .subscribe(resp => (this.incomingConnection = resp));
        });
        profile$
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(user => user.info.receivedConnections), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(received => received.some(user => user.userId === this.myProfile.id)))
            .subscribe(res => (this.sentConnection = res));
        profile$
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(user => user.info.connections), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(connections => connections.some(user => user.userId === this.myProfile.id)))
            .subscribe(res => (this.isConnection = res));
    }
}
ProfileMainComponent.ɵfac = function ProfileMainComponent_Factory(t) { return new (t || ProfileMainComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["Store"]), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_services_profile_service__WEBPACK_IMPORTED_MODULE_7__["ProfileService"])); };
ProfileMainComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({ type: ProfileMainComponent, selectors: [["app-profile-main"]], inputs: { isMyProfile: "isMyProfile" }, decls: 209, vars: 32, consts: [[1, "profile__main"], [1, "profile__header"], [1, "profile__header--bg"], ["alt", "bg", 3, "src"], [1, "profile__header--info"], [1, "avatar-box"], ["alt", "avatar", 3, "src"], [1, "information"], [1, "information__header"], [1, "name"], ["src", "../../../../assets/img/gold-logo.png", "alt", "gold-logo"], [1, "location"], ["src", "../../../../assets/img/location.png", "alt", "location"], [1, "information__content"], [1, "btn"], ["routerLink", "/profile/edit", "class", "btn", 4, "ngIf"], ["data-hystmodal", "#sendConnectionModal", "class", "btn", 4, "ngIf"], ["class", "btn-outline", 3, "click", 4, "ngIf"], ["data-hystmodal", "#connectionsListModal", 1, "btn-outline"], [1, "profile__content"], [1, "tabs", 3, "click"], [1, "tab", "active"], [1, "tab"], [1, "about"], [1, "more"], [1, "projects"], [1, "head"], [1, "cards"], [1, "card"], ["src", "../../../../assets/img/project1.png", "alt", "project1"], [1, "project-name"], [1, "info"], ["src", "../../../../assets/img/project2.png", "alt", "project2"], ["src", "../../../../assets/img/project3.png", "alt", "project3"], [1, "reputation"], [1, "containers"], [1, "container"], [1, "container__header"], [1, "count"], [1, "photo-queue"], ["src", "../../../../assets/img/microphotos/Photo.png", "alt", "Photo"], ["src", "../../../../assets/img/microphotos/Photo2.png", "alt", "Photo"], ["src", "../../../../assets/img/microphotos/Photo3.png", "alt", "Photo"], ["src", "../../../../assets/img/microphotos/Photo4.png", "alt", "Photo"], ["src", "../../../../assets/img/microphotos/Photo5.png", "alt", "Photo"], ["src", "../../../../assets/img/microphotos/count1.png", "alt", "Count"], ["src", "../../../../assets/img/microphotos/Photo6.png", "alt", "Photo"], ["src", "../../../../assets/img/microphotos/Photo7.png", "alt", "Photo"], ["src", "../../../../assets/img/microphotos/Photo8.png", "alt", "Photo"], ["src", "../../../../assets/img/microphotos/Photo9.png", "alt", "Photo"], ["src", "../../../../assets/img/microphotos/Photo10.png", "alt", "Photo"], ["src", "../../../../assets/img/microphotos/count2.png", "alt", "Count"], ["src", "../../../../assets/img/microphotos/Photo11.png", "alt", "Photo"], ["src", "../../../../assets/img/microphotos/Photo12.png", "alt", "Photo"], ["src", "../../../../assets/img/microphotos/Photo13.png", "alt", "Photo"], ["src", "../../../../assets/img/microphotos/Photo14.png", "alt", "Photo"], ["src", "../../../../assets/img/microphotos/Photo15.png", "alt", "Photo"], [1, "experience"], [1, "container__icon"], ["src", "../../../../assets/img/freelance.png", "alt", "freelance"], [1, "container__main"], [1, "position"], [1, "date"], [1, "duration"], [1, "container__content"], ["src", "../../../../assets/img/upwork.png", "alt", "upwork"], [1, "company"], [1, "education"], ["src", "../../../../assets/img/NGTU.jpg", "alt", "NGTU"], [1, "degree"], ["id", "sendConnectionModal", "aria-hidden", "true", 1, "hystmodal"], [1, "hystmodal__wrap"], ["role", "dialog", "aria-modal", "true", 1, "hystmodal__window"], ["data-hystclose", "", 1, "hystmodal__close"], [1, "hystmodal__header"], [1, "hystmodal__title"], [1, "hystmodal__body"], [1, "message"], [1, "message__title"], ["id", "message", "rows", "6", "placeholder", "If you want to say something, write it here", 1, "message__textarea"], ["textarea", ""], [1, "hystmodal__footer"], [1, "controls"], ["data-hystclose", "", 1, "btn-outline", "decline", 3, "click"], ["data-hystclose", "", 1, "btn", "send", 3, "click"], ["id", "connectionsListModal", "aria-hidden", "true", 1, "hystmodal"], [3, "connections", "isMyProfile"], ["routerLink", "/profile/edit", 1, "btn"], [1, "fas", "fa-user-edit"], ["data-hystmodal", "#sendConnectionModal", 1, "btn"], [1, "btn-outline", 3, "click"]], template: function ProfileMainComponent_Template(rf, ctx) { if (rf & 1) {
        const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](3, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](4, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](7, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](8, "img", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](9, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](11, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "h3", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](14, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](15, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](16, "img", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](17, "p", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](18, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](19, "img", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](21, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](22, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](23, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](24);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](25, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](26, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](27, "Contact Info");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](28, ProfileMainComponent_button_28_Template, 3, 0, "button", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](29, ProfileMainComponent_button_29_Template, 2, 0, "button", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](30, ProfileMainComponent_button_30_Template, 2, 0, "button", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](31, ProfileMainComponent_button_31_Template, 2, 0, "button", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](32, ProfileMainComponent_button_32_Template, 2, 0, "button", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](33, "button", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](34);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](35, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](36, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](37, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ProfileMainComponent_Template_div_click_37_listener($event) { return ctx.activateTab($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](38, "p", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](39, "Profile");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](40, "p", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](41, "Activity & Interest");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](42, "p", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](43, "Articles (3)");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](44, "div", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](45, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](46, "About");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](47, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](48, " 3rd year student of NSTU, I am fond of programming, especially web development and javascript, I study javascript frameworks for both frontend and backend. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](49, "p", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](50, "SEE MORE");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](51, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](52, "div", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](53, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](54, "Projects");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](55, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](56, "3 of 12");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](57, "div", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](58, "div", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](59, "img", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](60, "p", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](61, "Zara redesign concept");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](62, "p", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](63, "UX/UI design, 15.07.2019");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](64, "div", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](65, "img", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](66, "p", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](67, "SCTHON event brand identity");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](68, "p", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](69, "Graphic design, 31.03.2019");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](70, "div", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](71, "img", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](72, "p", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](73, "Drozd. Brand identity, 2016");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](74, "p", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](75, "Graphic design, 03.04.2016");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](76, "p", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](77, "SHOW ALL (12)");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](78, "div", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](79, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](80, "Skills & Endoresments");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](81, "div", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](82, "div", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](83, "div", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](84, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](85, "User experience (UX)");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](86, "p", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](87, "6");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](88, "div", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](89, "img", 40);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](90, "img", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](91, "img", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](92, "img", 43);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](93, "img", 44);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](94, "img", 45);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](95, "div", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](96, "div", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](97, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](98, "User interface (UI)");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](99, "p", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](100, "7");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](101, "div", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](102, "img", 46);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](103, "img", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](104, "img", 48);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](105, "img", 49);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](106, "img", 50);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](107, "img", 51);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](108, "div", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](109, "div", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](110, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](111, "Brand Identity");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](112, "p", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](113, "5");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](114, "div", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](115, "img", 52);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](116, "img", 53);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](117, "img", 54);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](118, "img", 55);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](119, "img", 56);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](120, "p", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](121, "SHOW ALL (18)");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](122, "div", 57);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](123, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](124, "Experience");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](125, "div", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](126, "div", 58);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](127, "img", 59);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](128, "div", 60);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](129, "div", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](130, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](131, "Freelance UX/UI designer");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](132, "p", 61);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](133, " Self Employed ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](134, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](135, "Around the world");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](136, "p", 62);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](137, " Jun 2016 - Present ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](138, "span", 63);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](139, "3 yrs 3 mos");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](140, "div", 64);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](141, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](142, " Work with clients and web studios as freelancer. Work in next areas: eCommerce web projects; creative landing pages; iOs and Android apps; corporate web sites and corporate identity sometimes. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](143, "div", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](144, "div", 58);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](145, "img", 65);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](146, "div", 60);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](147, "div", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](148, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](149, "UX/UI designer");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](150, "p", 66);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](151, "Upwork");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](152, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](153, "International");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](154, "p", 62);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](155, " Jun 2019 - Present ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](156, "span", 63);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](157, "3 mos");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](158, "div", 64);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](159, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](160, " New experience with Upwork system. Work in next areas: UX/UI design, graphic design, interaction design, UX research. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](161, "div", 67);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](162, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](163, "Education");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](164, "div", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](165, "div", 58);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](166, "img", 68);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](167, "div", 60);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](168, "div", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](169, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](170, "Nizhniy Novgorod State Technical University");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](171, "p", 69);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](172, " Bachelor's Degree in Information Systems and Technology ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](173, "p", 62);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](174, "2018 - 2022");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](175, "div", 64);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](176, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](177, " Additional course on web development on Angular and independent study of web development on VUE and Nest js ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](178, "div", 70);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](179, "div", 71);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](180, "div", 72);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](181, "button", 73);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](182, "Close");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](183, "div", 74);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](184, "h2", 75);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](185, "Send connection");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](186, "div", 76);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](187, "div", 77);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](188, "p", 78);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](189, "Message");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](190, "textarea", 79, 80);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](192, "div", 81);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](193, "div", 82);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](194, "button", 83);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ProfileMainComponent_Template_button_click_194_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r12); const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵreference"](191); return _r5.value = ""; });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](195, "Decline");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](196, "button", 84);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ProfileMainComponent_Template_button_click_196_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r12); const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵreference"](191); return ctx.sendConnection(_r5.value); });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](197, "Send connection");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](198, "div", 85);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](199, "div", 71);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](200, "div", 72);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](201, "button", 73);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](202, "Close");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](203, "div", 74);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](204, "h2", 75);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](205, "List of connections");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](206, "div", 76);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](207, "app-users-list", 86);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](208, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("src", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](4, 15, ctx.headerBg$), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵstyleMap"]("background: url(" + _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](7, 17, ctx.avatar$) + ")");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("src", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](9, 19, ctx.avatar$), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](14, 21, ctx.fullName$), " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](21, 23, ctx.locality$), " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](25, 25, ctx.description$), " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.isMyProfile);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !ctx.isMyProfile && !ctx.sentConnection && !ctx.isConnection && !ctx.incomingConnection);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !ctx.isMyProfile && ctx.sentConnection);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !ctx.isMyProfile && ctx.incomingConnection);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !ctx.isMyProfile && ctx.isConnection);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](35, 27, ctx.connectionsLength$), " Connections");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](173);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("connections", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](208, 29, ctx.connections$) || _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](31, _c0))("isMyProfile", ctx.isMyProfile);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_8__["NgIf"], _components_network_users_list_users_list_component__WEBPACK_IMPORTED_MODULE_9__["UsersListComponent"], _angular_router__WEBPACK_IMPORTED_MODULE_10__["RouterLink"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_8__["AsyncPipe"]], styles: [".profile__main[_ngcontent-%COMP%] {\n  max-width: 850px;\n  margin: 40px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__header[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__header[_ngcontent-%COMP%]    > img[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__header--bg[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 200px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__header--bg[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__header--info[_ngcontent-%COMP%] {\n  margin: 5px 30px;\n  display: flex;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__header--info[_ngcontent-%COMP%]   .avatar-box[_ngcontent-%COMP%] {\n  position: relative;\n  top: -20px;\n  min-width: 170px;\n  max-width: 170px;\n  height: 170px;\n  background-color: #ccc;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__header--info[_ngcontent-%COMP%]   .information[_ngcontent-%COMP%] {\n  margin: 25px;\n  width: 100%;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__header--info[_ngcontent-%COMP%]   .information__header[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 15px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__header--info[_ngcontent-%COMP%]   .information__header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 600;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__header--info[_ngcontent-%COMP%]   .information__header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 12px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__header--info[_ngcontent-%COMP%]   .information__content[_ngcontent-%COMP%] {\n  font-size: 14px;\n  line-height: 1.5;\n  position: relative;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__header--info[_ngcontent-%COMP%]   .information__content[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], .profile__main[_ngcontent-%COMP%]   .profile__header--info[_ngcontent-%COMP%]   .information__content[_ngcontent-%COMP%]   .btn-outline[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 20px;\n  vertical-align: middle;\n  margin-right: 10px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .tabs[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  display: flex;\n  flex-wrap: wrap;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .tabs[_ngcontent-%COMP%]   .tab[_ngcontent-%COMP%] {\n  padding: 18px;\n  min-width: 240px;\n  text-align: center;\n  font-size: 14px;\n  border-top-left-radius: 4px;\n  border-top-right-radius: 4px;\n  cursor: pointer;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .tabs[_ngcontent-%COMP%]   .tab.active[_ngcontent-%COMP%] {\n  color: #fff;\n  background-color: #0871a8;\n  cursor: default;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%]:not(.tabs) {\n  margin: 30px;\n  padding: 30px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%]:not(.tabs)   h3[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 600;\n  margin-bottom: 30px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%]:not(.tabs)   .more[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  font-size: 14px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .about[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 14px;\n  line-height: 1.5;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .projects[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .projects[_ngcontent-%COMP%]   .head[_ngcontent-%COMP%] {\n  display: flex;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .projects[_ngcontent-%COMP%]   .head[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #747474;\n  font-size: 18px;\n  font-weight: 300;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .projects[_ngcontent-%COMP%]   .head[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  margin-right: 15px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .projects[_ngcontent-%COMP%]   .cards[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-evenly;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .projects[_ngcontent-%COMP%]   .cards[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%] {\n  margin-right: 20px;\n  margin-bottom: 15px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .projects[_ngcontent-%COMP%]   .cards[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 230px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .projects[_ngcontent-%COMP%]   .cards[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .project-name[_ngcontent-%COMP%] {\n  margin-top: 15px;\n  font-size: 14px;\n  font-weight: 500;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .projects[_ngcontent-%COMP%]   .cards[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%] {\n  margin-top: 5px;\n  font-size: 10px;\n  font-weight: 300;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .reputation[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .reputation[_ngcontent-%COMP%]   .containers[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-wrap: wrap;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .reputation[_ngcontent-%COMP%]   .containers[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {\n  margin-right: 20px;\n  padding: 15px 20px;\n  height: 80px;\n  min-width: 230px;\n  max-width: 250px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .reputation[_ngcontent-%COMP%]   .containers[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .reputation[_ngcontent-%COMP%]   .containers[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .reputation[_ngcontent-%COMP%]   .containers[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%]   .count[_ngcontent-%COMP%] {\n  color: #0871a8;\n  font-size: 14px;\n  font-weight: 600;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .reputation[_ngcontent-%COMP%]   .containers[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .photo-queue[_ngcontent-%COMP%] {\n  display: flex;\n  margin-left: 6px;\n  margin-top: 5px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .reputation[_ngcontent-%COMP%]   .containers[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .photo-queue[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]:nth-child(1) {\n  position: relative;\n  left: calc(-6px * 1);\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .reputation[_ngcontent-%COMP%]   .containers[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .photo-queue[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]:nth-child(2) {\n  position: relative;\n  left: calc(-6px * 2);\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .reputation[_ngcontent-%COMP%]   .containers[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .photo-queue[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]:nth-child(3) {\n  position: relative;\n  left: calc(-6px * 3);\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .reputation[_ngcontent-%COMP%]   .containers[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .photo-queue[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]:nth-child(4) {\n  position: relative;\n  left: calc(-6px * 4);\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .reputation[_ngcontent-%COMP%]   .containers[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .photo-queue[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]:nth-child(5) {\n  position: relative;\n  left: calc(-6px * 5);\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .reputation[_ngcontent-%COMP%]   .containers[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .photo-queue[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]:nth-child(6) {\n  position: relative;\n  left: calc(-6px * 6);\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .experience[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {\n  display: flex;\n  margin-bottom: 20px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .experience[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]:not(:last-child) {\n  padding-bottom: 25px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .experience[_ngcontent-%COMP%]   .container__icon[_ngcontent-%COMP%] {\n  margin-right: 16px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .experience[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin-bottom: 10px;\n  font-size: 14px;\n  font-weight: 500;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .experience[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-bottom: 5px;\n  font-size: 12px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .experience[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin-left: 10px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .experience[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%]   .company[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-weight: 300;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .experience[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%]   .date[_ngcontent-%COMP%] {\n  font-weight: 300;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .experience[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%]   .date[_ngcontent-%COMP%]   .duration[_ngcontent-%COMP%] {\n  color: #0871a8;\n  font-weight: 600;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .experience[_ngcontent-%COMP%]   .container__content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 12px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .education[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {\n  display: flex;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .education[_ngcontent-%COMP%]   .container__icon[_ngcontent-%COMP%] {\n  margin-right: 16px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .education[_ngcontent-%COMP%]   .container__icon[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 54px;\n  height: 54px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .education[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 500;\n  margin-bottom: 10px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .education[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 12px;\n  margin-bottom: 5px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .education[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%]   .date[_ngcontent-%COMP%] {\n  font-weight: 300;\n  margin-bottom: 10px;\n}\n.profile__main[_ngcontent-%COMP%]   .profile__content[_ngcontent-%COMP%]   .education[_ngcontent-%COMP%]   .container__content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 12px;\n}\n.hystmodal__window[_ngcontent-%COMP%] {\n  border-radius: 8px;\n}\n.hystmodal__header[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #cccccc;\n  margin-bottom: 10px;\n}\n.hystmodal__body[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-bottom: 20px;\n}\n.hystmodal__body[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%] {\n  margin: 0 auto;\n  width: 80%;\n}\n.hystmodal__body[_ngcontent-%COMP%]   .message__title[_ngcontent-%COMP%] {\n  color: #181818;\n  font-size: 18px;\n  font-weight: 500;\n  margin-bottom: 10px;\n}\n.hystmodal__body[_ngcontent-%COMP%]   .message__textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid #afafaf;\n  border-radius: 4px;\n  padding: 10px;\n}\n.hystmodal__footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  border-top: 1px solid #cccccc;\n}\n.hystmodal__footer[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%] {\n  padding-right: 20px;\n  padding-bottom: 20px;\n}\n.hystmodal__title[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 500;\n  padding: 10px 20px;\n  width: 100%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUtbWFpbi5jb21wb25lbnQubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNJLGdCQUFBO0VBRUEsWUFBQTtBQUZKO0FBREE7RUFNUSxXQUFBO0FBRlI7QUFJUTtFQUNJLFdBQUE7QUFGWjtBQUtRO0VBQ0ksV0FBQTtFQUNBLGFBQUE7QUFIWjtBQUNRO0VBS1EsV0FBQTtFQUNBLFlBQUE7QUFIaEI7QUFPUTtFQUNJLGdCQUFBO0VBQ0EsYUFBQTtBQUxaO0FBR1E7RUFNUSxrQkFBQTtFQUNBLFVBQUE7RUFFQSxnQkFBQTtFQUNBLGdCQUFBO0VBQ0EsYUFBQTtFQUVBLHNCQUFBO0FBUmhCO0FBTFE7RUFpQlEsWUFBQTtFQUNBLFdBQUE7QUFUaEI7QUFXZ0I7RUFDSSxXQUFBO0VBQ0EsYUFBQTtFQUNBLDhCQUFBO0VBQ0EsbUJBQUE7RUFFQSxtQkFBQTtBQVZwQjtBQUlnQjtFQVNRLGVBQUE7RUFDQSxnQkFBQTtBQVZ4QjtBQUFnQjtFQWNRLGVBQUE7QUFYeEI7QUFlZ0I7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFFQSxrQkFBQTtBQWRwQjtBQVVnQjs7RUFTWSxlQUFBO0VBQ0Esc0JBQUE7RUFFQSxrQkFBQTtBQWhCNUI7QUF4REE7RUFrRlksZ0JBQUE7RUFDQSxhQUFBO0VBQ0EsZUFBQTtBQXZCWjtBQTdEQTtFQXVGZ0IsYUFBQTtFQUNBLGdCQUFBO0VBRUEsa0JBQUE7RUFDQSxlQUFBO0VBRUEsMkJBQUE7RUFDQSw0QkFBQTtFQUVBLGVBQUE7QUExQmhCO0FBNEJnQjtFQUNJLFdBQUE7RUFDQSx5QkFBQTtFQUNBLGVBQUE7QUExQnBCO0FBK0JRO0VBQ0ksWUFBQTtFQUNBLGFBQUE7QUE3Qlo7QUEyQlE7RUFPUSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxtQkFBQTtBQS9CaEI7QUFzQlE7RUFhUSxnQkFBQTtFQUNBLGVBQUE7QUFoQ2hCO0FBeEZBO0VBOEhnQixlQUFBO0VBQ0EsZ0JBQUE7QUFuQ2hCO0FBNUZBO0VBb0lZLFdBQUE7QUFyQ1o7QUEvRkE7RUFzSWdCLGFBQUE7QUFwQ2hCO0FBbEdBO0VBeUlvQixjQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0FBcENwQjtBQXVDZ0I7RUFDSSxrQkFBQTtBQXJDcEI7QUExR0E7RUFvSmdCLGFBQUE7RUFDQSxlQUFBO0VBQ0EsNkJBQUE7QUF2Q2hCO0FBL0dBO0VBeUpvQixrQkFBQTtFQUNBLG1CQUFBO0FBdkNwQjtBQW5IQTtFQTZKd0IsZ0JBQUE7QUF2Q3hCO0FBdEhBO0VBaUt3QixnQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQXhDeEI7QUEzSEE7RUF1S3dCLGVBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7QUF6Q3hCO0FBaElBO0VBZ0xZLFdBQUE7QUE3Q1o7QUFuSUE7RUFrTGdCLFdBQUE7RUFDQSxhQUFBO0VBQ0EsZUFBQTtBQTVDaEI7QUF4SUE7RUF1TG9CLGtCQUFBO0VBQ0Esa0JBQUE7RUFFQSxZQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtBQTdDcEI7QUErQ29CO0VBQ0ksYUFBQTtFQUNBLDhCQUFBO0FBN0N4QjtBQTJDb0I7RUFLUSxlQUFBO0VBQ0EsZ0JBQUE7QUE3QzVCO0FBdUNvQjtFQVVRLGNBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7QUE5QzVCO0FBNUpBO0VBK013QixhQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0FBaER4QjtBQWpLQTtFQW9ONEIsa0JBQUE7RUFDQSxvQkFBQTtBQWhENUI7QUFyS0E7RUF5TjRCLGtCQUFBO0VBQ0Esb0JBQUE7QUFqRDVCO0FBektBO0VBOE40QixrQkFBQTtFQUNBLG9CQUFBO0FBbEQ1QjtBQTdLQTtFQW1PNEIsa0JBQUE7RUFDQSxvQkFBQTtBQW5ENUI7QUFqTEE7RUF3TzRCLGtCQUFBO0VBQ0Esb0JBQUE7QUFwRDVCO0FBckxBO0VBNk80QixrQkFBQTtFQUNBLG9CQUFBO0FBckQ1QjtBQXpMQTtFQXVQZ0IsYUFBQTtFQUVBLG1CQUFBO0FBNURoQjtBQThEZ0I7RUFDSSxvQkFBQTtBQTVEcEI7QUErRGdCO0VBQ0ksa0JBQUE7QUE3RHBCO0FBZ0VnQjtFQUVRLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0FBL0R4QjtBQTJEZ0I7RUFRUSxrQkFBQTtFQUNBLGVBQUE7QUFoRXhCO0FBdURnQjtFQVlZLGlCQUFBO0FBaEU1QjtBQW9EZ0I7RUFrQlksZ0JBQUE7QUFuRTVCO0FBaURnQjtFQXVCUSxnQkFBQTtBQXJFeEI7QUE4Q2dCO0VBeUJZLGNBQUE7RUFDQSxnQkFBQTtBQXBFNUI7QUF5RWdCO0VBRVEsZUFBQTtBQXhFeEI7QUE1TkE7RUE0U2dCLGFBQUE7QUE3RWhCO0FBK0VnQjtFQUNJLGtCQUFBO0FBN0VwQjtBQTRFZ0I7RUFJUSxXQUFBO0VBQ0EsWUFBQTtBQTdFeEI7QUFpRmdCO0VBRVEsZUFBQTtFQUNBLGdCQUFBO0VBRUEsbUJBQUE7QUFqRnhCO0FBNEVnQjtFQVNRLGVBQUE7RUFDQSxrQkFBQTtBQWxGeEI7QUF3RWdCO0VBY1EsZ0JBQUE7RUFDQSxtQkFBQTtBQW5GeEI7QUF1RmdCO0VBRVEsZUFBQTtBQXRGeEI7QUErRkk7RUFDSSxrQkFBQTtBQTdGUjtBQWdHSTtFQUNJLGdDQUFBO0VBQ0EsbUJBQUE7QUE5RlI7QUFpR0k7RUFDSSxXQUFBO0VBQ0EsbUJBQUE7QUEvRlI7QUE2Rkk7RUFLUSxjQUFBO0VBQ0EsVUFBQTtBQS9GWjtBQWlHWTtFQUNJLGNBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFFQSxtQkFBQTtBQWhHaEI7QUFtR1k7RUFDSSxXQUFBO0VBQ0EseUJBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7QUFqR2hCO0FBc0dJO0VBQ0ksYUFBQTtFQUNBLHlCQUFBO0VBQ0EsNkJBQUE7QUFwR1I7QUFpR0k7RUFNUSxtQkFBQTtFQUNBLG9CQUFBO0FBcEdaO0FBd0dJO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxXQUFBO0FBdEdSIiwiZmlsZSI6InByb2ZpbGUtbWFpbi5jb21wb25lbnQubGVzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL3ZhcmlhYmxlcyc7XG5cbi5wcm9maWxlX19tYWluIHtcbiAgICBtYXgtd2lkdGg6IDg1MHB4O1xuXG4gICAgbWFyZ2luOiA0MHB4O1xuXG4gICAgLnByb2ZpbGVfX2hlYWRlciB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgICAgICYgPiBpbWcge1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIH1cblxuICAgICAgICAmLS1iZyB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogMjAwcHg7XG5cbiAgICAgICAgICAgIGltZyB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJi0taW5mbyB7XG4gICAgICAgICAgICBtYXJnaW46IDVweCAzMHB4O1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIC8vZmxleC13cmFwOiB3cmFwO1xuXG4gICAgICAgICAgICAuYXZhdGFyLWJveCB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgICAgICAgIHRvcDogLTIwcHg7XG5cbiAgICAgICAgICAgICAgICBtaW4td2lkdGg6IDE3MHB4O1xuICAgICAgICAgICAgICAgIG1heC13aWR0aDogMTcwcHg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAxNzBweDtcblxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5pbmZvcm1hdGlvbiB7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiAyNXB4O1xuICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgICAgICAgICAgICAgJl9faGVhZGVyIHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxNXB4O1xuXG4gICAgICAgICAgICAgICAgICAgIGgzIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBwIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICZfX2NvbnRlbnQge1xuICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjU7XG5cbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICAgICAgICAgICAgICAgICAgIC5idG4sXG4gICAgICAgICAgICAgICAgICAgIC5idG4tb3V0bGluZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDIwcHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5wcm9maWxlX19jb250ZW50IHtcbiAgICAgICAgLnRhYnMge1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogMjBweDtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBmbGV4LXdyYXA6IHdyYXA7XG5cbiAgICAgICAgICAgIC50YWIge1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDE4cHg7XG4gICAgICAgICAgICAgICAgbWluLXdpZHRoOiAyNDBweDtcblxuICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG5cbiAgICAgICAgICAgICAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiA0cHg7XG4gICAgICAgICAgICAgICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDRweDtcblxuICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICAgICAgICAgICYuYWN0aXZlIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICNmZmY7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IEBhY3RpdmU7XG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogZGVmYXVsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmID4gKjpub3QoLnRhYnMpIHtcbiAgICAgICAgICAgIG1hcmdpbjogMzBweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDMwcHg7XG5cbiAgICAgICAgICAgIC8vYm9yZGVyOiAxcHggZGFzaGVkICNjY2M7XG5cbiAgICAgICAgICAgIGgzIHtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAubW9yZSB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXRvcDogMjBweDtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAuYWJvdXQge1xuICAgICAgICAgICAgcCB7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAucHJvamVjdHMge1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAuaGVhZCB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcblxuICAgICAgICAgICAgICAgIHAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogIzc0NzQ3NDtcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogMzAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICYgPiAqIHtcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxNXB4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLmNhcmRzIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcblxuICAgICAgICAgICAgICAgIC5jYXJkIHtcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAyMHB4O1xuICAgICAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxNXB4O1xuXG4gICAgICAgICAgICAgICAgICAgIGltZyB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXgtd2lkdGg6IDIzMHB4O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLnByb2plY3QtbmFtZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAxNXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC5pbmZvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IDVweDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiAzMDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAucmVwdXRhdGlvbiB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIC5jb250YWluZXJzIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGZsZXgtd3JhcDogd3JhcDtcblxuICAgICAgICAgICAgICAgIC5jb250YWluZXIge1xuICAgICAgICAgICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDIwcHg7XG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDE1cHggMjBweDtcblxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDgwcHg7XG4gICAgICAgICAgICAgICAgICAgIG1pbi13aWR0aDogMjMwcHg7XG4gICAgICAgICAgICAgICAgICAgIG1heC13aWR0aDogMjUwcHg7XG5cbiAgICAgICAgICAgICAgICAgICAgJl9faGVhZGVyIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGg0IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvdW50IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQGFjdGl2ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC5waG90by1xdWV1ZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDZweDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IDVweDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOm50aC1jaGlsZCgxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGNhbGMoLTZweCAqIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6bnRoLWNoaWxkKDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogY2FsYygtNnB4ICogMik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzpudGgtY2hpbGQoMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBjYWxjKC02cHggKiAzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOm50aC1jaGlsZCg0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGNhbGMoLTZweCAqIDQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6bnRoLWNoaWxkKDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogY2FsYygtNnB4ICogNSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzpudGgtY2hpbGQoNikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBjYWxjKC02cHggKiA2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC5leHBlcmllbmNlIHtcbiAgICAgICAgICAgIC5jb250YWluZXIge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG5cbiAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuXG4gICAgICAgICAgICAgICAgJjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZy1ib3R0b206IDI1cHg7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJl9faWNvbiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTZweDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAmX19oZWFkZXIge1xuICAgICAgICAgICAgICAgICAgICBoNCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4tbGVmdDogMTBweDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC5jb21wYW55IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYW4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiAzMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAuZGF0ZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogMzAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQGFjdGl2ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJl9fY29udGVudCB7XG4gICAgICAgICAgICAgICAgICAgIHAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLmVkdWNhdGlvbiB7XG4gICAgICAgICAgICAuY29udGFpbmVyIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuXG4gICAgICAgICAgICAgICAgJl9faWNvbiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTZweDtcblxuICAgICAgICAgICAgICAgICAgICBpbWcge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDU0cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDU0cHg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAmX19oZWFkZXIge1xuICAgICAgICAgICAgICAgICAgICBoNCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNTAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiA1cHg7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAuZGF0ZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogMzAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICZfX2NvbnRlbnQge1xuICAgICAgICAgICAgICAgICAgICBwIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLmh5c3Rtb2RhbCB7XG4gICAgJl9fd2luZG93IHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgIH1cblxuICAgICZfX2hlYWRlciB7XG4gICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjY2NjY2NjO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuICAgIH1cblxuICAgICZfX2JvZHkge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcblxuICAgICAgICAubWVzc2FnZSB7XG4gICAgICAgICAgICBtYXJnaW46IDAgYXV0bztcbiAgICAgICAgICAgIHdpZHRoOiA4MCU7XG5cbiAgICAgICAgICAgICZfX3RpdGxlIHtcbiAgICAgICAgICAgICAgICBjb2xvcjogQGJhc2U7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG5cbiAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmX190ZXh0YXJlYSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgbGlnaHRlbihAbGlnaHQsIDIzJSk7XG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19mb290ZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAgICAgICBib3JkZXItdG9wOiAxcHggc29saWQgI2NjY2NjYztcblxuICAgICAgICAuY29udHJvbHMge1xuICAgICAgICAgICAgcGFkZGluZy1yaWdodDogMjBweDtcbiAgICAgICAgICAgIHBhZGRpbmctYm90dG9tOiAyMHB4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fdGl0bGUge1xuICAgICAgICBmb250LXNpemU6IDI0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMjBweDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxufVxuIl19 */", ".profile[_ngcontent-%COMP%] {\n  margin: 0 auto;\n  max-width: 1440px;\n  font-family: 'Poppins', sans-serif;\n  color: #181818;\n}\n.profile__wrapper[_ngcontent-%COMP%] {\n  max-width: 1440px;\n  width: 100%;\n  display: flex;\n  flex-wrap: wrap;\n  margin: 0 90px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUuY29tcG9uZW50Lmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxjQUFBO0VBQ0EsaUJBQUE7RUFFQSxrQ0FBQTtFQUNBLGNBQUE7QUFGSjtBQUlJO0VBQ0ksaUJBQUE7RUFDQSxXQUFBO0VBRUEsYUFBQTtFQUNBLGVBQUE7RUFFQSxjQUFBO0FBSlIiLCJmaWxlIjoicHJvZmlsZS5jb21wb25lbnQubGVzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL3ZhcmlhYmxlcyc7XG5cbi5wcm9maWxlIHtcbiAgICBtYXJnaW46IDAgYXV0bztcbiAgICBtYXgtd2lkdGg6IDE0NDBweDtcblxuICAgIGZvbnQtZmFtaWx5OiBAZmY7XG4gICAgY29sb3I6IEBiYXNlO1xuXG4gICAgJl9fd3JhcHBlciB7XG4gICAgICAgIG1heC13aWR0aDogMTQ0MHB4O1xuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LXdyYXA6IHdyYXA7XG5cbiAgICAgICAgbWFyZ2luOiAwIDkwcHg7XG4gICAgfVxufVxuIl19 */"] });


/***/ }),

/***/ "Bx40":
/*!**************************************************!*\
  !*** ./src/app/store/profile/profile.actions.ts ***!
  \**************************************************/
/*! exports provided: GET_PROFILE_INFO_ACTION_TYPE, GET_PROFILE_INFO_SUCCESS_ACTION_TYPE, SEND_CONNECTION_ACTION_TYPE, ACCEPT_CONNECTION_ACTION_TYPE, DECLINE_CONNECTION_ACTION_TYPE, REMOVE_CONNECTION_ACTION_TYPE, SEND_CONNECTION_SUCCESS_ACTION_TYPE, ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE, DECLINE_CONNECTION_SUCCESS_ACTION_TYPE, REMOVE_CONNECTION_SUCCESS_ACTION_TYPE, ProfileGetInfoAction, ProfileGetInfoSuccessAction, ProfileSendConnectionAction, ProfileAcceptConnectionAction, ProfileDeclineConnectionAction, ProfileRemoveConnectionAction, ProfileSendConnectionSuccessAction, ProfileAcceptConnectionSuccessAction, ProfileDeclineConnectionSuccessAction, ProfileRemoveConnectionSuccessAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_PROFILE_INFO_ACTION_TYPE", function() { return GET_PROFILE_INFO_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_PROFILE_INFO_SUCCESS_ACTION_TYPE", function() { return GET_PROFILE_INFO_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SEND_CONNECTION_ACTION_TYPE", function() { return SEND_CONNECTION_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ACCEPT_CONNECTION_ACTION_TYPE", function() { return ACCEPT_CONNECTION_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DECLINE_CONNECTION_ACTION_TYPE", function() { return DECLINE_CONNECTION_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REMOVE_CONNECTION_ACTION_TYPE", function() { return REMOVE_CONNECTION_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SEND_CONNECTION_SUCCESS_ACTION_TYPE", function() { return SEND_CONNECTION_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE", function() { return ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DECLINE_CONNECTION_SUCCESS_ACTION_TYPE", function() { return DECLINE_CONNECTION_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REMOVE_CONNECTION_SUCCESS_ACTION_TYPE", function() { return REMOVE_CONNECTION_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileGetInfoAction", function() { return ProfileGetInfoAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileGetInfoSuccessAction", function() { return ProfileGetInfoSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileSendConnectionAction", function() { return ProfileSendConnectionAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileAcceptConnectionAction", function() { return ProfileAcceptConnectionAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileDeclineConnectionAction", function() { return ProfileDeclineConnectionAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileRemoveConnectionAction", function() { return ProfileRemoveConnectionAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileSendConnectionSuccessAction", function() { return ProfileSendConnectionSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileAcceptConnectionSuccessAction", function() { return ProfileAcceptConnectionSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileDeclineConnectionSuccessAction", function() { return ProfileDeclineConnectionSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileRemoveConnectionSuccessAction", function() { return ProfileRemoveConnectionSuccessAction; });
const GET_PROFILE_INFO_ACTION_TYPE = '[PROFILE] get info';
const GET_PROFILE_INFO_SUCCESS_ACTION_TYPE = '[PROFILE] success get info';
const SEND_CONNECTION_ACTION_TYPE = '[PROFILE] send connection';
const ACCEPT_CONNECTION_ACTION_TYPE = '[PROFILE] accept connection';
const DECLINE_CONNECTION_ACTION_TYPE = '[PROFILE] decline connection';
const REMOVE_CONNECTION_ACTION_TYPE = '[PROFILE] remove connection';
const SEND_CONNECTION_SUCCESS_ACTION_TYPE = '[PROFILE] success send connection';
const ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE = '[PROFILE] success accept connection';
const DECLINE_CONNECTION_SUCCESS_ACTION_TYPE = '[PROFILE] success decline connection';
const REMOVE_CONNECTION_SUCCESS_ACTION_TYPE = '[PROFILE] success remove connection';
/* ACTIONS */
/*  GET INFO  */
class ProfileGetInfoAction {
    constructor(payload) {
        this.payload = payload;
        this.type = GET_PROFILE_INFO_ACTION_TYPE;
    }
}
class ProfileGetInfoSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = GET_PROFILE_INFO_SUCCESS_ACTION_TYPE;
    }
}
/*  CONNECTIONS  */
class ProfileSendConnectionAction {
    constructor(payload) {
        this.payload = payload;
        this.type = SEND_CONNECTION_ACTION_TYPE;
    }
}
class ProfileAcceptConnectionAction {
    constructor(payload) {
        this.payload = payload;
        this.type = ACCEPT_CONNECTION_ACTION_TYPE;
    }
}
class ProfileDeclineConnectionAction {
    constructor(payload) {
        this.payload = payload;
        this.type = DECLINE_CONNECTION_ACTION_TYPE;
    }
}
class ProfileRemoveConnectionAction {
    constructor(payload) {
        this.payload = payload;
        this.type = REMOVE_CONNECTION_ACTION_TYPE;
    }
}
class ProfileSendConnectionSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = SEND_CONNECTION_SUCCESS_ACTION_TYPE;
    }
}
class ProfileAcceptConnectionSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE;
    }
}
class ProfileDeclineConnectionSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = DECLINE_CONNECTION_SUCCESS_ACTION_TYPE;
    }
}
class ProfileRemoveConnectionSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = REMOVE_CONNECTION_SUCCESS_ACTION_TYPE;
    }
}


/***/ }),

/***/ "C9XJ":
/*!********************************************!*\
  !*** ./src/app/store/auth/auth.actions.ts ***!
  \********************************************/
/*! exports provided: SIGN_IN_ACTION_TYPE, SIGN_IN_SUCCESS_ACTION_TYPE, SIGN_IN_FAILED_ACTION_TYPE, LOG_OUT_ACTION_TYPE, LOG_OUT_SUCCESS_ACTION_TYPE, LOG_OUT_FAILED_ACTION_TYPE, SignInAction, LogOutAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SIGN_IN_ACTION_TYPE", function() { return SIGN_IN_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SIGN_IN_SUCCESS_ACTION_TYPE", function() { return SIGN_IN_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SIGN_IN_FAILED_ACTION_TYPE", function() { return SIGN_IN_FAILED_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOG_OUT_ACTION_TYPE", function() { return LOG_OUT_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOG_OUT_SUCCESS_ACTION_TYPE", function() { return LOG_OUT_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOG_OUT_FAILED_ACTION_TYPE", function() { return LOG_OUT_FAILED_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignInAction", function() { return SignInAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogOutAction", function() { return LogOutAction; });
/* ACTION TYPES */
const SIGN_IN_ACTION_TYPE = '[AUTH] sign in';
const SIGN_IN_SUCCESS_ACTION_TYPE = '[AUTH] sign in success';
const SIGN_IN_FAILED_ACTION_TYPE = '[AUTH] sign in failed';
const LOG_OUT_ACTION_TYPE = '[AUTH] log out';
const LOG_OUT_SUCCESS_ACTION_TYPE = '[AUTH] log out success';
const LOG_OUT_FAILED_ACTION_TYPE = '[AUTH] log out failed';
/* ACTIONS */
class SignInAction {
    constructor() {
        this.type = SIGN_IN_ACTION_TYPE;
    }
}
class LogOutAction {
    constructor() {
        this.type = LOG_OUT_ACTION_TYPE;
    }
}


/***/ }),

/***/ "DFxy":
/*!*******************************************!*\
  !*** ./src/app/views/jobs/jobs.module.ts ***!
  \*******************************************/
/*! exports provided: JobsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobsModule", function() { return JobsModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _jobs_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./jobs.component */ "GPpY");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");



class JobsModule {
}
JobsModule.ɵfac = function JobsModule_Factory(t) { return new (t || JobsModule)(); };
JobsModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({ type: JobsModule });
JobsModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({ imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"]]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](JobsModule, { declarations: [_jobs_component__WEBPACK_IMPORTED_MODULE_1__["JobsComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"]] }); })();


/***/ }),

/***/ "FU3J":
/*!*******************************************!*\
  !*** ./src/app/views/auth/auth.module.ts ***!
  \*******************************************/
/*! exports provided: AuthModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthModule", function() { return AuthModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _authorization_authorization_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./authorization/authorization.component */ "iwNQ");
/* harmony import */ var _registration_registration_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./registration/registration.component */ "Jlp3");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../svg-icon/svg-icon.module */ "uQlT");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ "fXoL");








class AuthModule {
}
AuthModule.ɵfac = function AuthModule_Factory(t) { return new (t || AuthModule)(); };
AuthModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineNgModule"]({ type: AuthModule });
AuthModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjector"]({ imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
            _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_5__["SvgIconModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_6__["RouterModule"],
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsetNgModuleScope"](AuthModule, { declarations: [_authorization_authorization_component__WEBPACK_IMPORTED_MODULE_1__["AuthorizationComponent"], _registration_registration_component__WEBPACK_IMPORTED_MODULE_2__["RegistrationComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
        _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_5__["SvgIconModule"],
        _angular_router__WEBPACK_IMPORTED_MODULE_6__["RouterModule"]] }); })();


/***/ }),

/***/ "FUS3":
/*!*************************************************!*\
  !*** ./src/app/directives/directives.module.ts ***!
  \*************************************************/
/*! exports provided: DirectivesModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DirectivesModule", function() { return DirectivesModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _var_directive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./var.directive */ "doCK");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");



class DirectivesModule {
}
DirectivesModule.ɵfac = function DirectivesModule_Factory(t) { return new (t || DirectivesModule)(); };
DirectivesModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({ type: DirectivesModule });
DirectivesModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({ imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"]]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](DirectivesModule, { declarations: [_var_directive__WEBPACK_IMPORTED_MODULE_1__["VarDirective"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"]], exports: [_var_directive__WEBPACK_IMPORTED_MODULE_1__["VarDirective"]] }); })();


/***/ }),

/***/ "GPpY":
/*!**********************************************!*\
  !*** ./src/app/views/jobs/jobs.component.ts ***!
  \**********************************************/
/*! exports provided: JobsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobsComponent", function() { return JobsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");


class JobsComponent {
    constructor() { }
    ngOnInit() { }
}
JobsComponent.ɵfac = function JobsComponent_Factory(t) { return new (t || JobsComponent)(); };
JobsComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: JobsComponent, selectors: [["app-jobs"]], decls: 2, vars: 4, template: function JobsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](1, "date");
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](1, 1, 983134800000, "medium"), "\n");
    } }, pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["DatePipe"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJqb2JzLmNvbXBvbmVudC5sZXNzIn0= */"] });


/***/ }),

/***/ "Jlp3":
/*!*******************************************************************!*\
  !*** ./src/app/views/auth/registration/registration.component.ts ***!
  \*******************************************************************/
/*! exports provided: RegistrationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegistrationComponent", function() { return RegistrationComponent; });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/auth.service */ "lGQG");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../svg-icon/svg-icon.component */ "W/uP");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "ofXK");








function RegistrationComponent_li_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Invalid first name ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RegistrationComponent_li_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Invalid last name ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RegistrationComponent_li_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Invalid email ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RegistrationComponent_li_12_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Invalid phone ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RegistrationComponent_li_13_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " invalid password ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RegistrationComponent_li_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Password mismatch");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RegistrationComponent_li_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r6.backendError);
} }
class RegistrationComponent {
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
        this.repeatPasswordError = false;
        this.backendError = '';
        this.registrationForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroup"]({
            firstName: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('', [
                _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].minLength(2),
                _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required,
            ]),
            lastName: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('', [
                _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].minLength(2),
                _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required,
            ]),
            email: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].email, _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required]),
            phone: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('', [
                _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].pattern('[- +()0-9]{5,}'),
            ]),
            password: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('', [
                _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].minLength(6),
                _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required,
            ]),
            passwordRepeat: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('', [
                _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].minLength(6),
                _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required,
            ]),
        });
    }
    onSubmit() {
        const form = this.registrationForm.value;
        if (form.password === form.passwordRepeat) {
            this.repeatPasswordError = false;
            if (this.registrationForm.valid) {
                this.authService
                    .signUpRequest(this.registrationForm.value)
                    .subscribe(res => {
                    console.log(res);
                    this.router.navigate(['/signin'], {
                        queryParams: {
                            message: 'You have successfully registered and you can log in',
                        },
                    });
                }, err => (this.backendError = err.error.error));
            }
        }
        else {
            this.repeatPasswordError = true;
        }
    }
    ngOnInit() {
        this.authService
            .getIsdCountryCode()
            .subscribe(val => (this.IsdCountryCodes = val));
        this.registrationForm.valueChanges
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["debounceTime"])(600))
            .subscribe(form => {
            if (form.password === form.passwordRepeat)
                this.repeatPasswordError = false;
            else
                this.repeatPasswordError = true;
        });
    }
}
RegistrationComponent.ɵfac = function RegistrationComponent_Factory(t) { return new (t || RegistrationComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"])); };
RegistrationComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: RegistrationComponent, selectors: [["app-registration"]], decls: 48, vars: 8, consts: [[1, "wrapper"], [1, "container"], [1, "container__header"], [1, "logo"], ["icon", "whiteLogo"], [1, "container__body"], [1, "form", 3, "formGroup", "ngSubmit"], [1, "form__errors"], [4, "ngIf"], ["for", "firstName", 1, "form__label"], ["type", "text", "id", "firstName", "formControlName", "firstName", "required", "", 1, "form__control"], ["for", "lastName", 1, "form__label"], ["type", "text", "id", "lastName", "formControlName", "lastName", "required", "", 1, "form__control"], ["for", "email", 1, "form__label"], ["type", "email", "id", "email", "formControlName", "email", "email", "true", "required", "", 1, "form__control"], ["for", "phone", 1, "form__label"], ["type", "text", "id", "phone", "formControlName", "phone", "required", "", 1, "form__control"], ["for", "password", 1, "form__label"], ["type", "password", "id", "password", "formControlName", "password", "required", "", 1, "form__control"], ["for", "passwordRepeat", 1, "form__label"], ["type", "password", "id", "passwordRepeat", "formControlName", "passwordRepeat", "required", "", 1, "form__control"], [1, "agree"], ["type", "submit", 1, "submit"], [1, "auth-link"], ["routerLink", "/signin"]], template: function RegistrationComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "h2", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Linked");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](5, "svg", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "form", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngSubmit", function RegistrationComponent_Template_form_ngSubmit_7_listener() { return ctx.onSubmit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "ul", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](9, RegistrationComponent_li_9_Template, 2, 0, "li", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](10, RegistrationComponent_li_10_Template, 2, 0, "li", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](11, RegistrationComponent_li_11_Template, 2, 0, "li", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](12, RegistrationComponent_li_12_Template, 2, 0, "li", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](13, RegistrationComponent_li_13_Template, 2, 0, "li", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](14, RegistrationComponent_li_14_Template, 2, 0, "li", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](15, RegistrationComponent_li_15_Template, 2, 1, "li", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "label", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18, "First name");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](19, "input", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "label", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](22, "Last name");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](23, "input", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](24, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](25, "label", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](26, "E-mail");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](27, "input", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](28, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](29, "label", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](30, "Phone");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](31, "input", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](32, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](33, "label", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](34, "Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](35, "input", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](36, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](37, "label", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](38, "Repeat password");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](39, "input", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](40, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](41, "By clicking Agree & Join, you agree to the LinkedIn User Agreement, Privacy Policy, and Cookie Policy.");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](42, "button", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](43, "Agree & Join");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](44, "span", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](45, "Already on LinkedIn? ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](46, "a", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](47, "Sign in");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx.registrationForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.registrationForm.controls["firstName"].invalid && ctx.registrationForm.controls["firstName"].touched);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.registrationForm.controls["lastName"].invalid && ctx.registrationForm.controls["lastName"].touched);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.registrationForm.controls["email"].invalid && ctx.registrationForm.controls["email"].touched);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.registrationForm.controls["phone"].invalid && ctx.registrationForm.controls["phone"].touched);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.registrationForm.controls["password"].invalid && ctx.registrationForm.controls["password"].touched);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.repeatPasswordError);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.backendError);
    } }, directives: [_svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_5__["SvgIconComponent"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroupDirective"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControlName"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["RequiredValidator"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["EmailValidator"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterLinkWithHref"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJyZWdpc3RyYXRpb24uY29tcG9uZW50Lmxlc3MifQ== */", "@media (max-width: 520px) {\n  *[_ngcontent-%COMP%] {\n    overflow-x: hidden;\n  }\n}\n.wrapper[_ngcontent-%COMP%] {\n  width: 100vw;\n  height: 100vh;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  overflow-x: hidden;\n}\n.wrapper[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {\n  min-width: 300px;\n  width: 100%;\n  max-width: 600px;\n  background-color: #fff;\n  border-radius: 10px;\n  overflow: hidden;\n}\n.wrapper[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 10rem;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background-color: #0871a8;\n}\n.wrapper[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%] {\n  color: #ffffff;\n}\n.wrapper[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  margin-left: 0.2rem;\n  width: 32px;\n  height: 32px;\n  vertical-align: sub;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%] {\n  padding: 10px;\n  max-height: 700px;\n  overflow: auto;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%] {\n  font-family: 'Poppins', sans-serif;\n  display: flex;\n  flex-direction: column;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  margin: 15px auto;\n  width: 80%;\n  min-width: 280px;\n  display: flex;\n  justify-content: space-between;\n}\n@media (max-width: 520px) {\n  .wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   .form__control[_ngcontent-%COMP%] {\n    margin-top: 0.5rem;\n  }\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form__control[_ngcontent-%COMP%] {\n  padding: 0.4rem;\n  font-family: 'Poppins', sans-serif;\n  font-size: 1.2rem;\n  font-weight: 300;\n  outline: none;\n  border: 0;\n  border-bottom: 2px solid #dedede;\n  border-radius: 0;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   .agree[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 0.8rem;\n  color: #747474;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   .submit[_ngcontent-%COMP%] {\n  align-self: center;\n  width: 60%;\n  border-radius: 30px;\n  padding: 15px;\n  border: 0;\n  outline: 0;\n  background-color: #0871a8;\n  color: #fff;\n  font-size: 1.2rem;\n  cursor: pointer;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   .auth-link[_ngcontent-%COMP%] {\n  margin: 15px auto;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   .auth-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  text-decoration: none;\n  color: #0871a8;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   .auth-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form__errors[_ngcontent-%COMP%] {\n  width: 80%;\n  margin: 20px auto;\n  padding: 10px;\n  border: 3px solid red;\n  border-radius: 10px;\n  background-color: #ff7575;\n  color: #660000;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form__errors[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-left: 20px;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form__errors[_ngcontent-%COMP%]:empty {\n  display: none;\n}\n@media (max-height: 750px) {\n  .wrapper[_ngcontent-%COMP%] {\n    align-items: flex-start;\n  }\n  .wrapper[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {\n    margin-top: 30px;\n  }\n  .wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%] {\n    max-height: none;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dGguc3R5bGVzLmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSTtJQUNJLGtCQUFBO0VBRE47QUFDRjtBQUlBO0VBQ0ksWUFBQTtFQUNBLGFBQUE7RUFFQSxhQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtFQUVBLGtCQUFBO0FBSko7QUFKQTtFQVdRLGdCQUFBO0VBQ0EsV0FBQTtFQUNBLGdCQUFBO0VBRUEsc0JBQUE7RUFDQSxtQkFBQTtFQUNBLGdCQUFBO0FBTFI7QUFPUTtFQUNJLFdBQUE7RUFDQSxhQUFBO0VBRUEsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFFQSx5QkFBQTtBQVBaO0FBRFE7RUFXUSxjQUFBO0FBUGhCO0FBSlE7RUFjWSxtQkFBQTtFQUVBLFdBQUE7RUFDQSxZQUFBO0VBRUEsbUJBQUE7QUFUcEI7QUFjUTtFQUNJLGFBQUE7RUFDQSxpQkFBQTtFQUNBLGNBQUE7QUFaWjtBQVNRO0VBS1Esa0NBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7QUFYaEI7QUFJUTtFQVVZLGlCQUFBO0VBQ0EsVUFBQTtFQUNBLGdCQUFBO0VBRUEsYUFBQTtFQUNBLDhCQUFBO0FBWnBCO0FBY29CO0VBQUE7SUFDSSxzQkFBQTtFQVh0QjtFQVVrQjtJQUlRLGtCQUFBO0VBWDFCO0FBQ0Y7QUFlZ0I7RUFDSSxlQUFBO0VBQ0Esa0NBQUE7RUFDQSxpQkFBQTtFQUNBLGdCQUFBO0VBRUEsYUFBQTtFQUNBLFNBQUE7RUFDQSxnQ0FBQTtFQUNBLGdCQUFBO0FBZHBCO0FBckJRO0VBdUNZLGtCQUFBO0VBQ0EsaUJBQUE7RUFDQSxjQUFBO0FBZnBCO0FBMUJRO0VBNkNZLGtCQUFBO0VBRUEsVUFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtFQUVBLFNBQUE7RUFDQSxVQUFBO0VBRUEseUJBQUE7RUFDQSxXQUFBO0VBQ0EsaUJBQUE7RUFFQSxlQUFBO0FBcEJwQjtBQXRDUTtFQTZEWSxpQkFBQTtBQXBCcEI7QUF6Q1E7RUFnRWdCLHFCQUFBO0VBQ0EsY0FBQTtBQXBCeEI7QUFzQndCO0VBQ0ksMEJBQUE7QUFwQjVCO0FBeUJnQjtFQUNJLFVBQUE7RUFDQSxpQkFBQTtFQUNBLGFBQUE7RUFFQSxxQkFBQTtFQUNBLG1CQUFBO0VBQ0EseUJBQUE7RUFFQSxjQUFBO0FBekJwQjtBQWdCZ0I7RUFZUSxpQkFBQTtBQXpCeEI7QUE0Qm9CO0VBQ0ksYUFBQTtBQTFCeEI7QUFpQ0k7RUFBQTtJQUNJLHVCQUFBO0VBOUJOO0VBNkJFO0lBSVEsZ0JBQUE7RUE5QlY7RUEwQkU7SUFRUSxnQkFBQTtFQS9CVjtBQUNGIiwiZmlsZSI6ImF1dGguc3R5bGVzLmxlc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICdzcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMnO1xuXG5AbWVkaWEgKG1heC13aWR0aDogNTIwcHgpIHtcbiAgICAqIHtcbiAgICAgICAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICAgIH1cbn1cblxuLndyYXBwZXIge1xuICAgIHdpZHRoOiAxMDB2dztcbiAgICBoZWlnaHQ6IDEwMHZoO1xuXG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xuXG4gICAgLmNvbnRhaW5lciB7XG4gICAgICAgIG1pbi13aWR0aDogMzAwcHg7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBtYXgtd2lkdGg6IDYwMHB4O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgICAgICAgJl9faGVhZGVyIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiAxMHJlbTtcblxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogQGFjdGl2ZTtcblxuICAgICAgICAgICAgLmxvZ28ge1xuICAgICAgICAgICAgICAgIGNvbG9yOiAjZmZmZmZmO1xuXG4gICAgICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDAuMnJlbTtcblxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMzJweDtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMnB4O1xuXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiBzdWI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJl9fYm9keSB7XG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4O1xuICAgICAgICAgICAgbWF4LWhlaWdodDogNzAwcHg7XG4gICAgICAgICAgICBvdmVyZmxvdzogYXV0bztcbiAgICAgICAgICAgIC5mb3JtIHtcbiAgICAgICAgICAgICAgICBmb250LWZhbWlseTogJ1BvcHBpbnMnLCBzYW5zLXNlcmlmO1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblxuICAgICAgICAgICAgICAgIGRpdiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMTVweCBhdXRvO1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogODAlO1xuICAgICAgICAgICAgICAgICAgICBtaW4td2lkdGg6IDI4MHB4O1xuXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcblxuICAgICAgICAgICAgICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNTIwcHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JtX19jb250cm9sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAwLjVyZW07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAmX19jb250cm9sIHtcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMC40cmVtO1xuICAgICAgICAgICAgICAgICAgICBmb250LWZhbWlseTogQGZmO1xuICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDEuMnJlbTtcbiAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDMwMDtcblxuICAgICAgICAgICAgICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDA7XG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCAjZGVkZWRlO1xuICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC5hZ3JlZSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAwLjhyZW07XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBAbGlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLnN1Ym1pdCB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWduLXNlbGY6IGNlbnRlcjtcblxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNjAlO1xuICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAzMHB4O1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAxNXB4O1xuXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjogMDtcbiAgICAgICAgICAgICAgICAgICAgb3V0bGluZTogMDtcblxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBAYWN0aXZlO1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogI2ZmZjtcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxLjJyZW07XG5cbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAuYXV0aC1saW5rIHtcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAxNXB4IGF1dG87XG5cbiAgICAgICAgICAgICAgICAgICAgYSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQGFjdGl2ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAmX19lcnJvcnMge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogODAlO1xuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDIwcHggYXV0bztcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMTBweDtcblxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDNweCBzb2xpZCByZWQ7XG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0ZW4ocmVkLCAyMyUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBkYXJrZW4ocmVkLCAzMCUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAyMHB4O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJjplbXB0eSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgQG1lZGlhIChtYXgtaGVpZ2h0OiA3NTBweCkge1xuICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcblxuICAgICAgICAuY29udGFpbmVyIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDMwcHg7XG4gICAgICAgIH1cblxuICAgICAgICAuY29udGFpbmVyX19ib2R5IHtcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IG5vbmU7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0= */"] });


/***/ }),

/***/ "LmEr":
/*!*******************************************************!*\
  !*** ./src/app/components/footer/footer.component.ts ***!
  \*******************************************************/
/*! exports provided: FooterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FooterComponent", function() { return FooterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class FooterComponent {
    constructor() { }
    ngOnInit() { }
}
FooterComponent.ɵfac = function FooterComponent_Factory(t) { return new (t || FooterComponent)(); };
FooterComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FooterComponent, selectors: [["app-footer"]], decls: 2, vars: 0, consts: [[1, "footer"]], template: function FooterComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "FOOTER");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: [".footer[_ngcontent-%COMP%] {\n  min-height: 1000px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvb3Rlci5jb21wb25lbnQubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGtCQUFBO0FBQ0oiLCJmaWxlIjoiZm9vdGVyLmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiLmZvb3RlciB7XG4gICAgbWluLWhlaWdodDogMTAwMHB4O1xufVxuIl19 */"] });


/***/ }),

/***/ "O8+U":
/*!**************************************************!*\
  !*** ./src/app/store/profile/profile.reducer.ts ***!
  \**************************************************/
/*! exports provided: profileNode, profileReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileNode", function() { return profileNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileReducer", function() { return profileReducer; });
/* harmony import */ var _profile_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./profile.actions */ "Bx40");

const profileNode = 'profile';
const initialState = {
    id: -1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    info: {
        isOnline: false,
        description: '',
        views: {
            current: 0,
            prev: 0,
        },
        connections: [],
        sentConnections: [],
        receivedConnections: [],
        posts: [],
        avatar: null,
        profileHeaderBg: null,
        dateOfBirth: 0,
        profession: '',
        locality: {
            country: '',
            city: '',
        },
    },
};
const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case _profile_actions__WEBPACK_IMPORTED_MODULE_0__["GET_PROFILE_INFO_SUCCESS_ACTION_TYPE"]:
            return action.payload.profile;
        case _profile_actions__WEBPACK_IMPORTED_MODULE_0__["SEND_CONNECTION_SUCCESS_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { info: Object.assign(Object.assign({}, state.info), { receivedConnections: [
                        ...state.info.receivedConnections,
                        { userId: action.payload.senderId },
                    ] }) });
        case _profile_actions__WEBPACK_IMPORTED_MODULE_0__["ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { info: Object.assign(Object.assign({}, state.info), { connections: [
                        ...state.info.connections,
                        {
                            userId: action.payload.userId,
                            date: action.payload.date,
                        },
                    ], sentConnections: state.info.sentConnections.filter(user => user.userId !== action.payload.userId) }) });
        case _profile_actions__WEBPACK_IMPORTED_MODULE_0__["DECLINE_CONNECTION_SUCCESS_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { info: Object.assign(Object.assign({}, state.info), { receivedConnections: state.info.receivedConnections.filter(user => user.userId !== action.payload.senderId) }) });
        case _profile_actions__WEBPACK_IMPORTED_MODULE_0__["REMOVE_CONNECTION_SUCCESS_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { info: Object.assign(Object.assign({}, state.info), { connections: state.info.connections.filter(user => user.userId !== action.payload.senderId) }) });
        default:
            return state;
    }
};


/***/ }),

/***/ "OE1Y":
/*!************************************************!*\
  !*** ./src/app/layouts/base/base.component.ts ***!
  \************************************************/
/*! exports provided: BaseLayoutComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseLayoutComponent", function() { return BaseLayoutComponent; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _store_auth_auth_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../store/auth/auth.selectors */ "4Zo2");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_header_header_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/header/header.component */ "2MiI");
/* harmony import */ var _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/footer/footer.component */ "LmEr");







class BaseLayoutComponent {
    constructor(store$, router) {
        this.store$ = store$;
        this.router = router;
        this.authStatus$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_auth_auth_selectors__WEBPACK_IMPORTED_MODULE_1__["authStatusSelector"]));
    }
    ngOnInit() {
        this.authStatus$.subscribe(res => {
            if (!res) {
                this.router.navigate(['/signin']);
            }
        });
    }
}
BaseLayoutComponent.ɵfac = function BaseLayoutComponent_Factory(t) { return new (t || BaseLayoutComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["Store"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"])); };
BaseLayoutComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: BaseLayoutComponent, selectors: [["app-base-layout"]], decls: 4, vars: 0, consts: [[1, "base-layout__wrapper"]], template: function BaseLayoutComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "app-header");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](2, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "app-footer");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } }, directives: [_components_header_header_component__WEBPACK_IMPORTED_MODULE_4__["HeaderComponent"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterOutlet"], _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_5__["FooterComponent"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJiYXNlLmNvbXBvbmVudC5sZXNzIn0= */"] });


/***/ }),

/***/ "QBc3":
/*!**********************************************************************!*\
  !*** ./src/app/views/profile/edit-profile/edit-profile.component.ts ***!
  \**********************************************************************/
/*! exports provided: EditProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditProfileComponent", function() { return EditProfileComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _edit_profile_side_edit_profile_side_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit-profile-side/edit-profile-side.component */ "W0ui");
/* harmony import */ var _edit_profile_main_edit_profile_main_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit-profile-main/edit-profile-main.component */ "fb7c");



class EditProfileComponent {
    constructor() {
        this.currentTab = 'Additional information'; // 'Personal data'
    }
    changeTab(tab) {
        this.currentTab = tab.trim();
    }
    ngOnInit() { }
}
EditProfileComponent.ɵfac = function EditProfileComponent_Factory(t) { return new (t || EditProfileComponent)(); };
EditProfileComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: EditProfileComponent, selectors: [["app-edit-profile"]], decls: 3, vars: 1, consts: [[1, "edit-profile"], [1, "edit-side", 3, "onChangeTab"], [1, "edit-main", 3, "currentTab"]], template: function EditProfileComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "app-edit-profile-side", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("onChangeTab", function EditProfileComponent_Template_app_edit_profile_side_onChangeTab_1_listener($event) { return ctx.changeTab($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "app-edit-profile-main", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("currentTab", ctx.currentTab);
    } }, directives: [_edit_profile_side_edit_profile_side_component__WEBPACK_IMPORTED_MODULE_1__["EditProfileSideComponent"], _edit_profile_main_edit_profile_main_component__WEBPACK_IMPORTED_MODULE_2__["EditProfileMainComponent"]], styles: [".edit-profile[_ngcontent-%COMP%] {\n  max-width: 1440px;\n  margin: 40px auto;\n  display: flex;\n  justify-content: center;\n}\n.edit-profile[_ngcontent-%COMP%]   .edit-side[_ngcontent-%COMP%] {\n  margin-right: 40px;\n  width: 30%;\n  max-width: 280px;\n}\n.edit-profile[_ngcontent-%COMP%]   .edit-main[_ngcontent-%COMP%] {\n  width: 60%;\n  max-width: 560px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVkaXQtcHJvZmlsZS5jb21wb25lbnQubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGlCQUFBO0VBQ0EsaUJBQUE7RUFFQSxhQUFBO0VBQ0EsdUJBQUE7QUFBSjtBQUxBO0VBUVEsa0JBQUE7RUFDQSxVQUFBO0VBQ0EsZ0JBQUE7QUFBUjtBQVZBO0VBY1EsVUFBQTtFQUNBLGdCQUFBO0FBRFIiLCJmaWxlIjoiZWRpdC1wcm9maWxlLmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiLmVkaXQtcHJvZmlsZSB7XG4gICAgbWF4LXdpZHRoOiAxNDQwcHg7XG4gICAgbWFyZ2luOiA0MHB4IGF1dG87XG5cbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXG4gICAgLmVkaXQtc2lkZSB7XG4gICAgICAgIG1hcmdpbi1yaWdodDogNDBweDtcbiAgICAgICAgd2lkdGg6IDMwJTtcbiAgICAgICAgbWF4LXdpZHRoOiAyODBweDtcbiAgICB9XG5cbiAgICAuZWRpdC1tYWluIHtcbiAgICAgICAgd2lkdGg6IDYwJTtcbiAgICAgICAgbWF4LXdpZHRoOiA1NjBweDtcbiAgICB9XG59XG4iXX0= */"] });


/***/ }),

/***/ "SS4A":
/*!***********************************************************************************!*\
  !*** ./src/app/components/network/connections-list/connections-list.component.ts ***!
  \***********************************************************************************/
/*! exports provided: ConnectionsListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectionsListComponent", function() { return ConnectionsListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");




function ConnectionsListComponent_div_6_button_15_Template(rf, ctx) { if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ConnectionsListComponent_div_6_button_15_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r7); const connection_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit; const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r5.acceptConnection(connection_r1.user.id); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Accept");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function ConnectionsListComponent_div_6_button_16_Template(rf, ctx) { if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ConnectionsListComponent_div_6_button_16_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r10); const connection_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit; const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r8.declineConnection(connection_r1.user.id); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Decline");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function ConnectionsListComponent_div_6_button_17_Template(rf, ctx) { if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ConnectionsListComponent_div_6_button_17_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r13); const connection_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit; const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r11.cancelConnection(connection_r1.user.id); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Cancel");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function ConnectionsListComponent_div_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "a", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "img", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](15, ConnectionsListComponent_div_6_button_15_Template, 2, 0, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](16, ConnectionsListComponent_div_6_button_16_Template, 2, 0, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](17, ConnectionsListComponent_div_6_button_17_Template, 2, 0, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const connection_r1 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", "/profile/" + connection_r1.user.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", connection_r1.user.info.avatar ? connection_r1.user.info.avatar.url : "assets/img/avatar-man.png", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](connection_r1.user.firstName + " " + connection_r1.user.lastName);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](connection_r1.user.info.profession);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](connection_r1.user.info.connections.length + " connections");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", connection_r1.message, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.type === "incoming");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.type === "incoming");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.type === "sent");
} }
class ConnectionsListComponent {
    constructor() {
        this.connections = [];
        this.type = '';
        this.action = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    acceptConnection(id) {
        this.action.emit({ type: 'accept', id });
    }
    declineConnection(id) {
        this.action.emit({ type: 'decline', id });
    }
    cancelConnection(id) {
        this.action.emit({ type: 'cancel', id });
    }
    ngOnInit() { }
}
ConnectionsListComponent.ɵfac = function ConnectionsListComponent_Factory(t) { return new (t || ConnectionsListComponent)(); };
ConnectionsListComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ConnectionsListComponent, selectors: [["app-connections-list"]], inputs: { connections: "connections", type: "type" }, outputs: { action: "action" }, decls: 7, vars: 3, consts: [[1, "connections"], [1, "connections__have"], [1, "connections__list"], ["class", "connection", 4, "ngFor", "ngForOf"], [1, "connection"], [1, "profile-link", 3, "routerLink"], [1, "user"], [1, "avatar-box"], ["alt", "avatar", 3, "src"], [1, "info"], [1, "name"], [1, "profession"], [1, "connections-count"], [1, "message"], [1, "controls"], ["class", "btn-accept", 3, "click", 4, "ngIf"], ["class", "btn-decline", 3, "click", 4, "ngIf"], [1, "btn-accept", 3, "click"], [1, "btn-decline", 3, "click"]], template: function ConnectionsListComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " You have ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, ConnectionsListComponent_div_6_Template, 18, 9, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", ctx.connections.length, " ", ctx.type, " connections");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.connections);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterLinkWithHref"], _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"]], styles: [".connections[_ngcontent-%COMP%] {\n  margin-top: 40px;\n}\n.connections__have[_ngcontent-%COMP%] {\n  text-align: center;\n  text-transform: uppercase;\n  font-weight: 600;\n}\n.connections__have[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #0871a8;\n  cursor: pointer;\n}\n.connections__have[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.connections__list[_ngcontent-%COMP%] {\n  margin-top: 30px;\n  width: 100%;\n}\n.connections__list[_ngcontent-%COMP%]   .profile-link[_ngcontent-%COMP%] {\n  text-decoration: none;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%] {\n  height: 100px;\n  padding: 20px 30px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 200px;\n  margin-bottom: 10px;\n  color: #181818;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .avatar-box[_ngcontent-%COMP%] {\n  width: 52px;\n  height: 52px;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .profession[_ngcontent-%COMP%] {\n  font-size: 10px;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .connections-count[_ngcontent-%COMP%] {\n  font-size: 10px;\n  color: #0871a8;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%] {\n  max-width: 300px;\n  width: 35%;\n  padding-left: 15px;\n  border-left: 2px solid #0871a8;\n  font-size: 11px;\n  color: #747474;\n  word-wrap: break-word;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%] {\n  display: flex;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  width: 90px;\n  height: 32px;\n  text-align: center;\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 600;\n  border-radius: 4px;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .btn-accept[_ngcontent-%COMP%] {\n  background-color: #0871a8;\n  color: white;\n  margin-right: 15px;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .btn-decline[_ngcontent-%COMP%] {\n  color: #a9a9a9;\n  border: 1px solid #a9a9a9;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .btn-decline[_ngcontent-%COMP%]:hover {\n  color: #747474;\n  border-color: #747474;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbm5lY3Rpb25zLWxpc3QuY29tcG9uZW50Lmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxnQkFBQTtBQURKO0FBR0k7RUFDSSxrQkFBQTtFQUNBLHlCQUFBO0VBRUEsZ0JBQUE7QUFGUjtBQUZJO0VBT1EsY0FBQTtFQUNBLGVBQUE7QUFGWjtBQUdZO0VBQ0ksMEJBQUE7QUFEaEI7QUFNSTtFQUNJLGdCQUFBO0VBRUEsV0FBQTtBQUxSO0FBRUk7RUFNUSxxQkFBQTtBQUxaO0FBREk7RUFVUSxhQUFBO0VBQ0Esa0JBQUE7RUFFQSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtBQVBaO0FBUkk7RUFrQlksYUFBQTtFQUNBLGdCQUFBO0VBQ0EsbUJBQUE7RUFFQSxjQUFBO0FBUmhCO0FBZEk7RUF5QmdCLFdBQUE7RUFDQSxZQUFBO0FBUnBCO0FBbEJJO0VBK0JvQixlQUFBO0VBQ0EsZ0JBQUE7QUFWeEI7QUF0Qkk7RUFtQ29CLGVBQUE7QUFWeEI7QUF6Qkk7RUFzQ29CLGVBQUE7RUFDQSxjQUFBO0FBVnhCO0FBN0JJO0VBNkNZLGdCQUFBO0VBQ0EsVUFBQTtFQUNBLGtCQUFBO0VBQ0EsOEJBQUE7RUFFQSxlQUFBO0VBQ0EsY0FBQTtFQUVBLHFCQUFBO0FBZmhCO0FBdENJO0VBeURZLGFBQUE7QUFoQmhCO0FBekNJO0VBNERnQixXQUFBO0VBQ0EsWUFBQTtFQUVBLGtCQUFBO0VBQ0EseUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFFQSxrQkFBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0VBRUEsZUFBQTtBQW5CcEI7QUFyREk7RUE0RWdCLHlCQUFBO0VBQ0EsWUFBQTtFQUVBLGtCQUFBO0FBckJwQjtBQTFESTtFQW1GZ0IsY0FBQTtFQUNBLHlCQUFBO0FBdEJwQjtBQXdCb0I7RUFDSSxjQUFBO0VBQ0EscUJBQUE7QUF0QnhCIiwiZmlsZSI6ImNvbm5lY3Rpb25zLWxpc3QuY29tcG9uZW50Lmxlc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi8uLi9hc3NldHMvc3R5bGVzL3ZhcmlhYmxlcyc7XG5cbi5jb25uZWN0aW9ucyB7XG4gICAgbWFyZ2luLXRvcDogNDBweDtcblxuICAgICZfX2hhdmUge1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG5cbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcblxuICAgICAgICBzcGFuIHtcbiAgICAgICAgICAgIGNvbG9yOiBAYWN0aXZlO1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19saXN0IHtcbiAgICAgICAgbWFyZ2luLXRvcDogMzBweDtcblxuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICAucHJvZmlsZS1saW5rIHtcbiAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC5jb25uZWN0aW9uIHtcbiAgICAgICAgICAgIGhlaWdodDogMTAwcHg7XG4gICAgICAgICAgICBwYWRkaW5nOiAyMHB4IDMwcHg7XG5cbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgICAgICAudXNlciB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICBtaW4td2lkdGg6IDIwMHB4O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG5cbiAgICAgICAgICAgICAgICBjb2xvcjogQGJhc2U7XG5cbiAgICAgICAgICAgICAgICAuYXZhdGFyLWJveCB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiA1MnB4O1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDUycHg7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLmluZm8ge1xuICAgICAgICAgICAgICAgICAgICAubmFtZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC5wcm9mZXNzaW9uIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAuY29ubmVjdGlvbnMtY291bnQge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxMHB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEBhY3RpdmU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IC8vIC51c2VyIGVuZFxuXG4gICAgICAgICAgICAubWVzc2FnZSB7XG4gICAgICAgICAgICAgICAgbWF4LXdpZHRoOiAzMDBweDtcbiAgICAgICAgICAgICAgICB3aWR0aDogMzUlO1xuICAgICAgICAgICAgICAgIHBhZGRpbmctbGVmdDogMTVweDtcbiAgICAgICAgICAgICAgICBib3JkZXItbGVmdDogMnB4IHNvbGlkIEBhY3RpdmU7XG5cbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgICAgICAgICAgY29sb3I6IEBsaWdodDtcblxuICAgICAgICAgICAgICAgIHdvcmQtd3JhcDogYnJlYWstd29yZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLmNvbnRyb2xzIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuXG4gICAgICAgICAgICAgICAgYnV0dG9uIHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDkwcHg7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzJweDtcblxuICAgICAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgICAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcblxuICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgICAgICAgICAgb3V0bGluZTogbm9uZTtcblxuICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLmJ0bi1hY2NlcHQge1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBAYWN0aXZlO1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogd2hpdGU7XG5cbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxNXB4O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC5idG4tZGVjbGluZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAjYTlhOWE5O1xuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjYTlhOWE5O1xuXG4gICAgICAgICAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEBsaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlci1jb2xvcjogQGxpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IC8vIC5jb25uZWN0aW9uIGVuZFxuICAgIH0gLy8gbGlzdCBlbmRcbn0gLy8gLm5ldy1jb25uZWN0aW9ucyBlbmRcbiJdfQ== */"] });


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _store_auth_auth_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./store/auth/auth.actions */ "C9XJ");
/* harmony import */ var _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store/my-profile/my-profile.actions */ "fLR6");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _services_web_socket_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./services/web-socket.service */ "iNhY");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "tyNb");






class AppComponent {
    constructor(store$, webSocketService) {
        this.store$ = store$;
        this.webSocketService = webSocketService;
        this.title = 'client';
    }
    ngOnInit() {
        if (localStorage.getItem('currentUser')) {
            this.store$.dispatch(new _store_auth_auth_actions__WEBPACK_IMPORTED_MODULE_0__["SignInAction"]());
            this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_1__["MyProfileGetInfoAction"]({
                id: JSON.parse(localStorage.getItem('currentUser')).user.id,
            }));
        }
        this.webSocketService
            .listen('some event')
            .subscribe(data => console.log(data));
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_web_socket_service__WEBPACK_IMPORTED_MODULE_4__["WebSocketService"])); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 2, vars: 0, consts: [["id", "app"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterOutlet"]], styles: ["*[_ngcontent-%COMP%], *[_ngcontent-%COMP%]:before, *[_ngcontent-%COMP%]:after {\n  font-family: 'Poppins', sans-serif;\n}\n#app[_ngcontent-%COMP%] {\n  color: #181818;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTs7O0VBR0ksa0NBQUE7QUFESjtBQUlBO0VBQ0ksY0FBQTtBQUZKIiwiZmlsZSI6ImFwcC5jb21wb25lbnQubGVzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL3ZhcmlhYmxlcyc7XG5cbiosXG4qOmJlZm9yZSxcbio6YWZ0ZXIge1xuICAgIGZvbnQtZmFtaWx5OiBAZmY7XG59XG5cbiNhcHAge1xuICAgIGNvbG9yOiBAYmFzZTtcbn1cbiJdfQ== */"] });


/***/ }),

/***/ "TJUK":
/*!*******************************************!*\
  !*** ./src/app/views/feed/feed.module.ts ***!
  \*******************************************/
/*! exports provided: FeedModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeedModule", function() { return FeedModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../svg-icon/svg-icon.module */ "uQlT");
/* harmony import */ var _feed_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./feed.component */ "pBt9");
/* harmony import */ var _feed_main_feed_main_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./feed-main/feed-main.component */ "+PC+");
/* harmony import */ var _feed_side_feed_side_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./feed-side/feed-side.component */ "ZrjY");
/* harmony import */ var _components_post_post_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/post/post.component */ "YzH7");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../svg-icon/svg-icon.component */ "W/uP");











class FeedModule {
}
FeedModule.ɵfac = function FeedModule_Factory(t) { return new (t || FeedModule)(); };
FeedModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineNgModule"]({ type: FeedModule });
FeedModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjector"]({ imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_1__["SvgIconModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormsModule"]]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsetNgModuleScope"](FeedModule, { declarations: [_feed_component__WEBPACK_IMPORTED_MODULE_2__["FeedComponent"],
        _feed_main_feed_main_component__WEBPACK_IMPORTED_MODULE_3__["FeedMainComponent"],
        _feed_side_feed_side_component__WEBPACK_IMPORTED_MODULE_4__["FeedSideComponent"],
        _components_post_post_component__WEBPACK_IMPORTED_MODULE_5__["PostComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_1__["SvgIconModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormsModule"]] }); })();
_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsetComponentScope"](_feed_main_feed_main_component__WEBPACK_IMPORTED_MODULE_3__["FeedMainComponent"], [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgModel"], _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_8__["SvgIconComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_0__["NgForOf"], _angular_common__WEBPACK_IMPORTED_MODULE_0__["NgIf"], _components_post_post_component__WEBPACK_IMPORTED_MODULE_5__["PostComponent"]], [_angular_common__WEBPACK_IMPORTED_MODULE_0__["AsyncPipe"]]);


/***/ }),

/***/ "UTcu":
/*!**************************************!*\
  !*** ./src/app/guards/auth.guard.ts ***!
  \**************************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");


class AuthGuard {
    constructor(router) {
        this.router = router;
    }
    canActivate(route, state) {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/signin'], {
            queryParams: { returnUrl: state.url },
        });
        return false;
    }
}
AuthGuard.ɵfac = function AuthGuard_Factory(t) { return new (t || AuthGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"])); };
AuthGuard.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: AuthGuard, factory: AuthGuard.ɵfac });


/***/ }),

/***/ "Vbwu":
/*!************************************************!*\
  !*** ./src/app/layouts/auth/auth.component.ts ***!
  \************************************************/
/*! exports provided: AuthLayoutComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthLayoutComponent", function() { return AuthLayoutComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");


class AuthLayoutComponent {
    constructor() { }
    ngOnInit() { }
}
AuthLayoutComponent.ɵfac = function AuthLayoutComponent_Factory(t) { return new (t || AuthLayoutComponent)(); };
AuthLayoutComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AuthLayoutComponent, selectors: [["app-auth-layout"]], decls: 2, vars: 0, consts: [[1, "auth-layout__wrapper"]], template: function AuthLayoutComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"]], styles: [".auth-layout__wrapper[_ngcontent-%COMP%] {\n  position: relative;\n  height: 100vh;\n  width: 100vw;\n}\n.auth-layout__wrapper[_ngcontent-%COMP%]:before, .auth-layout__wrapper[_ngcontent-%COMP%]:after {\n  content: '';\n  display: block;\n  position: fixed;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  z-index: -1;\n}\n.auth-layout__wrapper[_ngcontent-%COMP%]:before {\n  background: radial-gradient(circle farthest-corner at 100% 0, #0871a8, rgba(8, 113, 168, 0.3));\n}\n.auth-layout__wrapper[_ngcontent-%COMP%]:after {\n  background-image: url('bg.svg');\n  background-size: 1920px 1080px;\n  background-position: left top;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dGguY29tcG9uZW50Lmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxrQkFBQTtFQUVBLGFBQUE7RUFDQSxZQUFBO0FBRko7QUFJSTs7RUFFSSxXQUFBO0VBQ0EsY0FBQTtFQUNBLGVBQUE7RUFDQSxPQUFBO0VBQ0EsUUFBQTtFQUNBLE1BQUE7RUFDQSxTQUFBO0VBRUEsV0FBQTtBQUhSO0FBTUk7RUFDSSw4RkFBQTtBQUpSO0FBV0k7RUFDSSwrQkFBQTtFQUNBLDhCQUFBO0VBQ0EsNkJBQUE7QUFUUiIsImZpbGUiOiJhdXRoLmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvdmFyaWFibGVzJztcblxuLmF1dGgtbGF5b3V0X193cmFwcGVyIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIHdpZHRoOiAxMDB2dztcblxuICAgICY6YmVmb3JlLFxuICAgICY6YWZ0ZXIge1xuICAgICAgICBjb250ZW50OiAnJztcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgICAgbGVmdDogMDtcbiAgICAgICAgcmlnaHQ6IDA7XG4gICAgICAgIHRvcDogMDtcbiAgICAgICAgYm90dG9tOiAwO1xuXG4gICAgICAgIHotaW5kZXg6IC0xO1xuICAgIH1cblxuICAgICY6YmVmb3JlIHtcbiAgICAgICAgYmFja2dyb3VuZDogcmFkaWFsLWdyYWRpZW50KFxuICAgICAgICAgICAgY2lyY2xlIGZhcnRoZXN0LWNvcm5lciBhdCAxMDAlIDAsXG4gICAgICAgICAgICBAYWN0aXZlLFxuICAgICAgICAgICAgcmdiYShAYWN0aXZlLCAwLjMpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgJjphZnRlciB7XG4gICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnc3JjL2Fzc2V0cy9pbWcvc3ZnL2JnLnN2ZycpO1xuICAgICAgICBiYWNrZ3JvdW5kLXNpemU6IDE5MjBweCAxMDgwcHg7XG4gICAgICAgIGJhY2tncm91bmQtcG9zaXRpb246IGxlZnQgdG9wO1xuICAgIH1cbn1cbiJdfQ== */"] });


/***/ }),

/***/ "W/uP":
/*!************************************************!*\
  !*** ./src/app/svg-icon/svg-icon.component.ts ***!
  \************************************************/
/*! exports provided: SvgIconComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgIconComponent", function() { return SvgIconComponent; });
/* harmony import */ var _icons_path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./icons-path */ "yoPs");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");


const _c0 = ["icon", ""];
class SvgIconComponent {
    constructor(path) {
        this.path = path;
        this.icon = '';
    }
    get href() {
        return `${this.path}/${this.icon}.svg#${this.icon}Icon`;
    }
}
SvgIconComponent.ɵfac = function SvgIconComponent_Factory(t) { return new (t || SvgIconComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_icons_path__WEBPACK_IMPORTED_MODULE_0__["ICONS_PATH"])); };
SvgIconComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: SvgIconComponent, selectors: [["svg", "icon", ""]], inputs: { icon: "icon" }, attrs: _c0, decls: 1, vars: 1, template: function SvgIconComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "use");
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵattribute"]("href", ctx.href);
    } }, styles: ["[_nghost-%COMP%] { fill: transparent; stroke: transparent; }"], changeDetection: 0 });


/***/ }),

/***/ "W0ui":
/*!*********************************************************************************************!*\
  !*** ./src/app/views/profile/edit-profile/edit-profile-side/edit-profile-side.component.ts ***!
  \*********************************************************************************************/
/*! exports provided: EditProfileSideComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditProfileSideComponent", function() { return EditProfileSideComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../svg-icon/svg-icon.component */ "W/uP");



class EditProfileSideComponent {
    constructor() {
        this.onChangeTab = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    activateTab(e, menu) {
        var _a, _b;
        const tabs = Array.from(menu.children);
        const target = e.target;
        if (target.classList.contains('menu'))
            return;
        tabs.forEach(el => el.classList.remove('active'));
        if (!target.classList.contains('tab')) {
            const tab = target.closest('.tab');
            tab.classList.add('active');
            this.onChangeTab.emit((_a = tab.textContent) !== null && _a !== void 0 ? _a : '');
        }
        else {
            target.classList.add('active');
            this.onChangeTab.emit((_b = target.textContent) !== null && _b !== void 0 ? _b : '');
        }
    }
    ngOnInit() { }
}
EditProfileSideComponent.ɵfac = function EditProfileSideComponent_Factory(t) { return new (t || EditProfileSideComponent)(); };
EditProfileSideComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: EditProfileSideComponent, selectors: [["app-edit-profile-side"]], outputs: { onChangeTab: "onChangeTab" }, decls: 12, vars: 0, consts: [[1, "edit-profile-sidebar"], [1, "menu", 3, "click"], ["menu", ""], [1, "tab", "active"], ["icon", "clipboard"], [1, "tab"], ["icon", "security"], ["icon", "additionalInfo"]], template: function EditProfileSideComponent_Template(rf, ctx) { if (rf & 1) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1, 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditProfileSideComponent_Template_div_click_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](2); return ctx.activateTab($event, _r0); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "svg", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, " Personal data ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "svg", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, " Login and security ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "svg", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, " Additional information ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_1__["SvgIconComponent"]], styles: [".user-select-none[_ngcontent-%COMP%] {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.edit-profile-sidebar[_ngcontent-%COMP%] {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.edit-profile-sidebar[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   .tab[_ngcontent-%COMP%] {\n  font-size: 18px;\n  padding: 10px;\n  margin-bottom: 5px;\n  border-radius: 8px;\n  background-color: #fff;\n  cursor: pointer;\n  transition: background-color 0.15s;\n}\n.edit-profile-sidebar[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   .tab[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  stroke: #0981c0;\n  fill: #0981c0;\n  color: #0981c0;\n  vertical-align: text-top;\n  margin-right: 15px;\n}\n.edit-profile-sidebar[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   .tab[_ngcontent-%COMP%]:hover {\n  background-color: rgba(6, 80, 119, 0.1);\n}\n.edit-profile-sidebar[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   .tab[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  stroke: #0871a8;\n  fill: #0871a8;\n  color: #0871a8;\n}\n.edit-profile-sidebar[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   .tab.active[_ngcontent-%COMP%] {\n  background-color: rgba(7, 97, 144, 0.2);\n}\n.edit-profile-sidebar[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   .tab.active[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  stroke: #0871a8;\n  fill: #0871a8;\n  color: #0871a8;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzdHlsZXNcXG1peGluc1xcdGV4dC1taXhpbnMubGVzcyIsImVkaXQtcHJvZmlsZS1zaWRlLmNvbXBvbmVudC5sZXNzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksaUJBQUE7RUFDQSx5QkFBQTtFQUNBLHNCQUFBO0VBQ0EscUJBQUE7QUNDSjtBQUZBO0VERkksaUJBQUE7RUFDQSx5QkFBQTtFQUNBLHNCQUFBO0VBQ0EscUJBQUE7QUNPSjtBQVJBO0VBSVksZUFBQTtFQUVBLGFBQUE7RUFDQSxrQkFBQTtFQUNBLGtCQUFBO0VBRUEsc0JBQUE7RUFDQSxlQUFBO0VBRUEsa0NBQUE7QUFJWjtBQWpCQTtFQWdCZ0IsV0FBQTtFQUNBLFlBQUE7RUFFQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLGNBQUE7RUFFQSx3QkFBQTtFQUVBLGtCQUFBO0FBQ2hCO0FBRVk7RUFDSSx1Q0FBQTtBQUFoQjtBQURZO0VBSVEsZUFBQTtFQUNBLGFBQUE7RUFDQSxjQUFBO0FBQXBCO0FBSVk7RUFDSSx1Q0FBQTtBQUZoQjtBQUNZO0VBSVEsZUFBQTtFQUNBLGFBQUE7RUFDQSxjQUFBO0FBRnBCIiwiZmlsZSI6ImVkaXQtcHJvZmlsZS1zaWRlLmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiLnVzZXItc2VsZWN0LW5vbmUge1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG59XG4iLCJAaW1wb3J0ICdzcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMnO1xuQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvbWl4aW5zL3RleHQtbWl4aW5zJztcblxuLmVkaXQtcHJvZmlsZS1zaWRlYmFyIHtcbiAgICAudXNlci1zZWxlY3Qtbm9uZSgpO1xuICAgIC5tZW51IHtcbiAgICAgICAgLnRhYiB7XG4gICAgICAgICAgICBmb250LXNpemU6IDE4cHg7XG5cbiAgICAgICAgICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiA1cHg7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG5cbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAgICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xNXM7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDI0cHg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAyNHB4O1xuXG4gICAgICAgICAgICAgICAgc3Ryb2tlOiBsaWdodGVuKEBhY3RpdmUsIDUlKTtcbiAgICAgICAgICAgICAgICBmaWxsOiBsaWdodGVuKEBhY3RpdmUsIDUlKTtcbiAgICAgICAgICAgICAgICBjb2xvcjogbGlnaHRlbihAYWN0aXZlLCA1JSk7XG5cbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogdGV4dC10b3A7XG5cbiAgICAgICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDE1cHg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoZGFya2VuKEBhY3RpdmUsIDEwJSksIDAuMSk7XG5cbiAgICAgICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgICAgICBzdHJva2U6IEBhY3RpdmU7XG4gICAgICAgICAgICAgICAgICAgIGZpbGw6IEBhY3RpdmU7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBAYWN0aXZlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJi5hY3RpdmUge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoZGFya2VuKEBhY3RpdmUsIDUlKSwgMC4yKTtcblxuICAgICAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZTogQGFjdGl2ZTtcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogQGFjdGl2ZTtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IEBhY3RpdmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIl19 */"] });


/***/ }),

/***/ "WF+h":
/*!*************************************************************!*\
  !*** ./src/app/views/chat/chat-side/chat-side.component.ts ***!
  \*************************************************************/
/*! exports provided: ChatSideComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatSideComponent", function() { return ChatSideComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");


function ChatSideComponent_div_5_div_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r3.unread.length + 4);
} }
function ChatSideComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "img", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, ChatSideComponent_div_5_div_9_Template, 2, 1, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"]("User Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"]("Last message");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r1.unread.length);
} }
const _c0 = function () { return [1, 2, 3, 4, 5, 6, 7]; };
class ChatSideComponent {
    constructor() {
        this.unread = [1];
        this.activeChat = '';
    }
    activateChat(e, chatList) {
        var _a, _b;
        if (e.target === chatList)
            return;
        const element = e.target.closest('.chat');
        const chats = Array.from(chatList.children);
        chats.forEach(chat => chat.classList.remove('active'));
        element === null || element === void 0 ? void 0 : element.classList.add('active');
        this.activeChat = (_b = (_a = element === null || element === void 0 ? void 0 : element.querySelector('.name')) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : '';
        console.log(this.activeChat);
    }
    ngOnInit() { }
}
ChatSideComponent.ɵfac = function ChatSideComponent_Factory(t) { return new (t || ChatSideComponent)(); };
ChatSideComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ChatSideComponent, selectors: [["app-chat-side"]], decls: 6, vars: 2, consts: [[1, "chat-side"], [1, "title"], [1, "chats", 3, "click"], ["chats", ""], ["class", "chat", 4, "ngFor", "ngForOf"], [1, "chat"], [1, "user"], [1, "avatar-box"], ["src", "assets/img/avatar-man.png", "alt", "avatar"], [1, "info"], [1, "name"], [1, "last-message"], ["class", "unread", 4, "ngIf"], [1, "unread"]], template: function ChatSideComponent_Template(rf, ctx) { if (rf & 1) {
        const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Chats");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2, 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ChatSideComponent_Template_div_click_3_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](4); return ctx.activateChat($event, _r0); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, ChatSideComponent_div_5_Template, 10, 3, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgForOf"], _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"]], styles: [".user-select-none[_ngcontent-%COMP%] {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.light-thin-scrollbar[_ngcontent-%COMP%] {\n  \n}\n.light-thin-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 5px;\n  \n  background-color: white;\n}\n.light-thin-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background-color: #c1c1c1;\n  border-radius: 20px;\n}\n.chat-side[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n}\n.chat-side[_ngcontent-%COMP%]   .chats[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  max-height: 500px;\n  overflow: auto;\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  \n}\n.chat-side[_ngcontent-%COMP%]   .chats[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 5px;\n  \n  background-color: white;\n}\n.chat-side[_ngcontent-%COMP%]   .chats[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background-color: #c1c1c1;\n  border-radius: 20px;\n}\n.chat-side[_ngcontent-%COMP%]   .chats[_ngcontent-%COMP%]   .chat[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  height: 80px;\n  padding-left: 20px;\n  padding-right: 30px;\n  cursor: pointer;\n}\n.chat-side[_ngcontent-%COMP%]   .chats[_ngcontent-%COMP%]   .chat[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%] {\n  display: flex;\n}\n.chat-side[_ngcontent-%COMP%]   .chats[_ngcontent-%COMP%]   .chat[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .avatar-box[_ngcontent-%COMP%] {\n  width: 52px;\n  height: 52px;\n}\n.chat-side[_ngcontent-%COMP%]   .chats[_ngcontent-%COMP%]   .chat[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n}\n.chat-side[_ngcontent-%COMP%]   .chats[_ngcontent-%COMP%]   .chat[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .last-message[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.chat-side[_ngcontent-%COMP%]   .chats[_ngcontent-%COMP%]   .chat[_ngcontent-%COMP%]   .unread[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  text-align: center;\n  font-size: 12px;\n  background-color: #0871a8;\n  color: white;\n  padding-left: 1px;\n  border-radius: 50%;\n}\n.chat-side[_ngcontent-%COMP%]   .chats[_ngcontent-%COMP%]   .chat.active[_ngcontent-%COMP%] {\n  border-left: 10px solid #0871a8;\n}\n.chat-side[_ngcontent-%COMP%]   .chats[_ngcontent-%COMP%]   .chat.active[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%] {\n  opacity: 0.6;\n}\n.chat-side[_ngcontent-%COMP%]   .chats[_ngcontent-%COMP%]   .chat.active[_ngcontent-%COMP%]   .unread[_ngcontent-%COMP%] {\n  display: none;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHN0eWxlc1xcbWl4aW5zXFx0ZXh0LW1peGlucy5sZXNzIiwiY2hhdC1zaWRlLmNvbXBvbmVudC5sZXNzIiwiLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc3R5bGVzXFxtaXhpbnNcXHNjcm9sbGJhci1taXhpbnMubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGlCQUFBO0VBQ0EseUJBQUE7RUFDQSxzQkFBQTtFQUNBLHFCQUFBO0FDQ0o7QUNMQTtFRE9FLHdCQUF3QjtBQUMxQjtBQ1BJO0VBQ0ksVUFBQTtFRFNOLHFDQUFxQztFQ1IvQix1QkFBQTtBRFVSO0FDTkk7RUFDSSx5QkFBQTtFQUNBLG1CQUFBO0FEUVI7QUFiQTtFQUVRLGVBQUE7RUFDQSxnQkFBQTtBQWNSO0FBakJBO0VBT1EsZ0JBQUE7RUFDQSxpQkFBQTtFQUVBLGNBQUE7RURiSixpQkFBQTtFQUNBLHlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxxQkFBQTtFQzBCRix3QkFBd0I7QUFDMUI7QUM5Qkk7RUFDSSxVQUFBO0VEZ0NOLHFDQUFxQztFQy9CL0IsdUJBQUE7QURpQ1I7QUM3Qkk7RUFDSSx5QkFBQTtFQUNBLG1CQUFBO0FEK0JSO0FBcENBO0VBZ0JZLGFBQUE7RUFDQSw4QkFBQTtFQUNBLG1CQUFBO0VBRUEsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsbUJBQUE7RUFFQSxlQUFBO0FBcUJaO0FBN0NBO0VBMkJnQixhQUFBO0FBcUJoQjtBQWhEQTtFQTZCb0IsV0FBQTtFQUNBLFlBQUE7QUFzQnBCO0FBcERBO0VBbUN3QixlQUFBO0VBQ0EsZ0JBQUE7QUFvQnhCO0FBeERBO0VBdUN3QixlQUFBO0FBb0J4QjtBQTNEQTtFQTZDZ0IsV0FBQTtFQUNBLFlBQUE7RUFFQSxrQkFBQTtFQUNBLGVBQUE7RUFFQSx5QkFBQTtFQUNBLFlBQUE7RUFFQSxpQkFBQTtFQUVBLGtCQUFBO0FBYWhCO0FBVlk7RUFDSSwrQkFBQTtBQVloQjtBQWJZO0VBR1EsWUFBQTtBQWFwQjtBQWhCWTtFQU1RLGFBQUE7QUFhcEIiLCJmaWxlIjoiY2hhdC1zaWRlLmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiLnVzZXItc2VsZWN0LW5vbmUge1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG59XG4iLCJAaW1wb3J0ICdzcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMnO1xuQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvbWl4aW5zL3RleHQtbWl4aW5zJztcbkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL21peGlucy9zY3JvbGxiYXItbWl4aW5zJztcblxuLmNoYXQtc2lkZSB7XG4gICAgLnRpdGxlIHtcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgIH1cblxuICAgIC5jaGF0cyB7XG4gICAgICAgIG1hcmdpbi10b3A6IDIwcHg7XG4gICAgICAgIG1heC1oZWlnaHQ6IDUwMHB4O1xuXG4gICAgICAgIG92ZXJmbG93OiBhdXRvO1xuXG4gICAgICAgIC51c2VyLXNlbGVjdC1ub25lKCk7XG4gICAgICAgIC5saWdodC10aGluLXNjcm9sbGJhcigpO1xuXG4gICAgICAgIC5jaGF0IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgICAgICBoZWlnaHQ6IDgwcHg7XG4gICAgICAgICAgICBwYWRkaW5nLWxlZnQ6IDIwcHg7XG4gICAgICAgICAgICBwYWRkaW5nLXJpZ2h0OiAzMHB4O1xuXG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAgICAgICAgIC51c2VyIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIC5hdmF0YXItYm94IHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDUycHg7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogNTJweDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAuaW5mbyB7XG4gICAgICAgICAgICAgICAgICAgIC5uYW1lIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLmxhc3QtbWVzc2FnZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC51bnJlYWQge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAxOHB4O1xuICAgICAgICAgICAgICAgIGhlaWdodDogMThweDtcblxuICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDEycHg7XG5cbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBAYWN0aXZlO1xuICAgICAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcblxuICAgICAgICAgICAgICAgIHBhZGRpbmctbGVmdDogMXB4O1xuXG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmLmFjdGl2ZSB7XG4gICAgICAgICAgICAgICAgYm9yZGVyLWxlZnQ6IDEwcHggc29saWQgQGFjdGl2ZTtcbiAgICAgICAgICAgICAgICAudXNlciB7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLnVucmVhZCB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLmxpZ2h0LXRoaW4tc2Nyb2xsYmFyIHtcbiAgICAmOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgICAgIHdpZHRoOiA1cHg7IC8qINGI0LjRgNC40L3QsCDQtNC70Y8g0LLQtdGA0YLQuNC60LDQu9GM0L3QvtCz0L4g0YHQutGA0L7Qu9C70LAgKi9cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gICAgfVxuXG4gICAgLyog0L/QvtC70LfRg9C90L7QuiDRgdC60YDQvtC70LvQsdCw0YDQsCAqL1xuICAgICY6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRlbihAbGlnaHQsIDMwJSk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XG4gICAgfVxufVxuIl19 */"] });


/***/ }),

/***/ "YBVe":
/*!*********************************************!*\
  !*** ./src/app/store/posts/post.actions.ts ***!
  \*********************************************/
/*! exports provided: POST_CREATE_ACTION_TYPE, POST_CREATE_SUCCESS_ACTION_TYPE, POST_CREATE_FAILED_ACTION_TYPE, POST_EDIT_ACTION_TYPE, POST_EDIT_SUCCESS_ACTION_TYPE, POST_EDIT_FAILED_ACTION_TYPE, POST_GET_ACTION_TYPE, POST_GET_SUCCESS_ACTION_TYPE, POST_GET_FAILED_ACTION_TYPE, POST_REMOVE_ACTION_TYPE, POST_REMOVE_SUCCESS_ACTION_TYPE, POST_REMOVE_FAILED_ACTION_TYPE, POST_LIKE_ACTION_TYPE, POST_LIKE_SUCCESS_ACTION_TYPE, POST_LIKE_FAILED_ACTION_TYPE, POST_DONT_LIKE_ACTION_TYPE, POST_DONT_LIKE_SUCCESS_ACTION_TYPE, POST_DONT_LIKE_FAILED_ACTION_TYPE, COMMENT_CREATE_ACTION_TYPE, COMMENT_CREATE_SUCCESS_ACTION_TYPE, COMMENT_CREATE_FAILED_ACTION_TYPE, COMMENT_EDIT_ACTION_TYPE, COMMENT_EDIT_SUCCESS_ACTION_TYPE, COMMENT_EDIT_FAILED_ACTION_TYPE, COMMENT_GET_ACTION_TYPE, COMMENT_GET_SUCCESS_ACTION_TYPE, COMMENT_GET_FAILED_ACTION_TYPE, COMMENT_REMOVE_ACTION_TYPE, COMMENT_REMOVE_SUCCESS_ACTION_TYPE, COMMENT_REMOVE_FAILED_ACTION_TYPE, COMMENT_LIKE_ACTION_TYPE, COMMENT_LIKE_SUCCESS_ACTION_TYPE, COMMENT_LIKE_FAILED_ACTION_TYPE, COMMENT_DONT_LIKE_ACTION_TYPE, COMMENT_DONT_LIKE_SUCCESS_ACTION_TYPE, COMMENT_DONT_LIKE_FAILED_ACTION_TYPE, POST_COMMENTS_OPEN_ACTION_TYPE, POST_COMMENTS_CLOSE_ACTION_TYPE, PostCreateAction, PostCreateSuccessAction, PostCreateFailedAction, PostEditAction, PostEditSuccessAction, PostEditFailedAction, PostGetAction, PostGetSuccessAction, PostGetFailedAction, PostRemoveAction, PostRemoveSuccessAction, PostRemoveFailedAction, PostLikeAction, PostLikeSuccessAction, PostLikeFailedAction, PostDontLikeAction, PostDontLikeSuccessAction, PostDontLikeFailedAction, PostCommentsOpenAction, PostCommentsCloseAction, CommentCreateAction, CommentCreateSuccessAction, CommentCreateFailedAction, CommentEditAction, CommentEditSuccessAction, CommentEditFailedAction, CommentGetAction, CommentGetSuccessAction, CommentGetFailedAction, CommentRemoveAction, CommentRemoveSuccessAction, CommentRemoveFailedAction, CommentLikeAction, CommentLikeSuccessAction, CommentLikeFailedAction, CommentDontLikeAction, CommentDontLikeSuccessAction, CommentDontLikeFailedAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_CREATE_ACTION_TYPE", function() { return POST_CREATE_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_CREATE_SUCCESS_ACTION_TYPE", function() { return POST_CREATE_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_CREATE_FAILED_ACTION_TYPE", function() { return POST_CREATE_FAILED_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_EDIT_ACTION_TYPE", function() { return POST_EDIT_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_EDIT_SUCCESS_ACTION_TYPE", function() { return POST_EDIT_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_EDIT_FAILED_ACTION_TYPE", function() { return POST_EDIT_FAILED_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_GET_ACTION_TYPE", function() { return POST_GET_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_GET_SUCCESS_ACTION_TYPE", function() { return POST_GET_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_GET_FAILED_ACTION_TYPE", function() { return POST_GET_FAILED_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_REMOVE_ACTION_TYPE", function() { return POST_REMOVE_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_REMOVE_SUCCESS_ACTION_TYPE", function() { return POST_REMOVE_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_REMOVE_FAILED_ACTION_TYPE", function() { return POST_REMOVE_FAILED_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_LIKE_ACTION_TYPE", function() { return POST_LIKE_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_LIKE_SUCCESS_ACTION_TYPE", function() { return POST_LIKE_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_LIKE_FAILED_ACTION_TYPE", function() { return POST_LIKE_FAILED_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_DONT_LIKE_ACTION_TYPE", function() { return POST_DONT_LIKE_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_DONT_LIKE_SUCCESS_ACTION_TYPE", function() { return POST_DONT_LIKE_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_DONT_LIKE_FAILED_ACTION_TYPE", function() { return POST_DONT_LIKE_FAILED_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_CREATE_ACTION_TYPE", function() { return COMMENT_CREATE_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_CREATE_SUCCESS_ACTION_TYPE", function() { return COMMENT_CREATE_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_CREATE_FAILED_ACTION_TYPE", function() { return COMMENT_CREATE_FAILED_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_EDIT_ACTION_TYPE", function() { return COMMENT_EDIT_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_EDIT_SUCCESS_ACTION_TYPE", function() { return COMMENT_EDIT_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_EDIT_FAILED_ACTION_TYPE", function() { return COMMENT_EDIT_FAILED_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_GET_ACTION_TYPE", function() { return COMMENT_GET_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_GET_SUCCESS_ACTION_TYPE", function() { return COMMENT_GET_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_GET_FAILED_ACTION_TYPE", function() { return COMMENT_GET_FAILED_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_REMOVE_ACTION_TYPE", function() { return COMMENT_REMOVE_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_REMOVE_SUCCESS_ACTION_TYPE", function() { return COMMENT_REMOVE_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_REMOVE_FAILED_ACTION_TYPE", function() { return COMMENT_REMOVE_FAILED_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_LIKE_ACTION_TYPE", function() { return COMMENT_LIKE_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_LIKE_SUCCESS_ACTION_TYPE", function() { return COMMENT_LIKE_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_LIKE_FAILED_ACTION_TYPE", function() { return COMMENT_LIKE_FAILED_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_DONT_LIKE_ACTION_TYPE", function() { return COMMENT_DONT_LIKE_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_DONT_LIKE_SUCCESS_ACTION_TYPE", function() { return COMMENT_DONT_LIKE_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_DONT_LIKE_FAILED_ACTION_TYPE", function() { return COMMENT_DONT_LIKE_FAILED_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_COMMENTS_OPEN_ACTION_TYPE", function() { return POST_COMMENTS_OPEN_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POST_COMMENTS_CLOSE_ACTION_TYPE", function() { return POST_COMMENTS_CLOSE_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostCreateAction", function() { return PostCreateAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostCreateSuccessAction", function() { return PostCreateSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostCreateFailedAction", function() { return PostCreateFailedAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostEditAction", function() { return PostEditAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostEditSuccessAction", function() { return PostEditSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostEditFailedAction", function() { return PostEditFailedAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostGetAction", function() { return PostGetAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostGetSuccessAction", function() { return PostGetSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostGetFailedAction", function() { return PostGetFailedAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostRemoveAction", function() { return PostRemoveAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostRemoveSuccessAction", function() { return PostRemoveSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostRemoveFailedAction", function() { return PostRemoveFailedAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostLikeAction", function() { return PostLikeAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostLikeSuccessAction", function() { return PostLikeSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostLikeFailedAction", function() { return PostLikeFailedAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostDontLikeAction", function() { return PostDontLikeAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostDontLikeSuccessAction", function() { return PostDontLikeSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostDontLikeFailedAction", function() { return PostDontLikeFailedAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostCommentsOpenAction", function() { return PostCommentsOpenAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostCommentsCloseAction", function() { return PostCommentsCloseAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentCreateAction", function() { return CommentCreateAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentCreateSuccessAction", function() { return CommentCreateSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentCreateFailedAction", function() { return CommentCreateFailedAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentEditAction", function() { return CommentEditAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentEditSuccessAction", function() { return CommentEditSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentEditFailedAction", function() { return CommentEditFailedAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentGetAction", function() { return CommentGetAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentGetSuccessAction", function() { return CommentGetSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentGetFailedAction", function() { return CommentGetFailedAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentRemoveAction", function() { return CommentRemoveAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentRemoveSuccessAction", function() { return CommentRemoveSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentRemoveFailedAction", function() { return CommentRemoveFailedAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentLikeAction", function() { return CommentLikeAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentLikeSuccessAction", function() { return CommentLikeSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentLikeFailedAction", function() { return CommentLikeFailedAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentDontLikeAction", function() { return CommentDontLikeAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentDontLikeSuccessAction", function() { return CommentDontLikeSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentDontLikeFailedAction", function() { return CommentDontLikeFailedAction; });
/* TYPES */
/* POSTS TYPES */
const POST_CREATE_ACTION_TYPE = '[POST] Create';
const POST_CREATE_SUCCESS_ACTION_TYPE = '[POST] Create success';
const POST_CREATE_FAILED_ACTION_TYPE = '[POST] Create failed';
const POST_EDIT_ACTION_TYPE = '[POST] Edit';
const POST_EDIT_SUCCESS_ACTION_TYPE = '[POST] Edit success';
const POST_EDIT_FAILED_ACTION_TYPE = '[POST] Edit failed';
const POST_GET_ACTION_TYPE = '[POST] Get';
const POST_GET_SUCCESS_ACTION_TYPE = '[POST] Get success';
const POST_GET_FAILED_ACTION_TYPE = '[POST] Get failed';
const POST_REMOVE_ACTION_TYPE = '[POST] Remove';
const POST_REMOVE_SUCCESS_ACTION_TYPE = '[POST] Remove success';
const POST_REMOVE_FAILED_ACTION_TYPE = '[POST] Remove failed';
const POST_LIKE_ACTION_TYPE = '[POST] Like';
const POST_LIKE_SUCCESS_ACTION_TYPE = '[POST] Like success';
const POST_LIKE_FAILED_ACTION_TYPE = '[POST] Like failed';
const POST_DONT_LIKE_ACTION_TYPE = '[POST] Dont like';
const POST_DONT_LIKE_SUCCESS_ACTION_TYPE = '[POST] Dont like success';
const POST_DONT_LIKE_FAILED_ACTION_TYPE = '[POST] Dont like failed';
/* COMMENTS TYPES */
const COMMENT_CREATE_ACTION_TYPE = '[COMMENT] Create';
const COMMENT_CREATE_SUCCESS_ACTION_TYPE = '[COMMENT] Create success';
const COMMENT_CREATE_FAILED_ACTION_TYPE = '[COMMENT] Create failed';
const COMMENT_EDIT_ACTION_TYPE = '[COMMENT] Edit';
const COMMENT_EDIT_SUCCESS_ACTION_TYPE = '[COMMENT] Edit success';
const COMMENT_EDIT_FAILED_ACTION_TYPE = '[COMMENT] Edit failed';
const COMMENT_GET_ACTION_TYPE = '[COMMENT] Get';
const COMMENT_GET_SUCCESS_ACTION_TYPE = '[COMMENT] Get success';
const COMMENT_GET_FAILED_ACTION_TYPE = '[COMMENT] Get failed';
const COMMENT_REMOVE_ACTION_TYPE = '[COMMENT] Remove';
const COMMENT_REMOVE_SUCCESS_ACTION_TYPE = '[COMMENT] Remove success';
const COMMENT_REMOVE_FAILED_ACTION_TYPE = '[COMMENT] Remove failed';
const COMMENT_LIKE_ACTION_TYPE = '[COMMENT] Like';
const COMMENT_LIKE_SUCCESS_ACTION_TYPE = '[COMMENT] Like success';
const COMMENT_LIKE_FAILED_ACTION_TYPE = '[COMMENT] Like failed';
const COMMENT_DONT_LIKE_ACTION_TYPE = '[COMMENT] Dont like';
const COMMENT_DONT_LIKE_SUCCESS_ACTION_TYPE = '[COMMENT] Dont like success';
const COMMENT_DONT_LIKE_FAILED_ACTION_TYPE = '[COMMENT] Dont like failed';
const POST_COMMENTS_OPEN_ACTION_TYPE = '[POST] Comments open';
const POST_COMMENTS_CLOSE_ACTION_TYPE = '[POST] Comments close';
/* POSTS */
class PostCreateAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_CREATE_ACTION_TYPE;
    }
}
class PostCreateSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_CREATE_SUCCESS_ACTION_TYPE;
    }
}
class PostCreateFailedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_CREATE_FAILED_ACTION_TYPE;
    }
}
class PostEditAction {
    constructor() {
        this.type = POST_EDIT_ACTION_TYPE;
    }
}
class PostEditSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_EDIT_SUCCESS_ACTION_TYPE;
    }
}
class PostEditFailedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_EDIT_FAILED_ACTION_TYPE;
    }
}
class PostGetAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_GET_ACTION_TYPE;
    }
}
class PostGetSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_GET_SUCCESS_ACTION_TYPE;
    }
}
class PostGetFailedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_GET_FAILED_ACTION_TYPE;
    }
}
class PostRemoveAction {
    constructor() {
        this.type = POST_REMOVE_ACTION_TYPE;
    }
}
class PostRemoveSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_REMOVE_SUCCESS_ACTION_TYPE;
    }
}
class PostRemoveFailedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_REMOVE_FAILED_ACTION_TYPE;
    }
}
class PostLikeAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_LIKE_ACTION_TYPE;
    }
}
class PostLikeSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_LIKE_SUCCESS_ACTION_TYPE;
    }
}
class PostLikeFailedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_LIKE_FAILED_ACTION_TYPE;
    }
}
class PostDontLikeAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_DONT_LIKE_ACTION_TYPE;
    }
}
class PostDontLikeSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_DONT_LIKE_SUCCESS_ACTION_TYPE;
    }
}
class PostDontLikeFailedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_DONT_LIKE_FAILED_ACTION_TYPE;
    }
}
class PostCommentsOpenAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_COMMENTS_OPEN_ACTION_TYPE;
    }
}
class PostCommentsCloseAction {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_COMMENTS_CLOSE_ACTION_TYPE;
    }
}
/* COMMENTS */
class CommentCreateAction {
    constructor(payload) {
        this.payload = payload;
        this.type = COMMENT_CREATE_ACTION_TYPE;
    }
}
class CommentCreateSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = COMMENT_CREATE_SUCCESS_ACTION_TYPE;
    }
}
class CommentCreateFailedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = COMMENT_CREATE_FAILED_ACTION_TYPE;
    }
}
class CommentEditAction {
    constructor() {
        this.type = COMMENT_EDIT_ACTION_TYPE;
    }
}
class CommentEditSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = COMMENT_EDIT_SUCCESS_ACTION_TYPE;
    }
}
class CommentEditFailedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = COMMENT_EDIT_FAILED_ACTION_TYPE;
    }
}
class CommentGetAction {
    constructor(payload) {
        this.type = COMMENT_GET_ACTION_TYPE;
    }
}
class CommentGetSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = COMMENT_GET_SUCCESS_ACTION_TYPE;
    }
}
class CommentGetFailedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = COMMENT_GET_FAILED_ACTION_TYPE;
    }
}
class CommentRemoveAction {
    constructor() {
        this.type = COMMENT_REMOVE_ACTION_TYPE;
    }
}
class CommentRemoveSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = COMMENT_REMOVE_SUCCESS_ACTION_TYPE;
    }
}
class CommentRemoveFailedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = COMMENT_REMOVE_FAILED_ACTION_TYPE;
    }
}
class CommentLikeAction {
    constructor() {
        this.type = COMMENT_LIKE_ACTION_TYPE;
    }
}
class CommentLikeSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = COMMENT_LIKE_SUCCESS_ACTION_TYPE;
    }
}
class CommentLikeFailedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = COMMENT_LIKE_FAILED_ACTION_TYPE;
    }
}
class CommentDontLikeAction {
    constructor() {
        this.type = COMMENT_DONT_LIKE_ACTION_TYPE;
    }
}
class CommentDontLikeSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = COMMENT_DONT_LIKE_SUCCESS_ACTION_TYPE;
    }
}
class CommentDontLikeFailedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = COMMENT_DONT_LIKE_FAILED_ACTION_TYPE;
    }
}


/***/ }),

/***/ "YZbJ":
/*!********************************!*\
  !*** ./src/app/store/index.ts ***!
  \********************************/
/*! exports provided: reducers, metaReducers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reducers", function() { return reducers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "metaReducers", function() { return metaReducers; });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../environments/environment */ "AytR");
/* harmony import */ var _auth_auth_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth/auth.reducer */ "pja6");
/* harmony import */ var _posts_post_reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./posts/post.reducer */ "wEiL");
/* harmony import */ var _my_profile_my_profile_reducer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./my-profile/my-profile.reducer */ "i2O+");
/* harmony import */ var _profile_profile_reducer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./profile/profile.reducer */ "O8+U");





const reducers = {
    [_auth_auth_reducer__WEBPACK_IMPORTED_MODULE_1__["authNode"]]: _auth_auth_reducer__WEBPACK_IMPORTED_MODULE_1__["authReducer"],
    // @ts-ignore
    [_posts_post_reducer__WEBPACK_IMPORTED_MODULE_2__["postNode"]]: _posts_post_reducer__WEBPACK_IMPORTED_MODULE_2__["postReducer"],
    // @ts-ignore
    [_my_profile_my_profile_reducer__WEBPACK_IMPORTED_MODULE_3__["myProfileNode"]]: _my_profile_my_profile_reducer__WEBPACK_IMPORTED_MODULE_3__["myProfileReducer"],
    [_profile_profile_reducer__WEBPACK_IMPORTED_MODULE_4__["profileNode"]]: _profile_profile_reducer__WEBPACK_IMPORTED_MODULE_4__["profileReducer"],
};
const metaReducers = !_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].production
    ? []
    : [];


/***/ }),

/***/ "YzH7":
/*!***************************************************!*\
  !*** ./src/app/components/post/post.component.ts ***!
  \***************************************************/
/*! exports provided: PostComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostComponent", function() { return PostComponent; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _store_posts_post_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../store/posts/post.actions */ "YBVe");
/* harmony import */ var _store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../store/my-profile/my-profile.selectors */ "0jmn");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _views_feed_feed_main_feed_main_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../views/feed/feed-main/feed-main.component */ "+PC+");
/* harmony import */ var _services_posts_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/posts.service */ "jwUf");
/* harmony import */ var _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../svg-icon/svg-icon.component */ "W/uP");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "ofXK");










function PostComponent_div_33_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "img", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "span", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](6, "span", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "span", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](10, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](11, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](13, "svg", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const comment_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("src", comment_r4.creator.avatar, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](comment_r4.creator.fullName);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("innerHTML", comment_r4.content, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsanitizeHtml"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", !!comment_r4.dateOfLastModify ? _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind2"](10, 5, comment_r4.dateOfLastModify, "medium") + "(edited)" : _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind2"](11, 8, comment_r4.dateOfCreation, "medium"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", comment_r4.likes.length, " ");
} }
function PostComponent_div_33_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, PostComponent_div_33_div_1_Template, 15, 11, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r1.postInfo.comments);
} }
class PostComponent {
    constructor(feedMainComponent, store$, postsService) {
        this.feedMainComponent = feedMainComponent;
        this.store$ = store$;
        this.postsService = postsService;
        this.postInfo = {
            attached: {},
            content: '',
            creator: {
                id: 0,
                fullName: '',
                profession: '',
                avatar: '',
            },
            dateOfCreation: 0,
            id: 0,
            likes: [],
            comments: [],
            commentsOpen: false,
        };
        this.content = '';
        this.profile = {
            id: 0,
            fullName: '',
            profession: '',
            avatar: null,
        };
        this.likes = this.postInfo.likes;
        this.liked = false;
    }
    createComment(textarea) {
        this.store$.dispatch(new _store_posts_post_actions__WEBPACK_IMPORTED_MODULE_1__["CommentCreateAction"]({
            postId: this.postInfo.id,
            commentInfo: {
                creator: this.profile,
                content: textarea.value.replace(/\n/g, '<br>'),
                dateOfCreation: Date.now(),
            },
        }));
    }
    likePost(like) {
        if (!this.liked) {
            like.classList.add('waiting');
            this.store$.dispatch(new _store_posts_post_actions__WEBPACK_IMPORTED_MODULE_1__["PostLikeAction"]({
                postId: this.postInfo.id,
                userId: this.profile.id,
            }));
            // like.classList.remove('waiting')
        }
        else {
            like.classList.add('waiting');
            this.store$.dispatch(new _store_posts_post_actions__WEBPACK_IMPORTED_MODULE_1__["PostDontLikeAction"]({
                postId: this.postInfo.id,
                userId: this.profile.id,
            }));
        }
    }
    openCloseComments() {
        if (!this.postInfo.commentsOpen)
            this.store$.dispatch(new _store_posts_post_actions__WEBPACK_IMPORTED_MODULE_1__["PostCommentsOpenAction"]({ postId: this.postInfo.id }));
        if (this.postInfo.commentsOpen)
            this.store$.dispatch(new _store_posts_post_actions__WEBPACK_IMPORTED_MODULE_1__["PostCommentsCloseAction"]({ postId: this.postInfo.id }));
    }
    likeComment() { }
    textareaResize(e) {
        this.feedMainComponent.textareaResize(e);
    }
    ngOnInit() {
        console.log(this.postInfo);
        this.content = this.postInfo.content.replace(/\n/g, '<br>');
        this.likes = this.postInfo.likes;
        this.store$
            .pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileSelector"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(profile => {
            var _a, _b;
            return {
                id: profile.id,
                fullName: `${profile.firstName} ${profile.lastName}`,
                profession: profile.info.profession,
                avatar: (_b = (_a = profile.info.avatar) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : '../../../../assets/img/avatar-man.png',
            };
        }))
            .subscribe(creator => (this.profile = creator));
        this.liked = !!this.likes.find(like => like.userId === this.profile.id);
        console.log('likes', this.likes);
        console.log('liked', this.liked);
    }
}
PostComponent.ɵfac = function PostComponent_Factory(t) { return new (t || PostComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_views_feed_feed_main_feed_main_component__WEBPACK_IMPORTED_MODULE_5__["FeedMainComponent"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["Store"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_posts_service__WEBPACK_IMPORTED_MODULE_6__["PostsService"])); };
PostComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({ type: PostComponent, selectors: [["app-post"]], inputs: { postInfo: "postInfo" }, decls: 39, vars: 18, consts: [[1, "post"], [1, "post__header"], [1, "other"], ["icon", "other"], [1, "other-list", "hidden"], [1, "post__body"], [1, "creator"], [1, "avatar-box"], ["alt", "avatar", 1, "avatar", 3, "src"], [1, "description"], [1, "name"], [1, "profession"], [1, "date"], [1, "content", 3, "innerHTML"], [1, "post__footer"], [1, "left-side"], [1, "like", 3, "click"], ["like", ""], ["icon", "like"], [1, "comment", 3, "click"], ["icon", "comment", 1, "comment"], [1, "share"], ["icon", "share"], [1, "comments-wrapper"], ["class", "comments", 4, "ngIf"], [1, "new-comment"], ["rows", "1", "contenteditable", "true", "onblur", "this.value = this.value.trim()", "placeholder", "Add a public comment...", 3, "input"], ["commentInput", ""], [1, "btn-comment", 3, "click"], ["icon", "send", 1, "send"], [1, "comments"], ["class", "comment", 4, "ngFor", "ngForOf"], [1, "comment"], [1, "content"], [1, "text", 3, "innerHTML"], [1, "another"], [1, "like"]], template: function PostComponent_Template(rf, ctx) { if (rf & 1) {
        const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "svg", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](9, "img", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "span", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "span", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](17, "date");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](18, "date");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](19, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](21, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](22, "span", 16, 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function PostComponent_Template_span_click_22_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r5); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](23); return ctx.likePost(_r0); });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](24, "svg", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](25);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](26, "span", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function PostComponent_Template_span_click_26_listener() { return ctx.openCloseComments(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](27, "svg", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](28);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](29, "span", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](30, "svg", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](31, " Share ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](32, "div", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](33, PostComponent_div_33_Template, 2, 1, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](34, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](35, "textarea", 26, 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("input", function PostComponent_Template_textarea_input_35_listener($event) { return ctx.textareaResize($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](37, "button", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function PostComponent_Template_button_click_37_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r5); const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](36); return ctx.createComment(_r2); });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](38, "svg", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("src", ctx.postInfo.creator.avatar || "assets/img/avatar-man.png", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx.postInfo.creator.fullName);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx.postInfo.creator.profession);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", !!ctx.postInfo.dateOfLastModify ? _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind2"](17, 12, ctx.postInfo.dateOfLastModify, "medium") + "(edited)" : _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind2"](18, 15, ctx.postInfo.dateOfCreation, "medium"), " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("innerHTML", ctx.content, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsanitizeHtml"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("liked", ctx.liked);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx.likes.length, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx.postInfo.comments ? ctx.postInfo.comments.length : 0, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("open", ctx.postInfo.commentsOpen);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.postInfo.comments);
    } }, directives: [_svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_7__["SvgIconComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgForOf"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_8__["DatePipe"]], styles: [".user-select-none[_ngcontent-%COMP%] {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.post[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: 30px;\n  display: flex;\n  flex-direction: column;\n}\n.post__header[_ngcontent-%COMP%] {\n  padding: 15px;\n  height: 45px;\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n}\n.post__header[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  margin-top: 5px;\n  width: 24px;\n  height: 24px;\n  cursor: pointer;\n  stroke: #181818;\n}\n.post__body[_ngcontent-%COMP%] {\n  padding: 15px 30px;\n}\n.post__body[_ngcontent-%COMP%]   .creator[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 15px;\n}\n.post__body[_ngcontent-%COMP%]   .creator[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: flex;\n}\n.post__body[_ngcontent-%COMP%]   .creator[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   .avatar-box[_ngcontent-%COMP%] {\n  display: block;\n}\n.post__body[_ngcontent-%COMP%]   .creator[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.post__body[_ngcontent-%COMP%]   .creator[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 16px;\n}\n.post__body[_ngcontent-%COMP%]   .creator[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .profession[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.post__body[_ngcontent-%COMP%]   .date[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 500;\n  align-self: flex-start;\n  justify-self: flex-end;\n  color: #747474;\n}\n.post__body[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%] {\n  font-size: 18px;\n}\n.post__footer[_ngcontent-%COMP%] {\n  padding: 15px 30px;\n  height: 50px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  text-transform: uppercase;\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.post__footer[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%] {\n  width: 50%;\n  max-width: 140px;\n  display: flex;\n  justify-content: space-between;\n}\n.post__footer[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.post__footer[_ngcontent-%COMP%]   .share[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.post__footer[_ngcontent-%COMP%]   .share[_ngcontent-%COMP%]:hover {\n  color: #0871a8;\n}\n.post__footer[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  vertical-align: middle;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%] {\n  display: none;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .comments[_ngcontent-%COMP%] {\n  margin-top: 15px;\n  padding: 0 15px;\n  max-height: 0;\n  overflow: hidden;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .comments[_ngcontent-%COMP%]   .comment[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  padding: 0 15px 10px 30px;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .comments[_ngcontent-%COMP%]   .comment[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  font-size: 16px;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .comments[_ngcontent-%COMP%]   .comment[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .comments[_ngcontent-%COMP%]   .comment[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .another[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .comments[_ngcontent-%COMP%]   .comment[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .another[_ngcontent-%COMP%]   .date[_ngcontent-%COMP%] {\n  color: #747474;\n  font-size: 12px;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .comments[_ngcontent-%COMP%]   .comment[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .another[_ngcontent-%COMP%]   .like[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .comments[_ngcontent-%COMP%]   .comment[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .another[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  vertical-align: middle;\n  width: 14px;\n  height: 14px;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .comments[_ngcontent-%COMP%]   .comment[_ngcontent-%COMP%]:nth-child(n + 2)   .avatar-box[_ngcontent-%COMP%] {\n  margin-top: 10px;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .comments[_ngcontent-%COMP%]   .comment[_ngcontent-%COMP%]:nth-child(n + 2)   .content[_ngcontent-%COMP%] {\n  padding-top: 10px;\n  border-top: 1px solid #ccc;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .new-comment[_ngcontent-%COMP%] {\n  margin: 20px;\n  padding: 0 15px 10px 30px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .new-comment[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  width: 70%;\n  border: none;\n  outline: none;\n  resize: none;\n  overflow: hidden;\n  font-family: inherit;\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 25px;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .new-comment[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]::-webkit-input-placeholder {\n  color: rgba(24, 24, 24, 0.22);\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .new-comment[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]::-moz-placeholder {\n  color: rgba(24, 24, 24, 0.22);\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .new-comment[_ngcontent-%COMP%]   .btn-comment[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  border-radius: 4px;\n  border: 0;\n  outline: 0;\n  background-color: #0871a8;\n  cursor: pointer;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper[_ngcontent-%COMP%]   .new-comment[_ngcontent-%COMP%]   .btn-comment[_ngcontent-%COMP%]   .send[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  vertical-align: middle;\n  margin-left: 4px;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper.open[_ngcontent-%COMP%] {\n  display: block;\n}\n.post[_ngcontent-%COMP%]   .comments-wrapper.open[_ngcontent-%COMP%]   .comments[_ngcontent-%COMP%] {\n  max-height: none;\n}\nsvg[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  margin-right: 0.2rem;\n}\n.avatar-box[_ngcontent-%COMP%] {\n  display: block;\n  width: 52px;\n  height: 52px;\n  margin-right: 15px;\n  border-radius: 50%;\n  overflow: hidden;\n}\n.avatar-box[_ngcontent-%COMP%]   .avatar[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.like.active[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #0871a8;\n}\n.content[_ngcontent-%COMP%] {\n  overflow: hidden;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXGFzc2V0c1xcc3R5bGVzXFxtaXhpbnNcXHRleHQtbWl4aW5zLmxlc3MiLCJwb3N0LmNvbXBvbmVudC5sZXNzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksaUJBQUE7RUFDQSx5QkFBQTtFQUNBLHNCQUFBO0VBQ0EscUJBQUE7QUNDSjtBQUZBO0VBQ0ksV0FBQTtFQUNBLGdCQUFBO0VBRUEsYUFBQTtFQUNBLHNCQUFBO0FBR0o7QUFESTtFQUNJLGFBQUE7RUFDQSxZQUFBO0VBRUEsYUFBQTtFQUNBLHlCQUFBO0VBQ0EsbUJBQUE7QUFFUjtBQVJJO0VBU1EsZUFBQTtFQUVBLFdBQUE7RUFDQSxZQUFBO0VBRUEsZUFBQTtFQUVBLGVBQUE7QUFEWjtBQUtJO0VBQ0ksa0JBQUE7QUFIUjtBQUVJO0VBSVEsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsOEJBQUE7RUFFQSxtQkFBQTtBQUpaO0FBSkk7RUFXWSxhQUFBO0FBSmhCO0FBUEk7RUFjZ0IsY0FBQTtBQUpwQjtBQVZJO0VBa0JnQixhQUFBO0VBQ0Esc0JBQUE7QUFMcEI7QUFkSTtFQXNCb0IsZ0JBQUE7RUFDQSxlQUFBO0FBTHhCO0FBbEJJO0VBMkJvQixlQUFBO0FBTnhCO0FBckJJO0VBa0NRLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHNCQUFBO0VBQ0Esc0JBQUE7RUFFQSxjQUFBO0FBWFo7QUE1Qkk7RUEyQ1EsZUFBQTtBQVpaO0FBZ0JJO0VBQ0ksa0JBQUE7RUFDQSxZQUFBO0VBRUEsYUFBQTtFQUNBLDhCQUFBO0VBQ0EsbUJBQUE7RUFFQSx5QkFBQTtFRHBGSixpQkFBQTtFQUNBLHlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxxQkFBQTtBQ3FFSjtBQUlJO0VBWVEsVUFBQTtFQUNBLGdCQUFBO0VBRUEsYUFBQTtFQUNBLDhCQUFBO0FBZFo7QUFGSTtFQW1CWSxlQUFBO0FBZGhCO0FBTEk7RUF3QlEsZUFBQTtFQUNBLGdCQUFBO0VBRUEsZUFBQTtBQWpCWjtBQW1CWTtFQUNJLGNBQUE7QUFqQmhCO0FBYkk7RUFtQ1Esc0JBQUE7QUFuQlo7QUExRkE7RUFrSFEsYUFBQTtBQXJCUjtBQTdGQTtFQXFIWSxnQkFBQTtFQUNBLGVBQUE7RUFFQSxhQUFBO0VBQ0EsZ0JBQUE7QUF0Qlo7QUFuR0E7RUE0SGdCLFdBQUE7RUFDQSxhQUFBO0VBRUEseUJBQUE7QUF2QmhCO0FBeEdBO0VBa0lvQixhQUFBO0VBQ0Esc0JBQUE7RUFDQSxZQUFBO0VBRUEsZUFBQTtBQXhCcEI7QUE5R0E7RUF5SXdCLGdCQUFBO0FBeEJ4QjtBQWpIQTtFQTZJd0IsYUFBQTtFQUNBLDhCQUFBO0FBekJ4QjtBQXJIQTtFQWlKNEIsY0FBQTtFQUNBLGVBQUE7QUF6QjVCO0FBekhBO0VBc0o0QixlQUFBO0FBMUI1QjtBQTVIQTtFQTBKNEIsc0JBQUE7RUFFQSxXQUFBO0VBQ0EsWUFBQTtBQTVCNUI7QUFpQ2dCO0VBRVEsZ0JBQUE7QUFoQ3hCO0FBOEJnQjtFQUtRLGlCQUFBO0VBQ0EsMEJBQUE7QUFoQ3hCO0FBeElBO0VBK0tZLFlBQUE7RUFDQSx5QkFBQTtFQUVBLGFBQUE7RUFDQSw4QkFBQTtFQUNBLG1CQUFBO0FBckNaO0FBL0lBO0VBdUxnQixVQUFBO0VBRUEsWUFBQTtFQUNBLGFBQUE7RUFDQSxZQUFBO0VBQ0EsZ0JBQUE7RUFFQSxvQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0FBdkNoQjtBQXlDZ0I7RUFDSSw2QkFBQTtFRHRNaEIsaUJBQUE7RUFDQSx5QkFBQTtFQUNBLHNCQUFBO0VBQ0EscUJBQUE7QUNnS0o7QUF1Q2dCO0VBQ0ksNkJBQUE7RUQzTWhCLGlCQUFBO0VBQ0EseUJBQUE7RUFDQSxzQkFBQTtFQUNBLHFCQUFBO0FDdUtKO0FBeEtBO0VBK01nQixXQUFBO0VBQ0EsWUFBQTtFQUVBLGtCQUFBO0VBQ0EsU0FBQTtFQUNBLFVBQUE7RUFFQSx5QkFBQTtFQUVBLGVBQUE7QUF2Q2hCO0FBakxBO0VBMk5vQixXQUFBO0VBQ0EsWUFBQTtFQUVBLHNCQUFBO0VBQ0EsZ0JBQUE7QUF4Q3BCO0FBNkNRO0VBQ0ksY0FBQTtBQTNDWjtBQTBDUTtFQUlRLGdCQUFBO0FBM0NoQjtBQWlEQTtFQUNJLFdBQUE7RUFDQSxZQUFBO0VBRUEsb0JBQUE7QUFoREo7QUFtREE7RUFDSSxjQUFBO0VBRUEsV0FBQTtFQUNBLFlBQUE7RUFFQSxrQkFBQTtFQUVBLGtCQUFBO0VBQ0EsZ0JBQUE7QUFwREo7QUEyQ0E7RUFZUSxXQUFBO0FBcERSO0FBd0RBO0VBRVEsYUFBQTtBQXZEUjtBQTJEQTtFQUNJLGdCQUFBO0FBekRKIiwiZmlsZSI6InBvc3QuY29tcG9uZW50Lmxlc3MiLCJzb3VyY2VzQ29udGVudCI6WyIudXNlci1zZWxlY3Qtbm9uZSB7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcbn1cbiIsIkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL3ZhcmlhYmxlcyc7XG5AaW1wb3J0ICdzcmMvYXNzZXRzL3N0eWxlcy9taXhpbnMvdGV4dC1taXhpbnMnO1xuXG4ucG9zdCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgbWFyZ2luLXRvcDogMzBweDtcblxuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblxuICAgICZfX2hlYWRlciB7XG4gICAgICAgIHBhZGRpbmc6IDE1cHg7XG4gICAgICAgIGhlaWdodDogNDVweDtcblxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBtYXJnaW4tdG9wOiA1cHg7XG5cbiAgICAgICAgICAgIHdpZHRoOiAyNHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiAyNHB4O1xuXG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAgICAgICAgIHN0cm9rZTogQGJhc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19ib2R5IHtcbiAgICAgICAgcGFkZGluZzogMTVweCAzMHB4O1xuXG4gICAgICAgIC5jcmVhdG9yIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxNXB4O1xuXG4gICAgICAgICAgICBkaXYge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG5cbiAgICAgICAgICAgICAgICAuYXZhdGFyLWJveCB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC5kZXNjcmlwdGlvbiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cbiAgICAgICAgICAgICAgICAgICAgLm5hbWUge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC5wcm9mZXNzaW9uIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC5kYXRlIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgICAgICBhbGlnbi1zZWxmOiBmbGV4LXN0YXJ0O1xuICAgICAgICAgICAganVzdGlmeS1zZWxmOiBmbGV4LWVuZDtcblxuICAgICAgICAgICAgY29sb3I6IEBsaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5jb250ZW50IHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2Zvb3RlciB7XG4gICAgICAgIHBhZGRpbmc6IDE1cHggMzBweDtcbiAgICAgICAgaGVpZ2h0OiA1MHB4O1xuXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICAudXNlci1zZWxlY3Qtbm9uZSgpO1xuXG4gICAgICAgIC5sZWZ0LXNpZGUge1xuICAgICAgICAgICAgd2lkdGg6IDUwJTtcbiAgICAgICAgICAgIG1heC13aWR0aDogMTQwcHg7XG5cbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cbiAgICAgICAgICAgIHNwYW4ge1xuICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC5zaGFyZSB7XG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuXG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICAgIGNvbG9yOiBAYWN0aXZlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuY29tbWVudHMtd3JhcHBlciB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG5cbiAgICAgICAgLmNvbW1lbnRzIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDE1cHg7XG4gICAgICAgICAgICBwYWRkaW5nOiAwIDE1cHg7XG5cbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IDA7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gICAgICAgICAgICAuY29tbWVudCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcblxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDAgMTVweCAxMHB4IDMwcHg7XG5cbiAgICAgICAgICAgICAgICAuY29udGVudCB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICAgICAgICAgIGZsZXgtZ3JvdzogMTtcblxuICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XG5cbiAgICAgICAgICAgICAgICAgICAgLm5hbWUge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC5hbm90aGVyIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQGxpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLmxpa2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDE0cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxNHB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJjpudGgtY2hpbGQobiArIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgLmF2YXRhci1ib3gge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luLXRvcDogMTBweDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAuY29udGVudCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nLXRvcDogMTBweDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjY2NjO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLm5ldy1jb21tZW50IHtcbiAgICAgICAgICAgIG1hcmdpbjogMjBweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDAgMTVweCAxMHB4IDMwcHg7XG5cbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgICAgICB0ZXh0YXJlYSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDcwJTtcblxuICAgICAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICAgICAgICAgIHJlc2l6ZTogbm9uZTtcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gICAgICAgICAgICAgICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDI1cHg7XG5cbiAgICAgICAgICAgICAgICAmOjotd2Via2l0LWlucHV0LXBsYWNlaG9sZGVyIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHJnYmEoMjQsIDI0LCAyNCwgMC4yMik7XG4gICAgICAgICAgICAgICAgICAgIC51c2VyLXNlbGVjdC1ub25lKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJjo6LW1vei1wbGFjZWhvbGRlciB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiByZ2JhKDI0LCAyNCwgMjQsIDAuMjIpO1xuICAgICAgICAgICAgICAgICAgICAudXNlci1zZWxlY3Qtbm9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLmJ0bi1jb21tZW50IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMjhweDtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDI4cHg7XG5cbiAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICAgICAgICAgICAgYm9yZGVyOiAwO1xuICAgICAgICAgICAgICAgIG91dGxpbmU6IDA7XG5cbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBAYWN0aXZlO1xuXG4gICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuXG4gICAgICAgICAgICAgICAgLnNlbmQge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTZweDtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxNnB4O1xuXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiA0cHg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJi5vcGVuIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuXG4gICAgICAgICAgICAuY29tbWVudHMge1xuICAgICAgICAgICAgICAgIG1heC1oZWlnaHQ6IG5vbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnN2ZyB7XG4gICAgd2lkdGg6IDIwcHg7XG4gICAgaGVpZ2h0OiAyMHB4O1xuXG4gICAgbWFyZ2luLXJpZ2h0OiAwLjJyZW07XG59XG5cbi5hdmF0YXItYm94IHtcbiAgICBkaXNwbGF5OiBibG9jaztcblxuICAgIHdpZHRoOiA1MnB4O1xuICAgIGhlaWdodDogNTJweDtcblxuICAgIG1hcmdpbi1yaWdodDogMTVweDtcblxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gICAgLmF2YXRhciB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cbn1cblxuLmxpa2UuYWN0aXZlIHtcbiAgICBzdmcge1xuICAgICAgICBmaWxsOiBAYWN0aXZlO1xuICAgIH1cbn1cblxuLmNvbnRlbnQge1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG59XG4iXX0= */"] });


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./svg-icon/svg-icon.module */ "uQlT");
/* harmony import */ var _views_views_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views/views.module */ "xzpJ");
/* harmony import */ var _pipes_pipes_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pipes/pipes.module */ "iTUp");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _components_header_header_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/header/header.component */ "2MiI");
/* harmony import */ var _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/footer/footer.component */ "LmEr");
/* harmony import */ var _layouts_auth_auth_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./layouts/auth/auth.component */ "Vbwu");
/* harmony import */ var _layouts_base_base_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./layouts/base/base.component */ "OE1Y");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _ngrx_store_devtools__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @ngrx/store-devtools */ "agSv");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../environments/environment */ "AytR");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @ngrx/effects */ "9jGm");
/* harmony import */ var _ngrx_router_store__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @ngrx/router-store */ "99NH");
/* harmony import */ var ngx_socket_io__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ngx-socket-io */ "7JkF");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./store */ "YZbJ");
/* harmony import */ var _store_posts_post_effects__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./store/posts/post.effects */ "eSCP");
/* harmony import */ var _store_my_profile_my_profile_effects__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./store/my-profile/my-profile.effects */ "7Nds");
/* harmony import */ var _store_profile_profile_effects__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./store/profile/profile.effects */ "BNsp");
/* harmony import */ var _directives_directives_module__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./directives/directives.module */ "FUS3");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/core */ "fXoL");




























const config = { url: _environments_environment__WEBPACK_IMPORTED_MODULE_13__["environment"].server_url, options: {} };
class AppModule {
}
AppModule.ɵfac = function AppModule_Factory(t) { return new (t || AppModule)(); };
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_22__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_6__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_22__["ɵɵdefineInjector"]({ providers: [], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_1__["AppRoutingModule"],
            _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_2__["SvgIconModule"],
            _views_views_module__WEBPACK_IMPORTED_MODULE_3__["ViewsModule"],
            _pipes_pipes_module__WEBPACK_IMPORTED_MODULE_4__["PipesModule"],
            _directives_directives_module__WEBPACK_IMPORTED_MODULE_21__["DirectivesModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ReactiveFormsModule"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_11__["StoreModule"].forRoot(_store__WEBPACK_IMPORTED_MODULE_17__["reducers"], {
                metaReducers: _store__WEBPACK_IMPORTED_MODULE_17__["metaReducers"],
                runtimeChecks: {
                    strictActionImmutability: true,
                    strictStateImmutability: true,
                },
            }),
            _ngrx_store_devtools__WEBPACK_IMPORTED_MODULE_12__["StoreDevtoolsModule"].instrument({
                maxAge: 25,
                logOnly: _environments_environment__WEBPACK_IMPORTED_MODULE_13__["environment"].production,
            }),
            _ngrx_effects__WEBPACK_IMPORTED_MODULE_14__["EffectsModule"].forRoot([_store_posts_post_effects__WEBPACK_IMPORTED_MODULE_18__["PostEffects"], _store_my_profile_my_profile_effects__WEBPACK_IMPORTED_MODULE_19__["MyProfileEffects"], _store_profile_profile_effects__WEBPACK_IMPORTED_MODULE_20__["ProfileEffects"]]),
            _ngrx_router_store__WEBPACK_IMPORTED_MODULE_15__["StoreRouterConnectingModule"].forRoot(),
            ngx_socket_io__WEBPACK_IMPORTED_MODULE_16__["SocketIoModule"].forRoot(config),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_22__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_6__["AppComponent"],
        _components_header_header_component__WEBPACK_IMPORTED_MODULE_7__["HeaderComponent"],
        _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_8__["FooterComponent"],
        _layouts_auth_auth_component__WEBPACK_IMPORTED_MODULE_9__["AuthLayoutComponent"],
        _layouts_base_base_component__WEBPACK_IMPORTED_MODULE_10__["BaseLayoutComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_1__["AppRoutingModule"],
        _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_2__["SvgIconModule"],
        _views_views_module__WEBPACK_IMPORTED_MODULE_3__["ViewsModule"],
        _pipes_pipes_module__WEBPACK_IMPORTED_MODULE_4__["PipesModule"],
        _directives_directives_module__WEBPACK_IMPORTED_MODULE_21__["DirectivesModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ReactiveFormsModule"], _ngrx_store__WEBPACK_IMPORTED_MODULE_11__["StoreRootModule"], _ngrx_store_devtools__WEBPACK_IMPORTED_MODULE_12__["StoreDevtoolsModule"], _ngrx_effects__WEBPACK_IMPORTED_MODULE_14__["EffectsRootModule"], _ngrx_router_store__WEBPACK_IMPORTED_MODULE_15__["StoreRouterConnectingModule"], ngx_socket_io__WEBPACK_IMPORTED_MODULE_16__["SocketIoModule"]] }); })();


/***/ }),

/***/ "ZrjY":
/*!*************************************************************!*\
  !*** ./src/app/views/feed/feed-side/feed-side.component.ts ***!
  \*************************************************************/
/*! exports provided: FeedSideComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeedSideComponent", function() { return FeedSideComponent; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../store/my-profile/my-profile.selectors */ "0jmn");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "ofXK");






class FeedSideComponent {
    constructor(store$) {
        this.store$ = store$;
        this.profile$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_1__["myProfileSelector"]));
        this.fullName$ = this.profile$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(profile => `${profile.firstName} ${profile.lastName}`));
        this.description$ = this.profile$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(profile => profile.info.description));
        this.avatar$ = this.profile$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(profile => { var _a, _b; return (_b = (_a = profile.info.avatar) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : 'assets/img/avatar-man.png'; }));
    }
    ngOnInit() { }
}
FeedSideComponent.ɵfac = function FeedSideComponent_Factory(t) { return new (t || FeedSideComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["Store"])); };
FeedSideComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: FeedSideComponent, selectors: [["app-feed-side"]], decls: 31, vars: 11, consts: [[1, "feed__sidebar"], [1, "feed__sidebar__header"], ["src", "../../../../assets/img/header-bg-2.png", "alt", "bg", 1, "header-bg"], [1, "profile-info"], [1, "avatar-box"], ["alt", "avatar", 3, "src"], [1, "name"], [1, "account-status"], [1, "description"], [1, "btn"], [1, "groups"], [1, "groups__header"], [1, "title"], ["href", "#", 1, "edit-list", "more"], [1, "groups__body"], [1, "group"], [1, "group__icon"], ["src", "../../../../assets/img/NGTU.jpg", "alt", "group-icon"], [1, "group__name"], [1, "groups__footer"], ["href", "#", 1, "more"]], template: function FeedSideComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "img", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](5, "img", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](6, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](9, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](10, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](13, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](15, "Write new article");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](18, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](19, "My groups");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "a", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](21, "Edit list");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](23, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](25, "img", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](26, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](27);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](28, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](29, "a", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](30);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("src", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](6, 5, ctx.avatar$), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](9, 7, ctx.fullName$), " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](13, 9, ctx.description$), " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", "Nizhniy Novgorod State Technical University", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("show all (", 8, ")");
    } }, pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["AsyncPipe"]], styles: [".feed__sidebar__header[_ngcontent-%COMP%] {\n  margin-bottom: 30px;\n}\n.feed__sidebar__header[_ngcontent-%COMP%]   .header-bg[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 120px;\n}\n.feed__sidebar__header[_ngcontent-%COMP%]   .profile-info[_ngcontent-%COMP%] {\n  margin-top: -50px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.feed__sidebar__header[_ngcontent-%COMP%]   .profile-info[_ngcontent-%COMP%]   .avatar-box[_ngcontent-%COMP%] {\n  width: 100px;\n  height: 100px;\n  border: 7px solid white;\n  border-radius: 50%;\n  overflow: hidden;\n  margin-bottom: 15px;\n}\n.feed__sidebar__header[_ngcontent-%COMP%]   .profile-info[_ngcontent-%COMP%]   .avatar-box[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.feed__sidebar__header[_ngcontent-%COMP%]   .profile-info[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 16px;\n  font-weight: 600;\n  margin-bottom: 10px;\n}\n.feed__sidebar__header[_ngcontent-%COMP%]   .profile-info[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 12px;\n}\n.feed__sidebar__header[_ngcontent-%COMP%]   .profile-info[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  width: calc(100% - 60px);\n  margin: 20px 30px;\n  text-transform: uppercase;\n}\n.feed__sidebar[_ngcontent-%COMP%]   .groups[_ngcontent-%COMP%] {\n  padding: 30px;\n}\n.feed__sidebar[_ngcontent-%COMP%]   .groups__header[_ngcontent-%COMP%] {\n  height: 50px;\n  display: flex;\n  justify-content: space-between;\n  font-size: 14px;\n}\n.feed__sidebar[_ngcontent-%COMP%]   .groups__header[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  font-weight: 600;\n}\n.feed__sidebar[_ngcontent-%COMP%]   .groups__body[_ngcontent-%COMP%]   .group[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 80px;\n  margin-bottom: 10px;\n}\n.feed__sidebar[_ngcontent-%COMP%]   .groups__body[_ngcontent-%COMP%]   .group__icon[_ngcontent-%COMP%] {\n  display: inline-block;\n  width: 52px;\n  height: 52px;\n  border-radius: 50%;\n  overflow: hidden;\n}\n.feed__sidebar[_ngcontent-%COMP%]   .groups__body[_ngcontent-%COMP%]   .group__icon[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.feed__sidebar[_ngcontent-%COMP%]   .groups__body[_ngcontent-%COMP%]   .group__name[_ngcontent-%COMP%] {\n  display: inline-block;\n  width: 65%;\n  margin-left: 15px;\n  font-size: 16px;\n  font-weight: 600;\n}\n.feed__sidebar[_ngcontent-%COMP%]   .groups__footer[_ngcontent-%COMP%] {\n  height: 50px;\n  line-height: 50px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZlZWQtc2lkZS5jb21wb25lbnQubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHSTtFQUNJLG1CQUFBO0FBRlI7QUFDSTtFQUlRLFdBQUE7RUFDQSxhQUFBO0FBRlo7QUFISTtFQVNRLGlCQUFBO0VBRUEsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7QUFKWjtBQVRJO0VBZ0JZLFlBQUE7RUFDQSxhQUFBO0VBRUEsdUJBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0VBRUEsbUJBQUE7QUFOaEI7QUFqQkk7RUEwQmdCLFdBQUE7QUFOcEI7QUFwQkk7RUErQlksa0JBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFFQSxtQkFBQTtBQVRoQjtBQTFCSTtFQXVDWSxrQkFBQTtFQUNBLGVBQUE7QUFWaEI7QUE5Qkk7RUE0Q1ksd0JBQUE7RUFDQSxpQkFBQTtFQUNBLHlCQUFBO0FBWGhCO0FBcENBO0VBb0RRLGFBQUE7QUFiUjtBQWVRO0VBQ0ksWUFBQTtFQUVBLGFBQUE7RUFDQSw4QkFBQTtFQUVBLGVBQUE7QUFmWjtBQVNRO0VBU1EseUJBQUE7RUFDQSxnQkFBQTtBQWZoQjtBQW1CUTtFQUVRLFdBQUE7RUFDQSxZQUFBO0VBQ0EsbUJBQUE7QUFsQmhCO0FBb0JnQjtFQUNJLHFCQUFBO0VBRUEsV0FBQTtFQUNBLFlBQUE7RUFFQSxrQkFBQTtFQUNBLGdCQUFBO0FBcEJwQjtBQWFnQjtFQVVRLFdBQUE7QUFwQnhCO0FBd0JnQjtFQUNJLHFCQUFBO0VBQ0EsVUFBQTtFQUVBLGlCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0FBdkJwQjtBQTRCUTtFQUNJLFlBQUE7RUFDQSxpQkFBQTtBQTFCWiIsImZpbGUiOiJmZWVkLXNpZGUuY29tcG9uZW50Lmxlc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICdzcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMnO1xuXG4uZmVlZF9fc2lkZWJhciB7XG4gICAgJl9faGVhZGVyIHtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMzBweDtcblxuICAgICAgICAuaGVhZGVyLWJnIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiAxMjBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5wcm9maWxlLWluZm8ge1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogLTUwcHg7XG5cbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAgICAgLmF2YXRhci1ib3gge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAxMDBweDtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMHB4O1xuXG4gICAgICAgICAgICAgICAgYm9yZGVyOiA3cHggc29saWQgd2hpdGU7XG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgICAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxNXB4O1xuXG4gICAgICAgICAgICAgICAgaW1nIHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAubmFtZSB7XG4gICAgICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuXG4gICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLmRlc2NyaXB0aW9uIHtcbiAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAuYnRuIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogY2FsYygxMDAlIC0gNjBweCk7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiAyMHB4IDMwcHg7XG4gICAgICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAuZ3JvdXBzIHtcbiAgICAgICAgcGFkZGluZzogMzBweDtcblxuICAgICAgICAmX19oZWFkZXIge1xuICAgICAgICAgICAgaGVpZ2h0OiA1MHB4O1xuXG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuXG4gICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG5cbiAgICAgICAgICAgIC50aXRsZSB7XG4gICAgICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJl9fYm9keSB7XG4gICAgICAgICAgICAuZ3JvdXAge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgICAgIGhlaWdodDogODBweDtcbiAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuXG4gICAgICAgICAgICAgICAgJl9faWNvbiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcblxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNTJweDtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA1MnB4O1xuXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICAgICAgICAgICAgICAgICAgICBpbWcge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAmX19uYW1lIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNjUlO1xuXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAxNXB4O1xuICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJl9fZm9vdGVyIHtcbiAgICAgICAgICAgIGhlaWdodDogNTBweDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiA1MHB4O1xuICAgICAgICB9XG4gICAgfVxufVxuIl19 */", ".feed[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 1440px;\n  margin: 0 auto;\n}\n.feed__wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 1440px;\n  margin: 40px 130px;\n  display: flex;\n}\n.main[_ngcontent-%COMP%] {\n  width: 75%;\n  max-width: 850px;\n  margin-right: 40px;\n}\n.side[_ngcontent-%COMP%] {\n  width: 25%;\n  max-width: 290px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZlZWQuY29tcG9uZW50Lmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxXQUFBO0VBQ0EsaUJBQUE7RUFDQSxjQUFBO0FBREo7QUFHSTtFQUNJLFdBQUE7RUFDQSxpQkFBQTtFQUVBLGtCQUFBO0VBQ0EsYUFBQTtBQUZSO0FBTUE7RUFDSSxVQUFBO0VBQ0EsZ0JBQUE7RUFFQSxrQkFBQTtBQUxKO0FBUUE7RUFDSSxVQUFBO0VBQ0EsZ0JBQUE7QUFOSiIsImZpbGUiOiJmZWVkLmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvdmFyaWFibGVzJztcblxuLmZlZWQge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1heC13aWR0aDogMTQ0MHB4O1xuICAgIG1hcmdpbjogMCBhdXRvO1xuXG4gICAgJl9fd3JhcHBlciB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBtYXgtd2lkdGg6IDE0NDBweDtcblxuICAgICAgICBtYXJnaW46IDQwcHggMTMwcHg7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgfVxufVxuXG4ubWFpbiB7XG4gICAgd2lkdGg6IDc1JTtcbiAgICBtYXgtd2lkdGg6IDg1MHB4O1xuXG4gICAgbWFyZ2luLXJpZ2h0OiA0MHB4O1xufVxuXG4uc2lkZSB7XG4gICAgd2lkdGg6IDI1JTtcbiAgICBtYXgtd2lkdGg6IDI5MHB4O1xufVxuIl19 */"] });


/***/ }),

/***/ "aeBj":
/*!************************************************************!*\
  !*** ./src/app/pipes/prefix-plus-pipe/prefix-plus.pipe.ts ***!
  \************************************************************/
/*! exports provided: PrefixPlusPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PrefixPlusPipe", function() { return PrefixPlusPipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class PrefixPlusPipe {
    transform(value, ...args) {
        value = Number(value);
        if (value || value === 0) {
            if (value >= 0) {
                return `+${value}`;
            }
            return `${value}`;
        }
        return 'Not a Number';
    }
}
PrefixPlusPipe.ɵfac = function PrefixPlusPipe_Factory(t) { return new (t || PrefixPlusPipe)(); };
PrefixPlusPipe.ɵpipe = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({ name: "prefixPlus", type: PrefixPlusPipe, pure: true });


/***/ }),

/***/ "cpn4":
/*!******************************************!*\
  !*** ./src/app/services/file.service.ts ***!
  \******************************************/
/*! exports provided: FileService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileService", function() { return FileService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class FileService {
    constructor() { }
    fileUpload(fileInput, type, attached) {
        fileInput.onchange = (e) => {
            const { files } = e.target;
            [].forEach.call(files, (file) => {
                const fileReader = new FileReader();
                console.log(file);
                fileReader.onload = (ev) => {
                    const fr = ev.target;
                    console.log(fr);
                    const attach = {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        result: fr.result,
                    };
                    if (file.type.match('image')) {
                        if (!attached.images)
                            attached.images = [];
                        attached.images.push(attach);
                    }
                    else if (file.type.match('video')) {
                        if (!attached.videos)
                            attached.videos = [];
                        attached.videos.push(attach);
                    }
                    else {
                        if (!attached.files)
                            attached.files = [];
                        attached.files.push(attach);
                    }
                };
                fileReader.readAsDataURL(file);
            });
        };
        fileInput.click();
    }
}
FileService.ɵfac = function FileService_Factory(t) { return new (t || FileService)(); };
FileService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: FileService, factory: FileService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "dCal":
/*!*************************************************************************************************************************!*\
  !*** ./src/app/views/profile/edit-profile/edit-components/edit-login-and-security/edit-login-and-security.component.ts ***!
  \*************************************************************************************************************************/
/*! exports provided: EditLoginAndSecurityComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditLoginAndSecurityComponent", function() { return EditLoginAndSecurityComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _plugins_hystModal_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../plugins/hystModal_.js */ "+NIJ");
/* harmony import */ var _services_profile_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../services/profile.service */ "Aso2");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../svg-icon/svg-icon.component */ "W/uP");
/* harmony import */ var _directives_var_directive__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../directives/var.directive */ "doCK");
/* harmony import */ var _pipes_masked_phone_masked_phone_pipe__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../pipes/masked-phone/masked-phone.pipe */ "sq79");
/* harmony import */ var _pipes_masked_email_masked_email_pipe__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../pipes/masked-email/masked-email.pipe */ "3BcM");


// @ts-ignore










function EditLoginAndSecurityComponent_div_0_div_23_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("updated ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](2, 1, ctx_r8.dateOfLastPasswordUpdate, "dd.MM.yyyy"), "");
} }
function EditLoginAndSecurityComponent_div_0_div_24_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "password never updated");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function EditLoginAndSecurityComponent_div_0_div_32_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "svg", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Confirm email ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function EditLoginAndSecurityComponent_div_0_div_33_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "svg", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Email confirmed ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "svg", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function EditLoginAndSecurityComponent_div_0_div_35_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "svg", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Confirm phone ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function EditLoginAndSecurityComponent_div_0_div_36_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "svg", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Phone confirmed ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "svg", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function EditLoginAndSecurityComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "h3", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, " Data change ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "svg", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_0_Template_div_click_5_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r15); const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r14.changePhoneMode(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "svg", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, " Phone ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](11, "maskedPhone");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_0_Template_div_click_12_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r15); const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r16.changeEmailMode(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](14, "svg", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, " Email ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](18, "maskedEmail");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_0_Template_div_click_19_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r15); const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r17.changePasswordMode(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](21, "svg", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, " Password ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](23, EditLoginAndSecurityComponent_div_0_div_23_Template, 3, 4, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](24, EditLoginAndSecurityComponent_div_0_div_24_Template, 2, 0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "h3", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, " Increased security ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](28, "svg", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "p", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "Increase the security of your account by verifying your email and phone");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](32, EditLoginAndSecurityComponent_div_0_div_32_Template, 3, 0, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](33, EditLoginAndSecurityComponent_div_0_div_33_Template, 4, 0, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](35, EditLoginAndSecurityComponent_div_0_div_35_Template, 3, 0, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](36, EditLoginAndSecurityComponent_div_0_div_36_Template, 4, 0, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "h3", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, " Delete account ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](40, "svg", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "p", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, " You can delete your profile with all data and cannot be restored ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "button", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](44, "svg", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, " Delete ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](11, 8, ctx_r0.phone));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](18, 10, ctx_r0.email));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.dateOfLastPasswordUpdate || ctx_r0.dateOfLastPasswordUpdate === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r0.dateOfLastPasswordUpdate && ctx_r0.dateOfLastPasswordUpdate !== 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r0.emailConfirmed);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.emailConfirmed);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r0.phoneConfirmed);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.phoneConfirmed);
} }
function EditLoginAndSecurityComponent_div_1_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "svg", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_1_div_2_Template__svg_svg_click_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r21); const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r20.changeEmailError = ""; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r18.changeEmailError, " ");
} }
function EditLoginAndSecurityComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r23 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "svg", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_1_Template__svg_svg_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r23); const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r22.closeChangeBlock(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, EditLoginAndSecurityComponent_div_1_div_2_Template, 3, 1, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Change email");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](7, "maskedEmail");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "input", 48, 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_1_Template_button_click_10_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r23); const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](9); const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r24.changeEmail(_r19.value); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Save");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](9);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r1.changeEmailError);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("Current email: ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](7, 3, ctx_r1.email), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", _r19.value === "");
} }
function EditLoginAndSecurityComponent_div_2_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "svg", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_2_div_2_Template__svg_svg_click_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r28); const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r27.changePhoneError = ""; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r25.changePhoneError, " ");
} }
function EditLoginAndSecurityComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r30 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "svg", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_2_Template__svg_svg_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r30); const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r29.closeChangeBlock(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, EditLoginAndSecurityComponent_div_2_div_2_Template, 3, 1, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Change phone");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](7, "maskedPhone");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "input", 54, 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_2_Template_button_click_10_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r30); const _r26 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](9); const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r31.changePhone(_r26.value); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Save");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r26 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](9);
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r2.changePhoneError);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("Current phone: ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](7, 3, ctx_r2.phone), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", _r26.value === "");
} }
function EditLoginAndSecurityComponent_div_3_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r43 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "svg", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_3_div_2_Template__svg_svg_click_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r43); const ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r42.changePasswordError = ""; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r32.changePasswordError, " ");
} }
function EditLoginAndSecurityComponent_div_3__svg_svg_12_Template(rf, ctx) { if (rf & 1) {
    const _r45 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "svg", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_3__svg_svg_12_Template__svg_svg_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r45); _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r33 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](11); return _r33.var = !_r33.var; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function EditLoginAndSecurityComponent_div_3__svg_svg_13_Template(rf, ctx) { if (rf & 1) {
    const _r47 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "svg", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_3__svg_svg_13_Template__svg_svg_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r47); _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r33 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](11); return _r33.var = !_r33.var; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function EditLoginAndSecurityComponent_div_3__svg_svg_20_Template(rf, ctx) { if (rf & 1) {
    const _r49 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "svg", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_3__svg_svg_20_Template__svg_svg_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r49); _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r36 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](19); return _r36.var = !_r36.var; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function EditLoginAndSecurityComponent_div_3__svg_svg_21_Template(rf, ctx) { if (rf & 1) {
    const _r51 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "svg", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_3__svg_svg_21_Template__svg_svg_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r51); _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r36 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](19); return _r36.var = !_r36.var; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function EditLoginAndSecurityComponent_div_3__svg_svg_28_Template(rf, ctx) { if (rf & 1) {
    const _r53 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "svg", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_3__svg_svg_28_Template__svg_svg_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r53); _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r39 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](27); return _r39.var = !_r39.var; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function EditLoginAndSecurityComponent_div_3__svg_svg_29_Template(rf, ctx) { if (rf & 1) {
    const _r55 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "svg", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_3__svg_svg_29_Template__svg_svg_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r55); _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r39 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](27); return _r39.var = !_r39.var; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function EditLoginAndSecurityComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r57 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "svg", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_div_3_Template__svg_svg_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r57); const ctx_r56 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r56.closeChangeBlock(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, EditLoginAndSecurityComponent_div_3_div_2_Template, 3, 1, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Change password");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "form", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngSubmit", function EditLoginAndSecurityComponent_div_3_Template_form_ngSubmit_5_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r57); const ctx_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r58.changePassword(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "label", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Old password");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "input", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "span", 15, 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](12, EditLoginAndSecurityComponent_div_3__svg_svg_12_Template, 1, 0, "svg", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](13, EditLoginAndSecurityComponent_div_3__svg_svg_13_Template, 1, 0, "svg", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "label", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "New password");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "input", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "span", 15, 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](20, EditLoginAndSecurityComponent_div_3__svg_svg_20_Template, 1, 0, "svg", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](21, EditLoginAndSecurityComponent_div_3__svg_svg_21_Template, 1, 0, "svg", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "label", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Repeat password");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](25, "input", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "span", 15, 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](28, EditLoginAndSecurityComponent_div_3__svg_svg_28_Template, 1, 0, "svg", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](29, EditLoginAndSecurityComponent_div_3__svg_svg_29_Template, 1, 0, "svg", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "button", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "Change");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r33 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](11);
    const _r36 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](19);
    const _r39 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](27);
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r3.changePasswordError);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx_r3.changePasswordForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("type", _r33.var ? "text" : "password");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("var", false);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !_r33.var);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _r33.var);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("type", _r36.var ? "text" : "password");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("var", false);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !_r36.var);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _r36.var);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("type", _r39.var ? "text" : "password");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("var", false);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !_r39.var);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _r39.var);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r3.changePasswordForm.invalid);
} }
function EditLoginAndSecurityComponent__svg_svg_20_Template(rf, ctx) { if (rf & 1) {
    const _r60 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "svg", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent__svg_svg_20_Template__svg_svg_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r60); _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](19); return _r5.var = !_r5.var; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function EditLoginAndSecurityComponent__svg_svg_21_Template(rf, ctx) { if (rf & 1) {
    const _r62 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "svg", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent__svg_svg_21_Template__svg_svg_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r62); _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](19); return _r5.var = !_r5.var; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
class EditLoginAndSecurityComponent {
    constructor(profileService, router) {
        this.profileService = profileService;
        this.router = router;
        this.profileId = -1;
        this.email = '';
        this.phone = '';
        this.dateOfLastPasswordUpdate = null;
        this.phoneConfirmed = false;
        this.emailConfirmed = false;
        this.action = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.isChangePhone = false;
        this.isChangeEmail = false;
        this.isChangePassword = false;
        this.changePhoneError = '';
        this.changeEmailError = '';
        this.changePasswordError = '';
        this.changePasswordForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroup"]({
            currentPassword: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(6),
            ]),
            newPassword: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(6),
            ]),
            newPasswordRepeat: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(6),
            ]),
        });
    }
    changePhoneMode() {
        this.isChangePhone = true;
        this.isChangeEmail = false;
        this.isChangePassword = false;
    }
    changeEmailMode() {
        this.isChangePhone = false;
        this.isChangeEmail = true;
        this.isChangePassword = false;
    }
    changePasswordMode() {
        this.isChangePhone = false;
        this.isChangeEmail = false;
        this.isChangePassword = true;
    }
    closeChangeBlock() {
        this.isChangePhone = false;
        this.isChangeEmail = false;
        this.isChangePassword = false;
    }
    deleteAccount(password) {
        this.profileService.deleteAccount(this.profileId, password).subscribe(res => {
            localStorage.removeItem('currentUser');
            this.router.navigate(['/account-deleted']);
        }, err => { });
    }
    changeEmail(email) {
        const match = email.match(/.+@.+\..+/i);
        console.log(match);
        if (!match) {
            this.changeEmailError = 'Invalid email';
            return;
        }
        if (this.email === email) {
            this.changeEmailError = 'Email addresses match';
            return;
        }
        this.profileService.changeEmail(this.profileId, email).subscribe(res => {
            console.log(res.message);
        }, err => {
            console.error(err.message);
        });
    }
    changePhone(phone) {
        const match = phone.match(/^[- +()0-9]{5,}/);
        if (!match) {
            this.changePhoneError = 'Invalid phone';
            return;
        }
        if (this.phone === phone) {
            this.changePhoneError = 'Phones match';
            return;
        }
        this.profileService.changePhone(this.profileId, phone).subscribe(res => {
            console.log(res.message);
        }, err => {
            console.error(err.message);
        });
    }
    changePassword() {
        const form = this.changePasswordForm.value;
        if (form.newPassword !== form.newPasswordRepeat) {
            this.changePasswordError = 'Password mismatch';
            return;
        }
        if (form.newPassword === form.currentPassword) {
            this.changePasswordError = 'Old and new passwords are the same';
            return;
        }
        if (form.newPassword.length < 6) {
            this.changePasswordError = 'New password is too short';
            return;
        }
        this.profileService
            .changePassword(this.profileId, form.newPassword, form.currentPassword)
            .subscribe(res => {
            console.log(res.message);
        }, err => {
            console.error(err.message);
        });
    }
    ngOnInit() {
        const deleteAccountModal = new _plugins_hystModal_js__WEBPACK_IMPORTED_MODULE_2__["HystModal"]({
            linkAttributeName: 'data-hystmodal',
        });
    }
}
EditLoginAndSecurityComponent.ɵfac = function EditLoginAndSecurityComponent_Factory(t) { return new (t || EditLoginAndSecurityComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_profile_service__WEBPACK_IMPORTED_MODULE_3__["ProfileService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"])); };
EditLoginAndSecurityComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: EditLoginAndSecurityComponent, selectors: [["app-edit-login-and-security"]], inputs: { profileId: "profileId", email: "email", phone: "phone", dateOfLastPasswordUpdate: "dateOfLastPasswordUpdate", phoneConfirmed: "phoneConfirmed", emailConfirmed: "emailConfirmed" }, outputs: { action: "action" }, decls: 24, vars: 8, consts: [["class", "edit-login-and-security", 4, "ngIf"], ["class", "changeEmail", 4, "ngIf"], ["class", "changePhone", 4, "ngIf"], ["class", "changePassword", 4, "ngIf"], ["id", "delete-account-confirmation-modal", "aria-hidden", "true", 1, "hystmodal"], [1, "hystmodal__wrap"], ["role", "dialog", "aria-modal", "true", 1, "hystmodal__window"], ["data-hystclose", "", 1, "hystmodal__close"], [1, "delete-account-confirmation"], ["icon", "trash"], [1, "help"], [1, "password-wrapper"], ["for", "password"], ["id", "password", 3, "type"], ["pass", ""], [1, "eye-icon", 3, "var"], ["showPas", "var"], ["icon", "showPassword", 3, "click", 4, "ngIf"], ["icon", "hidePassword", 3, "click", 4, "ngIf"], ["data-hystclose", "", 1, "btn", 3, "click"], [1, "edit-login-and-security"], [1, "login-data"], [1, "title"], ["icon", "security"], [1, "phone", 3, "click"], ["icon", "phone", 1, "icon"], [1, "value"], [1, "email", 3, "click"], ["icon", "email", 1, "icon"], [1, "password", 3, "click"], ["icon", "key", 1, "icon"], ["class", "date-of-last-update", 4, "ngIf"], [1, "increased-security"], ["icon", "confirm"], [1, "confirm-email"], ["class", "title", 4, "ngIf"], ["class", "title confirmed", 4, "ngIf"], [1, "confirm-phone"], [1, "delete-profile"], ["data-hystmodal", "#delete-account-confirmation-modal", 1, "delete-account-btn"], [1, "date-of-last-update"], ["icon", "email"], [1, "title", "confirmed"], ["icon", "confirmed", 1, "confirmed-icon"], ["icon", "phone"], [1, "changeEmail"], ["icon", "back", 1, "back", 3, "click"], ["class", "error", 4, "ngIf"], ["type", "email", "placeholder", "Enter new email", 1, "control"], ["change_email_input", ""], [1, "btn", 3, "disabled", "click"], [1, "error"], ["icon", "close", 1, "close", 3, "click"], [1, "changePhone"], ["type", "tel", "id", "phone", "placeholder", "Enter new phone", 1, "control"], ["change_phone_input", ""], [1, "changePassword"], [1, "changePasswordForm", 3, "formGroup", "ngSubmit"], ["for", "old-password"], ["id", "old-password", "formControlName", "currentPassword", 3, "type"], ["showOld", "var"], ["for", "new-password"], ["id", "new-password", "formControlName", "newPassword", 3, "type"], ["showNew", "var"], ["for", "new-password-repeat"], ["id", "new-password-repeat", "formControlName", "newPasswordRepeat", 3, "type"], ["showRepeat", "var"], ["type", "submit", 1, "btn", 3, "disabled"], ["icon", "showPassword", 3, "click"], ["icon", "hidePassword", 3, "click"]], template: function EditLoginAndSecurityComponent_Template(rf, ctx) { if (rf & 1) {
        const _r63 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, EditLoginAndSecurityComponent_div_0_Template, 46, 12, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, EditLoginAndSecurityComponent_div_1_Template, 12, 5, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, EditLoginAndSecurityComponent_div_2_Template, 12, 5, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, EditLoginAndSecurityComponent_div_3_Template, 32, 15, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "\u0417\u0430\u043A\u0440\u044B\u0442\u044C");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "svg", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "p", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "You will not be able to return your account details, you really want to delete your account?");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "label", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Enter your password");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "input", 13, 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "span", 15, 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](20, EditLoginAndSecurityComponent__svg_svg_20_Template, 1, 0, "svg", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](21, EditLoginAndSecurityComponent__svg_svg_21_Template, 1, 0, "svg", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "button", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditLoginAndSecurityComponent_Template_button_click_22_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r63); const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](17); return ctx.deleteAccount(_r4.value); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "Delete");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.isChangePassword && !ctx.isChangePhone && !ctx.isChangeEmail);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.isChangeEmail);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.isChangePhone);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.isChangePassword);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("type", _r5.var ? "text" : "password");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("var", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !_r5.var);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _r5.var);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_6__["SvgIconComponent"], _directives_var_directive__WEBPACK_IMPORTED_MODULE_7__["VarDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlName"]], pipes: [_pipes_masked_phone_masked_phone_pipe__WEBPACK_IMPORTED_MODULE_8__["MaskedPhonePipe"], _pipes_masked_email_masked_email_pipe__WEBPACK_IMPORTED_MODULE_9__["MaskedEmailPipe"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["DatePipe"]], styles: [".user-select-none[_ngcontent-%COMP%] {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.edit-login-and-security[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.edit-login-and-security[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  margin-bottom: 40px;\n}\n.edit-login-and-security[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]    > .title[_ngcontent-%COMP%] {\n  font-weight: 500;\n  font-size: 18px;\n  margin-bottom: 20px;\n}\n.edit-login-and-security[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]    > .title[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  margin-left: 5px;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .login-data[_ngcontent-%COMP%]   .phone[_ngcontent-%COMP%], .edit-login-and-security[_ngcontent-%COMP%]   .login-data[_ngcontent-%COMP%]   .email[_ngcontent-%COMP%], .edit-login-and-security[_ngcontent-%COMP%]   .login-data[_ngcontent-%COMP%]   .password[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  padding: 5px;\n  margin-bottom: 5px;\n  cursor: pointer;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .login-data[_ngcontent-%COMP%]   .phone[_ngcontent-%COMP%]:hover, .edit-login-and-security[_ngcontent-%COMP%]   .login-data[_ngcontent-%COMP%]   .email[_ngcontent-%COMP%]:hover, .edit-login-and-security[_ngcontent-%COMP%]   .login-data[_ngcontent-%COMP%]   .password[_ngcontent-%COMP%]:hover {\n  background-color: #eee;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .login-data[_ngcontent-%COMP%]   .phone[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%], .edit-login-and-security[_ngcontent-%COMP%]   .login-data[_ngcontent-%COMP%]   .email[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%], .edit-login-and-security[_ngcontent-%COMP%]   .login-data[_ngcontent-%COMP%]   .password[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%] {\n  vertical-align: text-top;\n  color: #0871a8;\n  margin-right: 10px;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .login-data[_ngcontent-%COMP%]   .phone[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%], .edit-login-and-security[_ngcontent-%COMP%]   .login-data[_ngcontent-%COMP%]   .email[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%], .edit-login-and-security[_ngcontent-%COMP%]   .login-data[_ngcontent-%COMP%]   .password[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%], .edit-login-and-security[_ngcontent-%COMP%]   .login-data[_ngcontent-%COMP%]   .phone[_ngcontent-%COMP%]   .date-of-last-update[_ngcontent-%COMP%], .edit-login-and-security[_ngcontent-%COMP%]   .login-data[_ngcontent-%COMP%]   .email[_ngcontent-%COMP%]   .date-of-last-update[_ngcontent-%COMP%], .edit-login-and-security[_ngcontent-%COMP%]   .login-data[_ngcontent-%COMP%]   .password[_ngcontent-%COMP%]   .date-of-last-update[_ngcontent-%COMP%] {\n  color: #ababab;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .increased-security[_ngcontent-%COMP%]    > .title[_ngcontent-%COMP%] {\n  margin-bottom: 5px;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .increased-security[_ngcontent-%COMP%]   .help[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #747474;\n  margin-bottom: 20px;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .increased-security[_ngcontent-%COMP%]   .confirm-email[_ngcontent-%COMP%], .edit-login-and-security[_ngcontent-%COMP%]   .increased-security[_ngcontent-%COMP%]   .confirm-phone[_ngcontent-%COMP%] {\n  padding: 10px;\n  font-size: 18px;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .increased-security[_ngcontent-%COMP%]   .confirm-email[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%], .edit-login-and-security[_ngcontent-%COMP%]   .increased-security[_ngcontent-%COMP%]   .confirm-phone[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  margin-right: 10px;\n  width: 28px;\n  height: 28px;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .increased-security[_ngcontent-%COMP%]   .confirm-email[_ngcontent-%COMP%]   .confirmed-icon[_ngcontent-%COMP%], .edit-login-and-security[_ngcontent-%COMP%]   .increased-security[_ngcontent-%COMP%]   .confirm-phone[_ngcontent-%COMP%]   .confirmed-icon[_ngcontent-%COMP%] {\n  margin-left: 10px;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .increased-security[_ngcontent-%COMP%]   .confirm-email[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%], .edit-login-and-security[_ngcontent-%COMP%]   .increased-security[_ngcontent-%COMP%]   .confirm-phone[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  padding: 10px;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .increased-security[_ngcontent-%COMP%]   .confirm-email[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]:not(.confirmed), .edit-login-and-security[_ngcontent-%COMP%]   .increased-security[_ngcontent-%COMP%]   .confirm-phone[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]:not(.confirmed) {\n  cursor: pointer;\n  border-radius: 8px;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .increased-security[_ngcontent-%COMP%]   .confirm-email[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]:not(.confirmed):hover, .edit-login-and-security[_ngcontent-%COMP%]   .increased-security[_ngcontent-%COMP%]   .confirm-phone[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]:not(.confirmed):hover {\n  background-color: rgba(8, 113, 168, 0.1);\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .delete-profile[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  margin-bottom: 5px;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .delete-profile[_ngcontent-%COMP%]   .help[_ngcontent-%COMP%] {\n  color: #747474;\n  font-size: 14px;\n  margin-bottom: 20px;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .delete-profile[_ngcontent-%COMP%]   .delete-account-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 150px;\n  height: 70px;\n  font-family: 'Poppins', sans-serif;\n  font-size: 22px;\n  font-weight: 500;\n  color: #0871a8;\n  border-radius: 12px;\n  border: 3px solid #0871a8;\n  outline: none;\n  cursor: pointer;\n  transition: all 0.15s;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .delete-profile[_ngcontent-%COMP%]   .delete-account-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  margin-right: 10px;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .delete-profile[_ngcontent-%COMP%]   .delete-account-btn[_ngcontent-%COMP%]:hover {\n  color: white;\n  background-color: #0871a8;\n}\n.edit-login-and-security[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  height: 24px;\n  width: 24px;\n  vertical-align: text-top;\n  color: #0871a8;\n  fill: #0871a8;\n}\n.changeEmail[_ngcontent-%COMP%], .changePhone[_ngcontent-%COMP%], .changePassword[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  padding: 20px;\n}\n.changeEmail[_ngcontent-%COMP%]   .back[_ngcontent-%COMP%], .changePhone[_ngcontent-%COMP%]   .back[_ngcontent-%COMP%], .changePassword[_ngcontent-%COMP%]   .back[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  color: #0871a8;\n  border-radius: 50%;\n  background-color: #fff;\n  transition: background-color 0.2s;\n  cursor: pointer;\n}\n.changeEmail[_ngcontent-%COMP%]   .back[_ngcontent-%COMP%]:active, .changePhone[_ngcontent-%COMP%]   .back[_ngcontent-%COMP%]:active, .changePassword[_ngcontent-%COMP%]   .back[_ngcontent-%COMP%]:active {\n  background-color: #ddd;\n}\n.changeEmail[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%], .changePhone[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%], .changePassword[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%] {\n  width: 80%;\n  padding: 10px 20px;\n  margin: 40px auto 10px;\n  border: 2px solid #de0e0e;\n  border-radius: 8px;\n  background-color: rgba(222, 14, 14, 0.2);\n  color: #c60c0c;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.changeEmail[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%]   .close[_ngcontent-%COMP%], .changePhone[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%]   .close[_ngcontent-%COMP%], .changePassword[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%]   .close[_ngcontent-%COMP%] {\n  width: 9px;\n  height: 9px;\n  fill: #ae0b0b;\n}\n.changeEmail[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%], .changePhone[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%], .changePassword[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 500;\n  text-align: center;\n  margin-top: 40px;\n}\n.changeEmail[_ngcontent-%COMP%]   .help[_ngcontent-%COMP%], .changePhone[_ngcontent-%COMP%]   .help[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #747474;\n  text-align: center;\n  margin-bottom: 30px;\n}\n.changeEmail[_ngcontent-%COMP%]   .control[_ngcontent-%COMP%], .changePhone[_ngcontent-%COMP%]   .control[_ngcontent-%COMP%] {\n  margin: 0 auto 20px;\n  width: 80%;\n  height: 40px;\n  outline: none;\n  border: 1px solid #ccc;\n  border-radius: 8px;\n  padding: 10px;\n  font-family: 'Poppins', sans-serif;\n  font-size: 16px;\n  transition: border-color 0.2s;\n}\n.changeEmail[_ngcontent-%COMP%]   .control[_ngcontent-%COMP%]:focus, .changePhone[_ngcontent-%COMP%]   .control[_ngcontent-%COMP%]:focus, .changeEmail[_ngcontent-%COMP%]   .control[_ngcontent-%COMP%]:hover, .changePhone[_ngcontent-%COMP%]   .control[_ngcontent-%COMP%]:hover {\n  border-color: #0a92d9;\n}\n.changeEmail[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%], .changePhone[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  margin: 0 auto;\n}\n.changePassword[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  margin-bottom: 30px;\n}\n.changePassword[_ngcontent-%COMP%]   .changePasswordForm[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.changePassword[_ngcontent-%COMP%]   .changePasswordForm[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  font-family: 'Poppins', sans-serif;\n}\n.password-wrapper[_ngcontent-%COMP%] {\n  width: 80%;\n  margin-bottom: 20px;\n  display: flex;\n  flex-direction: column;\n  position: relative;\n}\n.password-wrapper[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  color: #747474;\n  font-size: 14px;\n  margin-bottom: 4px;\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.password-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  height: 40px;\n  border: 1px solid #ccc;\n  border-radius: 8px;\n  outline: none;\n  padding: 10px;\n  transition: border-color 0.2s;\n  font-size: 16px;\n}\n.password-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, .password-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:hover {\n  border-color: #0a92d9;\n}\n.password-wrapper[_ngcontent-%COMP%]   .eye-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 12px;\n  top: 30px;\n  width: 32px;\n  height: 32px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n  border-radius: 50%;\n  transition: background-color 0.2s;\n}\n.password-wrapper[_ngcontent-%COMP%]   .eye-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  color: #747474;\n}\n.password-wrapper[_ngcontent-%COMP%]   .eye-icon[_ngcontent-%COMP%]:active {\n  background-color: #ddd;\n}\n.hystmodal__window[_ngcontent-%COMP%] {\n  border-radius: 15px;\n}\n.delete-account-confirmation[_ngcontent-%COMP%] {\n  padding: 50px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.delete-account-confirmation[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  color: #0871a8;\n}\n.delete-account-confirmation[_ngcontent-%COMP%]   .help[_ngcontent-%COMP%] {\n  width: 60%;\n  text-align: center;\n  color: #747474;\n  margin: 20px 0;\n}\n.delete-account-confirmation[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  font-family: 'Poppins', sans-serif;\n  font-weight: 500;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc3R5bGVzXFxtaXhpbnNcXHRleHQtbWl4aW5zLmxlc3MiLCJlZGl0LWxvZ2luLWFuZC1zZWN1cml0eS5jb21wb25lbnQubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGlCQUFBO0VBQ0EseUJBQUE7RUFDQSxzQkFBQTtFQUNBLHFCQUFBO0FDQ0o7QUFGQTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtBQUlKO0FBRkk7RUFDSSxrQkFBQTtFQUVBLG1CQUFBO0FBR1I7QUFEUTtFQUNJLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLG1CQUFBO0FBR1o7QUFOUTtFQU1RLGdCQUFBO0FBR2hCO0FBbEJBOzs7RUF3QlksYUFBQTtFQUNBLDhCQUFBO0VBRUEsWUFBQTtFQUNBLGtCQUFBO0VBRUEsZUFBQTtBQUhaO0FBS1k7OztFQUNJLHNCQUFBO0FBRGhCO0FBaENBOzs7RUFzQ29CLHdCQUFBO0VBQ0EsY0FBQTtFQUVBLGtCQUFBO0FBRnBCO0FBdkNBOzs7Ozs7RUErQ2dCLGNBQUE7QUFBaEI7QUFNUTtFQUNJLGtCQUFBO0FBSlo7QUFsREE7RUEwRFksZUFBQTtFQUNBLGNBQUE7RUFDQSxtQkFBQTtBQUxaO0FBdkRBOztFQWlFWSxhQUFBO0VBQ0EsZUFBQTtBQU5aO0FBNURBOztFQXFFZ0Isa0JBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtBQUxoQjtBQWxFQTs7RUEyRWdCLGlCQUFBO0FBTGhCO0FBdEVBOztFQStFZ0IsYUFBQTtBQUxoQjtBQU9nQjs7RUFDSSxlQUFBO0VBQ0Esa0JBQUE7QUFKcEI7QUFNb0I7O0VBQ0ksd0NBQUE7QUFIeEI7QUFuRkE7RUErRlksa0JBQUE7QUFUWjtBQXRGQTtFQW1HWSxjQUFBO0VBQ0EsZUFBQTtFQUVBLG1CQUFBO0FBWFo7QUEzRkE7RUEwR1ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFFQSxZQUFBO0VBQ0EsWUFBQTtFQUVBLGtDQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUVBLG1CQUFBO0VBQ0EseUJBQUE7RUFDQSxhQUFBO0VBRUEsZUFBQTtFQUVBLHFCQUFBO0FBakJaO0FBM0dBO0VBK0hnQixXQUFBO0VBQ0EsWUFBQTtFQUVBLGtCQUFBO0FBbEJoQjtBQXFCWTtFQUNJLFlBQUE7RUFDQSx5QkFBQTtBQW5CaEI7QUFwSEE7RUE4SVksWUFBQTtFQUNBLFdBQUE7RUFFQSx3QkFBQTtFQUNBLGNBQUE7RUFDQSxhQUFBO0FBeEJaO0FBNkJBOzs7RUFHSSxrQkFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUVBLGFBQUE7QUE1Qko7QUFxQkE7OztFQVVRLFdBQUE7RUFDQSxZQUFBO0VBRUEsY0FBQTtFQUNBLGtCQUFBO0VBRUEsc0JBQUE7RUFDQSxpQ0FBQTtFQUVBLGVBQUE7QUE3QlI7QUErQlE7OztFQUNJLHNCQUFBO0FBM0JaO0FBS0E7OztFQTJCUSxVQUFBO0VBQ0Esa0JBQUE7RUFDQSxzQkFBQTtFQUVBLHlCQUFBO0VBQ0Esa0JBQUE7RUFDQSx3Q0FBQTtFQUNBLGNBQUE7RUFFQSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtBQTdCUjtBQVRBOzs7RUF5Q1ksVUFBQTtFQUNBLFdBQUE7RUFFQSxhQUFBO0FBNUJaO0FBaEJBOzs7RUFpRFEsZUFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtBQTVCUjtBQWdDQTs7RUFHUSxlQUFBO0VBQ0EsY0FBQTtFQUNBLGtCQUFBO0VBRUEsbUJBQUE7QUFoQ1I7QUF5QkE7O0VBV1EsbUJBQUE7RUFDQSxVQUFBO0VBQ0EsWUFBQTtFQUVBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLGtCQUFBO0VBQ0EsYUFBQTtFQUVBLGtDQUFBO0VBQ0EsZUFBQTtFQUVBLDZCQUFBO0FBbkNSO0FBcUNROzs7O0VBRUkscUJBQUE7QUFqQ1o7QUFNQTs7RUFnQ1EsY0FBQTtBQWxDUjtBQXNDQTtFQUVRLG1CQUFBO0FBckNSO0FBbUNBO0VBTVEsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7QUF0Q1I7QUE4QkE7RUFXWSxrQ0FBQTtBQXRDWjtBQTJDQTtFQUNJLFVBQUE7RUFDQSxtQkFBQTtFQUVBLGFBQUE7RUFDQSxzQkFBQTtFQUVBLGtCQUFBO0FBM0NKO0FBb0NBO0VBVVEsY0FBQTtFQUNBLGVBQUE7RUFDQSxrQkFBQTtFRGxSSixpQkFBQTtFQUNBLHlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxxQkFBQTtBQ3dPSjtBQTJCQTtFQWtCUSxZQUFBO0VBRUEsc0JBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7RUFFQSxhQUFBO0VBRUEsNkJBQUE7RUFFQSxlQUFBO0FBOUNSO0FBZ0RROztFQUVJLHFCQUFBO0FBOUNaO0FBY0E7RUFxQ1Esa0JBQUE7RUFDQSxXQUFBO0VBQ0EsU0FBQTtFQUVBLFdBQUE7RUFDQSxZQUFBO0VBRUEsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFFQSxlQUFBO0VBRUEsa0JBQUE7RUFDQSxpQ0FBQTtBQXBEUjtBQUNBO0VBc0RZLFdBQUE7RUFDQSxZQUFBO0VBRUEsY0FBQTtBQXJEWjtBQXdEUTtFQUNJLHNCQUFBO0FBdERaO0FBMkRBO0VBQ0ksbUJBQUE7QUF6REo7QUE0REE7RUFDSSxhQUFBO0VBRUEsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7QUEzREo7QUFzREE7RUFRUSxjQUFBO0FBM0RSO0FBbURBO0VBWVEsVUFBQTtFQUNBLGtCQUFBO0VBQ0EsY0FBQTtFQUVBLGNBQUE7QUE3RFI7QUE2Q0E7RUFvQlEsa0NBQUE7RUFDQSxnQkFBQTtBQTlEUiIsImZpbGUiOiJlZGl0LWxvZ2luLWFuZC1zZWN1cml0eS5jb21wb25lbnQubGVzcyIsInNvdXJjZXNDb250ZW50IjpbIi51c2VyLXNlbGVjdC1ub25lIHtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xufVxuIiwiQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvdmFyaWFibGVzJztcbkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL21peGlucy90ZXh0LW1peGlucyc7XG5cbi5lZGl0LWxvZ2luLWFuZC1zZWN1cml0eSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXG4gICAgJiA+IGRpdiB7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMjBweDtcbiAgICAgICAgLy8gYm9yZGVyOiAxcHggZGFzaGVkICNjY2M7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDQwcHg7XG5cbiAgICAgICAgJiA+IC50aXRsZSB7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBtYXJnaW4tbGVmdDogNXB4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmxvZ2luLWRhdGEge1xuICAgICAgICAucGhvbmUsXG4gICAgICAgIC5lbWFpbCxcbiAgICAgICAgLnBhc3N3b3JkIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cbiAgICAgICAgICAgIHBhZGRpbmc6IDVweDtcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDVweDtcblxuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuXG4gICAgICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAudGl0bGUge1xuICAgICAgICAgICAgICAgIC5pY29uIHtcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWwtYWxpZ246IHRleHQtdG9wO1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogQGFjdGl2ZTtcblxuICAgICAgICAgICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAudmFsdWUsXG4gICAgICAgICAgICAuZGF0ZS1vZi1sYXN0LXVwZGF0ZSB7XG4gICAgICAgICAgICAgICAgY29sb3I6ICNhYmFiYWI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuaW5jcmVhc2VkLXNlY3VyaXR5IHtcbiAgICAgICAgJiA+IC50aXRsZSB7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiA1cHg7XG4gICAgICAgIH1cblxuICAgICAgICAuaGVscCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICBjb2xvcjogQGxpZ2h0O1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5jb25maXJtLWVtYWlsLFxuICAgICAgICAuY29uZmlybS1waG9uZSB7XG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICAgICAgICAgICAgICB3aWR0aDogMjhweDtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDI4cHg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5jb25maXJtZWQtaWNvbiB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDEwcHg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC50aXRsZSB7XG4gICAgICAgICAgICAgICAgcGFkZGluZzogMTBweDtcblxuICAgICAgICAgICAgICAgICY6bm90KC5jb25maXJtZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG5cbiAgICAgICAgICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKEBhY3RpdmUsIDAuMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuZGVsZXRlLXByb2ZpbGUge1xuICAgICAgICAudGl0bGUge1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLmhlbHAge1xuICAgICAgICAgICAgY29sb3I6IEBsaWdodDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcblxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5kZWxldGUtYWNjb3VudC1idG4ge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblxuICAgICAgICAgICAgd2lkdGg6IDE1MHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiA3MHB4O1xuXG4gICAgICAgICAgICBmb250LWZhbWlseTogQGZmO1xuICAgICAgICAgICAgZm9udC1zaXplOiAyMnB4O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgICAgIGNvbG9yOiBAYWN0aXZlO1xuXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICAgICAgICAgICAgYm9yZGVyOiAzcHggc29saWQgQGFjdGl2ZTtcbiAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XG5cbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMTVzO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAzMnB4O1xuICAgICAgICAgICAgICAgIGhlaWdodDogMzJweDtcblxuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IEBhY3RpdmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAudGl0bGUge1xuICAgICAgICBzdmcge1xuICAgICAgICAgICAgaGVpZ2h0OiAyNHB4O1xuICAgICAgICAgICAgd2lkdGg6IDI0cHg7XG5cbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiB0ZXh0LXRvcDtcbiAgICAgICAgICAgIGNvbG9yOiBAYWN0aXZlO1xuICAgICAgICAgICAgZmlsbDogQGFjdGl2ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLmNoYW5nZUVtYWlsLFxuLmNoYW5nZVBob25lLFxuLmNoYW5nZVBhc3N3b3JkIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXG4gICAgcGFkZGluZzogMjBweDtcblxuICAgIC5iYWNrIHtcbiAgICAgICAgd2lkdGg6IDI4cHg7XG4gICAgICAgIGhlaWdodDogMjhweDtcblxuICAgICAgICBjb2xvcjogQGFjdGl2ZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycztcblxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAgICAgJjphY3RpdmUge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2RkZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5lcnJvciB7XG4gICAgICAgIHdpZHRoOiA4MCU7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMjBweDtcbiAgICAgICAgbWFyZ2luOiA0MHB4IGF1dG8gMTBweDtcblxuICAgICAgICBib3JkZXI6IDJweCBzb2xpZCBAZGFuZ2VyO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoQGRhbmdlciwgMC4yKTtcbiAgICAgICAgY29sb3I6IGRhcmtlbihAZGFuZ2VyLCA1JSk7XG5cbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgIC5jbG9zZSB7XG4gICAgICAgICAgICB3aWR0aDogOXB4O1xuICAgICAgICAgICAgaGVpZ2h0OiA5cHg7XG5cbiAgICAgICAgICAgIGZpbGw6IGRhcmtlbihAZGFuZ2VyLCAxMCUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLnRpdGxlIHtcbiAgICAgICAgZm9udC1zaXplOiAyMHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIG1hcmdpbi10b3A6IDQwcHg7XG4gICAgfVxufVxuXG4uY2hhbmdlRW1haWwsXG4uY2hhbmdlUGhvbmUge1xuICAgIC5oZWxwIHtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBjb2xvcjogQGxpZ2h0O1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG5cbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMzBweDtcbiAgICB9XG5cbiAgICAuY29udHJvbCB7XG4gICAgICAgIG1hcmdpbjogMCBhdXRvIDIwcHg7XG4gICAgICAgIHdpZHRoOiA4MCU7XG4gICAgICAgIGhlaWdodDogNDBweDtcblxuICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgIHBhZGRpbmc6IDEwcHg7XG5cbiAgICAgICAgZm9udC1mYW1pbHk6IEBmZjtcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuXG4gICAgICAgIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjJzO1xuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiBsaWdodGVuKEBhY3RpdmUsIDEwJSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuYnRuIHtcbiAgICAgICAgbWFyZ2luOiAwIGF1dG87XG4gICAgfVxufVxuXG4uY2hhbmdlUGFzc3dvcmQge1xuICAgIC50aXRsZSB7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XG4gICAgfVxuXG4gICAgLmNoYW5nZVBhc3N3b3JkRm9ybSB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgaW5wdXQge1xuICAgICAgICAgICAgZm9udC1mYW1pbHk6IEBmZjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLnBhc3N3b3JkLXdyYXBwZXIge1xuICAgIHdpZHRoOiA4MCU7XG4gICAgbWFyZ2luLWJvdHRvbTogMjBweDtcblxuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAgIGxhYmVsIHtcbiAgICAgICAgY29sb3I6IEBsaWdodDtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBtYXJnaW4tYm90dG9tOiA0cHg7XG5cbiAgICAgICAgLnVzZXItc2VsZWN0LW5vbmUoKTtcbiAgICB9XG5cbiAgICBpbnB1dCB7XG4gICAgICAgIGhlaWdodDogNDBweDtcblxuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgIG91dGxpbmU6IG5vbmU7XG5cbiAgICAgICAgcGFkZGluZzogMTBweDtcblxuICAgICAgICB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgMC4ycztcblxuICAgICAgICBmb250LXNpemU6IDE2cHg7XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6IGxpZ2h0ZW4oQGFjdGl2ZSwgMTAlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5leWUtaWNvbiB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgcmlnaHQ6IDEycHg7XG4gICAgICAgIHRvcDogMzBweDtcblxuICAgICAgICB3aWR0aDogMzJweDtcbiAgICAgICAgaGVpZ2h0OiAzMnB4O1xuXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycztcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgd2lkdGg6IDI0cHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDI0cHg7XG5cbiAgICAgICAgICAgIGNvbG9yOiBAbGlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICAmOmFjdGl2ZSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uaHlzdG1vZGFsX193aW5kb3cge1xuICAgIGJvcmRlci1yYWRpdXM6IDE1cHg7XG59XG5cbi5kZWxldGUtYWNjb3VudC1jb25maXJtYXRpb24ge1xuICAgIHBhZGRpbmc6IDUwcHg7XG5cbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgIHN2ZyB7XG4gICAgICAgIGNvbG9yOiBAYWN0aXZlO1xuICAgIH1cblxuICAgIC5oZWxwIHtcbiAgICAgICAgd2lkdGg6IDYwJTtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBjb2xvcjogQGxpZ2h0O1xuXG4gICAgICAgIG1hcmdpbjogMjBweCAwO1xuICAgIH1cblxuICAgIGlucHV0IHtcbiAgICAgICAgZm9udC1mYW1pbHk6IEBmZjtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICB9XG59XG4iXX0= */"] });


/***/ }),

/***/ "doCK":
/*!*********************************************!*\
  !*** ./src/app/directives/var.directive.ts ***!
  \*********************************************/
/*! exports provided: VarDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VarDirective", function() { return VarDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class VarDirective {
}
VarDirective.ɵfac = function VarDirective_Factory(t) { return new (t || VarDirective)(); };
VarDirective.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({ type: VarDirective, selectors: [["", "var", ""]], inputs: { var: "var" }, exportAs: ["var"] });


/***/ }),

/***/ "eSCP":
/*!*********************************************!*\
  !*** ./src/app/store/posts/post.effects.ts ***!
  \*********************************************/
/*! exports provided: PostEffects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostEffects", function() { return PostEffects; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/effects */ "9jGm");
/* harmony import */ var _post_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./post.actions */ "YBVe");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _services_posts_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/posts.service */ "jwUf");








class PostEffects {
    constructor(actions$, postsService) {
        this.actions$ = actions$;
        this.postsService = postsService;
    }
    createPost$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_post_actions__WEBPACK_IMPORTED_MODULE_2__["POST_CREATE_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            return this.postsService
                .createPost(action.payload)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(post => {
                console.log('PAYLOAD:', action.payload);
                return new _post_actions__WEBPACK_IMPORTED_MODULE_2__["PostCreateSuccessAction"]({ post });
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])(new _post_actions__WEBPACK_IMPORTED_MODULE_2__["PostCreateFailedAction"]({ err }))));
        }));
    }
    editPost$() { }
    removePost$() { }
    likePost$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_post_actions__WEBPACK_IMPORTED_MODULE_2__["POST_LIKE_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            const payload = action.payload;
            return this.postsService
                .likePost(payload.postId, payload.userId)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(like => {
                return new _post_actions__WEBPACK_IMPORTED_MODULE_2__["PostLikeSuccessAction"]({
                    postId: payload.postId,
                    userId: payload.userId,
                });
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])(new _post_actions__WEBPACK_IMPORTED_MODULE_2__["PostLikeFailedAction"]({ err }))));
        }));
    }
    dontLikePost$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_post_actions__WEBPACK_IMPORTED_MODULE_2__["POST_DONT_LIKE_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            const payload = action.payload;
            return this.postsService
                .dontLikePost(payload.postId, payload.userId)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(like => {
                return new _post_actions__WEBPACK_IMPORTED_MODULE_2__["PostDontLikeSuccessAction"]({
                    postId: payload.postId,
                    userId: payload.userId,
                });
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])(new _post_actions__WEBPACK_IMPORTED_MODULE_2__["PostDontLikeFailedAction"]({ err }))));
        }));
    }
    addComment$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_post_actions__WEBPACK_IMPORTED_MODULE_2__["COMMENT_CREATE_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            const payload = action.payload;
            return this.postsService
                .createComment(payload.commentInfo, payload.postId)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(comments => {
                return new _post_actions__WEBPACK_IMPORTED_MODULE_2__["CommentCreateSuccessAction"](Object.assign(Object.assign({}, comments), { postId: payload.postId }));
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])(new _post_actions__WEBPACK_IMPORTED_MODULE_2__["CommentCreateFailedAction"]({ err }))));
        }));
    }
    getPosts$() {
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_post_actions__WEBPACK_IMPORTED_MODULE_2__["POST_GET_ACTION_TYPE"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            return this.postsService.getPosts(action.payload.id).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(posts => {
                return posts.posts;
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(posts => new _post_actions__WEBPACK_IMPORTED_MODULE_2__["PostGetSuccessAction"]({ posts })), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])(new _post_actions__WEBPACK_IMPORTED_MODULE_2__["PostGetFailedAction"]({ err }))));
        }));
    }
}
PostEffects.ɵfac = function PostEffects_Factory(t) { return new (t || PostEffects)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_services_posts_service__WEBPACK_IMPORTED_MODULE_6__["PostsService"])); };
PostEffects.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({ token: PostEffects, factory: PostEffects.ɵfac });
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], PostEffects.prototype, "createPost$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], PostEffects.prototype, "likePost$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], PostEffects.prototype, "dontLikePost$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], PostEffects.prototype, "addComment$", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])()
], PostEffects.prototype, "getPosts$", null);


/***/ }),

/***/ "fDhk":
/*!**********************************************************************!*\
  !*** ./src/app/views/profile/profile-side/profile-side.component.ts ***!
  \**********************************************************************/
/*! exports provided: ProfileSideComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileSideComponent", function() { return ProfileSideComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class ProfileSideComponent {
    constructor() { }
    // @Input() isMyProfile: boolean = false
    ngOnInit() { }
}
ProfileSideComponent.ɵfac = function ProfileSideComponent_Factory(t) { return new (t || ProfileSideComponent)(); };
ProfileSideComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ProfileSideComponent, selectors: [["app-profile-side"]], decls: 96, vars: 0, consts: [[1, "profile__sidebar"], [1, "dashboard"], [1, "dashboard__header"], ["href", "#", 1, "link", "more"], [1, "stats"], [1, "stat"], [1, "count"], [1, "description"], [1, "visitors"], [1, "visitors__header"], [1, "visitor"], [1, "avatar"], ["src", "../../../../assets/img/photos/Photo.png", "alt", "ava"], [1, "name"], ["src", "../../../../assets/img/photos/Photo2.png", "alt", "ava"], ["src", "../../../../assets/img/photos/Photo3.png", "alt", "ava"], ["src", "../../../../assets/img/photos/Photo4.png", "alt", "ava"], ["src", "../../../../assets/img/photos/Photo5.png", "alt", "ava"], [1, "courses"], [1, "courses__header"], [1, "course"], ["src", "../../../../assets/img/courses/Course.png", "alt", "course", 1, "picture"], [1, "views"], ["src", "../../../../assets/img/courses/Course2.png", "alt", "course", 1, "picture"], ["src", "../../../../assets/img/courses/Course3.png", "alt", "course", 1, "picture"]], template: function ProfileSideComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "YOUR DASHBOARD");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "GO TO STATS");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "299");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "views today");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "15");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "post views");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "37");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "search appereances");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "VISITORS");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "VIEW ALL");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](31, "img", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "Darlene Black");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, "HR-manager, 10 000 connec...");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](39, "img", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, "Theresa Steward");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "iOS developer");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](47, "img", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "Brandon Wilson");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, "Senior UX designer");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](55, "img", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](58, "Kyle Fisher");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](60, "Product designer at Com...");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](63, "img", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](66, "Audrey Alexander");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](67, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](68, "Team lead at Google");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](69, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](71, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](72, "YOU MAY LIKE THESE COURSES");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](73, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](74, "img", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](75, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](76, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](77, "UX Foundations: Prototyping");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](78, "p", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](79, "27,959 viewers");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](80, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](81, "img", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](82, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](83, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](84, "Designing with Adobe XD and pro");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](85, "p", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](86, "9,122 viewers");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](87, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](88, "img", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](89, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](90, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](91, "UX Foundations: Styles and GUIs");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](92, "p", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](93, "13,858 viewers");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](94, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](95, "SEE ALL RECOMENDATIONS");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: [".profile__sidebar[_ngcontent-%COMP%] {\n  max-width: 290px;\n  margin: 40px 0;\n}\n.profile__sidebar[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:not(:last-child) {\n  margin-bottom: 20px;\n}\n.profile__sidebar[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  padding: 25px 30px;\n}\n.profile__sidebar[_ngcontent-%COMP%]   .dashboard[_ngcontent-%COMP%], .profile__sidebar[_ngcontent-%COMP%]   .visitors[_ngcontent-%COMP%], .profile__sidebar[_ngcontent-%COMP%]   .courses[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.profile__sidebar[_ngcontent-%COMP%]   .dashboard__header[_ngcontent-%COMP%], .profile__sidebar[_ngcontent-%COMP%]   .visitors__header[_ngcontent-%COMP%], .profile__sidebar[_ngcontent-%COMP%]   .courses__header[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-bottom: 30px;\n  display: flex;\n  justify-content: space-between;\n  font-size: 13px;\n  font-weight: 600;\n}\n.profile__sidebar[_ngcontent-%COMP%]   .dashboard__header[_ngcontent-%COMP%]   .more[_ngcontent-%COMP%], .profile__sidebar[_ngcontent-%COMP%]   .visitors__header[_ngcontent-%COMP%]   .more[_ngcontent-%COMP%], .profile__sidebar[_ngcontent-%COMP%]   .courses__header[_ngcontent-%COMP%]   .more[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.profile__sidebar[_ngcontent-%COMP%]   .dashboard[_ngcontent-%COMP%]   .stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n}\n.profile__sidebar[_ngcontent-%COMP%]   .dashboard[_ngcontent-%COMP%]   .stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%]   .count[_ngcontent-%COMP%] {\n  height: 65px;\n  font-family: 'Lato', sans-serif;\n  font-size: 52px;\n  font-weight: 400;\n  color: #0871a8;\n}\n.profile__sidebar[_ngcontent-%COMP%]   .dashboard[_ngcontent-%COMP%]   .stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 400;\n}\n.profile__sidebar[_ngcontent-%COMP%]   .visitors[_ngcontent-%COMP%]   .visitor[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  margin-bottom: 15px;\n}\n.profile__sidebar[_ngcontent-%COMP%]   .visitors[_ngcontent-%COMP%]   .visitor[_ngcontent-%COMP%]   .avatar[_ngcontent-%COMP%] {\n  width: 52px;\n  height: 52px;\n  border-radius: 50%;\n  margin-right: 15px;\n}\n.profile__sidebar[_ngcontent-%COMP%]   .visitors[_ngcontent-%COMP%]   .visitor[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n}\n.profile__sidebar[_ngcontent-%COMP%]   .visitors[_ngcontent-%COMP%]   .visitor[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%] {\n  font-size: 10px;\n  font-weight: 400;\n}\n.profile__sidebar[_ngcontent-%COMP%]   .courses[_ngcontent-%COMP%]   .course[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  margin-bottom: 15px;\n}\n.profile__sidebar[_ngcontent-%COMP%]   .courses[_ngcontent-%COMP%]   .course[_ngcontent-%COMP%]   .picture[_ngcontent-%COMP%] {\n  margin-right: 15px;\n}\n.profile__sidebar[_ngcontent-%COMP%]   .courses[_ngcontent-%COMP%]   .course[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n}\n.profile__sidebar[_ngcontent-%COMP%]   .courses[_ngcontent-%COMP%]   .course[_ngcontent-%COMP%]   .views[_ngcontent-%COMP%] {\n  font-size: 10px;\n  font-weight: 400;\n}\n.profile__sidebar[_ngcontent-%COMP%]   .courses[_ngcontent-%COMP%]   .more[_ngcontent-%COMP%] {\n  margin-top: 25px;\n  font-size: 13px;\n  font-weight: 500;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUtc2lkZS5jb21wb25lbnQubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNJLGdCQUFBO0VBRUEsY0FBQTtBQUZKO0FBSUk7RUFDSSxtQkFBQTtBQUZSO0FBS0k7RUFDSSxrQkFBQTtBQUhSO0FBUEE7OztFQWdCUSxXQUFBO0FBSlI7QUFNUTs7O0VBQ0ksV0FBQTtFQUNBLG1CQUFBO0VBRUEsYUFBQTtFQUNBLDhCQUFBO0VBRUEsZUFBQTtFQUNBLGdCQUFBO0FBSlo7QUFKUTs7O0VBV1EsZ0JBQUE7QUFGaEI7QUEzQkE7RUFxQ2dCLG1CQUFBO0FBUGhCO0FBOUJBO0VBd0NvQixZQUFBO0VBRUEsK0JBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFFQSxjQUFBO0FBVHBCO0FBckNBO0VBa0RvQixlQUFBO0VBQ0EsZ0JBQUE7QUFWcEI7QUF6Q0E7RUEyRFksYUFBQTtFQUNBLG1CQUFBO0VBRUEsbUJBQUE7QUFoQlo7QUE5Q0E7RUFpRWdCLFdBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFFQSxrQkFBQTtBQWpCaEI7QUFwREE7RUF5RWdCLGVBQUE7RUFDQSxnQkFBQTtBQWxCaEI7QUF4REE7RUE4RWdCLGVBQUE7RUFDQSxnQkFBQTtBQW5CaEI7QUE1REE7RUFzRlksYUFBQTtFQUNBLG1CQUFBO0VBRUEsbUJBQUE7QUF4Qlo7QUFqRUE7RUE0RmdCLGtCQUFBO0FBeEJoQjtBQXBFQTtFQWdHZ0IsZUFBQTtFQUNBLGdCQUFBO0FBekJoQjtBQXhFQTtFQXFHZ0IsZUFBQTtFQUNBLGdCQUFBO0FBMUJoQjtBQTVFQTtFQTJHWSxnQkFBQTtFQUVBLGVBQUE7RUFDQSxnQkFBQTtBQTdCWiIsImZpbGUiOiJwcm9maWxlLXNpZGUuY29tcG9uZW50Lmxlc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICdzcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMnO1xuXG4ucHJvZmlsZV9fc2lkZWJhciB7XG4gICAgbWF4LXdpZHRoOiAyOTBweDtcblxuICAgIG1hcmdpbjogNDBweCAwO1xuXG4gICAgJiA+IGRpdjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcbiAgICB9XG5cbiAgICAmID4gZGl2IHtcbiAgICAgICAgcGFkZGluZzogMjVweCAzMHB4O1xuICAgIH1cblxuICAgIC5kYXNoYm9hcmQsXG4gICAgLnZpc2l0b3JzLFxuICAgIC5jb3Vyc2VzIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG5cbiAgICAgICAgJl9faGVhZGVyIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMzBweDtcblxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcblxuICAgICAgICAgICAgZm9udC1zaXplOiAxM3B4O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcblxuICAgICAgICAgICAgLm1vcmUge1xuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuZGFzaGJvYXJkIHtcbiAgICAgICAgLnN0YXRzIHtcbiAgICAgICAgICAgIC5zdGF0IHtcbiAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuXG4gICAgICAgICAgICAgICAgLmNvdW50IHtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA2NXB4O1xuXG4gICAgICAgICAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBAbnVtYmVycy1mZjtcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiA1MnB4O1xuICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNDAwO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBAYWN0aXZlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC5kZXNjcmlwdGlvbiB7XG4gICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAudmlzaXRvcnMge1xuICAgICAgICAudmlzaXRvciB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTVweDtcblxuICAgICAgICAgICAgLmF2YXRhciB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDUycHg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA1MnB4O1xuICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcblxuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTVweDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLm5hbWUge1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAuZGVzY3JpcHRpb24ge1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNDAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmNvdXJzZXMge1xuICAgICAgICAuY291cnNlIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxNXB4O1xuXG4gICAgICAgICAgICAucGljdHVyZSB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxNXB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAubmFtZSB7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC52aWV3cyB7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxMHB4O1xuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAubW9yZSB7XG4gICAgICAgICAgICBtYXJnaW4tdG9wOiAyNXB4O1xuXG4gICAgICAgICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19 */", ".profile[_ngcontent-%COMP%] {\n  margin: 0 auto;\n  max-width: 1440px;\n  font-family: 'Poppins', sans-serif;\n  color: #181818;\n}\n.profile__wrapper[_ngcontent-%COMP%] {\n  max-width: 1440px;\n  width: 100%;\n  display: flex;\n  flex-wrap: wrap;\n  margin: 0 90px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUuY29tcG9uZW50Lmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxjQUFBO0VBQ0EsaUJBQUE7RUFFQSxrQ0FBQTtFQUNBLGNBQUE7QUFGSjtBQUlJO0VBQ0ksaUJBQUE7RUFDQSxXQUFBO0VBRUEsYUFBQTtFQUNBLGVBQUE7RUFFQSxjQUFBO0FBSlIiLCJmaWxlIjoicHJvZmlsZS5jb21wb25lbnQubGVzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL3ZhcmlhYmxlcyc7XG5cbi5wcm9maWxlIHtcbiAgICBtYXJnaW46IDAgYXV0bztcbiAgICBtYXgtd2lkdGg6IDE0NDBweDtcblxuICAgIGZvbnQtZmFtaWx5OiBAZmY7XG4gICAgY29sb3I6IEBiYXNlO1xuXG4gICAgJl9fd3JhcHBlciB7XG4gICAgICAgIG1heC13aWR0aDogMTQ0MHB4O1xuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LXdyYXA6IHdyYXA7XG5cbiAgICAgICAgbWFyZ2luOiAwIDkwcHg7XG4gICAgfVxufVxuIl19 */"] });


/***/ }),

/***/ "fLR6":
/*!********************************************************!*\
  !*** ./src/app/store/my-profile/my-profile.actions.ts ***!
  \********************************************************/
/*! exports provided: GET_MY_PROFILE_INFO_ACTION_TYPE, GET_MY_PROFILE_INFO_SUCCESS_ACTION_TYPE, ACCEPT_CONNECTION_ACTION_TYPE, ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE, DECLINE_CONNECTION_ACTION_TYPE, DECLINE_CONNECTION_SUCCESS_ACTION_TYPE, CANCEL_CONNECTION_ACTION_TYPE, CANCEL_CONNECTION_SUCCESS_ACTION_TYPE, REMOVE_CONNECTION_ACTION_TYPE, REMOVE_CONNECTION_SUCCESS_ACTION_TYPE, CHANGE_AVATAR_ACTION_TYPE, CHANGE_AVATAR_SUCCESS_ACTION_TYPE, DELETE_AVATAR_SUCCESS_ACTION_TYPE, CHANGE_ROLE_ACTION_TYPE, CHANGE_ROLE_SUCCESS_ACTION_TYPE, CHANGE_COMPANY_ACTION_TYPE, CHANGE_COMPANY_SUCCESS_ACTION_TYPE, CHANGE_ABOUT_ACTION_TYPE, CHANGE_ABOUT_SUCCESS_ACTION_TYPE, CHANGE_PROFESSION_ACTION_TYPE, CHANGE_PROFESSION_SUCCESS_ACTION_TYPE, CHANGE_LOCALITY_ACTION_TYPE, CHANGE_LOCALITY_SUCCESS_ACTION_TYPE, CHANGE_CONTACT_INFO_ACTION_TYPE, CHANGE_CONTACT_INFO_SUCCESS_ACTION_TYPE, CHANGE_PROJECTS_ACTION_TYPE, CHANGE_PROJECTS_SUCCESS_ACTION_TYPE, CHANGE_EXPERIENCE_ACTION_TYPE, CHANGE_EXPERIENCE_SUCCESS_ACTION_TYPE, CHANGE_EDUCATION_ACTION_TYPE, CHANGE_EDUCATION_SUCCESS_ACTION_TYPE, JOIN_TO_CHAT, MyProfileGetInfoAction, MyProfileGetInfoSuccessAction, MyProfileAcceptConnectionAction, MyProfileDeclineConnectionAction, MyProfileCancelConnectionAction, MyProfileRemoveConnectionAction, MyProfileAcceptConnectionSuccessAction, MyProfileDeclineConnectionSuccessAction, MyProfileCancelConnectionSuccessAction, MyProfileRemoveConnectionSuccessAction, MyProfileChangeAvatarAction, MyProfileChangeAvatarSuccessAction, MyProfileDeleteAvatarSuccessAction, MyProfileChangeRoleAction, MyProfileChangeRoleSuccessAction, MyProfileChangeCompanyAction, MyProfileChangeCompanySuccessAction, MyProfileChangeAboutAction, MyProfileChangeAboutSuccessAction, MyProfileChangeProfessionAction, MyProfileChangeProfessionSuccessAction, MyProfileChangeLocalityAction, MyProfileChangeLocalitySuccessAction, MyProfileChangeContactInfoAction, MyProfileChangeContactInfoSuccessAction, MyProfileChangeProjectsAction, MyProfileChangeProjectsSuccessAction, MyProfileChangeExperienceAction, MyProfileChangeExperienceSuccessAction, MyProfileChangeEducationAction, MyProfileChangeEducationSuccessAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_MY_PROFILE_INFO_ACTION_TYPE", function() { return GET_MY_PROFILE_INFO_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_MY_PROFILE_INFO_SUCCESS_ACTION_TYPE", function() { return GET_MY_PROFILE_INFO_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ACCEPT_CONNECTION_ACTION_TYPE", function() { return ACCEPT_CONNECTION_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE", function() { return ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DECLINE_CONNECTION_ACTION_TYPE", function() { return DECLINE_CONNECTION_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DECLINE_CONNECTION_SUCCESS_ACTION_TYPE", function() { return DECLINE_CONNECTION_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CANCEL_CONNECTION_ACTION_TYPE", function() { return CANCEL_CONNECTION_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CANCEL_CONNECTION_SUCCESS_ACTION_TYPE", function() { return CANCEL_CONNECTION_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REMOVE_CONNECTION_ACTION_TYPE", function() { return REMOVE_CONNECTION_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REMOVE_CONNECTION_SUCCESS_ACTION_TYPE", function() { return REMOVE_CONNECTION_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_AVATAR_ACTION_TYPE", function() { return CHANGE_AVATAR_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_AVATAR_SUCCESS_ACTION_TYPE", function() { return CHANGE_AVATAR_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DELETE_AVATAR_SUCCESS_ACTION_TYPE", function() { return DELETE_AVATAR_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_ROLE_ACTION_TYPE", function() { return CHANGE_ROLE_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_ROLE_SUCCESS_ACTION_TYPE", function() { return CHANGE_ROLE_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_COMPANY_ACTION_TYPE", function() { return CHANGE_COMPANY_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_COMPANY_SUCCESS_ACTION_TYPE", function() { return CHANGE_COMPANY_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_ABOUT_ACTION_TYPE", function() { return CHANGE_ABOUT_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_ABOUT_SUCCESS_ACTION_TYPE", function() { return CHANGE_ABOUT_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_PROFESSION_ACTION_TYPE", function() { return CHANGE_PROFESSION_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_PROFESSION_SUCCESS_ACTION_TYPE", function() { return CHANGE_PROFESSION_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_LOCALITY_ACTION_TYPE", function() { return CHANGE_LOCALITY_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_LOCALITY_SUCCESS_ACTION_TYPE", function() { return CHANGE_LOCALITY_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_CONTACT_INFO_ACTION_TYPE", function() { return CHANGE_CONTACT_INFO_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_CONTACT_INFO_SUCCESS_ACTION_TYPE", function() { return CHANGE_CONTACT_INFO_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_PROJECTS_ACTION_TYPE", function() { return CHANGE_PROJECTS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_PROJECTS_SUCCESS_ACTION_TYPE", function() { return CHANGE_PROJECTS_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_EXPERIENCE_ACTION_TYPE", function() { return CHANGE_EXPERIENCE_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_EXPERIENCE_SUCCESS_ACTION_TYPE", function() { return CHANGE_EXPERIENCE_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_EDUCATION_ACTION_TYPE", function() { return CHANGE_EDUCATION_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_EDUCATION_SUCCESS_ACTION_TYPE", function() { return CHANGE_EDUCATION_SUCCESS_ACTION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JOIN_TO_CHAT", function() { return JOIN_TO_CHAT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileGetInfoAction", function() { return MyProfileGetInfoAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileGetInfoSuccessAction", function() { return MyProfileGetInfoSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileAcceptConnectionAction", function() { return MyProfileAcceptConnectionAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileDeclineConnectionAction", function() { return MyProfileDeclineConnectionAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileCancelConnectionAction", function() { return MyProfileCancelConnectionAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileRemoveConnectionAction", function() { return MyProfileRemoveConnectionAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileAcceptConnectionSuccessAction", function() { return MyProfileAcceptConnectionSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileDeclineConnectionSuccessAction", function() { return MyProfileDeclineConnectionSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileCancelConnectionSuccessAction", function() { return MyProfileCancelConnectionSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileRemoveConnectionSuccessAction", function() { return MyProfileRemoveConnectionSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeAvatarAction", function() { return MyProfileChangeAvatarAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeAvatarSuccessAction", function() { return MyProfileChangeAvatarSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileDeleteAvatarSuccessAction", function() { return MyProfileDeleteAvatarSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeRoleAction", function() { return MyProfileChangeRoleAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeRoleSuccessAction", function() { return MyProfileChangeRoleSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeCompanyAction", function() { return MyProfileChangeCompanyAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeCompanySuccessAction", function() { return MyProfileChangeCompanySuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeAboutAction", function() { return MyProfileChangeAboutAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeAboutSuccessAction", function() { return MyProfileChangeAboutSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeProfessionAction", function() { return MyProfileChangeProfessionAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeProfessionSuccessAction", function() { return MyProfileChangeProfessionSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeLocalityAction", function() { return MyProfileChangeLocalityAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeLocalitySuccessAction", function() { return MyProfileChangeLocalitySuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeContactInfoAction", function() { return MyProfileChangeContactInfoAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeContactInfoSuccessAction", function() { return MyProfileChangeContactInfoSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeProjectsAction", function() { return MyProfileChangeProjectsAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeProjectsSuccessAction", function() { return MyProfileChangeProjectsSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeExperienceAction", function() { return MyProfileChangeExperienceAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeExperienceSuccessAction", function() { return MyProfileChangeExperienceSuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeEducationAction", function() { return MyProfileChangeEducationAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProfileChangeEducationSuccessAction", function() { return MyProfileChangeEducationSuccessAction; });
const GET_MY_PROFILE_INFO_ACTION_TYPE = '[MY PROFILE] get info';
const GET_MY_PROFILE_INFO_SUCCESS_ACTION_TYPE = '[MY PROFILE] get info success';
const ACCEPT_CONNECTION_ACTION_TYPE = '[MY PROFILE] accept connection';
const ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE = '[MY PROFILE] success accept connection';
const DECLINE_CONNECTION_ACTION_TYPE = '[MY PROFILE] decline connection';
const DECLINE_CONNECTION_SUCCESS_ACTION_TYPE = '[MY PROFILE] success decline connection';
const CANCEL_CONNECTION_ACTION_TYPE = '[MY PROFILE] cancel connection';
const CANCEL_CONNECTION_SUCCESS_ACTION_TYPE = '[MY PROFILE] success cancel connection';
const REMOVE_CONNECTION_ACTION_TYPE = '[MY PROFILE] remove connection';
const REMOVE_CONNECTION_SUCCESS_ACTION_TYPE = '[MY PROFILE] remove connection success';
const CHANGE_AVATAR_ACTION_TYPE = '[MY PROFILE] change avatar';
const CHANGE_AVATAR_SUCCESS_ACTION_TYPE = '[MY PROFILE] change avatar success';
const DELETE_AVATAR_SUCCESS_ACTION_TYPE = '[MY PROFILE] delete avatar success';
// change additional information action types
const CHANGE_ROLE_ACTION_TYPE = '[MY PROFILE] change role';
const CHANGE_ROLE_SUCCESS_ACTION_TYPE = '[MY PROFILE] change role success';
const CHANGE_COMPANY_ACTION_TYPE = '[MY PROFILE] change company';
const CHANGE_COMPANY_SUCCESS_ACTION_TYPE = '[MY PROFILE] change company success';
const CHANGE_ABOUT_ACTION_TYPE = '[MY PROFILE] change about';
const CHANGE_ABOUT_SUCCESS_ACTION_TYPE = '[MY PROFILE] change about success';
const CHANGE_PROFESSION_ACTION_TYPE = '[MY PROFILE] change profession';
const CHANGE_PROFESSION_SUCCESS_ACTION_TYPE = '[MY PROFILE] change profession success';
const CHANGE_LOCALITY_ACTION_TYPE = '[MY PROFILE] change locality';
const CHANGE_LOCALITY_SUCCESS_ACTION_TYPE = '[MY PROFILE] change locality success';
const CHANGE_CONTACT_INFO_ACTION_TYPE = '[MY PROFILE] change contact info';
const CHANGE_CONTACT_INFO_SUCCESS_ACTION_TYPE = '[MY PROFILE] change contact info success';
const CHANGE_PROJECTS_ACTION_TYPE = '[MY PROFILE] change projects';
const CHANGE_PROJECTS_SUCCESS_ACTION_TYPE = '[MY PROFILE] change projects success';
const CHANGE_EXPERIENCE_ACTION_TYPE = '[MY PROFILE] change experience';
const CHANGE_EXPERIENCE_SUCCESS_ACTION_TYPE = '[MY PROFILE] change experience success';
const CHANGE_EDUCATION_ACTION_TYPE = '[MY PROFILE] change education';
const CHANGE_EDUCATION_SUCCESS_ACTION_TYPE = '[MY PROFILE] change education success';
const JOIN_TO_CHAT = '[MY PROFILE] join to chat';
/* ACTIONS */
class MyProfileGetInfoAction {
    constructor(payload) {
        this.payload = payload;
        this.type = GET_MY_PROFILE_INFO_ACTION_TYPE;
    }
}
class MyProfileGetInfoSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = GET_MY_PROFILE_INFO_SUCCESS_ACTION_TYPE;
    }
}
class MyProfileAcceptConnectionAction {
    constructor(payload) {
        this.payload = payload;
        this.type = ACCEPT_CONNECTION_ACTION_TYPE;
    }
}
class MyProfileDeclineConnectionAction {
    constructor(payload) {
        this.payload = payload;
        this.type = DECLINE_CONNECTION_ACTION_TYPE;
    }
}
class MyProfileCancelConnectionAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CANCEL_CONNECTION_ACTION_TYPE;
    }
}
class MyProfileRemoveConnectionAction {
    constructor(payload) {
        this.payload = payload;
        this.type = REMOVE_CONNECTION_ACTION_TYPE;
    }
}
class MyProfileAcceptConnectionSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE;
    }
}
class MyProfileDeclineConnectionSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = DECLINE_CONNECTION_SUCCESS_ACTION_TYPE;
    }
}
class MyProfileCancelConnectionSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CANCEL_CONNECTION_SUCCESS_ACTION_TYPE;
    }
}
class MyProfileRemoveConnectionSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = REMOVE_CONNECTION_SUCCESS_ACTION_TYPE;
    }
}
class MyProfileChangeAvatarAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_AVATAR_ACTION_TYPE;
    }
}
class MyProfileChangeAvatarSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_AVATAR_SUCCESS_ACTION_TYPE;
    }
}
class MyProfileDeleteAvatarSuccessAction {
    constructor() {
        this.type = DELETE_AVATAR_SUCCESS_ACTION_TYPE;
    }
}
class MyProfileChangeRoleAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_ROLE_ACTION_TYPE;
    }
}
class MyProfileChangeRoleSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_ROLE_SUCCESS_ACTION_TYPE;
    }
}
class MyProfileChangeCompanyAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_COMPANY_ACTION_TYPE;
    }
}
class MyProfileChangeCompanySuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_COMPANY_SUCCESS_ACTION_TYPE;
    }
}
class MyProfileChangeAboutAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_ABOUT_ACTION_TYPE;
    }
}
class MyProfileChangeAboutSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_ABOUT_SUCCESS_ACTION_TYPE;
    }
}
class MyProfileChangeProfessionAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_PROFESSION_ACTION_TYPE;
    }
}
class MyProfileChangeProfessionSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_PROFESSION_SUCCESS_ACTION_TYPE;
    }
}
class MyProfileChangeLocalityAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_LOCALITY_ACTION_TYPE;
    }
}
class MyProfileChangeLocalitySuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_LOCALITY_SUCCESS_ACTION_TYPE;
    }
}
class MyProfileChangeContactInfoAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_CONTACT_INFO_ACTION_TYPE;
    }
}
class MyProfileChangeContactInfoSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_CONTACT_INFO_SUCCESS_ACTION_TYPE;
    }
}
class MyProfileChangeProjectsAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_PROJECTS_ACTION_TYPE;
    }
}
class MyProfileChangeProjectsSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_PROJECTS_SUCCESS_ACTION_TYPE;
    }
}
class MyProfileChangeExperienceAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_EXPERIENCE_ACTION_TYPE;
    }
}
class MyProfileChangeExperienceSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_EXPERIENCE_SUCCESS_ACTION_TYPE;
    }
}
class MyProfileChangeEducationAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_EDUCATION_ACTION_TYPE;
    }
}
class MyProfileChangeEducationSuccessAction {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_EDUCATION_SUCCESS_ACTION_TYPE;
    }
}


/***/ }),

/***/ "fb7c":
/*!*********************************************************************************************!*\
  !*** ./src/app/views/profile/edit-profile/edit-profile-main/edit-profile-main.component.ts ***!
  \*********************************************************************************************/
/*! exports provided: EditProfileMainComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditProfileMainComponent", function() { return EditProfileMainComponent; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../store/my-profile/my-profile.selectors */ "0jmn");
/* harmony import */ var _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../store/my-profile/my-profile.actions */ "fLR6");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _services_profile_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../services/profile.service */ "Aso2");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _edit_components_edit_personal_data_edit_personal_data_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../edit-components/edit-personal-data/edit-personal-data.component */ "oVQW");
/* harmony import */ var _edit_components_edit_login_and_security_edit_login_and_security_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../edit-components/edit-login-and-security/edit-login-and-security.component */ "dCal");
/* harmony import */ var _edit_components_edit_additional_info_edit_additional_info_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../edit-components/edit-additional-info/edit-additional-info.component */ "5hme");











function EditProfileMainComponent_app_edit_personal_data_0_Template(rf, ctx) { if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "app-edit-personal-data", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("saveChanges", function EditProfileMainComponent_app_edit_personal_data_0_Template_app_edit_personal_data_saveChanges_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r4); const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](); return ctx_r3.editPersonalInfo($event); })("changeAvatar", function EditProfileMainComponent_app_edit_personal_data_0_Template_app_edit_personal_data_changeAvatar_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r4); const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](); return ctx_r5.changeAvatarHandler($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](1, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](3, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](4, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](5, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("editStatus", ctx_r0.editPersonalInfoStatus)("firstName", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](1, 6, ctx_r0.firstName$) || "")("lastName", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 8, ctx_r0.lastName$) || "")("DOB", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](3, 10, ctx_r0.dateOfBirth$) || 1)("gender", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](4, 12, ctx_r0.gender$) || "")("avatar", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](5, 14, ctx_r0.avatar$) || "assets/img/avatar-man.png");
} }
function EditProfileMainComponent_app_edit_login_and_security_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "app-edit-login-and-security", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](1, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](3, "async");
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("email", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](1, 4, ctx_r1.email$) || "")("phone", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 6, ctx_r1.phone$) || "")("dateOfLastPasswordUpdate", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](3, 8, ctx_r1.dateOfLastPasswordUpdate$) || null)("profileId", ctx_r1.profileId);
} }
const _c0 = function () { return { country: "", city: "" }; };
const _c1 = function () { return []; };
function EditProfileMainComponent_app_edit_additional_info_2_Template(rf, ctx) { if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "app-edit-additional-info", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("onChange", function EditProfileMainComponent_app_edit_additional_info_2_Template_app_edit_additional_info_onChange_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r7); const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](); return ctx_r6.changeAdditionalInfoHandler($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](1, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](3, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](4, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](5, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](6, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](7, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](8, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("role", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](1, 8, ctx_r2.role$) || "")("about", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 10, ctx_r2.about$) || "")("profession", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](3, 12, ctx_r2.profession$) || "")("locality", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](4, 14, ctx_r2.locality$) || _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](24, _c0))("contactInfo", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](5, 16, ctx_r2.contactInfo$) || _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](25, _c1))("projects", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](6, 18, ctx_r2.projects$) || _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](26, _c1))("experience", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](7, 20, ctx_r2.experience$) || _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](27, _c1))("education", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](8, 22, ctx_r2.education$) || _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](28, _c1));
} }
class EditProfileMainComponent {
    constructor(store$, profileService) {
        this.store$ = store$;
        this.profileService = profileService;
        this.currentTab = '';
        this.profileId = -1;
        this.firstName$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileNameSelector"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(fullName => {
            console.log(fullName);
            return fullName.firstName;
        }));
        this.lastName$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileNameSelector"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(fullName => fullName.lastName));
        this.dateOfBirth$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileDOBSelector"]));
        this.gender$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileGenderSelector"]));
        this.avatar$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileAvatarSelector"]));
        this.email$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileEmailSelector"]));
        this.phone$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfilePhoneSelector"]));
        this.dateOfLastPasswordUpdate$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileDateOfLastPasswordUpdateSelector"]));
        this.profileId$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileIdSelector"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(2));
        this.role$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileRoleSelector"]));
        this.about$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileAboutSelector"]));
        this.profession$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileProfessionSelector"]));
        this.contactInfo$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileContactInfoSelector"]));
        this.locality$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileLocalitySelector"]));
        this.projects$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileProjectsSelector"]));
        this.experience$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileExperienceSelector"]));
        this.education$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileEducationSelector"]));
        this.editPersonalInfoStatus = null;
    }
    editPersonalInfo(info) {
        const [year, month, day] = info.dateOfBirth.split('-');
        console.log(day);
        this.profileService
            .editPersonalInfo(Object.assign(Object.assign({}, info), { dateOfBirth: Number(new Date(Number(year), Number(month) - 1, Number(day) + 1)) }), this.profileId)
            .subscribe(res => {
            if (res.status === 'changed') {
                this.editPersonalInfoStatus = {
                    status: 'success',
                    message: 'Personal information has been changed',
                };
            }
            if (res.status === 'not found')
                this.editPersonalInfoStatus = {
                    status: 'fail',
                    message: 'User is not found, try reloading this page',
                };
        });
    }
    changeAvatarHandler(data) {
        if (data.type === 'change')
            this.changeAvatar(data.file);
        if (data.type === 'delete')
            this.deleteAvatar();
    }
    changeAvatar(file) {
        this.profileService.changeAvatar(file, this.profileId).subscribe(res => {
            console.log(res);
            // console.log(res.message)
            this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_3__["MyProfileChangeAvatarSuccessAction"]({ url: res.url }));
        }, err => {
            console.error(err.message);
        });
    }
    deleteAvatar() {
        this.profileService.deleteAvatar(this.profileId).subscribe(res => {
            console.log(res.message);
            this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_3__["MyProfileDeleteAvatarSuccessAction"]());
        }, err => {
            console.error(err.message);
        });
    }
    changeRole(role) {
        this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_3__["MyProfileChangeRoleAction"]({ role, id: this.profileId }));
    }
    // changeCompany(company: any): void
    changeAbout(about) {
        this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_3__["MyProfileChangeAboutAction"]({ about, id: this.profileId }));
    }
    changeProfession(profession) {
        this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_3__["MyProfileChangeProfessionAction"]({ profession, id: this.profileId }));
    }
    changeLocality(locality) {
        this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_3__["MyProfileChangeLocalityAction"]({ locality, id: this.profileId }));
    }
    changeContactInfo(contactInfo) {
        this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_3__["MyProfileChangeContactInfoAction"]({ contactInfo, id: this.profileId }));
    }
    changeProjects(projects) {
        this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_3__["MyProfileChangeProjectsAction"]({ projects, id: this.profileId }));
    }
    changeExperience(experience) {
        this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_3__["MyProfileChangeExperienceAction"]({ experience, id: this.profileId }));
    }
    changeEducation(education) {
        this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_3__["MyProfileChangeEducationAction"]({ education, id: this.profileId }));
    }
    ngOnInit() {
        this.profileId$.subscribe(id => (this.profileId = id));
    }
    changeAdditionalInfoHandler(ev) {
        switch (ev.type) {
            case 'role':
                this.changeRole(ev.data);
                return;
            case 'about':
                this.changeAbout(ev.data);
                return;
            case 'profession':
                this.changeProfession(ev.data);
                return;
            case 'locality':
                this.changeLocality(ev.data);
                return;
            case 'contact-info':
                this.changeContactInfo(ev.data);
                return;
            case 'projects':
                this.changeProjects(ev.data);
                return;
            case 'experience':
                this.changeExperience(ev.data);
                return;
            case 'education':
                this.changeEducation(ev.data);
                return;
        }
    }
}
EditProfileMainComponent.ɵfac = function EditProfileMainComponent_Factory(t) { return new (t || EditProfileMainComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["Store"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_profile_service__WEBPACK_IMPORTED_MODULE_5__["ProfileService"])); };
EditProfileMainComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({ type: EditProfileMainComponent, selectors: [["app-edit-profile-main"]], inputs: { currentTab: "currentTab" }, decls: 3, vars: 3, consts: [[3, "editStatus", "firstName", "lastName", "DOB", "gender", "avatar", "saveChanges", "changeAvatar", 4, "ngIf"], [3, "email", "phone", "dateOfLastPasswordUpdate", "profileId", 4, "ngIf"], [3, "role", "about", "profession", "locality", "contactInfo", "projects", "experience", "education", "onChange", 4, "ngIf"], [3, "editStatus", "firstName", "lastName", "DOB", "gender", "avatar", "saveChanges", "changeAvatar"], [3, "email", "phone", "dateOfLastPasswordUpdate", "profileId"], [3, "role", "about", "profession", "locality", "contactInfo", "projects", "experience", "education", "onChange"]], template: function EditProfileMainComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](0, EditProfileMainComponent_app_edit_personal_data_0_Template, 6, 16, "app-edit-personal-data", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, EditProfileMainComponent_app_edit_login_and_security_1_Template, 4, 10, "app-edit-login-and-security", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, EditProfileMainComponent_app_edit_additional_info_2_Template, 9, 29, "app-edit-additional-info", 2);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.currentTab === "Personal data");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.currentTab === "Login and security");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.currentTab === "Additional information");
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], _edit_components_edit_personal_data_edit_personal_data_component__WEBPACK_IMPORTED_MODULE_7__["EditPersonalDataComponent"], _edit_components_edit_login_and_security_edit_login_and_security_component__WEBPACK_IMPORTED_MODULE_8__["EditLoginAndSecurityComponent"], _edit_components_edit_additional_info_edit_additional_info_component__WEBPACK_IMPORTED_MODULE_9__["EditAdditionalInfoComponent"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_6__["AsyncPipe"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJlZGl0LXByb2ZpbGUtbWFpbi5jb21wb25lbnQubGVzcyJ9 */"] });


/***/ }),

/***/ "gPp/":
/*!*************************************************************************!*\
  !*** ./src/app/components/account-deleted/account-deleted.component.ts ***!
  \*************************************************************************/
/*! exports provided: AccountDeletedComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountDeletedComponent", function() { return AccountDeletedComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class AccountDeletedComponent {
    constructor() { }
    ngOnInit() { }
}
AccountDeletedComponent.ɵfac = function AccountDeletedComponent_Factory(t) { return new (t || AccountDeletedComponent)(); };
AccountDeletedComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AccountDeletedComponent, selectors: [["app-account-deleted"]], decls: 2, vars: 0, template: function AccountDeletedComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Your account has been deleted!");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: ["h1[_ngcontent-%COMP%] {\n  margin-top: 60px;\n  text-align: center;\n  font-weight: 500;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY291bnQtZGVsZXRlZC5jb21wb25lbnQubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNJLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtBQURKIiwiZmlsZSI6ImFjY291bnQtZGVsZXRlZC5jb21wb25lbnQubGVzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL3ZhcmlhYmxlcyc7XG5cbmgxIHtcbiAgICBtYXJnaW4tdG9wOiA2MHB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBmb250LXdlaWdodDogNTAwO1xufVxuIl19 */"] });


/***/ }),

/***/ "i2O+":
/*!********************************************************!*\
  !*** ./src/app/store/my-profile/my-profile.reducer.ts ***!
  \********************************************************/
/*! exports provided: myProfileNode, myProfileReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileNode", function() { return myProfileNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "myProfileReducer", function() { return myProfileReducer; });
/* harmony import */ var _my_profile_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./my-profile.actions */ "fLR6");

const myProfileNode = 'my profile';
const initialState = {
    id: -1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    info: {
        isOnline: false,
        role: '',
        description: '',
        about: '',
        views: {
            current: 0,
            prev: 0,
        },
        connections: [],
        sentConnections: [],
        receivedConnections: [],
        posts: [],
        avatar: null,
        profileHeaderBg: null,
        dateOfBirth: 0,
        gender: '',
        profession: '',
        locality: {
            country: '',
            city: '',
        },
        contactInfo: [],
        projects: [],
        experience: [],
        education: [],
        dateOfLastPasswordUpdate: 0,
    },
};
const myProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case _my_profile_actions__WEBPACK_IMPORTED_MODULE_0__["GET_MY_PROFILE_INFO_SUCCESS_ACTION_TYPE"]:
            return action.payload.profile;
        case _my_profile_actions__WEBPACK_IMPORTED_MODULE_0__["ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE"]:
            console.log(action.payload);
            return Object.assign(Object.assign({}, state), { info: Object.assign(Object.assign({}, state.info), { connections: [
                        ...state.info.connections,
                        {
                            userId: action.payload.senderId,
                            date: action.payload.date,
                        },
                    ], receivedConnections: [] }) });
        case _my_profile_actions__WEBPACK_IMPORTED_MODULE_0__["DECLINE_CONNECTION_SUCCESS_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { info: Object.assign(Object.assign({}, state.info), { receivedConnections: state.info.receivedConnections.filter(user => user.userId !== action.payload.senderId) }) });
        case _my_profile_actions__WEBPACK_IMPORTED_MODULE_0__["CANCEL_CONNECTION_SUCCESS_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { info: Object.assign(Object.assign({}, state.info), { sentConnections: state.info.sentConnections.filter(user => user.userId !== action.payload.userId) }) });
        case _my_profile_actions__WEBPACK_IMPORTED_MODULE_0__["REMOVE_CONNECTION_SUCCESS_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { info: Object.assign(Object.assign({}, state.info), { connections: state.info.connections.filter(user => user.userId !== action.payload.userId) }) });
        case _my_profile_actions__WEBPACK_IMPORTED_MODULE_0__["CHANGE_AVATAR_SUCCESS_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { info: Object.assign(Object.assign({}, state.info), { avatar: Object.assign(Object.assign({}, state.info.avatar), { url: action.payload.url }) }) });
        case _my_profile_actions__WEBPACK_IMPORTED_MODULE_0__["DELETE_AVATAR_SUCCESS_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { info: Object.assign(Object.assign({}, state.info), { avatar: null }) });
        default:
            return state;
    }
};


/***/ }),

/***/ "iNhY":
/*!************************************************!*\
  !*** ./src/app/services/web-socket.service.ts ***!
  \************************************************/
/*! exports provided: WebSocketService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebSocketService", function() { return WebSocketService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var ngx_socket_io__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-socket-io */ "7JkF");



class WebSocketService {
    constructor(socket) {
        this.socket = socket;
        // this.socket = io(environment.server_url)
    }
    listen(eventName) {
        return new rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"](subscriber => {
            this.socket.on(eventName, (data) => {
                subscriber.next(data);
            });
        });
    }
    emit(eventName, data) {
        this.socket.emit(eventName, data);
    }
}
WebSocketService.ɵfac = function WebSocketService_Factory(t) { return new (t || WebSocketService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](ngx_socket_io__WEBPACK_IMPORTED_MODULE_2__["Socket"])); };
WebSocketService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: WebSocketService, factory: WebSocketService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "iTUp":
/*!***************************************!*\
  !*** ./src/app/pipes/pipes.module.ts ***!
  \***************************************/
/*! exports provided: PipesModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PipesModule", function() { return PipesModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _name_pipe_name_pipe_pipe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./name-pipe/name-pipe.pipe */ "nXtp");
/* harmony import */ var _prefix_plus_pipe_prefix_plus_pipe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./prefix-plus-pipe/prefix-plus.pipe */ "aeBj");
/* harmony import */ var _masked_phone_masked_phone_pipe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./masked-phone/masked-phone.pipe */ "sq79");
/* harmony import */ var _masked_email_masked_email_pipe__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./masked-email/masked-email.pipe */ "3BcM");
/* harmony import */ var _avatar_pipe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./avatar.pipe */ "lg1x");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ "fXoL");







class PipesModule {
}
PipesModule.ɵfac = function PipesModule_Factory(t) { return new (t || PipesModule)(); };
PipesModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({ type: PipesModule });
PipesModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({ imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"]]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](PipesModule, { declarations: [_name_pipe_name_pipe_pipe__WEBPACK_IMPORTED_MODULE_1__["NamePipe"],
        _prefix_plus_pipe_prefix_plus_pipe__WEBPACK_IMPORTED_MODULE_2__["PrefixPlusPipe"],
        _masked_phone_masked_phone_pipe__WEBPACK_IMPORTED_MODULE_3__["MaskedPhonePipe"],
        _masked_email_masked_email_pipe__WEBPACK_IMPORTED_MODULE_4__["MaskedEmailPipe"],
        _avatar_pipe__WEBPACK_IMPORTED_MODULE_5__["AvatarPipe"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"]], exports: [_prefix_plus_pipe_prefix_plus_pipe__WEBPACK_IMPORTED_MODULE_2__["PrefixPlusPipe"],
        _name_pipe_name_pipe_pipe__WEBPACK_IMPORTED_MODULE_1__["NamePipe"],
        _masked_phone_masked_phone_pipe__WEBPACK_IMPORTED_MODULE_3__["MaskedPhonePipe"],
        _masked_email_masked_email_pipe__WEBPACK_IMPORTED_MODULE_4__["MaskedEmailPipe"],
        _avatar_pipe__WEBPACK_IMPORTED_MODULE_5__["AvatarPipe"]] }); })();


/***/ }),

/***/ "iwNQ":
/*!*********************************************************************!*\
  !*** ./src/app/views/auth/authorization/authorization.component.ts ***!
  \*********************************************************************/
/*! exports provided: AuthorizationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthorizationComponent", function() { return AuthorizationComponent; });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _store_auth_auth_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../store/auth/auth.actions */ "C9XJ");
/* harmony import */ var _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../store/my-profile/my-profile.actions */ "fLR6");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../services/auth.service */ "lGQG");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../svg-icon/svg-icon.component */ "W/uP");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "ofXK");










function AuthorizationComponent_div_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r0.message);
} }
function AuthorizationComponent_li_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r1.backendError);
} }
class AuthorizationComponent {
    constructor(authService, router, activatedRoute, store$) {
        this.authService = authService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.store$ = store$;
        this.message = '';
        this.backendError = '';
        this.authForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroup"]({
            email: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].email]),
            password: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required]),
        });
    }
    onSubmit() {
        const form = this.authForm.value;
        if (this.authForm.valid) {
            this.authService.signInRequest(form).subscribe(res => {
                console.log('SERVER AUTH RESPONSE', res);
                this.store$.dispatch(new _store_auth_auth_actions__WEBPACK_IMPORTED_MODULE_1__["SignInAction"]());
                this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileGetInfoSuccessAction"]({
                    profile: res.user,
                }));
                localStorage.setItem('currentUser', JSON.stringify(res));
                this.router.navigate(['/feed']);
            }, err => (this.backendError = err.error.error));
        }
    }
    ngOnInit() {
        // this.authService.testReq()
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.message) {
                this.message = params.message;
            }
        });
        console.log(this.message);
    }
}
AuthorizationComponent.ɵfac = function AuthorizationComponent_Factory(t) { return new (t || AuthorizationComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_6__["Store"])); };
AuthorizationComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: AuthorizationComponent, selectors: [["app-authorization"]], decls: 25, vars: 3, consts: [[1, "wrapper"], [1, "container"], [1, "container__header"], [1, "logo"], ["icon", "whiteLogo"], [1, "container__body"], ["class", "message", 4, "ngIf"], [1, "form", 3, "formGroup", "ngSubmit"], [1, "form__errors"], [4, "ngIf"], ["for", "email", 1, "form__label"], ["type", "email", "id", "email", "formControlName", "email", "required", "", 1, "form__control"], ["for", "password", 1, "form__label"], ["type", "password", "id", "password", "formControlName", "password", "required", "", 1, "form__control"], ["type", "submit", 1, "submit"], [1, "auth-link"], ["routerLink", "/signup"], [1, "message"]], template: function AuthorizationComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "h2", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "Linked");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](5, "svg", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, AuthorizationComponent_div_7_Template, 2, 1, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "form", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngSubmit", function AuthorizationComponent_Template_form_ngSubmit_8_listener() { return ctx.onSubmit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "ul", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](10, AuthorizationComponent_li_10_Template, 2, 1, "li", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "label", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13, "E-mail");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](14, "input", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "label", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](17, "Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](18, "input", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](19, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](20, "Sign in");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](21, "span", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](22, "New to LinkedIn? ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](23, "a", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](24, "Join now");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.message);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroup", ctx.authForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.backendError);
    } }, directives: [_svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_7__["SvgIconComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControlName"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["RequiredValidator"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterLinkWithHref"]], styles: [".form[_ngcontent-%COMP%], .submit[_ngcontent-%COMP%] {\n  margin-top: 20px;\n}\n.message[_ngcontent-%COMP%] {\n  margin: 0 auto;\n  padding: 10px;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  border: 3px solid #0981c0;\n  border-radius: 20px;\n  background-color: #6bc7f8;\n  color: #033047;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dGhvcml6YXRpb24uY29tcG9uZW50Lmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7O0VBRUksZ0JBQUE7QUFESjtBQUlBO0VBQ0ksY0FBQTtFQUNBLGFBQUE7RUFDQSwwQkFBQTtFQUFBLHVCQUFBO0VBQUEsa0JBQUE7RUFFQSx5QkFBQTtFQUNBLG1CQUFBO0VBRUEseUJBQUE7RUFDQSxjQUFBO0FBSkoiLCJmaWxlIjoiYXV0aG9yaXphdGlvbi5jb21wb25lbnQubGVzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL3ZhcmlhYmxlcyc7XG5cbi5mb3JtLFxuLnN1Ym1pdCB7XG4gICAgbWFyZ2luLXRvcDogMjBweDtcbn1cblxuLm1lc3NhZ2Uge1xuICAgIG1hcmdpbjogMCBhdXRvO1xuICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgd2lkdGg6IGZpdC1jb250ZW50O1xuXG4gICAgYm9yZGVyOiAzcHggc29saWQgbGlnaHRlbihAYWN0aXZlLCA1JSk7XG4gICAgYm9yZGVyLXJhZGl1czogMjBweDtcblxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0ZW4oQGFjdGl2ZSwgMzUlKTtcbiAgICBjb2xvcjogZGFya2VuKEBhY3RpdmUsIDIwJSk7XG59XG4iXX0= */", "@media (max-width: 520px) {\n  *[_ngcontent-%COMP%] {\n    overflow-x: hidden;\n  }\n}\n.wrapper[_ngcontent-%COMP%] {\n  width: 100vw;\n  height: 100vh;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  overflow-x: hidden;\n}\n.wrapper[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {\n  min-width: 300px;\n  width: 100%;\n  max-width: 600px;\n  background-color: #fff;\n  border-radius: 10px;\n  overflow: hidden;\n}\n.wrapper[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 10rem;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background-color: #0871a8;\n}\n.wrapper[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%] {\n  color: #ffffff;\n}\n.wrapper[_ngcontent-%COMP%]   .container__header[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  margin-left: 0.2rem;\n  width: 32px;\n  height: 32px;\n  vertical-align: sub;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%] {\n  padding: 10px;\n  max-height: 700px;\n  overflow: auto;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%] {\n  font-family: 'Poppins', sans-serif;\n  display: flex;\n  flex-direction: column;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  margin: 15px auto;\n  width: 80%;\n  min-width: 280px;\n  display: flex;\n  justify-content: space-between;\n}\n@media (max-width: 520px) {\n  .wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   .form__control[_ngcontent-%COMP%] {\n    margin-top: 0.5rem;\n  }\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form__control[_ngcontent-%COMP%] {\n  padding: 0.4rem;\n  font-family: 'Poppins', sans-serif;\n  font-size: 1.2rem;\n  font-weight: 300;\n  outline: none;\n  border: 0;\n  border-bottom: 2px solid #dedede;\n  border-radius: 0;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   .agree[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 0.8rem;\n  color: #747474;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   .submit[_ngcontent-%COMP%] {\n  align-self: center;\n  width: 60%;\n  border-radius: 30px;\n  padding: 15px;\n  border: 0;\n  outline: 0;\n  background-color: #0871a8;\n  color: #fff;\n  font-size: 1.2rem;\n  cursor: pointer;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   .auth-link[_ngcontent-%COMP%] {\n  margin: 15px auto;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   .auth-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  text-decoration: none;\n  color: #0871a8;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]   .auth-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form__errors[_ngcontent-%COMP%] {\n  width: 80%;\n  margin: 20px auto;\n  padding: 10px;\n  border: 3px solid red;\n  border-radius: 10px;\n  background-color: #ff7575;\n  color: #660000;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form__errors[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-left: 20px;\n}\n.wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%]   .form__errors[_ngcontent-%COMP%]:empty {\n  display: none;\n}\n@media (max-height: 750px) {\n  .wrapper[_ngcontent-%COMP%] {\n    align-items: flex-start;\n  }\n  .wrapper[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {\n    margin-top: 30px;\n  }\n  .wrapper[_ngcontent-%COMP%]   .container__body[_ngcontent-%COMP%] {\n    max-height: none;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dGguc3R5bGVzLmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSTtJQUNJLGtCQUFBO0VBRE47QUFDRjtBQUlBO0VBQ0ksWUFBQTtFQUNBLGFBQUE7RUFFQSxhQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtFQUVBLGtCQUFBO0FBSko7QUFKQTtFQVdRLGdCQUFBO0VBQ0EsV0FBQTtFQUNBLGdCQUFBO0VBRUEsc0JBQUE7RUFDQSxtQkFBQTtFQUNBLGdCQUFBO0FBTFI7QUFPUTtFQUNJLFdBQUE7RUFDQSxhQUFBO0VBRUEsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFFQSx5QkFBQTtBQVBaO0FBRFE7RUFXUSxjQUFBO0FBUGhCO0FBSlE7RUFjWSxtQkFBQTtFQUVBLFdBQUE7RUFDQSxZQUFBO0VBRUEsbUJBQUE7QUFUcEI7QUFjUTtFQUNJLGFBQUE7RUFDQSxpQkFBQTtFQUNBLGNBQUE7QUFaWjtBQVNRO0VBS1Esa0NBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7QUFYaEI7QUFJUTtFQVVZLGlCQUFBO0VBQ0EsVUFBQTtFQUNBLGdCQUFBO0VBRUEsYUFBQTtFQUNBLDhCQUFBO0FBWnBCO0FBY29CO0VBQUE7SUFDSSxzQkFBQTtFQVh0QjtFQVVrQjtJQUlRLGtCQUFBO0VBWDFCO0FBQ0Y7QUFlZ0I7RUFDSSxlQUFBO0VBQ0Esa0NBQUE7RUFDQSxpQkFBQTtFQUNBLGdCQUFBO0VBRUEsYUFBQTtFQUNBLFNBQUE7RUFDQSxnQ0FBQTtFQUNBLGdCQUFBO0FBZHBCO0FBckJRO0VBdUNZLGtCQUFBO0VBQ0EsaUJBQUE7RUFDQSxjQUFBO0FBZnBCO0FBMUJRO0VBNkNZLGtCQUFBO0VBRUEsVUFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtFQUVBLFNBQUE7RUFDQSxVQUFBO0VBRUEseUJBQUE7RUFDQSxXQUFBO0VBQ0EsaUJBQUE7RUFFQSxlQUFBO0FBcEJwQjtBQXRDUTtFQTZEWSxpQkFBQTtBQXBCcEI7QUF6Q1E7RUFnRWdCLHFCQUFBO0VBQ0EsY0FBQTtBQXBCeEI7QUFzQndCO0VBQ0ksMEJBQUE7QUFwQjVCO0FBeUJnQjtFQUNJLFVBQUE7RUFDQSxpQkFBQTtFQUNBLGFBQUE7RUFFQSxxQkFBQTtFQUNBLG1CQUFBO0VBQ0EseUJBQUE7RUFFQSxjQUFBO0FBekJwQjtBQWdCZ0I7RUFZUSxpQkFBQTtBQXpCeEI7QUE0Qm9CO0VBQ0ksYUFBQTtBQTFCeEI7QUFpQ0k7RUFBQTtJQUNJLHVCQUFBO0VBOUJOO0VBNkJFO0lBSVEsZ0JBQUE7RUE5QlY7RUEwQkU7SUFRUSxnQkFBQTtFQS9CVjtBQUNGIiwiZmlsZSI6ImF1dGguc3R5bGVzLmxlc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICdzcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMnO1xuXG5AbWVkaWEgKG1heC13aWR0aDogNTIwcHgpIHtcbiAgICAqIHtcbiAgICAgICAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICAgIH1cbn1cblxuLndyYXBwZXIge1xuICAgIHdpZHRoOiAxMDB2dztcbiAgICBoZWlnaHQ6IDEwMHZoO1xuXG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xuXG4gICAgLmNvbnRhaW5lciB7XG4gICAgICAgIG1pbi13aWR0aDogMzAwcHg7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBtYXgtd2lkdGg6IDYwMHB4O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgICAgICAgJl9faGVhZGVyIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiAxMHJlbTtcblxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogQGFjdGl2ZTtcblxuICAgICAgICAgICAgLmxvZ28ge1xuICAgICAgICAgICAgICAgIGNvbG9yOiAjZmZmZmZmO1xuXG4gICAgICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDAuMnJlbTtcblxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMzJweDtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMnB4O1xuXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiBzdWI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJl9fYm9keSB7XG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4O1xuICAgICAgICAgICAgbWF4LWhlaWdodDogNzAwcHg7XG4gICAgICAgICAgICBvdmVyZmxvdzogYXV0bztcbiAgICAgICAgICAgIC5mb3JtIHtcbiAgICAgICAgICAgICAgICBmb250LWZhbWlseTogJ1BvcHBpbnMnLCBzYW5zLXNlcmlmO1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblxuICAgICAgICAgICAgICAgIGRpdiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMTVweCBhdXRvO1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogODAlO1xuICAgICAgICAgICAgICAgICAgICBtaW4td2lkdGg6IDI4MHB4O1xuXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcblxuICAgICAgICAgICAgICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNTIwcHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JtX19jb250cm9sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAwLjVyZW07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAmX19jb250cm9sIHtcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMC40cmVtO1xuICAgICAgICAgICAgICAgICAgICBmb250LWZhbWlseTogQGZmO1xuICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDEuMnJlbTtcbiAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDMwMDtcblxuICAgICAgICAgICAgICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDA7XG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCAjZGVkZWRlO1xuICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC5hZ3JlZSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAwLjhyZW07XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBAbGlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLnN1Ym1pdCB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWduLXNlbGY6IGNlbnRlcjtcblxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNjAlO1xuICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAzMHB4O1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAxNXB4O1xuXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjogMDtcbiAgICAgICAgICAgICAgICAgICAgb3V0bGluZTogMDtcblxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBAYWN0aXZlO1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogI2ZmZjtcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxLjJyZW07XG5cbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAuYXV0aC1saW5rIHtcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAxNXB4IGF1dG87XG5cbiAgICAgICAgICAgICAgICAgICAgYSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQGFjdGl2ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAmX19lcnJvcnMge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogODAlO1xuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDIwcHggYXV0bztcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMTBweDtcblxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDNweCBzb2xpZCByZWQ7XG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0ZW4ocmVkLCAyMyUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBkYXJrZW4ocmVkLCAzMCUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAyMHB4O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJjplbXB0eSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgQG1lZGlhIChtYXgtaGVpZ2h0OiA3NTBweCkge1xuICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcblxuICAgICAgICAuY29udGFpbmVyIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDMwcHg7XG4gICAgICAgIH1cblxuICAgICAgICAuY29udGFpbmVyX19ib2R5IHtcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IG5vbmU7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0= */"] });


/***/ }),

/***/ "j1ZV":
/*!*************************************************!*\
  !*** ./src/app/components/components.module.ts ***!
  \*************************************************/
/*! exports provided: ComponentsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ComponentsModule", function() { return ComponentsModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _network_users_list_users_list_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./network/users-list/users-list.component */ "p0Ul");
/* harmony import */ var _select_select_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./select/select.component */ "yoGk");
/* harmony import */ var _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../svg-icon/svg-icon.module */ "uQlT");
/* harmony import */ var _account_deleted_account_deleted_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./account-deleted/account-deleted.component */ "gPp/");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ "fXoL");







class ComponentsModule {
}
ComponentsModule.ɵfac = function ComponentsModule_Factory(t) { return new (t || ComponentsModule)(); };
ComponentsModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({ type: ComponentsModule });
ComponentsModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({ imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"], _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_4__["SvgIconModule"]]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](ComponentsModule, { declarations: [_network_users_list_users_list_component__WEBPACK_IMPORTED_MODULE_2__["UsersListComponent"],
        _select_select_component__WEBPACK_IMPORTED_MODULE_3__["SelectComponent"],
        _account_deleted_account_deleted_component__WEBPACK_IMPORTED_MODULE_5__["AccountDeletedComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"], _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_4__["SvgIconModule"]], exports: [_network_users_list_users_list_component__WEBPACK_IMPORTED_MODULE_2__["UsersListComponent"], _select_select_component__WEBPACK_IMPORTED_MODULE_3__["SelectComponent"]] }); })();


/***/ }),

/***/ "jwUf":
/*!*******************************************!*\
  !*** ./src/app/services/posts.service.ts ***!
  \*******************************************/
/*! exports provided: PostsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostsService", function() { return PostsService; });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../environments/environment */ "AytR");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "tk/3");



class PostsService {
    constructor(http) {
        this.http = http;
    }
    createPost(post) {
        // console.log('service request [POST]:', post)
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/posts/create`, post);
    }
    editPost(content, postId) { }
    removePost(postId) { }
    likePost(postId, userId) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/posts/like/${postId}`, { id: userId });
    }
    dontLikePost(postId, userId) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/posts/dont-like/${postId}`, { id: userId });
    }
    createComment(comment, postId) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/posts/${postId}/comments/add`, comment);
    }
    editComment(postId, commentId, content) { }
    removeComment(postId, commentId) { }
    likeComment(postId, commentId, userId) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/${postId}/comments/like/${commentId}`, { id: userId });
    }
    dontLikeComment(postId, commentId, userId) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/${postId}/comments/dont-like/${commentId}`, { id: userId });
    }
    getPosts(id) {
        return this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/posts/${id}`);
    }
}
PostsService.ɵfac = function PostsService_Factory(t) { return new (t || PostsService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"])); };
PostsService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: PostsService, factory: PostsService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "jykL":
/*!*******************************************!*\
  !*** ./src/app/views/chat/chat.module.ts ***!
  \*******************************************/
/*! exports provided: ChatModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatModule", function() { return ChatModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _chat_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chat.component */ "l9bd");
/* harmony import */ var _chat_main_chat_main_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chat-main/chat-main.component */ "99sx");
/* harmony import */ var _chat_side_chat_side_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./chat-side/chat-side.component */ "WF+h");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../svg-icon/svg-icon.module */ "uQlT");
/* harmony import */ var _services_chat_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/chat.service */ "sjK5");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ "fXoL");








class ChatModule {
}
ChatModule.ɵfac = function ChatModule_Factory(t) { return new (t || ChatModule)(); };
ChatModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineNgModule"]({ type: ChatModule });
ChatModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjector"]({ providers: [_services_chat_service__WEBPACK_IMPORTED_MODULE_6__["ChatService"]], imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"], _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_5__["SvgIconModule"]]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsetNgModuleScope"](ChatModule, { declarations: [_chat_component__WEBPACK_IMPORTED_MODULE_1__["ChatComponent"], _chat_main_chat_main_component__WEBPACK_IMPORTED_MODULE_2__["ChatMainComponent"], _chat_side_chat_side_component__WEBPACK_IMPORTED_MODULE_3__["ChatSideComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"], _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_5__["SvgIconModule"]] }); })();


/***/ }),

/***/ "l9bd":
/*!**********************************************!*\
  !*** ./src/app/views/chat/chat.component.ts ***!
  \**********************************************/
/*! exports provided: ChatComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatComponent", function() { return ChatComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _chat_side_chat_side_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chat-side/chat-side.component */ "WF+h");
/* harmony import */ var _chat_main_chat_main_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chat-main/chat-main.component */ "99sx");



class ChatComponent {
    constructor() { }
    ngOnInit() { }
}
ChatComponent.ɵfac = function ChatComponent_Factory(t) { return new (t || ChatComponent)(); };
ChatComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ChatComponent, selectors: [["app-chat"]], decls: 3, vars: 0, consts: [[1, "chat-wrapper"], [1, "side"], [1, "main"]], template: function ChatComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "app-chat-side", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "app-chat-main", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_chat_side_chat_side_component__WEBPACK_IMPORTED_MODULE_1__["ChatSideComponent"], _chat_main_chat_main_component__WEBPACK_IMPORTED_MODULE_2__["ChatMainComponent"]], styles: [".chat-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 1440px;\n  margin-top: 40px;\n  display: flex;\n  justify-content: center;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .side[_ngcontent-%COMP%] {\n  width: 25%;\n  max-width: 290px;\n  margin-right: 40px;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .main[_ngcontent-%COMP%] {\n  width: 75%;\n  max-width: 850px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoYXQuY29tcG9uZW50Lmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxXQUFBO0VBQ0EsaUJBQUE7RUFFQSxnQkFBQTtFQUVBLGFBQUE7RUFDQSx1QkFBQTtBQURKO0FBTkE7RUFVUSxVQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtBQURSO0FBWEE7RUFnQlEsVUFBQTtFQUNBLGdCQUFBO0FBRlIiLCJmaWxlIjoiY2hhdC5jb21wb25lbnQubGVzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jaGF0LXdyYXBwZXIge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1heC13aWR0aDogMTQ0MHB4O1xuXG4gICAgbWFyZ2luLXRvcDogNDBweDtcblxuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbiAgICAuc2lkZSB7XG4gICAgICAgIHdpZHRoOiAyNSU7XG4gICAgICAgIG1heC13aWR0aDogMjkwcHg7XG4gICAgICAgIG1hcmdpbi1yaWdodDogNDBweDtcbiAgICB9XG5cbiAgICAubWFpbiB7XG4gICAgICAgIHdpZHRoOiA3NSU7XG4gICAgICAgIG1heC13aWR0aDogODUwcHg7XG4gICAgfVxufVxuIl19 */"] });


/***/ }),

/***/ "lGQG":
/*!******************************************!*\
  !*** ./src/app/services/auth.service.ts ***!
  \******************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../environments/environment */ "AytR");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "tk/3");




class AuthService {
    constructor(http) {
        this.http = http;
        this.isAuth = false;
    }
    signUpRequest(formValue) {
        formValue.passwordRepeat = undefined;
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/create`, formValue, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    signInRequest(formValue) {
        return this.http
            .post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/auth`, formValue)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(res => {
            console.log(res);
            return res;
        }));
    }
    getIsdCountryCode() {
        return this.http.get('https://gist.githubusercontent.com/iamswapnilsonar/0e1868229e98cc27a6d2e3487b44f7fa/raw/10f8979f0b1daa0e0b490137d51fb96736767a09/isd_country_code.json');
    }
    testReq() {
        this.http
            .get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].server_url}/users/test`)
            .subscribe(res => console.log(res));
    }
}
AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"])); };
AuthService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "lg1x":
/*!**************************************!*\
  !*** ./src/app/pipes/avatar.pipe.ts ***!
  \**************************************/
/*! exports provided: AvatarPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AvatarPipe", function() { return AvatarPipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class AvatarPipe {
    transform(value, ...args) {
        if (typeof value === 'string')
            return value;
        if (value === null)
            return 'assets/img/avatar-man.png';
        const arrayBufferView = new Uint8Array(value.data);
        // const blob = new Blob([ arrayBufferView ], { type: 'image/jpeg' })
        // console.log(blob)
        // const urlCreator = window.URL || window.webkitURL
        //
        // return urlCreator.createObjectURL(blob)
    }
}
AvatarPipe.ɵfac = function AvatarPipe_Factory(t) { return new (t || AvatarPipe)(); };
AvatarPipe.ɵpipe = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({ name: "avatar", type: AvatarPipe, pure: true });


/***/ }),

/***/ "nMop":
/*!**********************************************************************!*\
  !*** ./src/app/views/network/network-main/network-main.component.ts ***!
  \**********************************************************************/
/*! exports provided: NetworkMainComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkMainComponent", function() { return NetworkMainComponent; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../store/my-profile/my-profile.selectors */ "0jmn");
/* harmony import */ var _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../store/my-profile/my-profile.actions */ "fLR6");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _services_profile_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../services/profile.service */ "Aso2");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _components_network_invitations_invitations_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../components/network/invitations/invitations.component */ "vuXr");
/* harmony import */ var _components_network_users_list_users_list_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../components/network/users-list/users-list.component */ "p0Ul");










function NetworkMainComponent_app_invitations_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "app-invitations", 4);
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("myProfileId", ctx_r0.myProfileId)("myConnections$", ctx_r0.myConnections$);
} }
function NetworkMainComponent_h2_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "h2", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Connections");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function NetworkMainComponent_app_users_list_3_Template(rf, ctx) { if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "app-users-list", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("action", function NetworkMainComponent_app_users_list_3_Template_app_users_list_action_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r4); const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](); return ctx_r3.removeConnection($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("connections", ctx_r2.myConnections)("isMyProfile", true);
} }
class NetworkMainComponent {
    constructor(store$, profileService) {
        this.store$ = store$;
        this.profileService = profileService;
        this.subs = [];
        this.myConnections = [];
        this.myProfileId = -1;
        this.activeTab = '';
        this.myConnections$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_1__["myProfileConnectionsSelector"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(connections => {
            return this.profileService.getConnectionsById$(connections);
        }));
    }
    set sub(s) {
        this.subs.push(s);
    }
    removeConnection(data) {
        console.log(data);
        this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileRemoveConnectionAction"]({
            senderId: this.myProfileId,
            userId: data.userId,
        }));
    }
    ngOnInit() {
        this.sub = this.store$
            .pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_1__["myProfileIdSelector"]))
            .subscribe(id => {
            if (id >= 0)
                this.myProfileId = id;
            else
                this.myProfileId = JSON.parse(localStorage.getItem('currentUser')).user.id;
        }); // get this.myProfileId
        this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_2__["MyProfileGetInfoAction"]({ id: this.myProfileId })); // get info
        this.sub = this.myConnections$.subscribe(connections => (this.myConnections = connections));
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
NetworkMainComponent.ɵfac = function NetworkMainComponent_Factory(t) { return new (t || NetworkMainComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["Store"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_profile_service__WEBPACK_IMPORTED_MODULE_5__["ProfileService"])); };
NetworkMainComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({ type: NetworkMainComponent, selectors: [["app-network-main"]], inputs: { activeTab: "activeTab" }, decls: 4, vars: 3, consts: [[1, "network-main"], [3, "myProfileId", "myConnections$", 4, "ngIf"], ["class", "title", 4, "ngIf"], [3, "connections", "isMyProfile", "action", 4, "ngIf"], [3, "myProfileId", "myConnections$"], [1, "title"], [3, "connections", "isMyProfile", "action"]], template: function NetworkMainComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, NetworkMainComponent_app_invitations_1_Template, 1, 2, "app-invitations", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, NetworkMainComponent_h2_2_Template, 2, 0, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](3, NetworkMainComponent_app_users_list_3_Template, 1, 2, "app-users-list", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.activeTab === "invitations");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.activeTab === "connections");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.activeTab === "connections");
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], _components_network_invitations_invitations_component__WEBPACK_IMPORTED_MODULE_7__["InvitationsComponent"], _components_network_users_list_users_list_component__WEBPACK_IMPORTED_MODULE_8__["UsersListComponent"]], styles: [".user-select-none[_ngcontent-%COMP%] {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.network-main[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 500;\n  margin: 20px;\n  text-align: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHN0eWxlc1xcbWl4aW5zXFx0ZXh0LW1peGlucy5sZXNzIiwibmV0d29yay1tYWluLmNvbXBvbmVudC5sZXNzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksaUJBQUE7RUFDQSx5QkFBQTtFQUNBLHNCQUFBO0VBQ0EscUJBQUE7QUNDSjtBQUZBO0VBRVEsZUFBQTtFQUNBLGdCQUFBO0VBRUEsWUFBQTtFQUNBLGtCQUFBO0FBRVIiLCJmaWxlIjoibmV0d29yay1tYWluLmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiLnVzZXItc2VsZWN0LW5vbmUge1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG59XG4iLCJAaW1wb3J0ICdzcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMnO1xuQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvbWl4aW5zL3RleHQtbWl4aW5zJztcblxuLm5ldHdvcmstbWFpbiB7XG4gICAgLnRpdGxlIHtcbiAgICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuXG4gICAgICAgIG1hcmdpbjogMjBweDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cbn1cbiJdfQ== */"] });


/***/ }),

/***/ "nXtp":
/*!***************************************************!*\
  !*** ./src/app/pipes/name-pipe/name-pipe.pipe.ts ***!
  \***************************************************/
/*! exports provided: NamePipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NamePipe", function() { return NamePipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class NamePipe {
    transform(value, ...args) {
        // tslint:disable-next-line:prefer-const
        let [firstName, lastName] = value.split(' ');
        return `${firstName[0]}. ${lastName}`;
    }
}
NamePipe.ɵfac = function NamePipe_Factory(t) { return new (t || NamePipe)(); };
NamePipe.ɵpipe = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({ name: "namePipe", type: NamePipe, pure: true });


/***/ }),

/***/ "oVQW":
/*!***************************************************************************************************************!*\
  !*** ./src/app/views/profile/edit-profile/edit-components/edit-personal-data/edit-personal-data.component.ts ***!
  \***************************************************************************************************************/
/*! exports provided: EditPersonalDataComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditPersonalDataComponent", function() { return EditPersonalDataComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../svg-icon/svg-icon.component */ "W/uP");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _components_select_select_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../components/select/select.component */ "yoGk");







function EditPersonalDataComponent_div_19_Template(rf, ctx) { if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "svg", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditPersonalDataComponent_div_19_Template__svg_svg_click_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4); const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r3.editStatus = null; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("success", ctx_r1.editStatus.status === "success")("fail", ctx_r1.editStatus.status === "fail");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r1.editStatus.message, " ");
} }
const _c0 = function () { return ["Male", "Female"]; };
class EditPersonalDataComponent {
    constructor() {
        this.firstName = '';
        this.lastName = '';
        this.DOB = 0;
        this.gender = '';
        this.avatar = '';
        this.editStatus = null;
        this.saveChanges = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.changeAvatar = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.editProfileDataForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroup"]({
            firstName: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.firstName, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(2),
            ]),
            lastName: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.lastName, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
            dateOfBirth: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](new Date(this.DOB).toJSON().split('T')[0], [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
        });
        this.selectedGender = '';
        this.genderIsRequiredError = false;
        this.changeAvatarMenu = null;
    }
    toggleChangeAvatarMenu(menu) {
        menu.classList.toggle('transparent');
        menu.classList.toggle('hidden');
        this.changeAvatarMenu = menu;
    }
    hideChangeAvatarMenu(menu) {
        menu.classList.add('transparent');
        menu.classList.add('hidden');
    }
    selectOnChange(option) {
        this.selectedGender = option;
    }
    changeAvatarHandler(e) {
        const target = e.target;
        const files = target.files;
        this.changeAvatar.emit({ type: 'change', file: files.item(0) });
        target.value = '';
        if (this.changeAvatarMenu)
            this.toggleChangeAvatarMenu(this.changeAvatarMenu);
    }
    deleteAvatarHandler() {
        this.changeAvatar.emit({ type: 'delete' });
        if (this.changeAvatarMenu)
            this.toggleChangeAvatarMenu(this.changeAvatarMenu);
    }
    onSubmit() {
        if (this.selectedGender === 'Indicate your gender') {
            this.genderIsRequiredError = true;
            return;
        }
        this.genderIsRequiredError = false;
        if (this.editProfileDataForm.valid) {
            this.saveChanges.emit(Object.assign(Object.assign({}, this.editProfileDataForm.value), { gender: this.selectedGender.trim() }));
        }
    }
    ngOnInit() { }
    ngOnChanges(changes) {
        if (changes.hasOwnProperty('firstName') &&
            changes.hasOwnProperty('lastName') &&
            changes.hasOwnProperty('DOB')) {
            this.editProfileDataForm.setValue({
                firstName: changes.firstName.currentValue,
                lastName: changes.lastName.currentValue,
                dateOfBirth: new Date(changes.DOB.currentValue)
                    .toJSON()
                    .split('T')[0],
            });
        }
    }
}
EditPersonalDataComponent.ɵfac = function EditPersonalDataComponent_Factory(t) { return new (t || EditPersonalDataComponent)(); };
EditPersonalDataComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: EditPersonalDataComponent, selectors: [["app-edit-personal-data"]], inputs: { firstName: "firstName", lastName: "lastName", DOB: "DOB", gender: "gender", avatar: "avatar", editStatus: "editStatus" }, outputs: { saveChanges: "saveChanges", changeAvatar: "changeAvatar" }, features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"]], decls: 41, vars: 8, consts: [[1, "edit-personal-data"], [1, "edit-personal-data__header"], [1, "avatar-wrapper"], [1, "avatar-box", 3, "click"], ["alt", "avatar", 3, "src"], [1, "shadow"], ["icon", "camera"], [1, "hidden", "avatar-change"], ["avatar_change", ""], [1, "change", 3, "click"], [1, "delete", 3, "click"], [1, "helper"], [1, "name"], [1, "help"], [1, "edit-personal-data__body"], ["class", "edit-status", 3, "success", "fail", 4, "ngIf"], ["id", "edit-personal-data-form", 3, "formGroup", "ngSubmit"], [1, "input-wrapper"], ["for", "first_name"], ["id", "first_name", "type", "text", "formControlName", "firstName"], ["for", "last_name"], ["id", "last_name", "type", "text", "formControlName", "lastName"], [3, "options", "error", "selectedByDefault", "onChange"], ["for", "DOB"], ["id", "DOB", "type", "date", "formControlName", "dateOfBirth"], ["type", "submit", 1, "btn"], ["type", "file", "accept", ".jpg,.png,.gif", 1, "hidden", 3, "change"], ["input_avatar_upload", ""], [1, "edit-status"], ["icon", "close", 1, "close", 3, "click"]], template: function EditPersonalDataComponent_Template(rf, ctx) { if (rf & 1) {
        const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditPersonalDataComponent_Template_div_click_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r5); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](8); return ctx.toggleChangeAvatarMenu(_r0); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "img", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "svg", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 7, 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditPersonalDataComponent_Template_div_click_9_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r5); const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](40); return _r2.click(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "Change avatar");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditPersonalDataComponent_Template_div_click_11_listener() { return ctx.deleteAvatarHandler(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Delete avatar");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "h3", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Provide basic information about yourself");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](19, EditPersonalDataComponent_div_19_Template, 3, 5, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "form", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngSubmit", function EditPersonalDataComponent_Template_form_ngSubmit_20_listener() { return ctx.onSubmit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "label", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "First name");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "input", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "label", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Last name");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](28, "input", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "Gender");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "app-select", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("onChange", function EditPersonalDataComponent_Template_app_select_onChange_32_listener($event) { return ctx.selectOnChange($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "label", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, "Date of birth");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](36, "input", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "button", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "Save");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "input", 26, 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function EditPersonalDataComponent_Template_input_change_39_listener($event) { return ctx.changeAvatarHandler($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx.avatar, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.firstName + " " + ctx.lastName);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.editStatus);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.editProfileDataForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("options", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](7, _c0))("error", ctx.genderIsRequiredError)("selectedByDefault", ctx.gender || "Indicate your gender");
    } }, directives: [_svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_2__["SvgIconComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlName"], _components_select_select_component__WEBPACK_IMPORTED_MODULE_4__["SelectComponent"]], styles: [".user-select-none[_ngcontent-%COMP%] {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.edit-personal-data__header[_ngcontent-%COMP%] {\n  margin-bottom: 40px;\n  display: flex;\n  align-items: center;\n}\n.edit-personal-data__header[_ngcontent-%COMP%]   .avatar-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n}\n.edit-personal-data__header[_ngcontent-%COMP%]   .avatar-wrapper[_ngcontent-%COMP%]   .avatar-box[_ngcontent-%COMP%] {\n  width: 68px;\n  height: 68px;\n  position: relative;\n  cursor: pointer;\n}\n.edit-personal-data__header[_ngcontent-%COMP%]   .avatar-wrapper[_ngcontent-%COMP%]   .avatar-box[_ngcontent-%COMP%]:hover   .shadow[_ngcontent-%COMP%] {\n  background-color: rgba(221, 221, 221, 0.1);\n}\n.edit-personal-data__header[_ngcontent-%COMP%]   .avatar-wrapper[_ngcontent-%COMP%]   .avatar-box[_ngcontent-%COMP%]   .shadow[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  background-color: rgba(0, 0, 0, 0.15);\n}\n.edit-personal-data__header[_ngcontent-%COMP%]   .avatar-wrapper[_ngcontent-%COMP%]   .avatar-box[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  stroke: white;\n  width: 28px;\n  height: 28px;\n  position: absolute;\n  top: calc(50% - 14px);\n  left: calc(50% - 12px);\n}\n.edit-personal-data__header[_ngcontent-%COMP%]   .avatar-wrapper[_ngcontent-%COMP%]   .avatar-change[_ngcontent-%COMP%] {\n  position: absolute;\n  right: -30px;\n  top: 80px;\n  width: 150px;\n  border-radius: 8px;\n  box-shadow: 2px 2px 7px 1px #aaa;\n  background-color: #fff;\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.edit-personal-data__header[_ngcontent-%COMP%]   .avatar-wrapper[_ngcontent-%COMP%]   .avatar-change[_ngcontent-%COMP%]   .change[_ngcontent-%COMP%], .edit-personal-data__header[_ngcontent-%COMP%]   .avatar-wrapper[_ngcontent-%COMP%]   .avatar-change[_ngcontent-%COMP%]   .delete[_ngcontent-%COMP%] {\n  padding: 10px;\n  cursor: pointer;\n}\n.edit-personal-data__header[_ngcontent-%COMP%]   .avatar-wrapper[_ngcontent-%COMP%]   .avatar-change[_ngcontent-%COMP%]   .change[_ngcontent-%COMP%]:hover, .edit-personal-data__header[_ngcontent-%COMP%]   .avatar-wrapper[_ngcontent-%COMP%]   .avatar-change[_ngcontent-%COMP%]   .delete[_ngcontent-%COMP%]:hover {\n  text-shadow: 0 0 2px #ccc;\n}\n.edit-personal-data__header[_ngcontent-%COMP%]   .avatar-wrapper[_ngcontent-%COMP%]   .avatar-change[_ngcontent-%COMP%]   .change[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #cdcdcd;\n}\n.edit-personal-data__header[_ngcontent-%COMP%]   .avatar-wrapper[_ngcontent-%COMP%]   .avatar-change[_ngcontent-%COMP%]   .delete[_ngcontent-%COMP%] {\n  color: #de0e0e;\n}\n.edit-personal-data__header[_ngcontent-%COMP%]   .avatar-wrapper[_ngcontent-%COMP%]   .avatar-change[_ngcontent-%COMP%]:before, .edit-personal-data__header[_ngcontent-%COMP%]   .avatar-wrapper[_ngcontent-%COMP%]   .avatar-change[_ngcontent-%COMP%]:after {\n  content: '';\n  position: absolute;\n  left: 60px;\n  top: -20px;\n  border: 10px solid transparent;\n  border-bottom: 10px solid #ccc;\n}\n.edit-personal-data__header[_ngcontent-%COMP%]   .avatar-wrapper[_ngcontent-%COMP%]   .avatar-change[_ngcontent-%COMP%]:after {\n  border-bottom: 10px solid white;\n  top: -19px;\n}\n.edit-personal-data__header[_ngcontent-%COMP%]   .helper[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n.edit-personal-data__header[_ngcontent-%COMP%]   .helper[_ngcontent-%COMP%]   .help[_ngcontent-%COMP%] {\n  color: #747474;\n  font-size: 14px;\n}\n.edit-personal-data__body[_ngcontent-%COMP%]   .edit-status[_ngcontent-%COMP%] {\n  border: 2px solid;\n  border-radius: 8px;\n  width: calc(80% + 40px);\n  margin: 40px 0;\n  padding: 10px 20px;\n  font-size: 18px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.edit-personal-data__body[_ngcontent-%COMP%]   .edit-status.fail[_ngcontent-%COMP%] {\n  border-color: #de0e0e;\n  background-color: rgba(222, 14, 14, 0.2);\n  color: #c60c0c;\n}\n.edit-personal-data__body[_ngcontent-%COMP%]   .edit-status.fail[_ngcontent-%COMP%]   .close[_ngcontent-%COMP%] {\n  fill: #ae0b0b;\n}\n.edit-personal-data__body[_ngcontent-%COMP%]   .edit-status.success[_ngcontent-%COMP%] {\n  border-color: #02b033;\n  background-color: rgba(2, 176, 51, 0.2);\n  color: #017e24;\n}\n.edit-personal-data__body[_ngcontent-%COMP%]   .edit-status.success[_ngcontent-%COMP%]   .close[_ngcontent-%COMP%] {\n  fill: #017e24;\n}\n.edit-personal-data__body[_ngcontent-%COMP%]   .edit-status[_ngcontent-%COMP%]   .close[_ngcontent-%COMP%] {\n  width: 9px;\n  height: 9px;\n}\n.edit-personal-data__body[_ngcontent-%COMP%]   form[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-wrap: wrap;\n}\n.edit-personal-data__body[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   .input-wrapper[_ngcontent-%COMP%] {\n  width: 40%;\n  display: flex;\n  flex-direction: column;\n  margin-right: 40px;\n}\n.edit-personal-data__body[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   .input-wrapper[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  margin-bottom: 5px;\n  color: #747474;\n}\n.edit-personal-data__body[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   .input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  font-family: 'Poppins', sans-serif;\n  font-size: 16px;\n  height: 40px;\n  padding: 10px;\n  margin-bottom: 15px;\n  border: 1px solid #ccc;\n  border-radius: 8px;\n  transition: border-color 0.5s;\n}\n.edit-personal-data__body[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   .input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, .edit-personal-data__body[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   .input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:hover {\n  border-color: #0a92d9;\n  outline: none;\n}\n.edit-personal-data__body[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   .input-wrapper[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%] {\n  border: 1px solid #de0e0e;\n}\n.edit-personal-data__body[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  margin-top: 40px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc3R5bGVzXFxtaXhpbnNcXHRleHQtbWl4aW5zLmxlc3MiLCJlZGl0LXBlcnNvbmFsLWRhdGEuY29tcG9uZW50Lmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxpQkFBQTtFQUNBLHlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxxQkFBQTtBQ0NKO0FBREk7RUFDSSxtQkFBQTtFQUVBLGFBQUE7RUFDQSxtQkFBQTtBQUVSO0FBTkk7RUFPUSxrQkFBQTtBQUVaO0FBVEk7RUFVWSxXQUFBO0VBQ0EsWUFBQTtFQUVBLGtCQUFBO0VBQ0EsZUFBQTtBQUNoQjtBQUNnQjtFQUVRLDBDQUFBO0FBQXhCO0FBbEJJO0VBdUJnQixrQkFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0VBQ0EsTUFBQTtFQUNBLFNBQUE7RUFDQSxxQ0FBQTtBQUZwQjtBQTFCSTtFQWdDZ0IsYUFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBRUEsa0JBQUE7RUFDQSxxQkFBQTtFQUNBLHNCQUFBO0FBSnBCO0FBbENJO0VBMkNZLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLFNBQUE7RUFFQSxZQUFBO0VBRUEsa0JBQUE7RUFDQSxnQ0FBQTtFQUVBLHNCQUFBO0VEdkRaLGlCQUFBO0VBQ0EseUJBQUE7RUFDQSxzQkFBQTtFQUNBLHFCQUFBO0FDK0NKO0FBL0NJOztFQTBEZ0IsYUFBQTtFQUNBLGVBQUE7QUFQcEI7QUFTb0I7O0VBQ0kseUJBQUE7QUFOeEI7QUF4REk7RUFtRWdCLGdDQUFBO0FBUnBCO0FBM0RJO0VBdUVnQixjQUFBO0FBVHBCO0FBWWdCOztFQUVJLFdBQUE7RUFDQSxrQkFBQTtFQUNBLFVBQUE7RUFDQSxVQUFBO0VBQ0EsOEJBQUE7RUFDQSw4QkFBQTtBQVZwQjtBQVlnQjtFQUNJLCtCQUFBO0VBQ0EsVUFBQTtBQVZwQjtBQTNFSTtFQTRGWSxnQkFBQTtBQWRoQjtBQTlFSTtFQWdHWSxjQUFBO0VBQ0EsZUFBQTtBQWZoQjtBQW1CSTtFQUVRLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSx1QkFBQTtFQUNBLGNBQUE7RUFDQSxrQkFBQTtFQUVBLGVBQUE7RUFFQSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtBQXBCWjtBQXNCWTtFQUNJLHFCQUFBO0VBQ0Esd0NBQUE7RUFDQSxjQUFBO0FBcEJoQjtBQWlCWTtFQU1RLGFBQUE7QUFwQnBCO0FBd0JZO0VBQ0kscUJBQUE7RUFDQSx1Q0FBQTtFQUNBLGNBQUE7QUF0QmhCO0FBbUJZO0VBTVEsYUFBQTtBQXRCcEI7QUFSSTtFQW1DWSxVQUFBO0VBQ0EsV0FBQTtBQXhCaEI7QUFaSTtFQXlDUSxXQUFBO0VBRUEsYUFBQTtFQUNBLGVBQUE7QUEzQlo7QUFqQkk7RUErQ1ksVUFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUVBLGtCQUFBO0FBNUJoQjtBQXZCSTtFQXNEZ0Isa0JBQUE7RUFDQSxjQUFBO0FBNUJwQjtBQTNCSTtFQTJEZ0Isa0NBQUE7RUFDQSxlQUFBO0VBRUEsWUFBQTtFQUVBLGFBQUE7RUFDQSxtQkFBQTtFQUVBLHNCQUFBO0VBQ0Esa0JBQUE7RUFFQSw2QkFBQTtBQWpDcEI7QUFtQ29COztFQUVJLHFCQUFBO0VBQ0EsYUFBQTtBQWpDeEI7QUExQ0k7RUFnRmdCLHlCQUFBO0FBbkNwQjtBQTdDSTtFQXFGWSxnQkFBQTtBQXJDaEIiLCJmaWxlIjoiZWRpdC1wZXJzb25hbC1kYXRhLmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiLnVzZXItc2VsZWN0LW5vbmUge1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG59XG4iLCJAaW1wb3J0ICdzcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMnO1xuQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvbWl4aW5zL3RleHQtbWl4aW5zJztcblxuLmVkaXQtcGVyc29uYWwtZGF0YSB7XG4gICAgJl9faGVhZGVyIHtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogNDBweDtcblxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgIC5hdmF0YXItd3JhcHBlciB7XG4gICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgICAgICAgICAgIC5hdmF0YXItYm94IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogNjhweDtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDY4cHg7XG5cbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuXG4gICAgICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgICAgICAgIC5zaGFkb3cge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgjZGRkLCAwLjEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLnNoYWRvdyB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogMDtcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDA7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogMDtcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAwO1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKCMwMDAsIDAuMTUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZTogd2hpdGU7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyOHB4O1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDI4cHg7XG5cbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgICAgICAgICB0b3A6IGNhbGMoNTAlIC0gMTRweCk7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGNhbGMoNTAlIC0gMTJweCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAuYXZhdGFyLWNoYW5nZSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgICAgIHJpZ2h0OiAtMzBweDtcbiAgICAgICAgICAgICAgICB0b3A6IDgwcHg7XG5cbiAgICAgICAgICAgICAgICB3aWR0aDogMTUwcHg7XG5cbiAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMnB4IDJweCA3cHggMXB4ICNhYWE7XG5cbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuXG4gICAgICAgICAgICAgICAgLnVzZXItc2VsZWN0LW5vbmUoKTtcblxuICAgICAgICAgICAgICAgIC5jaGFuZ2UsXG4gICAgICAgICAgICAgICAgLmRlbGV0ZSB7XG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICAgICAgICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQtc2hhZG93OiAwIDAgMnB4ICNjY2M7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAuY2hhbmdlIHtcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjZGNkY2Q7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLmRlbGV0ZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBAZGFuZ2VyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICY6YmVmb3JlLFxuICAgICAgICAgICAgICAgICY6YWZ0ZXIge1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAnJztcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiA2MHB4O1xuICAgICAgICAgICAgICAgICAgICB0b3A6IC0yMHB4O1xuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDEwcHggc29saWQgI2NjYztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJjphZnRlciB7XG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDEwcHggc29saWQgd2hpdGU7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogLTE5cHg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLmhlbHBlciB7XG4gICAgICAgICAgICAubmFtZSB7XG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLmhlbHAge1xuICAgICAgICAgICAgICAgIGNvbG9yOiBAbGlnaHQ7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgICZfX2JvZHkge1xuICAgICAgICAuZWRpdC1zdGF0dXMge1xuICAgICAgICAgICAgYm9yZGVyOiAycHggc29saWQ7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgICAgICB3aWR0aDogY2FsYyg4MCUgKyA0MHB4KTtcbiAgICAgICAgICAgIG1hcmdpbjogNDBweCAwO1xuICAgICAgICAgICAgcGFkZGluZzogMTBweCAyMHB4O1xuXG4gICAgICAgICAgICBmb250LXNpemU6IDE4cHg7XG5cbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgICAgICAmLmZhaWwge1xuICAgICAgICAgICAgICAgIGJvcmRlci1jb2xvcjogQGRhbmdlcjtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKEBkYW5nZXIsIDAuMik7XG4gICAgICAgICAgICAgICAgY29sb3I6IGRhcmtlbihAZGFuZ2VyLCA1JSk7XG5cbiAgICAgICAgICAgICAgICAuY2xvc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWxsOiBkYXJrZW4oQGRhbmdlciwgMTAlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICYuc3VjY2VzcyB7XG4gICAgICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiBAc3VjY2VzcztcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKEBzdWNjZXNzLCAwLjIpO1xuICAgICAgICAgICAgICAgIGNvbG9yOiBkYXJrZW4oQHN1Y2Nlc3MsIDEwJSk7XG5cbiAgICAgICAgICAgICAgICAuY2xvc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWxsOiBkYXJrZW4oQHN1Y2Nlc3MsIDEwJSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAuY2xvc2Uge1xuICAgICAgICAgICAgICAgIHdpZHRoOiA5cHg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA5cHg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgZmxleC13cmFwOiB3cmFwO1xuXG4gICAgICAgICAgICAuaW5wdXQtd3JhcHBlciB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwJTtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cbiAgICAgICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDQwcHg7XG5cbiAgICAgICAgICAgICAgICBsYWJlbCB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDVweDtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IEBsaWdodDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpbnB1dCB7XG4gICAgICAgICAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBAZmY7XG4gICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcblxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwcHg7XG5cbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMTBweDtcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTVweDtcblxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG5cbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIDAuNXM7XG5cbiAgICAgICAgICAgICAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXItY29sb3I6IGxpZ2h0ZW4oQGFjdGl2ZSwgMTAlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAuZXJyb3Ige1xuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBAZGFuZ2VyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLmJ0biB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXRvcDogNDBweDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ== */"] });


/***/ }),

/***/ "p0Ul":
/*!***********************************************************************!*\
  !*** ./src/app/components/network/users-list/users-list.component.ts ***!
  \***********************************************************************/
/*! exports provided: UsersListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UsersListComponent", function() { return UsersListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");




function UsersListComponent_h2_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h2", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "You have no connections yet");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function UsersListComponent_div_2_div_1_button_11_Template(rf, ctx) { if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function UsersListComponent_div_2_div_1_button_11_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r7); const connection_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit; const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r5.removeConnection(connection_r3.user.id); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Remove");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function UsersListComponent_div_2_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "a", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "img", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, UsersListComponent_div_2_div_1_button_11_Template, 2, 0, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const connection_r3 = ctx.$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("justify-content-center", !ctx_r2.isMyProfile);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", "/profile/" + connection_r3.user.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", (connection_r3.user.info.avatar == null ? null : connection_r3.user.info.avatar.url) || "assets/img/avatar-man.png", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", connection_r3.user.firstName, " ", connection_r3.user.lastName, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](connection_r3.user.info.profession);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", connection_r3.user.info.connections.length, " connections");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r2.isMyProfile);
} }
function UsersListComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, UsersListComponent_div_2_div_1_Template, 12, 9, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r1.connections);
} }
class UsersListComponent {
    constructor() {
        this.subs = [];
        this.connections = [];
        this.isMyProfile = false;
        this.action = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    set sub(s) {
        this.subs.push(s);
    }
    removeConnection(userId) {
        this.action.emit({ action: 'remove', userId });
    }
    ngOnInit() { }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
UsersListComponent.ɵfac = function UsersListComponent_Factory(t) { return new (t || UsersListComponent)(); };
UsersListComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: UsersListComponent, selectors: [["app-users-list"]], inputs: { connections: "connections", isMyProfile: "isMyProfile" }, outputs: { action: "action" }, decls: 3, vars: 2, consts: [[1, "connections"], ["class", "no-connections", 4, "ngIf"], ["class", "connections__list", 4, "ngIf"], [1, "no-connections"], [1, "connections__list"], ["class", "connection", 3, "justify-content-center", 4, "ngFor", "ngForOf"], [1, "connection"], ["data-hystclose", "", 1, "user", 3, "routerLink"], [1, "avatar-box"], ["alt", "avatar", 3, "src"], [1, "info"], [1, "name"], [1, "profession"], [1, "user-connections"], ["class", "btn", 3, "click", 4, "ngIf"], [1, "btn", 3, "click"]], template: function UsersListComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, UsersListComponent_h2_1_Template, 2, 0, "h2", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, UsersListComponent_div_2_Template, 2, 1, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.connections.length === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.connections.length);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterLinkWithHref"]], styles: [".light-thin-scrollbar[_ngcontent-%COMP%] {\n  \n}\n.light-thin-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 5px;\n  \n  background-color: white;\n}\n.light-thin-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background-color: #c1c1c1;\n  border-radius: 20px;\n}\n.connections[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.connections[_ngcontent-%COMP%]   .no-connections[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 600;\n  margin: 60px 0;\n}\n.connections[_ngcontent-%COMP%]   .number[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 500;\n  margin-bottom: 20px;\n}\n.connections__list[_ngcontent-%COMP%] {\n  margin-top: 30px;\n  max-width: 800px;\n  width: 80%;\n  max-height: 650px;\n  \n  overflow: auto;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.connections__list[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 5px;\n  \n  background-color: white;\n}\n.connections__list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background-color: #c1c1c1;\n  border-radius: 20px;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  padding: 15px;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]:not(:first-child) {\n  border-top: 1px solid #ccc;\n}\n.connections__list[_ngcontent-%COMP%]   .connection.justify-content-center[_ngcontent-%COMP%] {\n  justify-content: center;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%] {\n  display: flex;\n  text-decoration: none;\n  color: #181818;\n  font-size: 11px;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .avatar-box[_ngcontent-%COMP%] {\n  width: 58px;\n  height: 58px;\n  margin-bottom: 15px;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%] {\n  margin-top: 5px;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .user-connections[_ngcontent-%COMP%] {\n  color: #0871a8;\n  font-weight: 500;\n}\n.connections__list[_ngcontent-%COMP%]   .connection[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  align-self: center;\n  height: 40px;\n  margin-top: 0;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHN0eWxlc1xcbWl4aW5zXFxzY3JvbGxiYXItbWl4aW5zLmxlc3MiLCJ1c2Vycy1saXN0LmNvbXBvbmVudC5sZXNzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VDQ0Usd0JBQXdCO0FBQzFCO0FEREk7RUFDSSxVQUFBO0VDR04scUNBQXFDO0VERi9CLHVCQUFBO0FDSVI7QURBSTtFQUNJLHlCQUFBO0VBQ0EsbUJBQUE7QUNFUjtBQVJBO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7QUFVSjtBQWJBO0VBTVEsZUFBQTtFQUNBLGdCQUFBO0VBRUEsY0FBQTtBQVNSO0FBbEJBO0VBYVEsZUFBQTtFQUNBLGdCQUFBO0VBRUEsbUJBQUE7QUFPUjtBQUpJO0VBQ0ksZ0JBQUE7RUFFQSxnQkFBQTtFQUNBLFVBQUE7RUFFQSxpQkFBQTtFQUlOLHdCQUF3QjtFQUZsQixjQUFBO0VBRUEsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7QUFHUjtBRHBDSTtFQUNJLFVBQUE7RUNzQ04scUNBQXFDO0VEckMvQix1QkFBQTtBQ3VDUjtBRG5DSTtFQUNJLHlCQUFBO0VBQ0EsbUJBQUE7QUNxQ1I7QUF4Qkk7RUFlUSxXQUFBO0VBQ0EsYUFBQTtFQUNBLDhCQUFBO0VBQ0EsdUJBQUE7RUFFQSxhQUFBO0FBV1o7QUFUWTtFQUNJLDBCQUFBO0FBV2hCO0FBUlk7RUFDSSx1QkFBQTtBQVVoQjtBQXJDSTtFQStCWSxhQUFBO0VBR0EscUJBQUE7RUFDQSxjQUFBO0VBRUEsZUFBQTtBQU1oQjtBQTNDSTtFQXdDZ0IsV0FBQTtFQUNBLFlBQUE7RUFFQSxtQkFBQTtBQUtwQjtBQWhESTtFQStDZ0IsZUFBQTtBQUlwQjtBQW5ESTtFQWlEb0IsZUFBQTtFQUNBLGdCQUFBO0FBS3hCO0FBdkRJO0VBc0RvQixjQUFBO0VBQ0EsZ0JBQUE7QUFJeEI7QUEzREk7RUE2RFksa0JBQUE7RUFFQSxZQUFBO0VBQ0EsYUFBQTtBQUFoQiIsImZpbGUiOiJ1c2Vycy1saXN0LmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiLmxpZ2h0LXRoaW4tc2Nyb2xsYmFyIHtcbiAgICAmOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgICAgIHdpZHRoOiA1cHg7IC8qINGI0LjRgNC40L3QsCDQtNC70Y8g0LLQtdGA0YLQuNC60LDQu9GM0L3QvtCz0L4g0YHQutGA0L7Qu9C70LAgKi9cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gICAgfVxuXG4gICAgLyog0L/QvtC70LfRg9C90L7QuiDRgdC60YDQvtC70LvQsdCw0YDQsCAqL1xuICAgICY6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRlbihAbGlnaHQsIDMwJSk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XG4gICAgfVxufVxuIiwiQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvdmFyaWFibGVzJztcbkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL21peGlucy9zY3JvbGxiYXItbWl4aW5zJztcblxuLmNvbm5lY3Rpb25zIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgIC5uby1jb25uZWN0aW9ucyB7XG4gICAgICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcblxuICAgICAgICBtYXJnaW46IDYwcHggMDtcbiAgICB9XG5cbiAgICAubnVtYmVyIHtcbiAgICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuXG4gICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XG4gICAgfVxuXG4gICAgJl9fbGlzdCB7XG4gICAgICAgIG1hcmdpbi10b3A6IDMwcHg7XG5cbiAgICAgICAgbWF4LXdpZHRoOiA4MDBweDtcbiAgICAgICAgd2lkdGg6IDgwJTtcblxuICAgICAgICBtYXgtaGVpZ2h0OiA2NTBweDtcbiAgICAgICAgLmxpZ2h0LXRoaW4tc2Nyb2xsYmFyKCk7XG4gICAgICAgIG92ZXJmbG93OiBhdXRvO1xuXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgLmNvbm5lY3Rpb24ge1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG5cbiAgICAgICAgICAgIHBhZGRpbmc6IDE1cHg7XG5cbiAgICAgICAgICAgICY6bm90KDpmaXJzdC1jaGlsZCkge1xuICAgICAgICAgICAgICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjY2NjO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmLmp1c3RpZnktY29udGVudC1jZW50ZXIge1xuICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAudXNlciB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICAvLyBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgICAgICAgICAgIGNvbG9yOiBAYmFzZTtcblxuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcblxuICAgICAgICAgICAgICAgIC5hdmF0YXItYm94IHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDU4cHg7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogNThweDtcblxuICAgICAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxNXB4O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC5pbmZvIHtcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luLXRvcDogNXB4O1xuICAgICAgICAgICAgICAgICAgICAubmFtZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLnVzZXItY29ubmVjdGlvbnMge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEBhY3RpdmU7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAuYnRuIHtcbiAgICAgICAgICAgICAgICBhbGlnbi1zZWxmOiBjZW50ZXI7XG5cbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXRvcDogMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ== */"] });


/***/ }),

/***/ "pBt9":
/*!**********************************************!*\
  !*** ./src/app/views/feed/feed.component.ts ***!
  \**********************************************/
/*! exports provided: FeedComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeedComponent", function() { return FeedComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _feed_main_feed_main_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./feed-main/feed-main.component */ "+PC+");
/* harmony import */ var _feed_side_feed_side_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./feed-side/feed-side.component */ "ZrjY");



class FeedComponent {
    constructor() { }
    ngOnInit() { }
}
FeedComponent.ɵfac = function FeedComponent_Factory(t) { return new (t || FeedComponent)(); };
FeedComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FeedComponent, selectors: [["app-feed"]], decls: 4, vars: 0, consts: [[1, "feed"], [1, "feed__wrapper"], [1, "main"], [1, "side"]], template: function FeedComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "app-feed-main", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "app-feed-side", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_feed_main_feed_main_component__WEBPACK_IMPORTED_MODULE_1__["FeedMainComponent"], _feed_side_feed_side_component__WEBPACK_IMPORTED_MODULE_2__["FeedSideComponent"]], styles: [".feed[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 1440px;\n  margin: 0 auto;\n}\n.feed__wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 1440px;\n  margin: 40px 130px;\n  display: flex;\n}\n.main[_ngcontent-%COMP%] {\n  width: 75%;\n  max-width: 850px;\n  margin-right: 40px;\n}\n.side[_ngcontent-%COMP%] {\n  width: 25%;\n  max-width: 290px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZlZWQuY29tcG9uZW50Lmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxXQUFBO0VBQ0EsaUJBQUE7RUFDQSxjQUFBO0FBREo7QUFHSTtFQUNJLFdBQUE7RUFDQSxpQkFBQTtFQUVBLGtCQUFBO0VBQ0EsYUFBQTtBQUZSO0FBTUE7RUFDSSxVQUFBO0VBQ0EsZ0JBQUE7RUFFQSxrQkFBQTtBQUxKO0FBUUE7RUFDSSxVQUFBO0VBQ0EsZ0JBQUE7QUFOSiIsImZpbGUiOiJmZWVkLmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvdmFyaWFibGVzJztcblxuLmZlZWQge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1heC13aWR0aDogMTQ0MHB4O1xuICAgIG1hcmdpbjogMCBhdXRvO1xuXG4gICAgJl9fd3JhcHBlciB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBtYXgtd2lkdGg6IDE0NDBweDtcblxuICAgICAgICBtYXJnaW46IDQwcHggMTMwcHg7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgfVxufVxuXG4ubWFpbiB7XG4gICAgd2lkdGg6IDc1JTtcbiAgICBtYXgtd2lkdGg6IDg1MHB4O1xuXG4gICAgbWFyZ2luLXJpZ2h0OiA0MHB4O1xufVxuXG4uc2lkZSB7XG4gICAgd2lkdGg6IDI1JTtcbiAgICBtYXgtd2lkdGg6IDI5MHB4O1xufVxuIl19 */"] });


/***/ }),

/***/ "pja6":
/*!********************************************!*\
  !*** ./src/app/store/auth/auth.reducer.ts ***!
  \********************************************/
/*! exports provided: authNode, authReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "authNode", function() { return authNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "authReducer", function() { return authReducer; });
/* harmony import */ var _auth_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auth.actions */ "C9XJ");

const authNode = 'auth';
const initialState = {
    authStatus: false,
};
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case _auth_actions__WEBPACK_IMPORTED_MODULE_0__["SIGN_IN_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { authStatus: true });
        case _auth_actions__WEBPACK_IMPORTED_MODULE_0__["LOG_OUT_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { authStatus: false });
        default:
            return state;
    }
};


/***/ }),

/***/ "sjK5":
/*!******************************************!*\
  !*** ./src/app/services/chat.service.ts ***!
  \******************************************/
/*! exports provided: ChatService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatService", function() { return ChatService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _web_socket_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./web-socket.service */ "iNhY");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "l7P3");



class ChatService {
    constructor(socketService, store$) {
        this.socketService = socketService;
        this.store$ = store$;
        this.socketService
            .listen('connection')
            .subscribe(() => this.onConnection());
        this.socketService
            .listen('new-message')
            .subscribe(message => console.log('WS response => ', message));
    }
    joinToChat(chatId) {
        this.socketService.emit('joinPrivateChat', { chatId });
    }
    sendMessage(message) {
        this.socketService.emit('sendMessage', { message });
    }
    test(message) {
        console.log(message);
        this.socketService.emit('new-message', message);
    }
    onConnection() {
        console.log('Connected!');
        this.socketService
            .listen('receiveMsg')
            .subscribe(data => console.log('[WebSocket Message]', data.msg));
        this.socketService
            .listen('joinSuccess')
            .subscribe(data => console.log('[WebSocket Message]', data.message));
        // this.store$.dispatch(new ReceiveMessageAction({
        //     senderId: data.senderId,
        //     content: data.msg
        // }))
    }
}
ChatService.ɵfac = function ChatService_Factory(t) { return new (t || ChatService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_web_socket_service__WEBPACK_IMPORTED_MODULE_1__["WebSocketService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"])); };
ChatService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: ChatService, factory: ChatService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "sq79":
/*!*********************************************************!*\
  !*** ./src/app/pipes/masked-phone/masked-phone.pipe.ts ***!
  \*********************************************************/
/*! exports provided: MaskedPhonePipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaskedPhonePipe", function() { return MaskedPhonePipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class MaskedPhonePipe {
    transform(value, ...args) {
        const length = value.length;
        let result = value[0] + value[1];
        for (let i = 2; i < length - 2; i++) {
            result += '•';
        }
        result += value[length - 2];
        result += value[length - 1];
        return result;
    }
}
MaskedPhonePipe.ɵfac = function MaskedPhonePipe_Factory(t) { return new (t || MaskedPhonePipe)(); };
MaskedPhonePipe.ɵpipe = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({ name: "maskedPhone", type: MaskedPhonePipe, pure: true });


/***/ }),

/***/ "t02T":
/*!*************************************************!*\
  !*** ./src/app/views/notices/notices.module.ts ***!
  \*************************************************/
/*! exports provided: NoticesModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NoticesModule", function() { return NoticesModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _notices_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./notices.component */ "ws4F");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");



class NoticesModule {
}
NoticesModule.ɵfac = function NoticesModule_Factory(t) { return new (t || NoticesModule)(); };
NoticesModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({ type: NoticesModule });
NoticesModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({ imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"]]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](NoticesModule, { declarations: [_notices_component__WEBPACK_IMPORTED_MODULE_1__["NoticesComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"]] }); })();


/***/ }),

/***/ "uQlT":
/*!*********************************************!*\
  !*** ./src/app/svg-icon/svg-icon.module.ts ***!
  \*********************************************/
/*! exports provided: SvgIconModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgIconModule", function() { return SvgIconModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _svg_icon_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./svg-icon.component */ "W/uP");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");



class SvgIconModule {
}
SvgIconModule.ɵfac = function SvgIconModule_Factory(t) { return new (t || SvgIconModule)(); };
SvgIconModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({ type: SvgIconModule });
SvgIconModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({ imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"]]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](SvgIconModule, { declarations: [_svg_icon_component__WEBPACK_IMPORTED_MODULE_1__["SvgIconComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"]], exports: [_svg_icon_component__WEBPACK_IMPORTED_MODULE_1__["SvgIconComponent"]] }); })();


/***/ }),

/***/ "v3Q/":
/*!****************************************************!*\
  !*** ./src/app/store/profile/profile.selectors.ts ***!
  \****************************************************/
/*! exports provided: profileFeatureSelector, profileSelector, profileIdSelector, profileNameSelector, profilePhoneSelector, profileEmailSelector, profilePostsSelector, profileConnectionsSelector, profileCurrentViewsSelector, profilePrevViewsSelector, profileAvatarSelector, profileHeaderBgSelector, profileDescriptionSelector, profileProfessionSelector, profileDOBSelector, profileLocalitySelector, profileSentConnectionsSelector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileFeatureSelector", function() { return profileFeatureSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileSelector", function() { return profileSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileIdSelector", function() { return profileIdSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileNameSelector", function() { return profileNameSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profilePhoneSelector", function() { return profilePhoneSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileEmailSelector", function() { return profileEmailSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profilePostsSelector", function() { return profilePostsSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileConnectionsSelector", function() { return profileConnectionsSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileCurrentViewsSelector", function() { return profileCurrentViewsSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profilePrevViewsSelector", function() { return profilePrevViewsSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileAvatarSelector", function() { return profileAvatarSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileHeaderBgSelector", function() { return profileHeaderBgSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileDescriptionSelector", function() { return profileDescriptionSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileProfessionSelector", function() { return profileProfessionSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileDOBSelector", function() { return profileDOBSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileLocalitySelector", function() { return profileLocalitySelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "profileSentConnectionsSelector", function() { return profileSentConnectionsSelector; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _profile_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./profile.reducer */ "O8+U");


const profileFeatureSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createFeatureSelector"])(_profile_reducer__WEBPACK_IMPORTED_MODULE_1__["profileNode"]);
const profileSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => state);
const profileIdSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => state.id);
const profileNameSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => `${state.firstName} ${state.lastName}`);
const profilePhoneSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => state.phone);
const profileEmailSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => state.email);
const profilePostsSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => state.info.posts);
const profileConnectionsSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => state.info.connections);
const profileCurrentViewsSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => state.info.views.current);
const profilePrevViewsSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => state.info.views.prev);
const profileAvatarSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => { var _a, _b; return (_b = (_a = state.info.avatar) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : '../../../assets/img/avatar-man.png'; });
const profileHeaderBgSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => { var _a, _b; return (_b = (_a = state.info.profileHeaderBg) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : '../../../assets/img/profile-header.png'; });
const profileDescriptionSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => state.info.description);
const profileProfessionSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => state.info.profession);
const profileDOBSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => state.info.dateOfBirth);
const profileLocalitySelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => {
    const locality = state.info.locality;
    return `${locality.city}, ${locality.country}`;
});
const profileSentConnectionsSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(profileFeatureSelector, state => state.info.sentConnections);


/***/ }),

/***/ "vRLT":
/*!****************************************************!*\
  !*** ./src/app/views/network/network.component.ts ***!
  \****************************************************/
/*! exports provided: NetworkComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkComponent", function() { return NetworkComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _network_side_network_side_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./network-side/network-side.component */ "wkCj");
/* harmony import */ var _network_main_network_main_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./network-main/network-main.component */ "nMop");



class NetworkComponent {
    constructor() {
        this.activeTab = 'invitations';
    }
    activateTab(tab) {
        console.log(tab);
        this.activeTab = tab;
    }
    ngOnInit() { }
}
NetworkComponent.ɵfac = function NetworkComponent_Factory(t) { return new (t || NetworkComponent)(); };
NetworkComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: NetworkComponent, selectors: [["app-network"]], decls: 3, vars: 1, consts: [[1, "network-wrapper"], [1, "side", 3, "activateItem"], [1, "main", 3, "activeTab"]], template: function NetworkComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "app-network-side", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("activateItem", function NetworkComponent_Template_app_network_side_activateItem_1_listener($event) { return ctx.activateTab($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "app-network-main", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("activeTab", ctx.activeTab);
    } }, directives: [_network_side_network_side_component__WEBPACK_IMPORTED_MODULE_1__["NetworkSideComponent"], _network_main_network_main_component__WEBPACK_IMPORTED_MODULE_2__["NetworkMainComponent"]], styles: [".network-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 1440px;\n  margin-top: 40px;\n  display: flex;\n  justify-content: center;\n}\n.network-wrapper[_ngcontent-%COMP%]   .side[_ngcontent-%COMP%] {\n  width: 25%;\n  max-width: 290px;\n  margin-right: 40px;\n}\n.network-wrapper[_ngcontent-%COMP%]   .main[_ngcontent-%COMP%] {\n  width: 75%;\n  max-width: 850px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldHdvcmsuY29tcG9uZW50Lmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxXQUFBO0VBQ0EsaUJBQUE7RUFFQSxnQkFBQTtFQUVBLGFBQUE7RUFDQSx1QkFBQTtBQURKO0FBTkE7RUFVUSxVQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtBQURSO0FBWEE7RUFnQlEsVUFBQTtFQUNBLGdCQUFBO0FBRlIiLCJmaWxlIjoibmV0d29yay5jb21wb25lbnQubGVzcyIsInNvdXJjZXNDb250ZW50IjpbIi5uZXR3b3JrLXdyYXBwZXIge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1heC13aWR0aDogMTQ0MHB4O1xuXG4gICAgbWFyZ2luLXRvcDogNDBweDtcblxuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbiAgICAuc2lkZSB7XG4gICAgICAgIHdpZHRoOiAyNSU7XG4gICAgICAgIG1heC13aWR0aDogMjkwcHg7XG4gICAgICAgIG1hcmdpbi1yaWdodDogNDBweDtcbiAgICB9XG5cbiAgICAubWFpbiB7XG4gICAgICAgIHdpZHRoOiA3NSU7XG4gICAgICAgIG1heC13aWR0aDogODUwcHg7XG4gICAgfVxufVxuIl19 */"] });


/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _layouts_base_base_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./layouts/base/base.component */ "OE1Y");
/* harmony import */ var _views_feed_feed_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./views/feed/feed.component */ "pBt9");
/* harmony import */ var _views_network_network_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views/network/network.component */ "vRLT");
/* harmony import */ var _views_jobs_jobs_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./views/jobs/jobs.component */ "GPpY");
/* harmony import */ var _views_chat_chat_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./views/chat/chat.component */ "l9bd");
/* harmony import */ var _views_notices_notices_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./views/notices/notices.component */ "ws4F");
/* harmony import */ var _views_profile_profile_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./views/profile/profile.component */ "wF9P");
/* harmony import */ var _layouts_auth_auth_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./layouts/auth/auth.component */ "Vbwu");
/* harmony import */ var _views_auth_authorization_authorization_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./views/auth/authorization/authorization.component */ "iwNQ");
/* harmony import */ var _views_auth_registration_registration_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./views/auth/registration/registration.component */ "Jlp3");
/* harmony import */ var _guards_auth_guard__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./guards/auth.guard */ "UTcu");
/* harmony import */ var _views_profile_edit_profile_edit_profile_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./views/profile/edit-profile/edit-profile.component */ "QBc3");
/* harmony import */ var _components_account_deleted_account_deleted_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/account-deleted/account-deleted.component */ "gPp/");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/core */ "fXoL");
















const routes = [
    { path: '', pathMatch: 'full', redirectTo: '/feed' },
    {
        component: _layouts_base_base_component__WEBPACK_IMPORTED_MODULE_1__["BaseLayoutComponent"],
        path: '',
        children: [
            {
                path: 'feed',
                component: _views_feed_feed_component__WEBPACK_IMPORTED_MODULE_2__["FeedComponent"],
                canActivate: [_guards_auth_guard__WEBPACK_IMPORTED_MODULE_11__["AuthGuard"]],
            },
            {
                path: 'network',
                component: _views_network_network_component__WEBPACK_IMPORTED_MODULE_3__["NetworkComponent"],
                canActivate: [_guards_auth_guard__WEBPACK_IMPORTED_MODULE_11__["AuthGuard"]],
            },
            {
                path: 'jobs',
                component: _views_jobs_jobs_component__WEBPACK_IMPORTED_MODULE_4__["JobsComponent"],
                canActivate: [_guards_auth_guard__WEBPACK_IMPORTED_MODULE_11__["AuthGuard"]],
            },
            {
                path: 'chats',
                component: _views_chat_chat_component__WEBPACK_IMPORTED_MODULE_5__["ChatComponent"],
                canActivate: [_guards_auth_guard__WEBPACK_IMPORTED_MODULE_11__["AuthGuard"]],
            },
            {
                path: 'notices',
                component: _views_notices_notices_component__WEBPACK_IMPORTED_MODULE_6__["NoticesComponent"],
                canActivate: [_guards_auth_guard__WEBPACK_IMPORTED_MODULE_11__["AuthGuard"]],
            },
            {
                path: 'profile',
                component: _views_profile_profile_component__WEBPACK_IMPORTED_MODULE_7__["ProfileComponent"],
                canActivate: [_guards_auth_guard__WEBPACK_IMPORTED_MODULE_11__["AuthGuard"]],
            },
            {
                path: 'profile/edit',
                component: _views_profile_edit_profile_edit_profile_component__WEBPACK_IMPORTED_MODULE_12__["EditProfileComponent"],
                canActivate: [_guards_auth_guard__WEBPACK_IMPORTED_MODULE_11__["AuthGuard"]],
            },
            {
                path: 'profile/:id',
                component: _views_profile_profile_component__WEBPACK_IMPORTED_MODULE_7__["ProfileComponent"],
                canActivate: [_guards_auth_guard__WEBPACK_IMPORTED_MODULE_11__["AuthGuard"]],
            },
        ],
    },
    {
        path: '',
        component: _layouts_auth_auth_component__WEBPACK_IMPORTED_MODULE_8__["AuthLayoutComponent"],
        children: [
            { path: 'signup', component: _views_auth_registration_registration_component__WEBPACK_IMPORTED_MODULE_10__["RegistrationComponent"] },
            { path: 'signin', component: _views_auth_authorization_authorization_component__WEBPACK_IMPORTED_MODULE_9__["AuthorizationComponent"] },
        ],
    },
    {
        path: 'account-deleted',
        component: _components_account_deleted_account_deleted_component__WEBPACK_IMPORTED_MODULE_13__["AccountDeletedComponent"],
    },
];
class AppRoutingModule {
}
AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); };
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵdefineInjector"]({ providers: [_guards_auth_guard__WEBPACK_IMPORTED_MODULE_11__["AuthGuard"]], imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();


/***/ }),

/***/ "vuXr":
/*!*************************************************************************!*\
  !*** ./src/app/components/network/invitations/invitations.component.ts ***!
  \*************************************************************************/
/*! exports provided: InvitationsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvitationsComponent", function() { return InvitationsComponent; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../store/my-profile/my-profile.selectors */ "0jmn");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../store/my-profile/my-profile.actions */ "fLR6");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _services_profile_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../services/profile.service */ "Aso2");
/* harmony import */ var _services_chat_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../services/chat.service */ "sjK5");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _connections_list_connections_list_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../connections-list/connections-list.component */ "SS4A");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ "tyNb");












function InvitationsComponent_h2_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "h2", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " You have no incoming connections yet ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} }
function InvitationsComponent_h2_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "h2", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " You have no sent connections yet ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} }
function InvitationsComponent_app_connections_list_9_Template(rf, ctx) { if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "app-connections-list", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("action", function InvitationsComponent_app_connections_list_9_Template_app_connections_list_action_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r6); const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](); return ctx_r5.action($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("connections", ctx_r2.newConnections)("type", "incoming");
} }
function InvitationsComponent_app_connections_list_10_Template(rf, ctx) { if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "app-connections-list", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("action", function InvitationsComponent_app_connections_list_10_Template_app_connections_list_action_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r8); const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](); return ctx_r7.action($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("connections", ctx_r3.sentConnections)("type", "sent");
} }
function InvitationsComponent_div_11_a_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "a", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](3, "img", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](4, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](7, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](9, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](11, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const connection_r10 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("routerLink", "/profile/" + connection_r10.user.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("src", connection_r10.user.info.avatar ? connection_r10.user.info.avatar.url : "assets/img/avatar-man.png", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](connection_r10.user.firstName + " " + connection_r10.user.lastName);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](connection_r10.user.info.profession);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind2"](11, 5, connection_r10.date, "medium"));
} }
function InvitationsComponent_div_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](2, "Recent connections");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](4, InvitationsComponent_div_11_a_4_Template, 12, 8, "a", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx_r4.recentConnections);
} }
class InvitationsComponent {
    constructor(store$, profileService, chatService) {
        this.store$ = store$;
        this.profileService = profileService;
        this.chatService = chatService;
        this.subs = [];
        this.myProfileId = -1;
        this.myConnections$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Observable"]();
        this.currentTab = 'received';
        this.receivedConnections$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileReceivedConnectionsSelector"]));
        this.sentConnections$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileSentConnectionsSelector"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(connections => {
            const identifiers = [];
            connections.forEach(el => identifiers.push(el.userId));
            return { identifiers, connections };
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(({ identifiers, connections }) => {
            if (identifiers.length > 1)
                return this.profileService
                    .getProfileInfo(identifiers.join(','))
                    .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(res => res.users), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(users => {
                    return users.map(user => ({
                        user,
                        message: connections.find(connection => connection.userId === user.id)
                            .message,
                    }));
                }));
            if (identifiers.length === 1)
                return this.profileService
                    .getProfileInfo(identifiers[0])
                    .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(res => res.user), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(user => {
                    return [
                        {
                            user,
                            message: connections.find(connection => connection.userId === user.id)
                                .message,
                        },
                    ];
                }));
            else
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])([]);
        }));
        this.newConnections = [];
        this.sentConnections = [];
        this.recentConnections = [];
    }
    set sub(s) {
        this.subs.push(s);
    }
    acceptConnection(senderId) {
        this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_4__["MyProfileAcceptConnectionAction"]({
            senderId,
            userId: this.myProfileId,
            date: Date.now(),
        }));
    }
    declineConnection(senderId) {
        this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_4__["MyProfileDeclineConnectionAction"]({
            senderId,
            userId: this.myProfileId,
        }));
    }
    cancelConnection(userId) {
        this.store$.dispatch(new _store_my_profile_my_profile_actions__WEBPACK_IMPORTED_MODULE_4__["MyProfileCancelConnectionAction"]({
            senderId: this.myProfileId,
            userId,
        }));
    }
    action(data) {
        if (data.type === 'accept') {
            this.acceptConnection(data.id);
        }
        if (data.type === 'decline') {
            this.declineConnection(data.id);
        }
        if (data.type === 'cancel') {
            this.cancelConnection(data.id);
        }
    }
    activateTab(e) {
        const element = e.target;
        const parent = element.parentNode;
        const children = Array.from(parent.children);
        children.forEach(el => el.classList.remove('active'));
        element.classList.add('active');
        this.currentTab = element.textContent.toLowerCase();
    }
    ngOnInit() {
        this.sub = this.receivedConnections$.subscribe(connections => {
            if (!connections.length) {
                this.newConnections = [];
                return;
            }
            const usersId = connections.map(connection => connection.userId);
            if (usersId.length > 1) {
                this.sub = this.profileService
                    .getProfileInfo(usersId.join(','))
                    .subscribe(res => {
                    const users = res.users;
                    this.newConnections = connections.map(connection => {
                        return {
                            user: users.find(user => user.id === connection.userId),
                            message: connection.message,
                        };
                    });
                });
            }
            else if (usersId.length === 1) {
                this.sub = this.profileService
                    .getProfileInfo(usersId.join(','))
                    .subscribe(res => {
                    const user = res.user;
                    this.newConnections = connections.map(connection => {
                        return {
                            user,
                            message: connection.message,
                        };
                    });
                });
            }
        });
        this.sub = this.myConnections$
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(connections => {
            console.log('map connections', connections);
            return connections.reverse();
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])((val, index) => index < 4))
            .subscribe(connections => {
            this.recentConnections = connections;
            console.log('recent connections', connections);
        });
        this.sub = this.sentConnections$.subscribe(sent => {
            this.sentConnections = sent;
        });
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
InvitationsComponent.ɵfac = function InvitationsComponent_Factory(t) { return new (t || InvitationsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["Store"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_services_profile_service__WEBPACK_IMPORTED_MODULE_6__["ProfileService"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_services_chat_service__WEBPACK_IMPORTED_MODULE_7__["ChatService"])); };
InvitationsComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({ type: InvitationsComponent, selectors: [["app-invitations"]], inputs: { myProfileId: "myProfileId", myConnections$: "myConnections$" }, decls: 12, vars: 5, consts: [[1, "invitations"], [1, "tabs", 3, "click"], [1, "tab", "active"], [1, "tab"], [1, "content"], ["class", "no-connections", 4, "ngIf"], [3, "connections", "type", "action", 4, "ngIf"], ["class", "recent-connections", 4, "ngIf"], [1, "no-connections"], [3, "connections", "type", "action"], [1, "recent-connections"], [1, "title"], [1, "users"], ["class", "profile-link", 3, "routerLink", 4, "ngFor", "ngForOf"], [1, "profile-link", 3, "routerLink"], [1, "user"], [1, "avatar-box"], ["alt", "avatar", 3, "src"], [1, "info"], [1, "name"], [1, "profession"], [1, "date"]], template: function InvitationsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function InvitationsComponent_Template_div_click_1_listener($event) { return ctx.activateTab($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3, "Received");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](5, "Sent");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](7, InvitationsComponent_h2_7_Template, 2, 0, "h2", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](8, InvitationsComponent_h2_8_Template, 2, 0, "h2", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](9, InvitationsComponent_app_connections_list_9_Template, 1, 2, "app-connections-list", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](10, InvitationsComponent_app_connections_list_10_Template, 1, 2, "app-connections-list", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](11, InvitationsComponent_div_11_Template, 5, 1, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", !ctx.newConnections.length && ctx.currentTab === "received");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", !ctx.sentConnections.length && ctx.currentTab === "sent");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.newConnections.length && ctx.currentTab === "received");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.sentConnections.length && ctx.currentTab === "sent");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.recentConnections.length);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_8__["NgIf"], _connections_list_connections_list_component__WEBPACK_IMPORTED_MODULE_9__["ConnectionsListComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_10__["RouterLinkWithHref"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_8__["DatePipe"]], styles: [".user-select-none[_ngcontent-%COMP%] {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.light-thin-scrollbar[_ngcontent-%COMP%] {\n  \n}\n.light-thin-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 5px;\n  \n  background-color: white;\n}\n.light-thin-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background-color: #c1c1c1;\n  border-radius: 20px;\n}\n.invitations[_ngcontent-%COMP%]   .tabs[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  text-transform: uppercase;\n  text-align: center;\n  border-bottom: 1px solid #e7e7e7;\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.invitations[_ngcontent-%COMP%]   .tabs[_ngcontent-%COMP%]   .tab[_ngcontent-%COMP%] {\n  width: 200px;\n  height: 50px;\n  line-height: 50px;\n  font-size: 12px;\n  font-weight: 600;\n  color: #181818;\n  border-radius: 4px 4px 0 0;\n  cursor: pointer;\n}\n.invitations[_ngcontent-%COMP%]   .tabs[_ngcontent-%COMP%]   .tab.active[_ngcontent-%COMP%] {\n  background-color: #0871a8;\n  color: white;\n  font-weight: 500;\n}\n.invitations[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  min-height: 400px;\n}\n.invitations[_ngcontent-%COMP%]   .no-connections[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-top: 40px;\n  font-weight: 600;\n  font-size: 24px;\n}\n.invitations[_ngcontent-%COMP%]   .recent-connections[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  text-align: center;\n  text-transform: uppercase;\n  font-weight: 600;\n}\n.invitations[_ngcontent-%COMP%]   .recent-connections[_ngcontent-%COMP%]   .users[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: 30px;\n  display: flex;\n  justify-content: space-between;\n  flex-wrap: wrap;\n}\n.invitations[_ngcontent-%COMP%]   .recent-connections[_ngcontent-%COMP%]   .users[_ngcontent-%COMP%]   .profile-link[_ngcontent-%COMP%] {\n  text-decoration: none;\n  width: 30%;\n}\n.invitations[_ngcontent-%COMP%]   .recent-connections[_ngcontent-%COMP%]   .users[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  min-width: 200px;\n  margin-bottom: 10px;\n  margin-right: 50px;\n  padding: 20px 30px;\n  color: #181818;\n}\n.invitations[_ngcontent-%COMP%]   .recent-connections[_ngcontent-%COMP%]   .users[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .avatar-box[_ngcontent-%COMP%] {\n  width: 52px;\n  height: 52px;\n}\n.invitations[_ngcontent-%COMP%]   .recent-connections[_ngcontent-%COMP%]   .users[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n}\n.invitations[_ngcontent-%COMP%]   .recent-connections[_ngcontent-%COMP%]   .users[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .profession[_ngcontent-%COMP%] {\n  font-size: 10px;\n}\n.invitations[_ngcontent-%COMP%]   .recent-connections[_ngcontent-%COMP%]   .users[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .date[_ngcontent-%COMP%] {\n  position: absolute;\n  color: #747474;\n  font-size: 10px;\n  right: 0;\n  bottom: 0;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHN0eWxlc1xcbWl4aW5zXFx0ZXh0LW1peGlucy5sZXNzIiwiaW52aXRhdGlvbnMuY29tcG9uZW50Lmxlc3MiLCIuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzdHlsZXNcXG1peGluc1xcc2Nyb2xsYmFyLW1peGlucy5sZXNzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksaUJBQUE7RUFDQSx5QkFBQTtFQUNBLHNCQUFBO0VBQ0EscUJBQUE7QUNDSjtBQ0xBO0VET0Usd0JBQXdCO0FBQzFCO0FDUEk7RUFDSSxVQUFBO0VEU04scUNBQXFDO0VDUi9CLHVCQUFBO0FEVVI7QUNOSTtFQUNJLHlCQUFBO0VBQ0EsbUJBQUE7QURRUjtBQWJBO0VBRVEsV0FBQTtFQUNBLGFBQUE7RUFDQSx5QkFBQTtFQUNBLGtCQUFBO0VBRUEsZ0NBQUE7RURWSixpQkFBQTtFQUNBLHlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxxQkFBQTtBQ3dCSjtBQXhCQTtFQVVZLFlBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBQUE7RUFFQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0VBRUEsMEJBQUE7RUFDQSxlQUFBO0FBZVo7QUFiWTtFQUNJLHlCQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0FBZWhCO0FBdkNBO0VBOEJRLGFBQUE7RUFDQSxzQkFBQTtFQUNBLDhCQUFBO0VBRUEsaUJBQUE7QUFXUjtBQTdDQTtFQXNDUSxrQkFBQTtFQUNBLGdCQUFBO0VBRUEsZ0JBQUE7RUFDQSxlQUFBO0FBU1I7QUFuREE7RUErQ1ksa0JBQUE7RUFDQSx5QkFBQTtFQUVBLGdCQUFBO0FBTVo7QUF4REE7RUFzRFksV0FBQTtFQUNBLGdCQUFBO0VBRUEsYUFBQTtFQUNBLDhCQUFBO0VBQ0EsZUFBQTtBQUlaO0FBL0RBO0VBOERnQixxQkFBQTtFQUNBLFVBQUE7QUFJaEI7QUFuRUE7RUFtRWdCLGtCQUFBO0VBRUEsV0FBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUVBLGdCQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLGtCQUFBO0VBRUEsY0FBQTtBQUFoQjtBQTlFQTtFQWlGb0IsV0FBQTtFQUNBLFlBQUE7QUFBcEI7QUFsRkE7RUF1RndCLGVBQUE7RUFDQSxnQkFBQTtBQUZ4QjtBQXRGQTtFQTJGd0IsZUFBQTtBQUZ4QjtBQXpGQTtFQStGb0Isa0JBQUE7RUFFQSxjQUFBO0VBQ0EsZUFBQTtFQUVBLFFBQUE7RUFDQSxTQUFBO0FBTHBCIiwiZmlsZSI6Imludml0YXRpb25zLmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiLnVzZXItc2VsZWN0LW5vbmUge1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG59XG4iLCJAaW1wb3J0ICdzcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMnO1xuQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvbWl4aW5zL3RleHQtbWl4aW5zJztcbkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL21peGlucy9zY3JvbGxiYXItbWl4aW5zJztcblxuLmludml0YXRpb25zIHtcbiAgICAudGFicyB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG5cbiAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlN2U3ZTc7XG4gICAgICAgIC51c2VyLXNlbGVjdC1ub25lKCk7XG4gICAgICAgIC50YWIge1xuICAgICAgICAgICAgd2lkdGg6IDIwMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiA1MHB4O1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDUwcHg7XG5cbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICBjb2xvcjogQGJhc2U7XG5cbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDRweCA0cHggMCAwO1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuXG4gICAgICAgICAgICAmLmFjdGl2ZSB7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogQGFjdGl2ZTtcbiAgICAgICAgICAgICAgICBjb2xvcjogd2hpdGU7XG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gLy8gdGFicyBlbmRcblxuICAgIC5jb250ZW50IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuXG4gICAgICAgIG1pbi1oZWlnaHQ6IDQwMHB4O1xuICAgIH1cblxuICAgIC5uby1jb25uZWN0aW9ucyB7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgbWFyZ2luLXRvcDogNDBweDtcblxuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBmb250LXNpemU6IDI0cHg7XG4gICAgfVxuXG4gICAgLnJlY2VudC1jb25uZWN0aW9ucyB7XG4gICAgICAgIC50aXRsZSB7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuXG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLnVzZXJzIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogMzBweDtcblxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgICAgIGZsZXgtd3JhcDogd3JhcDtcblxuICAgICAgICAgICAgLnByb2ZpbGUtbGluayB7XG4gICAgICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgICAgICAgICAgIHdpZHRoOiAzMCU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC51c2VyIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgICAgICAgICBtaW4td2lkdGg6IDIwMHB4O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiA1MHB4O1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDIwcHggMzBweDtcblxuICAgICAgICAgICAgICAgIGNvbG9yOiBAYmFzZTtcblxuICAgICAgICAgICAgICAgIC5hdmF0YXItYm94IHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDUycHg7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogNTJweDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAuaW5mbyB7XG4gICAgICAgICAgICAgICAgICAgIC5uYW1lIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLnByb2Zlc3Npb24ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxMHB4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC5kYXRlIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBAbGlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTBweDtcblxuICAgICAgICAgICAgICAgICAgICByaWdodDogMDtcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi5saWdodC10aGluLXNjcm9sbGJhciB7XG4gICAgJjo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgICAgICB3aWR0aDogNXB4OyAvKiDRiNC40YDQuNC90LAg0LTQu9GPINCy0LXRgNGC0LjQutCw0LvRjNC90L7Qs9C+INGB0LrRgNC+0LvQu9CwICovXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICAgIH1cblxuICAgIC8qINC/0L7Qu9C30YPQvdC+0Log0YHQutGA0L7Qu9C70LHQsNGA0LAgKi9cbiAgICAmOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0ZW4oQGxpZ2h0LCAzMCUpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xuICAgIH1cbn1cbiJdfQ== */"] });


/***/ }),

/***/ "wEiL":
/*!*********************************************!*\
  !*** ./src/app/store/posts/post.reducer.ts ***!
  \*********************************************/
/*! exports provided: postNode, postReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "postNode", function() { return postNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "postReducer", function() { return postReducer; });
/* harmony import */ var _post_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./post.actions */ "YBVe");

const postNode = 'post';
const initialState = {
    posts: [],
    error: '',
};
const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case _post_actions__WEBPACK_IMPORTED_MODULE_0__["POST_CREATE_SUCCESS_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { posts: [action.payload.post, ...state.posts] });
        case _post_actions__WEBPACK_IMPORTED_MODULE_0__["POST_CREATE_FAILED_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { error: action.payload.err });
        case _post_actions__WEBPACK_IMPORTED_MODULE_0__["POST_EDIT_SUCCESS_ACTION_TYPE"]:
            return Object.assign({}, state);
        case _post_actions__WEBPACK_IMPORTED_MODULE_0__["POST_EDIT_FAILED_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { error: action.payload.err });
        case _post_actions__WEBPACK_IMPORTED_MODULE_0__["POST_LIKE_SUCCESS_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { posts: state.posts.map(post => {
                    if (action.payload.postId === post.id) {
                        return Object.assign(Object.assign({}, post), { likes: [
                                ...post.likes,
                                { userId: action.payload.userId },
                            ] });
                    }
                    return post;
                }) });
        case _post_actions__WEBPACK_IMPORTED_MODULE_0__["POST_LIKE_FAILED_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { error: action.payload.err });
        case _post_actions__WEBPACK_IMPORTED_MODULE_0__["POST_DONT_LIKE_SUCCESS_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { posts: state.posts.map(post => {
                    if (action.payload.postId === post.id) {
                        return Object.assign(Object.assign({}, post), { likes: post.likes.filter(user => user.userId !== action.payload.userId) });
                    }
                    return post;
                }) });
        case _post_actions__WEBPACK_IMPORTED_MODULE_0__["POST_DONT_LIKE_FAILED_ACTION_TYPE"]:
            return Object.assign({}, state);
        case _post_actions__WEBPACK_IMPORTED_MODULE_0__["POST_GET_SUCCESS_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { posts: action.payload.posts });
        case _post_actions__WEBPACK_IMPORTED_MODULE_0__["POST_GET_FAILED_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { error: action.payload.err });
        case _post_actions__WEBPACK_IMPORTED_MODULE_0__["POST_COMMENTS_OPEN_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { posts: state.posts.map(post => {
                    if (post.id === action.payload.postId) {
                        return Object.assign(Object.assign({}, post), { commentsOpen: true });
                    }
                    return post;
                }) });
        case _post_actions__WEBPACK_IMPORTED_MODULE_0__["POST_COMMENTS_CLOSE_ACTION_TYPE"]:
            return Object.assign(Object.assign({}, state), { posts: state.posts.map(post => {
                    if (post.id === action.payload.postId) {
                        return Object.assign(Object.assign({}, post), { commentsOpen: false });
                    }
                    return post;
                }) });
        case _post_actions__WEBPACK_IMPORTED_MODULE_0__["COMMENT_CREATE_SUCCESS_ACTION_TYPE"]:
            const payload = action.payload;
            return Object.assign(Object.assign({}, state), { posts: state.posts.map(post => {
                    if (post.id === payload.postId)
                        return Object.assign(Object.assign({}, post), { comments: payload.comments });
                    return post;
                }) });
        case _post_actions__WEBPACK_IMPORTED_MODULE_0__["COMMENT_CREATE_FAILED_ACTION_TYPE"]:
        default:
            return state;
    }
};


/***/ }),

/***/ "wF9P":
/*!****************************************************!*\
  !*** ./src/app/views/profile/profile.component.ts ***!
  \****************************************************/
/*! exports provided: ProfileComponent, initialProfileState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileComponent", function() { return ProfileComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initialProfileState", function() { return initialProfileState; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _store_profile_profile_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../store/profile/profile.actions */ "Bx40");
/* harmony import */ var _store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../store/my-profile/my-profile.selectors */ "0jmn");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "tyNb");






function ProfileComponent_app_profile_side_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "app-profile-side");
} }
class ProfileComponent {
    constructor(activatedRoute, router, store$) {
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.store$ = store$;
        this.myProfileId$ = this.store$.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["select"])(_store_my_profile_my_profile_selectors__WEBPACK_IMPORTED_MODULE_2__["myProfileIdSelector"]));
        this.isMyProfile = false;
    }
    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            if (params.id) {
                this.myProfileId$.subscribe(id => {
                    console.log('id:', id, '\nparams id:', params.id);
                    this.isMyProfile = id === +params.id;
                });
                console.log('params id:', +params.id);
                this.store$.dispatch(new _store_profile_profile_actions__WEBPACK_IMPORTED_MODULE_1__["ProfileGetInfoAction"]({ id: +params.id }));
            }
            else {
                this.myProfileId$.subscribe(id => {
                    this.router.navigate([`/profile/${id}`]);
                });
            }
        });
    }
}
ProfileComponent.ɵfac = function ProfileComponent_Factory(t) { return new (t || ProfileComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["Store"])); };
ProfileComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: ProfileComponent, selectors: [["app-profile"]], decls: 4, vars: 2, consts: [[1, "profile"], [1, "profile__wrapper"], [3, "isMyProfile"], [4, "ngIf"]], template: function ProfileComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "app-profile-main", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](3, ProfileComponent_app_profile_side_3_Template, 1, 0, "app-profile-side", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("isMyProfile", ctx.isMyProfile);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.isMyProfile);
    } }, styles: [".profile[_ngcontent-%COMP%] {\n  margin: 0 auto;\n  max-width: 1440px;\n  font-family: 'Poppins', sans-serif;\n  color: #181818;\n}\n.profile__wrapper[_ngcontent-%COMP%] {\n  max-width: 1440px;\n  width: 100%;\n  display: flex;\n  flex-wrap: wrap;\n  margin: 0 90px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUuY29tcG9uZW50Lmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxjQUFBO0VBQ0EsaUJBQUE7RUFFQSxrQ0FBQTtFQUNBLGNBQUE7QUFGSjtBQUlJO0VBQ0ksaUJBQUE7RUFDQSxXQUFBO0VBRUEsYUFBQTtFQUNBLGVBQUE7RUFFQSxjQUFBO0FBSlIiLCJmaWxlIjoicHJvZmlsZS5jb21wb25lbnQubGVzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL3ZhcmlhYmxlcyc7XG5cbi5wcm9maWxlIHtcbiAgICBtYXJnaW46IDAgYXV0bztcbiAgICBtYXgtd2lkdGg6IDE0NDBweDtcblxuICAgIGZvbnQtZmFtaWx5OiBAZmY7XG4gICAgY29sb3I6IEBiYXNlO1xuXG4gICAgJl9fd3JhcHBlciB7XG4gICAgICAgIG1heC13aWR0aDogMTQ0MHB4O1xuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LXdyYXA6IHdyYXA7XG5cbiAgICAgICAgbWFyZ2luOiAwIDkwcHg7XG4gICAgfVxufVxuIl19 */"] });
const initialProfileState = {
    email: '',
    firstName: '',
    id: 0,
    info: {
        avatar: null,
        connections: [],
        dateOfBirth: 0,
        description: '',
        isOnline: false,
        posts: [],
        profession: '',
        profileHeaderBg: null,
        receivedConnections: [],
        sentConnections: [],
        views: { current: 0, prev: 0 },
    },
    lastName: '',
    password: '',
    phone: '',
};


/***/ }),

/***/ "wXBG":
/*!***********************************************!*\
  !*** ./src/app/store/posts/post.selectors.ts ***!
  \***********************************************/
/*! exports provided: postFeatureSelector, postsSelector, postsErrorSelector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "postFeatureSelector", function() { return postFeatureSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "postsSelector", function() { return postsSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "postsErrorSelector", function() { return postsErrorSelector; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "l7P3");
/* harmony import */ var _post_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./post.reducer */ "wEiL");


const postFeatureSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createFeatureSelector"])(_post_reducer__WEBPACK_IMPORTED_MODULE_1__["postNode"]);
const postsSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(postFeatureSelector, (state) => {
    return (state === null || state === void 0 ? void 0 : state.posts) || [];
});
const postsErrorSelector = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(postFeatureSelector, state => state.error);


/***/ }),

/***/ "wkCj":
/*!**********************************************************************!*\
  !*** ./src/app/views/network/network-side/network-side.component.ts ***!
  \**********************************************************************/
/*! exports provided: NetworkSideComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkSideComponent", function() { return NetworkSideComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../svg-icon/svg-icon.component */ "W/uP");



class NetworkSideComponent {
    constructor() {
        this.activateItem = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.activeMenuItem = '';
    }
    activateListItem(e, list) {
        var _a, _b;
        if (e.target === list)
            return;
        const element = e.target.closest('.menu__item');
        if (element) {
            const listItems = Array.from(list.children);
            listItems.forEach(el => el.classList.remove('active'));
            element.classList.add('active');
            this.activeMenuItem = (_b = (_a = element.querySelector('.title')) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : '';
            this.activateItem.emit(this.activeMenuItem.toLowerCase().trim());
        }
    }
    ngOnInit() { }
}
NetworkSideComponent.ɵfac = function NetworkSideComponent_Factory(t) { return new (t || NetworkSideComponent)(); };
NetworkSideComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: NetworkSideComponent, selectors: [["app-network-side"]], outputs: { activateItem: "activateItem" }, decls: 23, vars: 0, consts: [[1, "network-menu"], [1, "menu", 3, "click"], ["list", ""], [1, "menu__item"], [1, "title"], ["icon", "connections"], [1, "menu__item", "active"], ["icon", "invitations"], ["icon", "teammates"], ["icon", "network"], ["icon", "hash"]], template: function NetworkSideComponent_Template(rf, ctx) { if (rf & 1) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "ul", 1, 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function NetworkSideComponent_Template_ul_click_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](2); return ctx.activateListItem($event, _r0); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "li", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "svg", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, " Connections ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "li", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "svg", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, " Invitations ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "li", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "svg", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, " Teammates ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "li", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "svg", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, " Groups ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "li", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](21, "svg", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, " Hashtags ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_1__["SvgIconComponent"]], styles: [".user-select-none[_ngcontent-%COMP%] {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.network-menu[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%] {\n  list-style: none;\n  border: 1px dashed #cccccc;\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.network-menu[_ngcontent-%COMP%]   .menu__item[_ngcontent-%COMP%] {\n  width: 50px;\n  line-height: 50px;\n  padding: 0 30px;\n  display: flex;\n  justify-content: space-between;\n  cursor: pointer;\n}\n.network-menu[_ngcontent-%COMP%]   .menu__item[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  text-transform: uppercase;\n  display: flex;\n  align-items: center;\n}\n.network-menu[_ngcontent-%COMP%]   .menu__item[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  stroke: #181818;\n  stroke-width: 3px;\n  margin-right: 10px;\n}\n.network-menu[_ngcontent-%COMP%]   .menu__item.active[_ngcontent-%COMP%] {\n  border-left: 10px solid #0871a8;\n}\n.network-menu[_ngcontent-%COMP%]   .menu__item.active[_ngcontent-%COMP%]    > .title[_ngcontent-%COMP%] {\n  opacity: 0.6;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHN0eWxlc1xcbWl4aW5zXFx0ZXh0LW1peGlucy5sZXNzIiwibmV0d29yay1zaWRlLmNvbXBvbmVudC5sZXNzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksaUJBQUE7RUFDQSx5QkFBQTtFQUNBLHNCQUFBO0VBQ0EscUJBQUE7QUNDSjtBQUZBO0VBRVEsZ0JBQUE7RUFDQSwwQkFBQTtFRExKLGlCQUFBO0VBQ0EseUJBQUE7RUFDQSxzQkFBQTtFQUNBLHFCQUFBO0FDU0o7QUFKUTtFQUNJLFdBQUE7RUFDQSxpQkFBQTtFQUNBLGVBQUE7RUFFQSxhQUFBO0VBQ0EsOEJBQUE7RUFFQSxlQUFBO0FBSVo7QUFaUTtFQVdRLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHlCQUFBO0VBRUEsYUFBQTtFQUNBLG1CQUFBO0FBR2hCO0FBbkJRO0VBbUJZLFdBQUE7RUFDQSxZQUFBO0VBRUEsZUFBQTtFQUNBLGlCQUFBO0VBRUEsa0JBQUE7QUFDcEI7QUFHWTtFQUNJLCtCQUFBO0FBRGhCO0FBRWdCO0VBQ0ksWUFBQTtBQUFwQiIsImZpbGUiOiJuZXR3b3JrLXNpZGUuY29tcG9uZW50Lmxlc3MiLCJzb3VyY2VzQ29udGVudCI6WyIudXNlci1zZWxlY3Qtbm9uZSB7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcbn1cbiIsIkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL3ZhcmlhYmxlcyc7XG5AaW1wb3J0ICdzcmMvYXNzZXRzL3N0eWxlcy9taXhpbnMvdGV4dC1taXhpbnMnO1xuXG4ubmV0d29yay1tZW51IHtcbiAgICAubWVudSB7XG4gICAgICAgIGxpc3Qtc3R5bGU6IG5vbmU7XG4gICAgICAgIGJvcmRlcjogMXB4IGRhc2hlZCAjY2NjY2NjO1xuXG4gICAgICAgIC51c2VyLXNlbGVjdC1ub25lKCk7XG4gICAgICAgICZfX2l0ZW0ge1xuICAgICAgICAgICAgd2lkdGg6IDUwcHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogNTBweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDAgMzBweDtcblxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcblxuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuXG4gICAgICAgICAgICAudGl0bGUge1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG5cbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTZweDtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxNnB4O1xuXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZTogQGJhc2U7XG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZS13aWR0aDogM3B4O1xuXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICYuYWN0aXZlIHtcbiAgICAgICAgICAgICAgICBib3JkZXItbGVmdDogMTBweCBzb2xpZCBAYWN0aXZlO1xuICAgICAgICAgICAgICAgICYgPiAudGl0bGUge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjY7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIl19 */"] });


/***/ }),

/***/ "ws4F":
/*!****************************************************!*\
  !*** ./src/app/views/notices/notices.component.ts ***!
  \****************************************************/
/*! exports provided: NoticesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NoticesComponent", function() { return NoticesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class NoticesComponent {
    constructor() { }
    ngOnInit() { }
}
NoticesComponent.ɵfac = function NoticesComponent_Factory(t) { return new (t || NoticesComponent)(); };
NoticesComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: NoticesComponent, selectors: [["app-notices"]], decls: 2, vars: 0, template: function NoticesComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "notices works!");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJub3RpY2VzLmNvbXBvbmVudC5sZXNzIn0= */"] });


/***/ }),

/***/ "xs0x":
/*!*************************************************!*\
  !*** ./src/app/views/network/network.module.ts ***!
  \*************************************************/
/*! exports provided: NetworkModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkModule", function() { return NetworkModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _network_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./network.component */ "vRLT");
/* harmony import */ var _network_side_network_side_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./network-side/network-side.component */ "wkCj");
/* harmony import */ var _network_main_network_main_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./network-main/network-main.component */ "nMop");
/* harmony import */ var _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../svg-icon/svg-icon.module */ "uQlT");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_network_connections_list_connections_list_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/network/connections-list/connections-list.component */ "SS4A");
/* harmony import */ var _components_network_invitations_invitations_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/network/invitations/invitations.component */ "vuXr");
/* harmony import */ var _components_components_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../components/components.module */ "j1ZV");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ "fXoL");










class NetworkModule {
}
NetworkModule.ɵfac = function NetworkModule_Factory(t) { return new (t || NetworkModule)(); };
NetworkModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineNgModule"]({ type: NetworkModule });
NetworkModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineInjector"]({ imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_4__["SvgIconModule"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterModule"], _components_components_module__WEBPACK_IMPORTED_MODULE_8__["ComponentsModule"]]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsetNgModuleScope"](NetworkModule, { declarations: [_network_component__WEBPACK_IMPORTED_MODULE_1__["NetworkComponent"],
        _network_side_network_side_component__WEBPACK_IMPORTED_MODULE_2__["NetworkSideComponent"],
        _network_main_network_main_component__WEBPACK_IMPORTED_MODULE_3__["NetworkMainComponent"],
        _components_network_connections_list_connections_list_component__WEBPACK_IMPORTED_MODULE_6__["ConnectionsListComponent"],
        _components_network_invitations_invitations_component__WEBPACK_IMPORTED_MODULE_7__["InvitationsComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_4__["SvgIconModule"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterModule"], _components_components_module__WEBPACK_IMPORTED_MODULE_8__["ComponentsModule"]] }); })();


/***/ }),

/***/ "xzpJ":
/*!***************************************!*\
  !*** ./src/app/views/views.module.ts ***!
  \***************************************/
/*! exports provided: ViewsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewsModule", function() { return ViewsModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _chat_chat_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chat/chat.module */ "jykL");
/* harmony import */ var _feed_feed_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./feed/feed.module */ "TJUK");
/* harmony import */ var _jobs_jobs_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./jobs/jobs.module */ "DFxy");
/* harmony import */ var _network_network_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./network/network.module */ "xs0x");
/* harmony import */ var _notices_notices_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./notices/notices.module */ "t02T");
/* harmony import */ var _profile_profile_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./profile/profile.module */ "8r/t");
/* harmony import */ var _pipes_pipes_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../pipes/pipes.module */ "iTUp");
/* harmony import */ var _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../svg-icon/svg-icon.module */ "uQlT");
/* harmony import */ var _svg_icon_icons_path__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../svg-icon/icons-path */ "yoPs");
/* harmony import */ var _auth_auth_module__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./auth/auth.module */ "FU3J");
/* harmony import */ var _services_posts_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../services/posts.service */ "jwUf");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/core */ "fXoL");














class ViewsModule {
}
ViewsModule.ɵfac = function ViewsModule_Factory(t) { return new (t || ViewsModule)(); };
ViewsModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdefineNgModule"]({ type: ViewsModule });
ViewsModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdefineInjector"]({ providers: [
        {
            provide: _svg_icon_icons_path__WEBPACK_IMPORTED_MODULE_10__["ICONS_PATH"],
            useValue: 'assets/img/svg',
        },
        _services_posts_service__WEBPACK_IMPORTED_MODULE_12__["PostsService"],
    ], imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
            _chat_chat_module__WEBPACK_IMPORTED_MODULE_2__["ChatModule"],
            _feed_feed_module__WEBPACK_IMPORTED_MODULE_3__["FeedModule"],
            _jobs_jobs_module__WEBPACK_IMPORTED_MODULE_4__["JobsModule"],
            _network_network_module__WEBPACK_IMPORTED_MODULE_5__["NetworkModule"],
            _notices_notices_module__WEBPACK_IMPORTED_MODULE_6__["NoticesModule"],
            _profile_profile_module__WEBPACK_IMPORTED_MODULE_7__["ProfileModule"],
            _auth_auth_module__WEBPACK_IMPORTED_MODULE_11__["AuthModule"],
            _pipes_pipes_module__WEBPACK_IMPORTED_MODULE_8__["PipesModule"],
            _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_9__["SvgIconModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"],
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵsetNgModuleScope"](ViewsModule, { imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
        _chat_chat_module__WEBPACK_IMPORTED_MODULE_2__["ChatModule"],
        _feed_feed_module__WEBPACK_IMPORTED_MODULE_3__["FeedModule"],
        _jobs_jobs_module__WEBPACK_IMPORTED_MODULE_4__["JobsModule"],
        _network_network_module__WEBPACK_IMPORTED_MODULE_5__["NetworkModule"],
        _notices_notices_module__WEBPACK_IMPORTED_MODULE_6__["NoticesModule"],
        _profile_profile_module__WEBPACK_IMPORTED_MODULE_7__["ProfileModule"],
        _auth_auth_module__WEBPACK_IMPORTED_MODULE_11__["AuthModule"],
        _pipes_pipes_module__WEBPACK_IMPORTED_MODULE_8__["PipesModule"],
        _svg_icon_svg_icon_module__WEBPACK_IMPORTED_MODULE_9__["SvgIconModule"],
        _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();


/***/ }),

/***/ "yoGk":
/*!*******************************************************!*\
  !*** ./src/app/components/select/select.component.ts ***!
  \*******************************************************/
/*! exports provided: SelectComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectComponent", function() { return SelectComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../svg-icon/svg-icon.component */ "W/uP");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "ofXK");




function SelectComponent_div_6_Template(rf, ctx) { if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SelectComponent_div_6_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r5); const option_r3 = ctx.$implicit; const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](1); return ctx_r4.changeSelected(option_r3, _r0); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const option_r3 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("disabled", ctx_r1.selected ? option_r3 === ctx_r1.selected : option_r3 === ctx_r1.selectedByDefault);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](option_r3);
} }
function SelectComponent_div_7_Template(rf, ctx) { if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SelectComponent_div_7_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r7); const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](1); return ctx_r6.closeOptions(_r0); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
class SelectComponent {
    constructor() {
        this.options = [];
        this.selectedByDefault = '';
        this.error = false;
        this.onChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.selected = '';
    }
    toggleOptions(el) {
        el.classList.toggle('show');
    }
    closeOptions(el) {
        el.classList.remove('show');
    }
    changeSelected(option, select) {
        this.closeOptions(select);
        if (this.selected === option)
            return;
        this.selected = option;
        this.onChange.emit(option);
    }
    ngOnInit() {
        this.onChange.emit(this.selectedByDefault);
    }
    ngOnChanges(changes) {
        if (changes.hasOwnProperty('selectedByDefault'))
            this.onChange.emit(changes.selectedByDefault.currentValue);
    }
}
SelectComponent.ɵfac = function SelectComponent_Factory(t) { return new (t || SelectComponent)(); };
SelectComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: SelectComponent, selectors: [["app-select"]], inputs: { options: "options", selectedByDefault: "selectedByDefault", error: "error" }, outputs: { onChange: "onChange" }, features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"]], decls: 8, vars: 5, consts: [[1, "select"], ["select", ""], [1, "selected", 3, "click"], ["icon", "chevronDown"], [1, "options"], ["class", "option", 3, "disabled", "click", 4, "ngFor", "ngForOf"], ["class", "select-bg", 3, "click", 4, "ngIf"], [1, "option", 3, "click"], [1, "select-bg", 3, "click"]], template: function SelectComponent_Template(rf, ctx) { if (rf & 1) {
        const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SelectComponent_Template_div_click_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r8); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](1); return ctx.toggleOptions(_r0); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "svg", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, SelectComponent_div_6_Template, 2, 3, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, SelectComponent_div_7_Template, 1, 0, "div", 6);
    } if (rf & 2) {
        const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("error", ctx.error);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.selected || ctx.selectedByDefault, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.options);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _r0.classList.contains("show"));
    } }, directives: [_svg_icon_svg_icon_component__WEBPACK_IMPORTED_MODULE_1__["SvgIconComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgForOf"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"]], styles: [".user-select-none[_ngcontent-%COMP%] {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.select[_ngcontent-%COMP%] {\n  width: 100%;\n  height: auto;\n  position: relative;\n  border-radius: 8px;\n  background-color: #fff;\n  cursor: pointer;\n  z-index: 10;\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.select[_ngcontent-%COMP%]   .selected[_ngcontent-%COMP%] {\n  height: 40px;\n  line-height: 22px;\n  font-size: 16px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 9px;\n  border: 1px solid #ccc;\n  border-radius: 8px;\n  transition: border-color 0.5s;\n}\n.select[_ngcontent-%COMP%]   .selected[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  stroke: #747474;\n}\n.select[_ngcontent-%COMP%]   .options[_ngcontent-%COMP%] {\n  width: 100%;\n  position: absolute;\n  display: none;\n  transition: border-color 0.5s;\n  border: 1px solid #ccc;\n  border-top: none;\n  border-bottom-right-radius: 8px;\n  border-bottom-left-radius: 8px;\n  background-color: #fff;\n}\n.select[_ngcontent-%COMP%]   .options[_ngcontent-%COMP%]   .option[_ngcontent-%COMP%] {\n  height: 40px;\n  padding: 8px 10px;\n}\n.select[_ngcontent-%COMP%]   .options[_ngcontent-%COMP%]   .option[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid #0a92d9;\n}\n.select[_ngcontent-%COMP%]   .options[_ngcontent-%COMP%]   .option[_ngcontent-%COMP%]:hover {\n  background-color: rgba(8, 113, 168, 0.2);\n}\n.select[_ngcontent-%COMP%]   .options[_ngcontent-%COMP%]   .option.disabled[_ngcontent-%COMP%] {\n  color: #747474;\n  cursor: auto;\n}\n.select[_ngcontent-%COMP%]   .options[_ngcontent-%COMP%]   .option.disabled[_ngcontent-%COMP%]:hover {\n  background-color: white;\n}\n.select.show[_ngcontent-%COMP%]   .selected[_ngcontent-%COMP%] {\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.select.show[_ngcontent-%COMP%]   .options[_ngcontent-%COMP%] {\n  display: block;\n  top: 40px;\n}\n.select.show[_ngcontent-%COMP%]   .selected[_ngcontent-%COMP%], .select[_ngcontent-%COMP%]:hover   .selected[_ngcontent-%COMP%], .select.show[_ngcontent-%COMP%]   .options[_ngcontent-%COMP%], .select[_ngcontent-%COMP%]:hover   .options[_ngcontent-%COMP%] {\n  border-color: #0a92d9;\n}\n.select.show[_ngcontent-%COMP%]   .selected[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%], .select[_ngcontent-%COMP%]:hover   .selected[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  stroke: #0871a8;\n}\n.select.error[_ngcontent-%COMP%]   .selected[_ngcontent-%COMP%] {\n  border-color: #de0e0e;\n}\n.select.error[_ngcontent-%COMP%]   .selected[_ngcontent-%COMP%]:hover {\n  border-color: #de0e0e;\n}\n.select.error[_ngcontent-%COMP%]   .options[_ngcontent-%COMP%] {\n  border-color: #de0e0e;\n}\n.select.error[_ngcontent-%COMP%]   .options[_ngcontent-%COMP%]:hover {\n  border-color: #de0e0e;\n}\n.select.error[_ngcontent-%COMP%]   .options[_ngcontent-%COMP%]   .option[_ngcontent-%COMP%] {\n  border-color: #de0e0e;\n}\n.select-bg[_ngcontent-%COMP%] {\n  position: fixed;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  z-index: 5;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXGFzc2V0c1xcc3R5bGVzXFxtaXhpbnNcXHRleHQtbWl4aW5zLmxlc3MiLCJzZWxlY3QuY29tcG9uZW50Lmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxpQkFBQTtFQUNBLHlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxxQkFBQTtBQ0NKO0FBRkE7RUFDSSxXQUFBO0VBQ0EsWUFBQTtFQUVBLGtCQUFBO0VBQ0Esa0JBQUE7RUFFQSxzQkFBQTtFQUNBLGVBQUE7RUFDQSxXQUFBO0VEWEEsaUJBQUE7RUFDQSx5QkFBQTtFQUNBLHNCQUFBO0VBQ0EscUJBQUE7QUNjSjtBQWZBO0VBYVEsWUFBQTtFQUNBLGlCQUFBO0VBQ0EsZUFBQTtFQUVBLGFBQUE7RUFDQSw4QkFBQTtFQUNBLG1CQUFBO0VBRUEsWUFBQTtFQUVBLHNCQUFBO0VBQ0Esa0JBQUE7RUFFQSw2QkFBQTtBQUNSO0FBM0JBO0VBNkJZLFdBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtBQUNaO0FBaENBO0VBb0NRLFdBQUE7RUFFQSxrQkFBQTtFQUNBLGFBQUE7RUFFQSw2QkFBQTtFQUVBLHNCQUFBO0VBQ0EsZ0JBQUE7RUFFQSwrQkFBQTtFQUNBLDhCQUFBO0VBRUEsc0JBQUE7QUFOUjtBQTNDQTtFQW9EWSxZQUFBO0VBQ0EsaUJBQUE7QUFOWjtBQVFZO0VBQ0ksZ0NBQUE7QUFOaEI7QUFTWTtFQUNJLHdDQUFBO0FBUGhCO0FBVVk7RUFDSSxjQUFBO0VBQ0EsWUFBQTtBQVJoQjtBQVVnQjtFQUNJLHVCQUFBO0FBUnBCO0FBY0k7RUFFUSw0QkFBQTtFQUNBLDZCQUFBO0FBYlo7QUFVSTtFQU9RLGNBQUE7RUFDQSxTQUFBO0FBZFo7QUFrQkk7Ozs7RUFJUSxxQkFBQTtBQWhCWjtBQVlJOztFQVFZLGVBQUE7QUFoQmhCO0FBcUJJO0VBRVEscUJBQUE7QUFwQlo7QUFzQlk7RUFDSSxxQkFBQTtBQXBCaEI7QUFlSTtFQVVRLHFCQUFBO0FBdEJaO0FBd0JZO0VBQ0kscUJBQUE7QUF0QmhCO0FBU0k7RUFpQlkscUJBQUE7QUF2QmhCO0FBNkJBO0VBQ0ksZUFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0VBQ0EsTUFBQTtFQUNBLFNBQUE7RUFDQSxVQUFBO0FBM0JKIiwiZmlsZSI6InNlbGVjdC5jb21wb25lbnQubGVzcyIsInNvdXJjZXNDb250ZW50IjpbIi51c2VyLXNlbGVjdC1ub25lIHtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xufVxuIiwiQGltcG9ydCAnc3JjL2Fzc2V0cy9zdHlsZXMvdmFyaWFibGVzJztcbkBpbXBvcnQgJ3NyYy9hc3NldHMvc3R5bGVzL21peGlucy90ZXh0LW1peGlucyc7XG5cbi5zZWxlY3Qge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogYXV0bztcblxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG5cbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB6LWluZGV4OiAxMDtcbiAgICAudXNlci1zZWxlY3Qtbm9uZSgpO1xuXG4gICAgLnNlbGVjdGVkIHtcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICBsaW5lLWhlaWdodDogMjJweDtcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICBwYWRkaW5nOiA5cHg7XG5cbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuXG4gICAgICAgIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjVzO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICB3aWR0aDogMjRweDtcbiAgICAgICAgICAgIGhlaWdodDogMjRweDtcbiAgICAgICAgICAgIHN0cm9rZTogQGxpZ2h0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLm9wdGlvbnMge1xuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG5cbiAgICAgICAgdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIDAuNXM7XG5cbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcbiAgICAgICAgYm9yZGVyLXRvcDogbm9uZTtcblxuICAgICAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogOHB4O1xuICAgICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiA4cHg7XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcblxuICAgICAgICAub3B0aW9uIHtcbiAgICAgICAgICAgIGhlaWdodDogNDBweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDhweCAxMHB4O1xuXG4gICAgICAgICAgICAmOm5vdCg6bGFzdC1jaGlsZCkge1xuICAgICAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCBsaWdodGVuKEBhY3RpdmUsIDEwJSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoQGFjdGl2ZSwgMC4yKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJi5kaXNhYmxlZCB7XG4gICAgICAgICAgICAgICAgY29sb3I6IEBsaWdodDtcbiAgICAgICAgICAgICAgICBjdXJzb3I6IGF1dG87XG5cbiAgICAgICAgICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi5zaG93IHtcbiAgICAgICAgLnNlbGVjdGVkIHtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5vcHRpb25zIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgICAgdG9wOiA0MHB4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi5zaG93LFxuICAgICY6aG92ZXIge1xuICAgICAgICAuc2VsZWN0ZWQsXG4gICAgICAgIC5vcHRpb25zIHtcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogbGlnaHRlbihAYWN0aXZlLCAxMCUpO1xuICAgICAgICB9XG4gICAgICAgIC5zZWxlY3RlZCB7XG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIHN0cm9rZTogQGFjdGl2ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYuZXJyb3Ige1xuICAgICAgICAuc2VsZWN0ZWQge1xuICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiBAZGFuZ2VyO1xuXG4gICAgICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgICAgICBib3JkZXItY29sb3I6IEBkYW5nZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAub3B0aW9ucyB7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6IEBkYW5nZXI7XG5cbiAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICAgIGJvcmRlci1jb2xvcjogQGRhbmdlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLm9wdGlvbiB7XG4gICAgICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiBAZGFuZ2VyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4uc2VsZWN0LWJnIHtcbiAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgbGVmdDogMDtcbiAgICByaWdodDogMDtcbiAgICB0b3A6IDA7XG4gICAgYm90dG9tOiAwO1xuICAgIHotaW5kZXg6IDU7XG59XG4iXX0= */"] });


/***/ }),

/***/ "yoPs":
/*!****************************************!*\
  !*** ./src/app/svg-icon/icons-path.ts ***!
  \****************************************/
/*! exports provided: ICONS_PATH */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ICONS_PATH", function() { return ICONS_PATH; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

const ICONS_PATH = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["InjectionToken"]('Pass to the icons folder');


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "AytR");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]()
    .bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map