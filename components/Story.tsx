import { ScrollView, FlatList, Image, Pressable } from 'react-native';
import React, { memo, useCallback, useMemo } from 'react';
import useAppwrite from '@/libs/useAppwrite';
import { getAllUsers } from '@/libs/appWrite';

const Story = memo(() => {
    const { data: users } = useAppwrite(() => getAllUsers());

    useMemo(() => {
        getAllUsers()
    }, [users])

    const renderItem = useCallback(({ item }: any) => (
        <Pressable
            key={item.$id}
            className={`w-16 h-16 border border-secondary-100 rounded-full justify-center items-center`}
        >
            <Image
                source={{ uri: item?.avatar }}
                className='w-[90%] h-[90%] rounded-full'
                resizeMode='cover'
            />
        </Pressable>
    ), []);

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FlatList
                data={users}
                keyExtractor={item => item.$id}
                horizontal
                contentContainerStyle={{ gap: 10 }}
                renderItem={renderItem}
            />
        </ScrollView>
    );
});

export default Story;
