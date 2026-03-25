import { useEffect } from "react"
import { router } from "expo-router"

export default function Page(){

  useEffect(()=>{

    router.replace("/(app)/onboarding/screens/welcome")

  },[])

  return null

}