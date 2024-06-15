import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const EditLayout = () => {
    return (
        <Stack>
            <Stack.Screen name='EditProfile' options={{
                headerShown: false
            }} />
        </Stack>
    )
}

export default EditLayout