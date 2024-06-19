import { View, Text, FlatList, RefreshControl, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import VideoCard from '../VideoCard'
import EmptyState from '../EmptyState'
import useAppwrite from '@/libs/useAppwrite'
import { getFollowers, getFollowings, getUserPosts } from '@/libs/appWrite'
import { icons } from '@/constants'

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
                    <View className='flex-1 justify-center items-center'>
                        <Image
                            source={icons.nocomment}
                            className='w-[100px] h-[215px]'
                            resizeMode='contain'
                            tintColor={"#80C4E9"}
                        />
                        <Text className='text-xl text-center font-psemibold text-white mt-2'>
                            This user doesn't make videos yet
                        </Text>
                    </View>
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </SafeAreaView>
    )
}

export default VideoTabsDetails