import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
    const [loaded] = useFonts({
        SFProRoundedRegular: require('../../assets/fonts/SFProRounded-Regular.ttf'),
        SFProRoundedSemibold: require('../../assets/fonts/SFProRounded-Semibold.ttf'),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <ThemeProvider value={DarkTheme}>
            <Stack>
                <Stack.Screen name='index' />
            </Stack>
            <StatusBar style='auto' />
        </ThemeProvider>
    );
}
