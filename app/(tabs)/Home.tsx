import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import { getAllOrdinaryPost, getAllPost } from '@/libs/appWrite'
import useAppwrite from '@/libs/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { StatusBar } from 'expo-status-bar'
import Story from '@/components/Story'
import { Ionicons } from '@expo/vector-icons'
import CustomModal from '@/components/CustomModal'
import PostCard from '@/components/PostCard'

const Home = () => {
    const [refreshing, setRefreshing] = useState(false)
    const { data: posts, refetch } = useAppwrite(getAllOrdinaryPost)
    const [modalVisible, setModalVisible] = useState(false)

    const onRefresh = async () => {
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
    }

    // console.log(JSON.stringify(posts, null, 2))

    // const showModal = useCallback(() => {
    //     setModalVisible(true);
    // }, []);

    // const hideModal = useCallback(() => {
    //     setModalVisible(false);
    // }, []);

    return (
        <SafeAreaView className='bg-primary h-full'>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <PostCard posts={item} />
                )}
                ListHeaderComponent={() => (
                    <View className=' px-4 space-y-6'>
                        <View className='justify-between items-center flex-row mb-6'>
                            <View>
                                <Text className='text-3xl font-dcbold text-white'>
                                    SioBlues
                                </Text>
                            </View>

                            {/* <TouchableOpacity
                                style={styles.openButton}
                                onPress={showModal}
                            >
                                <Text style={styles.openButtonText}>Show Modal</Text>
                            </TouchableOpacity> */}

                            <View style={{ gap: 10 }} className='flex-row'>
                                <View>
                                    <Ionicons name='notifications-outline' size={30} color={"#fff"} />
                                </View>

                                <View>
                                    <Ionicons name='chatbubble-ellipses-outline' size={30} color={"#fff"} />
                                </View>
                            </View>
                        </View>

                        <Story />

                        <SearchInput />
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

            {/* <CustomModal
                onClose={hideModal}
                visible={modalVisible}
            /> */}

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

export default Home