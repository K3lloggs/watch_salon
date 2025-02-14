// app/components/LikeList.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

interface LikeListProps {
  watchId: string;
  initialLikes: number;
}

export const LikeList: React.FC<LikeListProps> = ({ 
  watchId,
  initialLikes
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    try {
      const watchRef = doc(db, 'Watches', watchId);
      
      if (!isLiked) {
        await updateDoc(watchRef, {
          likes: increment(1)
        });
        setLikes(prev => prev + 1);
        setIsLiked(true);
      } else {
        await updateDoc(watchRef, {
          likes: increment(-1)
        });
        setLikes(prev => prev - 1);
        setIsLiked(false);
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}m`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <TouchableOpacity onPress={handleLike}>
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={15}
            color="#002d4e"
            style={styles.icon}
          />
          <Text style={styles.likeText}>
            {formatCount(likes)}
            <Text style={styles.label}> likes</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    width: 'auto',
    alignSelf: 'flex-start',
    position: 'absolute',
    right: 0,
    bottom: 8,
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 6,
    opacity: .9,
    color: '#002d4e',
  },
  likeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#002d4e',
    letterSpacing: -0.3,
  },
  label: {
    fontWeight: '400',
    color: '#002d4e',
    opacity: 0.7,
  },
});