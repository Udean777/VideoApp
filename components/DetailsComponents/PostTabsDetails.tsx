import { View, Text, FlatList, RefreshControl, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '../PostCard';
import useAppwrite from '@/libs/useAppwrite';
import { getFollowers, getFollowings, getUserOrdinaryPosts } from '@/libs/appWrite';
import { icons } from '@/constants';


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
                    <View className='flex-1 justify-center items-center'>
                        <Image
                            source={icons.nocomment}
                            className='w-[100px] h-[215px]'
                            resizeMode='contain'
                            tintColor={"#80C4E9"}
                        />
                        <Text className='text-xl text-center font-psemibold text-white mt-2'>
                            This user doesn't make a post yet
                        </Text>
                    </View>
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </SafeAreaView>
    )
}

export default PostTabsDetails