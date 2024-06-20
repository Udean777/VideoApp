import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useState, memo } from 'react';
import useAppwrite from '@/libs/useAppwrite';
import { fetchFollowing, followUser, getAllUsers, unfollowUser } from '@/libs/appWrite';
import { icons } from '@/constants';
import { StatusBar } from 'expo-status-bar';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router, useFocusEffect } from 'expo-router';

const Friends = () => {
    const { data: users, isLoading: usersLoading } = useAppwrite(getAllUsers);
    const { user, followState, updateFollowState } = useGlobalContext();
    const [following, setFollowing] = useState<any>({});
    const [refreshing, setRefreshing] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isProcessing, setIsProcessing] = useState<any>({});

    const loadFollowing = useCallback(async () => {
        if (user?.$id && users) {
            const data = await fetchFollowing(user.$id, users);
            setFollowing(data);
        }
    }, [user?.$id, users]);

    useEffect(() => {
        if (isFocused) {
            loadFollowing();
        }
    }, [isFocused, loadFollowing]);

    useFocusEffect(
        useCallback(() => {
            setIsFocused(true);
            return () => setIsFocused(false);
        }, [])
    );

    useEffect(() => {
        if (Object.keys(following).length > 0) {
            // Update the global follow state without causing infinite loop
            Object.keys(following).forEach((userId) => {
                if (followState[userId] !== following[userId]) {
                    updateFollowState(userId, following[userId]);
                }
            });
        }
    }, [following, followState, updateFollowState]);

    const debounce = (func: any, delay: any) => {
        let timeoutId: any;
        return function (...args: any) {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const toggleFollow = debounce(async (userId: any, followedUserId: any) => {
        if (isProcessing[followedUserId]) return; // Prevent multiple rapid calls

        setIsProcessing((prev: any) => ({ ...prev, [followedUserId]: true }));
        const isFollowing = followState[followedUserId];

        // Optimistically update the following state
        setFollowing((prevFollowing: any) => ({
            ...prevFollowing,
            [followedUserId]: !isFollowing,
        }));
        updateFollowState(followedUserId, !isFollowing);

        try {
            if (isFollowing) {
                await unfollowUser(userId, followedUserId);
            } else {
                await followUser(userId, followedUserId);
            }
        } catch (error) {
            console.error(error);
            // Revert the state if the API call fails
            setFollowing((prevFollowing: any) => ({
                ...prevFollowing,
                [followedUserId]: isFollowing,
            }));
            updateFollowState(followedUserId, isFollowing);
        } finally {
            setIsProcessing((prev: any) => ({ ...prev, [followedUserId]: false }));
        }
    }, 300);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        const newUsers = await getAllUsers();
        await fetchFollowing(user?.$id, newUsers);
        setRefreshing(false);
    }, [user?.$id]);

    const filteredUsers = users?.filter((u: any) => u?.$id !== user?.$id);

    const renderItem = useCallback(
        ({ item }: any) => (
            <TouchableOpacity
                onPress={() => router.navigate(`(details)/${item?.$id}`)}
                className='w-full mb-12'
            >
                <View className='flex-row gap-2 items-center'>
                    <View className='w-16 h-16 border border-gray-600 rounded-full justify-center items-center'>
                        <Image
                            source={{ uri: item?.avatar }}
                            className='w-[90%] h-[90%] rounded-full'
                            resizeMode='cover'
                        />
                    </View>

                    <View className='mt-5' style={{ gap: 10 }}>
                        <Text className={`text-white font-psemibold text-lg`}>
                            {item?.username}
                        </Text>

                        <View className='flex-row gap-2'>
                            <TouchableOpacity
                                onPress={() => toggleFollow(user?.$id, item?.$id)}
                                activeOpacity={0.7}
                                className={`${followState[item?.$id] ? "bg-transparent border-2 border-white" : "bg-secondary border-2 border-secondary"}
                                 rounded-xl py-2 px-10 justify-center items-center`}
                            >
                                {followState[item?.$id] ? (
                                    <Text className={`text-white font-psemibold text-sm`}>Followed</Text>
                                ) : (
                                    <Text className={`text-primary font-psemibold text-sm`}>Follow</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        ),
        [followState, toggleFollow, user?.$id]
    );

    const ListEmptyComponent = memo(() => (
        <View className='flex-1 justify-center items-center'>
            <Image
                source={icons.nocomment}
                className='w-[100px] h-[215px]'
                resizeMode='contain'
                tintColor={'#80C4E9'}
            />
            <Text className='text-xl text-center font-psemibold text-white mt-2'>
                No users found
            </Text>
        </View>
    ));

    if (usersLoading) {
        return (
            <View className='flex-1 justify-center items-center bg-primary'>
                <ActivityIndicator size='large' color='#fff' />
            </View>
        );
    }

    return (
        <View className='flex-1 p-4 bg-primary'>
            <View className='flex-row justify-between items-center'>
                <Text className='text-2xl text-white font-psemibold'>Friends</Text>
                <TouchableOpacity>
                    <Image
                        source={icons.search}
                        className='w-5 h-5'
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item?.$id}
                contentContainerStyle={{ marginTop: 20 }}
                renderItem={renderItem}
                ListEmptyComponent={ListEmptyComponent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />

            <StatusBar backgroundColor='#161622' style='light' />
        </View>
    );
};

export default memo(Friends);
