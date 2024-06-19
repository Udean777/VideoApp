import { View, Text, Dimensions, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState, useCallback, useMemo, memo, useRef, useDebugValue } from 'react';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostTabsScreen from '@/components/PostTabsScreen';
import VideoTabsScreen from '@/components/VideoTabsScreen';
import { icons, images } from '@/constants';
import InfoBox from '@/components/InfoBox';
import { useGlobalContext } from '@/context/GlobalProvider';
import { editUser, getFollowers, getFollowings, getUserOrdinaryPosts, getUserPosts, signOut } from '@/libs/appWrite';
import useAppwrite from '@/libs/useAppwrite';
import { router } from 'expo-router';
import * as ImagePicker from "expo-image-picker"
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import CustomButton from '@/components/CustomButton';

const Profile = () => {
    const layout = Dimensions.get("window");
    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const [coverPhoto, setCoverPhoto] = useState("")
    const [loading, setLoading] = useState(false)
    const bottomSheetRef = useRef<BottomSheetMethods>(null)

    const snapPoints = useMemo(() => ["1%", "50%"], [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [10, 6],
            quality: 1,
        });

        if (!result.canceled) {
            setCoverPhoto(result.assets[0].uri)
            bottomSheetRef.current?.expand()
        }
    };

    const handleSave = async () => {
        if (!coverPhoto) {
            return Alert.alert("You didn't insert an image yet!");
        }

        setLoading(true)
        try {
            const newUserData = {
                cover_photo: coverPhoto
            }

            const updatedUser = await editUser(user.accountId, newUserData)

            setUser(updatedUser)
            Alert.alert("Successfully updated cover photo")
        } catch (error: any) {
            console.error("Error updating cover photo", error)
        } finally {
            setCoverPhoto(coverPhoto)
            setLoading(false)
            bottomSheetRef.current?.close()
        }
    }

    // Memoized API calls
    const getUserPostsMemoized = useCallback(() => getUserPosts(user?.$id), [user?.$id]);
    const getUserOrdinaryPostsMemoized = useCallback(() => getUserOrdinaryPosts(user?.$id), [user?.$id]);
    const getFollowingsMemoized = useCallback(() => getFollowings(user?.$id), [user?.$id]);
    const getFollowersMemoized = useCallback(() => getFollowers(user?.$id), [user?.$id]);

    // Data fetching with useAppwrite
    const { data: postVideos, isLoading: postVideosLoading } = useAppwrite(getUserPostsMemoized);
    const { data: posts, isLoading: postsLoading } = useAppwrite(getUserOrdinaryPostsMemoized);
    const { data: following, refetch: refetchFollowing, isLoading: followingLoading } = useAppwrite(getFollowingsMemoized);
    const { data: followers, refetch: refetchFollowers, isLoading: followersLoading } = useAppwrite(getFollowersMemoized);

    // State variables
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "post", title: "Post" },
        { key: "video", title: "Video" },
    ]);

    // Logout function
    const onLogout = useCallback(async () => {
        await signOut();
        setUser(null);
        setIsLoggedIn(false);
        router.replace("/SignIn");
    }, [setUser, setIsLoggedIn]);

    // Render scene
    const renderScene = useCallback(
        SceneMap({
            post: PostTabsScreen,
            video: VideoTabsScreen,
        }),
        []
    );

    // Render tab bar
    const renderTabBar = useCallback((props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#fff" }}
            style={{ backgroundColor: "#161622" }}
        />
    ), []);

    // console.log(user.cover_photo)

    // Header component
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
                        onPress={onLogout}
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
                <TouchableOpacity
                    onPress={pickImage}
                    className='bg-primary/80 p-2 rounded-full items-end justify-end absolute top-[75%] right-4'
                >
                    <Image
                        source={icons.photo}
                        resizeMode='contain'
                        className='w-5 h-5'
                        tintColor={"#fff"}
                    />
                </TouchableOpacity>
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

                    <TouchableOpacity
                        onPress={() => router.navigate(`EditProfile`)}
                        className='bg-primary border-2 border-white h-9 px-3 justify-center items-center rounded-full'>
                        <Text className='font-psemibold text-white text-sm'>Edit Profile</Text>
                    </TouchableOpacity>
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

                <View
                    className='mb-2 flex-row w-[100%] items-center justify-center'
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
        </View>
    ));

    const isLoading = useMemo(() => postVideosLoading || postsLoading || followingLoading || followersLoading, [postVideosLoading, postsLoading, followingLoading, followersLoading]);

    return (
        <SafeAreaView className='bg-primary h-full'>
            {isLoading ? (
                <View className='flex-1 justify-center items-center bg-primary'>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                    <Header />

                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        renderTabBar={renderTabBar}
                        style={{ height: layout.height }}
                    />
                </ScrollView>
            )}

            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                backdropComponent={(backdropProps) => (
                    <BottomSheetBackdrop
                        {...backdropProps}
                        enableTouchThrough={true}
                    />
                )}
                enablePanDownToClose={true}
                backgroundStyle={{ backgroundColor: "#161622" }}
                handleIndicatorStyle={{ backgroundColor: "#fff" }}
            >
                <BottomSheetView>
                    <Text className='text-white font-bold text-xl'>Are you sure you want to save it?</Text>

                    <CustomButton
                        title={loading ? "Publishing..." : "Publish"}
                        handlePress={handleSave}
                        containerStyle={"my-7"}
                        isLoading={loading}
                    />
                </BottomSheetView>
            </BottomSheet>
        </SafeAreaView>
    );
};

export default Profile;
