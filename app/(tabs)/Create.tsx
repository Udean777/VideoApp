import { View, Text, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { SceneMap, TabBar, TabView } from "react-native-tab-view"
import CreatePost from '@/components/CreateScreenComponents/CreatePost'
import UploadVideo from '@/components/CreateScreenComponents/UploadVideo'
import { SafeAreaView } from 'react-native-safe-area-context'

const Create = () => {
    const layout = Dimensions.get("window")

    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: "post", title: "Create Post" },
        { key: "video", title: "Create Video" },
    ])

    const renderScene = SceneMap({
        post: CreatePost,
        video: UploadVideo,
    });


    return (
        <SafeAreaView className='bg-primary h-full'>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: "#fff" }}
                        style={{ backgroundColor: "#161622" }}
                    />
                )}
            />
        </SafeAreaView>
    )
}

export default Create