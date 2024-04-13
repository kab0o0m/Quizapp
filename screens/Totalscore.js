import React, { useState } from 'react'
import { View } from 'react-native'

export default function Totalscore () {
  const [score,setScore] = useState(0)

  return (
    <View>
      <Text>Total Score</Text>
      <Text>{score}</Text>
    </View>
  )
}

