import { View, Text, Pressable } from "react-native"
import { router } from "expo-router"

export default function StepFooter({

  nextRoute,
  showSkip,
  disabled

}:{

  nextRoute:string
  showSkip:boolean
  disabled?:boolean

}){

  return(

    <View className="px-6 pb-10 pt-6">

      {showSkip && (

        <Pressable

          onPress={()=>router.push(nextRoute)}

          className="h-[48px] items-center justify-center mb-3"

        >

          <Text className="text-neutral-500">

            Skip

          </Text>

        </Pressable>

      )}

      <Pressable

        disabled={disabled}

        onPress={()=>router.push(nextRoute)}

        className={`h-[54px] rounded-xl items-center justify-center ${
          disabled
          ? "bg-neutral-300"
          : "bg-[#7454F6]"
        }`}

      >

        <Text className="text-white font-semibold">

          Next

        </Text>

      </Pressable>

    </View>

  )

}