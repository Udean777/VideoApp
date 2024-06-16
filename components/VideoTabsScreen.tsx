import { FlatList, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '@/components/EmptyState'
import { StatusBar } from 'expo-status-bar'
import useAppwrite from '@/libs/useAppwrite'
import { getFollowers, getFollowings, getUserPosts } from '@/libs/appWrite'
import VideoCard from '@/components/VideoCard'
import { useGlobalContext } from '@/context/GlobalProvider'

const VideoTabsScreen = () => {
    const { user } = useGlobalContext()
    const { data: posts } = useAppwrite(() => getUserPosts(user?.$id))
    const { refetch: refetchFollowing } = useAppwrite(() => getFollowings(user?.$id))
    const { refetch: refetchFollowers } = useAppwrite(() => getFollowers(user?.$id))
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = async () => {
        setRefreshing(true)
        await refetchFollowers()
        await refetchFollowing()
        setRefreshing(false)
    }

    return (
        <SafeAreaView className='bg-primary h-full'>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard video={item} post={item} />
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No videos found"
                        subtitle="No videos found for this query"
                    />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />

            <StatusBar backgroundColor='#161622' style='light' />

        </SafeAreaView>
    )
}

export default VideoTabsScreen