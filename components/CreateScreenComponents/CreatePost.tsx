import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import FormField from '../FormField';
import { icons } from '@/constants';
import CustomButton from '../CustomButton';
import { createPost } from '@/libs/appWrite';
import { router } from 'expo-router';
import * as ImagePicker from "expo-image-picker"
import { useGlobalContext } from '@/context/GlobalProvider';

const CreatePost = () => {
    const [formPost, setFormPost] = useState<any>({
        title: "",
        photo: null,
    });
    const [uploading, setUploading] = useState(false);
    const { user } = useGlobalContext();

    const openPicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [7, 10],
            quality: 1
        });

        if (!result.canceled) {
            setFormPost({ ...formPost, photo: result.assets[0] });
        }
    };

    const onSubmit = async () => {
        if (!formPost.title || !formPost.photo) {
            return Alert.alert("Please fill in all the fields");
        }

        setUploading(true);

        try {
            await createPost({
                ...formPost, userId: user.$id
            });

            Alert.alert("Success", "Post uploaded successfully");
            router.push("/Home");
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setFormPost({
                title: "",
                photo: null,
            });
            setUploading(false);
        }
    };

    return (
        <ScrollView className='px-4 mt-7'>
            <Text className='text-2xl text-white font-psemibold'>
                Create Post
            </Text>

            <FormField
                title='Post Title'
                value={formPost.title}
                placeholder='Give your post a catchy title...'
                handleChangeText={(e) => setFormPost({ ...formPost, title: e })}
                otherStyles={"mt-10"}
            />

            <View className='mt-7 space-y-2'>
                <Text className='text-base text-gray-100 font-pmedium'>
                    Photo
                </Text>

                <TouchableOpacity onPress={openPicker}>
                    {formPost.photo ? (
                        <Image
                            source={{ uri: formPost.photo.uri }}
                            resizeMode='cover'
                            className='w-full h-96 rounded-2xl'
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

            <CustomButton
                title={uploading ? "Publishing..." : "Publish"}
                handlePress={onSubmit}
                containerStyle={"my-7"}
                isLoading={uploading}
            />
        </ScrollView>
    );
}

export default CreatePost