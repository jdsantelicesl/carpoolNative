# Welcome to your Expo app 👋
This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

# Todo List:

- [X] maps
- [X] routes
- [X] rides
- [X] messages
- [X] ratings
- [X] profile
- [X] cache
- [X] auth
- [X] add profile bio
- [x] fix rating obj styles on rideGroup
- [X] cleanup before build
- [X] notifications
- [X] add on-demand messages with ~push notifications~ backend polling 
- [X] design details, graphics, icons, animations
- [X] Test on all platforms (IOS)
- [X] deploy


## Predeployment list
- [X] Add bio edit
- [X] fix token expiry parsing
- [x] Make Login page keyboard not overlap on the input fields
- [x] Make clear for .edu only
- [X] When clicked return/enter location, grabs first query in list
- [X] Disable the request to join ride button intermittently (ride group)
- [x] Fix keyboard spacing in Chat
- [ ] ~reviewsObj pop up on pfp click ridePopUp on profile~
- [ ] ~user has ride with another user for a peroid of time, can rate users through profilePopUp.jsx.~
- [x] improve empty messages (no rides, etc)
- [x] improve alert requests
- [ ] ~**Do last** delete all console.log()~

## Debug List
- [x] Add loading animation to prevent spamming buttons. (login)
- [ ] Loading screen when fetch takes too long (user has bad signal) (locFind)
- [X] Clear cache to redirect user to login page if refresh token does not match with token in db. (Signing on different device)
- [ ] Credentials page (part of login) to avoid keyboard overlap on input boxes
- [X] Add mutiple account creation protections to backend. Fixed empty profile bug.
- [X] Convert email to lower on backend
- [X] log out users on bad access token (not refresh), that is not expired
- [ ] fix pfp refresh on all instances

# Features to add
- [x] Confetti animation on post
- [ ] Make rides for multiple days (make day param an array and allow multiple button select)
- [ ] Suggest ride to user if it matches for at least 1 day
- [ ] Auto delete ride after user joins a similar one
- [ ] Auto delete rides after 2 weeks of inactivity

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
