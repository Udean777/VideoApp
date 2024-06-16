import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '@/components/EmptyState'
import { getAllPost } from '@/libs/appWrite'
import useAppwrite from '@/libs/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'

const Reels = () => {
    const [refreshing, setRefreshing] = useState(false)
    const { data: posts, refetch } = useAppwrite(getAllPost)

    const onRefresh = async () => {
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
    }

    return (
        <SafeAreaView className='bg-primary h-full'>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard video={item} post={item} userId={item.$id} />
                )}
                ListHeaderComponent={() => (
                    <View className=' px-4 space-y-6'>
                        <View className='justify-between items-center flex-row mb-6'>
                            <View>
                                <Text className='text-3xl font-dcbold text-white'>
                                    SioBlues
                                </Text>
                            </View>

                            <View style={{ gap: 10 }} className='flex-row'>
                                <View>
                                    <Ionicons name='notifications-outline' size={30} color={"#fff"} />
                                </View>

                                <View>
                                    <Ionicons name='chatbubble-ellipses-outline' size={30} color={"#fff"} />
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No videos found"
                        subtitle="Be the first one to upload a video"
                    />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />

            <StatusBar backgroundColor='#161622' style='light' />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    openButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#841584',
        borderRadius: 5,
    },
    openButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Reels