import { useEffect, useState, useCallback } from 'react';
import { getUserDetails, followUser, unfollowUser } from '@/libs/appWrite';
import { Alert } from 'react-native';

const useUserDetails = (userId: string) => {
    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [followers, setFollowers] = useState<string[]>([]);
    const [following, setFollowing] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserDetails = useCallback(async () => {
        setLoading(true);
        try {
            const userDetails = await getUserDetails(userId);
            setUser(userDetails);
            setPosts(userDetails.posts);
            setFollowers(userDetails.followers);
            const followingState = userDetails.followings.reduce((acc: any, id: string) => {
                acc[id] = true;
                return acc;
            }, {});
            setFollowing(followingState);
        } catch (error) {
            console.error('Error fetching user details:', error);
            setError('User not found');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchUserDetails();
        } else {
            setError('Invalid user ID');
            setLoading(false);
        }
    }, [userId, fetchUserDetails]);

    const toggleFollow = useCallback(async (currentUserId: string, followedUserId: string) => {
        if (following[followedUserId]) {
            try {
                await unfollowUser(currentUserId, followedUserId);
                setFollowing((prevFollowing) => ({ ...prevFollowing, [followedUserId]: false }));
                setFollowers((prevFollowers) => prevFollowers.filter((id) => id !== followedUserId));
            } catch (error) {
                console.error('Error unfollowing user:', error);
                Alert.alert('Error', 'Unable to unfollow the user.');
            }
        } else {
            try {
                await followUser(currentUserId, followedUserId);
                setFollowing((prevFollowing) => ({ ...prevFollowing, [followedUserId]: true }));
                setFollowers((prevFollowers) => [...prevFollowers, followedUserId]);
            } catch (error) {
                console.error('Error following user:', error);
                Alert.alert('Error', 'Unable to follow the user.');
            }
        }
    }, [following]);

    const refetch = useCallback(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    return { user, posts, followers, following, loading, error, toggleFollow, refetch };
};

export default useUserDetails;
