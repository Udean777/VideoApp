import { View, Text } from 'react-native'
import React from 'react'

const InfoBox = ({ title, subtitle, containerStyle, titleStyles }: {
    title: any,
    subtitle?: string,
    containerStyle?: any,
    titleStyles?: any,
}) => {
    return (
        <View style={{
            alignItems: "center",
            justifyContent: "center",
            width: 70,
            height: 70
        }}>
            <Text className='font-psemibold text-white text-lg'>{title}</Text>
            <Text className='font-pregular text-white text-sm'>{subtitle}</Text>
        </View>
    )
}

export default InfoBox