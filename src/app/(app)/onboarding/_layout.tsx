import { Stack } from "expo-router"
import { EditProvider } from "@/store/edit"

export default function Layout(){

  return(

    <EditProvider>

      <Stack
        screenOptions={{
          headerShown:false,
          animation:"slide_from_right"
        }}
      />

    </EditProvider>

  )

}