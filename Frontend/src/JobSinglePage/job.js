import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Button,TextInput, Alert} from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Company from '../CompanyPage/company';
import axios from 'axios';
import { Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const JobSingle = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState('Description');
  const [jobData, setJobData] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const { jobId, companyInfo } = route.params || { jobId: null, companyInfo: {} };
  const [ratingStats, setRatingStats] = useState({
    5: 150,
    4: 63,
    3: 15,
    2: 6,
    1: 20
  });

  const openLink = (url) => {
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Failed to open link'));
  };
  
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

    setReviews((prevReviews) => [newReview, ...prevReviews]);

    
 
    setRatingStats((prevStats) => ({
      ...prevStats,
      [userRating]: (prevStats[userRating] || 0) + 1,
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
    companyLogo: require('../assets/company.jpg'),
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
            <View style={styles.companyTabContainer}>
            {/* About Us Section */}
            <View style={styles.section}>
              <Text style={styles.sectionAbout}>About Us</Text>
              <View style={styles.sectionContent}>
                <Text style={styles.description}>{companyInfo?.description || 'Company description not available'}</Text>
              </View>
            </View>
            
            {/* Company Overview Section */}
            <View style={{marginLeft: 20}}>
              <View>
                <Text style={styles.overview}>COMPANY OVERVIEW</Text>
              </View>
              
              <View style={styles.details}>
                <Icon name="storefront" size={30} color="#601cd6" style={{ marginTop: 10 }} />
                <View>
                  <Text style={styles.overTopic}>Services</Text>
                  <Text style={styles.overFeature}>{companyInfo?.services || 'Service information not available'}</Text>
                </View>
              </View>
              
              <View style={styles.details}>
                <Icon name="location" size={30} color="#601cd6" style={{ marginTop: 10 }}/>
                <View>
                  <Text style={styles.overTopic}>Location</Text>
                  <Text style={styles.overFeature}>{companyInfo?.location || 'Location not available'}</Text>
                </View>
              </View>
              
              <View style={styles.details}>
                <Icon name="call" size={30} color="#601cd6" style={{ marginTop: 10 }}/>
                <View>
                  <Text style={styles.overTopic}>Phone Number</Text>
                  <Text style={styles.overFeature}>{companyInfo?.contactPhone || 'Phone number not available'}</Text>
                </View>
              </View>
              
              <View style={styles.details}>
                <Icon name="mail" size={30} color="#601cd6" style={{ marginTop: 10 }}/>
                <View>
                  <Text style={styles.overTopic}>Email Address</Text>
                  <Text style={styles.overFeature}>{companyInfo?.contactEmail || 'Email not available'}</Text>
                </View>
              </View>
              
              <View style={styles.details}>
                <Icon name="logo-chrome" size={30} color="#601cd6" style={{ marginTop: 10 }}/>
                <View>
                  <Text style={styles.overTopic}>Website</Text>
                  <Text style={styles.overFeature}>{companyInfo?.website || 'Website not available'}</Text>
                </View>
              </View>
              
              {/* Social Profile Section */}
              <View>
                <Text style={styles.overview}>SOCIAL PROFILE</Text>
              </View>
              
              <View style={styles.details}>
                <TouchableOpacity onPress={() => openLink('https://www.linkedin.com/swiftjobs')}>
                  <Icon name="logo-linkedin" size={35} color="#0077B5" style={{ marginTop: 10,marginLeft:30 }}/>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => openLink('https://twitter.com/swiftjobs')}>
                  <Icon name="logo-twitter" size={35} color="#1DA1F2" style={{ marginTop: 10,marginLeft:30}}/>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => openLink('https://wa.me/94751239976')}>
                  <Icon name="logo-whatsapp" size={35} color="#128C7E" style={{ marginTop: 10,marginLeft:30}}/>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => openLink('https://youtube.com/swiftjobs')}>
                  <Icon name="logo-youtube" size={35} color="#FF0000" style={{ marginTop: 10,marginLeft:30}}/>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => openLink('https://www.facebook.com/swiftjobs')}>
                  <Icon name="logo-facebook" size={35} color="#1877F2" style={{ marginTop: 10,marginLeft:30}}/>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
      <LinearGradient 
  colors={["#623AA2", "#F97794"]} 
  style={styles.header}
>
  <TouchableOpacity 
    style={styles.backButton} 
    onPress={() => navigation.goBack()}
  >
    <Icon name="arrow-back" size={24} color="white" />
  </TouchableOpacity>
  <View style={styles.headerCenter}>
    <Text style={styles.headerTitle}>JOB SINGLE</Text>
  </View>
  <View style={{width: 24, opacity: 0}} />
</LinearGradient>
      </View>
      <View style={{marginLeft:15}}>
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
      
      <View style={styles.bottomContainer}>
  <TouchableOpacity style={styles.bookmarkButton}>
    <Icon name="bookmark" size={40} color="#601cd6" />
  </TouchableOpacity>
  
  <TouchableOpacity style={styles.applyButton}>
    <Text style={styles.applyButtonText}>APPLY</Text>
  </TouchableOpacity>
</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    height: 60,
    flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',paddingHorizontal: 15,
  },
  backButton: {
    padding: 10,
  },
 
  headerTitle: {
    color: '#fff',
    fontSize: 18,fontWeight: 'bold',},container: {flexGrow: 1,backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 5,
  },
  title: {
    fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: 5,},
  row: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10,},
  salary: {fontSize: 14, color: '#666', marginRight: 10,},
  fullTime: {backgroundColor: '#ddd', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, fontSize: 12, color: '#333',},
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
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 15,
  },
  bookmarkButton: {
    width: 50,
    height: 50,
    
  },
  applyButton: {
    width: '70%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#601cd6',
    justifyContent: 'center',
    alignItems: 'center',

  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  ratingCount: {width: 30,textAlign: 'right',color: '#666',},
  yourRatingText: {fontSize: 18,fontWeight: 'bold',marginBottom: 10,marginTop: 10,},
  userRatingContainer: {backgroundColor: '#fff',padding: 15,borderRadius: 10,marginBottom: 20,shadowColor: '#000',shadowOpacity: 0.1,shadowRadius: 4,elevation: 3,},
  starRatingContainer: {
    flexDirection: 'row',justifyContent: 'center',marginBottom: 15,
  },
  ratingButton: {
    padding: 10,
  },
  commentInput: {
    borderWidth: 1,borderColor: '#ddd',borderRadius: 5,padding: 10,minHeight: 80,textAlignVertical: 'top',marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#9370DB',borderRadius: 5,padding: 15,alignItems: 'center',
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
  avatarContainer: {width: 40,height: 40,borderRadius: 20,backgroundColor: '#9370DB',justifyContent: 'center',alignItems: 'center', marginRight: 10,},
  avatarText: {
    color: '#fff',fontWeight: 'bold',fontSize: 18,
  },
  reviewerName: {
    fontWeight: 'bold',fontSize: 16,
  },
  reviewDate: {color: '#888',fontSize: 12,},
  reviewRating: {flexDirection: 'row',},
  reviewComment: {fontSize: 14,lineHeight: 20,color: '#333',},
  noReviewsText: {
    textAlign: 'center',color: '#666',fontSize: 16,padding: 20,
  },
  companyTabContainer: {
    padding: 10,marginLeft:-23
  },
  section: {
    marginVertical: 15,
  },
  sectionAbout: {fontSize: 20,fontWeight: 'bold',color: 'black',marginBottom: 10,marginTop: 10,marginLeft: 20},
  sectionContent: {backgroundColor: 'white',borderRadius: 12,padding: 15,marginLeft: 10},
  description: {fontSize: 16,color: '#333',},
  overview: {fontSize: 20,marginTop: 20,fontWeight: 'bold',color: 'black',marginBottom: 10},
  details: {backgroundColor: 'white',width: 350,flexDirection: 'row',marginTop: 5,},
  overTopic: {marginTop: 10,marginLeft: 7,fontWeight: "bold",color: "black"},
  overFeature: {margin: 4,marginLeft: 7},
});

export default JobSingle;

