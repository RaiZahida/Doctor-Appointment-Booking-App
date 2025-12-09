import { Stack } from "expo-router";
import { AuthProvider } from "../auth-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
      {/* <PaperProvider> */}
        <Stack
          screenOptions={{
            headerShown: false, 
            headerBackButtonDisplayMode:"minimal",     
          }}
        />
          {/* </PaperProvider> */}
      </AuthProvider>
    </SafeAreaProvider>
  );
}
