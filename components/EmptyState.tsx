import { View, Text, Image } from 'react-native'
import React from 'react'
import { icons, images } from '../constants'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const EmptyState = ({ title, subtitle }: { title: string, subtitle?: string }) => {
    return (
        <View className='justify-center items-center px-4'>
            <Image
                source={icons.nocomment}
                className='w-[100px] h-[215px]'
                resizeMode='contain'
                tintColor={"#80C4E9"}
            />

            <Text className='text-xl text-center font-psemibold text-white'>
                {title}
            </Text>

            <Text className='font-pmedium text-sm text-gray-100'>
                {subtitle}
            </Text>

            <CustomButton
                title='Create Post'
                handlePress={() => router.push("/Create")}
                containerStyle={"w-full my-5"}
            />
        </View>
    )
}

export default EmptyState