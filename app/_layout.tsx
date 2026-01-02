// import { Stack } from "expo-router";
// import { AuthProvider } from "../auth-context";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { PaperProvider } from "react-native-paper";
// export default function RootLayout() {
//   return (
//     <SafeAreaProvider>
//       <AuthProvider>
//       {/* <PaperProvider> */}
//         <Stack
//           screenOptions={{
//             headerShown: false, 
//             headerBackButtonDisplayMode:"minimal",     
//           }}
//         />
//           {/* </PaperProvider> */}
//       </AuthProvider>
//     </SafeAreaProvider>
//   );
// }
// app/_layout.js or RootLayout.js
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthProvider } from "../auth-context";
import { theme } from "../theme/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false ,
             headerBackButtonDisplayMode:"minimal",  
          }} />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
