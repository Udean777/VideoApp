import { useEffect, useState } from "react"
import { Alert } from "react-native"

const useAppwrite = (fn: any) => {
    const [data, setData] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchData = async () => {
        setIsLoading(true)

        try {
            const res = await fn()

            setData(res)
        } catch (error: any) {
            Alert.alert("Error", error.message)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const refetch = () => fetchData()

    return { data, isLoading, refetch, setData, error }
}

export default useAppwrite