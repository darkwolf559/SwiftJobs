import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  Button, 
  Alert, 
  TouchableOpacity,
  Linking
} from 'react-native';

import axios from 'axios'; 
const openLink = (url) => {
  Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
};
const Company = ({navigation}) => {
  const defaultCompanyInfo = {
    name: 'Swift Jobs',
    services:'Designing/Developing',
    location: 'Sri Lanka',
    description: 'At Swift Jobs, we specialize in designing and developing high-quality mobile apps and websites that help businesses grow.',
    contactEmail: 'swiftjobcompanypvtltd@gmail.com',
    contactPhone: '+94 756349987',
    website: 'www.swiftjobsservices.com'
  };
  const [companyInfo, setCompanyInfo] = useState(defaultCompanyInfo);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const companyResponse = await axios.get('http://192.168.43.152:5000/api/company');
        setCompanyInfo(companyResponse.data || defaultCompanyInfo);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Unable to fetch company information');
        setCompanyInfo(defaultCompanyInfo);
      }
    };

    fetchCompanyData();
  }, []);

  const { name,services, location, description, contactEmail, contactPhone, website } = companyInfo;

  const defaultJobVacancies = [
    {
      id: '1',
      title: 'UI/UX Designing and Developing',
      company: 'SwiftJobs (pvt) Ltd, Sri Lanka',
      description: 'UI/UX designers create intuitive and visually appealing digital experiences by combining design aesthetics with user-centered principles.',
      salaryRange: 'LKR50,000 - LKR100,000',
      icon:"logo-windows"
    },
    {
      id: '2',
      title: 'Graphic Designing',
      company: 'SwiftJobs (pvt) Ltd, Sri Lanka',
      description: 'Swift Jobs is looking to hire talented designers to join our creative team! We seek passionate graphic designers who can craft visually stunning and user-friendly experiences.',
      salaryRange: 'LKR100,000 - LKR200,000',
      icon:"tv"
    }
  ];

  const [jobVacancies, setJobVacancies] = useState(defaultJobVacancies);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const companyResponse = await axios.get('http://192.168.43.152:5000/api/company');
        setCompanyInfo(companyResponse.data || defaultCompanyInfo);

        const jobsResponse = await axios.get('http://192.168.43.152:5000/api/jobs');
        setJobVacancies(jobsResponse.data || defaultJobVacancies);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Unable to fetch company information');
        setCompanyInfo(defaultCompanyInfo);
        setJobVacancies(defaultJobVacancies);
      }
    };

    fetchCompanyData();
  }, []);

  const handleApply = async (jobId) => {
    try {
      await axios.post('/api/apply', { jobId });
      Alert.alert('Success', 'Application submitted successfully');
    } catch (error) {
      console.error('Application error:', error);
      Alert.alert('Error', 'Unable to submit application');
    }
  };

  const renderJobCard = (job) => (
    <View key={job.id} style={styles.job}>
      <View style={styles.jobDetails}>
      <Icon
        name={job.icon}
        size={30}
        color="#357EC7"
      />
        <View>
        <TouchableOpacity onPress={() => navigation.navigate('JobSingle', { 
          jobId: job.id,
          companyInfo: {
            name: companyInfo.name,
            description: companyInfo.description,
            services: companyInfo.services,
            location: companyInfo.location,
            contactPhone: companyInfo.contactPhone,
            contactEmail: companyInfo.contactEmail,
            website: companyInfo.website
          }
        })}>
          <Text style={styles.overTopic}>{job.title}</Text>
          </TouchableOpacity>
          <Text style={styles.overFeature}>{job.company}</Text>
        </View>
      </View>
      <View style={styles.jobDescription}>
        <Text style={styles.des}>{job.description}</Text>
        <Text style={styles.salary}>{job.salaryRange}</Text>
        <Button 
          title='Apply' 
          onPress={() => handleApply(job.id)}
        />
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.container}>
            {/* Header */}
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
               <Text style={styles.headerTitle}>COMPANY</Text>
             </View>
             <View style={{width: 24, opacity: 0}} />
           </LinearGradient>
            </View>
      <Image 
        source={require('../assets/building.jpg')} 
        style={styles.headerImage} 
      />
      <View style={styles.card}>
        <Image 
          source={require('../assets/company.jpg')} 
          style={styles.logo} 
        />
        <View>
          <Text style={styles.companyName}>{companyInfo.name}</Text>
          <Text style={styles.location}>{companyInfo.location}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionAbout}>About Us</Text>
        <View style={styles.sectionContent}>
          <Text style={styles.description}>{companyInfo.description}</Text>
        </View>
      </View>
       <View style={{marginLeft:20}}>
      <View>
              <Text style={styles.overview}>COMPANY OVERVIEW</Text>
            </View>
          
            <View style={styles.details}>
            <Icon name="storefront" size={30} color="#601cd6" style={{ marginTop: 10 }} />
              <View>
                <Text style={styles.overTopic}>Services</Text>
                <Text style={styles.overFeature}>{companyInfo.services}</Text>
              </View>
            </View>
            
            <View style={styles.details}>

            <Icon name="location" size={30} color="#601cd6" style={{ marginTop: 10 }}/>
              <View>
                <Text style={styles.overTopic}>Location</Text>
                <Text style={styles.overFeature}>{companyInfo.location}</Text>
              </View>
            </View>
            
            <View style={styles.details}>

            <Icon name="call" size={30} color="#601cd6" style={{ marginTop: 10 }}/>
              <View>
                <Text style={styles.overTopic}>Phone Number</Text>
                <Text style={styles.overFeature}>{companyInfo.contactPhone}</Text>
              </View>
            </View>
            
            <View style={styles.details}>
            <Icon name="mail" size={30} color="#601cd6" style={{ marginTop: 10 }}/>
              <View>
                <Text style={styles.overTopic}>Email Address</Text>
                <Text style={styles.overFeature}>{companyInfo.contactEmail}</Text>
              </View>
            </View>
            
            <View style={styles.details}>
          
            <Icon name="logo-chrome" size={30} color="#601cd6" style={{ marginTop: 10 }}/>
              <View>
                <Text style={styles.overTopic}>Website</Text>
                <Text style={styles.overFeature}>{companyInfo.website}</Text>
              </View>
            </View>
            
            <View>
              <Text style={styles.overview}>SOCIAL PROFILE</Text>
            </View>
            
            <View>

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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>JOB VACANCIES</Text>
        {jobVacancies.map(renderJobCard)}
      </View>
     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',paddingHorizontal: 15,
  },
  backButton: {
    padding: 10,
  },
  searchButton: {
    padding: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,fontWeight: 'bold',},container: {flexGrow: 1,backgroundColor: '#f5f5f5',
  },
  headerImage: {width: '100%',height: 200,
  },
  card: {flexDirection: 'row',backgroundColor: '#fff', padding: 16,borderRadius: 15, elevation: 5,  width: 320,position: 'absolute',marginTop: 170,marginLeft: 33,
  },
  logo: {width: 40,height: 40,borderRadius: 10,marginRight: 10,
  },
  companyName: {fontSize: 16,fontWeight: 'bold',color: '#333',
  },
  overview: {
    fontSize: 20,marginTop: 20,fontWeight: 'bold',color: 'black',marginBottom: 10
  },
  details: {
    backgroundColor: 'white',width: 350,flexDirection: 'row',marginTop: 5,
  },
  over: {
    width: 30,height: 30,margin: 10,
  },
  overTopic: {
    marginTop: 10,marginLeft: 7,fontWeight: "bold",color: "black"
  },
  overFeature: {margin: 4,marginLeft: 7
  },
  social: {
    width: 30,height: 30,margin: 10,marginLeft: 25
  },
  location: {
    fontSize: 14,color: '#666',
  },
  job: {
    backgroundColor: 'white', width: '90%',borderRadius: 10,padding: 15,marginVertical: 10,
    elevation: 3,
  },
  jobDetails: {
    flexDirection: 'row',alignItems: 'center',marginBottom: 10,
  },
  jobDescription: {
    marginVertical: 10,
  },
  salary: {
    fontSize: 16, fontWeight: 'bold',color: 'black',marginBottom: 10,
  },
  

over:{
width:30,height:30,margin:10,marginLeft:40
},

overTopic:{marginTop:10,marginLeft:7,fontWeight:"bold",color:"black"
}
,
overFeature:{
  margin:4,
  marginLeft:7
  },

    des:{
      marginLeft:25,marginTop:10, marginBottom:20
    },
    container: {
      flexGrow: 1,backgroundColor: '#f5f5f5',
    },
    headerImage: {
      width: '100%',height: 200,
    },
    card: {
      flexDirection: 'row',backgroundColor: '#fff', padding: 16,
    borderRadius: 15, shadowColor: '#000',
      elevation: 5, width: 320, position: 'absolute',marginTop: 170,marginLeft: 33,
    },
    logo: {
      width: 40,height: 40,borderRadius: 10,marginRight: 10,
    },
    companyName: {
      fontSize: 16,fontWeight: 'bold',color: '#333',
    },
    location: {
      fontSize: 14,color: '#666',
    },
    section: {
      marginVertical: 15,
     
    },
    sectionTitle: {
      fontSize: 20,fontWeight: 'bold',color: 'black',marginBottom: 10,marginLeft:20
    },
    sectionAbout: {
      fontSize: 20,fontWeight: 'bold',color: 'black',marginBottom: 10,marginTop:50,marginLeft:20
    },
    sectionContent: {
      backgroundColor: 'white',borderRadius: 12,padding: 15,marginLeft:10
    },
    description: {
      fontSize: 16,
      color: '#333',
    },
    
    job: {
      backgroundColor: 'white',width: '90%',alignSelf: 'center',borderRadius: 10,padding: 15,marginVertical: 10,shadowColor: '#000',elevation: 3,
    },
    jobDetails: {flexDirection: 'row',alignItems: 'center',marginBottom: 10,
    },
   
    
    jobDescription: {marginVertical: 10,
    },
    
    salary: {fontSize: 16,fontWeight: 'bold',color: 'black',marginBottom: 10,
    }
});

export default Company;
