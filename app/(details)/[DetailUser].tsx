import { View, Text, TouchableOpacity, Image, Alert, Dimensions, ScrollView } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { icons } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import InfoBox from '@/components/InfoBox';
import { StatusBar } from 'expo-status-bar';
import { useGlobalContext } from '@/context/GlobalProvider';
import useAppwrite from '@/libs/useAppwrite';
import { followUser, getFollowers, getFollowings, getUserDetails, getUserOrdinaryPosts, getUserPosts, unfollowUser } from '@/libs/appWrite';
import PostTabsDetails from '@/components/DetailsComponents/PostTabsDetails';
import VideoTabsDetails from '@/components/DetailsComponents/VideoTabsDetails';

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
    const { data: postVideos } = useAppwrite(getUserPostsMemoized);
    const { data: following } = useAppwrite(getFollowingsMemoized);
    const { data: followers, setData: setFollowers } = useAppwrite(getUserFollowersMemoized);
    const { data: user } = useAppwrite(getUserMemoized);
    const { data: posts } = useAppwrite(getOrdinaryPostMemoized);

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
        <View className='w-full justify-center items-center mb-5 px-4 '>
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

    return (
        <SafeAreaView className='bg-primary h-full'>
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
            <StatusBar backgroundColor='#161622' style='light' />
        </SafeAreaView>
    );
};

export default DetailUser;
