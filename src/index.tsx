import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  I18nManager,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import * as Animatable from "react-native-animatable";

interface SmoothPinCodeInputProps {
  value: string;
  codeLength?: number;
  cellSize?: number;
  cellSpacing?: number;
  placeholder?: string | React.ReactElement;
  mask?: string | React.ReactElement;
  maskDelay?: number;
  password?: boolean;
  autoFocus?: boolean;
  restrictToNumbers?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  cellStyle?: StyleProp<ViewStyle>;
  cellStyleFocused?: StyleProp<ViewStyle>;
  cellStyleFilled?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textStyleFocused?: StyleProp<TextStyle>;
  animationFocused?: string | object;
  onFulfill?: (code: string) => void;
  onTextChange?: (text: string) => void;
  onBackspace?: () => void;
  keyboardType?: TextInputProps["keyboardType"];
  editable?: boolean;
  inputProps?: Partial<TextInputProps>;
  testID?: string;
  disableFullscreenUI?: boolean;
}

const styles = StyleSheet.create({
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

const SmoothPinCodeInput: React.FC<SmoothPinCodeInputProps> = ({
  value = "",
  codeLength = 4,
  cellSize = 48,
  cellSpacing = 4,
  placeholder = "",
  password = false,
  mask = "*",
  maskDelay: propMaskDelay = 200,
  keyboardType = "numeric",
  autoFocus = false,
  restrictToNumbers = false,
  containerStyle = styles.containerDefault,
  cellStyle = styles.cellDefault,
  cellStyleFocused = styles.cellFocusedDefault,
  textStyle = styles.textStyleDefault,
  textStyleFocused = styles.textStyleFocusedDefault,
  animationFocused = "pulse",
  editable = true,
  inputProps = {},
  disableFullscreenUI = true,
  onTextChange,
  onFulfill,
  onBackspace,
  testID,
  cellStyleFilled,
}) => {
  const [maskDelay, setMaskDelay] = useState(false);
  const [focused, setFocused] = useState(false);

  const ref = useRef<Animatable.View & View>(null);
  const inputRef = useRef<TextInput>(null);

  const _inputCode = (code: string) => {
    if (restrictToNumbers) {
      code = (code.match(/[0-9]/g) || []).join("");
    }

    onTextChange?.(code);
    if (code.length === codeLength) {
      onFulfill?.(code);
    }

    // handle password mask
    const shouldMaskDelay = password && code.length > value.length;
    setMaskDelay(shouldMaskDelay);

    if (shouldMaskDelay) {
      const maskTimeout = setTimeout(() => {
        setMaskDelay(false);
      }, propMaskDelay);
      return () => clearTimeout(maskTimeout);
    }
  };

  const _keyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (event.nativeEvent.key === "Backspace") {
      if (value === "" && onBackspace) {
        onBackspace();
      }
    }
  };

  return (
    <Animatable.View
      ref={ref}
      style={[
        {
          alignItems: "stretch",
          flexDirection: "row",
          justifyContent: "center",
          position: "relative",
          width: cellSize * codeLength + cellSpacing * (codeLength - 1),
          height: cellSize,
        },
        containerStyle,
      ]}
    >
      <View
        style={{
          position: "absolute",
          margin: 0,
          height: "100%",
          flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
          alignItems: "center",
        }}
      >
        {Array.apply(null, Array(codeLength)).map((_, idx) => {
          const cellFocused = focused && idx === value.length;
          const filled = idx < value.length;
          const last = idx === value.length - 1;
          const showMask = filled && password && (!maskDelay || !last);
          const isPlaceholderText = typeof placeholder === "string";
          const isMaskText = typeof mask === "string";
          const pinCodeChar = value.charAt(idx);

          let cellText: string | null = null;
          if (filled || placeholder !== null) {
            if (showMask && isMaskText) {
              cellText = mask;
            } else if (!filled && isPlaceholderText) {
              cellText = placeholder;
            } else if (pinCodeChar) {
              cellText = pinCodeChar;
            }
          }

          const placeholderComponent = !isPlaceholderText ? placeholder : null;
          const maskComponent = showMask && !isMaskText ? mask : null;
          const isCellText = typeof cellText === "string";

          return (
            <Animatable.View
              key={idx}
              style={[
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
              ]}
              animation={
                idx === value.length && focused ? animationFocused : undefined
              }
              iterationCount="infinite"
              duration={500}
            >
              {isCellText && !maskComponent && (
                <Text style={[textStyle, cellFocused ? textStyleFocused : {}]}>
                  {cellText}
                </Text>
              )}

              {!isCellText && !maskComponent && placeholderComponent}
              {isCellText && maskComponent}
            </Animatable.View>
          );
        })}
      </View>
      <TextInput
        disableFullscreenUI={disableFullscreenUI}
        value={value}
        ref={inputRef}
        onChangeText={_inputCode}
        onKeyPress={_keyPress}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        spellCheck={false}
        autoFocus={autoFocus}
        keyboardType={keyboardType}
        numberOfLines={1}
        caretHidden
        maxLength={codeLength}
        selection={{
          start: value.length,
          end: value.length,
        }}
        style={{
          flex: 1,
          opacity: 0,
          textAlign: "center",
        }}
        testID={testID || undefined}
        editable={editable}
        {...inputProps}
      />
    </Animatable.View>
  );
};

export default SmoothPinCodeInput;
