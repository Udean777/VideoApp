import { View, Text } from 'react-native'
import React from 'react'
import InfoBox from './InfoBox';

const UserStats = ({ posts, following, followers }: { posts?: any, following?: any, followers?: any }) => {
    return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text className='text-white font-psemibold text-xl'>1</Text>
            <Text className='text-white font-psemibold text-xl'>1</Text>
            <Text className='text-white font-psemibold text-xl'>1</Text>
        </View>
    );
}

export default UserStats;