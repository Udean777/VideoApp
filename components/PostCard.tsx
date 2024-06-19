import { View, Text, Image, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { icons } from '../constants'
import { checkIfLiked, deletePost, getVideoLikes, likeVideo, unlikeVideo } from '@/libs/appWrite'
import { useGlobalContext } from '../context/GlobalProvider'
import useAppwrite from '@/libs/useAppwrite'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const PostCard = ({ posts: { $id, title, photo, $collectionId, creator } = {} }: { posts?: any, userId?: any }) => {
    const [liked, setLiked] = useState(false)
    const { user } = useGlobalContext()
    const { data: likes, refetch } = useAppwrite(() => getVideoLikes($id))
    const { accountId, username, avatar } = creator;

    const handleLike = useCallback(async () => {
        if (liked) {
            await unlikeVideo($id, user?.$id);
            setLiked(false);
        } else {
            await likeVideo($id, user?.$id);
            setLiked(true);
        }
    }, [liked, $id, user?.$id]);

    useEffect(() => {
        refetch()
    }, [liked])

    useEffect(() => {
        if ($id) {
            checkIfLiked($id, user?.$id).then((isLiked: any) => setLiked(isLiked));
        }
    }, [$id, user?.$id]);

    const handlePress = (id: string) => {
        console.log('Navigating to user detail with accountId:', id);
        router.navigate(`(details)/${id}`);
    };

    const handleDelete = useCallback(async () => {
        await deletePost($id, $collectionId);
        // navigate back to previous screen or refresh the list
    }, [$id, $collectionId]);

    if (!creator) {
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size={"large"} />
            </View>
        )
    }

    // console.log(creator.$id === user?.$id)

    return (
        <View className='items-center px-4 mb-14'>
            <View className='flex-row gap-3 items-start'>
                <View className='justify-center items-center flex-row flex-1'>
                    <Pressable onPress={() => creator.$id === user?.$id ? router.navigate("Profile") : handlePress(creator.$id)} className='w-[46px] h-[46px] rounded-full border-2 border-gray-600 justify-center items-center p-0.5'>
                        <Image
                            source={{ uri: avatar }}
                            className='w-full h-full rounded-full'
                            resizeMode='contain'
                        />
                    </Pressable>

                    <Pressable onPress={() => creator.$id === user?.$id ? router.navigate("Profile") : handlePress(creator.$id)} className='justify-center flex-1 ml-3 gap-y-1'>
                        <Text className='text-base text-white font-psemibold' numberOfLines={1}>
                            {username}
                        </Text>
                    </Pressable>
                </View>

                <TouchableOpacity className='pt-2'>
                    <Image
                        source={icons.menu}
                        className='w-5 h-5'
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            </View>

            <View
                className='w-full h-[500px] rounded-xl mt-3 relative justify-center items-center'
            >
                <Image
                    source={{ uri: photo }}
                    className="w-full h-full rounded-xl mt-3"
                    resizeMode="cover"
                />
            </View>

            <View style={{
                gap: 10
            }}
                className='flex-row self-start items-center mt-3'>
                <TouchableOpacity
                    activeOpacity={0.7}
                    className='pt-2'
                    onPress={handleLike}
                >
                    <Image
                        source={liked ? icons.liked : icons.like}
                        className='w-8 h-8'
                        resizeMode='contain'
                        tintColor={liked ? "#ee0061" : "#fff"}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.7}
                    className='pt-2'
                // onPress={handleLike}
                >
                    <Ionicons name='chatbubble-outline' size={30} color={"#fff"} />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.7}
                    className='pt-2'
                // onPress={handleLike}
                >
                    <Image
                        source={icons.share}
                        className='w-8 h-8'
                        resizeMode='contain'
                        tintColor={"#fff"}
                    />
                </TouchableOpacity>
            </View>
            <Text className='text-white mt-3 font-psemibold text-sm self-start'>{likes || 0} likes</Text>
            <View className='self-start mt-3'>
                <Text className='text-white font-pregular text-xs' numberOfLines={1}>
                    <Text className='font-pbold text-white text-sm'>{username}</Text>{"  "}{title}
                </Text>
            </View>
        </View>
    )
}

export default PostCard
