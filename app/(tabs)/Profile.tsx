import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '@/components/EmptyState'
import { StatusBar } from 'expo-status-bar'
import useAppwrite from '@/libs/useAppwrite'
import { getFollowers, getFollowings, getUserPosts, signOut } from '@/libs/appWrite'
import VideoCard from '@/components/VideoCard'
import { useGlobalContext } from '@/context/GlobalProvider'
import { icons } from '@/constants'
import InfoBox from '@/components/InfoBox'

const Profile = () => {
    const { user, setUser, setIsLoggedIn } = useGlobalContext()
    const { data: posts } = useAppwrite(() => getUserPosts(user?.$id))
    const { data: following, refetch: refetchFollowing } = useAppwrite(() => getFollowings(user?.$id))
    const { data: followers, refetch: refetchFollowers } = useAppwrite(() => getFollowers(user?.$id))

    const onLogout = async () => {
        await signOut()
        setUser(null)
        setIsLoggedIn(false)

        router.replace("/SignIn")
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
            />

            <StatusBar backgroundColor='#161622' style='light' />

        </SafeAreaView>
    )
}

export default Profile