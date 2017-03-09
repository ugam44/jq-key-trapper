// https://github.com/ugam44/jq-key-trapper/
// Created by Mike Hodges

jQuery.fn.extend({
    keyTrapper: function(options, optional1, optional2) {
        var $ = jQuery;
        optional1 = optional1 || undefined;
        optional2 = optional2 || undefined;
        options = options || {};

        whiteList = {
            "shift": 16,
            "ctrl": 17,
            "alt": 18,
            "capsLock": 20,
            "pageUp": 33,
            "pageDown": 34,
            "end": 35,
            "home": 36,
            "leftArrow": 37,
            "rightArrow": 39,
            "leftWindows": 91,
            "rightWindows": 92,
            "f1": 112,
            "f2": 113,
            "f3": 114,
            "f4": 115,
            "f5": 116,
            "f6": 117,
            "f7": 118,
            "f8": 119,
            "f9": 120,
            "f10": 121,
            "f11": 122,
            "f12": 123,
            "numLock": 144,
        };

        function getActionButton() {
            var submitButton = options.actionButton || undefined;
            if (!submitButton) {
                submitButton = this.find(".kt-action-button");
                if (!submitButton.length) {
                    submitButton = this.find(".button, .btn");
                    if (!submitButton.length) {
                        submitButton = this.find("input[type=submit]");
                        if (!submitButton.length) {
                            submitButton = $(this.find("input[type=button]")[0]);
                            if (!submitButton.length) {
                                submitButton = $(this.find("button")[0]);
                                if (!submitButton.length) {
                                    submitButton = undefined;
                                }
                            }
                        }
                    }
                }
            }
            return submitButton;
        }
        // default options
        function setDefaults() {
            var control = this;
            var defaults = {
                escape: [27],
                next: [13],
                previous: [],
                container: $(control),
                selector: "input:not(:disabled):not([type=button]):not([type=submit]):not([type=reset]):not(.kt-ignore), select:not(:disabled):not(.kt-ignore)",
                init: function() {
                    this.actionButton = getActionButton.call(this.container);
                    this.formInputs = this.container.find(this.selector);
                    return this;
                },
                trapKeys: [],
                ignoreKeys: Object.keys(whiteList).map(function(key) {
                    return whiteList[key];
                }),
                onNext: function(trigger) {
                    var currIndex = -1;
                    this.formInputs.each(function(index, elem) {
                        if (elem === trigger) {
                            currIndex = index;
                            return false;
                        }
                    });
                    currIndex++;
                    if (currIndex === this.formInputs.length) {
                        this.onLastInput(trigger);

                    } else {
                        $(this.formInputs[currIndex]).focus().select();
                    }
                },
                onPrev: function(trigger) {
                    var currIndex = -1;
                    this.formInputs.each(function(index, elem) {
                        if (elem === trigger) {
                            currIndex = index;
                            return false;
                        }
                    });
                    currIndex--;
                    if (currIndex >= 0) {
                        $(this.formInputs[currIndex]).focus().select();
                    }
                },
                onNonWhiteList: function(trigger) {
                    // no default action  
                },
                onTrapKey: function(event, prevValue) {
                    event.preventDefault();
                    alert("That key is not allowed!");
                    $(event.target).val(value);
                },
                onEscape: function(trigger) {
                    $(trigger).blur();
                },
                onLastInput: function() {
                    try {
                        if (this.actionButton != undefined) {
                            this.onActionButton();
                        } else {
                            throw Error("actionButton is not defined!");
                        }
                    } catch (e) {
                        console.error(e.name + ': ' + e.message);
                    }
                },
                onActionButton: function() {
                    this.actionButton.trigger("click");
                }
            }.init();
            $.extend(true, defaults, options);
            return defaults;
        }
        if (typeof(options) === "string") {
            if (options === "options") {
                if (typeof(optional1) === 'undefined' && typeof(optional2) === 'undefined') {
                    // $("selector").keyTrapper("options"); 
                    // get all options for all matched elements
                    if (this.length > 1) {
                        return this.map(function () {
                            return this.opts;
                        });
                    }
                    else {
                        // if only one item, do not wrap in outer array so we don't have to access
                        // with [0][0].foo()
                        return this[0].opts;
                    }
                } else if (typeof(optional1) === 'object') {
                    // $("selector").keyTrapper("options", {"optionName1": "setNewValue1", "optionName2": "setNewValue2"}); 
                    // set multiple options for all matched elements
                    this.each(function() {
                        var opts = this.opts;
                        Object.keys(optional1).forEach(function(key, index) {
                            opts[key] = optional1[key];
                        });
                    });
                    return this;
                } else {
                    console.error("Invalid value: '" + optional1 + "' for param2 in .keyTrapper([string || object]param1, [string || object]param2, [string]param3)");
                    return this;
                }
            } else if (options === 'option') {
                if (typeof(optional1) === 'string') {
                    if (typeof(optional2) === 'undefined') {
                        // $("selector").keyTrapper("option", "optionName"); 
                        // get the single option value for all matched elements 
                        if (this.length > 1) {
                            // jQuery .map auto-flattens array of arrays, so if we have multiple items
                            // in the this context, we have to wrap each item in an outer array that will get
                            // flattened by $.map, so we can preserve the original array of arrays
                            return this.map(function () {
                                return [this.opts[optional1]];
                            });
                        }
                        else {
                            // if only one item, do not wrap in outer array so we don't have to access
                            // with [0][0].foo()
                            return this[0].opts[optional1];
                        }
                    } else {
                        // $("selector").keyTrapper("option", "optionName", "setNewValue"); 
                        // set single option value for all matched elements
                        this.each(function() {
                            this.opts[optional1] = optional2;
                        });
                        return this;
                    }
                } else {
                    console.error("Invalid value: '" + optional1 + "' for param2 in .keyTrapper([string || object]param1, [string || object]param2, [string]param3)");
                    return this;
                }

            } else {
                console.error("Invalid value: '" + options + "' for param1 in .keyTrapper([string || object]param1, [string || object]param2, [string]param3)");
                return this;
            }
        } else if (typeof(options) === "object") {
            function checkKeyCodeWithModifiers (keyCode, modifiers, valuesArr) {
                var activeModifiersCount = Object.keys(modifiers).filter(function (key){
                    return modifiers[key] === true;
                }).length;
                return valuesArr.some(function (elem) {
                    if (elem === keyCode && activeModifiersCount === 0) {
                        return true;
                    }
                    else if (elem instanceof Array) {
                        // ensure only the exact modifiers specified are active. i.e. ["shift", 13]
                        // should not return true if modifiers.shift and modifiers.ctrl are true.
                        // compare against length - 1 because one element should be a valid keycode
                        if (activeModifiersCount === (elem.length - 1)) {
                            var exactMatch = elem.every(function (_elem) {
                                return _elem === keyCode || modifiers[_elem] === true;
                            });
                            return exactMatch;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                });
            }
            this.each(function() {
                var opts = this.opts = setDefaults.call(this);
                var currValue = "";
                $(this).on("keydown.kt", opts.selector, function(event) {
                    var keyCode = event.keyCode;
                    if (opts.trapKeys.indexOf(keyCode) > -1) {
                        // must prevent default in onTrapKey function to prevent key from being registered
                        opts.init();
                        opts.onTrapKey(event, currValue);
                    } else if (opts.next.indexOf(keyCode) > -1) {
                        event.preventDefault();
                    } else if (opts.previous.indexOf(keyCode) > -1) {
                        event.preventDefault();
                    } else if (opts.escape.indexOf(keyCode) > -1) {
                        event.preventDefault();
                    }
                });
                $(this).on("keyup.kt", opts.selector, function(event) {
                    var keyCode = event.keyCode;
                    var modifiers = {
                        shift: event.shiftKey,
                        ctrl: event.ctrlKey,
                        alt: event.altKey
                    };
                    var isTrapKey = checkKeyCodeWithModifiers(keyCode, modifiers, opts.trapKeys);
                    var isNextKey = checkKeyCodeWithModifiers(keyCode, modifiers, opts.next);
                    var isPreviousKey = checkKeyCodeWithModifiers(keyCode, modifiers, opts.previous);
                    var isEscapeKey = checkKeyCodeWithModifiers(keyCode, modifiers, opts.escape);
                    if (isTrapKey) {
                        event.preventDefault();
                    } else if (isNextKey) {
                        event.preventDefault();
                        opts.init();
                        opts.onNext(event.target);
                    } else if (isPreviousKey) {
                        event.preventDefault();
                        opts.init();
                        opts.onPrev(event.target);
                    } else if (isEscapeKey) {
                        event.preventDefault();
                        opts.init();
                        opts.onEscape(event.target);
                    }
                    else if (opts.custom) {
                        for(var name in opts.custom) {
                            if (checkKeyCodeWithModifiers(keyCode, modifiers, opts.custom[name].keys)) {
                                event.preventDefault();
                                opts.custom[name].handler(event.target, opts);
                            }
                        }
                    }
                    currValue = $(event.target).val();
                });
            });

            // return the original list of elements so you can chain off of .keyTrapper()
            return this;
        } else {
            console.error("Invalid value: '" + options + "' for param1 in .keyTrapper([string || object]param1, [string || object]param2, [string]param3)");
            return this;
        }
    }
});
