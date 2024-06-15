import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import { StatusBar } from 'expo-status-bar'
import useAppwrite from '@/libs/useAppwrite'
import { searchPosts } from '@/libs/appWrite'
import VideoCard from '@/components/VideoCard'

const Search = () => {
    const { query } = useLocalSearchParams<{ query: any }>()
    const { data: posts, refetch } = useAppwrite(() => searchPosts(query))

    // console.log(query, posts)

    useEffect(() => {
        refetch()
    }, [query])

    return (
        <SafeAreaView className='bg-primary h-full'>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard video={item} />
                )}
                ListHeaderComponent={() => (
                    <View className='my-6 px-4'>
                        <Text className='font-pmedium text-sm text-gray-100'>
                            Search Result
                        </Text>

                        <Text className='text-2xl font-psemibold text-white'>
                            {query}
                        </Text>

                        <View className='mt-6 mb-8' />
                        <SearchInput initialQuery={query} />
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

export default Search