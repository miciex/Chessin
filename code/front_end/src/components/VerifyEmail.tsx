import { View } from "react-native";
import React from "react";
import AuthInput from "../features/authentication/components/AuthInput";
import { notValidEmailMessage } from "../utils/Constants";

type Props = {
  onChange: (value: string) => void;
  value: string;
  isValid: boolean;
  validateEmail: () => void;
};

export default function VerifyEmail({
  onChange,
  value,
  isValid,
  validateEmail,
}: Props) {
  return (
    <View>
      <AuthInput
        placeholder="email"
        value={value}
        isValid={isValid}
        notValidText={notValidEmailMessage}
        onSubmitEditing={validateEmail}
        onChange={onChange}
      />
    </View>
  );
}
