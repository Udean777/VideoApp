import { View, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import * as ImagePicker from "expo-image-picker"
import { editUser } from '@/libs/appWrite'
import FormField from '@/components/FormField'
import { icons } from '@/constants'

const EditProfile = () => {
    const { user, setUser } = useGlobalContext()
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(false);
    const [bio, setBio] = useState('');

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
            setAvatar(user.avatar);
            setBio(user.bio);
        }
    }, [user]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [6, 6],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const newUserData = {
                username,
                email,
                avatar,
                bio
            };

            const updatedUser = await editUser(user.accountId, newUserData);
            setUser(updatedUser);
            router.back();
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View className='flex-1 bg-primary p-4' style={{ gap: 10 }}>
                    <View className='flex-row items-center justify-between'>
                        <TouchableOpacity
                            className='items-start mb-10'
                            onPress={() => router.back()}
                        >
                            <Image
                                source={icons.leftArrow}
                                resizeMode='contain'
                                className='w-6 h-6'
                                tintColor={"#fff"}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className='items-start mb-10'
                            onPress={handleSave}
                            disabled={loading}
                        >
                            <Image
                                source={icons.check}
                                resizeMode='contain'
                                className='w-6 h-6'
                                tintColor={loading ? "#333" : "#fff"}
                            />
                        </TouchableOpacity>
                    </View>

                    {avatar ? (
                        <View className='self-center w-[100px] h-[100px] rounded-full border border-secondary justify-center items-center p-0.5'>
                            <Image
                                source={{ uri: avatar }}
                                className='w-full h-full rounded-full'
                                resizeMode='cover'
                            />
                        </View>
                    ) : (
                        <View className='self-center w-[100px] h-[100px] rounded-full border border-secondary justify-center items-center p-0.5'>
                            <Image
                                source={icons.placeholder}
                                className='w-full h-full rounded-full'
                                resizeMode='cover'
                            />
                        </View>
                    )}

                    <View className='mt-5 w-full'>
                        <TouchableOpacity
                            onPress={pickImage}
                            className='bg-primary border-2 border-secondary py-2 w-full items-center rounded-lg'>
                            <Text className='font-psemibold text-secondary'>Edit Profile Picture</Text>
                        </TouchableOpacity>
                    </View>

                    <FormField
                        title="Username"
                        value={username}
                        handleChangeText={setUsername}
                        otherStyles="mt-7"
                        placeholder='Input username'
                    />

                    <FormField
                        title="Email"
                        value={email}
                        handleChangeText={setEmail}
                        otherStyles="mt-7"
                        placeholder='Input email'
                        keyboardType={"email-address"}
                    />

                    <FormField
                        title="Bio"
                        value={bio}
                        handleChangeText={setBio}
                        otherStyles="my-7"
                        placeholder='Input bio'
                    />

                    {/* <View className='w-full'>
                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={loading}
                            className='bg-secondary border-2 border-primary py-2 w-full items-center rounded-lg'>
                            {loading ?
                                <Text className='font-psemibold text-primary'>Saving...</Text> : <Text className='font-psemibold text-primary'>Save Changes</Text>}
                        </TouchableOpacity>
                    </View> */}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}


export default EditProfile