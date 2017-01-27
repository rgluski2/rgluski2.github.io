/*
// ../../html5-embed/src/js/utils/eaUtils.js
*/

"use strict";

var eaUtils = {
    domUniqueId: 0,
    eventPrefix: "",
    eventsFallbackAlias: {mouseenter: "mouseover", mouseleave: "mouseout"},
    cssStyle: {},
    cssStyleArray: [],
    rawCssStyle: "",
    cssPropsAlias: {
        "fontFamily": "font-family",
        "fontWeight": "font-weight",
        "fontStyle": "font-style",
        "fontSize": "font-size",
        "lineHeight": "line-height"
    },
    extractRGB: function(color) {
        if (!color)return;
        color = color.toLowerCase();
        var arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
        var obj = {r: "", g: "", b: ""};

        obj.r = parseInt((16 * arr.indexOf(color[1]) + arr.indexOf(color[2])).toString());
        obj.g = parseInt((16 * arr.indexOf(color[3]) + arr.indexOf(color[4])).toString());
        obj.b = parseInt((16 * arr.indexOf(color[5]) + arr.indexOf(color[6])).toString());
        return obj;
    },

    detectHTML5: function() {
        return Detect['transformOrigin'];
    },
    extractRGBA: function(rgba) {
        var color = rgba.replace(/[^\d,.]/g, '').split(',');
        return {r: color[0], g: color[1], b: color[2], a: color[3]};
    },
    rgba2hex: function(col, alpha) {
        return "#" + (alpha != false ? (256 + parseInt(Number(col.a) * 256)).toString(16).substr(1) : "") + (256 + parseInt(col.r)).toString(16).substr(1) + (256 + parseInt(col.g)).toString(16).substr(1) + (256 + parseInt(col.b)).toString(16).substr(1);
    },
    getIEVersion: function() {
        if (eaUtils.IEVersion != undefined)return eaUtils.IEVersion;
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        eaUtils.IEVersion = rv;
        return rv;
    },
    detectIE: function() {
        var rv = eaUtils.getIEVersion();
        return rv != -1;
    },
    _is_safari: null,
    isSafari: function() {
        if (this._is_safari === null) {
            this._is_safari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        }
        return this._is_safari;
    },
    isMobile: {
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
            return (eaUtils.isMobile.Android() || eaUtils.isMobile.BlackBerry() || eaUtils.isMobile.iOS() || eaUtils.isMobile.Opera() || eaUtils.isMobile.Windows());
        }
    },
    getBrowser: function() {
        var nAgt = navigator.userAgent;
        var browserName = navigator.appName;
        var fullVersion = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        // In Opera 15+, the true version is after "OPR/"
        if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
            browserName = "Opera";
            fullVersion = nAgt.substring(verOffset + 4);
        }
        else if ((verOffset = nAgt.indexOf("Opera Mini")) != -1) {
            browserName = "Opera Mini";
            fullVersion = nAgt.substring(verOffset + 11);
        }
        // In older Opera, the true version is after "Opera" or after "Version"
        else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
            browserName = "Opera";
            fullVersion = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        // In Edge, the true version is after "Edge" in userAgent
        else if ((verOffset = nAgt.indexOf("Edge")) != -1) {
            browserName = "Edge";
            fullVersion = nAgt.substring(verOffset + 5);
        }
        // In MSIE, the true version is after "MSIE" in userAgent
        else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
            browserName = "MSIE";
            fullVersion = nAgt.substring(verOffset + 5);
        }
        else if (/x64|x32/ig.test(nAgt)) {
            browserName = "MSIE";
            fullVersion = "12.0";
        }
        // In Chrome, the true version is after "Chrome"
        else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
            browserName = "Chrome";
            fullVersion = nAgt.substring(verOffset + 7);
        }
        // In Safari, the true version is after "Safari" or after "Version"
        else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
            browserName = "Safari";
            fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        // In Firefox, the true version is after "Firefox"
        else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
            browserName = "Firefox";
            fullVersion = nAgt.substring(verOffset + 8);
        }
        // In most other browsers, "name/version" is at the end of userAgent
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
            (verOffset = nAgt.lastIndexOf('/'))) {
            browserName = nAgt.substring(nameOffset, verOffset);
            fullVersion = nAgt.substring(verOffset + 1);
            if (browserName.toLowerCase() == browserName.toUpperCase()) {
                browserName = navigator.appName;
            }
        }

        if (browserName === 'Netscape' && fullVersion == 5 && !(window.ActiveXObject) && "ActiveXObject") {
            browserName = "MSIE";
            fullVersion = "11.0";
        }
        // trim the fullVersion string at semicolon/space if present
        if ((ix = fullVersion.indexOf(";")) != -1)
            fullVersion = fullVersion.substring(0, ix);
        if ((ix = fullVersion.indexOf(" ")) != -1)
            fullVersion = fullVersion.substring(0, ix);

        majorVersion = parseInt('' + fullVersion, 10);
        if (isNaN(majorVersion)) {
            fullVersion = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }
        if (isNaN(majorVersion)) {
            majorVersion = 0;
        }

        if (!/Chrome|Firefox|MSIE|Edge|Safari|Opera|Opera Mini/.test(browserName)) {
            browserName = 'Other';
            majorVersion = 0;
        }
        return [browserName, majorVersion];
    },
    getOS: function() {
        var os,
            nAgt = navigator.userAgent;
        var clientStrings = [
            {s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/},
            {s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/},
            {s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/},
            {s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/},
            {s: 'Windows Vista', r: /Windows NT 6.0/},
            {s: 'Windows Server 2003', r: /Windows NT 5.2/},
            {s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/},
            {s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/},
            {s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/},
            {s: 'Windows 98', r: /(Windows 98|Win98)/},
            {s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/},
            {s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s: 'Windows CE', r: /Windows CE/},
            {s: 'Windows 3.11', r: /Win16/},
            {s: 'Windows Phone', r: /Windows Phone|iemobile|WPDesktop/},
            {s: 'Chrome OS', r: /\bCrOS\b/},
            {s: 'Android', r: /Android/},
            {s: 'Open BSD', r: /OpenBSD/},
            {s: 'Sun OS', r: /SunOS/},
            {s: 'Linux', r: /(Linux|X11)/},
            {s: 'iOS', r: /(iPhone|iPad|iPod)/},
            {s: 'Mac OS X', r: /Mac OS X/},
            {s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s: 'QNX', r: /QNX/},
            {s: 'UNIX', r: /UNIX/},
            {s: 'BeOS', r: /BeOS/},
            {s: 'OS/2', r: /OS\/2/},
            {s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        if (/Windows/.test(os) && !/Windows Phone/.test(os)) {
            os = 'Windows';
        }
        if (/Mac OS/.test(os)) {
            os = 'Macintosh';
        }
        if (!/Windows|Windows Phone|Macintosh|Linux|Android|iOS|Chrome OS/.test(os)) {
            os = 'Other';
        }

        return os;
    },
    getScreenSize: function() {
        var devicePixelRatio = window.devicePixelRatio || 1;
        var width = (window.screen.width) ? window.screen.width : 0;
        var height = (window.screen.height) ? window.screen.height : 0;
        if (eaUtils.isAndroidStockBrowser()) {
            width = width / devicePixelRatio;
            width = Math.round(width);
            height = height / devicePixelRatio;
            height = Math.round(height);
        }
        return width + 'x' + height;
    },
    isAndroidStockBrowser: function() {
        // valabil pt versiunile de android panala 4.3 inclusiv
        // "Firefox", "Chrome", "Opera", "UCBrowser", "ACHEETAH", "MxBrowser"
        // probleme: stock browser, CM Browser ("acheetah"), Maxton browser, Lightning-Browser (probabil bazat pe stock),
        // Dolphin (probabil bazat pe stock), UCBrowser
        // fara probleme: chrome, opera nou (bazat pe chrome), firefox si internet explorer 8
        var str, isFirefox = false, isChrome = false,
            isAndroid = eaUtils.getOS() == 'Android';
        if (isAndroid) {
            str = navigator.userAgent.match(/firefox/i);
            isFirefox = str && str.length > 0;
            str = navigator.userAgent.match(/chrome/i);
            isChrome = str && str.length > 0;
            return !isFirefox && !isChrome;
        }
        return false;
    },
    isTablet: function() {
        var result = navigator.userAgent.match(/(ipad|android|windows phone|silk|blackberry|iemobile)/i),
            screenSize = eaUtils.getScreenSize().split('x');

        return result && result.length > 0 && (screenSize[0] >= 960 || screenSize[1] >= 960) ? true : false;
    },
    getDevice: function() {
        if (eaUtils.isTablet()) {
            return 'tablet';
        }
        if (eaUtils.isMobile.any()) {
            return 'mobile';
        }
        return 'desktop';
    },
    generateLighterColor: function(color, amount) {
        if (!color)return;
        if (amount == undefined) amount = 26;
        var rgb = eaUtils.extractRGB(color);

        rgb.r = Math.min(255, parseInt(rgb.r) + amount);
        rgb.g = Math.min(255, parseInt(rgb.g) + amount);
        rgb.b = Math.min(255, parseInt(rgb.b) + amount);

        return '#' + eaUtils.fixed2(rgb.r.toString(16)) + eaUtils.fixed2(rgb.g.toString(16)) + eaUtils.fixed2(rgb.b.toString(16));
    },

    fixed2: function(str) {
        if (str.length < 2) return '0' + str;
        return str;
    },

    getTransparentImageURL: function() {
        return 'data:image/gif;base64,R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
    },
    getElementStyle: function(elem, attr) {
        var style;
        if (elem.currentStyle) {
            style = elem.currentStyle[attr];
        } else if (window.getComputedStyle) {
            style = window.getComputedStyle(elem, null).getPropertyValue(attr);
        }
        return style;
    },
    addCSSById: function(css, id) {
        var styleid = "eautils-css";
        var headID = document.getElementsByTagName('head')[0];
        var cssNode = document.getElementById(styleid);

        if (cssNode == undefined || cssNode == null) {
            cssNode = document.createElement('style');
            cssNode.type = 'text/css';
            cssNode.id = styleid;
            headID.appendChild(cssNode);
        }

        var cssData;

        if (eaUtils.cssStyle[id] != undefined) {
            eaUtils.rawCssStyle = "";
            eaUtils.cssStyle[id].css = css;

            for (var i = 0; i < eaUtils.cssStyleArray.length; i++) {
                cssData = eaUtils.cssStyleArray[i];
                eaUtils.rawCssStyle += cssData.css;
            }
        } else {
            eaUtils.rawCssStyle += css;
            cssData = {};
            cssData.css = css;
            eaUtils.cssStyle[id] = cssData;
            eaUtils.cssStyleArray.push(cssData);
        }

        if (cssNode.styleSheet) {
            cssNode.styleSheet.cssText = eaUtils.rawCssStyle;
        } else {
            cssNode.innerHTML = eaUtils.rawCssStyle;
        }
    },
    backwardBackgroundTile: function(background) {
        if (background && background.type && background.type == 'image' && background.tile) {
            background['scaleMode'] = 'tile';
            background['contentScale'] = 100;
            background['contentOffsetX'] = 50;
            background['contentOffsetY'] = 50;
            delete background['tile'];
        }
        return background;
    },
    toggleBackroundClasses: function(el, scaleMode) {
        if (!el || !scaleMode) {
            this.addClass(el, 'background');
            return false;
        }
        var bgClasses = ['background', 'background-crop', 'background-stretch', 'background-mask', 'background-aspect', 'background-tile'];
        var scaleModeClass = bgClasses[0] + '-' + scaleMode.toLowerCase();
        for (var cls in bgClasses) {
            this.removeClass(el, bgClasses[cls]);
        }
        this.addClass(el, bgClasses[0]);
        this.addClass(el, scaleModeClass);
    },
    hasClass: function(el, cls) {
        return el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },
    addClass: function(el, cls) {
        if (!this.hasClass(el, cls)) {
            el.className += " " + cls;
        }
    },
    removeClass: function(el, cls) {
        if (this.hasClass(el, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    },
    getTextShadowCss: function(shadow) {
        if (!shadow) {
            return null;
        }

        var css = {"text-shadow": ''};
        if (shadow.useShadow == true || shadow.useShadow == "true") {
            css["textShadow"] = shadow.hShadow + "px " + shadow.vShadow + "px " + shadow.blur + "px " + shadow.color;
            css["text-shadow"] = shadow.hShadow + "px " + shadow.vShadow + "px " + shadow.blur + "px " + shadow.color;
            css["-moz-text-shadow"] = shadow.hShadow + "px " + shadow.vShadow + "px " + shadow.blur + "px " + shadow.color;
            css["-o-text-shadow"] = shadow.hShadow + "px " + shadow.vShadow + "px " + shadow.blur + "px " + shadow.color;
            css["-ms-text-shadow"] = shadow.hShadow + "px " + shadow.vShadow + "px " + shadow.blur + "px " + shadow.color;
        }

        return css;
    },
    getBoxShadowCss: function(shadow) {
        if (!shadow) {
            return null;
        }
        var css = {"-webkit-box-shadow": '', "box-shadow": ''};
        if (shadow.useShadow == true || shadow.useShadow == "true") {
            css["-webkit-box-shadow"] = css["boxShadow"] = shadow.hShadow + "px " + shadow.vShadow + "px " + shadow.blur + "px " + shadow.spread + "px " + shadow.color;
        }
        return css;
    },
    getDropShadowCss: function(shadow) {
        "use strict";
        var css = {"-webkit-filter": '', "filter": ''};
        if (shadow.useShadow == true || shadow.useShadow == "true") {
            css["-webkit-filter"] = css["filter"] = 'drop-shadow(' + shadow.hShadow + "px " + shadow.vShadow + "px " + shadow.blur + "px " + shadow.color + ')';
        }
        return css;
    },
    getFiltersCss: function(adjustColor, blur, dropShadow) {
        "use strict";
        var css = {"-webkit-filter": '', "filter": ''};
        if (adjustColor && (adjustColor.useAdjustColor == true || adjustColor.useAdjustColor == "true")) {
            css["filter"] += 'brightness(' + ( (parseInt(adjustColor.brightness) + 100) / 100 ) + ') ';
            css["filter"] += 'contrast(' + ( (parseInt(adjustColor.contrast) + 100) / 100 ) + ') ';
            css["filter"] += 'saturate(' + ( (parseInt(adjustColor.saturate) + 100) / 100 ) + ') ';
            css["filter"] += 'hue-rotate(' + adjustColor.hue + 'deg)';
        }
        if (blur && (blur.useBlur == true || blur.useBlur == "true")) {
            css["filter"] += 'blur(' + blur.pixels + 'px)';
        }
        if (dropShadow && (dropShadow.useShadow == true || dropShadow.useShadow == "true")) {
            css["filter"] += 'drop-shadow(' + dropShadow.hShadow + 'px ' + dropShadow.vShadow + 'px ' + dropShadow.blur + 'px ' + dropShadow.color + ')';
        }
        css["-webkit-filter"] = css["filter"];
        return css;
    },
    convertCssProps: function(cssData) {

        var newCssData = {};
        for (var prop in cssData) {
            newCssData[eaUtils.cssPropsAlias[prop] || prop] = cssData[prop];
        }
        return newCssData;
    },
    fixCSSProp: function(style, prop, suffix) {

        if (style == undefined)return;
        if (prop == undefined)prop = "fontSize";
        if (suffix == undefined)suffix = "px";
        style[prop] = parseInt(style[prop]) + suffix;
        return style;
    },
    getCssAsClass: function(cssData, classId) {
        var css = "." + classId + "{";
        for (var property in cssData) {
            var propValue = cssData[property];
            if (propValue instanceof Array) {
                for (var p = 0, len = propValue.length; p < len; p++) {
                    css += property + ":" + propValue[p] + ";";
                }
            } else css += property + ":" + propValue + ";";
        }
        css += "}";
        return css;
    },
    getBackgroundCss: function(background) {

        var css = {};
        if (!background) {
            return css;
        }

        var type = background.type;

        var scolor = background.scolor;
        if (type == "lgrad" || type == "rgrad") {
            if (!background.gradColors || !background.gradColors.length) {
                type = "solid";
                scolor = "#fff";
            } else if (background.gradColors.length < 2) {
                if (background.gradColors.length > 0) {
                    scolor = background.gradColors[0].c;
                    type = "solid";
                }
            }
        }
        if (String(background.useBorder) == "true") {
            css["border"] = "1px solid " + background.borderColor;
        }
        css["background-image"] = "";
        switch (type) {
            case "none":
                break;
            case "image":
                background = this.backwardBackgroundTile(background);
                css = this.getImageBackgroundCSS(css, background);
                break;
            case "solid":
                if (scolor && scolor.indexOf("rgba") != -1) {
                    var ieVersion = eaUtils.getIEVersion();
                    if (ieVersion > -1 && ieVersion < 9) {
                        scolor = eaUtils.rgba2hex(eaUtils.extractRGBA(scolor), false);
                    }
                }
                css["background-color"] = scolor;

                break;
            case "rgrad":
            case "lgrad":
                var colors = background.gradColors;
                var gradColorsCssArr = [];
                for (var i = 0; i < colors.length; i++)
                    gradColorsCssArr.push(colors[i].c + " " + colors[i].p + "%");

                var cssColors = gradColorsCssArr.join();
                var gradType = "linear";
                var gradAngle = (background.rotation || "0") + "deg";

                if (background.type == "rgrad") {
                    gradType = "radial";
                    var gradPos = background.rgradPos || "center";
                    if (gradPos == "custom") {
                        var xpx = "";
                        if (!background.gradPosX || background.gradPosX.indexOf("%") == -1)
                            xpx = "px";
                        var ypx = "";
                        if (!background.gradPosY || background.gradPosY.indexOf("%") == -1)
                            ypx = "px";
                        gradPos = (background.gradPosX || "0") + xpx + " " + (background.gradPosY || "0") + ypx;
                    }
                    gradAngle = gradPos + ", circle cover";
                } else if (background.backgroundRotation)
                    gradAngle = background.backgroundRotation + "deg";

                if (colors && colors.length > 0) {
                    var background = css["background"] = [];
                    background.push(colors[0].c);
                    background.push("-moz-" + gradType + "-gradient(" + gradAngle + ",  " + cssColors + ")");
                    background.push("-webkit-" + gradType + "-gradient(" + gradAngle + ",  " + cssColors + ")");
                    background.push("-o-" + gradType + "-gradient(" + gradAngle + ",  " + cssColors + ")");
                    background.push("-ms-" + gradType + "-gradient(" + gradAngle + ",  " + cssColors + ")");
                }
                css.filter = "progid:DXImageTransform.Microsoft.gradient( startColorstr='" + colors[0].c + "', endColorstr='" + colors[colors.length - 1].c + "',GradientType=0 )";
                break;
        }
        return css;
    },
    getImagePathFromBackground: function(background) {
        if (background.localUrl) {
            return 'images/' + background.localUrl;
        } else {
            if(background.url && background.url.indexOf("//") !== -1) {
                return background.url;
            } else {
                return bannerConfig.photosUrl + background.url;
            }
        }
    },
    applyImageSizeOnBackground: function(el, background) {
        var imgOriginalWidth = 0,
            applySizeOnBkg = false,
            imgPath = this.getImagePathFromBackground(background);

        for (var attr in background) {
            switch (attr) {
                case "scaleMode":
                case "verticalAlign":
                case "horizontalAlign":
                    applySizeOnBkg = true;
                    break;
                case "contentScale":
                    applySizeOnBkg = true;
                    break;
            }
        }
        if (applySizeOnBkg) {
            var img = new Image();
            if (background.scaleMode == 'tile') {
                el.style.visibility = 'hidden';
            }
            img.onload = function(e) {
                if (imgOriginalWidth != img.width) {
                    imgOriginalWidth = img.width;
                }
                el.style.backgroundSize = "";
                if (background.scaleMode == 'tile') {
                    el.style.backgroundSize = (background.contentScale * imgOriginalWidth / 100) + 'px';
                    el.style.visibility = 'visible';
                }
            };
            img.src = imgPath;
        }
    },
    getImageBackgroundCSS: function(css, background) {
        var va, ha;
        var imgPath = this.getImagePathFromBackground(background);

        css["background-image"] = "url(" + imgPath + ")";
        for (var attr in background) {
            switch (attr) {
                case "scaleMode":
                case "verticalAlign":
                case "horizontalAlign":
                    switch (background.verticalAlign) {
                        case 'top':
                            va = '0';
                            break;
                        case 'middle':
                            va = '50%';
                            break;
                        case 'bottom':
                            va = '100%';
                            break;
                    }
                    switch (background.horizontalAlign) {
                        case 'left':
                            ha = '0';
                            break;
                        case 'center':
                            ha = '50%';
                            break;
                        case 'right':
                            ha = '100%';
                            break;
                    }
                    css["background-position"] = ha + ' ' + va;
                    break;
                case "contentOffsetX":
                    if (background.scaleMode === 'tile') {
                        css["background-position-x"] = background[attr] + "%";
                    }
                    break;
                case "contentOffsetY":
                    if (background.scaleMode === 'tile') {
                        css["background-position-y"] = background[attr] + "%";
                    }
                    break;
            }
        }
        return css;
    },
    getBorderCss: function(border) {

        var css = {};
        if (border) {
            if (border.useBorder == true || border.useBorder == "true") {
                css.border = "1px solid " + border.borderColor;
            }
        }
        return css;

    },
    applyCss: function(container, cssObj) {

        for (var i in cssObj) {
            container.style[i] = cssObj[i];
        }
    },
    isURLValid: function(url) {
        if (url.indexOf(' ') >= 0 || url.indexOf('.') == -1) return false;
        return true;
    },
    getAppValidURL: function(url) {

        if (eaUtils.isURLValid(url))return url;

        return EAdConfig.baseDomain;
    },
    getElementUniqueId: function() {
        return "e_" + (eaUtils.domUniqueId++);
    },
    getImagePath: function(basePath, hash, size) {

        if (!basePath)return "";
        return basePath.replace("{hash}", hash).replace("{wxh}", size);
    },
    getUniqueId: function() {
        var rnd = Math.random() + new Date().getTime();
        return rnd.toString(36).replace(".", "");
    },
    preloadImage: function(src, callback) {
        var tempImage = new Image();
        tempImage.onerror = tempImage.onload = function() {
            if (callback)
                callback();
        };
        tempImage.src = src;
    },
    isTouchDevice: function() {
        try {
            document.createEvent("TouchEvent");
            return ("ontouchstart" in document.documentElement);
        } catch (e) {
            return false;
        }
    },
    getSharePageURL: function(noversion) {
        var version = (noversion == true) ? "" : "&v=" + (12345 + Math.random() * 1000 >> 0);
        var url = URLPaths.sharePageUrlFormat.replace("{domain}", EAdConfig.shareSubdomain).replace("{hash}", EAdConfig.creativeHash);
        return this.getAppValidURL(url + version);
    },
    cloneObject: function(object) {
        return JSON.parse(JSON.stringify(object));
    },
    getClickTagValue: function() {
        var query = window.location.search.substring(1);
        var isPresent = query.split('clickTag=');
        if (!isPresent[1])
            return false;
        var clickTagValue = isPresent[1].replace(/&.+$/, '');
        return decodeURIComponent(clickTagValue);
    },
    getProtocol: function() {
        return (location.protocol != 'http:' && location.protocol != 'https:') ? 'https:' : '';
    },
    addProtocolToUrl: function(url) {
        return (url.indexOf('://') == -1) ? 'http://' + url : url;
    },
    getProportion: function(realWidth, realHeight) {
        var width = window.innerWidth;
        var height = window.innerHeight;

        var proportionWidth = width / realWidth;
        var proportionHeight = height / realHeight;

        return {
            proportion: Math.min(proportionWidth, proportionHeight)
        };
    }
};

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement /*, fromIndex */) {

        if (this === void 0 || this === null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) return -1;

        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n !== n) n = 0;
            else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }

        if (n >= len) return -1;

        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);

        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) return k;
        }
        return -1;
    };
}

var Detect = (function() {
    var
        props = "transformOrigin,textShadow,textStroke,boxShadow,borderRadius,borderImage,opacity".split(","),
        CSSprefix = "Webkit,Moz,O,ms,Khtml".split(","),
        d = document.createElement("detect"),
        test = [],
        p, pty;
    // test prefixed code
    function TestPrefixes(prop) {
        if (typeof prop != "string") return false;

        var Uprop = prop.substr(0, 1).toUpperCase() + prop.substr(1),
            All = (prop + ' ' + CSSprefix.join(Uprop + ' ') + Uprop).split(' ');
        for (var n = 0, np = All.length; n < np; n++) {
            if (d.style[All[n]] === "") return true;
        }
        return false;
    }

    for (p in props) {
        pty = props[p];
        test[pty] = TestPrefixes(pty);
    }
    return test;
}());



/*
// ../../html5-embed/src/js/utils/eff.js
*/

/**
 * Created by Laviniu on 14.12.2015.
 */

var effGenerator = {

    styles: {},
    nextIndex: 0,
    _generatedEffects: {},
    generate: function(element, options, isIn /* buildIn sau buildOut */) {

        var effId = this.getEffId(options, isIn);
        if (this.styles[effId]) {
            return effId;
        }

        var keyframe = '';

        var fName = 'ease';

        switch (options.ease) {
            default:
                fName += 'Out';
                break;
            case 'easeIn':
                fName += 'In';
                break;
            case 'easeInOut':
                fName += 'InOut';
                break;
        }
        fName += options.tween;

        if (!this[fName]) {
            return false;
        }

        for (var i = 0; i <= 100; i += 4) {
            keyframe += this.getKeyframe(options, i, this[fName](0, i, 0, 100, 100), isIn);
            keyframe += "\n";
        }

        var style = document.createElement("style");

        style.type = 'text/css';


        var cssKeyframe;
        cssKeyframe = "@-webkit-keyframes " + effId + "{\n" + keyframe + "\n}";
        cssKeyframe += "\n@keyframes " + effId + "{\n" + keyframe + "\n}";

        this.styles[effId] = true;

        if (style.styleSheet) {
            style.styleSheet.cssText = cssKeyframe;
        } else {
            style.innerHTML = cssKeyframe;
        }

        var headID = document.getElementsByTagName('head')[0];
        headID.appendChild(style);

        return effId;

    },
    getEffId: function(options, isIn) {
        var effName = 'eff_bs_' + (isIn ? 'in' : 'out');
        var fields = ['type', 'ease', 'tween'];

        switch (options.type) {
            case 'blur':
            case 'blur-words':
                fields.push('blurAmount');
                break;
            case 'scale':
                fields.push('direction');
                break;
            case 'slide':
                fields.push('alphaOffset', 'direction');
                if (options.direction == 'custom') {
                    fields.push('slidePosX', 'slidePosY');
                } else {
                    fields.push('slideOffset');
                }
                break;
        }

        for (var i = 0; i < fields.length; i++) {
            effName += '_' + options[fields[i]];
        }

        return effName;

    },
    getKeyframe: function(options, progress, value, isIn) {
        var out = progress + '% {';

        var val;
        var opacityVal;

        switch (options.type) {
            case 'scale':
                var scaleX = 1;
                var scaleY = 1;
                val = isIn ? value / 100 : 1 - value / 100;
                switch (options.direction) {
                    case "l2r" :
                    case "r2l" :
                        scaleX = val;
                        break;
                    case "t2b" :
                    case "b2t" :
                        scaleY = val;
                        break;
                    case "center" :
                        scaleX = val;
                        scaleY = val;
                        break;
                }

                out += 'transform: scaleX(' + scaleX + ') scaleY(' + scaleY + ')';

                break;
            case 'slide':

                var translateX = 0;
                var translateY = 0;

                val = (100 - value) / 100;

                var slideOffset = parseInt(options.slideOffset);

                switch (options.direction) {
                    case "custom" :
                        translateX = parseInt(options.slidePosX * val);
                        translateY = parseInt(options.slidePosY * val);
                        if (!isIn) {
                            translateX = parseInt(options.slidePosX) - translateX;
                            translateY = parseInt(options.slidePosY) - translateY;
                        }
                        break;
                    case "l2r" :
                        translateX = -(slideOffset * val);
                        if (!isIn) {
                            translateX = translateX + slideOffset;
                        }
                        break;
                    case "r2l" :
                        translateX = slideOffset * val;
                        if (!isIn) {
                            translateX = translateX - slideOffset;
                        }
                        break;
                    case "t2b" :
                        translateY = -(slideOffset * val);
                        if (!isIn) {
                            translateY = translateY + slideOffset;
                        }
                        break;
                    case "b2t" :
                        translateY = slideOffset * val;
                        if (!isIn) {
                            translateY = translateY - slideOffset;
                        }
                        break;
                }

                var startAlpha = parseInt(options.alphaOffset) / 100;

                var crtAlpha = startAlpha + ((1 - startAlpha) * (value / 100));
                if (!isIn) {
                    crtAlpha = 1 - crtAlpha + startAlpha;
                }

                out += 'transform: translate(' + translateX + 'px, ' + translateY + 'px);' + "\n";
                out += 'opacity: ' + crtAlpha;

                break;
            case 'blur':
            case 'blur-words':

                var blur = options.blurAmount * (value / 100);
                if (isIn) {
                    blur = options.blurAmount - blur;
                }

                var filterVal = "blur(" + blur + "px)";

                out += 'filter: ' + filterVal + '; ' + "\n";
                out += '-webkit-filter: ' + filterVal + '; ' + "\n";

                // 30% din efect se face opacity
                if (isIn) {
                    opacityVal = (progress * 3.33) / 100;
                } else {
                    opacityVal = ((100 - progress) * 3.33) / 100;
                }

                if (opacityVal > 1) {
                    opacityVal = 1;
                }
                out += 'opacity: ' + opacityVal;


                break;
            case 'alpha':
            case 'alpha-words':
                opacityVal = (value / 100);

                if (!isIn) {
                    opacityVal = 1 - opacityVal;
                }

                out += 'opacity: ' + opacityVal;
                break;
        }

        out += '}';
        return out;
    },

    easeInElastic: function(x, t, b, c, d) {

        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },

    easeInOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeOutBounce: function(x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    },
    easeInBounce: function(x, t, b, c, d) {
        return c - this.easeOutBounce(x, d - t, 0, c, d) + b;
    },
    easeInOutBounce: function(x, t, b, c, d) {
        if (t < d / 2) return this.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return this.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    },
    easeInStrong: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutStrong: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutStrong: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    }

};

var eff = {

    ceaser: {
        // defaults
        'linear': 'linear',
        'ease': 'ease',
        'easeIn': 'ease-in',
        'easeOut': 'ease-out',
        'easeInOut': 'ease-in-out',
        // Penner equations
        'easeInCubic': 'cubic-bezier(.55,.055,.675,.19)',
        'easeOutCubic': 'cubic-bezier(.215,.61,.355,1)',
        'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
        'easeInCirc': 'cubic-bezier(.6,.04,.98,.335)',
        'easeOutCirc': 'cubic-bezier(.075,.82,.165,1)',
        'easeInOutCirc': 'cubic-bezier(.785,.135,.15,.86)',
        'easeInExpo': 'cubic-bezier(.95,.05,.795,.035)',
        'easeOutExpo': 'cubic-bezier(.19,1,.22,1)',
        'easeInOutExpo': 'cubic-bezier(1,0,0,1)',
        'easeInQuad': 'cubic-bezier(.55,.085,.68,.53)',
        'easeOutQuad': 'cubic-bezier(.25,.46,.45,.94)',
        'easeInOutQuad': 'cubic-bezier(.455,.03,.515,.955)',
        'easeInQuart': 'cubic-bezier(.895,.03,.685,.22)',
        'easeOutQuart': 'cubic-bezier(.165,.84,.44,1)',
        'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
        'easeInQuint': 'cubic-bezier(.755,.05,.855,.06)',
        'easeOutQuint': 'cubic-bezier(.23,1,.32,1)',
        'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
        'easeInSine': 'cubic-bezier(.47,0,.745,.715)',
        'easeOutSine': 'cubic-bezier(.39,.575,.565,1)',
        'easeInOutSine': 'cubic-bezier(.445,.05,.55,.95)',
        'easeInStrong': 'cubic-bezier(.97,.09,.79,.21)',
        'easeOutStrong': 'cubic-bezier(.21,.79,.09,.97)',
        'easeInOutStrong': 'cubic-bezier(.78,.03,.24,.99)',
        'easeInBack': 'cubic-bezier(.6,-.28,.735,.045)',
        'easeOutBack': 'cubic-bezier(.175, .885,.32,1.275)',
        'easeInOutBack': 'cubic-bezier(.68,-.55,.265,1.55)'
    },

    timeouts: {},

    _blur: function(element, options, localOptions, type) {

        var self = this;

        var isIn = type === 'in';

        var setFilter = function(filterVal) {
            element.style['filter'] = filterVal;
            element.style['-webkit-filter'] = filterVal;
        };
        var opacityDuration = Math.round(options.duration * 3.3) / 10;
        var opacityDelay = isIn ? 0 : options.duration - opacityDuration;

        this.setTransition(element, "");
        this.setAnimation(element, "");
        element.style.opacity = isIn ? 0 : 1;
        setFilter(isIn ? "blur(" + options.blurAmount + "px)" : "blur(0px)");

        this.timeouts[localOptions.delayId] = setTimeout(function() {

            element.offsetHeight; // Trigger a reflow, flushing the CSS changes

            if (options.tween === 'Elastic' || options.tween === 'Bounce') {

                self.setKeyframeEffect(element, options, localOptions, isIn, options.effName || null);

            } else {

                var timingFunction = self.getTimingFunction(options);
                var transition = "filter " + options.duration + "s " + timingFunction + " 0s, " +
                    "-webkit-filter " + options.duration + "s " + timingFunction + " 0s, " +
                    "opacity " + opacityDuration + "s linear " + opacityDelay + "s";

                self.setTransition(element, transition);

            }

            element.style.opacity = !isIn ? 0 : 1;
            setFilter(!isIn ? "blur(" + options.blurAmount + "px)" : "blur(0px)");

            self.timeouts[localOptions.delayId] = setTimeout(function() {
                setFilter("");
                self.onAnimationEnd(element, localOptions);
            }, options.duration * 1000);

        }, (Number(options.delay) + localOptions.extraDelay) * 1000);

    },
    blurIn: function(element, options, localOptions) {
        this._blur(element, options, localOptions, 'in');
    },
    blurOut: function(element, options, localOptions) {
        this._blur(element, options, localOptions, 'out');
    },
    _alpha: function(element, options, localOptions, type) {

        var self = this;

        var isIn = type === 'in';

        this.setTransition(element, "");
        this.setAnimation(element, "");
        element.style.opacity = isIn ? 0 : 1;

        this.timeouts[localOptions.delayId] = setTimeout(function() {

            element.offsetHeight; // Trigger a reflow, flushing the CSS changes

            if (options.tween === 'Elastic' || options.tween === 'Bounce') {

                self.setKeyframeEffect(element, options, localOptions, isIn);

            } else {

                var timingFunction = self.getTimingFunction(options);
                var transition = "opacity " + Number(options.duration) + "s " + timingFunction;
                self.setTransition(element, transition);

            }

            element.style.opacity = !isIn ? 0 : 1;

            self.timeouts[localOptions.delayId] = setTimeout(function() {
                if (!options.isWordAnimation) {
                    element.style.opacity = 1;
                }
                self.onAnimationEnd(element, localOptions);
            }, options.duration * 1000);

        }, (Number(options.delay) + localOptions.extraDelay) * 1000);

    },
    alphaIn: function(element, options, localOptions) {
        this._alpha(element, options, localOptions, 'in');
    },
    alphaOut: function(element, options, localOptions) {
        this._alpha(element, options, localOptions, 'out');
    },
    setTransition: function(element, transition) {
        element.style['transition'] = transition;
        element.style['-webkit-transition'] = transition;
    },
    setAnimation: function(element, animation) {
        element.style['animation'] = animation;
        element.style['-webkit-animation'] = animation;
    },
    _scale: function(element, options, localOptions, type) {

        var isIn = type === 'in';

        var startScaleX = 1;
        var startScaleY = 1;
        var transformOrigin = "top left";

        switch (options.direction) {
            case "l2r" :
                startScaleX = 0;
                transformOrigin = isIn ? "left center" : "right center";
                break;
            case "r2l" :
                startScaleX = 0;
                transformOrigin = isIn ? "right center" : "left center";
                break;
            case "t2b" :
                startScaleY = 0;
                transformOrigin = isIn ? "center top" : "center bottom";
                break;
            case "b2t" :
                startScaleY = 0;
                transformOrigin = isIn ? "center bottom" : "center top";
                break;
            case "center" :
                startScaleX = 0;
                startScaleY = 0;
                transformOrigin = "center center";
                break;
        }

        function getScaleTransform(start) {
            if (start && isIn || !start && !isIn) {
                return 'scaleX(' + startScaleX + ') scaleY(' + startScaleY + ')';
            } else {
                return 'scaleX(1) scaleY(1)';
            }
        }

        this.setTransition(element, "");
        this.setAnimation(element, "");
        element.style.transformOrigin = transformOrigin;
        element.style.transform = getScaleTransform(true);

        var self = this;

        this.timeouts[localOptions.delayId] = setTimeout(function() {

            element.offsetHeight; // Trigger a reflow, flushing the CSS changes

            if (options.tween === 'Elastic' || options.tween === 'Bounce') {

                self.setKeyframeEffect(element, options, localOptions, isIn);

            } else {

                var timingFunction = self.getTimingFunction(options);
                var transition = "transform " + Number(options.duration) + "s " + timingFunction;
                self.setTransition(element, transition);

            }

            element.style.transform = getScaleTransform(false);

            self.timeouts[localOptions.delayId] = setTimeout(function() {
                self.onAnimationEnd(element, localOptions);
            }, options.duration * 1000);

        }, (Number(options.delay) + localOptions.extraDelay) * 1000);

    },
    scaleIn: function(element, options, localOptions) {
        this._scale(element, options, localOptions, "in");
    },
    scaleOut: function(element, options, localOptions) {
        this._scale(element, options, localOptions, "out");
    },
    breakWords: function(container) {

        if (!container.getElementsByTagName("span").length) {
            var text = container.innerHTML;
            var newText = '<span>';
            var addTag = false;
            var endTag = false;
            for (var i = 0; i < text.length; i++) {
                if (text[i] === ' ' || text[i] === "\n") {
                    if (endTag) {
                        newText += '</span>';
                    }
                    addTag = true;
                    endTag = false;
                } else {
                    if (addTag) {
                        newText += '<span>';
                    }
                    addTag = false;
                    endTag = true;
                }
                newText += text[i];
            }
            newText += '</span>';
            container.innerHTML = newText;
        }
    },
    effectWords: function(element, options, localOptions, effName, isIn) {

        clearTimeout(this.timeouts[localOptions.delayId]);
        var self = this;

        if (isIn) {
            // il ascundem pana incepe efectul, poate are delay
            element.style.opacity = 0;
        }

        this.timeouts[localOptions.delayId] = setTimeout(function() {

            if (options.onAnimationStart) {
                options.onAnimationStart();
            }

            if (isIn) {
                element.style.opacity = 1;
            }

            var container = element.getElementsByClassName("text-content")[0];
            if (!container) {
                return;
            }
            self.breakWords(container);

            var words = container.getElementsByTagName("span");

            var wordTimeAppend = (options.duration - options.wordsDuration) / (words.length - 1 || 1);
            var wordsAppearOrder = options.wordsAppearOrder || "random";


            var i = 0;
            var desiredIndex = 0;

            words = [].slice.call(words);

            var effGeneratorName;
            if (options.tween === 'Elastic' || options.tween === 'Bounce') {
                effGeneratorName = effGenerator.generate(element, options, isIn);
            }

            while (words.length) {

                var wordElement, wordOptions, wordLocalOptions;

                if (wordsAppearOrder === 'r2l') {
                    wordElement = words.pop();
                } else if (wordsAppearOrder === 'l2r') {
                    wordElement = words.shift();
                } else {
                    desiredIndex = Math.floor(Math.random() * words.length);
                    wordElement = words.splice(desiredIndex, 1)[0];
                }

                wordOptions = {
                    tween: options.tween,
                    type: effName,
                    ease: options.ease,
                    duration: options.wordsDuration,
                    blurAmount: options.blurAmount,
                    isWordAnimation: true,
                    effName: effGeneratorName,
                    delay: (i * wordTimeAppend)
                };

                wordLocalOptions = {delayId: localOptions.delayId + '_' + i, extraDelay: 0, isWordAnimation: true};

                clearTimeout(self.timeouts[wordLocalOptions.delayId]);

                var effFuncName = effName + (isIn ? "In" : "Out");
                self[effFuncName](wordElement, wordOptions, wordLocalOptions);

                i++;
            }

            var duration = Math.max(Number(options.duration), Number(options.wordsDuration));

            self.timeouts[localOptions.delayId] = setTimeout(function() {
                self.onAnimationEnd(element, localOptions);
            }, duration * 1000);

        }, (Number(options.delay) + localOptions.extraDelay) * 1000);

    },
    setKeyframeEffect: function(element, options, localOptions, isIn, effName) {
        if (!effName) {
            effName = effGenerator.generate(element, options, isIn);
            localOptions.effName = effName;
        }
        var animation = Number(options.duration) + "s linear 0s " + effName;
        this.setAnimation(element, animation);
    },
    alphaWordsIn: function(element, options, localOptions) {
        this.effectWords(element, options, localOptions, "alpha", true);
    },
    alphaWordsOut: function(element, options, localOptions) {
        this.effectWords(element, options, localOptions, "alpha", false);
    },
    blurWordsIn: function(element, options, localOptions) {
        this.effectWords(element, options, localOptions, "blur", true);
    },
    blurWordsOut: function(element, options, localOptions) {
        this.effectWords(element, options, localOptions, "blur", false);
    },
    _slide: function(element, options, localOptions, type) {

        var isIn = type === 'in';
        var self = this;

        var startAlpha = parseInt(options.alphaOffset) / 100;
        var translateX = 0;
        var translateY = 0;

        function getTranslate(start) {
            if (start && isIn || !start && !isIn) {
                return 'translate(' + translateX + 'px, ' + translateY + 'px)';
            } else {
                return 'translate(0,0)';
            }
        }

        switch (options.direction) {
            case "custom" :
                translateX = parseInt(options.slidePosX);
                translateY = parseInt(options.slidePosY);
                break;
            case "l2r" :
                translateX = -parseInt(options.slideOffset);
                break;
            case "r2l" :
                translateX = parseInt(options.slideOffset);
                break;
            case "t2b" :
                translateY = -parseInt(options.slideOffset);
                break;
            case "b2t" :
                translateY = parseInt(options.slideOffset);
                break;
        }
        if (!isIn && options.direction != 'custom') {
            translateX *= -1;
            translateY *= -1;
        }

        this.setTransition(element, "");
        this.setAnimation(element, "");

        element.style.opacity = isIn ? startAlpha : 1;
        element.style.transform = getTranslate(true);

        this.timeouts[localOptions.delayId] = setTimeout(function() {

            element.offsetHeight; // Trigger a reflow, flushing the CSS changes

            if (options.tween === 'Elastic' || options.tween === 'Bounce') {

                self.setKeyframeEffect(element, options, localOptions, isIn);

            } else {

                var timingFunction = self.getTimingFunction(options);
                var transition = "opacity " + Number(options.duration) + "s " + timingFunction + ", " +
                    "transform " + Number(options.duration) + "s " + timingFunction;

                self.setTransition(element, transition);

            }

            // face si la Elastic si bounce pt ca asta va fi forma finala
            // (se intampla sa se cheme onAnimationEnd dupa ce se termina efectul si atunci flicare)
            element.style.transform = getTranslate(false);
            element.style.opacity = !isIn ? startAlpha : 1;

            self.timeouts[localOptions.delayId] = setTimeout(function() {
                self.onAnimationEnd(element, localOptions);
                if (!options.isWordAnimation) {
                    element.style.opacity = 1;
                }
            }, options.duration * 1000);

        }, (Number(options.delay) + localOptions.extraDelay) * 1000);

    },
    slideIn: function(element, options, localOptions) {
        this._slide(element, options, localOptions, "in");
    },
    slideOut: function(element, options, localOptions) {
        this._slide(element, options, localOptions, "out");
    },
    none: function(element, options) {

    },
    getTimingFunction: function(options) {

        // daca e linear ar trebui sa ascundem ease type

        var fName = 'ease';
        switch (options.ease) {
            default:
                fName += 'Out';
                break;
            case 'easeIn':
                fName += 'In';
                break;
            case 'easeInOut':
                fName += 'InOut';
                break;
        }
        fName += options.tween;
        if (options.tween === 'Linear') {
            fName = 'linear';
        }

        return this.ceaser[fName];
    },
    _els: [],
    getElementIndex: function(el) {
        var i, curEl;
        for (i = 0; curEl = this._els[i]; i++) {
            if (curEl === el) {
                return i + 1;
            }
        }
        this._els.push(el);
        return this._els.length;
    },
    onAnimationEnd: function(element, localOptions) {
        this.setTransition(element, "");
        this.setAnimation(element, "");
        if (localOptions.onAnimationEnd) {
            localOptions.onAnimationEnd();
        }
    },
    onAnimationStart: function(element, options, localOptions) {

    },
    clearAll: function(element) {

        var eId = this.getElementIndex(element);
        var delayId = "delay_" + eId;

        if (this.timeouts[delayId]) {
            clearTimeout(this.timeouts[delayId]);
        }

        this.setAnimation(element, "");
        this.setTransition(element, "");
    },
    clearWordsTimeout: function(element, words) {

        var eId = this.getElementIndex(element);
        var delayId;

        for (var j = 0; j < words.length; j++) {

            delayId = "delay_" + eId + '_' + j;

            if (this.timeouts[delayId]) {
                clearTimeout(this.timeouts[delayId]);
            }
            this.setAnimation(words[j], "");
            this.setTransition(words[j], "");

        }
    },
    animate: function(element, options, buildType, extraDelay) {
        if (options.type == "none") {
            if (options.onAnimationEnd) {
                options.onAnimationEnd();
            }
            return;
        }
        var self = this;
        var type = "";

        var animationType = options.type;
        switch (animationType) {
            case 'alpha-words':
                animationType = 'alphaWords';
                break;
            case 'blur-words':
                animationType = 'blurWords';
                break;
        }

        if (buildType) {
            type = (buildType == "buildIn" ? "In" : "Out");
        }

        animationType += type;

        var id = this.getElementIndex(element);
        var localOptions = {
            delayId: "delay_" + id,
            onAnimationEnd: options.onAnimationEnd,
            extraDelay: extraDelay || 0
        };

        clearTimeout(this.timeouts[localOptions.delayId]);
        self.onAnimationStart(element, options, localOptions);
        self[animationType](element, options, localOptions);
    }

};



/*
// ../../html5-embed/src/js/utils/EventDispatcher.js
*/

"use strict";

var EventDispatcher = function() {
};

EventDispatcher.prototype = {
    constructor: EventDispatcher,
    apply: function(object) {
        object.on = EventDispatcher.prototype.on;
        object.off = EventDispatcher.prototype.off;
        object.trigger = EventDispatcher.prototype.trigger;
    },
    on: function(types, listener) {
        if (this._listeners === undefined) {
            this._listeners = {};
        }

        var listeners = this._listeners;
        var type, i;

        types = types.split(" ");

        for (i = 0; type = types[i]; i++) {
            listeners[type] = listeners[type] || [];
            if (listeners[type].indexOf(listener) === -1) {
                listeners[type].push(listener);
            }
        }
    },
    off: function(type, listener) {

        if (this._listeners === undefined) {
            return;
        }

        var listeners = this._listeners;
        var listenerArray = listeners[type];

        if (listenerArray !== undefined) {
            var index = listenerArray.indexOf(listener);
            if (index !== -1) {
                listenerArray.splice(index, 1);
            }
        }
    },

    trigger: function(type, data) {

        if (this._listeners === undefined) {
            return;
        }

        var listeners = this._listeners;
        var listenerArray = listeners[type];

        if (listenerArray !== undefined) {

            var ev = {};
            ev.target = this;
            ev.type = type;
            ev.data = data;

            var length = listenerArray.length;

            for (var i = 0; i < length; i++) {
                listenerArray[i].call(this, ev);
            }
        }
    }
};



/*
// ../../html5-embed/src/js/utils/Stats.js
*/

/**
 * Created by Laviniu on 13.10.2015.
 */

"use strict";
function Stats(options) {
    this.hash = options.hash;
    this.userId = options.userId;
    this.rotatorHash = options.rotatorHash;
    this.sqsURI = bannerConfig.env === 'dev' || bannerConfig.env === 'local' ? '/756737886395/stats-dev-banner' : '/756737886395/stats-banner';
    this.sqsURL = 'https://sqs.us-east-1.amazonaws.com' + this.sqsURI;
    this.timestamp = false;
    this.ip = false;
    this.vid = false;
    this.viewTime = false;
    this.browser = eaUtils.getBrowser();
    this.params = {
        'uid': this.userId, // user id
        'h': this.hash,  // hashul bannerului
        'eid': false,  // id-ul elementului (ex: buton)
        'ip': false, // ip
        'b': this.browser[0], // browser
        'bv': this.browser[1], // browser version
        'os': eaUtils.getOS(), // sistemul de operara
        'd': eaUtils.getDevice(), // device
        'r': eaUtils.getScreenSize(), // rezolutie
        'mp': false, // mouse position - doar la click
        't': false, // request timestamp
        'vid': false, // view id
        'elt': false, // element type
        'et': 'view' // event type: view, click
    };
    if (this.rotatorHash) {
        this.params.rh = this.rotatorHash;
    }
    this.planned = {};
    this.slideSaved = false;
    this.banner = options.banner;
    this.currentDomain = options.currentDomain;
    EventDispatcher.call(this);
}

Stats.prototype = new EventDispatcher();
Stats.prototype.constructor = Stats;


Stats.prototype.plan = function(type, obj, ev) {
    if (!this.timestamp) {
        return;
    }
    if (!this.planned[type]) {
        this.planned[type] = [];
    }

    var isSlide = obj.displayData && obj.displayData.type && obj.displayData.type == 'slide';
    if (this.slideSaved && isSlide) {
        return;
    }
    if (!this.slideSaved && isSlide) {
        this.slideSaved = isSlide;
    }

    var params = {};
    for (var i in this.params) {
        params[i] = this.params[i];
    }
    var eid = (obj.displayData && obj.displayData.properties && obj.displayData.properties.id) || obj.id;
    if (eid) {
        params.eid = eid;
    }
    params.ip = this.ip;
    params.vid = this.vid;
    params.t = this.timestamp + (Math.floor(new Date().getTime() / 1000) - this.viewTime);
    params.mp = ev.clientX + 'x' + ev.clientY;
    params.et = ev.type;
    params.elt = this.getElementType(obj);
    this.planned[type].push(params);
};

Stats.prototype.launch = function(type) {
    if (!type) {
        var objs = [];
        for (var i in this.planned) {
            for (var j in this.planned[i]) {
                objs.push(this.planned[i][j]);
            }
        }
        this.sendSQSRequest(objs);
        this.planned = {};
    } else {
        this.sendSQSRequest(this.planned[type]);
        this.planned[type] = [];
    }
    this.slideSaved = false;
};

Stats.prototype.isBlockedDomain = function(domain) {
    if (!domain) {
        return false;
    }
    var blockedDomains = [
        'www.bannersnack.com',
        'bannersnack.com',
        'dev.bannersnack.net',
        'bannersnack',
        'www.mediacpm.pl',
        'mediacpm.pl',
        'www.adsmodern.com',
        'adsmodern.com',
        'www.capital.gr',
        'capital.gr',
        'www.dikaiologitika.gr',
        'dikaiologitika.gr',
        'www.athensmagazine.gr',
        'athensmagazine.gr',
        'www.topontiki.gr',
        'topontiki.gr',
        'www.efsyn.gr',
        'efsyn.gr',
        'www.youweekly.gr',
        'youweekly.gr',
        'www.tribune.gr',
        'tribune.gr',
        'www.newpost.gr',
        'newpost.gr',
        'www.rizopoulospost.com',
        'rizopoulospost.com',
        'www.newpost.gr',
        'newpost.gr',
        'www.kontranews.gr',
        'kontranews.gr'
    ];
    domain = domain.split('//')[1] || "";
    domain = domain.split('/')[0];
    var domainParts = domain.split('.');
    if (domainParts.length == 4) {
        var tmpDomain = domain.replace(domainParts[0] + '.', '');
        if (domainParts[0] != 'share' && blockedDomains.indexOf(tmpDomain) > -1) {
            return true;
        }
    }

    if (blockedDomains.indexOf(domain) > -1) {
        return true;
    }
    return false;
};

Stats.prototype.track = function() {
    var self = this;
    var url = this.getStatsRequestUrl();

    var callbackName = 'bsStats_' + this.hash;

    var isBlockedDomain = this.isBlockedDomain(this.currentDomain);

	// Google Analytics
    if (!isBlockedDomain) {
        try {
            ga('create', 'UA-15731042-32', 'auto');
            ga('send', 'pageview');
        } catch (e) {
            // do nothing
        }
    }

    var params = {
        h: this.hash,
        c: callbackName
    };

    var tmpParams = '';
    for (var i in params) {
        tmpParams += i + '=' + encodeURIComponent(params[i]) + '&';
    }
    tmpParams = tmpParams.replace(/&$/, '');
    url += '?' + tmpParams;

    window[callbackName] = function(data) {
        var params = self.params;
        self.timestamp = params.t = data.t;
        self.ip = params.ip = data.ip;
        self.vid = params.vid = data.vid;
        params.et = 'view';
        self.viewTime = Math.floor(new Date().getTime() / 1000);

        if (!data.premium) {
            self.banner.showWatermark();
        }

        if (!isBlockedDomain) {
            self.trackView(params);
        }
    };

    var script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
};

Stats.prototype.trackView = function(params) {
    delete params.mp;
    delete params.eid;
    delete params.elt;
    var p = [];
    p.push(params);
    this.sendSQSRequest(p);
};

Stats.prototype.trackEvent = function(container, obj) {
    var self = this;
    container.addEventListener('click', function(ev) {
        var currentSlide = self.getCurrentSlideFromOverflow(obj);
        if (currentSlide) {
            self.plan('click', currentSlide, ev);
        }
        self.plan('click', obj, ev);
    });
};

Stats.prototype.getCurrentSlideFromOverflow = function(obj) {
    if (obj && obj.properties && obj.properties.showOnAllSlides) {
        return obj.slide.banner.currentSlide;
    }
    if (obj && obj.menu && obj.menu.properties && obj.menu.properties.showOnAllSlides) {
        return obj.menu.slide.banner.currentSlide
    }
    return false;
};

Stats.prototype.sendSQSRequest = function(message) {
    this.sendData(this.sqsURL + '?Action=SendMessage' + '&MessageBody=' + encodeURIComponent(JSON.stringify(message)));
};

Stats.prototype.sendData = function(url) {
    if (!url) {
        return false;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, true);
    xhttp.send();
};

Stats.prototype.getStatsRequestUrl = function() {
    if (bannerConfig.env) {
        if (bannerConfig.env === 'live') {
            return '//stats.bannersnack.com/info/';
        } else if (bannerConfig.env === 'dev') {
            return '//stats.dev.bannersnack.net/info/';
        } else if (bannerConfig.env === 'local') {
            return '//stats.dev.bannersnack.net/info/';
        }
    }
    return '//stats.bannersnack.com/info/';
};

Stats.prototype.getElementType = function(obj) {
    if (!obj) {
        return false;
    }
    var elemType = obj.displayData && obj.displayData.type;
    if (elemType == 'slide') {
        return elemType;
    }
    if (elemType == 'layer') {
        var layerType = obj.displayData && obj.displayData.layerType;
        if (!layerType) {
            return false;
        }
        return layerType;
    }
    if (obj.itemIndex && obj.menu) {
        return 'menuItem';
    }
    return 'banner';
};




/*
// ../../html5-embed/src/js/display/BaseDisplay.js
*/

"use strict";

function BaseDisplay() {
    EventDispatcher.call(this);
}
BaseDisplay.prototype = new EventDispatcher();
BaseDisplay.prototype.constructor = EventDispatcher;
BaseDisplay.prototype.container = null;
BaseDisplay.prototype.displayContainer = null;
BaseDisplay.prototype.properties = null;
BaseDisplay.prototype.displayData = null;
BaseDisplay.prototype.buildTimeouts = [];

BaseDisplay.prototype.init = function(displayData) {
    this.displayData = displayData;
    return this;
};
BaseDisplay.prototype.render = function() {

};
BaseDisplay.prototype.reset = function() {

    eff.clearAll(this.container);

    var i, bTimeout;
    for (i = 0; bTimeout = this.buildTimeouts[i]; i++) {
        clearTimeout(bTimeout);
    }
    this.buildTimeouts = [];

    this.transform('none');
    this.setStyle(this.container, "x,y,width,height", "px");
    this.container.style.opacity = 1;
    this.container.style.display = "";
    this.container.style.filter = "";
    this.container.style['-webkit-filter'] = "";
    this.container.style['animation'] = "";
    this.container.style['-webkit-animation'] = "";

    for (i = 0; bTimeout = this.buildTimeouts[i]; i++) {
        clearTimeout(bTimeout);
    }
    this.buildTimeouts = [];

    if (this.displayContainer) {
        var displayOpacity = typeof this.properties.opacity !== 'undefined' ? this.properties.opacity : 100;
        this.displayContainer.style.opacity = displayOpacity / 100;
    }

};
BaseDisplay.prototype.applyActions = function(action, container) {
    var self = this;
    if (!action || !container) {
        return false;
    }
    if (action.type == 'none') {
        return false;
    }
    var pnt = 'pointer';
    if (typeof action.useHandCursor != 'undefined' && action.useHandCursor == false) {
        pnt = '';
    }
    container.style.cursor = pnt;
    container.addEventListener(action.event, function(ev) {
        if (ev.clickFlag) {
            ev.clickFlag = false;
            return false;
        }
        if (action.disabled) {
            return false;
        }
        ev.clickFlag = this;
        if (action.type == 'gotoSlide') {
            var buildOutTime = self.slide.getBuildOutTime();
            if (buildOutTime) {
                action.disabled = true;
                setTimeout(function() {
                    action.disabled = false;
                }, buildOutTime);
            }
            var currentSlide = self.slide.banner.currentSlide;
            switch (action.slideOrUrl) {
                case 'first':
                    currentSlide.buildOut(self.slide.getFirstSlide());
                    break;
                case 'last':
                    currentSlide.buildOut(self.slide.getLastSlide());
                    break;
                case 'next':
                    currentSlide.buildOut(self.slide.getNextSlide(currentSlide));
                    break;
                case 'prev':
                    currentSlide.buildOut(self.slide.getPrevSlide(currentSlide));
                    break;
                default:
                    currentSlide.buildOut(currentSlide.getSlideByHash(action.slideOrUrl));
            }
        } else {
            // doubleClick rescrie globala clickTag, dupa document ready, de aceea o folosim aici
            // window.clickTag - rescriem orice url din pagina, daca clickTag e setat
            // verificam daca avem clickTag pe window, si daca nu ne vine din GET deoarece, cel din GET are prioritate
            var url = '';
            if (eaUtils.getClickTagValue()) {
                url = eaUtils.addProtocolToUrl(eaUtils.getClickTagValue());
            } else if (window.clickTag) {
                url = eaUtils.addProtocolToUrl(window.clickTag);
            } else {
                url = action.slideOrUrl;
            }
            //var url = (window.clickTag && !eaUtils.getClickTagValue())? eaUtils.addProtocolToUrl(window.clickTag) : eaUtils.addProtocolToUrl(eaUtils.getClickTagValue());
            window.open(url, action.target);
        }
    });
};
BaseDisplay.prototype.createElement = function(type, displayClass, addToDisplay, container) {
    var element = document.createElement(type);
    element.setAttribute('class', displayClass);

    if (addToDisplay != false && (container || this.container)) {
        (container || this.container).appendChild(element);
    }
    element.setAttribute("id", eaUtils.getElementUniqueId());
    return element;

};
BaseDisplay.prototype.setStyle = function(container, props, suffix) {
    if (!suffix) suffix = "";

    var aliasProps = {
        x: "left",
        y: "top",
        labelOffsetX: "margin-left",
        labelOffsetY: "margin-top",
        lineHeight: "line-height"
    };
    props = props.split(",");

    for (var i in props) {
        if (props.hasOwnProperty(i)) {
            container.style[aliasProps[props[i]] || props[i]] = this.properties[props[i]] + suffix;
        }
    }
    return this;
};
BaseDisplay.prototype.getContainer = function() {
    return this.container;
};

BaseDisplay.prototype.show = function() {
    this.container.style.display = "";
    return this;
};

BaseDisplay.prototype.hide = function() {
    this.container.style.display = "none";
    return this;
};

BaseDisplay.prototype.hasClass = function(el, name) {
    if (!el) return false;
    return new RegExp('(\\s|^)' + name + '(\\s|$)').test(el.className);
};

BaseDisplay.prototype.removeClass = function(el, name) {
    if (this.hasClass(el, name)) {
        el.className = el.className.replace(new RegExp('(\\s|^)' + name + '(\\s|$)'), ' ').replace(/^\s+|\s+$/g, '');
    }
    return this;
};

BaseDisplay.prototype.addClass = function(el, name) {
    if (!el) return this;
    if (!this.hasClass(el, name)) {
        el.className += (el.className ? ' ' : '') + name;
    }
    return this;
};

BaseDisplay.prototype.toggleClass = function(el, name) {
    if (!el) return this;
    if (!this.hasClass(el, name)) {
        this.addClass(el, name);
    }
    else {
        this.removeClass(el, name);
    }
    return this;
};
BaseDisplay.prototype.applyBackground = function(el, background) {
    var css = eaUtils.getBackgroundCss(background);
    for (var i in css) {
        switch (i) {
            default:
                el.style[i] = css[i];
                break;
            case 'background':
                for (var j = 0; j < css[i].length; j++) {
                    el.style.background = css[i][j];
                }
                break;
        }
    }
    if (background && background.type && background.type == 'image') {
        eaUtils.toggleBackroundClasses(el, background.scaleMode);
        eaUtils.applyImageSizeOnBackground(el, background);
    }
};
BaseDisplay.prototype.applyBoxShadow = function(el, shadow) {
    eaUtils.applyCss(el, eaUtils.getBoxShadowCss(shadow));
};
BaseDisplay.prototype.applyFilters = function(el, adjustColor, blur, dropShadow) {
    eaUtils.applyCss(el, eaUtils.getFiltersCss(adjustColor, blur, dropShadow));
};

/**
 * Returneaza string-ul de scale in cazul in care elementul are flip
 * @returns {null}
 */
BaseDisplay.prototype.getFlipString = function(flip) {
    if (!flip) {
        return '';
    }
    var flipH = flip === 'both' || flip === 'horizontal' ? '-1' : '1';
    var flipV = flip === 'both' || flip === 'vertical' ? '-1' : '1';
    return 'scale(' + flipH +', ' + flipV + ')';
};

BaseDisplay.prototype.getBRadius = function() {
    var properties = this.properties;
    var border = properties.border || {};
    var bRadius = 0;

    if (properties.type === "rectangle") {
        if (border.radius !== undefined ) {
            bRadius = border.radius;
        } else if (properties.bradius !== undefined) {
            bRadius = properties.bradius;
        }
    }

    return bRadius;
};

BaseDisplay.prototype.getBorderString = function(b) {
    var border = b || this.properties.border || {};
    if (border.weight === undefined || border.color === undefined) {
        return '';
    }
    return border.weight + 'px solid ' + border.color;
};

/**
 * Returneaza elementul ce va fi animat
 * @returns {null}
 */
BaseDisplay.prototype.getAnimationEl = function() {
    return this.container;
};

/**
 * Face build in si cand se termina face build out
 */
BaseDisplay.prototype.playAnimation = function(appendDelay) {

    var self = this;
    var element = this.getAnimationEl();
    var properties = this.displayData.properties;
    var buildIn = properties.buildIn;
    var buildOut = properties.buildOut;
    appendDelay = appendDelay || 0;

    if (buildIn && buildIn.type != 'none') {

        this.buildTimeouts.push(
            setTimeout(function() {
                self.trigger("buildInStart");
            }, buildIn.delay * 1000)
        );

        buildIn.onAnimationEnd = function() {
            if (buildOut && buildOut.type != 'none') {

                self.buildTimeouts.push(
                    setTimeout(function() {
                        self.trigger("buildOutStart");
                    }, buildOut.delay * 1000)
                );

                eff.animate(element, buildOut, "buildOut");
                self.buildTimeouts.push(
                    setTimeout(function() {
                        self.trigger("buildOutEnd");
                        element.style.display = "none";
                    }, (buildOut.duration + buildOut.delay) * 1000)
                );
            }
        };
        eff.animate(element, buildIn, "buildIn", appendDelay);
        this.buildTimeouts.push(
            setTimeout(function() {
                self.trigger("buildInEnd");
            }, (buildIn.duration + buildIn.delay + appendDelay) * 1000)
        );
    } else {
        if (buildOut && buildOut.type != 'none') {

            this.buildTimeouts.push(
                setTimeout(function() {
                    self.trigger("buildOutStart");
                }, (buildOut.delay + appendDelay) * 1000)
            );

            eff.animate(element, buildOut, "buildOut", appendDelay);

            this.buildTimeouts.push(
                setTimeout(function() {
                    self.trigger("buildOutEnd");
                    element.style.display = "none";
                }, (buildOut.duration + buildOut.delay + appendDelay) * 1000)
            );

        }
    }
};
BaseDisplay.prototype.transform = function(transform, el) {
    if (!el) {
        el = this.container;
    }
    el.style['-webkit-transform'] = transform;
    el.style['-o-transform'] = transform;
    el.style['-ms-transform'] = transform;
    el.style['-moz-transform'] = transform;
    el.style['transform'] = transform;
};

BaseDisplay.prototype.createActionProperties = function(menuItemAction) {
    var action = menuItemAction ? menuItemAction : this.properties && this.properties.actions && this.properties.actions[0];
    if (!action)
        return false;
    var url = '';
    if (action.type == 'gotoURL') {
        url = action.url;
        if (!url)
            return false;
        if (url.indexOf('://') == -1) {
            url = 'http://' + url;
        }
    }
    var act = {
        event: action.event,
        slideOrUrl: action.type == 'gotoSlide' ? action.slide : url,
        type: action.type,
        target: action.target,
        useHandCursor: action.useHandCursor
    };
    return act;
};




/*
// ../../html5-embed/src/js/display/ButtonDisplay.js
*/

"use strict";

function ButtonDisplay() {
    BaseDisplay.call(this);
}
ButtonDisplay.prototype = new BaseDisplay();
ButtonDisplay.prototype.constructor = ButtonDisplay;

ButtonDisplay.prototype.init = function(elementData) {

    var properties = elementData.properties;
    this.properties = properties;
    var border = properties.border || {};
    this.container = this.createElement("div", "element");

    this.displayContainer = this.createElement("div", "bs-btn " + elementData.eh);
    properties["border-radius"] = properties.border && properties.border.radius ?
        properties.border.radius : properties.borderRadius;
    this.textContainer = this.createElement("label", "bs-btn-label", true, this.displayContainer);
    this.textContainer.textContent = properties.buttonLabel;

    properties["line-height"] = properties.height - (border.weight ? border.weight * 2 : 0);
    this.setStyle(this.textContainer, "line-height,labelOffsetX,labelOffsetY", "px");

    properties.labelStyle.fontSize = properties.labelStyle.fontSize + "px";
    properties.labelStyle.letterSpacing = properties.labelStyle.letterSpacing + "px";
    eaUtils.applyCss(this.textContainer, properties.labelStyle);
    eaUtils.applyCss(this.textContainer, eaUtils.getTextShadowCss(properties.labelShadow));
    eaUtils.applyCss(this.displayContainer, eaUtils.getBoxShadowCss(properties.dropShadow));

    var cssClass = ".bs-btn." + (elementData.eh);
    var buttonColorCss = cssClass + "{ background-color:" + this.properties.backgroundColor + ";}" +
        cssClass + ":hover{ background-color:" + eaUtils.generateLighterColor(this.properties.backgroundColor, 15) + ";}";
    eaUtils.addCSSById(buttonColorCss, "bs-btn" + elementData.eh);

    if (border.weight) {
        var b = (JSON.parse(JSON.stringify(border)));
        b.color = 'transparent';
        eaUtils.applyCss(this.textContainer, { left: '0', border: this.getBorderString(b) });
    }

    this.displayContainer.style.border = this.getBorderString();

    this.reset();

    var actionProps = this.createActionProperties();
    if (actionProps && actionProps.event === 'click' && !actionProps.useHandCursor) {
        this.addClass(this.displayContainer, "no-hand-cursor");
    }
    if (this.slide.banner.statsPresent) {
        this.slide.banner.stats.trackEvent(this.container, this);
    }
    this.applyActions(actionProps, this.container);
    return BaseDisplay.prototype.init.call(this, elementData);
};

ButtonDisplay.prototype.reset = function() {
    BaseDisplay.prototype.reset.call(this);
    this.setStyle(this.displayContainer, "width,height,border-radius", "px");
};




/*
// ../../html5-embed/src/js/display/ImageDisplay.js
*/

"use strict";

function ImageDisplay() {
    BaseDisplay.call(this);
}
ImageDisplay.prototype = new BaseDisplay();
ImageDisplay.prototype.constructor = BaseDisplay;

ImageDisplay.prototype.init = function(elementData) {
    this.triggerReadyOnRender = false;
    this.properties = elementData.properties;
    this.container = this.createElement("div", "element");
    this.transformContainer = this.createElement("div", "transform-container");
    this.displayContainer = this.createElement("div", "bs-image image-" + this.properties.scaleMode);
    this.container.appendChild(this.transformContainer);
    this.transformContainer.appendChild(this.displayContainer);

    var url;
    if (this.properties.localUrl) {
        url = 'images/' + this.properties.localUrl;
        if (bannerConfig.embedUrl) {
            url = bannerConfig.embedUrl + url;
        }
    } else {
        url = (this.properties.url && this.properties.url.indexOf('//') != -1) ?
            this.properties.url : bannerConfig.photosUrl + this.properties.url;
    }

    this.displayContainer.style["backgroundImage"] = "url(" + url + ")";

    this.applyFilters(
        this.displayContainer,
        this.properties.adjustColor,
        this.properties.blur,
        this.properties.dropShadow
    );

    var va, ha;
    switch (this.properties.verticalAlign) {
        case 'top':
            va = '0';
            break;
        case 'middle':
            va = '50%';
            break;
        case 'bottom':
            va = '100%';
            break;
    }
    switch (this.properties.horizontalAlign) {
        case 'left':
            ha = '0';
            break;
        case 'center':
            ha = '50%';
            break;
        case 'right':
            ha = '100%';
            break;
    }
    this.displayContainer.style["backgroundPosition"] = ha + ' ' + va;
    if (this.properties.scaleMode == 'tile') {
        var scale = this.properties.contentScale;
        this.displayContainer.style["backgroundSize"] = ((scale / 100) * this.properties.oWidth) + 'px';
        this.displayContainer.style["backgroundPositionX"] = this.properties.contentOffsetX + '%';
        this.displayContainer.style["backgroundPositionY"] = this.properties.contentOffsetY + '%';
    }

    this.transformContainer.style.height = '100%';
    this.transformContainer.style.width = '100%';

    var flip = this.getFlipString(this.properties.flip);

    this.transform("translateZ(0) rotate(" + this.properties.rotation + "deg) " + flip, this.transformContainer);

    this.reset();
    if (this.slide.banner.statsPresent) {
        this.slide.banner.stats.trackEvent(this.displayContainer, this);
    }
    this.applyActions(this.createActionProperties(), this.displayContainer);
    return BaseDisplay.prototype.init.call(this, elementData);
};




/*
// ../../html5-embed/src/js/display/ClipartDisplay.js
*/

"use strict";

function ClipartDisplay() {
    BaseDisplay.call(this);
}
ClipartDisplay.prototype = new BaseDisplay();
ClipartDisplay.prototype.constructor = BaseDisplay;

ClipartDisplay.prototype.init = function(elementData) {
    this.properties = elementData.properties;
    this.clipart = this.properties.svgObject;
    this.container = this.createElement("div", "element");
    this.transformContainer = this.createElement("div", "transform-container");
    this.displayContainer = this.createElement("div", "bs-clipart");
    this.displayContainer.setAttribute('id', 'ce-' + eaUtils.getUniqueId());
    this.container.appendChild(this.transformContainer);
    this.transformContainer.appendChild(this.displayContainer);
    if (this.clipart.attributes && this.clipart.attributes['data-height']) {
        var height = parseFloat(this.clipart.attributes['data-height']);
        for (var i in this.clipart.children) {
            if (this.clipart.children[i].attributes && this.clipart.children[i].attributes.transform && (height != 0)) {
                this.clipart.children[i].attributes.transform = "scale(" + (this.properties.height / height).toFixed(3) + ")";
            }
        }
    }
    this.makeClipartItem(this.clipart, this.displayContainer);
    this.applyFilters(this.displayContainer, false, this.properties.blur, this.properties.dropShadow);
    this.transformContainer.style.height = '100%';
    this.transformContainer.style.width = '100%';

    var flip = this.getFlipString(this.properties.flip);

    this.transform("translateZ(0) rotate(" + this.properties.rotation + "deg) " + flip, this.transformContainer);
    this.reset();
    if (this.slide.banner.statsPresent) {
        var clipartContainer = this.displayContainer.querySelector('.actionMask') ?
            this.displayContainer.querySelector('.actionMask') :
            this.displayContainer;

        this.slide.banner.stats.trackEvent(clipartContainer, this);
    }
    this.applyActions(this.createActionProperties(), this.displayContainer.querySelector('.actionMask'));
    return BaseDisplay.prototype.init.call(this, elementData);
};

ClipartDisplay.prototype.makeClipartItem = function(o, container) {
    var i, self = this, attrName;
    var svgConfig = {
        preserveAspectRatio: "none", version: "1.1", width: "100%", height: "100%",
        'xmlns': "http://www.w3.org/2000/svg", 'xmlns:xlink': "http://www.w3.org/1999/xlink", 'xml:space': "preserve"
    };
    var ct = document.createElementNS('http://www.w3.org/2000/svg', o.type);
    if (o.type == 'svg') {
        for (i in svgConfig) {
            ct.setAttribute(i, svgConfig[i]);
        }
    }
    if (['ellipse', 'image', 'line', 'path', 'polygon', 'polyline', 'rect', 'use', 'circle'].indexOf(o.type) > -1) {
        ct.setAttribute('fill', this.properties.fillColor);
    }

    for (i in o.attributes) {
        if (i == 'fill' && o.attributes[i].slice(0, 3) == 'url') {
            var id = o.attributes[i].slice(5).slice(0, -1);
            ct.setAttribute(i, 'url(#' + id + this.displayContainer.getAttribute('id') + ')');
        } else {
            attrName = i === 'className' ? 'class' : i;
            ct.setAttribute(attrName, o.attributes[i]);
        }
    }
    if (o.type == 'pattern') {
        ct.setAttribute('id', o.attributes['id'] + this.displayContainer.getAttribute('id'));
    }
    container.appendChild(ct);
    if (o.children) {
        o.children.forEach(function(c) {
            self.makeClipartItem(c, this);
        }, ct);
    }
};




/*
// ../../html5-embed/src/js/display/MenuDisplay.js
*/

function MenuDisplay() {
    BaseDisplay.call(this);
}
MenuDisplay.prototype = new BaseDisplay();
MenuDisplay.prototype.constructor = MenuDisplay;

MenuDisplay.prototype.init = function(elementData) {
    var ie = eaUtils.getIEVersion();
    var self = this;
    this.timeout = false;
    this.counter = 0;
    this.elementData = elementData;
    var properties = elementData.properties;
    this.properties = properties;
    this.container = this.createElement("div", "element");
    this.displayContainer = this.createElement("div", "menu " + elementData.eh + (ie == 9 ? ' ie' + ie : ''));

    var displayContainerStyle = this.displayContainer.style;
    displayContainerStyle.backgroundColor = properties.backgroundColor;
    displayContainerStyle.borderRadius = properties.borderRadius + 'px';

    properties.labelStyle.fontSize = properties.labelStyle.fontSize + "px";
    properties.labelStyle.letterSpacing = properties.labelStyle.letterSpacing + "px";
    eaUtils.applyCss(this.displayContainer, eaUtils.getBoxShadowCss(properties.dropShadow));

    var items = this.properties.items;
    if (items) {
        for (var i = 0; i < items.length; i++) {
            this.setLabelStyle(items[i]);
        }
        this.slide.banner.on("changeSlide", function() {
            self.setActiveLabel(self.displayContainer, null);
        });
    }
    this.cssClass = ".menu." + this.elementData.eh + " label";
    if (this.slide.banner.statsPresent) {
        this.slide.banner.stats.trackEvent(this.displayContainer, this);
    }
    this.reset();
    return BaseDisplay.prototype.init.call(this, elementData);
};

MenuDisplay.prototype.render = function() {
    var self = this;
    var properties = this.properties;
    var eh = this.elementData.eh;
    if (!eaUtils.isMobile.any()) {
        // label hover
        var labelHoverColorCSS =
            this.cssClass + (
                this.properties.activeColors ?
                ":hover{background-color:" + properties.activeBackgroundColor + ";color:" + properties.activeLabelColor + "!important}" :
                    ":hover{opacity:0.8}");
        eaUtils.addCSSById(labelHoverColorCSS, "menu" + eh + "label:hover");
    }
    // active label
    var activeLabel = this.cssClass +
        ( properties.activeColors ?
            ".active{background-color:" + properties.activeBackgroundColor + ";color:" + properties.activeLabelColor + "!important}" :
                ".active{opacity:0.8}"
        );
    eaUtils.addCSSById(activeLabel, "menu" + eh + "label.active");
    var menuElems = this.displayContainer.children;
    var items = this.properties && this.properties.items;
    if (menuElems && menuElems.length != 0) {
        for (var i = 0; i < menuElems.length; i++) {
            menuElems[i].addEventListener('click', function() {
                var _self = this;
                var currentElemtIndex = false;
                for (var j = 0; j < menuElems.length; j++) {
                    if (_self.id == menuElems[j].id && (items && items[j] && items[j].action && items[j].action.type && items[j].action.type == 'gotoSlide')) {
                        currentElemtIndex = j;
                        break;
                    }
                }
                if (typeof currentElemtIndex != 'boolean') {
                    self.setActiveLabel(self.displayContainer, currentElemtIndex);
                }
            });
        }
    }
};
MenuDisplay.prototype.setLabelStyle = function(item, activeLabel) {
    var label = this.createElement('label', '', true, this.displayContainer);
    var properties = this.properties;

    var labelStyle = label.style;
    labelStyle.lineHeight = properties.height + 'px';
    labelStyle.height = properties.height + 'px';
    eaUtils.applyCss(label, properties.labelStyle);
    eaUtils.applyCss(label, eaUtils.getTextShadowCss(properties.labelShadow));

    var span = this.createElement('span', '', true, label);
    span.textContent = item.label;
    var spanStyle = span.style;
    spanStyle.display = 'inline-block';
    spanStyle.position = 'relative';
    spanStyle.top = properties.labelOffsetY + 'px';

    if (item.action) {
        if (this.slide.banner.statsPresent) {
            item.menu = this;
            this.slide.banner.stats.trackEvent(label, item);
        }
        this.adjustActionProperties(item.action);
        this.applyActions(this.createActionProperties(item.action), label);
    }
};

MenuDisplay.prototype.setActiveLabel = function(menuContainer, activeLabelIndex) {
    var children = menuContainer.children;
    for (var i = 0; i < children.length; i++) {
        var label = children[i];
        this.removeClass(label, 'active');
        if (activeLabelIndex != null && i == activeLabelIndex) {
            this.addClass(label, 'active');
        }
    }
};

MenuDisplay.prototype.adjustActionProperties = function(itemAction) {
    if (!itemAction) {
        return false;
    }
    var itemActionType = itemAction.type;
    if (!itemAction.event) {
        itemAction.event = 'click';
    }
    if (!itemAction.useHandCursor) {
        itemAction.useHandCursor = true;
    }
    if (itemActionType == 'gotoSlide') {
        if (itemAction.target == 'first' || itemAction.target == 'last' || itemAction.target == 'prev' || itemAction.target == 'next') {
            itemAction.slide = itemAction.target;
        } else {
            var target = parseInt(itemAction.target);
            if (isNaN(target) || !target) {
                itemAction.target = 1;
            }
            itemAction.slide = this.slide && this.slide.banner && this.slide.banner.slides && this.slide.banner.slides[itemAction.target - 1] && this.slide.banner.slides[itemAction.target - 1].ah;
        }
    }
    if (itemActionType == 'gotoURL') {
        if (itemAction.target == null) {
            itemAction.target = '_blank';
        }
    }
    return itemAction;
};
MenuDisplay.prototype.reset = function() {
    BaseDisplay.prototype.reset.call(this);
    this.setStyle(this.displayContainer, "width,height,border-radius", "px");
};




/*
// ../../html5-embed/src/js/display/ShapeDisplay.js
*/

"use strict";

function ShapeDisplay() {
    BaseDisplay.call(this);
}
ShapeDisplay.prototype = new BaseDisplay();
ShapeDisplay.prototype.constructor = ShapeDisplay;

ShapeDisplay.prototype.init = function(elementData) {
    var properties = elementData.properties;
    this.properties = properties;
    this.container = this.createElement("div", "element");

    this.displayContainer = this.createElement("div", "shape " + properties.type);
    if (eaUtils.detectIE()) {
        var img = this.createElement('img', "fakeImage");
        img.src = eaUtils.getTransparentImageURL();
        this.displayContainer.appendChild(img);
    }

    if (properties.type === "line") {
        properties.type = 'rectangle';
        properties.width = properties.len;
        properties.height = properties.thick;
        delete properties.len;
        delete properties.thick;

        this.properties = properties;
    }

    this.container.style.width = properties.width + "px";
    this.container.style.height = properties.height + "px";

    var borderRadius = this.getBRadius();
    if (borderRadius) {
        this.displayContainer.style.borderRadius = borderRadius + "px";
    }

    this.displayContainer.style.border = this.getBorderString();

    this.applyBackground(this.displayContainer, properties.backgroundColor);

    this.displayData = elementData;

    var flip = this.getFlipString(properties.flip);

    this.transform("rotate(" + this.properties.rotation + "deg) " + flip, this.displayContainer);

    this.applyFilters(this.displayContainer, false, this.properties.blur, this.properties.dropShadow);

    this.reset();
    if (this.slide.banner.statsPresent) {
        this.slide.banner.stats.trackEvent(this.displayContainer, this);
    }
    this.applyActions(this.createActionProperties(), this.displayContainer);
    return BaseDisplay.prototype.init.call(this, elementData);
};




/*
// ../../html5-embed/src/js/display/TextDisplay.js
*/

"use strict";
function TextDisplay() {
    BaseDisplay.call(this);
}
TextDisplay.prototype = new BaseDisplay();
TextDisplay.prototype.constructor = TextDisplay;


TextDisplay.prototype.init = function(elementData) {
    this.properties = elementData.properties;
    this.container = this.createElement("div", "element");

    this.text = this.createElement("span", "text-content");

    this.displayContainer = this.createElement("p", "text");
    this.displayContainer.appendChild(this.text);
    this.container.appendChild(this.displayContainer);

    this.transform('rotate(' + this.properties.rotation + 'deg)', this.displayContainer);

    var properties = this.properties;
    this.setStyle(this.displayContainer, "fontWeight,fontStyle,opacity,color");
    this.setStyle(this.displayContainer, "fontSize", "px");

    var displayContainerStyle = this.displayContainer.style;

    displayContainerStyle.fontFamily = "'" + properties.fontFamily + "'";
    displayContainerStyle.textAlign = properties.alignment;
    displayContainerStyle.lineHeight = properties.lineHeight;
    displayContainerStyle.letterSpacing = properties.letterSpacing + 'px';
    if (properties.textTransform) {
        displayContainerStyle.textTransform = properties.textTransform;
    }
    if (properties.textDecoration) {
        displayContainerStyle.textDecoration = properties.textDecoration;
    }

    try {
        this.text.textContent = this.properties.text;
    } catch (e) {
    }

    eaUtils.applyCss(this.displayContainer, eaUtils.getTextShadowCss(this.properties.textShadow));

    this.applyFilters(this.displayContainer, false, this.properties.blur);

    this.reset();
    if (this.slide.banner.statsPresent) {
        this.slide.banner.stats.trackEvent(this.text, this);
    }
    this.applyActions(this.createActionProperties(), this.text);
    return BaseDisplay.prototype.init.call(this, elementData);
};

TextDisplay.prototype.reset = function() {

    BaseDisplay.prototype.reset.call(this);

    var container = this.container.getElementsByClassName("text-content")[0];
    var spans = container.getElementsByTagName("span");

    eff.clearWordsTimeout(this.container, spans);

    for (var i = 0; i < spans.length; i++) {

        var spanStyle = spans[i].style;
        spanStyle.opacity = 1;
        spanStyle.filter = "";
        spanStyle['-webkit-filter'] = "";
        spanStyle['animation'] = "";
        spanStyle['-webkit-animation'] = "";
        spanStyle['transition'] = "";
        spanStyle['-webkit-transition'] = "";
    }

};




/*
// ../../html5-embed/src/js/display/BannerDisplay.js
*/

"use strict";

function BannerDisplay() {
    this.startSlide = 0;
    /**
     *
     * @type {SlideDisplay}
     */
    this.overflowSlide = null;
    BaseDisplay.call(this);
}
BannerDisplay.prototype = new BaseDisplay();
BannerDisplay.prototype.constructor = BannerDisplay;
BannerDisplay.prototype.currentSlide = null;
BannerDisplay.prototype.lastSlide = null;
BannerDisplay.prototype.fontsToLoad = [];

var scripts = document.getElementsByTagName("script");
BannerDisplay.prototype.jsFileSrc = scripts[scripts.length-1].src;

BannerDisplay.prototype.init = function(data, container, config) {
    var self = this;
    this.container = container;
    this.properties = data.properties;
    this.config = config;
    this.startSlide = parseInt(config.startSlide) || 0;
    this.noAnimation = Boolean(config.noAnimation) || false;
    this.showOnlyOneSlide = Boolean(config.showOnlyOneSlide) || false;

    var jsPath = this.jsFileSrc.split('/');
    jsPath = jsPath.slice(0, jsPath.indexOf('js')).join('/');

    if (!bannerConfig.resourcesUrl){
        bannerConfig.resourcesUrl = jsPath;
    }

    this.initFonts(data);
    this.addFontsToDom();
    this.setStyle(this.container, "width,height", "px");
    if (this.properties.width < 2 || this.properties.height < 2) {
        this.properties.backgroundColor.useBorder = false;
    }

    this.applyBackground(this.container, this.properties.backgroundColor);
    this.applyActions(this.createActionProperties(), this.container);
    BaseDisplay.prototype.init.call(this, data);
    this.initSlides(data.elements);
    this.container.addEventListener('click', function() {
        if (self.statsPresent && !self.stats.isBlockedDomain(document.referrer)) {
            self.stats.launch();
        }
    });

    var prop = eaUtils.getProportion(this.properties.width, this.properties.height);
    window.addEventListener('resize', function() {
        prop = eaUtils.getProportion(self.properties.width, self.properties.height);
        self.container.style.transform = 'scale(' + prop.proportion + ')';
    });

    this.properties.transform = 'scale(' + prop.proportion + ')';
    this.properties.transformOrigin = '0 0 0';
    this.setStyle(this.container, 'transform,transformOrigin');
};

BannerDisplay.prototype.showImageWatermark = function() {
    var div = document.createElement('div');
    div.setAttribute('class', 'wtm');
    document.getElementById('bs').appendChild(div);

    var cssInline = 'div.wtm {position: absolute;right: 0;bottom: 0;z-index: 99999;' +
        'background: url("' + bannerConfig.resourcesUrl + '/images/watermark.png"); width: 87px; height: 19px;}' +
        'div.wtm:hover {cursor: pointer}';

    eaUtils.addCSSById(cssInline, 'bswmimg');

    this._addClickWatermarkListener(div);
};

BannerDisplay.prototype.showWatermark = function() {

    /* Setup */
    var wmSetup = {
        /* Appearance */
        fontSize: '11px',
        fontStyle: 'normal',
        fontFamily: 'Arial, sans-serif',
        fontWeight: '400',
        cursor: 'pointer',
        contentColor: '#fff',
        containerBgColor: 'rgba(100, 100, 100, .8)',
        tooltipBgColor: '#090300',
        tooltipFontSize: '10px',
        tooltipOpacity: '0',
        tooltipHoverOpacity: '1',
        tooltipTransition: 'opacity .25s',
        /* Positioning */
        containerDistBottom: '0',
        containerDistRight: '-68px',
        containerHoverDistRight: '0',
        containerPosition: 'absolute',
        containerZIndex: '999',
        svgFloat: 'left',
        txtFloat: 'left',
        tooltipPosition: 'absolute',
        tooltipDistRight: '0',
        tooltipWhiteSpace: 'nowrap',
        /* Size */
        svgSize: '22px',
        svgPadding: '4px 0',
        txtPadding: '4px 4px 4px 0',
        tooltipPadding: '6px'
    };

    /* Elements creation */
    var wmContainer = document.createElement('div');
    var wmSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var wmSvgPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var wmSvgPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var wmTxt = document.createElement('div');
    var wmTooltip = document.createElement('div');

    /* Populating elements */
    wmSvgPath1.setAttribute(
        'd', 'M3.5,0l15.2,0.5c2.9,0.1,4.5,1.2,4,4l-0.9,5.1c-0.1,0.6-0.2,1.1-0.4,1.7c-0.6,' +
        '2.1-7.9-7.4-10-6.8L9.2,18.2l-3.7,1.1c-2.2,0.7-3.1-1-3.3-2.5L0.1,4C-0.3,1.2,0.6-0.1,3.5,0z'
    );
    wmSvgPath2.setAttribute(
        'd', 'M27.3,17.2c-4.7-4.9-9.3-9.5-14.1-13.8h0c-0.2-0.2-0.5-0.3-0.8-0.4c-0.7-0.1-1.6,0.3-2,' +
        '1.3C9.1,7.2,9.2,19.9,9.1,23.8c0,0.6-0.1,1.1,0,1.6c0.7,0,1.9,0.2,2.2,0l3.7-4.3c0.7,1.8,2.2,6,3.2,8.8c0.3,0.7,' +
        '1,1,1.7,0.8c0.8-0.8,5.4-1.9,5.6-1.9c-1.2-2.7-3.9-6.9-4.9-9.8l5.6,0.5c0.3,0.1,0.7-0.5,1-1.1C27.5,18.1,27.6,' +
        '17.6,27.3,17.2z M24.9,18c-1-0.1-3.3-0.3-5.7-0.5l-0.6,0l0.2,0.6l5.1,10c-1.8,0.4-3.2,0.9-4.3,' +
        '1.6c0-0.1-0.1-0.2-0.1-0.3c-0.1-0.2-0.2-0.4-0.2-0.6c-0.1-0.2-0.2-0.4-0.3-0.7c0-0.1-0.1-0.2-0.1-0.2c-0.9-2.' +
        '2-2.1-5.7-3-7.6c-0.3-0.7-0.7-0.9-1-0.8c-0.1,0-0.2,0.1-0.3,0.2c-0.9,1.2-2.3,3.5-2.6,4.1l-1.5-0.4c-0.3-5.8,' +
        '0.5-10.9,1.2-16.9c0.2-1.5,1.3-1.1,2.3-0.7c2.7,3.5,10.9,10.6,11.3,11.6C25.2,17.6,25.3,18,24.9,18z'
    );
    wmTxt.innerText = 'bannersnack';
    wmTooltip.innerText = 'Create banners the Snack way';
    wmSvg.appendChild(wmSvgPath1);
    wmSvg.appendChild(wmSvgPath2);
    wmContainer.appendChild(wmSvg);
    wmContainer.appendChild(wmTxt);

    document.getElementById('bs').appendChild(wmContainer);

    /* Styling elements */
    wmContainer.setAttribute(
        'style', 'background-color: ' + wmSetup.containerBgColor + ';' +
        'bottom: ' + wmSetup.containerDistBottom + ';' +
        'color: ' + wmSetup.contentColor + ';' +
        'cursor: ' + wmSetup.cursor + ';' +
        'fill: ' + wmSetup.contentColor + ';' +
        'font-family: ' + wmSetup.fontFamily + ';' +
        'font-size: ' + wmSetup.fontSize + ';' +
        'font-style: ' + wmSetup.fontStyle + ';' +
        'font-weight: ' + wmSetup.fontWeight + ';' +
        'position: ' + wmSetup.containerPosition + ';' +
        'right: ' + wmSetup.containerDistRight + ';' +
        'z-index: ' + wmSetup.containerZIndex + ';'
    );

    wmSvg.setAttribute('version', '1.1');
    wmSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    wmSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/a999/xlink');
    wmSvg.setAttribute('width', '27');
    wmSvg.setAttribute('height', '31');
    wmSvg.setAttribute('x', '0');
    wmSvg.setAttribute('y', '0');
    wmSvg.setAttribute('viewBox', '0 0 27.6 30.9');
    wmSvg.setAttribute('xml:space', 'preserve');
    wmSvg.setAttribute(
        'style', 'enable-background: new 0 0 27.6, 30.9;' +
        'float: ' + wmSetup.svgFloat + ';' +
        'height: ' + wmSetup.svgSize + ';' +
        'padding: ' + wmSetup.svgPadding + ';' +
        'width: ' + wmSetup.svgSize + ';'
    );

    wmTxt.setAttribute(
        'style', 'float: ' + wmSetup.txtFloat + ';' +
        'padding: ' + wmSetup.txtPadding + ';'
    );

    wmTooltip.setAttribute(
        'style', 'background-color: ' + wmSetup.tooltipBgColor + ';' +
        'bottom: ' + wmTxt.clientHeight + 'px;' +
        'font-size: ' + wmSetup.tooltipFontSize + ';' +
        'filter: alpha(opacity=' + (wmSetup.tooltipOpacity * 100) + ');' +
        'opacity: ' + wmSetup.tooltipOpacity + ';' +
        'padding: ' + wmSetup.tooltipPadding + '; ' +
        'position: ' + wmSetup.tooltipPosition + ';' +
        'right: ' + wmSetup.tooltipDistRight + ';' +
        '-webkit-transition: ' + wmSetup.tooltipTransition + ';' +
        '-moz-transition: ' + wmSetup.tooltipTransition + ';' +
        '-o-transition: ' + wmSetup.tooltipTransition + ';' +
        'transition: ' + wmSetup.tooltipTransition + ';' +
        'white-space: ' + wmSetup.tooltipWhiteSpace + ';'
    );

    this._addClickWatermarkListener(wmContainer);

    wmContainer.addEventListener('mouseenter', function() {
        wmContainer.style.right = wmSetup.containerHoverDistRight;
        wmContainer.appendChild(wmTooltip);
        setTimeout(function() {
            wmTooltip.style.opacity = wmSetup.tooltipHoverOpacity;
        }, 250);
    });

    wmContainer.addEventListener('mouseleave', function() {
        wmContainer.style.right = wmSetup.containerDistRight;
        wmTooltip.parentNode.removeChild(wmTooltip);
        wmTooltip.style.opacity = wmSetup.tooltipOpacity;
        setTimeout(function() {
            wmTooltip.style.opacity = wmSetup.tooltipOpacity;
        }, 250);
    });
};

BannerDisplay.prototype._addClickWatermarkListener = function(el) {
    var self = this;
    el.addEventListener('click', function(ev) {
        var wmLink = '//www.bannersnack.com/?utm_source=freebanner&utm_medium=watermark1&utm_content=' +
            self.properties.width + 'x' + self.properties.height + '&utm_campaign=' + 'BannerSnackEmbed';
        window.open(wmLink, '_blank');
        // if bannerURL is set, go to watermark link only
        ev.stopPropagation();
    });
};

BannerDisplay.prototype.initSlides = function(elements) {

    this.slides = [];

    var i, element, slidesData = [];
    var overflowSlide = {properties: {}, elements: []};

    for (i = 0; element = elements[i]; i++) {
        if (element.type === 'slide') {
            slidesData.push(element);
        } else {
            if (element.properties) {
                element.properties.showOnAllSlides = true;
            }
            overflowSlide.elements.push(element);
        }
    }

    this.overflowSlide = new SlideDisplay();
    this.overflowSlide.isOverflowSlide = true;
    this.overflowSlide.banner = this;
    this.overflowSlide.init(overflowSlide, this.container);

    var slide, slideData;

    for (i = 0; slideData = slidesData[i]; i++) {

        slide = new SlideDisplay();
        slide.banner = this;
        slide.init(slideData, this.container);
        this.slides.push(slide);
    }


};

BannerDisplay.prototype.getWidth = function() {
    return this.properties.width;
};
BannerDisplay.prototype.getHeight = function() {
    return this.properties.height;
};
BannerDisplay.prototype.play = function() {

    this.overflowSlide.render();
    if (this.slides[this.startSlide]) {
        this.slides[this.startSlide].play(null, true);
    }
};

BannerDisplay.prototype.initFonts = function(data) {
    var elements = data && data.elements;
    if (!elements) {
        return false;
    }
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].type == 'slide') {
            this.initFonts(elements[i]);
            continue;
        }
        this.loadFonts(elements[i]);
    }
};

BannerDisplay.prototype.loadFonts = function(element) {
    var attr = element && element.properties;
    if (!attr)
        return false;
    if (attr.labelStyle) {
        this.setFontsToBeLoaded(attr.labelStyle.fontFamily, attr.labelStyle.fontWeight, attr.labelStyle.fontStyle);
    }
    if (attr.fontFamily) {
        this.setFontsToBeLoaded(attr.fontFamily, attr.fontWeight, attr.fontStyle);
    }
    return true;
};

BannerDisplay.prototype.setFontsToBeLoaded = function(fontFamily, fontWeight, fontStyle) {
    if (!fontFamily || !fontWeight || !fontStyle)
        return false;

    if (fontStyle == 'italic')
        fontWeight += 'i';
    if (!this.fontsToLoad[fontFamily]) {
        this.fontsToLoad[fontFamily] = fontWeight + ',';
        return true;
    }

    if (this.fontsToLoad[fontFamily].indexOf(fontWeight) != -1)
        return false;
    this.fontsToLoad[fontFamily] += fontWeight + ',';
    return true;
};

BannerDisplay.prototype.addFontsToDom = function() {
    if (!this.fontsToLoad)
        return false;
    var fonts = [];
    for (var font in this.fontsToLoad) {
        fonts.push([font.replace(/\s/g, '+') + ':' + this.fontsToLoad[font].replace(/\,$/, '')]);
    }
    if (fonts.length != 0) {
        fonts = fonts.join('|');
        var styleTag = this.createElement('link', '');
        styleTag.setAttribute('rel', 'stylesheet');
        styleTag.setAttribute('type', 'text/css');
        styleTag.setAttribute('href', 'https://fonts.googleapis.com/css?family=' + fonts);
        this.container.appendChild(styleTag);
    }
};

BannerDisplay.prototype.createActionProperties = function() {
    // check for click tag in the URL
    var clickTag = eaUtils.getClickTagValue();
    if (!clickTag) {
        // check for click tag in the document
        // check for the click tag in the config
        clickTag = window.clickTag || window.clickTAG || (this.config && this.config.clickTag);
    }
    var act = {
        event: 'click',
        slideOrUrl: "",
        type: 'gotoURL',
        target: "_blank",
        useHandCursor: true
    };
    if (clickTag) {
        act['slideOrUrl'] = eaUtils.addProtocolToUrl(clickTag);
        return act;
    }
    var properties = this.properties;
    if (!properties)
        return false;
    if (!properties.bannerUrl || properties.bannerUrl == 'http://' || properties.bannerUrl == 'https://')
        return false;
    act['slideOrUrl'] = eaUtils.addProtocolToUrl(properties.bannerUrl);
    act['target'] = properties.urlTarget;
    act['useHandCursor'] = properties.useHandCursor;
    return act;
};




/*
// ../../html5-embed/src/js/display/SlideDisplay.js
*/

"use strict";

function SlideDisplay() {


    /**
     * @type {BannerDisplay}
     */
    this.banner = null;
    this.rendered = false;
    this._buildOutTimeout = null;

    this.container = null;
    this.elements = [];
}

SlideDisplay.prototype = new BaseDisplay();
SlideDisplay.prototype.constructor = SlideDisplay;


SlideDisplay.prototype.init = function(data, appendTo) {

    if (!this.isOverflowSlide) {

        var properties = data.properties;
        this.container = this.createElement("div", "slide", true, appendTo);
        this.ah = data.ah;

        properties.duration = parseFloat(properties.duration);
        if (properties.duration < 0.1) {
            properties.duration = 0.1;
        }

        var transition = properties.transition = properties.transition || {type: "none", delay: 0, duration: 0.1};
        this.parseTransition(transition);
        this.applyBackground(this.container, properties.backgroundColor);

        this.reset();
    } else {
        this.container = appendTo;
        this.resetElements();
    }
    if (this.banner.statsPresent) {
        this.banner.stats.trackEvent(this.container, this);
    }

    return BaseDisplay.prototype.init.call(this, data);

};

SlideDisplay.prototype.parseTransition = function(transition) {
    transition.duration = parseFloat(transition.duration) || 0;
    transition.delay = parseFloat(transition.delay) || 0;

    if (transition.type === 'slide') {

        if (!parseInt(transition.slideOffset)) {
            switch (transition.direction) {
                case 'r2l':
                case 'l2r':
                    transition.slideOffset = this.banner.getWidth();
                    break;
                case 't2b':
                case 'b2t':
                    transition.slideOffset = this.banner.getHeight();
                    break;
            }
        }
    }
};

SlideDisplay.prototype.isFirstSlide = function() {
    return this.banner.slides.indexOf(this) === 0;
};

SlideDisplay.prototype.reset = function() {

    eff.clearAll(this.container);

    var containerStyle = this.container.style;
    containerStyle.zIndex = 0;
    containerStyle.width = '100%';
    containerStyle.height = '100%';
    containerStyle.top = '0';
    containerStyle.left = '0';
    containerStyle.filter = "";
    containerStyle['-webkit-filter'] = "";
    containerStyle['animation'] = "";
    containerStyle['-webkit-animation'] = "";

    this.transform('none');
    this.resetElements();
};
SlideDisplay.prototype.resetElements = function() {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].reset();
    }
};

SlideDisplay.prototype.play = function(buildIn, isBannerStartPlay) {
    this.banner.lastSlide = this.banner.currentSlide;
    this.banner.currentSlide = this;
    if (!isBannerStartPlay) {
        this.banner.trigger("changeSlide");
    }
    if (!this.rendered) {
        this.render();
    } else {
        this.reset();
    }
    this.container.style.opacity = 1;
    this.playSlideAnimation(buildIn);
};

SlideDisplay.prototype.render = function() {

    var elementsData = this.displayData.elements;

    var element, i;

    for (i = 0; i < elementsData.length; i++) {
        if (element = this.renderElement(elementsData[i])) {
            this.elements.push(element);
        }
    }

    this.on("buildInStart buildInEnd buildOutStart buildOutEnd", function(ev) {
        for (var i = 0; i < this.elements.length; i++) {
            var evType = 'slide' + ev.type.charAt(0).toUpperCase() + ev.type.substr(1);
            this.elements[i].trigger(evType, this);
        }
    });

    if (!this.isOverflowSlide) {
        this.createElement("div", "slide-hover", true, this.container);
    } else {

        if (!this.banner.noAnimation) {
            for (i = 0; i < this.elements.length; i++) {
                this.elements[i].playAnimation(0);
            }
        }

        this.trigger("buildInStart");
        this.trigger("buildInEnd");

    }

    this.rendered = true;

};

SlideDisplay.prototype.renderElement = function(elementData) {

    var element;
    var elementProperties = elementData.properties;

    var buildIn = elementProperties.buildIn = elementProperties.buildIn || {type: "none", delay: 0, duration: 0};
    var buildOut = elementProperties.buildOut = elementProperties.buildOut || {type: "none", delay: 0, duration: 0};

    function parseBuild(build) {
        build.duration = parseFloat(build.duration) || 0;
        build.delay = parseFloat(build.delay) || 0;

        if (build.type == 'alpha-words' || build.type == 'blur-words') {
            build.duration = Math.max(Number(build.duration), Number(build.wordsDuration));
        }

    }

    parseBuild(buildIn);
    parseBuild(buildOut);

    switch (elementData.layerType) {
        case "text":
            element = new TextDisplay();
            break;
        case "image":
            element = new ImageDisplay();
            break;
        case "clipart":
            element = new ClipartDisplay();
            break;
        case "button":
            element = new ButtonDisplay();
            break;
        case "shape":
            element = new ShapeDisplay();
            break;
        case "youtube":
            element = new YoutubeDisplay();
            break;
        case "embed":
            element = new EmbedDisplay();
            break;
        case "menu":
            element = new MenuDisplay();
            break;
    }


    if (element) {
        element.slide = this;
        var emContainer = element.init(elementData).getContainer();
        this.container.appendChild(emContainer);
        element.render();
        if (this.isOverflowSlide) {
            // le punem peste slide-uri
            element.container.style.zIndex = 10;
            // asta trebuie pentru Chrome, pentru ca la scale, nu mai tine cont de z-index
            element.container.style.webkitTransform = 'translate3d(0, 0, 0)';
        }
    }

    return element;
};

SlideDisplay.prototype.getNextSlide = function(currentSlide) {
    if (!currentSlide) {
        currentSlide = this;
    }
    var slides = this.banner.slides;
    var slideIndex = slides.indexOf(currentSlide);
    if (slideIndex + 1 >= slides.length) {
        return this.banner.slides[0];
    }
    return this.banner.slides[slideIndex + 1];
};

SlideDisplay.prototype.getPrevSlide = function(currentSlide) {
    if (!currentSlide) {
        currentSlide = this;
    }
    var slides = this.banner.slides;
    var slideIndex = slides.indexOf(currentSlide);
    if (slideIndex - 1 < 0) {
        return this.banner.slides[this.banner.slides.length - 1];
    }
    return this.banner.slides[slideIndex - 1];
};

SlideDisplay.prototype.getFirstSlide = function() {
    var slides = this.banner.slides;
    return this.banner.slides[0];
};

SlideDisplay.prototype.getLastSlide = function() {
    var slides = this.banner.slides;
    return this.banner.slides[this.banner.slides.length - 1];
};

SlideDisplay.prototype.playSlideAnimation = function(buildIn) {

    clearTimeout(this._buildOutTimeout);

    var element = this.getAnimationEl(), i;
    var self = this;
    var properties = this.displayData.properties;
    var lastSlideContainer = this.banner.lastSlide ? this.banner.lastSlide.container : null;
    var slidesCount = this.banner.slides.length;

    var buildInDuration = 0;

    var sc;

    for (i = 0; i < this.banner.slides.length; i++) {
        sc = this.banner.slides[i].container;
        sc.style.zIndex = 0;
        sc.style.display = "none";
    }

    this.container.style.display = "";
    this.container.style.zIndex = 1;

    this.trigger("buildInStart");

    if (buildIn && buildIn.type !== "none" && !this.banner.noAnimation && slidesCount > 1) {
        this.addClass(this.container, "buildin");
        buildInDuration = (parseFloat(buildIn.duration) || 0);

        if (lastSlideContainer) {
            lastSlideContainer.style.display = ""
        }

        if (buildIn.crosstype !== "hide") {
            eff.animate(element, buildIn, "buildIn");
        } else {
            // se face buildOut de la lastSlide
            if (lastSlideContainer) {
                lastSlideContainer.style.zIndex = 2;
            }
        }

        setTimeout(function() {
            self.removeClass(self.container, "buildin");
            self.trigger("buildInEnd");
        }, buildIn.duration * 1000);

    } else {
        this.trigger("buildInEnd");
    }

    if (!properties.stopSlide && !this.banner.showOnlyOneSlide) {
        this._buildOutTimeout = setTimeout(function() {
            self.buildOut();
        }, (buildInDuration + properties.duration) * 1000);
    }

    if (!this.banner.noAnimation) {
        for (i = 0; i < this.elements.length; i++) {
            this.elements[i].playAnimation(buildInDuration);
        }
    }
};
SlideDisplay.prototype.buildOut = function(nextSlide) {
    if (this._buildOutTimeout) {
        clearTimeout(this._buildOutTimeout);
    }

    var slidesCount = this.banner.slides.length;
    var transition = this.displayData.properties.transition;
    var self = this;
    self.trigger("buildOutStart");

    var buildOutTriggerTimeout = null;
    if (transition && transition.type !== "none" && slidesCount > 1) {
        self.addClass(self.container, "buildout");
        if (transition.crosstype !== "show") {
            eff.animate(this.getAnimationEl(), eaUtils.cloneObject(transition), "buildOut");
        }
        buildOutTriggerTimeout = setTimeout(function() {
            if (self.banner.currentSlide !== self) {
                self.container.style.display = 'none';
            }
            self.removeClass(self.container, "buildout");
            self.trigger("buildOutEnd");
        }, transition.duration * 1000);
    } else {
        self.trigger("buildOutEnd");
    }
    if (!nextSlide) {
        nextSlide = this.getNextSlide();
    }

    // daca urmatorul slide e tot acelasi sa nu faca trigger la buildOut in timp ce se face buildIn
    if (nextSlide === this && buildOutTriggerTimeout) {
        clearTimeout(buildOutTriggerTimeout);
        self.removeClass(self.container, "buildout");
        self.trigger("buildOutEnd");
    }
    nextSlide.play(eaUtils.cloneObject(transition));
};

SlideDisplay.prototype.getBuildOutTime = function() {
    var transition = this.displayData.properties.transition;
    if (transition && transition.type !== "none") {
        return transition.duration * 1000;
    }
    return 0;
};

SlideDisplay.prototype.getSlideByHash = function(slideHash) {
    if (!slideHash)
        return false;
    var slides = this.banner.slides;
    for (var i = 0; i < slides.length; i++) {
        if (slideHash == slides[i].ah) {
            return slides[i];
        }
    }
    return false;
};




/*
// ../../html5-embed/src/js/EmbedCanvas.js
*/

"use strict";
function EmbedCanvas() {
    EventDispatcher.call(this);
}
EmbedCanvas.prototype = new EventDispatcher();
EmbedCanvas.prototype.constructor = EmbedCanvas;

EmbedCanvas.prototype.init = function(bannerContainer, data, config) {
    this.json = data;
    this.config = config;
    this.banner = new BannerDisplay();

    var statsPresent = !config.preview && !config.download;
    if (statsPresent) {
        var stats = new Stats({
            hash: data.hash,
            userId: data.userId,
            rotatorHash: this.getRotatorHashFromUrl(),
            banner: this.banner,
            currentDomain: document.referrer
        });
        stats.track();
        this.banner.stats = stats;
    }

    this.banner.statsPresent = statsPresent;
    this.banner.init(data.banner, bannerContainer, config);
    this.banner.play();
};

EmbedCanvas.prototype.showWatermark = function(options) {
    if (options.printScreen) {
        this.banner.showImageWatermark();
    } else {
        this.banner.showWatermark();
    }
};

EmbedCanvas.prototype.getRotatorHashFromUrl = function() {
    var rotatorHash = false;
    var queryString = window.location.search;
    if (queryString) {
        var param, vars = queryString.substr(1).split('&');
        for (var i in vars) {
            param = vars[i].split('=', 2);
            if (param[0] == 'rotator_hash') {
                rotatorHash = param[1];
                break;
            }
        }
    }
    return rotatorHash;
};


