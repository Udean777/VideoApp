import { View, Text, TouchableOpacity, Image, FlatList, RefreshControl, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { icons } from '@/constants';
import VideoCard from '@/components/VideoCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import InfoBox from '@/components/InfoBox';
import EmptyState from '@/components/EmptyState';
import { StatusBar } from 'expo-status-bar';
import { useGlobalContext } from '@/context/GlobalProvider';
import useAppwrite from '@/libs/useAppwrite';
import { followUser, getFollowers, getFollowings, getUserDetails, getUserPosts, unfollowUser } from '@/libs/appWrite';

const DetailUser = () => {
    const { DetailUser } = useLocalSearchParams<{ DetailUser: any }>();
    const { user: currentUser } = useGlobalContext();
    const { data: posts, isLoading: postsLoading, refetch: refetchPosts } = useAppwrite(() => getUserPosts(DetailUser));
    const { data: following, refetch: refetchFollowing } = useAppwrite(() => getFollowings(DetailUser));
    const { data: followers, refetch: refetchFollowers, setData: setFollowers } = useAppwrite(() => getFollowers(DetailUser));
    const { data: user, refetch: refetchUser } = useAppwrite(() => getUserDetails(DetailUser));
    const [isFollowing, setIsFollowing] = useState(false);

    const checkIfFollowing = useCallback(() => {
        const isFollowingUser = followers.some((f: any) => f === currentUser?.$id);
        setIsFollowing(isFollowingUser);
    }, [followers, currentUser?.$id]);

    useEffect(() => {
        checkIfFollowing();
    }, [followers, checkIfFollowing]);

    const toggleFollow = useCallback(async () => {
        if (isFollowing) {
            try {
                await unfollowUser(currentUser?.$id, DetailUser);
                setFollowers((prevFollowers: any) => prevFollowers.filter((f: any) => f !== currentUser?.$id));
                setIsFollowing(false);
            } catch (error: any) {
                Alert.alert("Error", error.message);
            }
        } else {
            try {
                await followUser(currentUser?.$id, DetailUser);
                setFollowers((prevFollowers: any) => [...prevFollowers, currentUser?.$id]);
                setIsFollowing(true);
            } catch (error: any) {
                Alert.alert("Error", error.message);
            }
        }
    }, [isFollowing, currentUser?.$id, DetailUser, setFollowers]);

    const onRefresh = useCallback(() => {
        refetchPosts();
        refetchFollowing();
        refetchFollowers();
        refetchUser();
    }, [refetchPosts, refetchFollowing, refetchFollowers, refetchUser]);

    // console.log("is following", isFollowing)

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
                                onPress={toggleFollow}
                                activeOpacity={0.7}
                                className={`${isFollowing ? "bg-transparent border-2 border-secondary" : "bg-secondary border-2 border-secondary"}
                                             rounded-xl py-2 px-10 justify-center items-center`}
                            >
                                {isFollowing ? (
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
                refreshControl={<RefreshControl refreshing={postsLoading} onRefresh={onRefresh} />}
            />

            <StatusBar backgroundColor='#161622' style='light' />
        </SafeAreaView>
    );
};

export default DetailUser;
