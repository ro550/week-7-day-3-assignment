
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

function configureGooglePassport(users) {
  passport.use(
    new GoogleStrategy(
      {
        // Credentials generated in Google Cloud Console.
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,

        // Google sends the user back to this backend URL.
        callbackURL: process.env.GOOGLE_CALLBACK_URL,

        // Enable OAuth state validation using the Express session.
        state: true,
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract the user's Google account information.
          const googleId = profile.id;

          const email = profile.emails?.[0]?.value?.toLowerCase();

          const emailVerified =
            profile._json?.email_verified ??
            profile._json?.verified_email;

          // Only accept accounts with a verified email.
          if (!email || emailVerified !== true) {
            return done(null, false);
          }

          // First, check whether this Google account already exists.
          let user = users.find(
            (item) => item.googleId === googleId
          );

          if (!user) {
            // Check whether this email already belongs to an account.
            user = users.find(
              (item) => item.email.toLowerCase() === email
            );

            if (user) {
              // Link the existing account to this Google account.
              user.googleId = googleId;
            } else {
              // Create a new account for the Google user.
              user = {
                id: Date.now(),
                name: profile.displayName || email.split("@")[0],
                email,
                password: null,
                googleId,
                createdAt: new Date().toISOString(),
              };

              // Save the new user in the existing users array.
              users.push(user);
            }
          }

          // Tell Passport that authentication succeeded.
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

export default configureGooglePassport;
