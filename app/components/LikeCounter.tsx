// app/components/LikeCounter.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useFavorites } from '../context/FavoritesContext';
import { Watch } from '../types/Watch';

interface LikeCounterProps {
  watch: Watch; // Full watch object
  initialLikes: number;
}

const LikeCounter: React.FC<LikeCounterProps> = ({ watch, initialLikes }) => {
  const [likeCount, setLikeCount] = useState(initialLikes);
  const { addFavorite, isFavorite } = useFavorites();

  // Determine if this watch is already liked (favorited)
  const liked = isFavorite(watch.id);

  const toggleLike = async () => {
    if (liked) return; // Prevent additional likes if already liked

    try {
      // Update the like count in Firestore
      const watchRef = doc(db, 'Watches', watch.id);
      await updateDoc(watchRef, { likes: increment(1) });
      setLikeCount(likeCount + 1);

      // Add the watch to favorites in the global context (and AsyncStorage)
      addFavorite(watch);
    } catch (error) {
      console.error('Error updating like count:', error);
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleLike}
      style={styles.container}
      activeOpacity={0.7}
      disabled={liked} // Disable if already liked
    >
      <Ionicons
        name={liked ? 'heart' : 'heart-outline'}
        size={25}
        color={liked ? '#ff0000' : '#002d4e'}
      />
      <Text style={[styles.likeText, liked && styles.likedText]}>{likeCount}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Positioned at the top-right of the image container
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002d4e',
  },
  likedText: {
    color: '#ff0000',
  },
});

export default LikeCounter;
