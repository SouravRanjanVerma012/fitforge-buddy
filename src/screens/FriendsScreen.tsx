import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFriends, useFriendRequests, useSendFriendRequest, useAcceptFriendRequest } from '../hooks/useUniversalData';

const FriendsScreen: React.FC = () => {
  const { data: friends, isLoading: friendsLoading, refetch: refetchFriends } = useFriends();
  const { data: friendRequests, isLoading: requestsLoading, refetch: refetchRequests } = useFriendRequests();
  const sendFriendRequestMutation = useSendFriendRequest();
  const acceptFriendRequestMutation = useAcceptFriendRequest();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'discover'>('friends');

  const handleSendFriendRequest = (friendId: string) => {
    sendFriendRequestMutation.mutate(friendId, {
      onSuccess: () => {
        Alert.alert('Success', 'Friend request sent!');
      },
      onError: (error) => {
        Alert.alert('Error', 'Failed to send friend request. Please try again.');
        console.error('Send friend request error:', error);
      }
    });
  };

  const handleAcceptRequest = (requestId: string) => {
    acceptFriendRequestMutation.mutate(requestId, {
      onSuccess: () => {
        Alert.alert('Success', 'Friend request accepted!');
        refetchFriends();
        refetchRequests();
      },
      onError: (error) => {
        Alert.alert('Error', 'Failed to accept friend request. Please try again.');
        console.error('Accept friend request error:', error);
      }
    });
  };

  const renderFriend = ({ item }: { item: any }) => (
    <View style={styles.friendCard}>
      <View style={styles.friendAvatar}>
        <Text style={styles.friendAvatarText}>
          {item.name?.charAt(0)?.toUpperCase() || 'U'}
        </Text>
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name || 'Unknown User'}</Text>
        <Text style={styles.friendStatus}>
          {item.isOnline ? '🟢 Online' : '⚪ Offline'}
        </Text>
        <Text style={styles.friendStats}>
          {item.workoutsThisWeek || 0} workouts this week
        </Text>
      </View>
      <TouchableOpacity style={styles.friendAction}>
        <Text style={styles.friendActionText}>Message</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFriendRequest = ({ item }: { item: any }) => (
    <View style={styles.requestCard}>
      <View style={styles.friendAvatar}>
        <Text style={styles.friendAvatarText}>
          {item.sender?.name?.charAt(0)?.toUpperCase() || 'U'}
        </Text>
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.sender?.name || 'Unknown User'}</Text>
        <Text style={styles.requestMessage}>Wants to be your friend</Text>
        <Text style={styles.requestTime}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity 
          style={[styles.requestButton, styles.acceptButton]}
          onPress={() => handleAcceptRequest(item.id)}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.requestButton, styles.declineButton]}>
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDiscoverUser = ({ item }: { item: any }) => (
    <View style={styles.discoverCard}>
      <View style={styles.friendAvatar}>
        <Text style={styles.friendAvatarText}>
          {item.name?.charAt(0)?.toUpperCase() || 'U'}
        </Text>
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name || 'Unknown User'}</Text>
        <Text style={styles.friendStats}>
          {item.totalWorkouts || 0} total workouts
        </Text>
        <Text style={styles.friendStats}>
          {item.workoutStreak || 0} day streak
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.addFriendButton}
        onPress={() => handleSendFriendRequest(item.id)}
      >
        <Text style={styles.addFriendButtonText}>Add Friend</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabButton = (tab: 'friends' | 'requests' | 'discover', title: string, count?: number) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>
        {title}
      </Text>
      {count !== undefined && count > 0 && (
        <View style={styles.tabBadge}>
          <Text style={styles.tabBadgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (friendsLoading || requestsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading friends...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {renderTabButton('friends', 'Friends', friends?.length)}
        {renderTabButton('requests', 'Requests', friendRequests?.length)}
        {renderTabButton('discover', 'Discover')}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'friends' && (
          <>
            <Text style={styles.sectionTitle}>Your Friends</Text>
            {friends && friends.length > 0 ? (
              <FlatList
                data={friends}
                renderItem={renderFriend}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>👥</Text>
                <Text style={styles.emptyStateText}>No friends yet</Text>
                <Text style={styles.emptyStateSubtext}>Discover and add friends to see them here!</Text>
              </View>
            )}
          </>
        )}

        {activeTab === 'requests' && (
          <>
            <Text style={styles.sectionTitle}>Friend Requests</Text>
            {friendRequests && friendRequests.length > 0 ? (
              <FlatList
                data={friendRequests}
                renderItem={renderFriendRequest}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📨</Text>
                <Text style={styles.emptyStateText}>No pending requests</Text>
                <Text style={styles.emptyStateSubtext}>You're all caught up!</Text>
              </View>
            )}
          </>
        )}

        {activeTab === 'discover' && (
          <>
            <Text style={styles.sectionTitle}>Discover People</Text>
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🔍</Text>
              <Text style={styles.emptyStateText}>Discover feature coming soon</Text>
              <Text style={styles.emptyStateSubtext}>We're working on bringing you more ways to connect with fitness buddies!</Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    position: 'relative',
  },
  tabButtonActive: {
    backgroundColor: '#3b82f6',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  tabBadge: {
    position: 'absolute',
    top: 4,
    right: 8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  friendAvatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  friendStatus: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  friendStats: {
    fontSize: 12,
    color: '#94a3b8',
  },
  friendAction: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  friendActionText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  requestMessage: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  requestTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  requestActions: {
    flexDirection: 'row',
  },
  requestButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  acceptButton: {
    backgroundColor: '#10b981',
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  declineButton: {
    backgroundColor: '#f1f5f9',
  },
  declineButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  discoverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  addFriendButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addFriendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

export default FriendsScreen; 