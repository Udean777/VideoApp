import { Account, Avatars, Client, Databases, ID, ImageGravity, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.sajudin.aora",
    projectId: "666abdf50013a7f48e4a",
    databaseId: "666abf190015a08ab38c",
    userCollectionId: "666abf320024035e6682",
    videCollectionId: "666abf630013566ab484",
    storageId: "666ac0a100083240281e"
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videCollectionId,
    storageId
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