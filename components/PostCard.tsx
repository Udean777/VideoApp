import { View, Text, Image, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { icons } from '../constants'
import { checkIfLiked, getVideoLikes, likeVideo, unlikeVideo } from '@/libs/appWrite'
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
        // console.log('Navigating to user detail with accountId:', id);
        router.navigate(`(details)/${id}`);
    };

    if (!creator) {
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size={"large"} />
            </View>
        )
    }

    return (
        <View className='items-center px-4 py-5'>
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
                // onPress={handleBottomSheetOpen}
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

            {/* <BottomSheet
                ref={bottomCommentRef}
                snapPoints={snapPoints}
                backdropComponent={(backdropProps) => (
                    <BottomSheetBackdrop
                        {...backdropProps}
                        enableTouchThrough={true}
                    />
                )}
                enablePanDownToClose={true}
                backgroundStyle={{ backgroundColor: "#161622" }}
                handleIndicatorStyle={{ backgroundColor: "#fff" }}
            >
                <BottomSheetView className='h-full'>
                    <View className="h-full">
                        <ScrollView className="px-4 pt-6">
                            {comments?.map((c: any) => (
                                <View key={c.$id} className="flex-row items-center mb-4">
                                    <Image
                                        source={{ uri: c.creator.avatar }}
                                        className="w-10 h-10 rounded-full mr-4"
                                    />
                                    <View>
                                        <Text className="text-white font-pbold text-base">{c.creator.username || "unknown"}</Text>
                                        <Text className="text-white font-pregular text-sm">{c.content || 0}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                        <View className="bg-gray-800 p-4">
                            <View className="flex-row items-center mb-2">
                                <Image
                                    source={{ uri: user?.avatar }}
                                    className="w-10 h-10 rounded-full mr-4"
                                />
                                <TextInput
                                    value={comment}
                                    onChangeText={setComment}
                                    placeholder="Add a comment..."
                                    className="flex-1 bg-transparent text-white"
                                />
                            </View>
                            <TouchableOpacity onPress={handleSendComment} className="w-full">
                                <Text className="text-center text-gray-400">Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheetView>
            </BottomSheet> */}
        </View>
    )
}

export default PostCard
