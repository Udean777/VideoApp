import { Account, Avatars, Client, Databases, ID, ImageGravity, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.sajudin.aora",
    projectId: "666abdf50013a7f48e4a",
    databaseId: "666abf190015a08ab38c",
    userCollectionId: "666abf320024035e6682",
    videCollectionId: "666abf630013566ab484",
    storageId: "666ac0a100083240281e",
    likesCollectionId: "666bd6f1000b51feb223",
    followsCollectionId: "666c4a8e002680e2571b"
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videCollectionId,
    storageId,
    likesCollectionId,
    followsCollectionId,
} = config

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(endpoint) // Your Appwrite Endpoint
    .setProject(projectId) // Your project ID
    .setPlatform(platform) // Your application ID or bundle ID.
    ;

const account = new Account(client);
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)

// Register User
export const createUser = async (email: string, password: string, username: string) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if (!newAccount) throw Error

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)

        const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            })

        return newUser
    } catch (error: any) {
        console.error(error)
        throw new Error(error)
    }
}

// Fungsi login
export async function signIn(email: string, password: string) {
    try {
        const session = await account.createEmailPasswordSession(email, password)

        return session
    } catch (error: any) {
        throw new Error(error)
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error: any) {
        throw new Error(error);
    }
}

// Fetch user sekarang
export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get()

        if (!currentAccount) throw Error

        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        )

        if (!currentUser) throw Error

        return currentUser.documents[0]
    } catch (error) {
        console.error(error)
    }
}

export const getAllUsers = async () => {
    try {
        const users = await databases.listDocuments(
            databaseId,
            userCollectionId,
        )

        return users.documents
    } catch (error: any) {
        throw new Error(error)
    }
}

// Fetch semua post
export const getAllPost = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videCollectionId,
            [Query.orderDesc("$createdAt")]
        )

        return posts.documents
    } catch (error: any) {
        throw new Error(error)
    }
}

// Fetch post yang baru saja di upload
export const getLatestPost = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videCollectionId,
            [Query.orderDesc("$createdAt", Query.limit(7))]
        )

        return posts.documents
    } catch (error: any) {
        throw new Error(error)
    }
}

// Cari post
export const searchPosts = async (query: string) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videCollectionId,
            [Query.search("title", query)]
        )

        return posts.documents
    } catch (error: any) {
        throw new Error(error)
    }
}

// Fetch post user  yang sekarang
export const getUserPosts = async (userId: any) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videCollectionId,
            [Query.equal("creator", userId)]
        )

        return posts.documents
    } catch (error: any) {
        throw new Error(error)
    }
}

export const getFilePreview = (fileId: any, type: any) => {
    let fileUrl

    try {
        if (type === "video") {
            fileUrl = storage.getFileView(storageId, fileId)
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, ImageGravity.Top, 100)
        } else {
            throw new Error("Invalid file type")
        }

        if (!fileUrl) throw Error

        return fileUrl
    } catch (error: any) {
        throw new Error(error)
    }
}

export const uploadFile = async (file: any, type: string) => {
    if (!file) return

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    }


    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )

        const fileUrl = await getFilePreview(uploadedFile.$id, type)

        return fileUrl
    } catch (error: any) {
        throw new Error(error)
    }
}

// Buat post
export const createVideo = async (form: any) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video")
        ])

        const newPost = await databases.createDocument(
            databaseId,
            videCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        )

        return newPost
    } catch (error: any) {
        throw new Error(error)
    }
}

export const likeVideo = async (videoId: string, userId: string) => {
    try {
        const id = ID.unique();
        const response = await databases.createDocument(
            databaseId,
            likesCollectionId,
            id,
            {
                id,
                videoId,
                userId,
                createdAt: new Date().toISOString()
            }
        )

        // console.log(response)
        return response
    } catch (error: any) {
        console.error("Error like video", error)
    }
}

export const unlikeVideo = async (videoId: string, userId: string) => {
    try {
        const query = Query.and(
            [Query.equal("videoId", videoId),
            Query.equal("userId", userId)]
        );

        const response = await databases.listDocuments(
            databaseId,
            likesCollectionId,
            [query]
        );

        if (response.documents.length > 0) {
            const documentId = response.documents[0].$id;
            await databases.deleteDocument(
                databaseId,
                likesCollectionId,
                documentId
            );
        }

        return response
    } catch (error: any) {
        console.error("Error unlike video", error)
    }
}

export const getVideoLikes = async (videoId: string) => {
    try {
        const response = await databases.listDocuments(
            databaseId,
            likesCollectionId,
            [Query.equal("videoId", videoId)]
        )

        return response.documents.length
    } catch (error: any) {
        console.log(error)
        return 0
    }
}

export const checkIfLiked = async (videoId: string, userId: string) => {
    try {
        const response = await databases.listDocuments(
            databaseId,
            likesCollectionId,
            [Query.and([Query.equal("videoId", videoId), Query.equal("userId", userId)])]
        )

        return response.documents.length > 0
    } catch (error) {
        console.error(error)
        return false
    }
}

export const followUser = async (userId: string, followedUserId: string) => {
    try {
        const query = Query.and([
            Query.equal("userId", userId),
            Query.equal("followedUserId", followedUserId)
        ])

        const existingFollow = await databases.listDocuments(
            databaseId,
            followsCollectionId,
            [query]
        )

        if (existingFollow.documents.length === 0) {
            const newFollow = await databases.createDocument(
                databaseId,
                followsCollectionId,
                ID.unique(),
                {
                    id: ID.unique(),
                    userId,
                    followedUserId,
                    createdAt: new Date().toISOString()
                }
            )

            return newFollow
        } else {
            throw new Error("You are already following this user")
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const unfollowUser = async (userId: string, followedUserId: string) => {
    try {
        const query = Query.and([
            Query.equal("userId", userId),
            Query.equal("followedUserId", followedUserId)
        ])

        const existingFollow = await databases.listDocuments(
            databaseId,
            followsCollectionId,
            [query]
        )

        if (existingFollow.documents.length > 0) {
            await databases.deleteDocument(
                databaseId,
                followsCollectionId,
                existingFollow.documents[0].$id
            );
            return true;
        } else {
            throw new Error('You are not following this user');
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getFollowers = async (userId: string) => {
    try {
        const query = Query.equal('followedUserId', userId);
        const followers = await databases.listDocuments(
            databaseId,
            followsCollectionId,
            [query]
        );

        // Filter supaya tidak menampilkan followers dari akun sendiri
        const filteredFollowers = followers.documents.filter(doc => doc.userId !== userId);

        return filteredFollowers.map((doc) => doc.userId);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getFollowings = async (userId: string) => {
    try {
        const query = Query.equal('userId', userId);
        const followings = await databases.listDocuments(
            databaseId,
            followsCollectionId,
            [query]
        );

        // Filter supaya tidak menampilkan following dari akun sendiri
        const filteredFollowings = followings.documents.filter(doc => doc.followedUserId !== userId);

        return filteredFollowings.map((doc) => doc.followedUserId);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const fetchFollowing = async (userId: string, users: any) => {
    const followingData = await Promise.all(
        users.map(async (user: any) => {
            const query = Query.and([
                Query.equal('userId', userId),
                Query.equal('followedUserId', user.$id),
            ]);

            const existingFollow = await databases.listDocuments(
                databaseId,
                followsCollectionId,
                [query]
            );

            return existingFollow.documents.length > 0;
        })
    );

    const followingObj = followingData.reduce((acc, curr, index) => {
        acc[users[index].$id] = curr;

        return acc;
    }, {});

    return followingObj;
};

// Edit User
export const editUser = async (accountId: string, newUserData: any) => {
    try {
        // Fetch the current user document
        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal("accountId", accountId)]
        );

        if (!currentUser || currentUser.documents.length === 0) {
            throw new Error("User not found");
        }

        const userId = currentUser.documents[0].$id;

        // Update the user document with the new data
        const updatedUser = await databases.updateDocument(
            databaseId,
            userCollectionId,
            userId,
            newUserData
        );

        return updatedUser;
    } catch (error: any) {
        console.error("Error editing user", error);
        throw new Error(error);
    }
};
