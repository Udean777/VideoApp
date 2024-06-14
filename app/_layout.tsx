import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import GlobalProvider from '../context/GlobalProvider';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded, error] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    });

    useEffect(() => {
        if (error) throw error;

        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    if (!fontsLoaded) {
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size={"large"} />
            </View>
        )
    }

    if (!fontsLoaded && !error) {
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size={"large"} />
            </View>
        )
    }

    return (
        <GlobalProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Stack>
                    <Stack.Screen name='index' options={{
                        headerShown: false
                    }} />

                    <Stack.Screen name='(auth)' options={{
                        headerShown: false
                    }} />

                    <Stack.Screen name='(tabs)' options={{
                        headerShown: false
                    }} />

                    <Stack.Screen name='search/[query]' options={{
                        headerShown: false
                    }} />
                </Stack>
            </SafeAreaView>
        </GlobalProvider>
    );
}
