import { gql } from "@apollo/client"

// Query to get current user's profile
export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      avatar_url
      badges
      gamesPlayed
      gamesWon
      gamesAsVillager
      gamesAsWerewolf
      friends {
        id
        username
        email
        avatar_url
        badges
        gamesPlayed
        gamesWon
        gamesAsVillager
        gamesAsWerewolf
      }
    }
  }
`

// Query to get a specific user's profile by username
export const GET_USER_PROFILE = gql`
  query GetUserProfile($username: String!) {
    userProfile(username: $username) {
      id
      username
      email
      avatar_url
      badges
      gamesPlayed
      gamesWon
      gamesAsVillager
      gamesAsWerewolf
      friends {
        id
        username
        email
        avatar_url
        badges
        gamesPlayed
        gamesWon
        gamesAsVillager
        gamesAsWerewolf
      }
    }
  }
`

// Query to get all users (for friend suggestions, etc.)
export const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
      id
      username
      email
      avatar_url
      badges
      gamesPlayed
      gamesWon
      gamesAsVillager
      gamesAsWerewolf
    }
  }
`
