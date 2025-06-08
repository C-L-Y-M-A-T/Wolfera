# Wolfera - Online Werewolf Game Platform

## Overview

Wolfera is a modern, real-time multiplayer implementation of the classic social deduction game Werewolf (also known as The Werewolves Of Miller's Hollow). Built with a sophisticated tech stack including Next.js, NestJS, and WebSocket technology, Wolfera offers an immersive gaming experience with rich features and smooth gameplay.

## 🎮 Features

### Game Features

- **Multiple Roles**: Support for various classic roles including:
  - Villagers
  - Werewolves
  - Seer
  - Witch
  - More roles can be easily added through the modular role system
- **Day/Night Cycle**: Dynamic game phases with day discussions and night actions
- **Real-time Chat**: In-game communication system
- **Role-specific Actions**: Special abilities for each role
- **Voting System**: Democratic voting system for day phase eliminations

### Technical Features

- **Real-time Updates**: WebSocket-based communication for instant game state updates
- **Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Mobile-friendly user interface
- **Notifications**: In-game notification system for important events
- **GraphQL API**: Modern API implementation with GraphQL
- **Persistent Game State**: Database storage for game progress and user data

## 🛠 Technology Stack

### Backend (API)

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: TypeORM for database operations
- **Authentication**: Passport.js with JWT strategy
- **API**: REST and GraphQL endpoints
- **WebSockets**: Socket.io for real-time communication

### Frontend (UI)

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context and Hooks
- **UI Components**: Custom components with shadcn/ui

### WebSocket UI (ws-ui)

- **Framework**: React
- **Language**: TypeScript
- **Real-time Communication**: WebSocket client implementation
- **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Database (PostgreSQL recommended)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/wolfera.git
cd wolfera
```

2. Install dependencies for all packages:

```bash
# Install API dependencies
cd api
npm install

# Install UI dependencies
cd ../ui
npm install

# Install WebSocket UI dependencies
cd ../ws-ui
npm install
```

3. Configure environment variables:
   Create .env files in both api and ui directories following the .env.example templates.

4. Start the development servers:

For API:

```bash
cd api
npm run start:dev
```

For UI:

```bash
cd ui
npm run dev
```

For WebSocket UI:

```bash
cd ws-ui
npm start
```

## 🏗 Project Structure

### API Structure (/api)

- `/src/auth` - Authentication logic and strategies
- `/src/game` - Core game logic and mechanics
- `/src/roles` - Role-specific implementations
- `/src/socket` - WebSocket handling
- `/src/users` - User management
- `/src/notifications` - Notification system

### UI Structure (/ui)

- `/src/app` - Next.js 13+ app router pages
- `/src/components` - Reusable UI components
- `/src/app-pages` - Page-specific components
- `/src/services` - API integration services
- `/src/hooks` - Custom React hooks

### WebSocket UI Structure (/ws-ui)

- `/src` - React components and game-specific implementations
- Socket connection handling
- Game state management

## 🎲 Game Flow

1. **Game Creation**: Players can create or join game rooms
2. **Role Assignment**: Random role distribution at game start
3. **Day/Night Cycle**:
   - Night: Special roles perform their actions
   - Day: Discussion and voting phase
4. **Win Conditions**: Game continues until either villagers or werewolves achieve victory conditions

## 🔐 Security

- JWT-based authentication
- WebSocket authentication
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure role action validation

## 🎯 Future Enhancements

- Additional roles and abilities
- Custom game mode support
- Spectator mode
- Game replay system
- Achievement system
- Friend system and social features
- Custom room settings

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- The original Werewolf/Mafia game creators
- The open-source community
- All contributors and testers
