"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var Animatable = __importStar(require("react-native-animatable"));
var styles = react_native_1.StyleSheet.create({
    containerDefault: {},
    cellDefault: {
        borderColor: "gray",
        borderWidth: 1,
    },
    cellFocusedDefault: {
        borderColor: "black",
        borderWidth: 2,
    },
    textStyleDefault: {
        color: "gray",
        fontSize: 24,
    },
    textStyleFocusedDefault: {
        color: "black",
    },
});
var SmoothPinCodeInput = function (_a) {
    var _b = _a.value, value = _b === void 0 ? "" : _b, _c = _a.codeLength, codeLength = _c === void 0 ? 4 : _c, _d = _a.cellSize, cellSize = _d === void 0 ? 48 : _d, _e = _a.cellSpacing, cellSpacing = _e === void 0 ? 4 : _e, _f = _a.placeholder, placeholder = _f === void 0 ? "" : _f, _g = _a.password, password = _g === void 0 ? false : _g, _h = _a.mask, mask = _h === void 0 ? "*" : _h, _j = _a.maskDelay, propMaskDelay = _j === void 0 ? 200 : _j, _k = _a.keyboardType, keyboardType = _k === void 0 ? "numeric" : _k, _l = _a.autoFocus, autoFocus = _l === void 0 ? false : _l, _m = _a.restrictToNumbers, restrictToNumbers = _m === void 0 ? false : _m, _o = _a.containerStyle, containerStyle = _o === void 0 ? styles.containerDefault : _o, _p = _a.cellStyle, cellStyle = _p === void 0 ? styles.cellDefault : _p, _q = _a.cellStyleFocused, cellStyleFocused = _q === void 0 ? styles.cellFocusedDefault : _q, _r = _a.textStyle, textStyle = _r === void 0 ? styles.textStyleDefault : _r, _s = _a.textStyleFocused, textStyleFocused = _s === void 0 ? styles.textStyleFocusedDefault : _s, _t = _a.animationFocused, animationFocused = _t === void 0 ? "pulse" : _t, _u = _a.editable, editable = _u === void 0 ? true : _u, _v = _a.inputProps, inputProps = _v === void 0 ? {} : _v, _w = _a.disableFullscreenUI, disableFullscreenUI = _w === void 0 ? true : _w, onTextChange = _a.onTextChange, onFulfill = _a.onFulfill, onBackspace = _a.onBackspace, testID = _a.testID, cellStyleFilled = _a.cellStyleFilled;
    var _x = (0, react_1.useState)(false), maskDelay = _x[0], setMaskDelay = _x[1];
    var _y = (0, react_1.useState)(false), focused = _y[0], setFocused = _y[1];
    var ref = (0, react_1.useRef)(null);
    var inputRef = (0, react_1.useRef)(null);
    var _inputCode = function (code) {
        if (restrictToNumbers) {
            code = (code.match(/[0-9]/g) || []).join("");
        }
        onTextChange === null || onTextChange === void 0 ? void 0 : onTextChange(code);
        if (code.length === codeLength) {
            onFulfill === null || onFulfill === void 0 ? void 0 : onFulfill(code);
        }
        // handle password mask
        var shouldMaskDelay = password && code.length > value.length;
        setMaskDelay(shouldMaskDelay);
        if (shouldMaskDelay) {
            var maskTimeout_1 = setTimeout(function () {
                setMaskDelay(false);
            }, propMaskDelay);
            return function () { return clearTimeout(maskTimeout_1); };
        }
    };
    var _keyPress = function (event) {
        if (event.nativeEvent.key === "Backspace") {
            if (value === "" && onBackspace) {
                onBackspace();
            }
        }
    };
    return (<Animatable.View ref={ref} style={[
            {
                alignItems: "stretch",
                flexDirection: "row",
                justifyContent: "center",
                position: "relative",
                width: cellSize * codeLength + cellSpacing * (codeLength - 1),
                height: cellSize,
            },
            containerStyle,
        ]}>
      <react_native_1.View style={{
            position: "absolute",
            margin: 0,
            height: "100%",
            flexDirection: react_native_1.I18nManager.isRTL ? "row-reverse" : "row",
            alignItems: "center",
        }}>
        {Array.apply(null, Array(codeLength)).map(function (_, idx) {
            var cellFocused = focused && idx === value.length;
            var filled = idx < value.length;
            var last = idx === value.length - 1;
            var showMask = filled && password && (!maskDelay || !last);
            var isPlaceholderText = typeof placeholder === "string";
            var isMaskText = typeof mask === "string";
            var pinCodeChar = value.charAt(idx);
            var cellText = null;
            if (filled || placeholder !== null) {
                if (showMask && isMaskText) {
                    cellText = mask;
                }
                else if (!filled && isPlaceholderText) {
                    cellText = placeholder;
                }
                else if (pinCodeChar) {
                    cellText = pinCodeChar;
                }
            }
            var placeholderComponent = !isPlaceholderText ? placeholder : null;
            var maskComponent = showMask && !isMaskText ? mask : null;
            var isCellText = typeof cellText === "string";
            return (<Animatable.View key={idx} style={[
                    {
                        width: cellSize,
                        height: cellSize,
                        marginLeft: cellSpacing / 2,
                        marginRight: cellSpacing / 2,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                    cellStyle,
                    cellFocused ? cellStyleFocused : {},
                    filled ? cellStyleFilled : {},
                ]} animation={idx === value.length && focused ? animationFocused : undefined} iterationCount="infinite" duration={500}>
              {isCellText && !maskComponent && (<react_native_1.Text style={[textStyle, cellFocused ? textStyleFocused : {}]}>
                  {cellText}
                </react_native_1.Text>)}

              {!isCellText && !maskComponent && placeholderComponent}
              {isCellText && maskComponent}
            </Animatable.View>);
        })}
      </react_native_1.View>
      <react_native_1.TextInput disableFullscreenUI={disableFullscreenUI} value={value} ref={inputRef} onChangeText={_inputCode} onKeyPress={_keyPress} onFocus={function () { return setFocused(true); }} onBlur={function () { return setFocused(false); }} spellCheck={false} autoFocus={autoFocus} keyboardType={keyboardType} numberOfLines={1} caretHidden maxLength={codeLength} selection={{
            start: value.length,
            end: value.length,
        }} style={{
            flex: 1,
            opacity: 0,
            textAlign: "center",
        }} testID={testID || undefined} editable={editable} {...inputProps}/>
    </Animatable.View>);
};
exports.default = SmoothPinCodeInput;
