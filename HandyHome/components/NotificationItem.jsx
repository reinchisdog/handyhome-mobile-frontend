// Component: Notification Item

// Imports
// React and Expo Components
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
// Styles and Icons
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';
import { globalStyles as global } from '../styles/globalStyles';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import { ServiceIconMap } from './ServiceIconMap';

const NotificationItem = ({item}) => {
   // Hooks and States

   // Renders
   const getIcon = (type) => {
      switch(type) {
         case 'reminder':
            return <Icons name="bell-ring" size={24} color={COLORS.primary} />
         case 'safety tip':
            return <Icons name="shield-check" size={24} color={COLORS.primary} />
         case 'promo':
            return <Icons name="tag" size={24} color={COLORS.primary} />
         case 'new feature':
            return <Icons name="star" size={24} color={COLORS.primary} />
         default:
            return <Icons name="bell" size={24} color={COLORS.primary} />
      }
   }

   const formatNotificationTime = (timestamp) => {
      const date = new Date(timestamp);
      const now = new Date();
      
      // Reset time to midnight for accurate day comparison
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      const diffMs = now - date;
      const diffDays = Math.floor((todayStart - dateStart) / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
      const diffYears = now.getFullYear() - date.getFullYear();
      
      // Format time as 12-hour with AM/PM
      const formatTime = (d) => {
         let hours = d.getHours();
         const minutes = d.getMinutes().toString().padStart(2, '0');
         const ampm = hours >= 12 ? 'PM' : 'AM';
         hours = hours % 12 || 12;
         return `${hours}:${minutes} ${ampm}`;
      };
      
      // Today
      if (diffDays === 0) {
         return `Today | ${formatTime(date)}`;
      }
      
      // Yesterday
      if (diffDays === 1) {
         return `Yesterday | ${formatTime(date)}`;
      }
      
      // Within a week (2-6 days ago)
      if (diffDays < 7) {
         return `${diffDays}d | ${formatTime(date)}`;
      }
      
      // Within 4 weeks (1-3 weeks ago)
      if (diffWeeks < 4) {
         return `${diffWeeks}w | ${formatTime(date)}`;
      }
      
      // Within a year (1-11 months ago)
      if (diffMonths < 12) {
         return `${diffMonths}m`;
      }
      
      // 1 year or more
      return `${diffYears}y`;
   }

   return (
      <View 
      style={{
         padding: 24,
         flexDirection: 'row',
         alignItems: 'center',
         gap: 24,
         borderBottomWidth: StyleSheet.hairlineWidth,
         borderBottomColor: COLORS.strokes,
         backgroundColor: '#fff'
      }}>
         <View style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: COLORS.screenbg,
            alignItems: 'center',
            justifyContent: 'center'
         }}>
            {(item.service === 'All' || !item.service) ? getIcon(item.announcement_type) : <ServiceIconMap serviceId={item.service} iconColor={COLORS.primary} iconSize={24}/>}
         </View>

         <View style={{gap: 4, flex: 1}}>
            <Text style={{
               fontFamily: FONTS.roboto600,
               fontSize: FONT_SIZES.md,
               color: COLORS.lettersicons,
               flexShrink: 1,
            }}>
              {item.title} 
            </Text>
            <Text style={{
               fontFamily: FONTS.roboto400,
               fontSize: FONT_SIZES.sm,
               color: COLORS.lettersicons,
               flexShrink: 1,
               textAlign: 'justify'
            }}>
              {item.body} 
            </Text>

            {item.announcement_type === 'promo' && item.promo_code &&
            <View style={{
               padding: 8,
               backgroundColor: COLORS.secondary,
               borderRadius: 8,
               borderWidth: 1,
               borderColor: COLORS.strokes,
               gap: 4,
               marginVertical: 8
            }}> 
               <Text style={{
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.labels,
                  flexShrink: 1,
               }}>
                  Promo Code: <Text style={{
                     fontFamily: FONTS.roboto700,
                     color: COLORS.accent}}>
                        {item.promo_code}
                  </Text>
               </Text>
               <Text style={{
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.labels,
                  flexShrink: 1,
               }}>
                  {`Expires at ${item.promo_code_expires_at}`}
               </Text>
            </View>
            }

            <Text style={{
               fontFamily: FONTS.roboto400,
               fontSize: FONT_SIZES.sm,
               color: COLORS.labels,
               flexShrink: 1,
               textAlign: 'right',
               alignSelf: 'flex-end'
            }}>
              {formatNotificationTime(item.created_at)} 
            </Text>
         </View>
      </View>
   )
}

export default NotificationItem

const styles = StyleSheet.create({})