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
            var submitButton = options.actionButton || null;
            if (!submitButton) {
                submitButton = this.find(".kt-action-button");
                if (!submitButton.length) {
                    submitButton = this.find(".button");
                    if (!submitButton.length) {
                        submitButton = this.find("input[type=submit]");
                        if (!submitButton.length) {
                            submitButton = $(this.find("input[type=button]")[0]);
                            if (!submitButton.length) {
                                submitButton = $(this.find("button")[0]);
                                if (!submitButton.length) {
                                    submitButton = null;
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
                enter: [13],
                container: $(control),
                init: function() {
                    this.actionButton = getActionButton.call(this.container);
                    this.formInputs = this.container.find("input:not(:disabled):not([type=button]):not([type=submit]):not([type=reset]):not(.kt-ignore), select");
                    return this;
                },
                trapKeys: [],
                ignoreKeys: Object.keys(whiteList).map(function(key) {
                    return whiteList[key];
                }),
                onEnter: function(trigger) {
                    var currIndex = -1;
                    this.formInputs.each(function(index, elem) {
                        if (elem === trigger) {
                            currIndex = index;
                            return false;
                        }
                    });
                    currIndex++;
                    if (currIndex === this.formInputs.length) {
                        this.onLastInput();

                    } else {
                        $(this.formInputs[currIndex]).focus();
                    }
                },
                onNonWhiteList: function(trigger) {
                    // no default action  
                },
                onTrapKey: function(trigger, value) {
                    alert("That key is not allowed!");
                    $(trigger).val(value);
                },
                onEscape: function(trigger) {
                    $(trigger).blur();
                },
                onLastInput: function() {
                    try {
                        if (this.actionButton !== null && this.actionButton !== undefined) {
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
            var optionsToUse = Object.keys(defaults).forEach(function(key) {
                defaults[key] = options[key] || defaults[key];
            });
            return defaults;
        }
        if (typeof(options) === "string") {
            if (options === "options") {
                if (typeof(optional1) === 'undefined' && typeof(optional2) === 'undefined') {
                    // $("selector").keyTrapper("options"); 
                    // get all options for all matched elements
                    return this.map(function() {
                        return this.opts;
                    });
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
                        return this.map(function() {
                            return [this.opts[optional1]];
                        });
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
            this.each(function() {
                var opts = this.opts = setDefaults.call(this);
                var currValue = "";

                $(this).on("keydown.kt", opts.formInputs.selector, function(event) {

                    var keyCode = event.keyCode;
                    if (opts.trapKeys.indexOf(keyCode) > -1) {
                        event.preventDefault();
                        opts.init();
                        opts.onTrapKey(event.target, currValue);
                    } else if (opts.enter.indexOf(keyCode) > -1) {
                        event.preventDefault();
                    } else if (opts.escape.indexOf(keyCode) > -1) {
                        event.preventDefault();
                    }
                });
                $(this).on("keyup.kt", opts.formInputs.selector, function(event) {
                    var keyCode = event.keyCode;
                    if (opts.trapKeys.indexOf(keyCode) > -1) {
                        event.preventDefault();
                    } else if (opts.enter.indexOf(keyCode) > -1) {
                        event.preventDefault();
                        opts.init();
                        opts.onEnter(event.target);
                    } else if (opts.escape.indexOf(keyCode) > -1) {
                        event.preventDefault();
                        opts.init();
                        opts.onEscape(event.target);
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
