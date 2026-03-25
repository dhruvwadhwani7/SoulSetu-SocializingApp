import { View } from "react-native"

export default function ProgressBar({

  step,
  total

}:{

  step:number
  total:number

}){

  const percent = (step/total)*100

  return(

    <View className="px-6 pt-5 pb-2">

      <View className="h-[6px] bg-neutral-200 rounded-full overflow-hidden">

        <View
          className="h-full bg-[#7454F6]"
          style={{ width:`${percent}%` }}
        />

      </View>

    </View>

  )

}