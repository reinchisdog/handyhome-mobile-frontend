import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'

import Header from '../../../../../components/dashboard/Header';
import InboxItem from '../../../../../components/dashboard/inbox/InboxItem'
import ComingSoonScreen from '../../../../comingSoon'

import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONT_SIZES } from '../../../../../styles/constants';

inboxData = [
  {
    id: 0,
    senderProfile: require("../../../../../assets/placeholder-base.png"),
    senderName: "Provider's Name (Oldest)",
    latestMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil error exercitationem quod sunt illo temporibus eveniet laboriosam quis consequuntur earum assumenda, eum aliquam, voluptatem alias, veritatis velit repellat nam saepe!",
    isUnread: true
  },
  {
    id: 1,
    senderProfile: require("../../../../../assets/placeholder-base.png"),
    senderName: "Provider's Name",
    latestMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil error exercitationem quod sunt illo temporibus eveniet laboriosam quis consequuntur earum assumenda, eum aliquam, voluptatem alias, veritatis velit repellat nam saepe!",
    isUnread: false
  },
  {
    id: 2,
    senderProfile: require("../../../../../assets/placeholder-base.png"),
    senderName: "Provider's Name",
    latestMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil error exercitationem quod sunt illo temporibus eveniet laboriosam quis consequuntur earum assumenda, eum aliquam, voluptatem alias, veritatis velit repellat nam saepe!",
    isUnread: false
  },
  {
    id: 3,
    senderProfile: require("../../../../../assets/placeholder-base.png"),
    senderName: "Provider's Name",
    latestMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil error exercitationem quod sunt illo temporibus eveniet laboriosam quis consequuntur earum assumenda, eum aliquam, voluptatem alias, veritatis velit repellat nam saepe!",
    isUnread: false
  },
  {
    id: 4,
    senderProfile: require("../../../../../assets/placeholder-base.png"),
    senderName: "Provider's Name",
    latestMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil error exercitationem quod sunt illo temporibus eveniet laboriosam quis consequuntur earum assumenda, eum aliquam, voluptatem alias, veritatis velit repellat nam saepe!",
    isUnread: false
  },
  {
    id: 5,
    senderProfile: require("../../../../../assets/placeholder-base.png"),
    senderName: "Provider's Name",
    latestMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil error exercitationem quod sunt illo temporibus eveniet laboriosam quis consequuntur earum assumenda, eum aliquam, voluptatem alias, veritatis velit repellat nam saepe!",
    isUnread: true
  },
  {
    id: 6,
    senderProfile: require("../../../../../assets/placeholder-base.png"),
    senderName: "Provider's Name",
    latestMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil error exercitationem quod sunt illo temporibus eveniet laboriosam quis consequuntur earum assumenda, eum aliquam, voluptatem alias, veritatis velit repellat nam saepe!",
    isUnread: true
  },
  {
    id: 7,
    senderProfile: require("../../../../../assets/placeholder-base.png"),
    senderName: "Provider's Name (Latest)",
    latestMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil error exercitationem quod sunt illo temporibus eveniet laboriosam quis consequuntur earum assumenda, eum aliquam, voluptatem alias, veritatis velit repellat nam saepe!",
    isUnread: false
  },
]

const InboxScreen = () => {
  return (
    // <View style={global.screenContainer}>

    //   <Header 
    //   background={COLORS.primary} 
    //   title = {
    //     <Text style={[global.headingText, {color: '#fff'}]}>Inbox</Text>
    //   }
    //   titleAlign = 'center'
    //   titlePosition = 'relative'
    //   />

    //   <FlatList 
    //     data = {inboxData}
    //     renderItem = {({item}) => <InboxItem item={item}/>}
    //     inverted
    //   />

    // </View>
    <ComingSoonScreen />
  )
}

export default InboxScreen

const styles = StyleSheet.create({})