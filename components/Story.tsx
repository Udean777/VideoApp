import { ScrollView, FlatList, Image, Pressable, View, ActivityIndicator } from 'react-native';
import React, { useCallback } from 'react';
import useAppwrite from '@/libs/useAppwrite';
import { getAllUsers } from '@/libs/appWrite';
import SkeletonLoader from './SkeletonLoader';

const Story = () => {
    const { data: users, isLoading } = useAppwrite(getAllUsers);

    const renderItem = useCallback(({ item }: any) => (
        <Pressable
            key={item.$id}
            className="w-16 h-16 border border-secondary-100 rounded-full justify-center items-center"
        >
            <Image
                source={{ uri: item?.avatar }}
                className="w-[90%] h-[90%] rounded-full"
                resizeMode="cover"
            />
        </Pressable>
    ), []);

    const renderSkeleton = () => (
        <View style={{ flexDirection: 'row', padding: 16 }}>
            <SkeletonLoader count={1} width={64} height={64} borderRadius={32} marginRight={10} />
            <SkeletonLoader count={1} width={64} height={64} borderRadius={32} marginRight={10} />
            <SkeletonLoader count={1} width={64} height={64} borderRadius={32} marginRight={10} />
            <SkeletonLoader count={1} width={64} height={64} borderRadius={32} marginRight={10} />
            <SkeletonLoader count={1} width={64} height={64} borderRadius={32} marginRight={10} />
        </View>
    );

    if (isLoading) {
        return renderSkeleton();
    }

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
};

export default React.memo(Story);
