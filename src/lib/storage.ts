import { UserProfile, UserProgress, defaultUserProfile, defaultUserProgress } from './types';

const PROFILE_KEY = 'budgetbites_profile';
const PROGRESS_KEY = 'budgetbites_progress';
const BB_PROFILE_KEY = 'bb_profile';

export interface BBProfile {
  displayName: string;
  photoDataUrl: string | null;
}

const defaultBBProfile: BBProfile = {
  displayName: 'השף הביתי',
  photoDataUrl: null,
};

export const getProfile = (): UserProfile => {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return defaultUserProfile;
};

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getProgress = (): UserProgress => {
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return defaultUserProgress;
};

export const saveProgress = (progress: UserProgress): void => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

export const getBBProfile = (): BBProfile => {
  const stored = localStorage.getItem(BB_PROFILE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return defaultBBProfile;
};

export const saveBBProfile = (profile: BBProfile): void => {
  localStorage.setItem(BB_PROFILE_KEY, JSON.stringify(profile));
};

export const resetAll = (): void => {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(BB_PROFILE_KEY);
};
