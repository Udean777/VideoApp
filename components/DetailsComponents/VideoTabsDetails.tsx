import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import VideoCard from '../VideoCard'
import EmptyState from '../EmptyState'
import useAppwrite from '@/libs/useAppwrite'
import { getFollowers, getFollowings, getUserPosts } from '@/libs/appWrite'

const VideoTabsDetails = ({ DetailUser }: { DetailUser: string }) => {
    const { data: postVideos } = useAppwrite(() => getUserPosts(DetailUser));
    const { refetch: refetchFollowing } = useAppwrite(() => getFollowings(DetailUser))
    const { refetch: refetchFollowers } = useAppwrite(() => getFollowers(DetailUser))
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
                nestedScrollEnabled={true}
                data={postVideos}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => <VideoCard video={item} post={item} />}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No videos found"
                        subtitle="No videos found for this query"
                    />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </SafeAreaView>
    )
}

export default VideoTabsDetails