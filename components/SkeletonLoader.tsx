import React from 'react';
import { DimensionValue, View, ViewStyle } from 'react-native';

interface SkeletonLoaderProps {
    count?: number;
    width?: DimensionValue;
    height?: number;
    borderRadius?: number;
    marginBottom?: number;
    marginRight?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    count = 1,
    width = '100%',
    height = 20,
    borderRadius = 4,
    marginBottom = 10,
    marginRight = 10,
}) => {
    const skeletons = Array.from({ length: count }, (_, index) => (
        <View
            key={index}
            style={{
                width,
                height,
                borderRadius,
                marginBottom,
                marginRight,
                backgroundColor: '#E0E0E0', // Warna latar belakang skeleton
            }}
        />
    ));

    return <View className='bg-primary'>{skeletons}</View>;
};

export default SkeletonLoader;
