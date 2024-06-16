import { View, Text, Alert, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router';
import { createVideo } from '@/libs/appWrite';
import * as ImagePicker from "expo-image-picker"
import { useGlobalContext } from '@/context/GlobalProvider';
import FormField from '../FormField';
import { ResizeMode, Video } from 'expo-av';
import CustomButton from '../CustomButton';
import { icons } from '@/constants';

const UploadVideo = () => {
    const [form, setForm] = useState<any>({
        title: "",
        video: null,
        thumbnail: null,
        prompt: ""
    });
    const [uploading, setUploading] = useState(false);
    const { user } = useGlobalContext()

    const openPicker = async (selectType: any) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: selectType === "image" ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.canceled) {
            if (selectType === "image") {
                setForm({ ...form, thumbnail: result.assets[0] });
            }

            if (selectType === "video") {
                setForm({ ...form, video: result.assets[0] });
            }
        }
    };

    const onSubmit = async () => {
        if (!form.prompt || !form.title || !form.thumbnail || !form.video) {
            return Alert.alert("Please fill in all the fields");
        }

        setUploading(true);

        try {
            await createVideo({
                ...form, userId: user.$id
            });

            Alert.alert("Success", "Video uploaded successfully");
            router.push("/Reels");
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setForm({
                title: "",
                video: null,
                thumbnail: null,
                prompt: ""
            });
            setUploading(false);
        }
    };

    return (
        <ScrollView className='px-4 mt-7'>
            <Text className='text-2xl text-white font-psemibold'>
                Upload Video
            </Text>

            <FormField
                title='Video Title'
                value={form.title}
                placeholder='Give your video a catchy title...'
                handleChangeText={(e) => setForm({ ...form, title: e })}
                otherStyles={"mt-10"}
            />

            <View className='mt-7 space-y-2'>
                <Text className='text-base text-gray-100 font-pmedium'>Upload Video</Text>

                <TouchableOpacity onPress={() => openPicker("video")}>
                    {form.video ? (
                        <Video
                            source={{ uri: form.video.uri }}
                            className='w-full h-64 rounded-2xl'
                            resizeMode={ResizeMode.CONTAIN}
                        />
                    ) : (
                        <View className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>
                            <View className='w-14 h-14 border border-dashed border-secondary justify-center items-center'>
                                <Image
                                    source={icons.upload}
                                    className='w-1/2 h-1/2'
                                    resizeMode='contain'
                                />
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <View className='mt-7 space-y-2'>
                <Text className='text-base text-gray-100 font-pmedium'>
                    Thumbnail Image
                </Text>

                <TouchableOpacity onPress={() => openPicker("image")}>
                    {form.thumbnail ? (
                        <Image
                            source={{ uri: form.thumbnail.uri }}
                            resizeMode='cover'
                            className='w-full h-64 rounded-2xl'
                        />
                    ) : (
                        <View className='w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 
                        border-black-200 flex-row space-x-2'>
                            <Image
                                source={icons.upload}
                                className='w-5 h-5'
                                resizeMode='contain'
                            />
                            <Text className='text-sm text-gray-100 font-pmedium'>
                                Choose a file
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <FormField
                title='AI Prompt'
                value={form.prompt}
                placeholder='The prompt you use to create this video'
                handleChangeText={(e) => setForm({ ...form, prompt: e })}
                otherStyles={"mt-7"}
            />

            <CustomButton
                title={uploading ? "Publishing..." : "Publish"}
                handlePress={onSubmit}
                containerStyle={"my-7"}
                isLoading={uploading}
            />
        </ScrollView>
    );
}

export default UploadVideo