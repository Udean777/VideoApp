import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { icons } from '@/constants';
import VideoCard from '@/components/VideoCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import InfoBox from '@/components/InfoBox';
import EmptyState from '@/components/EmptyState';
import { StatusBar } from 'expo-status-bar';
import { followUser, getUserDetails, unfollowUser } from '@/libs/appWrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import useUserDetails from '@/libs/useUserDetails';

const DetailUser = () => {
    const { DetailUser } = useLocalSearchParams<{ DetailUser: any }>();
    const { user: currentUser } = useGlobalContext()
    const { error, followers, following, loading, posts, refetch, toggleFollow, user } = useUserDetails(DetailUser)



    if (loading) {
        return (
            <SafeAreaView className='bg-primary h-full justify-center items-center'>
                <ActivityIndicator size={"large"} color={"#fff"} />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className='bg-primary h-full justify-center items-center'>
                <Text className='text-white'>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className='bg-primary h-full'>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard video={item} post={item} />
                )}
                ListHeaderComponent={() => (
                    <View className='w-full justify-center items-center mb-12 px-4'>
                        <TouchableOpacity
                            className='w-full items-start mb-10'
                            onPress={() => router.back()}
                        >
                            <Image
                                source={icons.leftArrow}
                                resizeMode='contain'
                                className='w-6 h-6'
                            />
                        </TouchableOpacity>

                        <View className='w-16 h-16 border border-secondary rounded-full justify-center items-center'>
                            <Image
                                source={{ uri: user?.avatar }}
                                className='w-[90%] h-[90%] rounded-full'
                                resizeMode='cover'
                            />
                        </View>

                        <View className='mt-5'>
                            <Text className='text-white text-center font-psemibold text-lg'>{user?.username}</Text>
                            <Text className='text-white text-center font-psemibold text-xs'>{user?.email}</Text>
                        </View>

                        <View className='mt-5 flex-row' style={{ gap: 10 }}>
                            <TouchableOpacity
                                onPress={() => toggleFollow(currentUser?.$id, user?.$id)}
                                activeOpacity={0.7}
                                className={`${following[user?.$id] ? "bg-transparent border-2 border-secondary" : "bg-secondary border-2 border-secondary"}
                                       rounded-xl py-2 px-10 justify-center items-center`}
                            >
                                {following[user?.$id] ? (
                                    <Text className={`text-secondary font-psemibold text-sm`}>Followed</Text>
                                ) : (
                                    <Text className={`text-primary font-psemibold text-sm`}>Follow</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity className='bg-primary border-2 border-secondary py-2 flex-1 items-center rounded-lg'>
                                <Text className='font-psemibold text-secondary'>Message</Text>
                            </TouchableOpacity>
                        </View>

                        <View
                            className='mt-5 flex-row w-[100%] items-center justify-center'
                            style={{ gap: 50 }}
                        >
                            <InfoBox
                                title={posts.length || 0}
                                subtitle="Posts"
                                titleStyles="text-xl"
                            />

                            <InfoBox
                                title={following.length || 0}
                                subtitle="Following"
                                titleStyles="text-xl"
                            />

                            <InfoBox
                                title={followers.length || 0}
                                subtitle="Followers"
                                titleStyles="text-xl"
                            />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No videos found"
                        subtitle="No videos found for this query"
                    />
                )}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
            />

            <StatusBar backgroundColor='#161622' style='light' />
        </SafeAreaView>
    );
};

export default DetailUser;
