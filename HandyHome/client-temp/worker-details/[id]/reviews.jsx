import { StyleSheet, Text, View, TouchableOpacity, Image, useWindowDimensions, Animated, Pressable } from 'react-native'
import React, {useState, useEffect} from 'react'

import { globalStyles as global } from '../../../styles/globalStyles'
import { COLORS, FONTS, FONT_SIZES } from '../../../styles/constants'

const reviewItems = [
  {
    name: "User's Name",
    profilePicture: require('../../../../../assets/placeholder-base.png'),
    rating: 5,
    date: "27 Sep 2024",
    ratingDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab placeat eveniet aliquid voluptas, asperiores eius, deserunt soluta quasi laborum laudantium voluptatum! Earum ea quis quo suscipit amet adipisci labore natus. Nemo velit eligendi neque deserunt, facilis ipsa sed doloribus minima vel repudiandae laboriosam quis soluta ut iste officia, quas atque excepturi similique est quisquam. Ducimus ea quidem numquam dolor corrupti! Sit perferendis consequuntur maxime atque! Cum, pariatur harum quo temporibus ab eos assumenda soluta facere omnis neque consequatur accusantium. Autem quos, mollitia veritatis tenetur quia odio. Eaque est doloribus ducimus.",
    ratingMedia: []
  }, 
  {
    name: "User's Name",
    profilePicture: require('../../../../../assets/placeholder-base.png'),
    rating: 5,
    date: "27 Sep 2024",
    ratingDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab placeat eveniet aliquid voluptas, asperiores eius, deserunt soluta quasi laborum laudantium voluptatum! Earum ea quis quo suscipit amet adipisci labore natus. Nemo velit eligendi neque deserunt, facilis ipsa sed doloribus minima vel repudiandae laboriosam quis soluta ut iste officia, quas atque excepturi similique est quisquam. Ducimus ea quidem numquam dolor corrupti! Sit perferendis consequuntur maxime atque! Cum, pariatur harum quo temporibus ab eos assumenda soluta facere omnis neque consequatur accusantium. Autem quos, mollitia veritatis tenetur quia odio. Eaque est doloribus ducimus.",
    ratingMedia: []
  }, 
  {
    name: "User's Name",
    profilePicture: require('../../../../../assets/placeholder-base.png'),
    rating: 5,
    date: "27 Sep 2024",
    ratingDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab placeat eveniet aliquid voluptas, asperiores eius, deserunt soluta quasi laborum laudantium voluptatum! Earum ea quis quo suscipit amet adipisci labore natus. Nemo velit eligendi neque deserunt, facilis ipsa sed doloribus minima vel repudiandae laboriosam quis soluta ut iste officia, quas atque excepturi similique est quisquam. Ducimus ea quidem numquam dolor corrupti! Sit perferendis consequuntur maxime atque! Cum, pariatur harum quo temporibus ab eos assumenda soluta facere omnis neque consequatur accusantium. Autem quos, mollitia veritatis tenetur quia odio. Eaque est doloribus ducimus.",
    ratingMedia: []
  }, 
  {
    name: "User's Name",
    profilePicture: require('../../../../../assets/placeholder-base.png'),
    rating: 5,
    date: "27 Sep 2024",
    ratingDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab placeat eveniet aliquid voluptas, asperiores eius, deserunt soluta quasi laborum laudantium voluptatum! Earum ea quis quo suscipit amet adipisci labore natus. Nemo velit eligendi neque deserunt, facilis ipsa sed doloribus minima vel repudiandae laboriosam quis soluta ut iste officia, quas atque excepturi similique est quisquam. Ducimus ea quidem numquam dolor corrupti! Sit perferendis consequuntur maxime atque! Cum, pariatur harum quo temporibus ab eos assumenda soluta facere omnis neque consequatur accusantium. Autem quos, mollitia veritatis tenetur quia odio. Eaque est doloribus ducimus.",
    ratingMedia: []
  }, 
  {
    name: "User's Name",
    profilePicture: require('../../../../../assets/placeholder-base.png'),
    rating: 5,
    date: "27 Sep 2024",
    ratingDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab placeat eveniet aliquid voluptas, asperiores eius, deserunt soluta quasi laborum laudantium voluptatum! Earum ea quis quo suscipit amet adipisci labore natus. Nemo velit eligendi neque deserunt, facilis ipsa sed doloribus minima vel repudiandae laboriosam quis soluta ut iste officia, quas atque excepturi similique est quisquam. Ducimus ea quidem numquam dolor corrupti! Sit perferendis consequuntur maxime atque! Cum, pariatur harum quo temporibus ab eos assumenda soluta facere omnis neque consequatur accusantium. Autem quos, mollitia veritatis tenetur quia odio. Eaque est doloribus ducimus.",
    ratingMedia: []
  }, 
  {
    name: "User's Name",
    profilePicture: require('../../../../../assets/placeholder-base.png'),
    rating: 5,
    date: "27 Sep 2024",
    ratingDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab placeat eveniet aliquid voluptas, asperiores eius, deserunt soluta quasi laborum laudantium voluptatum! Earum ea quis quo suscipit amet adipisci labore natus. Nemo velit eligendi neque deserunt, facilis ipsa sed doloribus minima vel repudiandae laboriosam quis soluta ut iste officia, quas atque excepturi similique est quisquam. Ducimus ea quidem numquam dolor corrupti! Sit perferendis consequuntur maxime atque! Cum, pariatur harum quo temporibus ab eos assumenda soluta facere omnis neque consequatur accusantium. Autem quos, mollitia veritatis tenetur quia odio. Eaque est doloribus ducimus.",
    ratingMedia: []
  }, 
  {
    name: "User's Name",
    profilePicture: require('../../../../../assets/placeholder-base.png'),
    rating: 5,
    date: "27 Sep 2024",
    ratingDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab placeat eveniet aliquid voluptas, asperiores eius, deserunt soluta quasi laborum laudantium voluptatum! Earum ea quis quo suscipit amet adipisci labore natus. Nemo velit eligendi neque deserunt, facilis ipsa sed doloribus minima vel repudiandae laboriosam quis soluta ut iste officia, quas atque excepturi similique est quisquam. Ducimus ea quidem numquam dolor corrupti! Sit perferendis consequuntur maxime atque! Cum, pariatur harum quo temporibus ab eos assumenda soluta facere omnis neque consequatur accusantium. Autem quos, mollitia veritatis tenetur quia odio. Eaque est doloribus ducimus.",
    ratingMedia: []
  }, 
  {
    name: "User's Name",
    profilePicture: require('../../../../../assets/placeholder-base.png'),
    rating: 5,
    date: "27 Sep 2024",
    ratingDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab placeat eveniet aliquid voluptas, asperiores eius, deserunt soluta quasi laborum laudantium voluptatum! Earum ea quis quo suscipit amet adipisci labore natus. Nemo velit eligendi neque deserunt, facilis ipsa sed doloribus minima vel repudiandae laboriosam quis soluta ut iste officia, quas atque excepturi similique est quisquam. Ducimus ea quidem numquam dolor corrupti! Sit perferendis consequuntur maxime atque! Cum, pariatur harum quo temporibus ab eos assumenda soluta facere omnis neque consequatur accusantium. Autem quos, mollitia veritatis tenetur quia odio. Eaque est doloribus ducimus.",
    ratingMedia: []
  }, 
  {
    name: "User's Name",
    profilePicture: require('../../../../../assets/placeholder-base.png'),
    rating: 5,
    date: "27 Sep 2024",
    ratingDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab placeat eveniet aliquid voluptas, asperiores eius, deserunt soluta quasi laborum laudantium voluptatum! Earum ea quis quo suscipit amet adipisci labore natus. Nemo velit eligendi neque deserunt, facilis ipsa sed doloribus minima vel repudiandae laboriosam quis soluta ut iste officia, quas atque excepturi similique est quisquam. Ducimus ea quidem numquam dolor corrupti! Sit perferendis consequuntur maxime atque! Cum, pariatur harum quo temporibus ab eos assumenda soluta facere omnis neque consequatur accusantium. Autem quos, mollitia veritatis tenetur quia odio. Eaque est doloribus ducimus.",
    ratingMedia: []
  }, 
  {
    name: "User's Name",
    profilePicture: require('../../../../../assets/placeholder-base.png'),
    rating: 5,
    date: "27 Sep 2024",
    ratingDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab placeat eveniet aliquid voluptas, asperiores eius, deserunt soluta quasi laborum laudantium voluptatum! Earum ea quis quo suscipit amet adipisci labore natus. Nemo velit eligendi neque deserunt, facilis ipsa sed doloribus minima vel repudiandae laboriosam quis soluta ut iste officia, quas atque excepturi similique est quisquam. Ducimus ea quidem numquam dolor corrupti! Sit perferendis consequuntur maxime atque! Cum, pariatur harum quo temporibus ab eos assumenda soluta facere omnis neque consequatur accusantium. Autem quos, mollitia veritatis tenetur quia odio. Eaque est doloribus ducimus.",
    ratingMedia: []
  }, 
]

const ReviewWorkReviews = ({onScroll, paddingTop, minHeight, listRef}) => {
  const {height, width} = useWindowDimensions();

  const [filterByAll, setFilterByAll] = useState(true);
  const [filterByMedia, setFilterByMedia] = useState(false);
  const [filterByRating, setFilterByRating] = useState(0);

  const handleFilterAll = () => {
    if (filterByAll) {
      setFilterByMedia(false);
      setFilterByRating(0);
    } else {
      setFilterByAll(true);
      setFilterByMedia(false);
    }
  }

  const handleFilterMedia = () => {
    setFilterByAll(false);
    setFilterByMedia(true);
  }

  const handleFilterRating = () => {
    if (filterByRating===5) {
      setFilterByRating(0)
    } else {
      setFilterByRating(filterByRating + 1)
    }
  }

  return (
    <Animated.FlatList 
    ref={listRef}
    onScroll={onScroll}
    data={reviewItems}
    stickyHeaderIndices={[0]}
    ListHeaderComponent={
      <View style={{backgroundColor: '#fff'}}>
        <Text style={[styles.sectionTitle]}>Reviews</Text>
        <View 
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 12,
          backgroundColor: '#fff'
        }}
        >
          <Pressable
          onPress={handleFilterAll}
          style={({pressed}) => [
            styles.filterButton, {
            backgroundColor: filterByAll? COLORS.primary : '#fff',
            borderColor: filterByAll? COLORS.primary : COLORS.lettersicons,
            }
          ]}>
            <Text 
            lineBreakMode='1' 
            style={[
              styles.sectionMainText, {
              color: filterByAll? '#fff' : COLORS.lettersicons
            }]}>
              All
            </Text>
            <Text 
            lineBreakMode='1' 
            style={[
              styles.sectionSubText, {
              color: filterByAll? '#ffffff80' : COLORS.labels
            }]}>
              {`(${98})`}
            </Text>
          </Pressable>

          <Pressable
          onPress={handleFilterMedia}
          style={({pressed}) => [
            styles.filterButton, {
            backgroundColor: filterByMedia? COLORS.primary : '#fff',
            borderColor: filterByMedia? COLORS.primary : COLORS.lettersicons,
            }
          ]}>
            <Text 
            lineBreakMode='1' 
            style={[
              styles.sectionMainText, {
              color: filterByMedia? '#fff' : COLORS.lettersicons
            }]}>
              With Media
            </Text>
            <Text 
            lineBreakMode='1' 
            style={[
              styles.sectionSubText, {
              color: filterByMedia? '#ffffff80' : COLORS.labels
            }]}>
              {`(${98})`}
            </Text>
          </Pressable>

          <Pressable
          onPress={handleFilterRating}
          style={({pressed}) => [
            styles.filterButton, {
            backgroundColor: (filterByRating !== 0)? COLORS.primary : '#fff',
            borderColor: (filterByRating !== 0)? COLORS.primary : COLORS.lettersicons,
            }
          ]}>
            <Text 
            lineBreakMode='1' 
            style={[
              styles.sectionMainText, {
              color: (filterByRating !== 0)? '#fff' : COLORS.lettersicons
            }]}>
              Rating
            </Text>
            <Text 
            lineBreakMode='1' 
            style={[
              styles.sectionSubText, {
              color: (filterByRating !== 0)? '#ffffff80' : COLORS.labels
            }]}>
              {`(${(filterByRating !== 0)? filterByRating : 'All'})`}
            </Text>
          </Pressable>
        </View>
      </View>
      
    }
    renderItem={({item, index}) => (<ReviewBox item={item} index={index}/>)}
    contentContainerStyle={{
      paddingTop: paddingTop,
      minHeight: minHeight ?? height,
      gap: 8,
      paddingBottom: 100
    }}
    style={{
      padding: 24,
    }}
    />
  )
}

const ReviewBox = ({item, index}) => {
  const [showDescription, setShowDescription] = useState(false);
  const [lineCount, setLineCount] = useState([]);
  
  return (
    <View style={{width: '100%', gap: 8, borderBottomWidth: 1, borderBottomColor: COLORS.strokes, paddingVertical: 24}}>

      <View style={{flexDirection: 'row', gap: 12, alignItems: 'center'}}>
        <Image 
        source={item.profilePicture}
        style={{
          width: 40,
          height: 40,
          aspectRatio: '1/1',
          borderRadius: 20
        }}
        />
        <Text style={styles.sectionTitle}>
          {item.name}
        </Text>
      </View>
      
      <View>
        <Text
        style={[
          styles.sectionMainText, {
          textAlign: 'justify'
        }]}
        numberOfLines={(showDescription)? 0 : 3}
        onTextLayout={(e) => setLineCount(e.nativeEvent.lines.length)}
        >
          {item.ratingDescription}
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

      <Text style={[styles.sectionSubText, {alignSelf: 'flex-end'}]}>{item.date}</Text>
    </View>
  )
}

export default ReviewWorkReviews

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
  filterButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 80,
    flex: 1
  },

})