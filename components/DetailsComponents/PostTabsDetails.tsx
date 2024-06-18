import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '../PostCard';
import EmptyState from '../EmptyState';
import useAppwrite from '@/libs/useAppwrite';
import { getFollowers, getFollowings, getUserOrdinaryPosts } from '@/libs/appWrite';


const PostTabsDetails = ({ DetailUser }: { DetailUser: string }) => {
    const { data: posts } = useAppwrite(() => getUserOrdinaryPosts(DetailUser));
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
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => <PostCard posts={item} />}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No posts found"
                        subtitle="No posts found for this query"
                    />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </SafeAreaView>
    )
}

export default PostTabsDetails