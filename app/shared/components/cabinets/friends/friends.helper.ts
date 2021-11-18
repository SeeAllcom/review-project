import { UserInterface } from '../../../helpers/auth-user.helper';

export interface FriendsInterface {
  user: FriendsPageUserInterface;
  friends: FriendsPageResponseData[];
  friends_count: number;
  subscribers: FriendsPageResponseData[];
  subscribers_count: number;
}

export interface FriendsPageUserInterface {
  avatar: string;
  email: string;
  id: number;
  mutual: boolean;
  name: string;
}

export interface FriendsPageResponseData {
  id: number;
  name: string;
  mutual: boolean;
  email: string;
  avatar: string;
  friends_count: number;
  my_account: boolean;
}

export interface FriendsMyFriend {
  id: number;
  name: string;
  email: string;
  avatar: string;
  confirmed_email: boolean;
  privacy_policy: number;
  created_at: string;
  updated_at: string;
  friends_count: number;
  my_account: boolean;
  mutual: boolean;
  pivot: {
    user_id: number;
    friend_id: number;
  };
}

export interface SearchUsers {
  users: FriendsPageResponseData[];
  users_count: number;
}
