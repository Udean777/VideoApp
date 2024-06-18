import { View, Text, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostTabsScreen from '@/components/PostTabsScreen';
import VideoTabsScreen from '@/components/VideoTabsScreen';
import { icons } from '@/constants';
import InfoBox from '@/components/InfoBox';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getFollowers, getFollowings, getUserOrdinaryPosts, getUserPosts, signOut } from '@/libs/appWrite';
import useAppwrite from '@/libs/useAppwrite';
import { router } from 'expo-router';

const Profile = () => {
    const layout = Dimensions.get("window");
    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const { data: postVideos } = useAppwrite(() => getUserPosts(user?.$id));
    const { data: posts } = useAppwrite(() => getUserOrdinaryPosts(user?.$id));
    const { data: following } = useAppwrite(() => getFollowings(user?.$id));
    const { data: followers } = useAppwrite(() => getFollowers(user?.$id));

    const onLogout = async () => {
        await signOut();
        setUser(null);
        setIsLoggedIn(false);
        router.replace("/SignIn");
    };

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "post", title: "Post" },
        { key: "video", title: "Video" },
    ]);

    const renderScene = SceneMap({
        post: PostTabsScreen,
        video: VideoTabsScreen,
    });

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#fff" }}
            style={{ backgroundColor: "#161622" }}
        />
    );

    const renderHeader = () => (
        <View className='w-full justify-center items-center mb-5 px-4'>
            <TouchableOpacity
                className='w-full items-end mb-10'
                onPress={onLogout}
            >
                <Image
                    source={icons.logout}
                    resizeMode='contain'
                    className='w-6 h-6'
                />
            </TouchableOpacity>

            <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
                <Image
                    source={{ uri: user?.avatar }}
                    className='w-[90%] h-[90%] rounded-lg'
                    resizeMode='cover'
                />
            </View>

            <View className='mt-5'>
                <Text className={`text-white text-center font-psemibold text-lg`}>{user?.username}</Text>
                <Text className={`text-white text-center font-psemibold text-xs`}>{user?.email}</Text>
            </View>

            <View className='mt-5 w-full'>
                <TouchableOpacity
                    onPress={() => router.navigate(`EditProfile`)}
                    className='bg-primary border-2 border-secondary py-2 w-full items-center rounded-lg'>
                    <Text className='font-psemibold text-secondary'>Edit Profile</Text>
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
    );

    return (
        <SafeAreaView className='bg-primary h-full'>
            <ScrollView showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}>
                {renderHeader()}

                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={renderTabBar}
                    style={{ height: layout.height }}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
