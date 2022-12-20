/* sovrn_stndalne_beacon v0.0.1 
Updated : 2020-04-07 */
window.sovrn = window.sovrn || {}, sovrn.auction = sovrn.auction || {};
let beaconFlag = !1,
    cmpVersion = 0;
sovrn.auction = {
    doNotTrack: function(n, t) {
        n = n || navigator, t = t || window;
        var e = sovrn.auction.readCookie("tracking_optout");
        return "yes" === n.doNotTrack || "1" === n.doNotTrack || "1" === n.msDoNotTrack || "1" === t.doNotTrack || "1" === e
    },
    readCookie: function(n) {
        for (var t = n + "=", e = document.cookie.split(";"), o = 0; o < e.length; o++) {
            for (var a = e[o];
                " " === a.charAt(0);) a = a.substring(1, a.length);
            if (0 === a.indexOf(t)) return a.substring(t.length, a.length)
        }
        return null
    },
    sendBeacon: function() {
        sovrn.auction.beaconConfig = sovrn.auction.getParams(sovrn.auction.getScriptTag());
        try {
            var n;
            if (beaconFlag) return !1;
            "sovrn_beacon", (n = sovrn.auction.createiFrame("sovrn_beacon", 1, 1)).src = sovrn.auction.getBeaconURL(), document.body.appendChild(n), beaconFlag = !0
        } catch (n) {
            return !1
        }
        return !0
    },
    getParams: function(n) {
        var t, e, o = n.getAttribute("id"),
            a = document.getElementById(o);
        return null != a && (currentTagSRC = a.src, e = {}, (t = (t = currentTagSRC.split("?")[1] || "").split("#")[0] || "") ? (t.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), (function(n, t, o, a) {
            try {
                e[t] = decodeURIComponent(a)
            } catch (n) {
                sovrn.ads.dbg(n)
            }
        })), e.currentTag = o, e.location = a.parentNode.nodeName, e) : {})
    },
    getScriptTag: function() {
        var n, t, e, o = /^(https?:)?\/\/.*\.lijit\.(com|dev)\/www\/sovrn_beacon_standalone\/sovrn_standalone_beacon(\.min)?\.js/i;
        if ("currentScript" in document && (e = document.currentScript) && o.test(e.src)) return e;
        for (t = (n = document.getElementsByTagName("script")).length - 1; t >= 0; t--)
            if (o.test(n[t].src)) return n[t];
        return null
    },
    createiFrame: function(n, t, e) {
        var o, a, r, c, s, i;
        for (r in a = (o = document.createElement("iframe")).style, i = {
                margin: "0px",
                padding: "0px",
                border: "0px none",
                width: t + "px",
                height: e + "px",
                overflow: "hidden"
            }, s = {
                id: n,
                margin: "0",
                padding: "0",
                frameborder: "0",
                width: t + "",
                height: e + "",
                scrolling: "no",
                src: "about:blank"
            }) s.hasOwnProperty(r) && o.setAttribute(r, s[r]);
        for (c in i)
            if (i.hasOwnProperty(c)) try {
                a[c] = i[c]
            } catch (n) {}
        return o
    },
    getBeaconURL: function() {
        return "https://ap.lijit.com/beacon?informer=" + (sovrn.auction.beaconConfig.hasOwnProperty("iid") ? sovrn.auction.beaconConfig.iid : "") + "&gdpr_consent=" + (sovrn.auction.gdprConsent || "") + "&us_privacy=" + (sovrn.auction.ccpaConsent || "")
    },
    sovrnReady: function(n) {
        /in/.test(document.readyState) ? setTimeout((function() {
            sovrn.auction.sovrnReady(n)
        }), 50) : n()
    },
    configureGdprAndCcpaConsent: function() {
        const n = this;
        n.lookupIabConsent((function(t) {
            sovrn.auction.gdprConsent = 1 === cmpVersion ? t.getConsentData.consentData : t.tcString, n.configureCcpa()
        }), (function(t) {
            n.configureCcpa()
        }))
    },
    configureCcpa: function() {
        const n = this;
        this.lookupCcpaConsent((function(t) {
            sovrn.auction.ccpaConsent = t.uspData, n.sendBeacon()
        }), (function(t) {
            n.sendBeacon()
        }))
    },
    callCmpFromSafeframe: function(n, t, e, o) {
        window.$sf.ext.register(1, 1, (function(n, a) {
            "cmpReturn" === n ? e(a[t]) : o()
        })), window.$sf.ext.cmp(n)
    },
    cmpCallbacks: {},
    callCmpWhileInIframe: function(n, t, e, o) {
        const a = 2 === cmpVersion ? "__tcfapi" : "__cmp",
            r = Math.random().toString(),
            c = `${a}Call`,
            s = {
                [c]: {
                    command: n,
                    parameter: null,
                    callId: r
                }
            };
        1 !== cmpVersion && (s[c].version = cmpVersion), sovrn.auction.cmpCallbacks[r] = e, t.postMessage(s, "*"), window.addEventListener("message", (function(n) {
            const t = `${a}Return`;
            let e = {};
            try {
                e = "string" == typeof n.data ? JSON.parse(n.data) : n.data
            } catch (n) {}
            if (e[t] && e[t].callId) {
                const n = e[t];
                "function" == typeof sovrn.auction.cmpCallbacks[n.callId] ? sovrn.auction.cmpCallbacks[n.callId](n.returnValue, n.success) : o("Callback must be function type.")
            }
        }), !1)
    },
    lookupIabConsent: function(n, t) {
        function e(e, o) {
            o && "string" == typeof e.tcString ? "tcloaded" === e.eventStatus || "useractioncomplete" === e.eventStatus || "cmpuishown" === e.eventStatus && e.tcString.length > 0 && !0 === e.purposeOneTreatment ? n(e) : t("Consent string is not available.") : t("CMP unable to register callback function.  Please check CMP setup.")
        }
        const o = function() {
                const e = {};

                function o() {
                    e.getConsentData && e.getVendorConsents ? n(e) : !e.hasOwnProperty("getConsentData") || !e.hasOwnProperty("getVendorConsents") || e.getConsentData && e.getVendorConsents || t("Consent string is blank.")
                }
                return {
                    consentDataCallback: function(n) {
                        e.getConsentData = n, o()
                    },
                    vendorConsentsCallback: function(n) {
                        e.getVendorConsents = n, o()
                    }
                }
            }(),
            {
                cmpFrame: a,
                cmpFunction: r
            } = function() {
                let n, t, e = window;
                for (; !n;) {
                    try {
                        if ("function" == typeof e.__tcfapi || "function" == typeof e.__cmp) {
                            "function" == typeof e.__tcfapi ? (cmpVersion = 2, t = e.__tcfapi) : (cmpVersion = 1, t = e.__cmp), n = e;
                            break
                        }
                    } catch (n) {}
                    try {
                        if (e.frames.__tcfapiLocator) {
                            cmpVersion = 2, n = e;
                            break
                        }
                    } catch (n) {}
                    try {
                        if (e.frames.__cmpLocator) {
                            cmpVersion = 1, n = e;
                            break
                        }
                    } catch (n) {}
                    if (e === window.top) break;
                    e = e.parent
                }
                return {
                    cmpFrame: n,
                    cmpFunction: t
                }
            }();
        if (!a) return t("CMP not found.");
        "function" == typeof r ? 1 === cmpVersion ? (r("getConsentData", null, o.consentDataCallback), r("getVendorConsents", null, o.vendorConsentsCallback)) : 2 === cmpVersion && r("addEventListener", cmpVersion, e) : 1 === cmpVersion && window.$sf && window.$sf.ext && "function" == typeof window.$sf.ext.cmp ? (this.callCmpFromSafeframe("getConsentData", o.consentDataCallback, t), this.callCmpFromSafeframe("getVendorConsents", o.vendorConsentsCallback, t)) : 1 === cmpVersion ? (this.callCmpWhileInIframe("getConsentData", a, o.consentDataCallback, t), this.callCmpWhileInIframe("getVendorConsents", a, o.vendorConsentsCallback, t)) : 2 === cmpVersion && this.callCmpWhileInIframe("addEventListener", a, e, t)
    },
    lookupCcpaConsent: function(n, t) {
        var e, o = {
            uspData: "",
            success: !1
        };
        try {
            e = window.__uspapi || window.top.__uspapi
        } catch (n) {
            t(n)
        }
        if ("function" == typeof e) e("getUSPData", 1, (function(e, a) {
            o.uspData = e && e.uspString || "", o.success = a, a ? n(o) : t()
        }));
        else {
            for (var a, r = window, c = (new Date).getTime(); !a;) {
                try {
                    r.frames.__uspapiLocator && (a = r)
                } catch (n) {
                    return void t(n)
                }
                if (r === window.top) return void t();
                r = r.parent
            }
            var s = {
                __uspapiCall: {
                    command: "getUSPData",
                    version: 1,
                    parameter: null,
                    callId: c
                }
            };
            a.postMessage(s, "*"), window.addEventListener("message", (function(e) {
                e.data && e.data.__uspapiReturn && e.data.__uspapiReturn.callId === c && (e.data.__uspapiReturn.success ? n(e.data.__uspapiReturn.returnValue) : t())
            }), !1)
        }
    }
}, sovrn.auction.sovrnReady((function() {
    !1 === sovrn.auction.doNotTrack() && sovrn.auction.configureGdprAndCcpaConsent()
}));