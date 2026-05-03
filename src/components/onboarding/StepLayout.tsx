import { View } from "react-native"

export default function StepLayout({

  header,
  children,
  footer

}:{

  header:any
  children:any
  footer:any

}){

  return(

    <View className="flex-1 bg-white">

      {header}

      <View className="flex-1 px-6">

        {children}

      </View>

      {footer}

    </View>

  )

}