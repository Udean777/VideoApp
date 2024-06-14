import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons, images } from '../constants'
import { ResizeMode, Video } from 'expo-av'
import { checkIfLiked, getVideoLikes, likeVideo, unlikeVideo } from '../lib/appWrite'
import { useGlobalContext } from '../context/GlobalProvider'

const VideoCard = ({ video: { id, title, thumbnail, video, creator: { username, avatar } }, post }: { video: any, post?: any }) => {
    const [play, setPlay] = useState(false)
    const [liked, setLiked] = useState(false)
    const { user } = useGlobalContext()
    const [likes, setLikes] = useState(0);

    const handleLike = async () => {
        if (liked) {
            await unlikeVideo(post.$id, user.$id)
            setLiked(false);
        } else {
            await likeVideo(post.$id, user.$id)
            setLiked(true);
        }

    }

    useEffect(() => {
        if (post) {
            getVideoLikes(post.$id).then((likes) => setLikes(likes));
            checkIfLiked(post.$id, user.$id).then((isLiked) => setLiked(isLiked));
        }
    }, [post, user.$id]);

    // console.log(likesCount)

    return (
        <View className='flex-col items-center px-4 mb-14'>
            <View className='flex-row gap-3 items-start'>
                <View className='justify-center items-center flex-row flex-1'>
                    <View className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5'>
                        <Image
                            source={{ uri: avatar }}
                            className='w-full h-full rounded-lg'
                            resizeMode='contain'
                        />
                    </View>

                    <View className='justify-center flex-1 ml-3 gap-y-1'>
                        <Text className='text-white font-psemibold text-sm' numberOfLines={1}>
                            {title}
                        </Text>
                        <Text className='text-xs text-gray-100 font-pregular' numberOfLines={1}>
                            {username}
                        </Text>
                    </View>
                </View>

                <View className='pt-2'>
                    <Image
                        source={icons.menu}
                        className='w-5 h-5'
                        resizeMode='contain'
                    />
                </View>
            </View>

            {play ? (
                <Video
                    source={{ uri: video }}
                    className='w-full h-60 rounded-xl mt-3 '
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(status: any) => {
                        if (status.didJustFinish) {
                            setPlay(false)
                        }
                    }} />
            ) : <TouchableOpacity
                activeOpacity={0.7}
                className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'
                onPress={() => setPlay(true)}
            >
                <Image
                    source={{ uri: thumbnail }}
                    className="w-full h-full rounded-xl mt-3"
                    resizeMode="cover"
                />

                <Image
                    source={icons.play}
                    className='w-12 h-12 absolute'
                    resizeMode='contain'
                />
            </TouchableOpacity>
            }

            <View style={{
                flexDirection: "row",
                alignSelf: "flex-start",
                alignItems: "center",
                gap: 10
            }}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    className='pt-2'
                    onPress={handleLike}
                >
                    <Image
                        source={liked ? icons.liked : icons.like}
                        className='w-10 h-10'
                        resizeMode='contain'
                        tintColor={"#fff"}
                    />
                </TouchableOpacity>
                <Text className='text-white font-psemibold text-lg'>{likes || 0} likes</Text>
            </View>
        </View>
    )
}

export default VideoCard