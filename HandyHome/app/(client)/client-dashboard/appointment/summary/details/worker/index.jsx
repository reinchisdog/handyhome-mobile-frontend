import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Animated } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'

import { globalStyles as global } from '../../../../../../../styles/globalStyles'
import { COLORS, FONTS, FONT_SIZES } from '../../../../../../../styles/constants'

const availabilityItems = [
  {
    day: "Monday",
    startTime: "00:00",
    endTime: "00:00"
  },
  {
    day: "Tuesday",
    startTime: "00:00",
    endTime: "00:00"
  },
  {
    day: "Wednesday",
    startTime: "00:00",
    endTime: "00:00"
  },
  {
    day: "Thursday",
    startTime: "00:00",
    endTime: "00:00"
  },
  {
    day: "Friday",
    startTime: "00:00",
    endTime: "00:00"
  },
  {
    day: "Saturday",
    startTime: "00:00",
    endTime: "00:00"
  },
  {
    day: "Sunday",
    startTime: "00:00",
    endTime: "00:00"
  },
]

const ReviewWorkAbout = ({onScroll, paddingTop, minHeight, listRef}) => {
  const [showDescription, setShowDescription] = useState(false);
  const [lineCount, setLineCount] = useState(0);


  return (
    <Animated.ScrollView
    ref={listRef}
    contentContainerStyle={{
      paddingTop: paddingTop,
    }}
    onScroll={onScroll}
    >
      <View style={{
        padding: 24,
        backgroundColor: '#fff',
        gap: 24,
        height: minHeight
      }}>
        {/* ---------------------------- About Description --------------------------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View>
            <Text
            style={[
              styles.sectionMainText, {
              textAlign: 'justify'
            }]}
            numberOfLines={(showDescription)? 0 : 3}
            onTextLayout={(e) => setLineCount(e.nativeEvent.lines.length)}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio obcaecati accusamus possimus saepe ipsum nulla, non voluptatibus aut dolores laborum quas aspernatur sapiente quaerat, temporibus facere dolore quam enim. Animi!
              Non unde dolorum optio aut provident dignissimos exercitationem eaque dolorem autem, qui facilis facere vel veniam, animi numquam odit libero quaerat accusamus distinctio sequi tenetur tempore assumenda amet aliquid. Dolores.
            </Text>
            {(lineCount > 3) ?
              <TouchableOpacity onPress={() => setShowDescription(!showDescription)}>
                <Text
                style={{
                  fontFamily: FONTS.roboto600,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.primary,
                  marginHorizontal: 'auto',
                  marginTop: 12
                }}
                >
                  {(showDescription)? "Show Less" : "Show More"}
                </Text>
              </TouchableOpacity> :
              <></>
            }
            
          </View>
        </View>

        <View style={{width: '100%', height: StyleSheet.hairlineWidth, backgroundColor: COLORS.strokes}} />
        
        {/* ------------------------------ Working Hours ----------------------------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Working Hours</Text>
          <View style={{gap: 8}}>
          {availabilityItems.map((item, index) => (
            <View 
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text style={styles.sectionSubText}>{item.day}</Text>
              <Text style={styles.sectionMainText}>{`${item.startTime} - ${item.endTime}`}</Text>
            </View>
          ))
          }
          </View>
          
        </View>
      </View>
      

    </Animated.ScrollView>
  )
}

export default ReviewWorkAbout

const styles = StyleSheet.create({
  section: {
    width: '100%',
    gap: 16
  },
  sectionTitle: {
    fontFamily: FONTS.roboto600,
    fontSize: FONT_SIZES.sm,
    color: COLORS.lettersicons
  },
  sectionMainText: {
    fontFamily: FONTS.roboto400,
    fontSize: FONT_SIZES.sm,
    color: COLORS.lettersicons
  },
  sectionSubText: {
    fontFamily: FONTS.roboto400,
    fontSize: FONT_SIZES.sm,
    color: COLORS.labels
  },
})