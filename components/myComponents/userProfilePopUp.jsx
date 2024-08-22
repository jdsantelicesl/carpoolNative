import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Dimensions, FlatList, Image, } from 'react-native';
import Hr from './hr';
import Rating from './rating'
import ReviewsObject from './reviewsObject';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import Loading from './loading';

import apiClient from '../../components/utilities/apiClient';

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const UserProfilePopUp = ({ userData, visible, onClose }) => {
  const [rating, setRating] = useState(null);
  const [numRatings, setNumRatings] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [school, setSchool] = useState(null);
  const [bio, setBio] = useState(null);

  const url = process.env.EXPO_PUBLIC_API_URL; // placeholder

  console.log("data passed", userData)

  useEffect(() => {
    const sendId = encodeURIComponent(userData.id);

    const sendUrl = url + `/user/getUser?client_id=${sendId}`

    apiClient.get(sendUrl)
      .then(response => {
        setSchool(response.data.school);
        setBio(response.data.bio);
        if (response.data.ratings) {
          setReviews(response.data.ratings);
          setNumRatings(response.data.ratings.length);

          // add up all ratings scores of each review
          const sumStars = response.data.ratings.reduce((accumulator, currentValue) => {
            return accumulator + (currentValue.stars || 0);
          }, 0);

          const averageStars = sumStars ? sumStars / response.data.ratings.length : 0;
          setRating(averageStars);
        }
      })
      .catch(error => {
        console.log("error getUser: ", error);
      })
  }, []);

  console.log(reviews)

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
            <View style={styles.profileContainer}>
              <FontAwesome name="user-circle" size={80} color="grey" />
              {userData.pfp ? (<Image style={styles.profile} source={{ uri: userData.pfp }} />) :
                (<FontAwesome name="user-circle" size={24} style={styles.icon} />)}
            </View>

            {/* Name and Ratings section */}
            <View style={styles.userInformation}>
              <Text style={styles.userName}>{userData.name}</Text>
              <View style={styles.ratingsContainer}>
                <Rating style={styles.rating} size={3 * vh} rating={rating} total={numRatings} />
              </View>
            </View>
          </View>

          <View style={styles.bio}>
            <Text style={styles.bioText}>{school}</Text>
            <Text style={styles.bioText}>{bio}</Text>
          </View>

          {/* Separator */}
          <Hr style={styles.hr} />

          {/* Reviews section */}

          {!rating == 0 ?
            (<FlatList
              scrollEnabled={true}
              data={reviews}
              renderItem={({ item }) => (
                <ReviewsObject
                  name={item.name}
                  stars={item.stars}
                  content={item.content}
                  style={styles.reviewsObject}

                />
              )}
              keyExtractor={(item, index) => index.toString()}
              style={styles.reviewList}
            />) :
            (<Loading text={"Rating feature not yet enabled, coming soon..."} />)
            }


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
    padding: 3 * vh,
    width: 92 * vw,
    height: 80 * vh,
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
    marginTop: 2 * vh,
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profile: {
    width: 10 * vh,
    height: 10 * vh,
    borderRadius: 5 * vh,
    position: 'absolute',
    borderColor: "black",
    borderWidth: 0.5 * vw
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
  hr: {
    marginTop: -1 * vh,
    marginBottom: 1 * vh,
    height: 0.2 * vh,
    width: 77 * vw,
    backgroundColor: "black",
  },
  reviewList: {
    flex: 1,
    flexDirection: "column",
    elevation: 10, // Increase elevation to ensure shadow visibility
    zIndex: 10, // Ensure this view stays on top of others on iOS
    overflow: 'visible', // Ensure the shadow is not clipped
  },
  closeButton: {
    marginHorizontal: 2*vw,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingVertical: 1.4 * vh,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 4 * vw,
  },
  reviewsObject: {
    width: "100%"
  },
  bio: {
    width: 50 * vw,
    marginLeft: 2 * vw,
    marginRight: 6 * vw,
    marginBottom: 4 * vh,
  },
  bioText: {
    color: "#6E6B6B",
    fontWeight: 'bold',
    fontSize: 2 * vh,
  },
});

export default UserProfilePopUp;
