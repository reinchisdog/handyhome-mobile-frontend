import { StyleSheet, Text, View, ScrollView, Pressable, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '../../../../../../config';
import { useAppointment } from '../../../../../../context/AppointmentContext';
import { useAuth } from '../../../../../../context/AuthContext';
import { useRouter } from 'expo-router';

import MainButton from '../../../../../../components/MainButton';
import ErrorModal from '../../../../../../components/ErrorModal'

import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomIcons from '../../../../../../assets/customIcons';
import { globalStyles as global } from '../../../../../../styles/globalStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../../../../../styles/constants';

const AppointmentPayment = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { token } = useAuth();
  const { reviewSummary, fetchReviewSummary } = useAppointment();

  const [currPayment, setCurrPayment] = useState(null);
  useEffect(() => {
    if (reviewSummary) setCurrPayment(reviewSummary.booking.payment_method);
  }, [reviewSummary]);

  const [confirmDisabled, setConfirmDisabled] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleConfirmMethod = async () => {
    try {
      setConfirmLoading(true);
      const updatePaymentResult = await axios.put(`${API_URL}/user/book/${reviewSummary.booking.id}/update_payment_method/${currPayment}`, null, {
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      });
      console.log(updatePaymentResult)

      const updateReviewResult = await fetchReviewSummary(reviewSummary.booking.id);
      console.log(updateReviewResult);

      router.back();

    } catch (err) {
      showErrorModal("Payment Method Change Error", err.message);
    } finally {
      setConfirmLoading(false);
    }
  }

  useEffect(() => {
    if (currPayment !== reviewSummary.booking.payment_method) 
      setConfirmDisabled(false);
    else 
      setConfirmDisabled(true)
  }, [currPayment, reviewSummary])

  const [errorModal, setErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const showErrorModal = (title, message) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setErrorModal(true);
  }

  return (
    <>
      <ErrorModal 
      visible={errorModal}
      setVisible={setErrorModal}
      title={errorTitle}
      message={errorMessage}
      />

      <View style={global.screenContainer}>
        <ScrollView
        style={[global.screenContainer, {backgroundColor: '#fff', }]}
        contentContainerStyle={{
          padding: 24,
          gap: 24,
          position:'relative'
        }}>
          {/* ---------------------------------- Cash ---------------------------------- */}
          <View style={styles.paymentSection}>
            <Text style={styles.paymentTitle}>Cash</Text>
            <Pressable 
            onPress={() => setCurrPayment("Cash")}
            style={({pressed}) => [
              styles.paymentBox, {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white'
            }]}>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center'
              }}>
                <Icons name='cash-multiple' size={24} color={COLORS.primary}/>
                <Text style={styles.paymentName}>Cash</Text>
              </View>

              <View 
              style={{
                height: 22,
                width: 22,
                aspectRatio: '1/1',
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderColor: '#3A454D',
                borderRadius: 22,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {currPayment === "Cash" &&
                  <View style={{
                  height: 16,
                  width: 16,
                  backgroundColor: COLORS.accent,
                  borderRadius: 8,
                }}/>}
              </View>

            </Pressable>
          </View>

          {/* ----------------------------- Other Payments ----------------------------- */}
          <View style={styles.paymentSection}>
            <Text style={styles.paymentTitle}>More Payment Options</Text>
            <Pressable 
            onPress={() => setCurrPayment("GCash")}
            style={({pressed}) => [
              styles.paymentBox, {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white'
            }]}>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center'
              }}>
                <CustomIcons name='gcash' size={24} color={COLORS.primary}/>
                <Text style={styles.paymentName}>GCash</Text>
              </View>

              <View 
              style={{
                height: 22,
                width: 22,
                aspectRatio: '1/1',
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderColor: '#3A454D',
                borderRadius: 22,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {currPayment === "GCash" &&
                  <View style={{
                  height: 16,
                  width: 16,
                  backgroundColor: COLORS.accent,
                  borderRadius: 8,
                }}/>}
              </View>

            </Pressable>
          </View>

        </ScrollView>
        {/* --------------------------------- Buttons -------------------------------- */}
        <View style={[global.buttonsContainer, {backgroundColor: '#fff', paddingBottom: insets.bottom}]}>
          <MainButton 
          text="Confirm Method"
          type="primary"
          onPress={handleConfirmMethod}
          disabled={confirmDisabled}
          loading={confirmLoading}
          />
        </View>
      </View>
    </>
  )
}

export default AppointmentPayment

const styles = StyleSheet.create({
  paymentSection: {
    gap: 16
  },
  paymentTitle: {
    fontFamily: FONTS.roboto700,
    fontSize: FONT_SIZES.lg,
    color: COLORS.lettersicons
  },
  paymentBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: COLORS.strokes,
    borderWidth: 1,
    borderRadius: 8
  },
  paymentName: {
    fontFamily: FONTS.roboto500,
    fontSize: FONT_SIZES.md,
    color: COLORS.lettersicons
  }
})