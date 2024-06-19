import { View, Text, TouchableOpacity, Image, Alert, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { icons, images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import InfoBox from '@/components/InfoBox';
import { StatusBar } from 'expo-status-bar';
import { useGlobalContext } from '@/context/GlobalProvider';
import useAppwrite from '@/libs/useAppwrite';
import { followUser, getFollowers, getFollowings, getUserDetails, getUserOrdinaryPosts, getUserPosts, unfollowUser } from '@/libs/appWrite';
import PostTabsDetails from '@/components/DetailsComponents/PostTabsDetails';
import VideoTabsDetails from '@/components/DetailsComponents/VideoTabsDetails';
import { Ionicons } from '@expo/vector-icons';

const DetailUser = () => {
    const { DetailUser } = useLocalSearchParams<{ DetailUser: any }>();
    const { user: currentUser } = useGlobalContext();
    const layout = Dimensions.get('window');

    // Memoized functions
    const getUserPostsMemoized = useCallback(() => getUserPosts(DetailUser), [DetailUser]);
    const getFollowingsMemoized = useCallback(() => getFollowings(DetailUser), [DetailUser]);
    const getUserFollowersMemoized = useCallback(() => getFollowers(DetailUser), [DetailUser]);
    const getUserMemoized = useCallback(() => getUserDetails(DetailUser), [DetailUser]);
    const getOrdinaryPostMemoized = useCallback(() => getUserOrdinaryPosts(DetailUser), [DetailUser]);

    // Appwrite API calls
    const { data: postVideos, isLoading: postVideosLoading } = useAppwrite(getUserPostsMemoized);
    const { data: following, isLoading: followingLoading } = useAppwrite(getFollowingsMemoized);
    const { data: followers, setData: setFollowers, isLoading: followersLoading } = useAppwrite(getUserFollowersMemoized);
    const { data: user, isLoading: userLoading } = useAppwrite(getUserMemoized);
    const { data: posts, isLoading: postsLoading } = useAppwrite(getOrdinaryPostMemoized);

    // State variables
    const [isFollowing, setIsFollowing] = useState(false);
    const [index, setIndex] = useState(0);

    // Memoized components
    const PostTabsDetailsMemoized = memo(PostTabsDetails);
    const VideoTabsDetailsMemoized = memo(VideoTabsDetails);

    // Check if following
    const checkIfFollowingMemoized = useCallback(() => {
        const isFollowingUser = followers.some((f: any) => f === currentUser?.$id);
        setIsFollowing(isFollowingUser);
    }, [followers, currentUser?.$id]);

    useEffect(() => {
        checkIfFollowingMemoized();
    }, [followers, checkIfFollowingMemoized]);

    // Toggle follow
    const toggleFollow = useCallback(async () => {
        if (isFollowing) {
            try {
                await unfollowUser(currentUser?.$id, DetailUser);
                setFollowers((prevFollowers: any) => prevFollowers.filter((f: any) => f !== currentUser?.$id));
                setIsFollowing(false);
            } catch (error: any) {
                Alert.alert('Error', error.message);
            }
        } else {
            try {
                await followUser(currentUser?.$id, DetailUser);
                setFollowers((prevFollowers: any) => [...prevFollowers, currentUser?.$id]);
                setIsFollowing(true);
            } catch (error: any) {
                Alert.alert('Error', error.message);
            }
        }
    }, [isFollowing, currentUser?.$id, DetailUser, setFollowers]);

    // Routes and render scene
    const routes = useMemo(() => [
        { key: 'post', title: 'Post' },
        { key: 'video', title: 'Video' },
    ], []);

    const renderSceneMemoized = useCallback(
        SceneMap({
            post: () => <PostTabsDetailsMemoized DetailUser={DetailUser} />,
            video: () => <VideoTabsDetailsMemoized DetailUser={DetailUser} />,
        }),
        [DetailUser]
    );

    // Render tab bar
    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#fff' }}
            style={{ backgroundColor: '#161622' }}
        />
    );

    const Header = memo(() => (
        <View>
            <View className='h-44'>
                {user?.cover_photo ? (
                    <Image
                        source={{ uri: user?.cover_photo }}
                        className='w-[100%] h-[100%] absolute top-0 left-0'
                        resizeMode='cover'
                    />
                ) : (
                    <Image
                        source={icons.nocomment}
                        className='w-[100%] h-[100%] absolute top-0 left-0 bottom-0 right-0'
                        resizeMode='contain'
                        tintColor={"#80C4E9"}
                    />
                )}

                <View className='flex-row justify-between items-center px-4 mt-2'>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className='bg-primary/80 p-2 rounded-full'
                    >
                        <Image
                            source={icons.leftArrow}
                            resizeMode='contain'
                            className='w-5 h-5'
                            tintColor={"#fff"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        // onPress={onLogout}
                        className='bg-primary/80 p-2 rounded-full items-center justify-center'
                    >
                        <Image
                            source={icons.menu}
                            resizeMode='contain'
                            className='w-5 h-5'
                            tintColor={"#fff"}
                        />
                    </TouchableOpacity>

                </View>
            </View>

            <View className='px-4'>
                <View className='flex-row justify-between items-center'>
                    <View className='w-20 h-20 bg-primary border-2 border-gray-600 rounded-full justify-center items-center relative bottom-10'>
                        <Image
                            source={{ uri: user?.avatar }}
                            className='w-[90%] h-[90%] rounded-full'
                            resizeMode='cover'
                        />
                    </View>

                    <View className='flex-row items-center' style={{ gap: 10 }}>
                        <TouchableOpacity
                            onPress={() => router.navigate(`EditProfile`)}>
                            <Ionicons name='chatbubble-ellipses-outline' size={30} color={"#fff"} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={toggleFollow}
                            activeOpacity={0.7}
                            className={`${isFollowing ? "bg-transparent border-2 border-white" : "bg-secondary border-2 border-secondary"}
                                 rounded-xl py-2 px-10 justify-center items-center`}
                        >
                            {isFollowing ? (
                                <Text className={`text-white font-psemibold text-sm`}>Followed</Text>
                            ) : (
                                <Text className={`text-primary font-psemibold text-sm`}>Follow</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View className='relative bottom-5' style={{ gap: 10 }}>
                    <Text className={`text-white font-pbold text-xl`}>{user?.username}</Text>
                    <Text className={`text-white font-psemibold text-xs`}>{user?.email}</Text>

                    {user?.bio ? (
                        <View>
                            <Text className={`text-white font-pregular text-xs`}>{user?.bio}</Text>
                        </View>
                    ) : (
                        <View>
                            <Text className={`text-white font-pregular text-xs`}>You don't have bio, create it now!</Text>
                        </View>
                    )}
                </View>


            </View>

            <View
                className='mt-5 flex-row w-[100%] items-center justify-center'
                style={{ gap: 50 }}
            >
                <InfoBox
                    title={postVideos.length + posts.length || 0}
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
    ))

    const isLoading = useMemo(() => postVideosLoading || followingLoading || followersLoading || userLoading || postsLoading, [postVideosLoading, followingLoading, followersLoading, userLoading, postsLoading]);

    return (
        <SafeAreaView className='bg-primary h-full'>
            {isLoading ? (
                <View className='flex-1 justify-center items-center'>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            ) : (
                <ScrollView className='flex-grow' nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                    <Header />

                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderSceneMemoized}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        renderTabBar={renderTabBar}
                        style={{ height: layout.height }}
                    />
                </ScrollView>
            )}
            <StatusBar backgroundColor='#161622' style='light' />
        </SafeAreaView>
    );
};

export default DetailUser;
