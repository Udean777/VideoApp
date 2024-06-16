import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React, { useState } from 'react'
import * as Animatable from "react-native-animatable"
import { icons, images } from '../constants'
import { ResizeMode, Video } from 'expo-av';
import videoDummy from '../constants/videos';

interface CustomAnimation {
    0: {
        scale: number;
    };
    1: {
        scale: number;
    };
}

const zoomIn: CustomAnimation = {
    0: {
        scale: 0.9
    },
    1: {
        scale: 1.1
    }
}

const zoomOut: CustomAnimation = {
    0: {
        scale: 1
    },
    1: {
        scale: 0.9
    }
}

const TrendingItem = ({
    activeItem,
    item
}: {
    activeItem: any,
    item: any
}) => {
    const [play, setPlay] = useState(false)

    // console.log(activeItem.$id, item.$id)
    return (
        <Animatable.View
            className='mx-5'
            animation={activeItem === item.$id ? zoomIn as any : zoomOut as any}
            duration={500}
        >
            {play ? (
                <Video
                    source={{ uri: item.video }}
                    className='w-52 h-72 rounded-[35px] mt-3 bg-white/10'
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(status: any) => {
                        if (status.didJustFinish) {
                            setPlay(false)
                        }
                    }} />
            ) : (
                <TouchableOpacity className='relative justify-center items-center' activeOpacity={0.7} onPress={() => setPlay(true)}>
                    <ImageBackground
                        source={{ uri: item.thumbnail }}
                        className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40'
                    />

                    <Image
                        source={icons.play}
                        className='w-12 h-12 absolute'
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            )}
        </Animatable.View>
    )
}

const Trending = ({ posts }: { posts: any[] }) => {
    const [activeItem, setActiveItem] = useState(posts[0])

    const viewableItemsChanged = ({ viewableItems }: { viewableItems: any }) => {
        if (viewableItems.length > 0) {
            setActiveItem(viewableItems[0].key)
        }
    }

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
                <TrendingItem activeItem={activeItem} item={item} />
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70
            }}
            contentOffset={{ x: 170, y: 0 }}
            horizontal
            showsHorizontalScrollIndicator={false}
        />
    )
}

export default Trending