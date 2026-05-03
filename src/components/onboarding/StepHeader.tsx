import { Text, View } from "react-native"
import ProgressBar from "./ProgressBar"
import { ONBOARDING_STEPS } from "@/constants/onboarding/steps"

export default function StepHeader({

  stepName,
  title,
  subtitle

}:{

  stepName:string
  title:string
  subtitle?:string

}){

  const stepIndex = ONBOARDING_STEPS.indexOf(stepName)

  return(

    <View className="bg-white">

      <ProgressBar
        step={stepIndex+1}
        total={ONBOARDING_STEPS.length}
      />

      <View className="px-6 pt-4 pb-3">

        <Text className="text-[22px] font-semibold text-black">

          {title}

        </Text>

        {subtitle && (

          <Text className="text-neutral-500 mt-1 leading-5">

            {subtitle}

          </Text>

        )}

      </View>

    </View>

  )

}