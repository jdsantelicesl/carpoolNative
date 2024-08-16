import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Hr from './hr'; 

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const UserProfilePopUp = ({ name, reviews, ratings, visible, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.topContainer}>
            {/* Profile section */}
            <View style={styles.profile}>
              <FontAwesome name="user-circle" size={80} color="grey" />
            </View>

            {/* Name and Ratings section */}
            <View style={styles.userInformation}>
              <Text style={styles.userName}>{name}</Text>
              <View style={styles.ratingsContainer}>
                <FontAwesome name="star" size={20} color="gold" />
                <Text style={styles.ratingsText}>{ratings}</Text>
              </View>
            </View>
          </View>

          {/* Separator */}
          <Hr style={styles.separator} />

          {/* Reviews section */}
          <Text style={styles.reviewsText}>Reviews: {reviews}</Text>

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 2 * vh,
    padding: 4 * vh,
    width: 90 * vw,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  topContainer: {
    flexDirection: 'row',
    marginBottom: 2 * vh,
  },
  profile: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInformation: {
    flex: 2,
    justifyContent: 'center',
    paddingLeft: 2 * vw,
  },
  userName: {
    fontSize: 5 * vw,
    fontWeight: 'bold',
    marginBottom: 1 * vh,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingsText: {
    fontSize: 4 * vw,
    marginLeft: 1 * vw,
  },
  separator: {
    marginVertical: 1 * vh,
  },
  reviewsText: {
    fontSize: 4 * vw,
    marginBottom: 2 * vh,
  },
  closeButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 1.5 * vh,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 3 * vw,
  },
});

export default UserProfilePopUp;
