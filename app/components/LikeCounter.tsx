// app/components/LikeCounter.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ensure you have Firebase configured


/////THIS IS YOU LIKEBUTOTON ON THE WATCH CARD



interface LikeCounterProps {
  watchId: string;
  initialLikes: number;
  initialIsLiked: boolean;
}

const LikeCounter: React.FC<LikeCounterProps> = ({
  watchId,
  initialLikes,
  initialIsLiked,
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const toggleLike = async () => {
    try {
      // Reference to the Firestore document for this watch
      const watchRef = doc(db, 'Watches', watchId);
      
      if (isLiked) {
        // Decrement like count when unliking
        await updateDoc(watchRef, { likes: increment(-1) });
        setLikeCount(likeCount - 1);
      } else {
        // Increment like count when liking
        await updateDoc(watchRef, { likes: increment(1) });
        setLikeCount(likeCount + 1);
      }
      
      // Toggle local like state
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating like count:', error);
    }
  };

  return (
    <TouchableOpacity onPress={toggleLike} style={styles.container} activeOpacity={0.7}>
      <Ionicons
        name={isLiked ? 'heart' : 'heart-outline'}
        size={25}
        color={isLiked ? '#fffff' : '#002d4e'}
      />
      <Text style={[styles.likeText, isLiked && styles.likedText]}>{likeCount}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Positioned in the top-right of the image container
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    // No background styling, for a clean look
  },
  likeText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002d4e',
  },
  likedText: {
    color: '#00000',
  },
});

export default LikeCounter;
