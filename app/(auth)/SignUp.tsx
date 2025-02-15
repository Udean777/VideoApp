import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser } from '../../lib/appWrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignUp = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { setUser, setIsLoggedIn } = useGlobalContext()

    const onSubmit = async () => {
        if (!form.username || !form.email || !form.password) {
            Alert.alert("Error", "Please fill in all the fields")
        }

        setIsSubmitting(true)

        try {
            const result = await createUser(form.email, form.password, form.username)
            setUser(result)
            setIsLoggedIn(true)

            router.replace("/Home")
        } catch (error: any) {
            Alert.alert("Error", error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <SafeAreaView className='bg-primary h-full'>
            <ScrollView>
                <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
                    <Image
                        source={images.logo}
                        resizeMode='contain'
                        className='w-[115px] h-[35px]'
                    />

                    <Text className='text-2xl text-white mt-10 font-psemibold'>Sign Up to Aora</Text>

                    <FormField
                        title="Username"
                        value={form.username}
                        handleChangeText={(e) => setForm({ ...form, username: e })}
                        otherStyles="mt-10"
                        placeholder='Input username'
                    />

                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                        placeholder='Input email'
                    />

                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                        placeholder='Input password'
                    />

                    <CustomButton
                        title={isSubmitting ? 'Creating user...' : 'Sign Up'}
                        handlePress={onSubmit}
                        containerStyle="mt-7"
                        isLoading={isSubmitting}
                    />

                    <View className='justify-center pt-5 flex-row gap-2'>
                        <Text className='text-lg text-gray-100 font-pregular'>
                            Already have account?
                        </Text>
                        <Link href={"/SignIn"}
                            className='text-lg font-psemibold text-secondary'>
                            Sign In
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUp