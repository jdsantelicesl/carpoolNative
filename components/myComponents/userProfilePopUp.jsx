import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Hr from './hr';
import Rating from './rating'
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const UserProfilePopUp = ({ userData, visible, onClose }) => {
  const [rating, setRating] = useState(null);
  const [numRatings, setNumRatings] = useState(null);
  const [reviews, setReviews] = useState(null);

  const url = process.env.EXPO_PUBLIC_API_URL; // placeholder

  useEffect(() => {
    const sendId = encodeURIComponent(userData.id);

    const sendUrl = url + `/user/getUser?client_id=${sendId}`

    axios.get(sendUrl)
      .then(response => {
        if (response.data.ratings) {
          setReviews(response.data.ratings);
          setNumRatings(response.data.ratings.length);

          // add up all ratings scores of each review
          const sumStars = response.data.ratings.reduce((accumulator, currentValue) => {
            return accumulator + (currentValue.stars || 0);
          }, 0);

          const averageStars = sumStars / response.data.ratings.length;
          setRating(averageStars);
        }
      })
      .catch(error => {
        console.log("error getUser: ", error);
      })


  }, []);


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
              <Text style={styles.userName}>{userData.name}</Text>
              <View style={styles.ratingsContainer}>
                {rating ?
                  <Rating style={styles.rating} size={3 * vh} rating={rating} total={numRatings} /> :
                  <Text> No rating yet </Text>}
              </View>
            </View>
          </View>

          {/* Separator */}
          <Hr style={styles.separator} />

          {/* Reviews section */}
          <Text style={styles.reviewsText}>Reviews:</Text>

          <FlatList
            scrollEnabled={true}
            data={reviews}
            renderItem={({ item }) => (
              <View style={{paddingVertical: .5*vh}}>
                <Text> {item.name}, rating:{item.stars}</Text>
                <Text> Content: {item.content} </Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            style={styles.list}
          />

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
