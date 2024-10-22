# Earth Facts App

Welcome to the Earth Facts app! This app allows you to generate interesting facts about the Earth and save them for future reference. The app is designed to be simple, user-friendly, and accessible on all devices.

## Features

- **Generate Earth Facts**: Get interesting facts about the Earth generated using AI.
- **Save Facts**: Save the generated facts to your personal collection.
- **View Saved Facts**: View a list of all the facts you have saved.
- **User Authentication**: Securely sign in with ZAPT to access your saved facts.

## User Journeys

### 1. Sign In with ZAPT

**Steps**:

1. Open the Earth Facts app.
2. On the sign-in page, click on the authentication method of your choice (e.g., Magic Link, Google, Facebook, Apple).
3. If using Magic Link, enter your email address and click "Send Magic Link".
4. Check your email and follow the link to sign in.
5. Once signed in, you will be redirected to the home page.

### 2. Generate a New Earth Fact

**Steps**:

1. On the home page, click the "Generate Fact" button.
2. Wait while the app generates a new fact about the Earth.
3. The generated fact will appear in the text area.

### 3. Save the Generated Fact

**Steps**:

1. After generating a fact, click the "Save Fact" button.
2. The fact will be saved to your personal collection.
3. The saved fact will appear in the "Your Saved Facts" section.

### 4. View Your Saved Facts

**Steps**:

1. Scroll down to the "Your Saved Facts" section on the home page.
2. View all the facts you have saved, along with the date and time they were saved.

### 5. Sign Out

**Steps**:

1. Click the "Sign Out" button in the top-right corner of the home page.
2. You will be signed out and redirected to the sign-in page.

## External APIs Used

- **OpenAI ChatGPT**: Used to generate interesting facts about the Earth.
- **Supabase Auth**: Used for user authentication.
- **ZAPT**: Platform for integrating AI functionalities and events in the app.

## Notes

- The app requires an internet connection to generate and save facts.
- All your saved facts are securely stored and associated with your user account.
- The app is designed to be responsive and works on all screen sizes.
