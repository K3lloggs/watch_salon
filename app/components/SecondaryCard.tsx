// components/SecondaryCard.tsx
import React, { useState } from 'react';
import { 
   View, 
   Image, 
   ScrollView, 
   StyleSheet, 
   Dimensions,
   Text 
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SecondaryCardProps {
   watch: {
    id: string;
    brand: string;
    model: string;
    price: number;
    image: string[];
    year?: string;
    box?: boolean;
    papers?: boolean;
    caseMaterial?: string;
    caseDiameter?: string;
    [key: string]: any
   };
}

export function SecondaryCard({ watch }: SecondaryCardProps) {
   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const images = Array.isArray(watch.image) ? watch.image : [watch.image];

   const handleScroll = (event: any) => {
       const offset = event.nativeEvent.contentOffset.x;
       const pageIndex = Math.round(offset / SCREEN_WIDTH);
       setCurrentImageIndex(pageIndex);
   };

   return (
       <View style={styles.container}>
           <ScrollView
               horizontal
               pagingEnabled
               showsHorizontalScrollIndicator={false}
               onMomentumScrollEnd={handleScroll}
               decelerationRate="fast"
               snapToInterval={SCREEN_WIDTH}
           >
               {images.map((imageUrl, index) => (
                   <View key={index} style={styles.imageContainer}>
                       <Image
                           source={{ uri: imageUrl }}
                           style={styles.image}
                           resizeMode="cover"
                       />
                   </View>
               ))}
           </ScrollView>

           {images.length > 1 && (
               <View style={styles.pagination}>
                   {images.map((_, index) => (
                       <View
                           key={index}
                           style={[
                               styles.paginationDot,
                               index === currentImageIndex && styles.paginationDotActive
                           ]}
                       />
                   ))}
               </View>
           )}
       </View>
   );
}

const styles = StyleSheet.create({
   container: {
       width: '100%',
       height: SCREEN_WIDTH,
       backgroundColor: '#fff',
       position: 'relative',
   },
   imageContainer: {
       width: SCREEN_WIDTH,
       height: '100%',
   },
   image: {
       width: '100%',
       height: '100%',
   },
   pagination: {
       position: 'absolute',
       bottom: 20,
       left: 0,
       right: 0,
       flexDirection: 'row',
       justifyContent: 'center',
       gap: 8,
   },
   paginationDot: {
       width: 8,
       height: 8,
       borderRadius: 4,
       backgroundColor: 'rgba(255, 255, 255, 0.5)',
   },
   paginationDotActive: {
       backgroundColor: '#ffffff',
       width: 10,
       height: 10,
       borderRadius: 5,
   },

});