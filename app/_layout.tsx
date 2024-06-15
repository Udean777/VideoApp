import { useFonts } from 'expo-font';
import { router, SplashScreen, Stack, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import GlobalProvider, { useGlobalContext } from '@/context/GlobalProvider';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
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
    const segments = useSegments();
    const { isLoading, isLoggedIn } = useGlobalContext();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (error) throw error;

        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !fontsLoaded || isLoading) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (isLoggedIn && inAuthGroup) {
            router.replace("/(tabs)/Home");
        } else if (!isLoggedIn && !inAuthGroup) {
            router.replace("/(auth)/SignIn");
        }
    }, [isLoggedIn, isLoading, segments, isMounted, fontsLoaded]);

    if (!fontsLoaded || isLoading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                <ActivityIndicator size={"large"} color={"#000"} />
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen name='(auth)' options={{ headerShown: false }} />
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen name='search/[query]' options={{ headerShown: false }} />
            <Stack.Screen name='(edit)' options={{ headerShown: false }} />
        </Stack>
    );
};

export default function RootLayout() {
    return (
        <GlobalProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <InitialLayout />
            </SafeAreaView>
        </GlobalProvider>
    );
}
