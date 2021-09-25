import React from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableHighlight,
  StatusBar
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import {Styles} from './style'; 
import Carousel, { Pagination } from 'react-native-snap-carousel';
// import { getIngredientName, getCategoryName, getCategoryById } from '../../data/MockDataAPI';
// import BackButton from '../../components/BackButton/BackButton';
// import ViewIngredientsButton from '../../components/ViewIngredientsButton/ViewIngredientsButton';

const { width: viewportWidth } = Dimensions.get('window'); 
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;
const ENTRIES1 = [
    {
        title: 'Beautiful and dramatic Antelope Canyon',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/UYiroysl.jpg'
    },
    {
        title: 'Earlier this morning, NYC',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/UPrs1EWl.jpg'
    },
    {
        title: 'White Pocket Sunset',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
        illustration: 'https://i.imgur.com/MABUbpDl.jpg'
    },
    {
        title: 'Acrocorinth, Greece',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/KZsmUi2l.jpg'
    },
    {
        title: 'The lone tree, majestic landscape of New Zealand',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/2nCt3Sbl.jpg'
    },
    {
        title: 'Middle Earth, Germany',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/lceHsT6l.jpg'
    }
];
function StatusBarPlaceHolder() {
    return (
        <View style={{
            width: "100%",
            height: STATUS_BAR_HEIGHT,
            backgroundColor: '#F3F3F3',
        }}>
            <StatusBar
            // barStyle="light-content"

            />
        </View>
    );
}
export default class HomeScreen extends React.Component {
  

  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0
    };
  }

 
  renderImage = ({ item }) => (
    <TouchableHighlight>
      <View style={Styles.imageContainer}>
        <Image style={Styles.image} source={{ uri: item.illustration }} />
      </View>
    </TouchableHighlight>
  );

  render() {
    const { activeSlide } = this.state;
    const { navigation } = this.props;
   
    return (
        <View style={Styles.container}>
        <StatusBarPlaceHolder />
        <View
            style={Styles.HeaderContent}>
            <View
                style={Styles.HeaderFirstView}>
                <TouchableOpacity
                    style={Styles.HeaderMenuicon}
                    onPress={() => { Actions.drawerOpen(); }}>
                    <Image resizeMode="contain" style={Styles.HeaderMenuiconstyle}
                        source={require('../../../assets/images/menu_b.png')}>
                    </Image>
                </TouchableOpacity>
                <View
                    style={Styles.HeaderTextView}>
                    <Text
                        style={Styles.HeaderTextstyle}>
                        MY PANEL
                    </Text>
                </View>
            </View>
        </View>
       
      <ScrollView style={Styles.container}>
        <View style={Styles.carouselContainer}>
        <Carousel
              ref={c => {
                this.slider1Ref = c;
              }}
              data={ENTRIES1}
              renderItem={this.renderImage}
              sliderWidth={viewportWidth}
              itemWidth={viewportWidth}
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
              firstItem={0}
              loop={false}
              autoplay={false}
              autoplayDelay={500}
              autoplayInterval={3000}
              onSnapToItem={index => this.setState({ activeSlide: index })}
            />
            <Pagination
              dotsLength={ENTRIES1.length}
              activeDotIndex={activeSlide}
              containerStyle={Styles.paginationContainer}
              dotColor="rgba(255, 255, 255, 0.92)"
              dotStyle={Styles.paginationDot}
              inactiveDotColor="white"
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
              carouselRef={this.slider1Ref}
              tappableDots={!!this.slider1Ref}
            />
        </View>
        <View style={Styles.infoRecipeContainer}>
          <Text style={Styles.infoRecipeName}>Heading</Text>
          <View style={Styles.infoContainer}>
            <TouchableHighlight
              onPress={() => console.log("GO")}
            >
              <Text style={Styles.category}>Test Name</Text>
            </TouchableHighlight>
          </View>

          <View style={Styles.infoContainer}>
            <Image style={Styles.infoPhoto} source={require('../../../assets/images/menu_b.png')} />
            <Text style={Styles.infoRecipe}>20 minutes </Text>
          </View>

         
          <View style={Styles.infoContainer}>
            <Text style={Styles.infoDescriptionRecipe}>This is a demo text here</Text>
          </View>
          </View>
      </ScrollView>
      </View>
    );
  }
}