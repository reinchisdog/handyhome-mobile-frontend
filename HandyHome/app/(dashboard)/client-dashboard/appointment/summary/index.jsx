import { StyleSheet, Text, View, ScrollView, Pressable, ImageBackground, Animated, Easing, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import {API_URL} from '../../../../../config';
import { useAuth } from '../../../../../context/AuthContext';
import {useAppointment} from '../../../../../context/AppointmentContext'

import Header from '../../../../../components/dashboard/Header';
import MainButton from '../../../../../components/MainButton';
import ErrorModal from '../../../../../components/ErrorModal';

import Arrows from '@expo/vector-icons/Entypo';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomIcons from '../../../../../assets/customIcons';
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

export default ReviewSummary = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const {token} = useAuth();
  const {appointment, reviewSummary, fetchReviewSummary, summaryLoading, setSummaryLoading} = useAppointment();

  const skeletonOpacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  useEffect(() => {
    const animLoop = Animated.loop(
       Animated.sequence([
          Animated.timing(skeletonOpacity, {
             toValue: 0.5,
             duration: 250,
             easing: Easing.inOut(Easing.ease),
             useNativeDriver: true
          }),
          Animated.timing(skeletonOpacity, {
             toValue: 0.2,
             duration: 500,
             easing: Easing.inOut(Easing.ease),
             useNativeDriver: true
          }),
          Animated.timing(skeletonOpacity, {
             toValue: 0.5,
             duration: 250,
             easing: Easing.inOut(Easing.ease),
             useNativeDriver: true
          }),
       ])
    )

    if (summaryLoading) animLoop.start();
    
    return () => animLoop.stop();
 }, [summaryLoading])

  useEffect(() => {
    if (!appointment || !token) return;

    const awaitSummaryFetch = async () => {
      try {
        setConfirmLoading(true);
        setSummaryLoading(true);
        const result = await fetchReviewSummary(appointment.id);
        // console.log(result?.data);
      } catch (err) {
        console.log(err);
      } finally {
        setTimeout(() => {
          setConfirmLoading(false);
          setSummaryLoading(false);
        }, 1000)
      }
    }

    awaitSummaryFetch(); 
  }, [appointment, token])

  const [backModal, setBackModal] = useState(false);
  const [noteModal, setNoteModal] = useState(false);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleConfirm = async () => {
    try {
      setConfirmLoading(true);

      const result = await axios.put(`${API_URL}/user/book/${appointment.id}/confirm_booking`, null, {
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      })

      const status = result?.data?.status || "error"
      const message = result?.data?.message

      if (status === "success") {
         console.log(`[Booking Successful]`, result.data.data.booking_details);
         router.replace('client-dashboard/appointment/success');
      }
      else if (status === "failed" || status === "error")
         throw new Error(message)

    } catch (err) {
        const message = err?.message || "There is an unexpected error trying to find a new worker"
        setErrorMessage(message);
        setErrorModal(true);

    } finally {
      setConfirmLoading(false);
    }
  }

  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null)

  return (
    <>
      <ErrorModal visible={errorModal} setVisible={setErrorModal} message={errorMessage}/>
      <BackModal visible={backModal} setVisible={setBackModal}/>
      <NoteModal visible={noteModal} setVisible={setNoteModal} note={reviewSummary?.booking?.description}/>

      <View style={[global.screenContainer, {backgroundColor: '#fff'}]}>
        <Header 
        left={
          <TouchableOpacity onPress={() => setBackModal(true)}>
            <Arrows name='chevron-left' size={24} color={COLORS.primary} />
          </TouchableOpacity>
        }
        title={
          <Text style={[global.headingText, {color: COLORS.primary}]}>Review Summary</Text>
        }
        titlePosition='absolute'
        titleAlign='center'
        />

        {/* ------------------------------ Main Content ------------------------------ */}
        <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 8
        }}>

          {/* --------------------------------- Address -------------------------------- */}
          <View
          style={styles.summaryBox}>
            <Pressable 
            style={({pressed}) => [
              styles.summaryBoxPressable, {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            }]}
            onPress={() => {/*router.push('client-dashboard/appointment/summary/details/addresses')*/}}>
              <View style={styles.left}>
                <Icons name="map-marker" size={24} color={COLORS.primary} />
                <View style={{ flexShrink: 1, gap: 2}}>
                  {/* -------------------------- Name and Phone Number ------------------------- */}
                  <View style={{flexDirection: 'row', gap: 6, flexWrap: 'wrap'}}>
                    {summaryLoading ? (
                      <Animated.View 
                      style={{
                        backgroundColor: COLORS.strokes,
                        borderRadius: 8,
                        width: '80%',
                        opacity: skeletonOpacity,
                        height: 16
                      }}/>
                    ) : (
                      <>
                        <Text style={styles.righText}>{reviewSummary?.booking?.full_name}</Text>
                        <Text style={styles.leftText}>{`(${reviewSummary?.booking?.phone_number})`}</Text>
                      </>
                    )}
  
                  </View>

                  {/* --------------------------------- Address -------------------------------- */}
                  {summaryLoading ? (
                    <Animated.View 
                    style={{
                      backgroundColor: COLORS.strokes,
                      borderRadius: 8,
                      width: '100%',
                      opacity: skeletonOpacity,
                      height: 30
                    }}/>
                  ) : (
                      <Text 
                      numberOfLines={2}
                      style={{
                        flexShrink: 1,
                        flexWrap: 'wrap',
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.labels
                      }}>
                        {reviewSummary && `${reviewSummary?.booking?.block}, ${reviewSummary?.booking?.barangay}, ${reviewSummary?.booking?.municipal}, ${reviewSummary?.booking?.province}`}
                      </Text>
                  )}
                </View>
              </View>
              <Arrows name="chevron-right" size={24} color={COLORS.accent} />
            </Pressable>
          </View>

          {/* --------------------------- Service Information -------------------------- */}
          <View
          style={[
          styles.summaryBox, {
          backgroundColor: 'white',
          paddingVertical: 24,
          }]}>
            <View style={styles.summaryBoxView}>
              <Text style={styles.leftText}>Service</Text>
              {(summaryLoading) ? (
                <Animated.View 
                style={{
                  backgroundColor: COLORS.strokes,
                  borderRadius: 8,
                  flexGrow: 1,
                  opacity: skeletonOpacity,
                  height: '100%'
                }}/>
              ): (
                <Text style={styles.righText}>{reviewSummary?.booking?.sub_services?.name}</Text>
              )}  
            </View>
            {/* <View style={styles.summaryBoxView}>
              <Text style={styles.leftText}>Complexity</Text>
              <Text style={styles.righText}>Simple</Text>
            </View> */}
            <View style={styles.summaryBoxView}>
              <Text style={styles.leftText}>Service Category</Text>
              {(summaryLoading) ? (
                <Animated.View 
                style={{
                  backgroundColor: COLORS.strokes,
                  borderRadius: 8,
                  flexGrow: 1,
                  opacity: skeletonOpacity,
                  height: '100%'
                }}/>
              ): (
                <Text style={styles.righText}>{reviewSummary?.booking?.services?.name}</Text>
              )}  
            </View>
            <View style={styles.summaryBoxView}>
              <Text style={styles.leftText}>Booking Date</Text>
              {(summaryLoading) ? (
                <Animated.View 
                style={{
                  backgroundColor: COLORS.strokes,
                  borderRadius: 8,
                  flexGrow: 1,
                  opacity: skeletonOpacity,
                  height: '100%'
                }}/>
              ): (
                <Text style={styles.righText}>
                  {reviewSummary?.booking?.date && reviewSummary?.booking?.time
                    ? `${new Date(
                        `${reviewSummary.booking.date}T${reviewSummary.booking.time}`
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })} | ${new Date(
                        `${reviewSummary.booking.date}T${reviewSummary.booking.time}`
                      ).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                      })}`
                    : ""}
                </Text>
              )}  
            </View>
          </View>

          {/* ---------------------------- Service Voucher ----------------------------- */}
          {/* <View style={styles.summaryBox}>
            <Pressable 
            style={({pressed}) => [
              styles.summaryBoxPressable, {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            }]}
            >
              <Text style={styles.leftText}>Voucher</Text>
              <View style={styles.right}>
                <View style={[global.tagContainer, {backgroundColor: COLORS.lightblue}]}>
                  <Text style={[global.tagText, {color: COLORS.lettersicons}]}>{"15% off"}</Text>
                </View>
                <Arrows name="chevron-right" size={24} color={COLORS.accent} />
              </View>
              
            </Pressable>
          </View> */}

          {/* ---------------------------- Service Provider ---------------------------- */}
          <View style={[styles.summaryBox, {gap: 0}]}>
            <Text style={[styles.leftText, {paddingVertical: 12, paddingLeft: 12}]}>Service Provider</Text>
            {/* --------------------------- Worker Information */}
            <Pressable 
            style={({pressed}) => [
              styles.summaryBoxPressable, {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            }]}
            onPress={() => router.push({
              pathname: 'client-dashboard/worker-details/[id]',
              params: {id: reviewSummary?.worker?.users?.user_id}
            })}>
              <View style={[styles.left, {}]}>
                <ImageBackground
                src={reviewSummary?.worker?.users?.profile_photo_url}
                style={{
                  aspectRatio: '1/1',
                  height: 82,
                  width: 82,
                  position: 'relative',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}
                imageStyle={{
                  borderRadius: 41
                }}>
                  <View 
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 12
                  }}>
                    <Icons name="check-decagram" size={24} color={COLORS.primary} />
                  </View>
                  
                </ImageBackground>

                <View style={{gap: 6, flexGrow: 1}}>
                  {(summaryLoading) ? (
                    <Animated.View 
                    style={{
                      backgroundColor: COLORS.strokes,
                      borderRadius: 8,
                      width: '100%',
                      opacity: skeletonOpacity,
                      height: 16
                    }}/>
                  ) : (
                    <Text numberOfLines={1}
                    style={{
                      flexShrink: 1,
                      flexWrap: 'wrap',
                      fontFamily: FONTS.roboto600,
                      fontSize: FONT_SIZES.md,
                      color: COLORS.primary
                    }}>
                      {reviewSummary?.worker?.users?.full_name}
                    </Text>
                  )}
                  
                  {summaryLoading ? (
                    <Animated.View 
                    style={{
                      backgroundColor: COLORS.strokes,
                      borderRadius: 8,
                      width: '100%',
                      opacity: skeletonOpacity,
                      height: 14
                    }}/>
                  ) : (
                    <Text numberOfLines={1}
                    style={{
                      flexShrink: 1,
                      flexWrap: 'wrap',
                      fontFamily: FONTS.roboto400,
                      fontSize: FONT_SIZES.sm,
                      color: COLORS.labels
                    }}>
                      {"Freelancer"}
                    </Text>
                  )}
                  
                  {summaryLoading ? (
                    <Animated.View 
                    style={{
                      backgroundColor: COLORS.strokes,
                      borderRadius: 8,
                      width: '100%',
                      opacity: skeletonOpacity,
                      height: 16
                    }}/>
                  ) : (
                    <Text numberOfLines={1}
                    style={{
                      flexShrink: 1,
                      flexWrap: 'wrap',
                      fontFamily: FONTS.roboto400,
                      fontSize: FONT_SIZES.sm,
                      color: COLORS.lettersicons
                    }}>
                      {reviewSummary?.worker?.users?.phone_number}
                    </Text>
                  )}

                </View>
              </View>

              <Arrows name="chevron-right" size={24} color={COLORS.accent} />
            </Pressable>
            
            {/* ---------------------------------- Note  */}
            <Pressable 
            style={({pressed}) => [
              styles.summaryBoxPressable, {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            }]}
            onPress={reviewSummary?.booking?.description ? () => setNoteModal(true) : undefined}>
              <Text style={styles.leftText}>Note</Text>
              
                <View style={styles.right}>
                {(summaryLoading) ? (
                  <Animated.View 
                  style={{
                    backgroundColor: COLORS.strokes,
                    borderRadius: 8,
                    flexGrow: 1,
                    opacity: skeletonOpacity,
                    height: 16
                  }}/>
                ) : (
                  <Text numberOfLines={1} style={{
                    flexShrink: 1,
                    flexWrap: 'wrap',
                    fontFamily: FONTS.roboto400,
                    fontSize: FONT_SIZES.sm,
                    color: reviewSummary?.booking?.description? COLORS.lettersicons : COLORS.strokes,
                    textAlign: 'right',
                    width: '80%'
                  }}>
                    {reviewSummary?.booking?.description || '[ Empty ]'}
                  </Text>
                )}
                  <Arrows name="chevron-right" size={24} color={COLORS.accent} />
                </View>
              
              
              
            </Pressable>
          </View>

          {/* ----------------------------- Payment Method ----------------------------- */}
          <View style={styles.summaryBox}>
            <Pressable 
            style={({pressed}) => [
              styles.summaryBoxPressable, {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            }]}
            onPress={() => router.push('client-dashboard/appointment/summary/details/payment')}>
              {summaryLoading ? (
                <Animated.View 
                style={{
                  backgroundColor: COLORS.strokes,
                  borderRadius: 8,
                  flexGrow: 1,
                  opacity: skeletonOpacity,
                  height: 24
                }}/>
              ) : (
                <View style={styles.left}>
                  {reviewSummary?.booking?.payment_method === "Cash" ? 
                    <Icons name="cash-multiple" size={24} color={COLORS.labels} /> : <CustomIcons name="gcash" size={24} color={COLORS.labels}/>
                  }   
                  <Text style={styles.leftText}>{reviewSummary?.booking?.payment_method}</Text>
                </View>
              )}
              
              
              <Text style={styles.righText}>Change Payment Method</Text>
              
            </Pressable>
          </View>

          {/* ------------------------------ Service Fees ------------------------------ */}
          <View
          style={[
          styles.summaryBox, {
          backgroundColor: 'white',
          paddingVertical: 24,
          }]}>
            <View style={styles.summaryBoxView}>
              <Text style={styles.leftText}>Base Labor Fee</Text>
              {summaryLoading ? (
                <Animated.View 
                style={{
                  backgroundColor: COLORS.strokes,
                  borderRadius: 8,
                  width: '20%',
                  opacity: skeletonOpacity,
                  height: '100%'
                }}/>
              ) : (
                <Text style={styles.righText}>{`\u20b1 ${reviewSummary?.booking?.price}`}</Text>
              )}
            </View>
            {/* <View style={styles.summaryBoxView}>
              <Text style={styles.leftText}>Complexity Fee</Text>
              <Text style={styles.righText}>{`\u20b1 ${200}`}</Text>
            </View> */}
            {/* <View style={styles.summaryBoxView}>
              <Text style={styles.leftText}>Transportation Fee</Text>
              <Text style={styles.righText}>{`\u20b1 ${100}`}</Text>
            </View> */}
          </View>

          {/* -------------------------------- E-Receipt ------------------------------- */}
          <View style={styles.summaryBox}>
          <Pressable 
            style={({pressed}) => [
              styles.summaryBoxPressable, {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
              justifyContent: 'center'
            }]}
            onPress={() => router.push({
              pathname: 'client-dashboard/e-receipt/[id]',
              params: {id: reviewSummary?.booking?.id}
            })}>
              <View style={{ alignItems: 'center' }}>
                <Text 
                  style={{
                    textAlign: 'center',
                    fontFamily: FONTS.roboto600,
                    fontSize: FONT_SIZES.md,
                    color: COLORS.primary,
                  }}
                  onLayout={(e) => {
                    // Optional: you can measure width dynamically here
                  }}
                >
                  View E-Receipt
                </Text>

                <View 
                  style={{
                    height: 2,
                    backgroundColor: COLORS.primary,
                    marginTop: 4,
                    width: '100%', 
                  }}
                />
              </View>
              
            </Pressable>
          </View>

        </ScrollView>

        {/* ------------------------------- Bottom Tab ------------------------------- */}
        <View
        style={{
          padding: 24,
          paddingBottom: 24 + insets.bottom,
          borderRadius: 24,
          backgroundColor: '#fff',
          gap: 12,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 6,
        }}>
          <View 
          style={{
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 12
          }}>
            <Text style={{
              fontFamily: FONTS.roboto700,
              fontSize: FONT_SIZES.lg,
              color: COLORS.labels
            }}>
              TOTAL
            </Text>
            {summaryLoading ? (
                <Animated.View 
                style={{
                  backgroundColor: COLORS.strokes,
                  borderRadius: 8,
                  width: '20%',
                  opacity: skeletonOpacity,
                  height: '100%'
                }}/>
              ) : (
                <Text style={{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.xl,
                  color: COLORS.primary
                }}>
                  {`\u20b1 ${reviewSummary?.booking?.price}`}
                </Text>
            )}
            
          </View>

          <MainButton 
          text={"Confirm Booking"}
          type="primary"
          loading={confirmLoading}
          onPress={handleConfirm}
          />
        </View>
      </View>
    </>
  )
}

const BackModal = ({visible, setVisible}) => {
  const router = useRouter();
  const { appointment, setAppointment } = useAppointment();
  const { token } = useAuth();

  const [findLoading,setFindLoading] = useState(false);
  const handleFindWorker = async () => {
    try {
      setFindLoading(true);

      console.log("1. Finding New Worker", appointment.id);

      const result = await axios.get(`${API_URL}/user/book/${appointment.id}/find_new_worker`, {
         headers: {
            'Authorization' : `Bearer ${token}`
         }
      })
      
      console.log("2. Found Worker?", result);

      const status = result?.data?.status || "error"
      const message = result?.data?.message

      if (status === "success") {
         console.log(result.data.data.workers);
         setAppointment(result.data.data.workers);
         router.replace('client-dashboard/appointment/searching');
      }
      else if (status === "failed" || status === "error")
         throw new Error(message)

    } catch (err) {
        const message = err?.message || "There is an unexpected error trying to find a new worker"
        console.log(message)
    } finally {
      setFindLoading(false);
    }
  }

  const [cancelLoading, setCancelLoading] = useState(false);
  const handleCancel = async () => {
    try {
      setCancelLoading(true);

      const result = await axios.delete(`${API_URL}/user/book/${appointment.id}/reject_booking`, {
         headers: {
            'Authorization' : `Bearer ${token}`
         }
      })
      
      const status = result?.data?.status || "error"
      const message = result?.data?.message

      if (status === "success") {
         console.log(result);
         router.replace('client-dashboard');
      }
      else if (status === "failed" || status === "error")
         throw new Error(message)

    } catch (err) {
      const message = err?.message || "There is an unexpected error trying to cancel the booking"
      console.log(message)
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <Modal
    visible={visible}
    statusBarTranslucent={true}
    backdropColor={COLORS.modalbg}>
      <View style={{flex: 1, position: 'relative', alignItems: 'center', justifyContent: 'center'}}>

        <Pressable
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        onPress={() => setVisible(false)}
        />

        <View style={[global.centerModal, {position: 'relative', zIndex: 2}]}>
          <Text style={{
            fontFamily: FONTS.roboto700,
            fontSize: FONT_SIZES.md,
            color: COLORS.red,
            textAlign: 'center',
          }}>
            Cancel Booking?
          </Text>

          <View style={global.divider}/>

          <Text style={{
            fontFamily: FONTS.roboto400,
            fontSize: FONT_SIZES.sm,
            color: COLORS.lettersicons,
            textAlign: 'center'
          }}>{`Are you sure you want to cancel this booking?\nYou can also choose another available service provider instead.`}</Text>

          <MainButton 
          text="Find Another Provider"
          type="primary"
          onPress={handleFindWorker}
          loading={findLoading}
          />

          <MainButton 
          text="Cancel Booking"
          type="secondary"
          onPress={handleCancel}
          loading={cancelLoading}
          />
        </View>

      </View>
    </Modal>
  )
}

const NoteModal = ({visible, setVisible, note}) => {
  return (
    <Modal
    visible={visible}
    statusBarTranslucent={true}
    backdropColor={COLORS.modalbg}>
      <View style={{flex: 1, position: 'relative', alignItems: 'center', justifyContent: 'center'}}>

        <Pressable
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        onPress={() => setVisible(false)}
        />

        <View style={global.centerModal}>
          <Text style={{
            fontFamily: FONTS.roboto700,
            fontSize: FONT_SIZES.md,
            color: COLORS.primary,
            textAlign: 'center',
          }}>
            Appointment Note
          </Text>

          <View style={global.divider}/>

          <Text style={{
            fontFamily: FONTS.roboto400,
            fontSize: FONT_SIZES.sm,
            color: COLORS.lettersicons,
            textAlign: 'center'
          }}>{note}</Text>

          <MainButton 
          text="Close"
          type="secondary"
          onPress={() => setVisible(false)}/>
        </View>

      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  summaryBox: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBlockColor: COLORS.labels,
    padding: 12,
    gap: 8
  },
  summaryBoxPressable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
    borderRadius: 8,
    padding: 12,
    // backgroundColor: 'green',
    // width: '100%'
  },
  summaryBoxView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 24,
    borderRadius: 8,
    paddingHorizontal: 12,
    // backgroundColor: 'green',
    // width: '100%'
  },
  left: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    // backgroundColor: 'red',
    height: '100%',
    flexGrow: 1,
    flexShrink: 1
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
    // backgroundColor: 'blue',
    height: '100%',
    flexGrow: 1,
    flexShrink: 1
  },
  leftText: {
    fontFamily: FONTS.roboto600,
    fontSize: FONT_SIZES.md,
    color: COLORS.labels,
  },
  righText: {
    fontFamily: FONTS.roboto600,
    fontSize: FONT_SIZES.md,
    color: COLORS.lettersicons
  }
})