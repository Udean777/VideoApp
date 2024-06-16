import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { icons } from '../../constants';
import { useGlobalContext } from '@/context/GlobalProvider';

const TabIcon = ({ icon, color, name, focused }: { icon: any; color: string; name: string; focused: any }) => {
    return (
        <View className='items-center justify-center gap-2'>
            <Image
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className='w-6 h-6'
            />
        </View>
    )
}

const TabsLayout = () => {
    const { user } = useGlobalContext()
    return (
        < >
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: "#ffa001",
                    tabBarInactiveTintColor: "#cdcde0",
                    tabBarStyle: {
                        backgroundColor: "#161622",
                        borderTopWidth: 1,
                        borderTopColor: "#232533",
                        height: 84
                    }
                }}
            >
                <Tabs.Screen
                    name='Home'
                    options={{
                        title: "Home",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.home}
                                color={color}
                                focused={focused}
                                name='Home'
                            />
                        )
                    }}
                />

                <Tabs.Screen
                    name='Friends'
                    options={{
                        title: "Friends",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.friends}
                                color={color}
                                focused={focused}
                                name='Friends'
                            />
                        )
                    }}
                />

                <Tabs.Screen
                    name='Create'
                    options={{
                        title: "Create",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.plus}
                                color={color}
                                focused={focused}
                                name='Create'
                            />
                        )
                    }}
                />

                <Tabs.Screen
                    name='Profile'
                    options={{
                        title: "Profile",
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View className={`w-8 h-8 border ${focused ? "border-secondary" : "border-primary"} rounded-full justify-center items-center`}>
                                <Image
                                    source={{ uri: user?.avatar }}
                                    className='w-[90%] h-[90%] rounded-full'
                                    resizeMode='cover'
                                />
                            </View>
                        )
                    }}
                />
            </Tabs>
        </>
    )
}

export default TabsLayout