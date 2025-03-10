import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Button,TextInput, Alert} from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Company from '../CompanyPage/company';
import axios from 'axios';



const JobSingle = () => {
  const [activeTab, setActiveTab] = useState('Description');
  const [jobData, setJobData] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [reviews, setReviews] = useState([]);

  const [ratingStats, setRatingStats] = useState({
    5: 150,
    4: 63,
    3: 15,
    2: 6,
    1: 20
  });


  const submitReview = () => {
    if (userRating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      name: 'User',
      rating: userRating,
      comment: userComment,
      date: new Date().toLocaleDateString(),
      avatar: null
    };

    setReviews([newReview, ...reviews]);
    
 
    setRatingStats(prevStats => ({
      ...prevStats,
      [userRating]: (prevStats[userRating] || 0) + 1
    }));
    
    
   
    setUserRating(0);
    setUserComment('');
    
    Alert.alert('Success', 'Your review has been submitted!');
  };

 
  const initial = {
    title: "Driving Vacancy",
    salary: "$75,000 - $90,000 a year",
    jobType: "Part Time",
    companyName: "Swift Jobs",
    companyLogo: require('./assets/company.jpg'),
    daysLeft: "10 Days Left",
    location: "Sri Lanka",
    qualifications: [
      "Valid Driver's License & Clean Driving Record: Must hold a current driver's license with a clean driving history and no major violations.",
      "Physical Fitness & Reliability: Ability to lift and carry packages, maintain a reliable work schedule, and ensure timely deliveries or passenger transport."
    ],
    aboutTheJob: [
      "Manage Daily Operations: Oversee the daily logistics and operations to ensure that products are delivered on time and in excellent condition.",
      "Customer Service Excellence: Interact with clients in a professional and friendly manner, addressing their concerns and ensuring satisfaction."
    ],
    responsibilities: [
      "Lead Delivery Teams: Supervise and guide delivery teams, ensuring that all drivers meet performance standards.",
      "Monitor Performance Metrics: Track and analyze performance metrics such as delivery times, customer feedback, and safety compliance."
    ]
  };

  useEffect(() => {
    setJobData(initial);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Description':
        return (
          <>
            <Text style={styles.topics}>Qualifications</Text>
            <View style={styles.card}>
              {jobData?.qualifications.map((point, index) => (
                <Text key={index} style={styles.points}>{`• ${point}`}</Text>
              ))}
            </View>
            
            <Text style={styles.topics}>About The Job</Text>
            <View style={styles.card}>
              {jobData?.aboutTheJob.map((point, index) => (
                <Text key={index} style={styles.points}>{`• ${point}`}</Text>
              ))}
            </View>
            
            <Text style={styles.topics}>Responsibilities</Text>
            <View style={styles.card}>
              {jobData?.responsibilities.map((point, index) => (
                <Text key={index} style={styles.points}>{`• ${point}`}</Text>
              ))}
            </View>
          </>
        );
        case 'Company':
          return (
           <Company/>
          );
          case 'Review':
            return (
              <View style={styles.reviewContainer}>
                
                <View style={styles.ratingStatsContainer}>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <View key={rating} style={styles.ratingRow}>
                      <View style={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                          <Text key={i} style={styles.starIcon}>
                            {i < rating ? '★' : '☆'}
                          </Text>
                        ))}
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View 
                          style={[
                            styles.progressBar, 
                            { 
                              width: `${(ratingStats[rating] / Object.values(ratingStats).reduce((a, b) => a + b, 0)) * 100}%`,
                              backgroundColor: '#9370DB' 
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.ratingCount}>{ratingStats[rating]}</Text>
                    </View>
                  ))}
                </View>
    
              
                <Text style={styles.yourRatingText}>YOUR RATING</Text>
                <View style={styles.userRatingContainer}>
                  <View style={styles.starRatingContainer}>
                    {[1, 2, 3, 4, 5].map(rating => (
                      <TouchableOpacity
                        key={rating}
                        onPress={() => setUserRating(rating)}
                        style={styles.ratingButton}
                      >
                        <Text style={styles.starIcon}>
                          {userRating >= rating ? '★' : '☆'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Enter your comment"
                    value={userComment}
                    onChangeText={setUserComment}
                    multiline
                  />
                  
                  <TouchableOpacity 
                    style={styles.submitButton}
                    onPress={submitReview}
                  >
                    <Text style={styles.submitButtonText}>SUBMIT</Text>
                  </TouchableOpacity>
                </View>
    
      
                <View style={styles.reviewsList}>
                  {reviews.length > 0 ? (
                    reviews.map(review => (
                      <View key={review.id} style={styles.reviewItem}>
                        <View style={styles.reviewHeader}>
                          <View style={styles.reviewerInfo}>
                            <View style={styles.avatarContainer}>
                            <Icon name="person-circle" size={30} color="#fff" />
                            </View>
                            <View>
                              <Text style={styles.reviewerName}>{review.name}</Text>
                              <Text style={styles.reviewDate}>{review.date}</Text>
                            </View>
                          </View>
                          <View style={styles.reviewRating}>
                            {[...Array(5)].map((_, i) => (
                              <Text key={i} style={styles.starIcon}>
                                {i < review.rating ? '★' : '☆'}
                              </Text>
                            ))}
                          </View>
                        </View>
                        <Text style={styles.reviewComment}>{review.comment}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noReviewsText}>No reviews available for this job posting yet. Be the first to review!</Text>
                  )}
                </View>
              </View>
            );
            default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <View style={styles.card}>
          <Icon name="car" size={30} color="#601cd6" style={{ marginLeft:137 }}/>
          <Text style={styles.title}>{jobData?.title}</Text>

          <View style={styles.row}>
            <Text style={styles.salary}>{jobData?.salary}</Text>
            <Text style={styles.fullTime}>{jobData?.jobType}</Text>
          </View>

          <View style={styles.divider} />
          <View style={styles.companyRow}>
            <Image source={jobData?.companyLogo} style={styles.companyLogo} />
            <Text style={styles.companyName}>{jobData?.companyName}</Text>
            <Text style={styles.daysLeft}>{jobData?.daysLeft}</Text>
          </View>
          
          <View style={styles.locationRow}>
            <Text style={styles.location}>{jobData?.location}</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          {['Description', 'Company','Review'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderTabContent()}
      </View>
      
      <View style={styles.bottom}>
        <TouchableOpacity><Icon name="bookmark" size={35} color="#601cd6" style={{ marginTop: 15,marginLeft:20 }}></Icon></TouchableOpacity>
        <View style={styles.button}>
          <Button title='APPLY' color={"#601cd6"}></Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: '#fff', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 5,
  },
  title: {
    fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: 5,
  },
  row: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  salary: {
    fontSize: 14, color: '#666', marginRight: 10,
  },
  fullTime: {
    backgroundColor: '#ddd', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, fontSize: 12, color: '#333',
  },
  divider: {
    height: 1,backgroundColor: '#ccc',marginVertical: 10,
  },
  companyRow: {
    flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
  },
  companyLogo: {
    width: 30, height: 30,marginTop:7
  },
  companyName: { fontSize: 16, fontWeight: 'bold', marginLeft: -130, marginTop: -14 },
  daysLeft: {
    fontSize: 12, color: '#888',
  },
  locationRow: { marginTop: -10 },
  location: {
    fontSize: 14, color: '#666', marginLeft: 40
  },
  topics: {
    color: "black", fontWeight: "bold", fontSize: 20, marginTop: 15, marginBottom: 14
  },
  tabContainer: {
    flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#f8f8f8', borderRadius: 8, padding: 5, marginBottom: 3, marginTop: 10
  },
  tab: {
    flex: 1,paddingVertical: 10,alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#7b5cff',borderRadius: 8,
  },
  tabText: {
    fontSize: 14,color: '#000',
  },
  activeTabText: {
    color: '#fff',fontWeight: 'bold',
  },
  points: {
    margin: 5
  },
  bottom: {
    flexDirection: "row",marginTop: 20
  },
  button: {
    marginTop: 19,marginLeft: 100,width: 200,color:"black"
  },
   reviewContainer: {
    marginTop: 15,
  },
  ratingStatsContainer: {
    backgroundColor: '#fff',padding: 15,borderRadius: 10,marginBottom: 20,shadowColor: '#000',shadowOpacity: 0.1,shadowRadius: 4,elevation: 3,
  },
  ratingRow: {
    flexDirection: 'row',alignItems: 'center',marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    width: 90,
  },
  starIcon: {
    fontSize: 18,
    color: '#FFD700',
  },
  progressBarContainer: {
    flex: 1,height: 10,backgroundColor: '#f0f0f0',borderRadius: 5,marginHorizontal: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  ratingCount: {
    width: 30,textAlign: 'right',color: '#666',
  },
  yourRatingText: {
    fontSize: 18,fontWeight: 'bold',marginBottom: 10,marginTop: 10,
  },
  userRatingContainer: {
    backgroundColor: '#fff',padding: 15,borderRadius: 10,marginBottom: 20,shadowColor: '#000',shadowOpacity: 0.1,shadowRadius: 4,elevation: 3,
  },
  starRatingContainer: {
    flexDirection: 'row',justifyContent: 'center',marginBottom: 15,
  },
  ratingButton: {
    padding: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',borderRadius: 5,padding: 10,minHeight: 80,textAlignVertical: 'top',marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#9370DB',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewsList: {
    marginTop: 20,
  },
  reviewItem: {
    backgroundColor: '#fff',padding: 15,borderRadius: 10,marginBottom: 15,shadowColor: '#000',shadowOpacity: 0.1,shadowRadius: 2,elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',justifyContent: 'space-between',marginBottom: 10,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,height: 40,borderRadius: 20,backgroundColor: '#9370DB',justifyContent: 'center',alignItems: 'center', marginRight: 10,
  },
  avatarText: {
    color: '#fff',fontWeight: 'bold',fontSize: 18,
  },
  reviewerName: {
    fontWeight: 'bold',fontSize: 16,
  },
  reviewDate: {
    color: '#888',fontSize: 12,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,lineHeight: 20,color: '#333',
  },
  noReviewsText: {
    textAlign: 'center',color: '#666',fontSize: 16,padding: 20,
  }
});

export default JobSingle;
