import { Text, View } from 'react-native';

export default function Home() {
    return (
        <View className='flex-1 items-center justify-center'>
            <Text
                className='text-2xl text-red-900'
                style={{ fontFamily: 'SFProRoundedSemibold' }}
            >
                Home
            </Text>
        </View>
    );
}
