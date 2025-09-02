import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  onSnapshot,
  getDocs 
} from 'firebase/firestore';
import { db } from './firebase';

// Collection reference
const VOTES_COLLECTION = 'freedom_fighter_votes';

// Interface for vote data
export interface VoteData {
  fighterId: string;
  count: number;
  lastUpdated: Date;
}

// Get all votes (real-time listener)
export const subscribeToVotes = (callback: (votes: Record<string, number>) => void) => {
  const votesCollection = collection(db, VOTES_COLLECTION);
  
  return onSnapshot(votesCollection, (snapshot) => {
    const votes: Record<string, number> = {};
    
    console.log(`📊 Firebase: Received ${snapshot.docs.length} vote documents`);
    
    snapshot.forEach((doc) => {
      const data = doc.data() as VoteData;
      votes[data.fighterId] = data.count || 0;
    });
    
    console.log('📊 Current votes from Firebase:', votes);
    callback(votes);
  }, (error) => {
    console.error('Error listening to votes:', error);
    // Fallback to localStorage if Firebase fails
    const savedVotes = localStorage.getItem('independenceday-votes');
    if (savedVotes) {
      callback(JSON.parse(savedVotes));
    }
  });
};

// Get votes once (without real-time updates)
export const getAllVotes = async (): Promise<Record<string, number>> => {
  try {
    const votesCollection = collection(db, VOTES_COLLECTION);
    const snapshot = await getDocs(votesCollection);
    
    const votes: Record<string, number> = {};
    snapshot.forEach((doc) => {
      const data = doc.data() as VoteData;
      votes[data.fighterId] = data.count || 0;
    });
    
    return votes;
  } catch (error) {
    console.error('Error fetching votes:', error);
    // Fallback to localStorage
    const savedVotes = localStorage.getItem('independenceday-votes');
    return savedVotes ? JSON.parse(savedVotes) : {};
  }
};

// Cast a vote for a freedom fighter
export const castVote = async (fighterId: string): Promise<boolean> => {
  try {
    console.log(`🗳️ Casting vote for: ${fighterId}`);
    const voteDoc = doc(db, VOTES_COLLECTION, fighterId);
    
    // Check if document exists
    const docSnapshot = await getDoc(voteDoc);
    
    if (docSnapshot.exists()) {
      console.log(`📈 Updating existing vote count for ${fighterId}`);
      // Update existing vote count
      await updateDoc(voteDoc, {
        count: increment(1),
        lastUpdated: new Date()
      });
    } else {
      console.log(`🆕 Creating new vote document for ${fighterId}`);
      // Create new vote document
      await setDoc(voteDoc, {
        fighterId,
        count: 1,
        lastUpdated: new Date()
      });
    }
    
    console.log(`✅ Vote cast successfully for ${fighterId}`);
    return true;
  } catch (error) {
    console.error('Error casting vote:', error);
    
    // Fallback: save to localStorage
    const savedVotes = localStorage.getItem('independenceday-votes');
    const votes = savedVotes ? JSON.parse(savedVotes) : {};
    votes[fighterId] = (votes[fighterId] || 0) + 1;
    localStorage.setItem('independenceday-votes', JSON.stringify(votes));
    
    return false; // Indicates fallback was used
  }
};

// Sync localStorage votes to Firebase (for migration)
export const syncLocalVotesToFirebase = async () => {
  try {
    const savedVotes = localStorage.getItem('independenceday-votes');
    if (!savedVotes) return;
    
    const localVotes: Record<string, number> = JSON.parse(savedVotes);
    
    // Upload each vote to Firebase
    for (const [fighterId, count] of Object.entries(localVotes)) {
      if (count > 0) {
        const voteDoc = doc(db, VOTES_COLLECTION, fighterId);
        await setDoc(voteDoc, {
          fighterId,
          count,
          lastUpdated: new Date()
        }, { merge: true }); // Merge with existing data
      }
    }
    
    console.log('Local votes synced to Firebase successfully');
  } catch (error) {
    console.error('Error syncing local votes:', error);
  }
};
