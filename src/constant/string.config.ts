export const AUTH_STRING = {
  SUCCESS: {
    SIGNUP_SUCCESS: 'Signup successful!',
    LOGIN_SUCCESS: 'Login successful!',
  },
  ERROR: {
    USER_ALREADY_TAKEN: 'Username is already taken.',
    INVALID_USERNAME_PASSWORD: 'Invalid username or password.',
    NOT_TOKEN_FOUND: 'No authentication token found',
    INVALID_TOKEN: 'Invalid Token',
  },
};

export const CHAT_STRING = {
  SUCCESS: {
    MEMBER_HAS_BEEN_ADDED_IN_CHAT: 'Member has been added in this chat',
    INVITED_MEMBER_REMOVED: 'Member has been removed from this chat',
    GROUP_MEMBER_FETCHED: 'All member from this chat fetched',
  },
  ERROR: {
    GROUP_NAME_EXISTS: 'Group with this name is already exists',
    CHAT_NOT_FOUND: 'Chat group not found',
    USER_ALREADY_MEMBER: 'User already a member of the group',
    USER_NOT_FOUND: 'User not found',
    MEMBER_NOT_FOUND: 'Member not found',
    CREATOR_NOT_FOUND: 'Creator not found',
  },
};

export const COMMON_ERROR = {
  NOT_AUTHENTICATED: 'Not Authenticated',
};
