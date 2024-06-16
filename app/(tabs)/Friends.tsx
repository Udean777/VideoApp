import { View, Text, TouchableOpacity, Image, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import useAppwrite from '@/libs/useAppwrite'
import { fetchFollowing, followUser, getAllUsers, unfollowUser } from '@/libs/appWrite'
import { icons, images } from '@/constants'
import { StatusBar } from 'expo-status-bar'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'

const Friends = () => {
    const { data: users } = useAppwrite(() => getAllUsers())
    const [following, setFollowing] = useState<any>([])
    const { user } = useGlobalContext()
    const [refreshing, setRefreshing] = useState(false)

    const toggleFollow = useCallback(async (userId: string, followedUserId: string, setFollowing: React.Dispatch<React.SetStateAction<any>>) => {
        if (following[followedUserId]) {
            try {
                await unfollowUser(userId, followedUserId);
                setFollowing((prevFollowing: any) => ({ ...prevFollowing, [followedUserId]: false }));
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                await followUser(userId, followedUserId);
                setFollowing((prevFollowing: any) => ({ ...prevFollowing, [followedUserId]: true }));
            } catch (error) {
                console.error(error);
            }
        }
    }, [following]);

    useEffect(() => {
        fetchFollowing(user?.$id, users).then((data) => setFollowing(data));
    }, [user?.$id, users]);

    const filteredUsers = users.filter((u: { $id: string }) => u?.$id !== user?.$id);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const newUsers = await getAllUsers();
            setFollowing(await fetchFollowing(user?.$id, newUsers));
            setRefreshing(false);
        } catch (error) {
            console.error(error);
            setRefreshing(false);
        }
    }, [user?.$id]);

    return (
        <View className='flex-1 p-4 bg-primary' >
            <View className='flex-row justify-between items-center'>
                <Text className='text-2xl text-white font-psemibold'>Friends</Text>
                <TouchableOpacity>
                    <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item?.$id}
                contentContainerStyle={{ marginTop: 20 }}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push(`(details)/${item?.$id}`)} className='w-full mb-12'>
                        <View className='flex-row gap-2 items-center'>
                            <View className='w-16 h-16 border border-secondary rounded-full justify-center items-center'>
                                <Image
                                    source={{ uri: item?.avatar }}
                                    className='w-[90%] h-[90%] rounded-full'
                                    resizeMode='cover'
                                />
                            </View>

                            <View className='mt-5' style={{ gap: 10 }}>
                                <Text className={`text-white font-psemibold text-lg`}>{item?.username}</Text>

                                <View className='flex-row gap-2'>
                                    <TouchableOpacity
                                        onPress={() => toggleFollow(user?.$id, item?.$id, setFollowing)}
                                        activeOpacity={0.7}
                                        className={`${following[item?.$id] ? "bg-transparent border-2 border-secondary" : "bg-secondary border-2 border-secondary"}
                                             rounded-xl py-2 px-10 justify-center items-center`}
                                    >
                                        {following[item?.$id] ? (
                                            <Text className={`text-secondary font-psemibold text-sm`}>Followed</Text>
                                        ) : (
                                            <Text className={`text-primary font-psemibold text-sm`}>Follow</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                    <View className='flex-1 justify-center items-center'>
                        <Image
                            source={images.empty}
                            className='2-[270px] h-[215px]'
                            resizeMode='contain'
                        />

                        <Text className='text-xl text-center font-psemibold text-white mt-2'>
                            No users found
                        </Text>
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />

            <StatusBar backgroundColor='#161622' style='light' />
        </View>
    )
}

export default Friends