import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import * as ImagePicker from "expo-image-picker"
import { editUser } from '@/libs/appWrite'
import FormField from '@/components/FormField'

const EditProfile = () => {
    const { user, setUser } = useGlobalContext()
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
            setAvatar(user.avatar);
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
                avatar // This should be handled properly to upload and store the new avatar URL.
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
        <View className='flex-1 bg-primary p-4' style={{ gap: 10 }}>
            {avatar ? (
                <View className='self-center w-[100px] h-[100px] rounded-full border border-secondary justify-center items-center p-0.5'>
                    <Image
                        source={{ uri: avatar }}
                        className='w-full h-full rounded-full'
                        resizeMode='contain'
                    />
                </View>
            ) : null}

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
                title="Username"
                value={email}
                handleChangeText={setEmail}
                otherStyles="my-7"
                placeholder='Input email'
                keyboardType={"email-address"}
            />

            <View className='w-full'>
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={loading}
                    className='bg-secondary border-2 border-primary py-2 w-full items-center rounded-lg'>
                    {loading ?
                        <Text className='font-psemibold text-primary'>Saving...</Text> : <Text className='font-psemibold text-primary'>Save Changes</Text>}
                </TouchableOpacity>
            </View>
        </View>
    )
}


export default EditProfile