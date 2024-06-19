import { FlatList, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '@/components/EmptyState'
import { StatusBar } from 'expo-status-bar'
import useAppwrite from '@/libs/useAppwrite'
import { getFollowers, getFollowings, getUserOrdinaryPosts } from '@/libs/appWrite'
import { useGlobalContext } from '@/context/GlobalProvider'
import PostCard from './PostCard'

const PostTabsScreen = () => {
    const { user } = useGlobalContext()
    const { data: posts } = useAppwrite(() => getUserOrdinaryPosts(user?.$id))
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
        <SafeAreaView className='bg-primary flex-1'>
            <FlatList
                nestedScrollEnabled={true}
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <PostCard posts={item} />
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No posts found"
                        subtitle="No posts found for this query"
                    />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />

            <StatusBar backgroundColor='#161622' style='light' />

        </SafeAreaView>
    )
}

export default PostTabsScreen